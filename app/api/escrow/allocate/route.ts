import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { event_id, vendor_id, amount, facet_name, event_vendor_id, notes } =
    await req.json() as {
      event_id: string
      vendor_id: string
      amount: number
      facet_name: string
      event_vendor_id?: string
      notes?: string
    }

  if (!event_id || !vendor_id || !amount || !facet_name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (amount <= 0) {
    return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: event } = await supabase
    .from('events').select('id').eq('id', event_id).eq('owner_id', user.id).single()
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const admin = createAdminClient()
  const { data, error } = await admin.rpc('allocate_escrow', {
    p_event_id: event_id,
    p_vendor_id: vendor_id,
    p_amount: amount,
    p_facet_name: facet_name,
    p_event_vendor_id: event_vendor_id ?? null,
    p_notes: notes ?? null,
  })

  if (error) {
    const msg = error.message ?? 'Allocation failed'
    const status = msg.includes('Insufficient') ? 422 : msg.includes('frozen') ? 409 : 500
    return NextResponse.json({ error: msg }, { status })
  }

  return NextResponse.json(data)
}
