import { z } from 'zod'

export const EventSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(2000).optional(),
  event_date: z.string().datetime().optional(),
  location: z.string().max(200).optional(),
  is_public: z.boolean().default(true),
})

export const ContributionSchema = z.object({
  event_id: z.string().uuid(),
  gift_item_id: z.string().uuid().optional(),
  amount: z.number().int().min(100),
  contributor_name: z.string().min(1).max(100),
  contributor_email: z.string().email(),
  message: z.string().max(500).optional(),
})

export type EventInput = z.infer<typeof EventSchema>
export type ContributionInput = z.infer<typeof ContributionSchema>
