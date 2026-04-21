'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Json } from '@/types/database'

type CalibrationInput = {
  guest_count: number
  style_tier: 'intimate' | 'standard' | 'premium' | 'luxury'
  location_type: 'indoor' | 'outdoor' | 'hybrid'
  location_area: 'premium' | 'urban' | 'state_capital' | 'other'
  event_type: 'wedding' | 'funeral' | 'birthday' | 'corporate' | 'naming' | 'party'
  face_priority: boolean
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
      p_location_area: ctx.location_area ?? 'state_capital',
      p_budget_ceiling: ctx.budget_ceiling ?? null,
      p_event_month: ctx.event_month ?? null,
      p_event_dow: ctx.event_dow ?? null,
    }),
    supabase.rpc('get_facet_allocations', {
      p_style_tier: ctx.style_tier,
      p_hero_element: ctx.hero_element ?? 'catering',
    }),
  ])

  const budget = budgetRes.data as {
    raw_total: number
    final_total: number
    demand_multiplier: number
    area_multiplier: number
    inflation_buffer: number
  }

  await supabase
    .from('event_facets')
    .upsert({
      event_id: eventId,
      context_id: ctx.id,
      raw_total: budget.raw_total,
      final_total: budget.final_total,
      demand_multiplier: budget.demand_multiplier,
      allocations: facetsRes.data,
      ave_data: {},
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

  const [{ data: facets }, { data: lines }, { data: vendors }, { data: scores }] = await Promise.all([
    supabase.from('event_facets').select('final_total, allocations').eq('event_id', eventId).single(),
    supabase.from('budget_lines').select('category, actual, estimated').eq('event_id', eventId),
    supabase.from('vendors').select('id, name').eq('event_id', eventId),
    supabase.from('vendor_scores').select('vendor_id, reliability_score').eq('event_id', eventId),
  ])

  if (!facets?.final_total) return

  const total = Number(facets.final_total)
  const allocs = facets.allocations as Record<string, number>
  const totalActual = lines?.reduce((s, l) => s + (l.actual ?? 0), 0) ?? 0

  if (totalActual > total) {
    await supabase.from('alice_alerts').insert({
      event_id: eventId,
      alert_type: 'budget_overrun',
      severity: 'warning',
      message: `Actual spend (₦${totalActual.toLocaleString()}) exceeds ALICE estimate of ₦${total.toLocaleString()}.`,
    })
  }

  // Facet-level AvE check
  const actualByFacet: Record<string, number> = {}
  for (const line of lines ?? []) {
    const k = line.category.toLowerCase()
    actualByFacet[k] = (actualByFacet[k] ?? 0) + (line.actual ?? 0)
  }
  for (const [facet, pct] of Object.entries(allocs)) {
    const allocated = (total * pct) / 100
    const actual = actualByFacet[facet] ?? 0
    if (actual > allocated * 1.1 && actual > 0) {
      await supabase.from('alice_alerts').insert({
        event_id: eventId,
        alert_type: `facet_overrun_${facet}`,
        severity: 'warning',
        message: `${facet} spend (₦${actual.toLocaleString()}) is >10% over allocated ₦${allocated.toLocaleString()}.`,
      })
    }
  }

  // Recursive: vendor reliability → T-7 high scrutiny flag
  const lowReliabilityIds = new Set(
    scores?.filter(s => Number(s.reliability_score) < 7).map(s => s.vendor_id) ?? []
  )
  if (lowReliabilityIds.size > 0) {
    await supabase
      .from('vendor_crew')
      .update({ high_scrutiny: true })
      .eq('event_id', eventId)
      .in('vendor_id', [...lowReliabilityIds])

    const names = vendors?.filter(v => lowReliabilityIds.has(v.id)).map(v => v.name).join(', ')
    if (names) {
      await supabase.from('alice_alerts').insert({
        event_id: eventId,
        alert_type: 'low_reliability_vendor',
        severity: 'critical',
        message: `High scrutiny flagged for: ${names}. Reliability score < 7.0.`,
      })
    }
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
  await supabase.from('alice_decisions').insert({
    event_id: eventId,
    decision_type: decisionType,
    payload: payload as Json,
    accepted,
  })
  revalidatePath(`/events/${slug}/alice`)
}

// Vendor scorecard → feeds reliability score memory
export async function submitVendorScorecard(
  vendorId: string,
  eventId: string,
  slug: string,
  punctualityScore: number,
  qualityScore: number,
  notes: string
) {
  const supabase = await createClient()
  await supabase.from('vendor_scores').insert({
    vendor_id: vendorId,
    event_id: eventId,
    punctuality_score: punctualityScore,
    quality_score: qualityScore,
    notes: notes || null,
  })
  revalidatePath(`/events/${slug}/alice`)
}

// T-7 lockdown crew management
export async function addVendorCrew(
  eventId: string,
  slug: string,
  crewName: string,
  vendorId: string | null,
  plateNumber: string | null
) {
  const supabase = await createClient()

  let highScrutiny = false
  if (vendorId) {
    const { data } = await supabase
      .from('vendor_scores')
      .select('reliability_score')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false })
      .limit(3)
    const avg = data?.length
      ? data.reduce((s, r) => s + Number(r.reliability_score), 0) / data.length
      : 10
    highScrutiny = avg < 7
  }

  await supabase.from('vendor_crew').insert({
    event_id: eventId,
    vendor_id: vendorId,
    crew_name: crewName,
    plate_number: plateNumber,
    high_scrutiny: highScrutiny,
  })
  revalidatePath(`/events/${slug}/alice`)
}

