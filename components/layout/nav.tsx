import Link from 'next/link'

export function TopNav() {
  return (
    <header className="flex items-center justify-between border-b border-white/5 px-6 py-4 lg:hidden">
      <Link href="/dashboard" className="font-display font-bold text-pulse">Ówàmbẹ̀</Link>
    </header>
  )
}
