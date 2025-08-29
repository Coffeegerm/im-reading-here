import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { useAuth } from '../hooks/use-auth'

export default function AuthScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const { signIn, signUp, loading } = useAuth()

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    try {
      let result
      if (isSignUp) {
        if (!name) {
          Alert.alert('Error', 'Please enter your name')
          return
        }
        result = await signUp({ email, password, name })
      } else {
        result = await signIn({ email, password })
      }

      if (result.error) {
        Alert.alert('Error', result.error.message)
      }
      // No need for success alert - auth context will handle navigation
    } catch (error) {
      Alert.alert('Error', 'Something went wrong')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-center text-neutral-900 mb-2">
              I'm Reading Here
            </Text>
            <Text className="text-neutral-600 text-center">
              {isSignUp ? 'Create your account to get started' : 'Welcome back! Please sign in to continue'}
            </Text>
          </View>

          <View className="space-y-4">
            <Text className="text-2xl font-semibold text-neutral-900">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Text>

            {isSignUp && (
              <TextInput
                className="bg-white border border-neutral-300 rounded-lg px-4 py-3 text-base"
                placeholder="Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            )}

            <TextInput
              className="bg-white border border-neutral-300 rounded-lg px-4 py-3 text-base"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              className="bg-white border border-neutral-300 rounded-lg px-4 py-3 text-base"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              className={`rounded-lg px-4 py-3 ${loading ? 'bg-primary-400' : 'bg-primary-600'} items-center`}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-base font-semibold">
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center py-3"
              onPress={() => setIsSignUp(!isSignUp)}
            >
              <Text className="text-primary-600 text-base">
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
