'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center bg-void text-foreground">
        <p className="font-mono text-sm text-foreground/30">500</p>
        <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
        <p className="text-foreground/50">{error.message ?? 'An unexpected error occurred.'}</p>
        <button onClick={reset} className="mt-2 rounded-lg bg-pulse px-4 py-2 text-sm font-semibold text-void hover:bg-pulse/90">
          Try again
        </button>
      </body>
    </html>
  )
}
