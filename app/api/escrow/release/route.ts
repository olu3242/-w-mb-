import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { allocation_id, action } = await req.json() as {
    allocation_id: string
    action: 'approve' | 'cancel'
  }

  if (!allocation_id || !action) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  // Verify caller owns the event tied to this allocation
  const { data: alloc } = await admin
    .from('vendor_allocations').select('event_id').eq('id', allocation_id).single()
  if (!alloc) return NextResponse.json({ error: 'Allocation not found' }, { status: 404 })

  const { data: ev } = await supabase
    .from('events').select('id').eq('id', alloc.event_id).eq('owner_id', user.id).single()
  if (!ev) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const fn = action === 'approve' ? 'approve_allocation' : 'cancel_allocation'
  const { data, error } = await admin.rpc(fn, { p_allocation_id: allocation_id })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json(data)
}
