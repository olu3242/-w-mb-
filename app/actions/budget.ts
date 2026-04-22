'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const BudgetLineSchema = z.object({
  event_id: z.string().uuid(),
  category: z.string().min(1).max(80),
  label: z.string().min(1).max(120),
  estimated: z.coerce.number().int().min(0),
})

export async function addBudgetLine(formData: FormData) {
  const parsed = BudgetLineSchema.safeParse({
    event_id: formData.get('event_id'),
    category: formData.get('category'),
    label: formData.get('label'),
    estimated: Number(formData.get('estimated')) * 100,
  })
  if (!parsed.success) return

  const supabase = await createClient()
  const { error } = await supabase.from('budget_lines').insert(parsed.data)
  if (error) return

  revalidatePath(`/events/${formData.get('slug')}/budget`)
}

export async function updateActual(formData: FormData) {
  const id = formData.get('id') as string
  const slug = formData.get('slug') as string
  const raw = Number(formData.get('actual'))
  if (!id || !slug || isNaN(raw)) return
  const supabase = await createClient()
  await supabase.from('budget_lines').update({ actual: Math.round(raw * 100) }).eq('id', id)
  revalidatePath(`/events/${slug}/budget`)
}

export async function deleteBudgetLine(id: string, slug: string) {
  const supabase = await createClient()
  await supabase.from('budget_lines').delete().eq('id', id)
  revalidatePath(`/events/${slug}/budget`)
}
