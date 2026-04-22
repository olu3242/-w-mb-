import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export async function recalcEventFacets(
  supabase: SupabaseClient<Database>,
  eventId: string
) {
  const [{ data: facets }, { data: payments }, { data: quotes }, { data: escrow }] =
    await Promise.all([
      supabase.from('event_facets').select('final_total').eq('event_id', eventId).single(),
      supabase.from('payments').select('amount').eq('event_id', eventId).eq('status', 'verified'),
      supabase.from('event_vendors').select('facet_name, quote_amount').eq('event_id', eventId).not('quote_amount', 'is', null),
      supabase.from('escrow_accounts').select('balance, total_allocated, total_released').eq('event_id', eventId).single(),
    ])

  if (!facets?.final_total) return

  const total = Number(facets.final_total)
  const amountPaid = payments?.reduce((s, p) => s + Number(p.amount), 0) ?? 0
  const balanceDue = Math.max(0, total - amountPaid)
  const paymentStatus =
    amountPaid === 0 ? 'unpaid' : amountPaid >= total ? 'paid' : 'partial'

  const actualQuotes: Record<string, number> = {}
  for (const q of quotes ?? []) {
    if (q.quote_amount != null) {
      actualQuotes[q.facet_name] = (actualQuotes[q.facet_name] ?? 0) + Number(q.quote_amount)
    }
  }

  // Merge escrow data into ave_data
  const escrowMeta = escrow
    ? {
        escrow_balance: Number(escrow.balance),
        escrow_allocated: Number(escrow.total_allocated),
        escrow_released: Number(escrow.total_released),
        escrow_available: Number(escrow.balance) - Number(escrow.total_allocated),
      }
    : {}

  await supabase.from('event_facets').update({
    amount_paid: amountPaid,
    balance_due: balanceDue,
    payment_status: paymentStatus,
    actual_quotes: actualQuotes,
    ave_data: escrowMeta,
  }).eq('event_id', eventId)
}
