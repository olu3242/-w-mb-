'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function sendVendorInvite(
  eventId: string,
  slug: string,
  email: string,
  name: string,
  facetName: string,
  daysValid = 7
) {
  const supabase = await createClient()
  const expiresAt = new Date(Date.now() + daysValid * 86400000).toISOString()
  await supabase.from('vendor_invites').insert({
    event_id: eventId,
    email,
    name: name || null,
    status: 'pending',
    expires_at: expiresAt,
  })
  revalidatePath(`/events/${slug}/vendors`)
}

const VendorSchema = z.object({
  event_id: z.string().uuid(),
  name: z.string().min(1).max(120),
  category: z.string().min(1).max(80),
  contact: z.string().max(200).optional(),
  cost: z.coerce.number().int().min(0).optional(),
})

export async function addVendor(formData: FormData) {
  const parsed = VendorSchema.safeParse({
    event_id: formData.get('event_id'),
    name: formData.get('name'),
    category: formData.get('category'),
    contact: formData.get('contact') || undefined,
    cost: formData.get('cost') ? Number(formData.get('cost')) * 100 : undefined,
  })
  if (!parsed.success) return

  const supabase = await createClient()
  const { error } = await supabase.from('vendors').insert({ ...parsed.data, status: 'prospect' })
  if (error) return

  revalidatePath(`/events/${formData.get('slug')}/vendors`)
}

export async function updateVendorStatus(id: string, status: string, slug: string) {
  const supabase = await createClient()
  await supabase.from('vendors').update({ status }).eq('id', id)
  revalidatePath(`/events/${slug}/vendors`)
}

export async function deleteVendor(id: string, slug: string) {
  const supabase = await createClient()
  await supabase.from('vendors').delete().eq('id', id)
  revalidatePath(`/events/${slug}/vendors`)
}
