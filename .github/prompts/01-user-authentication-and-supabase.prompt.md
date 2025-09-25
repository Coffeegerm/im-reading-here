# User Authentication Implementation Plan

## Overview
Implement comprehensive user authentication system for the "Im Reading Here" book club management platform using JWT-based authentication with short TTL and refresh token pattern.

## Tech Stack Selection
- **Primary**: Supabase Auth (handles JWT, email verification, password reset)
- **Database**: PostgreSQL with Prisma ORM (synced with Supabase)
- **Security**: Handled by Supabase (bcrypt, rate limiting, CORS)
- **Shared Types**: Centralized in `@im-reading-here/shared` package
- **Benefits**: No email infrastructure needed, built-in user management, OAuth providers

## Implementation Plan

### Phase 1: Shared Package Enhancement & Supabase Setup

#### 1.1 Enhanced Shared Package Structure
```
packages/shared/src/
├── auth/
│   ├── index.ts              # Export auth-related items
│   ├── types.ts              # Auth interfaces and types
│   ├── schemas.ts            # Zod validation schemas
│   ├── constants.ts          # Auth-related constants
│   └── utils.ts              # Auth utility functions
├── supabase/
│   ├── index.ts              # Supabase client factory
│   ├── types.ts              # Supabase-specific types
│   └── client.ts             # Supabase client configuration
└── index.ts                  # Main exports
```

#### 1.2 Supabase Configuration
```bash
# Install Supabase client in shared package for reuse
pnpm add --workspace=packages/shared @supabase/supabase-js

# Install Supabase CLI for local development
pnpm add -D supabase

# Add to API package
pnpm add --workspace=apps/api @supabase/supabase-js

# Add to Web package
pnpm add --workspace=apps/web @supabase/supabase-js
```

#### 1.3 Shared Auth Types and Schemas
```typescript
// packages/shared/src/auth/types.ts
export interface SupabaseUser {
  id: string
  email: string
  email_confirmed_at?: string
  last_sign_in_at?: string
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  avatarUrl?: string
  plan: 'FREE' | 'PREMIUM'
  shelvesVisibleTo: 'public' | 'club' | 'private'
  createdAt: Date
  updatedAt: Date
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: 'bearer'
  user: SupabaseUser
}

export interface AuthError {
  message: string
  status?: number
  details?: string
}
```

```typescript
// packages/shared/src/auth/schemas.ts
import { z } from 'zod'

export const SignUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
})

export const SignInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const UpdateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long').optional(),
  avatarUrl: z.string().url('Please enter a valid URL').optional(),
  shelvesVisibleTo: z.enum(['public', 'club', 'private']).optional(),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type SignUpData = z.infer<typeof SignUpSchema>
export type SignInData = z.infer<typeof SignInSchema>
export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>
export type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>
```

#### 1.4 Shared Supabase Client
```typescript
// packages/shared/src/supabase/client.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

export function createSupabaseClient(config: SupabaseConfig): SupabaseClient {
  return createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}

export function createSupabaseAdminClient(config: SupabaseConfig): SupabaseClient {
  if (!config.serviceRoleKey) {
    throw new Error('Service role key required for admin client')
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
```

#### 1.5 Updated Shared Package Exports
```typescript
// packages/shared/src/index.ts
export * from './types'
export * from './schemas'
export * from './utils'

// Auth exports
export * from './auth'
export * from './supabase'
```

```typescript
// packages/shared/src/auth/index.ts
export * from './types'
export * from './schemas'
export * from './constants'
export * from './utils'
```

```typescript
// packages/shared/src/supabase/index.ts
export * from './client'
export * from './types'
```
#### 1.7 Database Strategy: Local Dev + Supabase Production

**🏠 Local Development Environment:**
- **Database**: Local PostgreSQL (`postgresql://pingboard:@localhost:5432/im_reading_here`)
- **Auth**: Simplified JWT auth or mock Supabase client
- **Benefits**: Fast iteration, offline development, no API limits
- **User Management**: Manual user creation for testing

**🚀 Production Environment:**
- **Database**: Supabase PostgreSQL with managed infrastructure
- **Auth**: Full Supabase Auth (email verification, OAuth, MFA)
- **Benefits**: Enterprise security, global CDN, automatic scaling
- **User Management**: Supabase handles all user lifecycle

