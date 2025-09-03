import { useAuthContext } from "../../providers/auth-provider";

import { Button } from "@/components/ui/button";

export const HeaderBar = () => {
  const { user, signOut } = useAuthContext();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name}!</span>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
