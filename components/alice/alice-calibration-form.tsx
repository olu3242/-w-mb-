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
    location_area?: string
    event_type?: string
    face_priority?: boolean
    hero_element?: string
    budget_ceiling?: number | null
    event_month?: number | null
    event_dow?: number | null
    raw_notes?: string | null
  }
}

const STYLE_TIERS = ['intimate', 'standard', 'premium', 'luxury']
const LOCATION_TYPES = ['indoor', 'outdoor', 'hybrid']
const LOCATION_AREAS = [
  { value: 'premium', label: 'Premium (Lekki, VI, Maitama, Asokoro) ×1.8' },
  { value: 'urban', label: 'Urban (Lagos Mainland, Abuja FCT) ×1.3' },
  { value: 'state_capital', label: 'State Capital ×1.0' },
  { value: 'other', label: 'Other ×0.85' },
]
const EVENT_TYPES = ['wedding', 'funeral', 'birthday', 'corporate', 'naming', 'party']
const HERO_ELEMENTS = ['catering', 'venue', 'decor', 'media', 'entertainment', 'security']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export function AliceCalibrationForm({ eventId, slug, defaultValues }: Props) {
  const [loading, setLoading] = useState(false)
  const [guestCount, setGuestCount] = useState(String(defaultValues?.guest_count ?? 100))
  const [styleTier, setStyleTier] = useState(defaultValues?.style_tier ?? 'standard')
  const [locationType, setLocationType] = useState(defaultValues?.location_type ?? 'indoor')
  const [locationArea, setLocationArea] = useState(defaultValues?.location_area ?? 'state_capital')
  const [eventType, setEventType] = useState(defaultValues?.event_type ?? 'party')
  const [facePriority, setFacePriority] = useState(defaultValues?.face_priority ?? false)
  const [heroElement, setHeroElement] = useState(defaultValues?.hero_element ?? 'catering')
  const [budgetCeiling, setBudgetCeiling] = useState(defaultValues?.budget_ceiling ? String(defaultValues.budget_ceiling) : '')
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
      location_area: locationArea as 'premium' | 'urban' | 'state_capital' | 'other',
      event_type: eventType as 'wedding' | 'funeral' | 'birthday' | 'corporate' | 'naming' | 'party',
      face_priority: facePriority,
      hero_element: heroElement,
      budget_ceiling: budgetCeiling ? parseFloat(budgetCeiling) : undefined,
      event_month: eventMonth ? parseInt(eventMonth) : undefined,
      event_dow: eventDow !== '' ? parseInt(eventDow) : undefined,
      raw_notes: rawNotes || undefined,
    })
    await generateAliceBudget(eventId, slug)
    setLoading(false)
  }

  const sel = 'rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-sm outline-none focus:border-pulse/60 capitalize'
  const inp = 'rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-pulse/60'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Guest count *</label>
          <input type="number" min="1" value={guestCount} onChange={e => setGuestCount(e.target.value)} required className={inp} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Budget ceiling (₦)</label>
          <input type="number" min="0" step="1000" value={budgetCeiling} onChange={e => setBudgetCeiling(e.target.value)} placeholder="No cap" className={inp} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Style tier</label>
          <select value={styleTier} onChange={e => setStyleTier(e.target.value)} className={sel}>
            {STYLE_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Event type</label>
          <select value={eventType} onChange={e => setEventType(e.target.value)} className={sel}>
            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground/60">Location area (geospatial multiplier)</label>
        <select value={locationArea} onChange={e => setLocationArea(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-sm outline-none focus:border-pulse/60">
          {LOCATION_AREAS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Location type</label>
          <select value={locationType} onChange={e => setLocationType(e.target.value)} className={sel}>
            {LOCATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Hero element</label>
          <select value={heroElement} onChange={e => setHeroElement(e.target.value)} className={sel}>
            {HERO_ELEMENTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Event month</label>
          <select value={eventMonth} onChange={e => setEventMonth(e.target.value)} className={sel}>
            <option value="">Unknown</option>
            {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Day of week</label>
          <select value={eventDow} onChange={e => setEventDow(e.target.value)} className={sel}>
            <option value="">Unknown</option>
            {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </select>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/5 p-3">
        <input type="checkbox" checked={facePriority} onChange={e => setFacePriority(e.target.checked)} className="accent-pulse" />
        <div>
          <p className="text-sm font-medium">Face / Status priority</p>
          <p className="text-xs text-foreground/40">ALICE will never suggest cutting guest list — only internal facets</p>
        </div>
      </label>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground/60">Notes for ALICE</label>
        <textarea value={rawNotes} onChange={e => setRawNotes(e.target.value)} rows={3}
          placeholder="Specific requirements, themes, constraints, cultural notes…"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-pulse/60 resize-none" />
      </div>

      <Button type="submit" loading={loading}>
        {defaultValues ? 'Re-calibrate & regenerate' : 'Calibrate ALICE'}
      </Button>
    </form>
  )
}
