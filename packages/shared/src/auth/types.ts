// Authentication types for the application

export interface SupabaseUser {
  id: string
  email: string
  email_confirmed_at?: string
  last_sign_in_at?: string
  created_at: string
  updated_at: string
  user_metadata?: {
    name?: string
    avatar_url?: string
  }
}

export interface AuthUser {
  id: string
  email: string
  name: string
  avatarUrl?: string
  plan: 'FREE' | 'PREMIUM'
  shelvesVisibleTo: 'public' | 'club' | 'private'
  createdAt: Date
  updatedAt: Date
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: 'bearer'
  user: SupabaseUser
}

export interface AuthError {
  message: string
  status?: number
  details?: string
}

export interface AuthResponse<T = any> {
  data: T | null
  error: AuthError | null
}

export interface SignUpResponse {
  user: SupabaseUser | null
  session: AuthSession | null
}

export interface SignInResponse {
  user: SupabaseUser | null
  session: AuthSession | null
}

// JWT payload structure (when validating tokens on backend)
export interface JwtPayload {
  sub: string // user id
  email: string
  aud: string
  role: string
  iat: number
  exp: number
}

// Supabase webhook payload structure
export interface SupabaseWebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record?: SupabaseUser
  old_record?: SupabaseUser
  schema: string
}