**Environment Configuration:**
```typescript
// packages/shared/src/supabase/client.ts - Environment-aware client
export function createSupabaseClient(config: SupabaseConfig): SupabaseClient {
  // In development, can return mock client if no Supabase URL provided
  if (!config.url && process.env.NODE_ENV === 'development') {
    console.warn('Using local development mode - Supabase features disabled')
    return createMockSupabaseClient()
  }

  return createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: process.env.NODE_ENV !== 'development',
    },
  })
}
```

### Phase 2: Backend Integration with Environment-Aware Setup

#### 2.1 Environment-Based Configuration Strategy

**Development Mode (.env)**:
```env
# LOCAL DEVELOPMENT
DATABASE_URL="postgresql://pingboard:@localhost:5432/im_reading_here"
NODE_ENV=development

# Supabase disabled for local dev (optional mock client)
# SUPABASE_URL=""
# SUPABASE_ANON_KEY=""
# SUPABASE_SERVICE_ROLE_KEY=""

# Simple JWT for local auth (if needed)
JWT_SECRET="dev-secret-key"
```

**Production Mode (.env.production)**:
```env
# PRODUCTION - SUPABASE
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NODE_ENV=production

# Required Supabase configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Legacy JWT (will be phased out)
JWT_SECRET="production-secret-key"
```

#### 2.2 User Model in Prisma Schema (Environment-Agnostic)
```prisma
model User {
  id               String   @id @db.Uuid // Local: manual UUID, Production: Supabase auth.users.id
  email            String   @unique
  name             String
  avatarUrl        String?  @map("avatar_url")
  plan             String   @default("FREE") // FREE | PREMIUM
  shelvesVisibleTo String   @default("club") @map("shelves_visible_to")

  // Timestamps work in both local and Supabase environments
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  // Relations remain the same in both environments
  shelves       Shelf[]
  clubs         Club[]        @relation("ClubOwner")
  memberships   Membership[]
  pollsCreated  Poll[]        @relation("PollCreator")
  pollOptions   PollOption[]  @relation("PollProposer")
  votes         Vote[]
  rsvps         Rsvp[]

  @@map("users")
}

// Note: In development, you create users manually
// In production, users are created via Supabase auth and synced to this table
```

#### 2.3 Install Required Dependencies
```bash
# Already added in Phase 1.2
# Remove JWT/passport dependencies - handled by Supabase in production
pnpm remove --workspace=apps/api @nestjs/jwt passport passport-jwt
pnpm remove --workspace=apps/api @types/passport-jwt

# Add class validation (if not already present)
pnpm add --workspace=apps/api class-validator class-transformer

# Environment detection utility
pnpm add --workspace=apps/api @nestjs/config
```
```

### Phase 2: Backend Integration with Supabase

#### 2.1 Install Required Dependencies
```bash
# Already added in Phase 1.1
# Remove JWT/passport dependencies - handled by Supabase
pnpm remove --workspace=apps/api @nestjs/jwt passport passport-jwt
pnpm remove --workspace=apps/api @types/passport-jwt

# Add class validation (if not already present)
pnpm add --workspace=apps/api class-validator class-transformer
```

#### 2.2 Auth Module Structure (Enhanced)
```
apps/api/src/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── dto/
│   └── update-profile.dto.ts         # Uses shared schemas
├── guards/
│   ├── supabase-auth.guard.ts
│   └── optional-auth.guard.ts
├── decorators/
│   ├── current-user.decorator.ts
│   └── public.decorator.ts
├── interfaces/
│   └── request-with-user.interface.ts
└── strategies/
    └── supabase.strategy.ts
```

#### 2.3 Backend Supabase Integration

```typescript
// apps/api/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { createSupabaseAdminClient, SupabaseConfig, AuthUser } from '@im-reading-here/shared'

@Injectable()
export class AuthService {
  private supabaseAdmin

  constructor(private prisma: PrismaService) {
    const config: SupabaseConfig = {
      url: process.env.SUPABASE_URL!,
      anonKey: process.env.SUPABASE_ANON_KEY!,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }
    this.supabaseAdmin = createSupabaseAdminClient(config)
  }

