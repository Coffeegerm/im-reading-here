'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthContext } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            I&apos;m Reading Here
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Book club management made simple
          </p>

          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
              <p className="text-muted-foreground mb-6">
                Join the community of book lovers and manage your reading clubs with ease.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/signup">Create Account</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/signin">Sign In</Link>
                </Button>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Features:</h3>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li>• 📚 Track your reading with personal shelves</li>
                <li>• 👥 Create and join book clubs</li>
                <li>• 📅 Schedule meetings and events</li>
                <li>• 🗳️ Vote on book selections</li>
                <li>• 📖 Discover new books to read</li>
                <li>• 💬 Connect with fellow readers</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
