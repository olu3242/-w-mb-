import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AliceCalibrationForm } from '@/components/alice/alice-calibration-form'
import { AliceBudgetView } from '@/components/alice/alice-budget-view'
import { AliceAlerts } from '@/components/alice/alice-alerts'
import { formatCurrency } from '@/lib/utils'

export default async function AlicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: event } = await supabase
    .from('events')
    .select('id, title, alice_unlocked, signals')
    .eq('slug', slug)
    .eq('owner_id', user!.id)
    .single()

  if (!event) notFound()
  if (!event.alice_unlocked) redirect(`/events/${slug}`)

  const [{ data: ctx }, { data: facets }, { data: alerts }] = await Promise.all([
    supabase.from('event_context').select('*').eq('event_id', event.id).single(),
    supabase.from('event_facets').select('*').eq('event_id', event.id).single(),
    supabase.from('alice_alerts').select('*').eq('event_id', event.id).eq('resolved', false).order('created_at', { ascending: false }),
  ])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">🧠 ALICE</h2>
        <span className="rounded-full bg-pulse/10 px-3 py-1 text-xs font-medium text-pulse">Active</span>
      </div>

      {alerts && alerts.length > 0 && (
        <AliceAlerts alerts={alerts} slug={slug} />
      )}

      {!ctx ? (
        <AliceCalibrationForm eventId={event.id} slug={slug} />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/5 p-4">
              <p className="text-xs text-foreground/40">Guests</p>
              <p className="mt-1 text-2xl font-bold">{ctx.guest_count}</p>
            </div>
            <div className="rounded-xl border border-white/5 p-4">
              <p className="text-xs text-foreground/40">Style</p>
              <p className="mt-1 text-2xl font-bold capitalize">{ctx.style_tier}</p>
            </div>
            <div className="rounded-xl border border-white/5 p-4">
              <p className="text-xs text-foreground/40">Estimated Budget</p>
              <p className="mt-1 text-2xl font-bold text-sage">
                {facets ? `₦${Number(facets.final_total).toLocaleString()}` : '—'}
              </p>
            </div>
          </div>

          {facets && <AliceBudgetView facets={{ ...facets, allocations: (facets.allocations ?? {}) as Record<string, number> }} />}

          <details className="rounded-xl border border-white/5">
            <summary className="cursor-pointer p-4 text-sm font-medium text-foreground/60 hover:text-foreground">
              Re-calibrate
            </summary>
            <div className="border-t border-white/5 p-4">
              <AliceCalibrationForm eventId={event.id} slug={slug} defaultValues={ctx} />
            </div>
          </details>
        </div>
      )}
    </div>
  )
}