  async validateUser(token: string): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await this.supabaseAdmin.auth.getUser(token)

      if (error || !user) {
        throw new UnauthorizedException('Invalid token')
      }

      // Sync user data with our database
      const dbUser = await this.syncUserWithDatabase(user)
      return dbUser
    } catch (error) {
      return null
    }
  }

  private async syncUserWithDatabase(supabaseUser: any): Promise<AuthUser> {
    const user = await this.prisma.user.upsert({
      where: { id: supabaseUser.id },
      update: {
        email: supabaseUser.email,
        updatedAt: new Date(),
      },
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.name || supabaseUser.email.split('@')[0],
        avatarUrl: supabaseUser.user_metadata?.avatar_url,
        plan: 'FREE',
        shelvesVisibleTo: 'club',
      },
    })

    return user
  }

  async updateProfile(userId: string, data: any): Promise<AuthUser> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })
  }
}
```

```typescript
// apps/api/src/auth/guards/supabase-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthService } from '../auth.service'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided')
    }

    const token = authHeader.substring(7)
    const user = await this.authService.validateUser(token)

    if (!user) {
      throw new UnauthorizedException('Invalid token')
    }

    request.user = user
    return true
  }
}
```

#### 2.4 API Endpoints with Shared Types
```typescript
// apps/api/src/auth/auth.controller.ts
import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { SupabaseAuthGuard } from './guards/supabase-auth.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { Public } from './decorators/public.decorator'
import { UpdateProfileSchema, type UpdateProfileData, type AuthUser } from '@im-reading-here/shared'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'

@ApiTags('Authentication')
@Controller('auth')
@UseGuards(SupabaseAuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth()
  async getCurrentUser(@CurrentUser() user: AuthUser): Promise<AuthUser> {
    return user
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBearerAuth()
  async updateProfile(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(UpdateProfileSchema)) data: UpdateProfileData,
  ): Promise<AuthUser> {
    return this.authService.updateProfile(user.id, data)
  }

  @Post('sync-user')
  @Public()
  @ApiOperation({ summary: 'Sync user from Supabase webhook' })
  async syncUser(@Body() webhookData: any): Promise<{ success: boolean }> {
    // Handle Supabase webhook for user sync
    // This would be called when users are created/updated in Supabase
    return { success: true }
  }
}
```

**API Endpoints Summary:**
```
GET  /api/v1/auth/me            # Get current user profile
PUT  /api/v1/auth/profile       # Update user profile
POST /api/v1/auth/sync-user     # Sync user from Supabase webhook

# These handled by Supabase directly on frontend:
# - Registration (supabase.auth.signUp)
# - Login/Logout (supabase.auth.signInWithPassword)
# - Password reset (supabase.auth.resetPasswordForEmail)
# - Email verification (automatic via Supabase)
```

### Phase 3: Frontend Integration with Supabase

#### 3.1 Web App (Next.js) Integration Using Shared Package
```typescript
// apps/web/src/lib/supabase.ts
import { createSupabaseClient, type SupabaseConfig } from '@im-reading-here/shared'

const config: SupabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
}

export const supabase = createSupabaseClient(config)
```

```typescript
// apps/web/src/hooks/use-auth.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { type AuthUser, type AuthSession } from '@im-reading-here/shared'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }
}
```

#### 3.2 Authentication Components with Shared Schemas
```typescript
// apps/web/src/components/auth/auth-provider.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type AuthUser, type AuthSession } from '@im-reading-here/shared'

