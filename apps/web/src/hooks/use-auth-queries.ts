import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, AuthResponse, User } from '../api/auth.api';
import { LoginSchema, RegisterSchema } from '../lib/schemas';
import { z } from 'zod';

type LoginData = z.infer<typeof LoginSchema>;
type RegisterData = z.infer<typeof RegisterSchema>;

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

// Get current user profile
export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (!accessToken) {
        throw new Error('No access token');
      }
      return authApi.getProfile(accessToken);
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    retry: (failureCount, error: any) => {
      // Don't retry if it's an auth error
      if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginData): Promise<AuthResponse> => {
      return authApi.login(data);
    },
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Cache the user data
      queryClient.setQueryData(authKeys.profile(), data.user);

      // Invalidate auth queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
}

// Register mutation
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterData): Promise<AuthResponse> => {
      return authApi.register(data);
    },
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Cache the user data
      queryClient.setQueryData(authKeys.profile(), data.user);

      // Invalidate auth queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    },
    onSuccess: () => {
      // Clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Clear all cached data
      queryClient.clear();

      // Note: AuthGuard will handle the redirect to '/' automatically
    },
    onError: (error) => {
      // Even if logout fails on server, clear local data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();

      // Note: AuthGuard will handle the redirect to '/' automatically

      console.error('Logout error (continuing anyway):', error);
    },
  });
}

// Refresh token mutation
export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      return authApi.refreshToken({ refreshToken });
    },
    onSuccess: (data) => {
      // Update tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Refetch profile with new token
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error) => {
      // Refresh failed, clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
      console.error('Token refresh failed:', error);
    },
  });
}

// Forgot password mutation
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      return authApi.forgotPassword({ email });
    },
  });
}

// Reset password mutation
export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: { token: string; password: string }) => {
      return authApi.resetPassword(data);
    },
  });
}

// Verify email mutation
export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) => {
      return authApi.verifyEmail(token);
    },
    onSuccess: () => {
      // Refetch profile to get updated emailVerified status
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}
