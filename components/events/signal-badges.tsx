import { Badge } from '@/components/ui/badge'
import type { EventSignals } from '@/types'

const LABELS: Record<string, string> = {
  has_contributions: 'Gifts',
  has_venue: 'Venue',
  has_vendors: 'Vendors',
  has_tasks: 'Tasks',
  has_timeline: 'Timeline',
  has_budget_profile: 'Budget',
}

export function SignalBadges({ signals }: { signals: EventSignals }) {
  const active = Object.entries(signals).filter(([, v]) => v)
  if (!active.length) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {active.map(([key]) => (
        <Badge key={key} variant="sage">{LABELS[key] ?? key}</Badge>
      ))}
    </div>
  )
}
