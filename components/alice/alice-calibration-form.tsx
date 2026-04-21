'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { calibrateAlice, generateAliceBudget } from '@/app/actions/alice'

type Props = {
  eventId: string
  slug: string
  defaultValues?: {
    guest_count?: number
    style_tier?: string
    location_type?: string
    hero_element?: string
    budget_ceiling?: number | null
    event_month?: number | null
    event_dow?: number | null
    raw_notes?: string | null
  }
}

const STYLE_TIERS = ['intimate', 'standard', 'premium', 'luxury']
const LOCATION_TYPES = ['indoor', 'outdoor', 'hybrid']
const HERO_ELEMENTS = ['food', 'entertainment', 'decor', 'venue', 'photography']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export function AliceCalibrationForm({ eventId, slug, defaultValues }: Props) {
  const [loading, setLoading] = useState(false)
  const [guestCount, setGuestCount] = useState(String(defaultValues?.guest_count ?? 100))
  const [styleTier, setStyleTier] = useState(defaultValues?.style_tier ?? 'standard')
  const [locationType, setLocationType] = useState(defaultValues?.location_type ?? 'indoor')
  const [heroElement, setHeroElement] = useState(defaultValues?.hero_element ?? 'food')
  const [budgetCeiling, setBudgetCeiling] = useState(defaultValues?.budget_ceiling ? String(defaultValues.budget_ceiling / 100) : '')
  const [eventMonth, setEventMonth] = useState(String(defaultValues?.event_month ?? ''))
  const [eventDow, setEventDow] = useState(String(defaultValues?.event_dow ?? ''))
  const [rawNotes, setRawNotes] = useState(defaultValues?.raw_notes ?? '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await calibrateAlice(eventId, {
      guest_count: parseInt(guestCount),
      style_tier: styleTier as 'intimate' | 'standard' | 'premium' | 'luxury',
      location_type: locationType as 'indoor' | 'outdoor' | 'hybrid',
      hero_element: heroElement,
      budget_ceiling: budgetCeiling ? parseFloat(budgetCeiling) * 100 : undefined,
      event_month: eventMonth ? parseInt(eventMonth) : undefined,
      event_dow: eventDow !== '' ? parseInt(eventDow) : undefined,
      raw_notes: rawNotes || undefined,
    })
    await generateAliceBudget(eventId, slug)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Guest count *</label>
          <input type="number" min="1" value={guestCount} onChange={e => setGuestCount(e.target.value)} required
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-pulse/60" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Budget ceiling (₦)</label>
          <input type="number" min="0" step="1000" value={budgetCeiling} onChange={e => setBudgetCeiling(e.target.value)} placeholder="No cap"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-pulse/60" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Style tier</label>
          <select value={styleTier} onChange={e => setStyleTier(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-sm outline-none focus:border-pulse/60 capitalize">
            {STYLE_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Location type</label>
          <select value={locationType} onChange={e => setLocationType(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-sm outline-none focus:border-pulse/60 capitalize">
            {LOCATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Hero element</label>
          <select value={heroElement} onChange={e => setHeroElement(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-sm outline-none focus:border-pulse/60 capitalize">
            {HERO_ELEMENTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Event month</label>
          <select value={eventMonth} onChange={e => setEventMonth(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-sm outline-none focus:border-pulse/60">
            <option value="">Unknown</option>
            {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Day of week</label>
          <select value={eventDow} onChange={e => setEventDow(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-sm outline-none focus:border-pulse/60">
            <option value="">Unknown</option>
            {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground/60">Notes for ALICE</label>
        <textarea value={rawNotes} onChange={e => setRawNotes(e.target.value)} rows={3} placeholder="Any specific requirements, themes, constraints..."
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-pulse/60 resize-none" />
      </div>

      <Button type="submit" loading={loading}>
        {defaultValues ? 'Re-calibrate & regenerate' : 'Calibrate ALICE'}
      </Button>
    </form>
  )
}
