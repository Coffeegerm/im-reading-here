"use client";
import { type AuthUser } from "@im-reading-here/shared";
import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { useAuthUser } from "@/hooks/use-auth";
import { apiClient } from "@/lib/api/api-client";
import { supabase } from "@/lib/supabase";

/**
 * Enhanced AuthProvider using React Query for better user data caching
 *
 * Benefits over previous implementation:
 * - User data is cached and automatically revalidated
 * - Avoids unnecessary API calls on component re-renders
 * - Better loading states (separates session loading from user loading)
 * - Automatic retry logic with smart error handling
 * - Cache is automatically cleared on sign out
 */

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Use React Query for user data with better caching
  const {
    data: user,
    isLoading: userLoading,
    clearUserData,
  } = useAuthUser(session?.access_token || null);

  // Combined loading state: session loading OR user loading (when we have a session)
  const loading = sessionLoading || (!!session && userLoading);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.access_token) {
        apiClient.setToken(session.access_token);
      }
      setSessionLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (session?.access_token) {
        apiClient.setToken(session.access_token);
      } else {
        apiClient.setToken(null);
        // Clear user data from React Query cache
        clearUserData();
      }

      setSessionLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [clearUserData]);

  const signOut = async () => {
    await supabase.auth.signOut();
    // Clear both session and user data
    setSession(null);
    clearUserData();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        session,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
