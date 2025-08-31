import React, { createContext, useContext, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // Query for session and user
  const {
    data,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["supabase-session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session as Session | null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const session = data ?? null;
  const user = session?.user ?? null;

  // Mutation for signOut
  const signOutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supabase-session"] });
    },
    onError: (error: any) => {
      console.error("Error signing out:", error.message);
    },
  });

  // Listen for auth state changes and refetch session
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ["supabase-session"] });
      refetch();
    });
    return () => subscription.unsubscribe();
  }, [queryClient, refetch]);

  const signOut = async () => {
    await signOutMutation.mutateAsync();
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
