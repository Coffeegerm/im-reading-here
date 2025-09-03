// Example patterns for handling React Query in Next.js App Router

// Pattern 1: Simple Client Component Wrapper (Current solution)
// ✅ Best for: Simple pages with straightforward data fetching
// ✅ Pros: Easy to implement, clear separation
// ❌ Cons: No SSR for the data

// Pattern 2: Server-Side Prefetching with Hydration (Recommended)
// ✅ Best for: SEO-critical pages, better performance
// ✅ Pros: SSR + client-side caching, no loading states
// ❌ Cons: Slightly more complex setup

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

// Pattern 3: Suspense Boundaries (Future-proof)
// ✅ Best for: Complex UIs with multiple data dependencies
// ✅ Pros: Fine-grained loading states, better UX
// ❌ Cons: Requires React 18+ features

import { Suspense } from 'react';

// Pattern 4: Custom Hook with Server Components
// ✅ Best for: Mixing server and client data
// ✅ Pros: Flexibility, can pass server data as initial data
// ❌ Cons: More complex data flow

export const QUERY_PATTERNS = {
  clientWrapper: 'Simple client component wrapper',
  serverPrefetch: 'Server-side prefetching with hydration',
  suspense: 'Suspense boundaries with streaming',
  hybrid: 'Mixed server/client data patterns'
} as const;

// Example: Server Component with Prefetched Data
export async function createPrefetchedPage(
  queryKey: string[],
  queryFn: () => Promise<any>,
  ClientComponent: React.ComponentType<any>
) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });

  return function PrefetchedPage(props: any) {
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientComponent {...props} />
      </HydrationBoundary>
    );
  };
}

// Example: Suspense Pattern (Future)
export function SuspensePattern({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
}
