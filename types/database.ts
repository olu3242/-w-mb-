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
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          event_date?: string | null
          location?: string | null
          is_public?: boolean
          signals?: Json
          owner_id: string
          stripe_account_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          event_date?: string | null
          location?: string | null
          is_public?: boolean
          signals?: Json
          owner_id?: string
          stripe_account_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
        Insert: {
          id?: string
          event_id: string
          title: string
          description?: string | null
          amount: number
          is_funded?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          title?: string
          description?: string | null
          amount?: number
          is_funded?: boolean
          created_at?: string
        }
        Relationships: []
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
        Insert: {
          id?: string
          event_id: string
          gift_item_id?: string | null
          amount: number
          contributor_name: string
          contributor_email: string
          message?: string | null
          stripe_payment_intent_id: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          gift_item_id?: string | null
          amount?: number
          contributor_name?: string
          contributor_email?: string
          message?: string | null
          stripe_payment_intent_id?: string
          status?: string
          created_at?: string
        }
        Relationships: []
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
        Insert: {
          id?: string
          event_id: string
          title: string
          assigned_to?: string | null
          due_date?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          title?: string
          assigned_to?: string | null
          due_date?: string | null
          status?: string
          created_at?: string
        }
        Relationships: []
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
        Insert: {
          id?: string
          event_id: string
          name: string
          category: string
          contact?: string | null
          cost?: number | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          category?: string
          contact?: string | null
          cost?: number | null
          status?: string
          created_at?: string
        }
        Relationships: []
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
        Insert: {
          id?: string
          event_id: string
          category: string
          label: string
          estimated: number
          actual?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          category?: string
          label?: string
          estimated?: number
          actual?: number | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
