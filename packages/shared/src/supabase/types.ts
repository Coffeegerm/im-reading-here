// Supabase-specific types

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          plan: string
          shelves_visible_to: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          plan?: string
          shelves_visible_to?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          plan?: string
          shelves_visible_to?: string
          updated_at?: string
        }
      }
    }
  }
}

export type SupabaseDatabase = Database
