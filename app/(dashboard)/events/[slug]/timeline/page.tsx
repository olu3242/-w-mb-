import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { addTimelineItem, updateTimelineStatus, deleteTimelineItem } from '@/app/actions/timeline'
import { Button } from '@/components/ui/button'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-white/5 text-foreground/40',
  in_progress: 'bg-pulse/10 text-pulse',
  done: 'bg-sage/10 text-sage',
}

const inp = 'rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-pulse/60 w-full'

export default async function TimelinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: event } = await supabase
    .from('events')
    .select('id, title')
    .eq('slug', slug)
    .eq('owner_id', user!.id)
    .single()

  if (!event) notFound()

  const { data: items } = await supabase
    .from('timeline_items')
    .select('*')
    .eq('event_id', event.id)
    .order('sort_order')

  const done = items?.filter(i => i.status === 'done').length ?? 0
  const total = items?.length ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Execution Timeline</h2>
        {total > 0 && (
          <span className="text-xs text-foreground/40">{done}/{total} complete</span>
        )}
      </div>

      {total > 0 && (
        <div className="h-1.5 rounded-full bg-white/5">
          <div className="h-full rounded-full bg-sage/60 transition-all" style={{ width: `${(done / total) * 100}%` }} />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {items?.map((item, idx) => (
          <div key={item.id} className="flex items-start gap-4 rounded-xl border border-white/5 p-4">
            <div className="shrink-0 text-center">
              <p className="text-xs font-mono text-foreground/40">{item.scheduled_time}</p>
              <p className="text-xs text-foreground/20 mt-0.5">#{idx + 1}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{item.title}</p>
              {item.responsible && <p className="text-xs text-foreground/40 mt-0.5">→ {item.responsible}</p>}
              {item.notes && <p className="text-xs text-foreground/30 mt-1">{item.notes}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <form action={updateTimelineStatus.bind(null, item.id, slug,
                item.status === 'pending' ? 'in_progress' : item.status === 'in_progress' ? 'done' : 'pending')}>
                <button type="submit" className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${STATUS_STYLES[item.status]}`}>
                  {item.status.replace('_', ' ')}
                </button>
              </form>
              <form action={deleteTimelineItem.bind(null, item.id, slug)}>
                <button type="submit" className="text-xs text-foreground/20 hover:text-red-400 transition-colors">✕</button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {total === 0 && (
        <div className="rounded-xl border border-white/5 p-8 text-center">
          <p className="text-sm text-foreground/40">No timeline items yet. Add your first milestone below.</p>
        </div>
      )}

      <details className="rounded-xl border border-white/5">
        <summary className="cursor-pointer p-4 text-sm font-medium text-foreground/60 hover:text-foreground">
          + Add milestone
        </summary>
        <form action={addTimelineItem.bind(null, event.id, slug)} className="border-t border-white/5 p-4 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/60">Time *</label>
              <input name="scheduled_time" required placeholder="e.g. 14:00 or T-30min" className={inp} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/60">Milestone *</label>
              <input name="title" required placeholder="e.g. Guests seated, food service begins" className={inp} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/60">Responsible</label>
              <input name="responsible" placeholder="Name or role" className={inp} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/60">Notes</label>
              <input name="notes" placeholder="Any details" className={inp} />
            </div>
          </div>
          <Button type="submit">Add to timeline</Button>
        </form>
      </details>
    </div>
  )
}
