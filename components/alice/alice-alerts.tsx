'use client'

import { resolveAliceAlert } from '@/app/actions/alice'

type Alert = { id: string; alert_type: string; severity: string; message: string }

const SEVERITY_STYLES: Record<string, string> = {
  info: 'border-ocean/30 bg-ocean/5 text-ocean',
  warning: 'border-pulse/30 bg-pulse/5 text-pulse',
  critical: 'border-red-500/30 bg-red-500/5 text-red-400',
}

export function AliceAlerts({ alerts, slug }: { alerts: Alert[]; slug: string }) {
  return (
    <div className="flex flex-col gap-2">
      {alerts.map(alert => (
        <div key={alert.id} className={`flex items-start justify-between gap-4 rounded-lg border p-3 ${SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.info}`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{alert.alert_type.replace(/_/g, ' ')}</p>
            <p className="mt-0.5 text-sm">{alert.message}</p>
          </div>
          <form action={resolveAliceAlert.bind(null, alert.id, slug)}>
            <button type="submit" className="shrink-0 text-xs opacity-50 hover:opacity-100 transition-opacity">
              dismiss
            </button>
          </form>
        </div>
      ))}
    </div>
  )
}
