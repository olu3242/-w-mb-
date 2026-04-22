import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { recalcEventFacets } from '@/lib/facets'

export async function POST(req: NextRequest) {
  const { token, vendor_name, vendor_email, facet_name, quote_amount } = await req.json() as {
    token: string
    vendor_name: string
    vendor_email: string
    facet_name: string
    quote_amount?: number
  }

  if (!token || !vendor_name || !vendor_email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Validate token
  const { data: invite } = await admin
    .from('vendor_invites')
    .select('*')
    .eq('token', token)
    .single()

  if (!invite) return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  if (invite.status !== 'pending') {
    return NextResponse.json({ error: `Invite already ${invite.status}` }, { status: 409 })
  }
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Invite expired' }, { status: 410 })
  }

  // Find or create vendor by email
  let vendorId: string

  const { data: existingVendor } = await admin
    .from('vendors')
    .select('id')
    .eq('event_id', invite.event_id)
    .eq('contact', vendor_email)
    .single()

  if (existingVendor) {
    vendorId = existingVendor.id
  } else {
    const { data: newVendor, error: vendorErr } = await admin
      .from('vendors')
      .insert({
        event_id: invite.event_id,
        name: vendor_name,
        category: facet_name || 'general',
        contact: vendor_email,
        status: 'prospect',
      })
      .select('id')
      .single()

    if (vendorErr || !newVendor) {
      return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 })
    }
    vendorId = newVendor.id
  }

  // Upsert event_vendors
  await admin.from('event_vendors').upsert({
    event_id: invite.event_id,
    vendor_id: vendorId,
    invite_id: invite.id,
    facet_name: facet_name || 'general',
    quote_amount: quote_amount ?? null,
    status: 'confirmed',
  }, { onConflict: 'event_id,vendor_id' })

  // Mark invite accepted
  await admin.from('vendor_invites').update({
    status: 'accepted',
    vendor_id: vendorId,
    accepted_at: new Date().toISOString(),
  }).eq('id', invite.id)

  // Sync facets if quote provided
  if (quote_amount != null) {
    await recalcEventFacets(admin, invite.event_id)
  }

  return NextResponse.json({ success: true, vendor_id: vendorId })
}
