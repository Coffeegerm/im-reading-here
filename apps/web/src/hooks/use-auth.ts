import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  type SignInData,
  type SignUpData,
  mapSupabaseErrorToMessage
} from '@im-reading-here/shared'

export function useAuth() {
  const [loading, setLoading] = useState(false)

  const signIn = async (credentials: SignInData) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
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
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (credentials: SignUpData) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
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
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        return { error: { message: mapSupabaseErrorToMessage(error) } }
      }

      return { error: null }
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        return { error: { message: mapSupabaseErrorToMessage(error) } }
      }

      return { error: null }
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }
}
