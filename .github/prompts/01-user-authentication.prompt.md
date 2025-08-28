# User Authentication Implementation Plan

## Overview
Implement comprehensive user authentication system for the "Im Reading Here" book club management platform using JWT-based authentication with short TTL and refresh token pattern.

## Tech Stack Selection
- **Primary**: JWT tokens with refresh token rotation
- **Alternative Options**: Clerk, Auth0, or Supabase Auth (for faster implementation)
- **Database**: PostgreSQL with Prisma ORM
- **Security**: bcrypt for password hashing, rate limiting, CORS

## Implementation Plan

### Phase 1: Database Schema & Models

#### 1.1 Extend User Model in Prisma Schema
```prisma
model User {
  id               String   @id @default(uuid()) @db.Uuid
  email            String   @unique
  name             String
  avatarUrl        String?  @map("avatar_url")
  plan             String   @default("FREE") // FREE | PREMIUM
  shelvesVisibleTo String   @default("club") @map("shelves_visible_to")

  // Authentication fields
  passwordHash     String?  @map("password_hash") // nullable for OAuth users
  emailVerified    Boolean  @default(false) @map("email_verified")
  emailVerifyToken String?  @unique @map("email_verify_token")
  passwordResetToken String? @unique @map("password_reset_token")
  passwordResetExpires DateTime? @map("password_reset_expires")
  lastLoginAt      DateTime? @map("last_login_at")

  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  // Relations
  refreshTokens RefreshToken[]
  shelves       Shelf[]
  customShelves CustomShelf[]
  clubs         Club[]        @relation("ClubOwner")
  memberships   Membership[]
  pollsCreated  Poll[]        @relation("PollCreator")
  pollOptions   PollOption[]  @relation("PollProposer")
  votes         Vote[]
  rsvps         Rsvp[]

  @@map("users")
}

model RefreshToken {
  id        String   @id @default(uuid()) @db.Uuid
  token     String   @unique
  userId    String   @map("user_id") @db.Uuid
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")
  revokedAt DateTime? @map("revoked_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
}
```

#### 1.2 OAuth Provider Support (Future)
```prisma
enum OAuthProvider {
  GOOGLE
  GITHUB
  APPLE
}

model OAuthAccount {
  id           String        @id @default(uuid()) @db.Uuid
  userId       String        @map("user_id") @db.Uuid
  provider     OAuthProvider
  providerAccountId String   @map("provider_account_id")
  accessToken  String?       @map("access_token")
  refreshToken String?       @map("refresh_token")
  expiresAt    DateTime?     @map("expires_at")
  createdAt    DateTime      @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("oauth_accounts")
}
```

### Phase 2: Backend Authentication Module

#### 2.1 Install Required Dependencies
```bash
# Core authentication packages
pnpm add --workspace=apps/api @nestjs/jwt @nestjs/passport passport passport-local passport-jwt
pnpm add --workspace=apps/api bcrypt class-validator class-transformer
pnpm add --workspace=apps/api @nestjs/throttler nodemailer

# Dev dependencies
pnpm add --workspace=apps/api -D @types/bcrypt @types/passport-local @types/passport-jwt @types/nodemailer
```

#### 2.2 Auth Module Structure
```
src/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── dto/
│   ├── login.dto.ts
│   ├── register.dto.ts
│   ├── refresh-token.dto.ts
│   ├── forgot-password.dto.ts
│   └── reset-password.dto.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   ├── local-auth.guard.ts
│   └── optional-auth.guard.ts
├── strategies/
│   ├── jwt.strategy.ts
│   └── local.strategy.ts
├── decorators/
│   ├── current-user.decorator.ts
│   └── public.decorator.ts
└── interfaces/
    ├── jwt-payload.interface.ts
    └── auth-response.interface.ts
```

#### 2.3 Core Authentication Services

**JWT Configuration:**
- Access Token: 15 minutes TTL
- Refresh Token: 7 days TTL
- Rotation on refresh for security

**Key Features:**
- Password-based registration/login
- Email verification
- Password reset flow
- Refresh token rotation
- Rate limiting (5 login attempts per minute)
- CORS configuration

#### 2.4 API Endpoints
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
POST /api/v1/auth/verify-email
GET  /api/v1/auth/me
```

### Phase 3: Frontend Integration

#### 3.1 Web App (Next.js) Integration
```typescript
// Auth context and hooks
src/hooks/use-auth.ts
src/hooks/use-auth-redirect.ts

