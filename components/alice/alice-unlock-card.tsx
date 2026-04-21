'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function AliceUnlockCard({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleUnlock() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/alice-unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: eventId }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong')
      setLoading(false)
      return
    }
    window.location.href = data.authorization_url
  }

  return (
    <div className="rounded-xl border border-pulse/20 bg-pulse/5 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-display font-semibold text-pulse">Unlock ALICE</p>
        <p className="mt-1 text-sm text-foreground/60">
          AI-powered event planning — budget engine, vendor matching, real-time monitoring.
        </p>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>
      <Button onClick={handleUnlock} loading={loading} className="shrink-0">
        Unlock — ₦50,000
      </Button>
    </div>
  )
}
