'use client'

import { useState } from 'react'
import { moveInventoryToFloor, addInventoryItem } from '@/app/actions/alice'
import type { EventInventory } from '@/types'

type Props = { items: EventInventory[]; eventId: string; slug: string }

export function AliceBurnRateTracker({ items, eventId, slug }: Props) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [facet, setFacet] = useState('catering')
  const [qty, setQty] = useState('')
  const [cost, setCost] = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await addInventoryItem(eventId, slug, name, facet, Number(qty), Math.round(parseFloat(cost) * 100))
    setName(''); setQty(''); setCost(''); setAdding(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">D-Day Burn Rate</h3>
        <button onClick={() => setAdding(v => !v)}
          className="text-xs text-pulse hover:underline">{adding ? 'Cancel' : '+ Add item'}</button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="grid gap-3 rounded-lg border border-white/10 p-3 sm:grid-cols-2">
          <input placeholder="Item name" value={name} onChange={e => setName(e.target.value)} required
            className="rounded border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
          <select value={facet} onChange={e => setFacet(e.target.value)}
            className="rounded border border-white/10 bg-[#111] px-3 py-2 text-sm outline-none">
            {['catering','venue','decor','media','entertainment','security','souvenirs','admin'].map(f =>
              <option key={f} value={f}>{f}</option>
            )}
          </select>
          <input placeholder="Total qty" type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} required
            className="rounded border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
          <input placeholder="Unit cost (₦)" type="number" min="0" step="100" value={cost} onChange={e => setCost(e.target.value)}
            className="rounded border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
          <button type="submit" className="sm:col-span-2 rounded bg-pulse py-2 text-sm font-semibold text-void">
            Add to store
          </button>
        </form>
      )}

      {items.length === 0 && !adding && (
        <p className="text-sm text-foreground/40">No inventory tracked yet.</p>
      )}

      <div className="flex flex-col gap-2">
        {items.map(item => {
          const floorPct = item.total_qty > 0 ? (item.floor_qty / item.total_qty) * 100 : 0
          const warning = floorPct > 80
          return (
            <div key={item.id} className={`rounded-lg border p-3 ${warning ? 'border-red-500/30 bg-red-500/5' : 'border-white/5'}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{item.item_name}</p>
                  <p className="text-xs text-foreground/40 capitalize">{item.facet}</p>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="text-xs text-foreground/40">Store</p>
                    <p className="text-sm font-semibold">{item.store_qty}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40">Floor</p>
                    <p className={`text-sm font-semibold ${warning ? 'text-red-400' : 'text-sage'}`}>{item.floor_qty}</p>
                  </div>
                  <form action={moveInventoryToFloor.bind(null, item.id, slug)}>
                    <button type="submit" disabled={item.store_qty <= 0}
                      className="rounded bg-white/5 px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-30">
                      →Floor
                    </button>
                  </form>
                </div>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/5">
                <div className={`h-full rounded-full ${warning ? 'bg-red-500/60' : 'bg-sage/50'}`}
                  style={{ width: `${floorPct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
