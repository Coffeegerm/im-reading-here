import { createSupabaseClient, type SupabaseConfig } from '@im-reading-here/shared'

import { config } from './api/config'

const supabaseConfig: SupabaseConfig = {
  url: config.supabase.url,
  anonKey: config.supabase.anonKey,
}

export const supabase = createSupabaseClient(supabaseConfig)
