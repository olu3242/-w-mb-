import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { addVendor, deleteVendor } from '@/app/actions/vendors'
import { VendorStatusSelect } from '@/components/events/vendor-status-select'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

export default async function VendorsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from('events').select('id').eq('slug', slug).single()
  if (!event) notFound()

  const { data: vendors } = await supabase.from('vendors').select('*').eq('event_id', event.id).order('created_at')

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-xl font-bold">Vendor Hub</h2>

      <form action={addVendor} className="flex flex-wrap gap-3 rounded-xl border border-white/5 p-4">
        <input type="hidden" name="event_id" value={event.id} />
        <input type="hidden" name="slug" value={slug} />
        <input name="name" placeholder="Vendor name *" required className="flex-1 min-w-40 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-pulse/60" />
        <input name="category" placeholder="Category *" required className="w-36 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-pulse/60" />
        <input name="contact" placeholder="Contact" className="w-44 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-pulse/60" />
        <input name="cost" type="number" min="0" step="0.01" placeholder="Cost ($)" className="w-28 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-pulse/60" />
        <Button type="submit" size="sm">Add vendor</Button>
      </form>

      {!vendors?.length ? (
        <div className="rounded-xl border border-white/5 p-12 text-center text-foreground/40">No vendors yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {vendors.map(v => (
            <div key={v.id} className="flex items-center justify-between rounded-xl border border-white/5 p-4">
              <div>
                <p className="font-medium">{v.name}</p>
                <p className="text-sm text-foreground/50">{v.category}</p>
                {v.contact && <p className="text-xs text-foreground/40">{v.contact}</p>}
              </div>
              <div className="flex items-center gap-4">
                {v.cost != null && <span className="text-sm text-foreground/60">{formatCurrency(v.cost)}</span>}
                <VendorStatusSelect id={v.id} status={v.status} slug={slug} />
                <form action={deleteVendor.bind(null, v.id, slug)}>
                  <button type="submit" className="text-xs text-foreground/30 hover:text-red-400 transition-colors">remove</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
