'use client';

import { useProfile, useLogin, useRegister, useLogout, useRefreshToken } from './use-auth-queries';

export function useAuth() {
  const { data: user, isLoading, error } = useProfile();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const refreshMutation = useRefreshToken();

  // Safe localStorage access
  const getAccessToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  };

  const isAuthenticated = !!user && !!getAccessToken();

  const login = async (email: string, password: string) => {
    return loginMutation.mutateAsync({ email, password });
  };

  const register = async (email: string, password: string, name: string) => {
    return registerMutation.mutateAsync({ email, password, name });
  };

  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  const refreshTokens = async () => {
    return refreshMutation.mutateAsync();
  };

  return {
    user,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    isAuthenticated,
    login,
    register,
    logout,
    refreshTokens,

    // Mutation states for more granular loading/error handling
    loginState: {
      isLoading: loginMutation.isPending,
      error: loginMutation.error,
    },
    registerState: {
      isLoading: registerMutation.isPending,
      error: registerMutation.error,
    },
    logoutState: {
      isLoading: logoutMutation.isPending,
      error: logoutMutation.error,
    },
  };
}
