'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTimelineItem(eventId: string, slug: string, formData: FormData) {
  const supabase = await createClient()
  const { data: last } = await supabase
    .from('timeline_items')
    .select('sort_order')
    .eq('event_id', eventId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  await supabase.from('timeline_items').insert({
    event_id: eventId,
    scheduled_time: formData.get('scheduled_time') as string,
    title: formData.get('title') as string,
    responsible: (formData.get('responsible') as string) || null,
    notes: (formData.get('notes') as string) || null,
    sort_order: (last?.sort_order ?? 0) + 1,
  })
  revalidatePath(`/events/${slug}/timeline`)
}

export async function updateTimelineStatus(itemId: string, slug: string, status: string) {
  const supabase = await createClient()
  await supabase.from('timeline_items').update({ status }).eq('id', itemId)
  revalidatePath(`/events/${slug}/timeline`)
}

export async function deleteTimelineItem(itemId: string, slug: string) {
  const supabase = await createClient()
  await supabase.from('timeline_items').delete().eq('id', itemId)
  revalidatePath(`/events/${slug}/timeline`)
}
