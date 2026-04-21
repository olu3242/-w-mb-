'use client'

import { useEffect } from 'react'

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-16 text-center">
      <h2 className="font-display text-xl font-bold">Something went wrong</h2>
      <p className="text-sm text-foreground/50">{error.message}</p>
      <button onClick={reset} className="rounded-lg bg-pulse px-4 py-2 text-sm font-semibold text-void hover:bg-pulse/90">
        Try again
      </button>
    </div>
  )
}
