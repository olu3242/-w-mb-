export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          event_date: string | null
          location: string | null
          is_public: boolean
          signals: Json
          owner_id: string
          stripe_account_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['events']['Insert']>
      }
      gift_items: {
        Row: {
          id: string
          event_id: string
          title: string
          description: string | null
          amount: number
          is_funded: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['gift_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['gift_items']['Insert']>
      }
      contributions: {
        Row: {
          id: string
          event_id: string
          gift_item_id: string | null
          amount: number
          contributor_name: string
          contributor_email: string
          message: string | null
          stripe_payment_intent_id: string
          status: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['contributions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['contributions']['Insert']>
      }
      tasks: {
        Row: {
          id: string
          event_id: string
          title: string
          assigned_to: string | null
          due_date: string | null
          status: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>
      }
      vendors: {
        Row: {
          id: string
          event_id: string
          name: string
          category: string
          contact: string | null
          cost: number | null
          status: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['vendors']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['vendors']['Insert']>
      }
      budget_lines: {
        Row: {
          id: string
          event_id: string
          category: string
          label: string
          estimated: number
          actual: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['budget_lines']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['budget_lines']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
