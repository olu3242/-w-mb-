'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function upsertVenue(eventId: string, slug: string, formData: FormData) {
  const supabase = await createClient()
  await supabase.from('venues').upsert({
    event_id: eventId,
    name: formData.get('name') as string,
    address: (formData.get('address') as string) || null,
    capacity: formData.get('capacity') ? Number(formData.get('capacity')) : null,
    contact: (formData.get('contact') as string) || null,
    cost_kobo: formData.get('cost') ? Math.round(parseFloat(formData.get('cost') as string) * 100) : 0,
    power_grid: formData.get('power_grid') === 'on',
    gen1_kva: formData.get('gen1_kva') ? Number(formData.get('gen1_kva')) : null,
    gen2_kva: formData.get('gen2_kva') ? Number(formData.get('gen2_kva')) : null,
    fuel_litres: formData.get('fuel_litres') ? Number(formData.get('fuel_litres')) : null,
    notes: (formData.get('notes') as string) || null,
  }, { onConflict: 'event_id' })
  revalidatePath(`/events/${slug}/venue`)
}
