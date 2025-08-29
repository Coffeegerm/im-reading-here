import { useState, useMemo } from 'react'
import { AuthService } from '@im-reading-here/shared'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [loading, setLoading] = useState(false)

  const authService = useMemo(() => new AuthService({
    supabaseClient: supabase,
    // Mobile doesn't need redirectTo for password reset
  }), [])

  const signIn = async (credentials: { email: string; password: string }) => {
    setLoading(true)
    try {
      return await authService.signIn(credentials)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (credentials: { email: string; password: string; name: string }) => {
    setLoading(true)
    try {
      return await authService.signUp(credentials)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      return await authService.signOut()
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setLoading(true)
    try {
      return await authService.resetPassword(email)
    } finally {
      setLoading(false)
    }
  }

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    loading,
  }
}
