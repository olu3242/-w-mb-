import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 rounded-xl border border-white/5 p-16 text-center', className)}>
      <p className="font-medium text-foreground/50">{title}</p>
      {description && <p className="text-sm text-foreground/30">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
