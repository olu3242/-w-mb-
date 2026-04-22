import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { recalcEventFacets } from '@/lib/facets'

export async function POST(req: NextRequest) {
  const { token, quote_amount } = await req.json() as {
    token: string
    quote_amount: number
  }

  if (!token || quote_amount == null) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Validate token → accepted invite
  const { data: invite } = await admin
    .from('vendor_invites')
    .select('id, event_id, vendor_id, status, expires_at')
    .eq('token', token)
    .single()

  if (!invite) return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  if (invite.status !== 'accepted') {
    return NextResponse.json({ error: 'Accept invite before submitting quote' }, { status: 409 })
  }
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Invite expired' }, { status: 410 })
  }
  if (!invite.vendor_id) {
    return NextResponse.json({ error: 'No vendor linked to invite' }, { status: 400 })
  }

  await admin
    .from('event_vendors')
    .update({ quote_amount, status: 'confirmed' })
    .eq('event_id', invite.event_id)
    .eq('vendor_id', invite.vendor_id)

  await recalcEventFacets(admin, invite.event_id)

  return NextResponse.json({ success: true })
}
