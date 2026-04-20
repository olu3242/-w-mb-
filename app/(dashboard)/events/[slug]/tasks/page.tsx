import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

const STATUS_COLS = ['todo', 'in_progress', 'done'] as const

export default async function TasksPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from('events').select('id').eq('slug', slug).single()
  if (!event) notFound()

  const { data: tasks } = await supabase.from('tasks').select('*').eq('event_id', event.id).order('created_at')

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-xl font-bold">Task Board</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {STATUS_COLS.map(col => (
          <div key={col} className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
              {col.replace('_', ' ')}
            </h3>
            {tasks?.filter(t => t.status === col).map(task => (
              <div key={task.id} className="rounded-lg border border-white/5 p-3">
                <p className="text-sm font-medium">{task.title}</p>
                {task.due_date && (
                  <p className="mt-1 text-xs text-foreground/40">{task.due_date}</p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
