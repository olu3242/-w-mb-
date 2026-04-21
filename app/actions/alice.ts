'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type CalibrationInput = {
  guest_count: number
  style_tier: 'intimate' | 'standard' | 'premium' | 'luxury'
  location_type: 'indoor' | 'outdoor' | 'hybrid'
  hero_element?: string
  budget_ceiling?: number
  event_month?: number
  event_dow?: number
  raw_notes?: string
}

export async function calibrateAlice(eventId: string, input: CalibrationInput) {
  const supabase = await createClient()

  await supabase
    .from('event_context')
    .upsert({ event_id: eventId, ...input }, { onConflict: 'event_id' })

  await supabase.rpc('update_event_signal', {
    p_event_id: eventId,
    p_signal: 'alice_calibrated',
    p_value: true,
  })

  revalidatePath(`/events`)
}

export async function generateAliceBudget(eventId: string, slug: string) {
  const supabase = await createClient()

  const { data: ctx } = await supabase
    .from('event_context')
    .select('*')
    .eq('event_id', eventId)
    .single()

  if (!ctx) return

  const [budgetRes, facetsRes] = await Promise.all([
    supabase.rpc('calculate_alice_budget', {
      p_guest_count: ctx.guest_count,
      p_style_tier: ctx.style_tier,
      p_location_type: ctx.location_type,
      p_budget_ceiling: ctx.budget_ceiling ?? null,
      p_event_month: ctx.event_month ?? null,
      p_event_dow: ctx.event_dow ?? null,
    }),
    supabase.rpc('get_facet_allocations', {
      p_style_tier: ctx.style_tier,
      p_hero_element: ctx.hero_element ?? 'food',
    }),
  ])

  const budget = budgetRes.data as { raw_total: number; final_total: number; demand_multiplier: number }

  await supabase
    .from('event_facets')
    .upsert({
      event_id: eventId,
      context_id: ctx.id,
      raw_total: budget.raw_total,
      final_total: budget.final_total,
      demand_multiplier: budget.demand_multiplier,
      allocations: facetsRes.data,
    }, { onConflict: 'event_id' })

  await supabase.rpc('update_event_signal', {
    p_event_id: eventId,
    p_signal: 'alice_budget_generated',
    p_value: true,
  })

  revalidatePath(`/events/${slug}`)
  revalidatePath(`/events/${slug}/alice`)
}

export async function runAliceMonitor(eventId: string, slug: string) {
  const supabase = await createClient()

  const [{ data: facets }, { data: lines }] = await Promise.all([
    supabase.from('event_facets').select('final_total').eq('event_id', eventId).single(),
    supabase.from('budget_lines').select('actual').eq('event_id', eventId),
  ])

  if (!facets?.final_total) return

  const totalActual = lines?.reduce((s, l) => s + (l.actual ?? 0), 0) ?? 0

  if (totalActual > facets.final_total) {
    await supabase.from('alice_alerts').insert({
      event_id: eventId,
      alert_type: 'budget_overrun',
      severity: 'warning',
      message: `Actual spend (₦${(totalActual / 100).toLocaleString()}) exceeds ALICE budget estimate of ₦${(Number(facets.final_total) / 100).toLocaleString()}.`,
    })
  }

  revalidatePath(`/events/${slug}/alice`)
}

export async function resolveAliceAlert(alertId: string, slug: string) {
  const supabase = await createClient()
  await supabase.from('alice_alerts').update({ resolved: true }).eq('id', alertId)
  revalidatePath(`/events/${slug}/alice`)
}

export async function recordAliceDecision(
  eventId: string,
  decisionType: string,
  payload: Record<string, unknown>,
  accepted: boolean,
  slug: string
) {
  const supabase = await createClient()
  await supabase.from('alice_decisions').insert({ event_id: eventId, decision_type: decisionType, payload: payload as import('@/types/database').Json, accepted })
  revalidatePath(`/events/${slug}/alice`)
}
