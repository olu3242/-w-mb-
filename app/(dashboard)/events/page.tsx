import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Event } from '@/types'

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Events</h1>
        <Link
          href="/events/new"
          className="rounded-lg bg-pulse px-4 py-2 text-sm font-semibold text-void hover:bg-pulse/90 transition-colors"
        >
          + New event
        </Link>
      </div>
      {!events?.length ? (
        <div className="rounded-xl border border-white/5 p-16 text-center text-foreground/40">
          No events yet.{' '}
          <Link href="/events/new" className="text-pulse hover:underline">Create your first →</Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {events.map(ev => <EventCard key={ev.id} event={ev as unknown as Event} />)}
        </div>
      )}
    </div>
  )
}

function EventCard({ event }: { event: Event }) {
  const signals = event.signals ?? {}
  const active = Object.values(signals).filter(Boolean).length
  return (
    <Link
      href={`/events/${event.slug}`}
      className="flex flex-col gap-3 rounded-xl border border-white/5 p-5 hover:border-pulse/20 hover:bg-white/[0.02] transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold leading-snug">{event.title}</h2>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${event.is_public ? 'bg-sage/10 text-sage' : 'bg-white/5 text-foreground/40'}`}>
          {event.is_public ? 'Public' : 'Private'}
        </span>
      </div>
      {event.event_date && (
        <p className="text-sm text-foreground/50">
          {new Date(event.event_date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
        </p>
      )}
      {event.location && <p className="text-sm text-foreground/40 truncate">{event.location}</p>}
      {active > 0 && (
        <p className="text-xs text-foreground/30">{active} feature{active !== 1 ? 's' : ''} active</p>
      )}
    </Link>
  )
}
