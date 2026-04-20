import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="font-display text-5xl font-bold text-pulse">Ówàmbẹ̀</h1>
      <p className="text-lg text-foreground/70">Give. Plan. Celebrate.</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-lg border border-pulse/40 px-6 py-3 text-pulse hover:bg-pulse/10 transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-pulse px-6 py-3 font-semibold text-void hover:bg-pulse/90 transition-colors"
        >
          Get started
        </Link>
      </div>
    </main>
  )
}
