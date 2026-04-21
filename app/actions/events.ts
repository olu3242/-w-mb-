'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const EditSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(2000).optional(),
  event_date: z.string().optional(),
  location: z.string().max(200).optional(),
  is_public: z.boolean().default(true),
})

export async function updateEvent(slug: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const signals: Record<string, boolean> = {}
  const signalKeys = ['has_contributions', 'has_venue', 'has_vendors', 'has_tasks', 'has_timeline', 'has_budget_profile']
  signalKeys.forEach(k => { signals[k] = formData.get(k) === 'on' })

  const raw = {
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || undefined,
    event_date: formData.get('event_date')
      ? new Date(formData.get('event_date') as string).toISOString()
      : undefined,
    location: (formData.get('location') as string) || undefined,
    is_public: formData.get('is_public') === 'on',
  }

  const parsed = EditSchema.safeParse(raw)
  if (!parsed.success) return

  const { error } = await supabase
    .from('events')
    .update({ ...parsed.data, signals })
    .eq('slug', slug)
    .eq('owner_id', user.id)

  if (error) return

  revalidatePath(`/events/${slug}`)
  redirect(`/events/${slug}`)
}

export async function deleteEvent(slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('events').delete().eq('slug', slug).eq('owner_id', user.id)
  revalidatePath('/events')
  redirect('/events')
}
