// Authentication constants

export const AUTH_CONSTANTS = {
  // Token expiration times
  ACCESS_TOKEN_EXPIRE: 60 * 60, // 1 hour
  REFRESH_TOKEN_EXPIRE: 60 * 60 * 24 * 7, // 7 days

  // Rate limiting
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes

  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBER: true,

  // Session management
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours

  // User plans
  FREE_CUSTOM_SHELVES_LIMIT: 2,
  FREE_CLUBS_LIMIT: 2,
} as const

export const AUTH_ERRORS = {
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Please enter a valid password',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORD_MISSING_UPPERCASE: 'Password must contain at least one uppercase letter',
  PASSWORD_MISSING_LOWERCASE: 'Password must contain at least one lowercase letter',
  PASSWORD_MISSING_NUMBER: 'Password must contain at least one number',
  PASSWORDS_DONT_MATCH: "Passwords don't match",
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  EMAIL_NOT_CONFIRMED: 'Please check your email and click the confirmation link',
  TOO_MANY_ATTEMPTS: 'Too many login attempts. Please try again later',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again',
  UNAUTHORIZED: 'You must be signed in to access this resource',
  FORBIDDEN: 'You do not have permission to access this resource',
} as const

export const SUPABASE_ERRORS = {
  EMAIL_NOT_CONFIRMED: 'Email not confirmed',
  INVALID_LOGIN_CREDENTIALS: 'Invalid login credentials',
  SIGNUP_DISABLED: 'Signup is disabled',
  WEAK_PASSWORD: 'Password should be at least 6 characters',
  EMAIL_ALREADY_REGISTERED: 'User already registered',
} as const
