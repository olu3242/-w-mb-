import { createClient } from '@/lib/supabase/server'
import { getStripeServer } from '@/lib/stripe/client'
import { NextResponse } from 'next/server'

export async function POST() {
  const stripe = getStripeServer()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const account = await stripe.accounts.create({
    type: 'express',
    metadata: { user_id: user.id },
  })

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?connect=refresh`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?connect=success`,
    type: 'account_onboarding',
  })

  return NextResponse.json({ url: accountLink.url })
}

export async function GET(request: Request) {
  const stripe = getStripeServer()
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('event_id')
  if (!eventId) return NextResponse.json({ error: 'Missing event_id' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: event } = await supabase
    .from('events')
    .select('stripe_account_id')
    .eq('id', eventId)
    .eq('owner_id', user.id)
    .single()

  if (!event?.stripe_account_id) return NextResponse.json({ connected: false })

  const account = await stripe.accounts.retrieve(event.stripe_account_id)
  return NextResponse.json({
    connected: account.charges_enabled,
    account_id: account.id,
  })
}
