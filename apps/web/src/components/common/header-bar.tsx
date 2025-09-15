"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/providers/auth-provider";

export const HeaderBar = () => {
  const { user, signOut } = useAuthContext();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-surface shadow border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/dashboard" className="text-3xl font-bold text-text">
            Dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-text-muted">Welcome, {user?.name}!</span>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
