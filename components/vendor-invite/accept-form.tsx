'use client'

import { useState } from 'react'

type Invite = {
  id: string
  email: string
  name: string | null
  facet_name?: string
  event_title: string
  event_date?: string | null
}

const FACETS = ['catering','venue','decor','media','entertainment','security','souvenirs','admin']

export function AcceptInviteForm({ invite, token }: { invite: Invite; token: string }) {
  const [name, setName] = useState(invite.name ?? '')
  const [email] = useState(invite.email)
  const [facet, setFacet] = useState(invite.facet_name ?? '')
  const [quote, setQuote] = useState('')
  const [step, setStep] = useState<'form' | 'done' | 'error'>('form')
  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrMsg('')

    const res = await fetch('/api/vendor/accept-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        vendor_name: name,
        vendor_email: email,
        facet_name: facet,
        quote_amount: quote ? parseFloat(quote) : undefined,
      }),
    })

    const data = await res.json() as { success?: boolean; error?: string }
    setLoading(false)

    if (data.success) {
      setStep('done')
    } else {
      setErrMsg(data.error ?? 'Something went wrong')
      setStep('error')
    }
  }

  if (step === 'done') {
    return (
      <div className="rounded-xl border border-sage/30 bg-sage/5 p-6 text-center">
        <p className="text-2xl mb-2">✓</p>
        <p className="font-semibold text-sage">Invite accepted!</p>
        <p className="mt-1 text-sm text-foreground/60">The event host will be in touch to confirm next steps.</p>
      </div>
    )
  }

  const inp = 'rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-pulse/60 w-full'
  const sel = 'rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-sm outline-none focus:border-pulse/60 w-full capitalize'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground/60">Your name *</label>
        <input value={name} onChange={e => setName(e.target.value)} required className={inp} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground/60">Email</label>
        <input value={email} disabled className={`${inp} opacity-50`} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground/60">Service category *</label>
        <select value={facet} onChange={e => setFacet(e.target.value)} required className={sel}>
          <option value="">Select category</option>
          {FACETS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground/60">Your quote (₦, optional)</label>
        <input type="number" min="0" step="1000" value={quote} onChange={e => setQuote(e.target.value)}
          placeholder="Leave blank to submit later" className={inp} />
      </div>

      {step === 'error' && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">{errMsg}</p>
      )}

      <button type="submit" disabled={loading}
        className="rounded-lg bg-pulse py-3 font-semibold text-void hover:bg-pulse/90 transition-colors disabled:opacity-50">
        {loading ? 'Accepting…' : 'Accept invite'}
      </button>
    </form>
  )
}
