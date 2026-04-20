export type EventSignals = {
  has_contributions?: boolean
  has_venue?: boolean
  has_vendors?: boolean
  has_tasks?: boolean
  has_timeline?: boolean
  has_budget_profile?: boolean
}

export type Event = {
  id: string
  slug: string
  title: string
  description?: string
  event_date?: string
  location?: string
  is_public: boolean
  signals: EventSignals
  owner_id: string
  stripe_account_id?: string
  created_at: string
  updated_at: string
}

export type GiftItem = {
  id: string
  event_id: string
  title: string
  description?: string
  amount: number
  is_funded: boolean
  created_at: string
}

export type Contribution = {
  id: string
  event_id: string
  gift_item_id?: string
  amount: number
  contributor_name: string
  contributor_email: string
  message?: string
  stripe_payment_intent_id: string
  status: 'pending' | 'succeeded' | 'failed'
  created_at: string
}

export type Task = {
  id: string
  event_id: string
  title: string
  assigned_to?: string
  due_date?: string
  status: 'todo' | 'in_progress' | 'done'
  created_at: string
}

export type Vendor = {
  id: string
  event_id: string
  name: string
  category: string
  contact?: string
  cost?: number
  status: 'prospect' | 'booked' | 'paid'
  created_at: string
}

export type BudgetLine = {
  id: string
  event_id: string
  category: string
  label: string
  estimated: number
  actual?: number
  created_at: string
}
