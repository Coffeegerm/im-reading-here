'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LoginSchema } from '../../lib/schemas';
import { z } from 'zod';
import { useLogin } from '../../hooks/use-auth-queries';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

type LoginFormData = z.infer<typeof LoginSchema>;

interface LoginFormProps {
  onToggleMode?: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const router = useRouter();
  const loginMutation = useLogin();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await loginMutation.mutateAsync(data);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="text-center space-y-2">
            <Button
              type="button"
              variant="link"
              className="text-sm"
              onClick={() => router.push('/auth/forgot-password')}
            >
              Forgot your password?
            </Button>

            {onToggleMode && (
              <div className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 text-blue-600 hover:text-blue-800"
                  onClick={onToggleMode}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
