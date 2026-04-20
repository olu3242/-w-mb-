import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

export default async function BudgetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from('events').select('id').eq('slug', slug).single()
  if (!event) notFound()

  const { data: lines } = await supabase.from('budget_lines').select('*').eq('event_id', event.id).order('category')

  const totalEstimated = lines?.reduce((s, l) => s + l.estimated, 0) ?? 0
  const totalActual = lines?.reduce((s, l) => s + (l.actual ?? 0), 0) ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Budget</h2>
        <div className="text-right text-sm">
          <p className="text-foreground/50">Estimated: <span className="text-foreground">{formatCurrency(totalEstimated)}</span></p>
          <p className="text-foreground/50">Actual: <span className="text-sage">{formatCurrency(totalActual)}</span></p>
        </div>
      </div>
      {!lines?.length ? (
        <div className="rounded-xl border border-white/5 p-12 text-center text-foreground/40">No budget lines yet.</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs text-foreground/40">
                <th className="p-4">Category</th>
                <th className="p-4">Label</th>
                <th className="p-4 text-right">Estimated</th>
                <th className="p-4 text-right">Actual</th>
              </tr>
            </thead>
            <tbody>
              {lines.map(l => (
                <tr key={l.id} className="border-b border-white/5 last:border-0">
                  <td className="p-4 text-foreground/60">{l.category}</td>
                  <td className="p-4">{l.label}</td>
                  <td className="p-4 text-right">{formatCurrency(l.estimated)}</td>
                  <td className="p-4 text-right text-sage">{l.actual ? formatCurrency(l.actual) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
