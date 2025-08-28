import { LoginSchema, RegisterSchema, RefreshTokenSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../lib/schemas';
import { z } from 'zod';

type LoginData = z.infer<typeof LoginSchema>;
type RegisterData = z.infer<typeof RegisterSchema>;
type RefreshTokenData = z.infer<typeof RefreshTokenSchema>;
type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>;
type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    plan: string;
    emailVerified: boolean;
  };
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  plan: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

class AuthApi {
  private baseUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1`;

  async register(data: RegisterData): Promise<AuthResponse> {
    const url = `${this.baseUrl}/auth/register`;
    console.log('🚀 Making register request to:', url);
    console.log('📋 Base URL:', this.baseUrl);
    console.log('📧 Register data:', { email: data.email, name: data.name });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  }

  async refreshToken(data: RefreshTokenData): Promise<RefreshResponse> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Token refresh failed');
    }

    return response.json();
  }

  async logout(refreshToken: string): Promise<void> {
    await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
  }

  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset request failed');
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }
  }

  async verifyEmail(token: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/verify-email?token=${token}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Email verification failed');
    }
  }

  async getProfile(accessToken: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get profile');
    }

    return response.json();
  }
}

export const authApi = new AuthApi();
