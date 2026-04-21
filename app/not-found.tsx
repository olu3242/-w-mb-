import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="font-mono text-sm text-foreground/30">404</p>
      <h1 className="font-display text-2xl font-bold">Page not found</h1>
      <p className="text-foreground/50">This page doesn&apos;t exist or was moved.</p>
      <Link href="/dashboard" className="mt-2 text-sm text-pulse hover:underline">
        Go to dashboard →
      </Link>
    </main>
  )
}
