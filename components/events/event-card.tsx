import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { SignalBadges } from './signal-badges'
import type { Event } from '@/types'

export function EventCard({ event }: { event: Event }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="flex flex-col gap-3 rounded-xl border border-white/5 p-5 hover:border-pulse/20 hover:bg-white/[0.02] transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold leading-snug">{event.title}</h2>
        <Badge variant={event.is_public ? 'sage' : 'default'}>
          {event.is_public ? 'Public' : 'Private'}
        </Badge>
      </div>
      {event.event_date && (
        <p className="text-sm text-foreground/50">
          {new Date(event.event_date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
        </p>
      )}
      {event.location && <p className="text-sm text-foreground/40 truncate">{event.location}</p>}
      {event.signals && <SignalBadges signals={event.signals} />}
    </Link>
  )
}
