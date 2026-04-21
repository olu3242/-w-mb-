'use client'

import type { EventFacets, BudgetLine } from '@/types'

const FACET_LABELS: Record<string, string> = {
  catering: 'Food & Beverage',
  venue: 'Venue & Power',
  decor: 'Decor & Ambiance',
  media: 'Media & Sound',
  entertainment: 'Entertainment',
  security: 'Security & Protocol',
  souvenirs: 'Souvenirs & Gifts',
  admin: 'Admin & Contingency',
}

type Props = {
  facets: EventFacets
  budgetLines: BudgetLine[]
}

export function AliceAveTracker({ facets, budgetLines }: Props) {
  const total = Number(facets.final_total)
  const allocs = facets.allocations

  const actualByFacet: Record<string, number> = {}
  for (const line of budgetLines) {
    const key = line.category.toLowerCase()
    actualByFacet[key] = (actualByFacet[key] ?? 0) + (line.actual ?? 0)
  }

  const rows = Object.entries(allocs).sort(([, a], [, b]) => b - a)

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-2 px-1 text-xs font-medium text-foreground/40">
        <span className="col-span-2">Facet</span>
        <span className="text-right">Allocated</span>
        <span className="text-right">Actual</span>
      </div>
      {rows.map(([facet, pct]) => {
        const allocated = (total * pct) / 100
        const actual = actualByFacet[facet] ?? 0
        const overrun = actual > allocated && actual > 0
        const utilPct = allocated > 0 ? Math.min((actual / allocated) * 100, 100) : 0

        return (
          <div key={facet} className="rounded-lg border border-white/5 p-3">
            <div className="mb-2 grid grid-cols-4 gap-2 items-center">
              <span className="col-span-2 text-xs font-medium">{FACET_LABELS[facet] ?? facet}</span>
              <span className="text-right text-xs text-foreground/60">₦{allocated.toLocaleString()}</span>
              <span className={`text-right text-xs font-semibold ${overrun ? 'text-red-400' : actual > 0 ? 'text-sage' : 'text-foreground/30'}`}>
                {actual > 0 ? `₦${actual.toLocaleString()}` : '—'}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5">
              <div
                className={`h-full rounded-full transition-all ${overrun ? 'bg-red-500/60' : 'bg-pulse/50'}`}
                style={{ width: `${utilPct}%` }}
              />
            </div>
            {overrun && (
              <p className="mt-1 text-xs text-red-400">
                +₦{(actual - allocated).toLocaleString()} over budget
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
