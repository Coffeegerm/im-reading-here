/**
 * Application configuration constants
 * Centralizes environment variables and default values
 */

export const config = {
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },
} as const;

const API_BASE = '/api/v1'

// API endpoints
export const apiEndpoints = {
  auth: {
    me: `${API_BASE}/auth/me`,
    signin: '/api/v1/auth/signin',
    signup: "/api/v1/auth/signup",
    signout: "/api/v1/auth/signout",
    refresh: "/api/v1/auth/refresh",
    profile: "/api/v1/auth/profile",
    syncUser: "/api/v1/auth/sync-user",
  },
  users: {
    base: "/api/v1/users",
    byId: (id: string) => `/api/v1/users/${id}`,
    clubs: (id: string) => `/api/v1/users/${id}/clubs`,
    shelves: (id: string) => `/api/v1/users/${id}/shelves`,
  },
  shelves: {
    base: "/api/v1/shelves",
    byId: (shelfId: string) => `/api/v1/shelves/${shelfId}`,
  },
  books: {
    base: "/api/v1/books",
    byId: (id: string) => `/api/v1/books/${id}`,
    search: "/api/v1/books/search",
    import: "/api/v1/books/import",
  },
  clubs: {
    base: "/api/v1/clubs",
    byId: (id: string) => `/api/v1/clubs/${id}`,
    memberships: (id: string) => `/api/v1/clubs/${id}/memberships`,
    meetings: (id: string) => `/api/v1/clubs/${id}/meetings`,
    polls: (id: string) => `/api/v1/clubs/${id}/polls`,
    readingPlans: (id: string) => `/api/v1/clubs/${id}/reading-plans`,
  },
  meetings: {
    base: "/api/v1/meetings",
    byId: (id: string) => `/api/v1/meetings/${id}`,
    rsvp: (id: string) => `/api/v1/meetings/${id}/rsvp`,
  },
  polls: {
    base: "/api/v1/polls",
    byId: (id: string) => `/api/v1/polls/${id}`,
    votes: (id: string) => `/api/v1/polls/${id}/votes`,
  },
  notifications: "/api/v1/notifications",
  realtime: {
    token: "/api/v1/realtime/token",
  },
  uploads: {
    presign: "/api/v1/uploads/presign",
  },
  exports: {
    clubIcs: (id: string) => `/api/v1/exports/clubs/${id}/ics`,
  },
} as const;

/**
 * Creates a full API URL by combining the base API URL with an endpoint
 * @param endpoint - The API endpoint (e.g., '/api/v1/auth/me')
 * @returns The complete API URL
 *
 * @example
 * // Instead of: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`
 * // Use: createApiUrl(apiEndpoints.auth.me)
 */
export function createApiUrl(endpoint: string): string {
  return `${config.api.url}${endpoint}`;
}

/**
 * Enhanced fetch wrapper with automatic API URL construction and auth headers
 * @param endpoint - The API endpoint
 * @param options - Fetch options
 * @param options.token - Optional auth token (Bearer token)
 * @returns Promise with the fetch response
 *
 * @example
 * // Authenticated request
 * const response = await apiFetch(apiEndpoints.auth.me, { method: 'GET' }, userToken)
 *
 * // Public request
 * const response = await apiFetch(apiEndpoints.books.search, {
 *   method: 'POST',
 *   body: JSON.stringify({ query: 'typescript' })
 * })
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
) {
  const url = createApiUrl(endpoint);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

export default config;
