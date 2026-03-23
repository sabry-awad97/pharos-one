import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";

/**
 * Creates a new QueryClient instance for testing
 * Configured with sensible defaults for tests (no retries, no cache time)
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * All-in-one test provider that includes:
 * - QueryClientProvider (React Query)
 * - NuqsTestingAdapter (nuqs URL state)
 *
 * @example
 * ```tsx
 * import { AllProviders } from '@/test-utils/test-providers';
 *
 * const { result } = renderHook(() => useMyHook(), {
 *   wrapper: ({ children }) => (
 *     <AllProviders searchParams="?page=2">{children}</AllProviders>
 *   ),
 * });
 * ```
 */
export function AllProviders({
  children,
  searchParams,
  queryClient,
}: {
  children: ReactNode;
  searchParams?: string;
  queryClient?: QueryClient;
}) {
  const client = queryClient || createTestQueryClient();

  return (
    <QueryClientProvider client={client}>
      <NuqsTestingAdapter searchParams={searchParams}>
        {children}
      </NuqsTestingAdapter>
    </QueryClientProvider>
  );
}

/**
 * Render helper that wraps component with all test providers
 *
 * @param ui - Component to render
 * @param options - Optional render options
 * @returns Render result from @testing-library/react
 *
 * @example
 * ```tsx
 * import { renderWithProviders } from '@/test-utils/test-providers';
 *
 * test('my test', () => {
 *   renderWithProviders(<MyComponent />, {
 *     searchParams: '?page=2&pageSize=50',
 *   });
 * });
 * ```
 */
export function renderWithProviders(
  ui: ReactNode,
  options?: {
    searchParams?: string;
    queryClient?: QueryClient;
    [key: string]: any;
  },
) {
  const { searchParams, queryClient, ...renderOptions } = options || {};
  const { render } = require("@testing-library/react");

  return render(
    <AllProviders searchParams={searchParams} queryClient={queryClient}>
      {ui}
    </AllProviders>,
    renderOptions,
  );
}
