'use client';

import { useProfile } from '../hooks/use-auth-queries';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import Link from 'next/link';

export default function HomePage() {
  const { data: user, isLoading, error } = useProfile();
  const isAuthenticated = !!user && !error;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              I'm Reading Here
            </h1>
            <div className="space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-700">
                    Welcome back, {user?.name}
                  </span>
                  <Link href="/dashboard">
                    <Button>Go to Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/login">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Book Club Management
            <span className="block text-blue-600">Made Simple</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Organize your reading groups, track books, schedule meetings, and vote on selections.
            Everything you need to run amazing book clubs.
          </p>

          {!isAuthenticated && (
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Your Club Today
                  </Button>
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  📚
                </div>
                <CardTitle className="text-center">Organize Your Books</CardTitle>
                <CardDescription className="text-center">
                  Create custom shelves, track reading progress, and rate your favorites
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• To Be Read (TBR) lists</li>
                  <li>• Reading progress tracking</li>
                  <li>• Personal ratings & reviews</li>
                  <li>• Custom book collections</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                  👥
                </div>
                <CardTitle className="text-center">Manage Your Clubs</CardTitle>
                <CardDescription className="text-center">
                  Create public or private clubs with different member roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Public & private clubs</li>
                  <li>• Member management</li>
                  <li>• Admin & owner roles</li>
                  <li>• Club discovery</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                  🗳️
                </div>
                <CardTitle className="text-center">Democratic Selection</CardTitle>
                <CardDescription className="text-center">
                  Vote on book selections with approval or ranked-choice voting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Book nomination system</li>
                  <li>• Approval voting (Free)</li>
                  <li>• Ranked-choice voting (Premium)</li>
                  <li>• Meeting scheduling</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Plans Section */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
            <p className="mt-4 text-lg text-gray-600">
              Start free and upgrade when you're ready for more features
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 lg:max-w-4xl lg:mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">Free</CardTitle>
                <CardDescription className="text-center">
                  Perfect for getting started
                </CardDescription>
                <div className="text-center">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Core book shelves (TBR, Read, DNF)
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    2 custom book lists
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    2 clubs created/administered
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Approval voting
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Basic meeting scheduling
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-blue-600">Premium</CardTitle>
                <CardDescription className="text-center">
                  For serious book club organizers
                </CardDescription>
                <div className="text-center">
                  <span className="text-4xl font-bold">$6</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Everything in Free
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Unlimited custom lists
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Unlimited clubs
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Ranked-choice voting
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Multi-meeting reading plans
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Export capabilities (CSV/ICS)
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Ready to Get Started?</h2>
            <p className="mt-4 text-lg text-gray-600">
              Join thousands of book lovers organizing amazing reading communities
            </p>
            <div className="mt-8">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-3">
                  Create Your Account
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2025 I'm Reading Here. Built for book lovers, by book lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
