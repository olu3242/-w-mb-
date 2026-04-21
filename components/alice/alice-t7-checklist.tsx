'use client'

import { useState } from 'react'
import { addVendorCrew, toggleCrewField } from '@/app/actions/alice'
import type { VendorCrew, Vendor } from '@/types'

type Props = { crew: VendorCrew[]; vendors: Vendor[]; eventId: string; slug: string }

export function AliceT7Checklist({ crew, vendors, eventId, slug }: Props) {
  const [adding, setAdding] = useState(false)
  const [crewName, setCrewName] = useState('')
  const [vendorId, setVendorId] = useState('')
  const [plate, setPlate] = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await addVendorCrew(eventId, slug, crewName, vendorId || null, plate || null)
    setCrewName(''); setVendorId(''); setPlate(''); setAdding(false)
  }

  const flagged = crew.filter(c => c.high_scrutiny)
  const cleared = crew.filter(c => !c.high_scrutiny)
  const readyCount = crew.filter(c => c.crew_id_verified && c.fuel_audited).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">T-7 Lockdown</h3>
          <p className="text-xs text-foreground/40">{readyCount}/{crew.length} crew cleared</p>
        </div>
        <button onClick={() => setAdding(v => !v)} className="text-xs text-pulse hover:underline">
          {adding ? 'Cancel' : '+ Add crew'}
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="grid gap-3 rounded-lg border border-white/10 p-3 sm:grid-cols-2">
          <input placeholder="Crew name *" value={crewName} onChange={e => setCrewName(e.target.value)} required
            className="rounded border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
          <select value={vendorId} onChange={e => setVendorId(e.target.value)}
            className="rounded border border-white/10 bg-[#111] px-3 py-2 text-sm outline-none">
            <option value="">No vendor</option>
            {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
          <input placeholder="Plate number" value={plate} onChange={e => setPlate(e.target.value)}
            className="sm:col-span-2 rounded border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
          <button type="submit" className="sm:col-span-2 rounded bg-pulse py-2 text-sm font-semibold text-void">
            Add to registry
          </button>
        </form>
      )}

      {flagged.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">High Scrutiny</p>
          {flagged.map(c => <CrewRow key={c.id} crew={c} slug={slug} />)}
        </div>
      )}

      {cleared.length > 0 && (
        <div className="flex flex-col gap-2">
          {flagged.length > 0 && <p className="text-xs font-medium text-foreground/40 uppercase tracking-wide">Standard</p>}
          {cleared.map(c => <CrewRow key={c.id} crew={c} slug={slug} />)}
        </div>
      )}

      {crew.length === 0 && !adding && (
        <p className="text-sm text-foreground/40">No crew registered yet.</p>
      )}
    </div>
  )
}

function CrewRow({ crew, slug }: { crew: VendorCrew; slug: string }) {
  return (
    <div className={`rounded-lg border p-3 ${crew.high_scrutiny ? 'border-red-500/30 bg-red-500/5' : 'border-white/5'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{crew.crew_name}</p>
          {crew.plate_number && <p className="text-xs text-foreground/40">{crew.plate_number}</p>}
          {crew.high_scrutiny && <p className="text-xs text-red-400 mt-0.5">⚠ Low reliability history</p>}
        </div>
        <div className="flex gap-3">
          <form action={toggleCrewField.bind(null, crew.id, slug, 'crew_id_verified', !crew.crew_id_verified)}>
            <button type="submit"
              className={`rounded px-2 py-1 text-xs ${crew.crew_id_verified ? 'bg-sage/20 text-sage' : 'bg-white/5 text-foreground/40'}`}>
              ID {crew.crew_id_verified ? '✓' : '?'}
            </button>
          </form>
          <form action={toggleCrewField.bind(null, crew.id, slug, 'fuel_audited', !crew.fuel_audited)}>
            <button type="submit"
              className={`rounded px-2 py-1 text-xs ${crew.fuel_audited ? 'bg-sage/20 text-sage' : 'bg-white/5 text-foreground/40'}`}>
              Fuel {crew.fuel_audited ? '✓' : '?'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
