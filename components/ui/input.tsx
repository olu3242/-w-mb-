import { cn } from '@/lib/utils'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="text-xs font-medium text-foreground/60">{label}</label>}
      <input
        id={inputId}
        {...props}
        className={cn(
          'rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-foreground/30 focus:border-pulse/60',
          error && 'border-red-400/50',
          className
        )}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="text-xs font-medium text-foreground/60">{label}</label>}
      <textarea
        id={inputId}
        {...props}
        className={cn(
          'rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-foreground/30 focus:border-pulse/60 resize-none',
          error && 'border-red-400/50',
          className
        )}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
