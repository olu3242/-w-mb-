import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { upsertVenue } from '@/app/actions/venue'
import { Button } from '@/components/ui/button'

const inp = 'rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-pulse/60 w-full'

export default async function VenuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: event } = await supabase
    .from('events')
    .select('id, title')
    .eq('slug', slug)
    .eq('owner_id', user!.id)
    .single()

  if (!event) notFound()

  const { data: venue } = await supabase
    .from('venues')
    .select('*')
    .eq('event_id', event.id)
    .single()

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <h2 className="font-display text-xl font-bold">Venue & Power</h2>

      <form action={upsertVenue.bind(null, event.id, slug)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Venue name *</label>
          <input name="name" required defaultValue={venue?.name ?? ''} className={inp} placeholder="e.g. Eko Hotel Expo Centre" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Address</label>
          <input name="address" defaultValue={venue?.address ?? ''} className={inp} placeholder="Full address" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground/60">Capacity (guests)</label>
            <input name="capacity" type="number" min="1" defaultValue={venue?.capacity ?? ''} className={inp} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground/60">Cost (₦)</label>
            <input name="cost" type="number" min="0" step="1000"
              defaultValue={venue?.cost_kobo ? venue.cost_kobo / 100 : ''} className={inp} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Contact</label>
          <input name="contact" defaultValue={venue?.contact ?? ''} className={inp} placeholder="Name / phone" />
        </div>

        <div className="rounded-xl border border-white/5 p-4 flex flex-col gap-4">
          <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Power Setup</p>

          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" name="power_grid" defaultChecked={venue?.power_grid ?? false} className="accent-pulse" />
            <span className="text-sm">City grid available</span>
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/60">Gen 1 (KVA)</label>
              <input name="gen1_kva" type="number" min="0" defaultValue={venue?.gen1_kva ?? ''} className={inp} placeholder="e.g. 100" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/60">Gen 2 backup (KVA)</label>
              <input name="gen2_kva" type="number" min="0" defaultValue={venue?.gen2_kva ?? ''} className={inp} placeholder="e.g. 60" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/60">Fuel reserve (L)</label>
              <input name="fuel_litres" type="number" min="0" defaultValue={venue?.fuel_litres ?? ''} className={inp} placeholder="e.g. 400" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/60">Notes</label>
          <textarea name="notes" rows={3} defaultValue={venue?.notes ?? ''}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-pulse/60 resize-none"
            placeholder="Parking, parking attendants, access restrictions…" />
        </div>

        <Button type="submit">{venue ? 'Update venue' : 'Save venue'}</Button>
      </form>

      {venue && (
        <div className="rounded-xl border border-white/5 p-4">
          <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wide mb-3">Power summary</p>
          <div className="flex gap-4 flex-wrap">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${venue.power_grid ? 'bg-sage/10 text-sage' : 'bg-white/5 text-foreground/40'}`}>
              Grid {venue.power_grid ? '✓' : '✗'}
            </span>
            {venue.gen1_kva && <span className="rounded-full bg-ocean/10 px-3 py-1 text-xs font-medium text-ocean">Gen 1: {venue.gen1_kva} KVA</span>}
            {venue.gen2_kva && <span className="rounded-full bg-ocean/10 px-3 py-1 text-xs font-medium text-ocean">Gen 2: {venue.gen2_kva} KVA</span>}
            {venue.fuel_litres && <span className="rounded-full bg-pulse/10 px-3 py-1 text-xs font-medium text-pulse">{venue.fuel_litres}L fuel</span>}
          </div>
        </div>
      )}
    </div>
  )
}
