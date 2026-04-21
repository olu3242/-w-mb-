'use client'

import { useState } from 'react'
import { saveGuestExperienceScore } from '@/app/actions/alice'
import type { GuestExperienceScore } from '@/types'

type Props = { existing: GuestExperienceScore | null; eventId: string; slug: string }

export function AliceGuestScore({ existing, eventId, slug }: Props) {
  const [ac, setAc] = useState(existing?.ac_score ?? 7)
  const [speed, setSpeed] = useState(existing?.service_speed_score ?? 7)
  const [bath, setBath] = useState(existing?.bathroom_score ?? 7)
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(!!existing)

  const overall = (Number(ac) * 0.3 + Number(speed) * 0.4 + Number(bath) * 0.3).toFixed(1)
  const grade = Number(overall) >= 8 ? 'Excellent' : Number(overall) >= 6 ? 'Good' : Number(overall) >= 4 ? 'Fair' : 'Poor'
  const gradeColor = Number(overall) >= 8 ? 'text-sage' : Number(overall) >= 6 ? 'text-ocean' : Number(overall) >= 4 ? 'text-pulse' : 'text-red-400'

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await saveGuestExperienceScore(eventId, slug, Number(ac), Number(speed), Number(bath), notes)
    setSaved(true)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-3xl font-bold font-display ${gradeColor}`}>{overall}<span className="text-base text-foreground/40">/10</span></p>
          <p className={`text-xs font-medium ${gradeColor}`}>{grade}</p>
        </div>
        <p className="text-xs text-foreground/40">Guest Experience Score</p>
      </div>

      {[
        { label: 'AC / Cooling', value: ac, set: setAc, weight: '30%' },
        { label: 'Service Speed', value: speed, set: setSpeed, weight: '40%' },
        { label: 'Bathroom Cleanliness', value: bath, set: setBath, weight: '30%' },
      ].map(({ label, value, set, weight }) => (
        <div key={label}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-foreground/60">{label}</span>
            <span className="text-foreground/40">{weight} weight · <span className="text-pulse font-medium">{value}</span>/10</span>
          </div>
          <input type="range" min="0" max="10" step="0.5" value={value}
            onChange={e => { set(parseFloat(e.target.value)); setSaved(false) }}
            className="w-full accent-pulse" />
        </div>
      ))}

      <textarea placeholder="Notes (optional)" value={notes} onChange={e => { setNotes(e.target.value); setSaved(false) }} rows={2}
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-pulse/60 resize-none" />

      <button type="submit" disabled={loading || saved}
        className="rounded-lg bg-pulse py-2.5 text-sm font-semibold text-void disabled:opacity-50">
        {loading ? 'Saving…' : saved ? 'Saved ✓' : 'Save score'}
      </button>
    </form>
  )
}
