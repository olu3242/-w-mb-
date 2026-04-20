import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { EventCard } from '@/components/events/event-card'
import { EmptyState } from '@/components/shared/empty-state'
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
        <EmptyState
          title="No events yet"
          description="Create your first event to get started."
          action={<Link href="/events/new" className="text-sm text-pulse hover:underline">Create your first →</Link>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {events.map(ev => <EventCard key={ev.id} event={ev as unknown as Event} />)}
        </div>
      )}
    </div>
  )
}
