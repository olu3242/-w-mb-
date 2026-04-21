'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const GiftItemSchema = z.object({
  event_id: z.string().uuid(),
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  amount: z.coerce.number().int().min(1),
})

export async function addGiftItem(formData: FormData) {
  const parsed = GiftItemSchema.safeParse({
    event_id: formData.get('event_id'),
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    amount: Number(formData.get('amount')) * 100,
  })
  if (!parsed.success) return

  const supabase = await createClient()
  const { error } = await supabase.from('gift_items').insert(parsed.data)
  if (error) return

  const slug = formData.get('slug') as string
  revalidatePath(`/events/${slug}/gifts`)
}

export async function deleteGiftItem(id: string, slug: string) {
  const supabase = await createClient()
  await supabase.from('gift_items').delete().eq('id', id)
  revalidatePath(`/events/${slug}/gifts`)
}
