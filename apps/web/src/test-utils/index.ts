/**
 * Test utilities for Pharos One
 *
 * Provides reusable test wrappers and helpers for:
 * - React Query (QueryClient)
 * - nuqs (URL state management)
 *
 * @example
 * ```tsx
 * import { renderWithProviders, AllProviders } from '@/test-utils';
 *
 * // For component tests
 * test('renders correctly', () => {
 *   renderWithProviders(<MyComponent />, {
 *     searchParams: '?page=2',
 *   });
 * });
 *
 * // For hook tests
 * test('hook works', () => {
 *   const { result } = renderHook(() => useMyHook(), {
 *     wrapper: ({ children }) => (
 *       <AllProviders searchParams="?page=2">{children}</AllProviders>
 *     ),
 *   });
 * });
 * ```
 */

export {
  AllProviders,
  renderWithProviders,
  createTestQueryClient,
} from "./test-providers";
