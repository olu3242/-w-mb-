'use client'

import { updateTaskStatus } from '@/app/actions/tasks'
import { cn } from '@/lib/utils'

const STATUSES = ['todo', 'in_progress', 'done'] as const
const LABELS: Record<string, string> = { todo: 'To do', in_progress: 'In progress', done: 'Done' }

export function TaskStatusButton({ id, status, slug }: { id: string; status: string; slug: string }) {
  const next = STATUSES[(STATUSES.indexOf(status as typeof STATUSES[number]) + 1) % STATUSES.length]
  return (
    <button
      onClick={() => updateTaskStatus(id, next, slug)}
      className={cn(
        'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        status === 'done' ? 'bg-sage/10 text-sage' : status === 'in_progress' ? 'bg-ocean/10 text-ocean' : 'bg-white/5 text-foreground/40'
      )}
    >
      {LABELS[status]}
    </button>
  )
}
