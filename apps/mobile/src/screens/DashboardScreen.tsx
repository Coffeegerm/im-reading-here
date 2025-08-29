import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import { useAuthContext } from '../contexts/AuthContext'

export default function DashboardScreen() {
  const { user, signOut } = useAuthContext()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white border-b border-neutral-200 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-neutral-900">
                Welcome back!
              </Text>
              <Text className="text-neutral-600 mt-1">
                {user?.user_metadata?.name || user?.email}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleSignOut}
              className="bg-danger-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView className="flex-1 px-4 py-6">
          {/* Quick Stats */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-neutral-900 mb-3">
              Your Reading Stats
            </Text>
            <View className="flex-row space-x-4">
              <View className="flex-1 bg-white rounded-lg p-4 border border-neutral-200">
                <Text className="text-2xl font-bold text-primary-600">12</Text>
                <Text className="text-neutral-600 text-sm">Books Read</Text>
              </View>
              <View className="flex-1 bg-white rounded-lg p-4 border border-neutral-200">
                <Text className="text-2xl font-bold text-secondary-600">5</Text>
                <Text className="text-neutral-600 text-sm">To Read</Text>
              </View>
              <View className="flex-1 bg-white rounded-lg p-4 border border-neutral-200">
                <Text className="text-2xl font-bold text-warning-600">3</Text>
                <Text className="text-neutral-600 text-sm">Clubs</Text>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-neutral-900 mb-3">
              Recent Activity
            </Text>
            <View className="bg-white rounded-lg border border-neutral-200">
              <View className="p-4 border-b border-neutral-200">
                <Text className="font-medium text-neutral-900">
                  Added "The Midnight Library" to To Read
                </Text>
                <Text className="text-neutral-500 text-sm mt-1">2 hours ago</Text>
              </View>
              <View className="p-4 border-b border-neutral-200">
                <Text className="font-medium text-neutral-900">
                  Joined "Modern Fiction Book Club"
                </Text>
                <Text className="text-neutral-500 text-sm mt-1">1 day ago</Text>
              </View>
              <View className="p-4">
                <Text className="font-medium text-neutral-900">
                  Finished reading "Project Hail Mary"
                </Text>
                <Text className="text-neutral-500 text-sm mt-1">3 days ago</Text>
              </View>
            </View>
          </View>

          {/* Upcoming Meetings */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-neutral-900 mb-3">
              Upcoming Meetings
            </Text>
            <View className="bg-white rounded-lg p-4 border border-neutral-200">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-medium text-neutral-900">
                  Science Fiction Club
                </Text>
                <View className="bg-success-100 px-2 py-1 rounded-full">
                  <Text className="text-success-800 text-xs font-medium">Virtual</Text>
                </View>
              </View>
              <Text className="text-neutral-600 text-sm mb-2">
                Discussion: "Klara and the Sun"
              </Text>
              <Text className="text-neutral-500 text-sm">
                Tomorrow, 7:00 PM EST
              </Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-neutral-900 mb-3">
              Quick Actions
            </Text>
            <View className="space-y-3">
              <TouchableOpacity className="bg-primary-600 rounded-lg p-4 flex-row items-center justify-center">
                <Text className="text-white font-medium text-center">
                  Add New Book
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-secondary-600 rounded-lg p-4 flex-row items-center justify-center">
                <Text className="text-white font-medium text-center">
                  Browse Clubs
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="border border-neutral-300 rounded-lg p-4 flex-row items-center justify-center">
                <Text className="text-neutral-700 font-medium text-center">
                  View Reading Lists
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
