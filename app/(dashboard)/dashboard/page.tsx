import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: events } = await supabase
    .from('events')
    .select('id, title, event_date, slug, signals')
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <Link
          href="/events/new"
          className="rounded-lg bg-pulse px-4 py-2 text-sm font-semibold text-void hover:bg-pulse/90 transition-colors"
        >
          + New event
        </Link>
      </div>
      <section>
        <h2 className="mb-4 text-sm font-medium text-foreground/50 uppercase tracking-wider">Recent events</h2>
        {!events?.length ? (
          <div className="rounded-xl border border-white/5 p-12 text-center text-foreground/40">
            No events yet.{' '}
            <Link href="/events/new" className="text-pulse hover:underline">Create one →</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {events.map(ev => (
              <Link
                key={ev.id}
                href={`/events/${ev.slug}`}
                className="flex items-center justify-between rounded-xl border border-white/5 p-4 hover:border-pulse/20 hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-medium">{ev.title}</span>
                {ev.event_date && (
                  <span className="text-sm text-foreground/40">
                    {new Date(ev.event_date).toLocaleDateString()}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
