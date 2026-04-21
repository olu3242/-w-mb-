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
          alice_unlocked: boolean
          alice_paid_at: string | null
          alice_payment_ref: string | null
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
          alice_unlocked?: boolean
          alice_paid_at?: string | null
          alice_payment_ref?: string | null
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
          alice_unlocked?: boolean
          alice_paid_at?: string | null
          alice_payment_ref?: string | null
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
          paystack_reference: string | null
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
          paystack_reference?: string | null
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
          paystack_reference?: string | null
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
      event_context: {
        Row: {
          id: string
          event_id: string
          guest_count: number
          style_tier: string
          location_type: string
          location_area: string
          event_type: string
          face_priority: boolean
          hero_element: string
          budget_ceiling: number | null
          event_month: number | null
          event_dow: number | null
          raw_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          guest_count?: number
          style_tier?: string
          location_type?: string
          location_area?: string
          event_type?: string
          face_priority?: boolean
          hero_element?: string
          budget_ceiling?: number | null
          event_month?: number | null
          event_dow?: number | null
          raw_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          guest_count?: number
          style_tier?: string
          location_type?: string
          location_area?: string
          event_type?: string
          face_priority?: boolean
          hero_element?: string
          budget_ceiling?: number | null
          event_month?: number | null
          event_dow?: number | null
          raw_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_facets: {
        Row: {
          id: string
          event_id: string
          context_id: string | null
          raw_total: number | null
          final_total: number | null
          demand_multiplier: number | null
          allocations: Json
          ave_data: Json
          generated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          context_id?: string | null
          raw_total?: number | null
          final_total?: number | null
          demand_multiplier?: number | null
          allocations?: Json
          ave_data?: Json
          generated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          context_id?: string | null
          raw_total?: number | null
          final_total?: number | null
          demand_multiplier?: number | null
          allocations?: Json
          ave_data?: Json
          generated_at?: string
        }
        Relationships: []
      }
      alice_alerts: {
        Row: {
          id: string
          event_id: string
          alert_type: string
          severity: string
          message: string
          resolved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          alert_type: string
          severity?: string
          message: string
          resolved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          alert_type?: string
          severity?: string
          message?: string
          resolved?: boolean
          created_at?: string
        }
        Relationships: []
      }
      alice_decisions: {
        Row: {
          id: string
          event_id: string
          decision_type: string
          payload: Json
          accepted: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          decision_type: string
          payload?: Json
          accepted?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          decision_type?: string
          payload?: Json
          accepted?: boolean | null
          created_at?: string
        }
        Relationships: []
      }
      system_events: {
        Row: {
          id: string
          event_id: string | null
          user_id: string | null
          event_type: string
          payload: Json
          created_at: string
        }
        Insert: {
          id?: string
          event_id?: string | null
          user_id?: string | null
          event_type: string
          payload?: Json
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string | null
          user_id?: string | null
          event_type?: string
          payload?: Json
          created_at?: string
        }
        Relationships: []
      }
      vendor_invites: {
        Row: {
          id: string
          event_id: string
          vendor_id: string | null
          email: string
          name: string | null
          status: string
          token: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          vendor_id?: string | null
          email: string
          name?: string | null
          status?: string
          token?: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          vendor_id?: string | null
          email?: string
          name?: string | null
          status?: string
          token?: string
          created_at?: string
        }
        Relationships: []
      }
      vendor_scores: {
        Row: {
          id: string
          vendor_id: string
          event_id: string
          punctuality_score: number
          quality_score: number
          reliability_score: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          event_id: string
          punctuality_score: number
          quality_score: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          event_id?: string
          punctuality_score?: number
          quality_score?: number
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      client_preferences: {
        Row: {
          id: string
          owner_id: string
          face_priority: boolean
          disliked_categories: string[]
          budget_style: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          face_priority?: boolean
          disliked_categories?: string[]
          budget_style?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          face_priority?: boolean
          disliked_categories?: string[]
          budget_style?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_inventory: {
        Row: {
          id: string
          event_id: string
          item_name: string
          facet: string
          total_qty: number
          store_qty: number
          floor_qty: number
          unit_cost_kobo: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          item_name: string
          facet: string
          total_qty?: number
          store_qty?: number
          floor_qty?: number
          unit_cost_kobo?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          item_name?: string
          facet?: string
          total_qty?: number
          store_qty?: number
          floor_qty?: number
          unit_cost_kobo?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      vendor_crew: {
        Row: {
          id: string
          event_id: string
          vendor_id: string | null
          crew_name: string
          plate_number: string | null
          crew_id_verified: boolean
          fuel_audited: boolean
          high_scrutiny: boolean
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          vendor_id?: string | null
          crew_name: string
          plate_number?: string | null
          crew_id_verified?: boolean
          fuel_audited?: boolean
          high_scrutiny?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          vendor_id?: string | null
          crew_name?: string
          plate_number?: string | null
          crew_id_verified?: boolean
          fuel_audited?: boolean
          high_scrutiny?: boolean
          created_at?: string
        }
        Relationships: []
      }
      guest_experience_scores: {
        Row: {
          id: string
          event_id: string
          ac_score: number | null
          service_speed_score: number | null
          bathroom_score: number | null
          overall_score: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          ac_score?: number | null
          service_speed_score?: number | null
          bathroom_score?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          ac_score?: number | null
          service_speed_score?: number | null
          bathroom_score?: number | null
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      calculate_alice_budget: {
        Args: {
          p_guest_count: number
          p_style_tier: string
          p_location_type: string
          p_location_area?: string
          p_budget_ceiling?: number | null
          p_event_month?: number | null
          p_event_dow?: number | null
        }
        Returns: Json
      }
      get_facet_allocations: {
        Args: {
          p_style_tier: string
          p_hero_element?: string
          p_crisis_deficit_pct?: number
        }
        Returns: Json
      }
      update_event_signal: {
        Args: { p_event_id: string; p_signal: string; p_value: boolean }
        Returns: undefined
      }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
