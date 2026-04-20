import { cn } from '@/lib/utils'

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  options: { value: string; label: string }[]
  error?: string
}

export function Select({ label, options, error, className, id, ...props }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={selectId} className="text-xs font-medium text-foreground/60">{label}</label>}
      <select
        id={selectId}
        {...props}
        className={cn(
          'rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-sm outline-none transition-colors focus:border-pulse/60',
          error && 'border-red-400/50',
          className
        )}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
