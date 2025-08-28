// Authentication utility functions

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

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

export function formatUserDisplayName(user: { name: string; email: string }): string {
  return user.name || user.email.split('@')[0]
}

export function isPasswordStrong(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  )
}

export function mapSupabaseErrorToMessage(error: any): string {
  if (!error?.message) return 'An unexpected error occurred'

  const message = error.message.toLowerCase()

  if (message.includes('email not confirmed')) {
    return 'Please check your email and click the confirmation link'
  }

  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password'
  }

  if (message.includes('user already registered')) {
    return 'An account with this email already exists'
  }

  if (message.includes('weak password')) {
    return 'Password must be at least 8 characters with uppercase, lowercase, and number'
  }

  if (message.includes('signup disabled')) {
    return 'Account registration is currently disabled'
  }

  return error.message
}