// API integration with TanStack Query
src/api/auth.api.ts
src/queries/auth.queries.ts

// Authentication components
src/components/auth/
├── login-form.tsx
├── register-form.tsx
├── forgot-password-form.tsx
├── reset-password-form.tsx
└── auth-guard.tsx

// Pages
src/app/(auth)/
├── login/page.tsx
├── register/page.tsx
├── forgot-password/page.tsx
└── reset-password/page.tsx
```

#### 3.2 Token Management
- Store tokens in httpOnly cookies (preferred) or secure localStorage
- Automatic refresh token rotation
- Logout on token expiry
- Persistent login state across tabs

### Phase 4: Security Implementation

#### 4.1 Security Features
- **Password Requirements**: Minimum 8 characters, mixed case, numbers
- **Rate Limiting**: Prevent brute force attacks
- **CSRF Protection**: SameSite cookies
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection Prevention**: Parameterized queries via Prisma

#### 4.2 Environment Variables
```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@imreadinghere.com
SMTP_PASS=your-smtp-password
FROM_EMAIL=noreply@imreadinghere.com

# Application URLs
API_URL=http://localhost:3001
WEB_URL=http://localhost:3000
```

### Phase 5: Testing Strategy

#### 5.1 Backend Tests
- Unit tests for auth service methods
- Integration tests for auth endpoints
- E2E tests for complete auth flows
- Security penetration testing

#### 5.2 Frontend Tests
- Component testing for auth forms
- Integration tests with MSW for API mocking
- E2E tests with Playwright for auth flows

### Phase 6: User Experience Features

#### 6.1 Registration Flow
1. User fills registration form
2. Server validates input and creates user
3. Email verification sent
4. User clicks verification link
5. Account activated, user redirected to onboarding

#### 6.2 Login Flow
1. User enters credentials
2. Server validates and returns access + refresh tokens
3. Frontend stores tokens securely
4. User redirected to dashboard
5. Auto-refresh tokens before expiry

#### 6.3 Password Reset Flow
1. User requests password reset
2. Server sends reset email with token
3. User clicks link, enters new password
4. Password updated, user can log in

### Phase 7: Deployment Considerations

#### 7.1 Production Security
- HTTPS enforcement
- Secure cookie configuration
- Environment-specific JWT secrets
- Rate limiting configuration
- CORS whitelist for production domains

#### 7.2 Database Migration
```bash
# Create and apply authentication migration
pnpm --filter=api exec prisma migrate dev --name add-authentication
pnpm --filter=api exec prisma generate
```

### Phase 8: Future Enhancements

#### 8.1 OAuth Integration
- Google OAuth for quick registration
- GitHub OAuth for developer users
- Apple Sign-In for iOS users

#### 8.2 Advanced Security
- Two-factor authentication (2FA)
- Device tracking and suspicious login alerts
- Session management and concurrent login limits
- Account lockout after failed attempts

#### 8.3 User Experience Improvements
- Social login options
- Remember me functionality
- Passwordless login via magic links
- Progressive web app (PWA) support

## Success Criteria

### MVP Requirements
- [x] User registration with email verification
- [x] Secure login with JWT tokens
- [x] Password reset functionality
- [x] Protected routes and API endpoints
- [x] Automatic token refresh
- [x] Proper error handling and validation

### Security Requirements
- [x] Password hashing with bcrypt
- [x] Rate limiting on auth endpoints
- [x] Input validation and sanitization
- [x] CSRF protection
- [x] Secure token storage

### User Experience Requirements
- [x] Intuitive registration/login forms
- [x] Clear error messages
- [x] Loading states and feedback
- [x] Responsive design
- [x] Accessibility compliance

## Implementation Timeline

**Week 1**: Database schema and Prisma migration
**Week 2**: Backend auth module and API endpoints
**Week 3**: Frontend auth components and integration
**Week 4**: Security hardening and testing
**Week 5**: Email integration and production deployment

## Risk Mitigation

- **Data Security**: Implement proper encryption and secure storage
- **Performance**: Use efficient queries and caching strategies
- **Scalability**: Design for horizontal scaling with stateless JWT
- **Maintenance**: Comprehensive logging and monitoring
- **Compliance**: Follow GDPR and privacy best practices

This authentication system will provide a solid foundation for the "Im Reading Here" platform while maintaining security, usability, and scalability requirements.