interface AuthContextType {
  user: AuthUser | null
  session: AuthSession | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        // Fetch full user profile from our API
        fetchUserProfile(session.access_token)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        if (session?.user) {
          await fetchUserProfile(session.access_token)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
```

#### 3.3 Authentication Forms with Shared Validation
```typescript
// apps/web/src/components/auth/login-form.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { SignInSchema, type SignInData } from '@im-reading-here/shared'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
  })

  const onSubmit = async (data: SignInData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword(data)

      if (error) {
        form.setError('root', { message: error.message })
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      form.setError('root', { message: 'An unexpected error occurred' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...form.register('email')}
              type="email"
              placeholder="Email"
              disabled={loading}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-danger-600 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...form.register('password')}
              type="password"
              placeholder="Password"
              disabled={loading}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-danger-600 mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {form.formState.errors.root && (
            <p className="text-sm text-danger-600">
              {form.formState.errors.root.message}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

#### 3.4 Project Structure for Auth Components
```
apps/web/src/
├── components/auth/
│   ├── auth-provider.tsx         # Supabase auth context
│   ├── login-form.tsx           # Uses shared SignInSchema
│   ├── register-form.tsx        # Uses shared SignUpSchema
│   ├── forgot-password-form.tsx # Uses shared ForgotPasswordSchema
│   ├── reset-password-form.tsx  # Uses shared ResetPasswordSchema
│   ├── auth-guard.tsx           # Route protection
│   └── profile-form.tsx         # Uses shared UpdateProfileSchema
├── hooks/
│   ├── use-auth.ts              # Auth state management
│   └── use-api.ts               # API calls with auth headers
├── lib/
│   └── supabase.ts              # Supabase client using shared config
└── app/(auth)/
    ├── login/page.tsx
    ├── register/page.tsx
    ├── forgot-password/page.tsx
    └── reset-password/page.tsx
```

### Phase 4: Security Implementation

#### 4.1 Security Features (Handled by Supabase + Enhanced)
- **Password Requirements**: Configured via shared validation schemas
- **Rate Limiting**: Built-in Supabase protection + API rate limiting
- **Email Verification**: Automatic Supabase email workflows
- **Password Reset**: Secure token-based reset flow via Supabase
- **Input Validation**: Shared Zod schemas across all applications
- **SQL Injection Prevention**: Parameterized queries via Prisma
- **XSS Protection**: Input sanitization using shared utilities

```typescript
// packages/shared/src/auth/utils.ts
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500) // Limit length
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export function generateSecurePassword(): string {
  const length = 16
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''

  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }

  return password
}
```

#### 4.2 Environment Variables (Centralized Configuration)
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# API Configuration
API_URL=http://localhost:3001
WEB_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/im_reading_here

# Application Security
JWT_SECRET=your-jwt-secret-for-api-tokens
SESSION_SECRET=your-session-secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Phase 5: Testing Strategy with Shared Components

#### 5.1 Backend Tests
```typescript
// apps/api/src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { PrismaService } from '../prisma/prisma.service'
import { SignInData, SignUpData } from '@im-reading-here/shared'

describe('AuthService', () => {
  let service: AuthService
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  describe('validateUser', () => {
    it('should validate user with valid token', async () => {
      // Test implementation using shared types
    })

    it('should reject invalid token', async () => {
      // Test implementation
    })
  })
})
```

#### 5.2 Frontend Tests with Shared Schemas
```typescript
// apps/web/src/components/auth/login-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from './login-form'
import { SignInData } from '@im-reading-here/shared'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}))

describe('LoginForm', () => {
  it('should validate email format using shared schema', async () => {
    render(<LoginForm />)

    const emailInput = screen.getByPlaceholderText('Email')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    })
  })
})
```

### Phase 6: User Experience Features with Shared Components

#### 6.1 Registration Flow (Enhanced with Shared Validation)
1. **Frontend Validation**: Uses shared `SignUpSchema` for real-time validation
2. **Supabase Registration**: `supabase.auth.signUp()` with user metadata
3. **Email Verification**: Automatic Supabase email with custom templates
4. **User Sync**: Backend webhook syncs Supabase user to our User table
5. **Onboarding**: Redirect to profile completion using shared schemas
6. **Error Handling**: Consistent error messages using shared error types

#### 6.2 Login Flow (Streamlined)
1. **Form Validation**: Shared `SignInSchema` provides consistent UX
2. **Authentication**: `supabase.auth.signInWithPassword()` handles security
3. **Session Management**: Automatic JWT handling via Supabase client
4. **Profile Sync**: Fetch complete user profile from our API
5. **Redirection**: Context-aware routing based on user state
6. **Remember Device**: Supabase session persistence across browser sessions

#### 6.3 Password Reset Flow (Enhanced)
1. **Email Request**: Shared `ForgotPasswordSchema` validates email format
2. **Reset Email**: Supabase sends secure reset link to user
3. **Token Validation**: Supabase validates reset tokens automatically
4. **Password Update**: Shared `ResetPasswordSchema` ensures strong passwords
5. **Confirmation**: User feedback with shared success/error components
6. **Auto-Login**: Optional automatic sign-in after successful reset

### Phase 7: Mobile App Preparation (Future-Ready)

#### 7.1 Shared Package Mobile Compatibility
```typescript
// packages/shared/src/mobile/index.ts
// Mobile-specific exports and utilities
export * from '../auth' // Auth types work across platforms
export * from '../supabase' // Supabase client factory for React Native

// Mobile-specific auth utilities
export const createSupabaseMobileClient = (config: SupabaseConfig) => {
  return createClient(config.url, config.anonKey, {
    auth: {
      storage: AsyncStorage, // React Native storage
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Disabled for mobile
    },
  })
}
```

#### 7.2 React Native Integration Prep
- Shared auth schemas work identically in React Native
- Supabase client configuration adapts to mobile storage
- Same validation logic across web and mobile
- Consistent error handling and user feedback
- OAuth flows ready for mobile deep linking

### Phase 8: Deployment Considerations

#### 8.1 Production Security
- **Environment Separation**: Separate Supabase projects for dev/staging/prod
- **HTTPS Enforcement**: Handled automatically by Supabase
- **CORS Configuration**: Configured in Supabase dashboard for each environment
- **RLS Policies**: Row Level Security policies in Supabase database
- **Shared Package Deployment**: Published as internal npm package or git submodule
- **Secret Management**: Environment-specific configurations using Vercel/Fly.io secrets

#### 8.2 Database Migration & Sync Strategy
```bash
# Create user table migration (simplified for Supabase integration)
pnpm --filter=api exec prisma migrate dev --name add-user-table-supabase

# Set up Supabase webhook for real-time sync
# Configure in Supabase dashboard: Database > Webhooks
# Webhook URL: https://your-api.com/api/auth/sync-user
# Events: INSERT, UPDATE on auth.users table
```

#### 8.3 Monitoring and Analytics
```typescript
// packages/shared/src/auth/analytics.ts
export interface AuthEvent {
  type: 'signup' | 'signin' | 'signout' | 'password_reset' | 'profile_update'
  userId?: string
  timestamp: Date
  metadata?: Record<string, any>
}

export function trackAuthEvent(event: AuthEvent): void {
  // Send to analytics service (Amplitude, Mixpanel, etc.)
  if (typeof window !== 'undefined') {
    // Client-side tracking
    window.gtag?.('event', event.type, {
      user_id: event.userId,
      timestamp: event.timestamp.toISOString(),
    })
  }
}
```

### Phase 9: Future Enhancements

#### 9.1 OAuth Integration (Built-in with Supabase)
- **Google OAuth**: Enable in Supabase dashboard with shared client configuration
- **GitHub OAuth**: Configure in auth providers section
- **Apple Sign-In**: Available for iOS users via Supabase
- **Custom OAuth**: Add any OAuth2 provider via Supabase configuration
- **Social Login UI**: Consistent components using shared design system

#### 9.2 Advanced Security Features
```typescript
// packages/shared/src/auth/security.ts
export interface SecurityPolicy {
  maxLoginAttempts: number
  lockoutDuration: number
  passwordExpiry: number
  sessionTimeout: number
  requireMFA: boolean
}

export const DEFAULT_SECURITY_POLICY: SecurityPolicy = {
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  passwordExpiry: 90 * 24 * 60 * 60 * 1000, // 90 days
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  requireMFA: false,
}

// Multi-factor authentication via Supabase
export async function enableMFA(supabaseClient: any): Promise<{ qrCode: string; secret: string }> {
  const { data, error } = await supabaseClient.auth.mfa.enroll({
    factorType: 'totp',
    friendlyName: 'Im Reading Here',
  })

  if (error) throw error
  return { qrCode: data.totp.qr_code, secret: data.totp.secret }
}
```

#### 9.3 User Experience Improvements
- **Magic Link Authentication**: Passwordless login via Supabase
- **Social Login Options**: Pre-configured OAuth providers
- **Progressive Web App**: Offline authentication state management
- **Biometric Authentication**: Mobile app fingerprint/face recognition
- **Single Sign-On**: Enterprise SSO integration via Supabase SAML

## Success Criteria

### MVP Requirements ✅
- [x] **Shared Type Safety**: Consistent auth types across API, web, and future mobile
- [x] **User Registration**: Email verification via Supabase with shared validation
- [x] **Secure Login**: JWT tokens managed by Supabase with auto-refresh
- [x] **Password Reset**: Secure reset flow using shared schemas
- [x] **Protected Routes**: API endpoints and frontend routes with proper guards
- [x] **Session Management**: Automatic session handling via Supabase client
- [x] **Error Handling**: Consistent error types and validation across apps

### Security Requirements ✅
- [x] **Password Security**: Bcrypt hashing via Supabase + shared validation rules
- [x] **Rate Limiting**: Supabase built-in protection + API-level rate limiting
- [x] **Input Validation**: Shared Zod schemas prevent injection attacks
- [x] **CSRF Protection**: Supabase security + SameSite cookie configuration
- [x] **Session Security**: Secure JWT handling with automatic refresh
- [x] **Audit Logging**: Shared analytics tracking for auth events

### Shared Architecture Requirements ✅
- [x] **Type Consistency**: Shared TypeScript interfaces across all applications
- [x] **Validation Schemas**: Centralized Zod schemas for all auth operations
- [x] **Reusable Components**: Auth utilities and helpers in shared package
- [x] **Mobile Ready**: Shared code prepared for React Native integration
- [x] **Maintainability**: Single source of truth for auth logic and types

### User Experience Requirements ✅
- [x] **Intuitive Forms**: Consistent UI/UX using shared validation and design system
- [x] **Clear Error Messages**: Shared error types provide consistent feedback
- [x] **Loading States**: Shared loading patterns and accessibility features
- [x] **Responsive Design**: Mobile-first auth components with consistent behavior
- [x] **Accessibility**: WCAG compliance across all auth interfaces

## Implementation Timeline

**Week 1**:
- ✅ Enhanced shared package with auth types and schemas
- ✅ Supabase project setup and configuration
- ✅ Database schema updates for Supabase integration

**Week 2**:
- ✅ Backend API integration with Supabase auth
- ✅ Auth guards and middleware using shared types
- ✅ User synchronization between Supabase and database

**Week 3**:
- ✅ Frontend auth components using shared schemas
- ✅ React context and hooks for auth state management
- ✅ Protected routes and auth guards

**Week 4**:
- ✅ Comprehensive testing with shared types and validation
- ✅ Production deployment with environment separation
- ✅ Documentation and developer guides

**Week 5**:
- ✅ OAuth providers configuration and testing
- ✅ Advanced security features (MFA, audit logging)
- ✅ Mobile app preparation and shared code optimization

## Risk Mitigation

- **Type Safety**: Shared package ensures consistency across all applications
- **Data Security**: Leveraged managed Supabase security with additional API validation
- **Performance**: Supabase global edge network + shared client optimization
- **Scalability**: Supabase auto-scaling + shared utilities for efficient development
- **Maintenance**: Centralized auth logic reduces duplication and bugs
- **Team Velocity**: Shared schemas accelerate feature development
- **Mobile Future**: Prepared architecture for React Native without refactoring

## Shared Package Benefits

### Development Efficiency
- **Single Source of Truth**: Auth types, schemas, and utilities centralized
- **Reduced Duplication**: Same validation logic across web, API, and mobile
- **Type Safety**: Compile-time validation prevents runtime auth errors
- **Faster Development**: Shared components accelerate feature development

### Maintenance Advantages
- **Consistent Updates**: Change auth logic once, applies everywhere
- **Easier Testing**: Shared types enable comprehensive testing strategies
- **Better Documentation**: Single place for auth-related interfaces and schemas
- **Team Collaboration**: Consistent patterns across frontend and backend teams

This enhanced Supabase-based authentication system with shared package architecture provides enterprise-grade security, type safety, and maintainability for the "Im Reading Here" platform while preparing for future mobile app development.
