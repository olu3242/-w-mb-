import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { Event, GiftItem } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase
    .from('events')
    .select('title, description')
    .eq('slug', slug)
    .eq('is_public', true)
    .single()

  return {
    title: event ? `${event.title} — Ówàmbẹ̀` : 'Ówàmbẹ̀',
    description: event?.description ?? "You're invited! View the event details and gift registry.",
  }
}

export default async function GuestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('is_public', true)
    .single()

  if (!event) notFound()

  const ev = event as unknown as Event
  const signals = ev.signals ?? {}

  let giftItems: GiftItem[] = []
  if (signals.has_contributions) {
    const { data } = await supabase.from('gift_items').select('*').eq('event_id', ev.id).order('created_at')
    giftItems = (data ?? []) as GiftItem[]
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-foreground/40">You&apos;re invited to</p>
        <h1 className="font-display text-4xl font-bold">{ev.title}</h1>
        {ev.event_date && (
          <p className="text-foreground/60">
            {new Date(ev.event_date).toLocaleDateString('en-US', { dateStyle: 'full' })}
          </p>
        )}
        {ev.location && <p className="text-foreground/50">{ev.location}</p>}
        {ev.description && <p className="mt-2 leading-relaxed text-foreground/70">{ev.description}</p>}
      </div>

      {signals.has_contributions && giftItems.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold">Gift Registry</h2>
          <div className="flex flex-col gap-3">
            {giftItems.map(item => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/5 p-4">
                <div>
                  <p className="font-medium">{item.title}</p>
                  {item.description && <p className="text-sm text-foreground/50">{item.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-pulse">${(item.amount / 100).toFixed(2)}</span>
                  {item.is_funded ? (
                    <span className="rounded-full bg-sage/10 px-3 py-1 text-xs text-sage">Funded</span>
                  ) : (
                    <a
                      href={`/e/${slug}/contribute?item=${item.id}`}
                      className="rounded-lg bg-pulse px-3 py-1.5 text-xs font-semibold text-void hover:bg-pulse/90 transition-colors"
                    >
                      Gift
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
