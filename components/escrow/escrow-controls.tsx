'use client'

import { useState } from 'react'

type Vendor = { id: string; name: string; category: string }
type Allocation = {
  id: string
  vendor_id: string
  facet_name: string
  amount: number
  status: string
  vendors: { name: string } | null
}

const FACETS = ['catering','venue','decor','media','entertainment','security','souvenirs','admin']
const STATUS_STYLE: Record<string, string> = {
  pending:   'bg-white/5 text-foreground/50',
  approved:  'bg-ocean/10 text-ocean',
  released:  'bg-sage/10 text-sage',
  cancelled: 'bg-white/5 text-foreground/20 line-through',
}

export function EscrowControls({
  eventId,
  vendors,
  allocations,
  available,
}: {
  eventId: string
  vendors: Vendor[]
  allocations: Allocation[]
  available: number
}) {
  const [allocForm, setAllocForm] = useState(false)
  const [vendorId, setVendorId] = useState('')
  const [facet, setFacet] = useState('catering')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [err, setErr] = useState('')

  async function handleAllocate(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    setLoading('alloc')
    const res = await fetch('/api/escrow/allocate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: eventId, vendor_id: vendorId, amount: parseFloat(amount), facet_name: facet, notes: notes || undefined }),
    })
    const data = await res.json() as { error?: string }
    setLoading(null)
    if (data.error) { setErr(data.error); return }
    setAllocForm(false); setAmount(''); setNotes('')
    window.location.reload()
  }

  async function handleRelease(id: string, action: 'approve' | 'cancel') {
    setLoading(id)
    await fetch('/api/escrow/release', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allocation_id: id, action }),
    })
    setLoading(null)
    window.location.reload()
  }

  async function handlePayout(id: string) {
    setLoading(`payout-${id}`)
    const res = await fetch('/api/escrow/payout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allocation_id: id, provider: 'manual' }),
    })
    const data = await res.json() as { error?: string }
    setLoading(null)
    if (data.error) { setErr(data.error); return }
    window.location.reload()
  }

  const inp = 'rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-pulse/60 w-full'
  const sel = 'rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm outline-none focus:border-pulse/60 w-full capitalize'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-foreground/40">Available to allocate</p>
          <p className="text-2xl font-bold text-sage">₦{available.toLocaleString()}</p>
        </div>
        <button onClick={() => setAllocForm(v => !v)}
          className="rounded-lg bg-pulse/10 px-4 py-2 text-sm font-medium text-pulse hover:bg-pulse/20">
          {allocForm ? 'Cancel' : '+ Allocate funds'}
        </button>
      </div>

      {allocForm && (
        <form onSubmit={handleAllocate} className="rounded-xl border border-white/10 p-4 flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/60">Vendor *</label>
              <select value={vendorId} onChange={e => setVendorId(e.target.value)} required className={sel}>
                <option value="">Select vendor</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/60">Facet *</label>
              <select value={facet} onChange={e => setFacet(e.target.value)} className={sel}>
                {FACETS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/60">Amount (₦) *</label>
              <input type="number" min="1" step="100" value={amount} onChange={e => setAmount(e.target.value)} required className={inp} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/60">Notes</label>
              <input value={notes} onChange={e => setNotes(e.target.value)} className={inp} />
            </div>
          </div>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button type="submit" disabled={loading === 'alloc'}
            className="rounded-lg bg-pulse py-2.5 text-sm font-semibold text-void disabled:opacity-50">
            {loading === 'alloc' ? 'Allocating…' : 'Confirm allocation'}
          </button>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {allocations.length === 0 && (
          <p className="text-sm text-foreground/40">No allocations yet.</p>
        )}
        {allocations.map(a => (
          <div key={a.id} className="rounded-xl border border-white/5 p-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{a.vendors?.name ?? '—'}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[a.status]}`}>
                  {a.status}
                </span>
              </div>
              <p className="text-xs text-foreground/40 capitalize mt-0.5">{a.facet_name}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold">₦{Number(a.amount).toLocaleString()}</p>
              {a.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => handleRelease(a.id, 'approve')} disabled={loading === a.id}
                    className="rounded px-2 py-1 text-xs bg-ocean/10 text-ocean hover:bg-ocean/20 disabled:opacity-50">
                    {loading === a.id ? '…' : 'Approve'}
                  </button>
                  <button onClick={() => handleRelease(a.id, 'cancel')} disabled={loading === a.id}
                    className="rounded px-2 py-1 text-xs bg-white/5 text-foreground/40 hover:text-red-400 disabled:opacity-50">
                    Cancel
                  </button>
                </div>
              )}
              {a.status === 'approved' && (
                <button onClick={() => handlePayout(a.id)} disabled={loading === `payout-${a.id}`}
                  className="rounded px-2 py-1 text-xs bg-sage/10 text-sage hover:bg-sage/20 disabled:opacity-50">
                  {loading === `payout-${a.id}` ? '…' : 'Pay out'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
