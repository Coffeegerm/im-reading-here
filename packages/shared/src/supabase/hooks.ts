import { SupabaseClient } from '@supabase/supabase-js'
import {
  type SignInData,
  type SignUpData,
  mapSupabaseErrorToMessage
} from '../auth'

export interface AuthServiceOptions {
  supabaseClient: SupabaseClient
  redirectTo?: string // For web password reset
}

export interface AuthResult<T = any> {
  data: T | null
  error: { message: string } | null
}

export class AuthService {
  private supabaseClient: SupabaseClient
  private redirectTo?: string

  constructor({ supabaseClient, redirectTo }: AuthServiceOptions) {
    this.supabaseClient = supabaseClient
    this.redirectTo = redirectTo
  }

  async signIn(credentials: SignInData): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabaseClient.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        return {
          data: null,
          error: { message: mapSupabaseErrorToMessage(error) }
        }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: { message: 'An unexpected error occurred' }
      }
    }
  }

  async signUp(credentials: SignUpData): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabaseClient.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name
          }
        }
      })

      if (error) {
        return {
          data: null,
          error: { message: mapSupabaseErrorToMessage(error) }
        }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: { message: 'An unexpected error occurred' }
      }
    }
  }

  async signOut(): Promise<AuthResult<void>> {
    try {
      const { error } = await this.supabaseClient.auth.signOut()

      if (error) {
        return { data: null, error: { message: mapSupabaseErrorToMessage(error) } }
      }

      return { data: null, error: null }
    } catch (error) {
      return { data: null, error: { message: 'An unexpected error occurred' } }
    }
  }

  async resetPassword(email: string): Promise<AuthResult<void>> {
    try {
      const options = this.redirectTo ? { redirectTo: this.redirectTo } : {}
      const { error } = await this.supabaseClient.auth.resetPasswordForEmail(email, options)

      if (error) {
        return { data: null, error: { message: mapSupabaseErrorToMessage(error) } }
      }

      return { data: null, error: null }
    } catch (error) {
      return { data: null, error: { message: 'An unexpected error occurred' } }
    }
  }
}
