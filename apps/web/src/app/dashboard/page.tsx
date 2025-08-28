'use client';

import { useProfile, useLogout } from '../../hooks/use-auth-queries';
import { AuthGuard } from '../../components/auth/auth-guard';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export default function DashboardPage() {
  const { data: user } = useProfile();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">
                I'm Reading Here
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user?.name}
                </span>
                <Button variant="outline" onClick={handleLogout} disabled={logoutMutation.isPending}>
                  {logoutMutation.isPending ? 'Signing out...' : 'Logout'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Plan:</strong> {user?.plan}</p>
                    <p><strong>Email Verified:</strong> {user?.emailVerified ? 'Yes' : 'No'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Shelves</CardTitle>
                  <CardDescription>Organize your books</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      📚 To Be Read
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      ✅ Read
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      ❌ Did Not Finish
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Clubs</CardTitle>
                  <CardDescription>Book clubs you're part of</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-center py-4">
                    No clubs yet. Create or join a club to get started!
                  </p>
                  <Button className="w-full">
                    Create Club
                  </Button>
                </CardContent>
              </Card>
            </div>

            {!user?.emailVerified && (
              <Card className="mt-6 border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-yellow-800">
                        Please verify your email address to access all features.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Resend Verification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
