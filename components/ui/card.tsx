import { cn } from '@/lib/utils'

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn('rounded-xl border border-white/5 bg-white/[0.02] p-5', className)}>
      {children}
    </div>
  )
}
