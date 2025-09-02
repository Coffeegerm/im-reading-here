"use client";
import { useAuthContext } from "@/components/auth/auth-provider";
import { BooksSearchCombobox } from "@/components/books/search-combobox";
import { HeaderBar } from "@/components/common/header-bar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function DashboardContent() {
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar />

      <BooksSearchCombobox />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Your Profile</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Name:</strong> {user?.name}
                </p>
                <p>
                  <strong>Plan:</strong> {user?.plan}
                </p>
                <p>
                  <strong>Shelves Visibility:</strong> {user?.shelvesVisibleTo}
                </p>
                <p>
                  <strong>Member since:</strong>{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Quick Actions</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20" variant="outline">
                    📚 Browse Books
                  </Button>
                  <Button className="h-20" variant="outline">
                    👥 Join a Club
                  </Button>
                  <Button className="h-20" variant="outline">
                    📖 My Reading Lists
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
