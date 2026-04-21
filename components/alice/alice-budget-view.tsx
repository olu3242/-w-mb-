type Facets = {
  final_total: number | string | null
  raw_total: number | string | null
  demand_multiplier: number | string | null
  allocations: Record<string, number>
}

export function AliceBudgetView({ facets }: { facets: Facets }) {
  const total = Number(facets.final_total)
  const allocations = facets.allocations as Record<string, number>

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Budget breakdown</h3>
        {Number(facets.demand_multiplier) > 1 && (
          <span className="text-xs text-foreground/40">
            ×{Number(facets.demand_multiplier).toFixed(2)} demand
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {Object.entries(allocations)
          .sort(([, a], [, b]) => b - a)
          .map(([facet, pct]) => {
            const amount = (total * pct) / 100
            return (
              <div key={facet} className="flex items-center gap-3">
                <span className="w-24 text-xs capitalize text-foreground/50">{facet}</span>
                <div className="flex-1 h-2 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-pulse/60"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs text-foreground/40">{pct}%</span>
                <span className="w-28 text-right text-xs font-medium">₦{amount.toLocaleString()}</span>
              </div>
            )
          })}
      </div>
    </div>
  )
}
