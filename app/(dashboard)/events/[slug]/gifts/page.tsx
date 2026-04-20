import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function GiftsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from('events').select('id, title, signals').eq('slug', slug).single()
  if (!event) notFound()

  const { data: items } = await supabase.from('gift_items').select('*').eq('event_id', event.id).order('created_at')
  const { data: contributions } = await supabase.from('contributions').select('amount, status').eq('event_id', event.id)

  const totalRaised = contributions?.filter(c => c.status === 'succeeded').reduce((s, c) => s + c.amount, 0) ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Gift Registry</h2>
        <span className="text-sm text-sage font-medium">${(totalRaised / 100).toFixed(2)} raised</span>
      </div>
      {!items?.length ? (
        <div className="rounded-xl border border-white/5 p-12 text-center text-foreground/40">
          No gift items yet. Add your first gift below.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/5 p-4">
              <div>
                <p className="font-medium">{item.title}</p>
                {item.description && <p className="text-sm text-foreground/50">{item.description}</p>}
              </div>
              <div className="text-right">
                <p className="font-medium text-pulse">${(item.amount / 100).toFixed(2)}</p>
                {item.is_funded && <span className="text-xs text-sage">Funded</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
