import { AuthService, type AuthUser } from "@im-reading-here/shared";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";

import { authClient } from "@/lib/api/auth-client";
import { supabase } from "@/lib/supabase";

export const authQueryKeys = {
  currentUser: ["auth", "currentUser"] as const,
} as const;

export function useAuthUser(token: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: authQueryKeys.currentUser,
    queryFn: () => authClient.getCurrentUser(),
    enabled: !!token, // Only fetch when we have a token
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error: any) => {
      // Don't retry on 401/403 errors (auth failures)
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const clearUserData = () => {
    queryClient.removeQueries({ queryKey: authQueryKeys.currentUser });
  };

  return {
    ...query,
    clearUserData,
  };
}

export function useAuth() {
  const [loading, setLoading] = useState(false);

  const authService = useMemo(
    () =>
      new AuthService({
        supabaseClient: supabase,
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/reset-password`,
      }),
    []
  );

  const signIn = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      return await authService.signIn(credentials);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (credentials: {
    email: string;
    password: string;
    name: string;
  }) => {
    setLoading(true);
    try {
      return await authService.signUp(credentials);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      return await authService.signOut();
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      return await authService.resetPassword(email);
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    loading,
  };
}
