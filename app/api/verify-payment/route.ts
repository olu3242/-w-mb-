import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyTransaction } from '@/lib/paystack/client'
import { stripe } from '@/lib/stripe/client'
import { recalcEventFacets } from '@/lib/facets'

export async function POST(req: NextRequest) {
  const { reference, provider, event_id } = await req.json() as {
    reference: string
    provider: 'paystack' | 'stripe'
    event_id: string
  }

  if (!reference || !provider || !event_id) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = await createClient()
  const admin = createAdminClient()

  // Auth check — caller must own the event
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: event } = await supabase
    .from('events').select('id').eq('id', event_id).eq('owner_id', user.id).single()
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  // Idempotency: return early if already verified
  const { data: existing } = await admin
    .from('payments').select('id, status, amount').eq('reference', reference).single()

  if (existing?.status === 'verified') {
    return NextResponse.json({ status: 'verified', amount: existing.amount, cached: true })
  }

  // Verify with provider
  let success = false
  let amountNgn = 0

  try {
    if (provider === 'paystack') {
      const result = await verifyTransaction(reference)
      success = result.success
      amountNgn = result.amountNgn
    } else {
      const pi = await stripe.paymentIntents.retrieve(reference)
      success = pi.status === 'succeeded'
      amountNgn = pi.amount / 100
    }
  } catch {
    return NextResponse.json({ error: 'Provider verification failed' }, { status: 502 })
  }

  const status = success ? 'verified' : 'failed'

  if (existing) {
    await admin.from('payments').update({ status, verified: success, amount: amountNgn }).eq('id', existing.id)
  } else {
    await admin.from('payments').insert({
      event_id,
      reference,
      provider,
      amount: amountNgn,
      status,
      verified: success,
    })
  }

  if (success) {
    await recalcEventFacets(admin, event_id)
  }

  return NextResponse.json({ status, amount: amountNgn })
}
