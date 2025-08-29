# Mobile App Setup

This React Native mobile app is part of the "I'm Reading Here" monorepo and shares authentication code with the web application through the `@im-reading-here/shared` package.

## Getting Started

### From the root directory

```bash
# Start the mobile app
pnpm mobile

# Run on Android
pnpm mobile:android

# Run on iOS
pnpm mobile:ios

# Run on web
pnpm mobile:web
```

### From the mobile app directory

```bash
cd apps/mobile

# Start the app
pnpm start

# Run on specific platforms
pnpm android
pnpm ios
pnpm web
```

## Environment Variables

Create a `.env.local` file in the root directory or set environment variables:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Shared Code

The mobile app uses shared code from `packages/shared` for:

- **Supabase Client**: Mobile-optimized client with AsyncStorage
- **Authentication Hook**: Shared `useAuth` hook between web and mobile
- **Types & Schemas**: Common TypeScript types and validation schemas
- **Utils**: Shared utility functions

## Authentication

The mobile app uses the same Supabase authentication as the web app:

```tsx
import { useAuth } from '../hooks/use-auth'

function MyComponent() {
  const { signIn, signUp, signOut, loading } = useAuth()

  const handleSignIn = async () => {
    const result = await signIn({ email, password })
    if (result.error) {
      // Handle error
    }
  }
}
```

## Architecture

- `src/lib/supabase.ts` - Mobile-specific Supabase client setup
- `src/hooks/use-auth.ts` - Mobile auth hook wrapper
- `src/components/` - React Native components
- Shared code is imported from `@im-reading-here/shared`

## Development

The mobile app is configured to work with:
- Expo Router for navigation
- TypeScript for type safety
- Shared authentication with the web app
- AsyncStorage for session persistence

Make sure to install dependencies from the root:

```bash
pnpm install
```
