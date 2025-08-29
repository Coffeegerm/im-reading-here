import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import { createSupabaseMobileClient, type SupabaseMobileConfig } from '@im-reading-here/shared'

const supabaseConfig: SupabaseMobileConfig = {
  url: Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  anonKey: Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  storage: AsyncStorage,
}

export const supabase = createSupabaseMobileClient(supabaseConfig)

export default supabase
