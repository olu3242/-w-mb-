'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'

type ContributionFormProps = {
  eventId: string
  giftItemId?: string
  giftTitle?: string
  suggestedAmount?: number
  onSuccess?: () => void
}

export function ContributionForm({ eventId, giftItemId, giftTitle, suggestedAmount, onSuccess }: ContributionFormProps) {
  const [amount, setAmount] = useState(suggestedAmount ? String(suggestedAmount / 100) : '')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/contributions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: eventId,
        gift_item_id: giftItemId,
        amount: Math.round(parseFloat(amount) * 100),
        contributor_name: name,
        contributor_email: email,
        message: message || undefined,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong')
      setLoading(false)
      return
    }

    setDone(true)
    onSuccess?.()
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="text-3xl">🎉</div>
        <p className="font-semibold">Gift sent!</p>
        <p className="text-sm text-foreground/50">Thank you for your contribution.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {giftTitle && (
        <div className="rounded-lg bg-pulse/5 border border-pulse/20 px-4 py-3">
          <p className="text-xs text-foreground/50">Contributing to</p>
          <p className="font-medium text-pulse">{giftTitle}</p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground/60">Amount (USD) *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground/40">$</span>
          <input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            placeholder="0.00"
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-7 pr-4 text-sm outline-none focus:border-pulse/60"
          />
        </div>
      </div>

      <Input label="Your name *" value={name} onChange={e => setName(e.target.value)} required placeholder="Jane Doe" />
      <Input label="Email *" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="jane@example.com" />
      <Textarea label="Message (optional)" value={message} onChange={e => setMessage(e.target.value)} placeholder="Wishing you all the best!" rows={2} />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <p className="text-xs text-foreground/30">
        {amount && parseFloat(amount) > 0
          ? `You'll be charged ${formatCurrency(Math.round(parseFloat(amount) * 100))}`
          : 'Secure payment via Stripe'}
      </p>

      <Button type="submit" loading={loading} className="w-full">
        Send gift
      </Button>
    </form>
  )
}
