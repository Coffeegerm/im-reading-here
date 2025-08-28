import { createSupabaseClient, type SupabaseConfig } from '@im-reading-here/shared'

const config: SupabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
}

export const supabase = createSupabaseClient(config)
