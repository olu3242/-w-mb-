import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  prospect: 'text-foreground/40 bg-white/5',
  booked: 'text-ocean bg-ocean/10',
  paid: 'text-sage bg-sage/10',
}

export default async function VendorsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from('events').select('id').eq('slug', slug).single()
  if (!event) notFound()

  const { data: vendors } = await supabase.from('vendors').select('*').eq('event_id', event.id).order('created_at')

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-xl font-bold">Vendor Hub</h2>
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
              <div className="flex items-center gap-3">
                {v.cost && <span className="text-sm text-foreground/60">{formatCurrency(v.cost)}</span>}
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[v.status] ?? ''}`}>
                  {v.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
