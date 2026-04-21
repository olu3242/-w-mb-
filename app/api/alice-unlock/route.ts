import { createClient } from '@/lib/supabase/server'
import { initializeTransaction, PAYSTACK_CHANNELS } from '@/lib/paystack/client'
import { NextResponse } from 'next/server'

const ALICE_FEE = parseInt(process.env.ALICE_FEE_KOBO ?? '5000000', 10)

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const eventId: string = body.event_id
  if (!eventId) return NextResponse.json({ error: 'Missing event_id' }, { status: 400 })

  const { data: event } = await supabase
    .from('events')
    .select('id, slug, title, alice_unlocked')
    .eq('id', eventId)
    .eq('owner_id', user.id)
    .single()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  if (event.alice_unlocked) return NextResponse.json({ error: 'Already unlocked' }, { status: 409 })

  const reference = `OWAMBE-ALICE-${eventId}-${Date.now()}`

  const result = await initializeTransaction({
    email: user.email!,
    amount: ALICE_FEE,
    reference,
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${event.slug}?alice=success`,
    channels: [...PAYSTACK_CHANNELS],
    metadata: { event_id: eventId, event_title: event.title, user_id: user.id },
  })

  if (!result.status) return NextResponse.json({ error: result.message }, { status: 400 })

  return NextResponse.json({ authorization_url: result.data.authorization_url })
}
