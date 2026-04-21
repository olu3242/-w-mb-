'use client'

import { useState } from 'react'
import { submitVendorScorecard } from '@/app/actions/alice'
import type { Vendor } from '@/types'

type Props = { vendors: Vendor[]; eventId: string; slug: string }

export function AliceVendorScorecard({ vendors, eventId, slug }: Props) {
  const [scores, setScores] = useState<Record<string, { p: number; q: number; notes: string }>>({})
  const [submitted, setSubmitted] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState<string | null>(null)

  function setScore(vendorId: string, field: 'p' | 'q', val: number) {
    setScores(prev => {
      const cur = prev[vendorId] ?? { p: 5, q: 5, notes: '' }
      return { ...prev, [vendorId]: { ...cur, [field]: val } }
    })
  }

  async function handleSubmit(vendorId: string) {
    const s = scores[vendorId] ?? { p: 5, q: 5, notes: '' }
    setLoading(vendorId)
    await submitVendorScorecard(vendorId, eventId, slug, s.p, s.q, s.notes)
    setSubmitted(prev => new Set(prev).add(vendorId))
    setLoading(null)
  }

  return (
    <div className="flex flex-col gap-3">
      {vendors.map(vendor => {
        const s = scores[vendor.id] ?? { p: 5, q: 5, notes: '' }
        const done = submitted.has(vendor.id)
        const reliability = ((s.p * 0.6) + (s.q * 0.4)).toFixed(1)

        return (
          <div key={vendor.id} className={`rounded-lg border p-4 ${done ? 'border-sage/20 bg-sage/5' : 'border-white/5'}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium">{vendor.name}</p>
                <p className="text-xs text-foreground/40 capitalize">{vendor.category}</p>
              </div>
              {!done && (
                <span className="text-xs text-ocean/70">
                  Score: {reliability}/10
                </span>
              )}
              {done && <span className="text-xs text-sage">Saved ✓</span>}
            </div>

            {!done && (
              <div className="flex flex-col gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-foreground/50">Punctuality (×0.6)</label>
                    <input type="range" min="0" max="10" step="0.5" value={s.p}
                      onChange={e => setScore(vendor.id, 'p', parseFloat(e.target.value))}
                      className="w-full accent-pulse" />
                    <div className="flex justify-between text-xs text-foreground/40"><span>0</span><span className="text-pulse font-medium">{s.p}</span><span>10</span></div>
                  </div>
                  <div>
                    <label className="text-xs text-foreground/50">Quality (×0.4)</label>
                    <input type="range" min="0" max="10" step="0.5" value={s.q}
                      onChange={e => setScore(vendor.id, 'q', parseFloat(e.target.value))}
                      className="w-full accent-pulse" />
                    <div className="flex justify-between text-xs text-foreground/40"><span>0</span><span className="text-pulse font-medium">{s.q}</span><span>10</span></div>
                  </div>
                </div>
                <input placeholder="Notes (optional)"
                  value={s.notes}
                  onChange={e => setScores(prev => ({ ...prev, [vendor.id]: { ...s, notes: e.target.value } }))}
                  className="rounded border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
                <button onClick={() => handleSubmit(vendor.id)} disabled={loading === vendor.id}
                  className="rounded bg-pulse/10 py-2 text-sm font-medium text-pulse hover:bg-pulse/20 disabled:opacity-50">
                  {loading === vendor.id ? 'Saving…' : 'Submit score'}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
