'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const TaskSchema = z.object({
  event_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  due_date: z.string().optional(),
})

export async function addTask(formData: FormData) {
  const parsed = TaskSchema.safeParse({
    event_id: formData.get('event_id'),
    title: formData.get('title'),
    due_date: formData.get('due_date') || undefined,
  })
  if (!parsed.success) return

  const supabase = await createClient()
  const { error } = await supabase.from('tasks').insert({ ...parsed.data, status: 'todo' })
  if (error) return

  revalidatePath(`/events/${formData.get('slug')}/tasks`)
}

export async function updateTaskStatus(id: string, status: string, slug: string) {
  const supabase = await createClient()
  await supabase.from('tasks').update({ status }).eq('id', id)
  revalidatePath(`/events/${slug}/tasks`)
}

export async function deleteTask(id: string, slug: string) {
  const supabase = await createClient()
  await supabase.from('tasks').delete().eq('id', id)
  revalidatePath(`/events/${slug}/tasks`)
}
