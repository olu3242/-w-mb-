import { createClient } from '@/lib/supabase/server'
import { verifyPaystackSignature } from '@/lib/paystack/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-paystack-signature') ?? ''

  if (!verifyPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const supabase = await createClient()

  if (payload.event === 'charge.success') {
    const ref: string = payload.data.reference

    if (ref.startsWith('OWAMBE-ALICE-')) {
      // Reference format: OWAMBE-ALICE-{uuid5segments}-{timestamp}
      // UUID v4 has 5 dash-separated segments → parts[2..6]
      const parts = ref.split('-')
      const eventId = parts.slice(2, 7).join('-')

      await supabase
        .from('events')
        .update({
          alice_unlocked: true,
          alice_paid_at: new Date().toISOString(),
          alice_payment_ref: ref,
        })
        .eq('id', eventId)

      await supabase.from('system_events').insert({
        event_id: eventId,
        event_type: 'alice.unlocked',
        payload: { reference: ref, amount: payload.data.amount },
      })
    } else {
      await supabase
        .from('contributions')
        .update({ status: 'succeeded' })
        .eq('paystack_reference', ref)
    }
  }

  if (payload.event === 'charge.failed') {
    const ref: string = payload.data.reference
    if (!ref.startsWith('OWAMBE-ALICE-')) {
      await supabase
        .from('contributions')
        .update({ status: 'failed' })
        .eq('paystack_reference', ref)
    }
  }

  if (payload.event === 'transfer.success') {
    await supabase.from('system_events').insert({
      event_type: 'transfer.success',
      payload: payload.data,
    })
  }

  return NextResponse.json({ ok: true })
}
