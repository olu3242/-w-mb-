'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard', label: 'Home' },
  { href: '/events', label: 'Events' },
]

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="flex items-center justify-around border-t border-white/5 bg-void py-3 lg:hidden">
      {nav.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'px-6 py-1 text-sm font-medium',
            pathname === href ? 'text-pulse' : 'text-foreground/50'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
