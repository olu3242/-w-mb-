import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateEvent, deleteEvent } from '@/app/actions/events'
import { Button } from '@/components/ui/button'
import type { Event, EventSignals } from '@/types'

const SIGNALS: { key: string; label: string }[] = [
  { key: 'has_contributions', label: 'Gift registry & contributions' },
  { key: 'has_venue', label: 'Venue tools' },
  { key: 'has_vendors', label: 'Vendor hub' },
  { key: 'has_tasks', label: 'Task board' },
  { key: 'has_timeline', label: 'Execution timeline' },
  { key: 'has_budget_profile', label: 'Budget engine' },
]

export default async function EditEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('owner_id', user!.id)
    .single()

  if (!event) notFound()

  const ev = event as unknown as Event
  const signals = (ev.signals ?? {}) as EventSignals

  const localDate = ev.event_date
    ? new Date(ev.event_date).toISOString().slice(0, 16)
    : ''

  return (
    <div className="mx-auto max-w-lg flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Edit event</h1>
        <form action={deleteEvent.bind(null, slug)}>
          <Button type="submit" variant="danger" size="sm">Delete event</Button>
        </form>
      </div>

      <form action={updateEvent.bind(null, slug)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Event name *</label>
          <input name="title" defaultValue={ev.title} required
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-pulse/60" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Description</label>
          <textarea name="description" defaultValue={ev.description ?? ''} rows={3}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-pulse/60 resize-none" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Date & time</label>
          <input name="event_date" type="datetime-local" defaultValue={localDate}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-pulse/60" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Location</label>
          <input name="location" defaultValue={ev.location ?? ''}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-pulse/60" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-foreground/60">Features</p>
          {SIGNALS.map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/5 p-3 hover:border-white/10">
              <input type="checkbox" name={key} defaultChecked={!!signals[key]} className="accent-pulse" />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input type="checkbox" name="is_public" defaultChecked={ev.is_public} className="accent-pulse" />
          <span className="text-sm">Public guest page</span>
        </label>

        <Button type="submit" className="w-full">Save changes</Button>
      </form>
    </div>
  )
}
