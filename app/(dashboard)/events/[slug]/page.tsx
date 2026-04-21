import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AliceUnlockCard } from '@/components/alice/alice-unlock-card'
import type { Event } from '@/types'

const TABS = [
  { href: '', label: 'Overview' },
  { href: '/gifts', label: 'Gifts', signal: 'has_contributions' },
  { href: '/tasks', label: 'Tasks', signal: 'has_tasks' },
  { href: '/budget', label: 'Budget', signal: 'has_budget_profile' },
  { href: '/vendors', label: 'Vendors', signal: 'has_vendors' },
  { href: '/venue', label: 'Venue', signal: 'has_venue' },
  { href: '/timeline', label: 'Timeline', signal: 'has_timeline' },
  { href: '/alice', label: '🧠 ALICE', aliceOnly: true },
]

export default async function EventHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!event) notFound()

  const ev = event as unknown as Event
  const signals = ev.signals ?? {}
  const base = `/events/${slug}`

  const visibleTabs = TABS.filter(t => {
    if (t.aliceOnly) return ev.alice_unlocked
    if (t.signal) return !!signals[t.signal as keyof typeof signals]
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">{ev.title}</h1>
          {ev.event_date && (
            <p className="mt-1 text-sm text-foreground/50">
              {new Date(ev.event_date).toLocaleDateString('en-US', { dateStyle: 'full' })}
            </p>
          )}
          {ev.location && <p className="text-sm text-foreground/40">{ev.location}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {ev.is_public && (
            <Link
              href={`/e/${slug}`}
              className="rounded-lg border border-ocean/30 px-3 py-1.5 text-xs text-ocean hover:bg-ocean/10 transition-colors"
            >
              Guest page →
            </Link>
          )}
          <Link
            href={`/events/${slug}/edit`}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-foreground/50 hover:border-white/20 hover:text-foreground transition-colors"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="flex gap-1 border-b border-white/5">
        {visibleTabs.map(t => (
          <Link
            key={t.href}
            href={`${base}${t.href}`}
            className="px-4 py-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors"
          >
            {t.label}
          </Link>
        ))}
      </div>

      {ev.description && (
        <p className="max-w-2xl text-foreground/70 leading-relaxed">{ev.description}</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(signals)
          .filter(([, v]) => v)
          .map(([key]) => (
            <div key={key} className="rounded-lg border border-sage/20 bg-sage/5 px-4 py-3">
              <span className="text-xs font-medium text-sage">{key.replace('has_', '').replace(/_/g, ' ')}</span>
            </div>
          ))}
      </div>

      {!ev.alice_unlocked && (
        <AliceUnlockCard eventId={ev.id} />
      )}
    </div>
  )
}
