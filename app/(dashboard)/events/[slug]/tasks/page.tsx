import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { addTask, deleteTask } from '@/app/actions/tasks'
import { TaskStatusButton } from '@/components/events/task-status-button'
import { Button } from '@/components/ui/button'

const COLS = ['todo', 'in_progress', 'done'] as const
const COL_LABELS: Record<string, string> = { todo: 'To do', in_progress: 'In progress', done: 'Done' }

export default async function TasksPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from('events').select('id').eq('slug', slug).single()
  if (!event) notFound()

  const { data: tasks } = await supabase.from('tasks').select('*').eq('event_id', event.id).order('created_at')

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-xl font-bold">Task Board</h2>

      <form action={addTask} className="flex flex-wrap gap-3 rounded-xl border border-white/5 p-4">
        <input type="hidden" name="event_id" value={event.id} />
        <input type="hidden" name="slug" value={slug} />
        <input name="title" placeholder="Task title *" required className="flex-1 min-w-48 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-pulse/60" />
        <input name="due_date" type="date" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-pulse/60" />
        <Button type="submit" size="sm">Add task</Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-3">
        {COLS.map(col => (
          <div key={col} className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/40">{COL_LABELS[col]}</h3>
            {tasks?.filter(t => t.status === col).map(task => (
              <div key={task.id} className="rounded-lg border border-white/5 p-3 flex flex-col gap-2">
                <p className="text-sm font-medium">{task.title}</p>
                {task.due_date && <p className="text-xs text-foreground/40">{task.due_date}</p>}
                <div className="flex items-center justify-between">
                  <TaskStatusButton id={task.id} status={task.status} slug={slug} />
                  <form action={deleteTask.bind(null, task.id, slug)}>
                    <button type="submit" className="text-xs text-foreground/30 hover:text-red-400 transition-colors">remove</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
