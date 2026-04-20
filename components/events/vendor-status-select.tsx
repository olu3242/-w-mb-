'use client'

import { updateVendorStatus } from '@/app/actions/vendors'

const STATUSES = ['prospect', 'booked', 'paid']
const COLORS: Record<string, string> = {
  prospect: 'text-foreground/40',
  booked: 'text-ocean',
  paid: 'text-sage',
}

export function VendorStatusSelect({ id, status, slug }: { id: string; status: string; slug: string }) {
  return (
    <select
      value={status}
      onChange={e => updateVendorStatus(id, e.target.value, slug)}
      className={`bg-transparent text-xs font-medium outline-none cursor-pointer ${COLORS[status]}`}
    >
      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  )
}
