import { z } from 'zod'

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  name: z.string().min(1, 'Name is required'),
})

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
})

// User schemas
export const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  avatarUrl: z.string().url().optional(),
  shelvesVisibleTo: z.enum(['public', 'club', 'private']).optional(),
})

// Club schemas
export const CreateClubSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
})

export const UpdateClubSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
})

// Book schemas
export const ImportBookSchema = z.object({
  isbn13: z.string().optional(),
  isbn10: z.string().optional(),
  openLibraryId: z.string().optional(),
}).refine(
  (data) => data.isbn13 || data.isbn10 || data.openLibraryId,
  {
    message: 'At least one identifier (ISBN13, ISBN10, or OpenLibrary ID) is required',
  }
)

// Meeting schemas
export const CreateMeetingSchema = z.object({
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  mode: z.enum(['IN_PERSON', 'VIRTUAL']),
  location: z.string().optional(),
  videoLink: z.string().url().optional(),
  agenda: z.string().optional(),
})

// Common validation helpers
export const UuidSchema = z.string().uuid()
export const PaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
})
