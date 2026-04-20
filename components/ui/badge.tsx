import { cn } from '@/lib/utils'

type Variant = 'default' | 'pulse' | 'sage' | 'ocean' | 'danger'

const variants: Record<Variant, string> = {
  default: 'bg-white/5 text-foreground/60',
  pulse: 'bg-pulse/10 text-pulse',
  sage: 'bg-sage/10 text-sage',
  ocean: 'bg-ocean/10 text-ocean',
  danger: 'bg-red-500/10 text-red-400',
}

export function Badge({ variant = 'default', className, children }: { variant?: Variant; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
