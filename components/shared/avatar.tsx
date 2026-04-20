import { cn } from '@/lib/utils'

type AvatarProps = {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-12 w-12 text-base' }

function initials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <div className={cn('inline-flex shrink-0 items-center justify-center rounded-full bg-pulse/20 font-semibold text-pulse', sizes[size], className)}>
      {src ? (
        <img src={src} alt={name} className="h-full w-full rounded-full object-cover" />
      ) : (
        initials(name)
      )}
    </div>
  )
}
