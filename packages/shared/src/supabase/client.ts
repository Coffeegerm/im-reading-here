import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

export function createSupabaseClient(config: SupabaseConfig): SupabaseClient {
  // In development, can return mock client if no Supabase URL provided
  if (!config.url && process.env.NODE_ENV === 'development') {
    console.warn('Using local development mode - Supabase features disabled')
    return createMockSupabaseClient()
  }

  const isBrowser = typeof globalThis !== 'undefined' && 'window' in globalThis

  return createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: isBrowser,
    },
  })
}

export function createSupabaseAdminClient(config: SupabaseConfig): SupabaseClient {
  if (!config.serviceRoleKey) {
    throw new Error('Service role key required for admin client')
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Mock client for local development
function createMockSupabaseClient(): SupabaseClient {
  const mockClient = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Mock client - Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Mock client - Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  } as any

  return mockClient
}

// Environment-aware client creation for mobile
export function createSupabaseMobileClient(config: SupabaseConfig) {
  return createClient(config.url, config.anonKey, {
    auth: {
      // Mobile will need AsyncStorage imported separately
      // storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Disabled for mobile
    },
  })
}
