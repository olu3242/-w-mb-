import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ContributionForm } from '@/components/gifts/contribution-form'

export default async function ContributePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ item?: string }>
}) {
  const { slug } = await params
  const { item: itemId } = await searchParams

  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('id, title, is_public')
    .eq('slug', slug)
    .eq('is_public', true)
    .single()

  if (!event) notFound()

  let giftItem: { id: string; title: string; amount: number } | null = null
  if (itemId) {
    const { data } = await supabase
      .from('gift_items')
      .select('id, title, amount')
      .eq('id', itemId)
      .eq('event_id', event.id)
      .eq('is_funded', false)
      .single()
    giftItem = data
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div className="mb-8">
        <p className="text-sm text-foreground/40">Contributing to</p>
        <h1 className="font-display text-2xl font-bold">{event.title}</h1>
      </div>
      <ContributionForm
        eventId={event.id}
        giftItemId={giftItem?.id}
        giftTitle={giftItem?.title}
        suggestedAmount={giftItem?.amount}
      />
    </main>
  )
}
