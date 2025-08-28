'use client';

import { useState } from 'react';
import { LoginForm } from '../../../components/auth/login-form';
import { RegisterForm } from '../../../components/auth/register-form';
import { AuthGuard } from '../../../components/auth/auth-guard';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