export async function toggleCrewField(
  crewId: string,
  slug: string,
  field: 'crew_id_verified' | 'fuel_audited',
  value: boolean
) {
  const supabase = await createClient()
  const update = field === 'crew_id_verified' ? { crew_id_verified: value } : { fuel_audited: value }
  await supabase.from('vendor_crew').update(update).eq('id', crewId)
  revalidatePath(`/events/${slug}/alice`)
}

// D-Day burn rate tracker
export async function addInventoryItem(
  eventId: string,
  slug: string,
  itemName: string,
  facet: string,
  totalQty: number,
  unitCostKobo: number
) {
  const supabase = await createClient()
  await supabase.from('event_inventory').insert({
    event_id: eventId,
    item_name: itemName,
    facet,
    total_qty: totalQty,
    store_qty: totalQty,
    floor_qty: 0,
    unit_cost_kobo: unitCostKobo,
  })
  revalidatePath(`/events/${slug}/alice`)
}

export async function moveInventoryToFloor(itemId: string, slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('event_inventory')
    .select('store_qty, floor_qty')
    .eq('id', itemId)
    .single()
  if (!data || data.store_qty <= 0) return
  await supabase.from('event_inventory').update({
    store_qty: data.store_qty - 1,
    floor_qty: data.floor_qty + 1,
  }).eq('id', itemId)
  revalidatePath(`/events/${slug}/alice`)
}

// Guest experience score (Satisfaction Algorithm)
export async function saveGuestExperienceScore(
  eventId: string,
  slug: string,
  acScore: number,
  serviceSpeedScore: number,
  bathroomScore: number,
  notes: string
) {
  const supabase = await createClient()
  await supabase.from('guest_experience_scores').upsert(
    { event_id: eventId, ac_score: acScore, service_speed_score: serviceSpeedScore, bathroom_score: bathroomScore, notes: notes || null },
    { onConflict: 'event_id' }
  )
  revalidatePath(`/events/${slug}/alice`)
}

// Client preference memory (overrides budget trade-offs)
export async function upsertClientPreferences(
  ownerId: string,
  slug: string,
  facePriority: boolean,
  dislikedCategories: string[],
  budgetStyle: 'tight' | 'balanced' | 'lavish'
) {
  const supabase = await createClient()
  await supabase.from('client_preferences').upsert(
    { owner_id: ownerId, face_priority: facePriority, disliked_categories: dislikedCategories, budget_style: budgetStyle },
    { onConflict: 'owner_id' }
  )
  revalidatePath(`/events/${slug}/alice`)
}
