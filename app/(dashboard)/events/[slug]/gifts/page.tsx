import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { addGiftItem, deleteGiftItem } from '@/app/actions/gifts'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

export default async function GiftsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from('events').select('id, title').eq('slug', slug).single()
  if (!event) notFound()

  const { data: items } = await supabase.from('gift_items').select('*').eq('event_id', event.id).order('created_at')
  const { data: contributions } = await supabase.from('contributions').select('amount, status').eq('event_id', event.id)
  const totalRaised = contributions?.filter(c => c.status === 'succeeded').reduce((s, c) => s + c.amount, 0) ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Gift Registry</h2>
        {totalRaised > 0 && <span className="text-sm font-medium text-sage">{formatCurrency(totalRaised)} raised</span>}
      </div>

      <form action={addGiftItem} className="flex flex-wrap gap-3 rounded-xl border border-white/5 p-4">
        <input type="hidden" name="event_id" value={event.id} />
        <input type="hidden" name="slug" value={slug} />
        <input name="title" placeholder="Gift name *" required className="flex-1 min-w-40 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-pulse/60" />
        <input name="description" placeholder="Description" className="flex-1 min-w-40 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-pulse/60" />
        <input name="amount" type="number" min="1" step="0.01" placeholder="Amount ($) *" required className="w-32 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-pulse/60" />
        <Button type="submit" size="sm">Add item</Button>
      </form>

      {!items?.length ? (
        <div className="rounded-xl border border-white/5 p-12 text-center text-foreground/40">No gift items yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/5 p-4">
              <div>
                <p className="font-medium">{item.title}</p>
                {item.description && <p className="text-sm text-foreground/50">{item.description}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-pulse">{formatCurrency(item.amount)}</span>
                {item.is_funded && <span className="rounded-full bg-sage/10 px-2 py-0.5 text-xs text-sage">Funded</span>}
                <form action={deleteGiftItem.bind(null, item.id, slug)}>
                  <button type="submit" className="text-foreground/30 hover:text-red-400 transition-colors text-xs">remove</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
