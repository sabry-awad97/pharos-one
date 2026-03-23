/**
 * Hook abstraction wrapper for TanStack DB migration
 * Maintains backward-compatible API with TanStack Query hooks
 *
 * This allows gradual migration from TanStack Query to TanStack DB
 * without breaking existing components
 */

/**
 * Standard query result shape (TanStack Query compatible)
 */
export interface QueryResult<TData> {
  data: TData | undefined;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
  status: "pending" | "error" | "success";
}

/**
 * TanStack DB useLiveQuery result shape
 */
interface LiveQueryResult<TData> {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null; // Optional because TanStack DB might not always include it
  [key: string]: unknown; // Other properties from TanStack DB
}

/**
 * Wrap a TanStack DB useLiveQuery result to match TanStack Query API
 *
 * @param liveQueryResult - Result from TanStack DB useLiveQuery
 * @returns Query result matching TanStack Query shape
 *
 * @example
 * ```ts
 * // TanStack DB hook
 * const liveResult = useLiveQuery(collection.query());
 *
 * // Wrap to maintain backward compatibility
 * const queryResult = wrapLiveQuery(liveResult);
 *
 * // Use like TanStack Query
 * if (queryResult.isLoading) return <Spinner />;
 * if (queryResult.error) return <Error error={queryResult.error} />;
 * return <List data={queryResult.data} />;
 * ```
 */
export function wrapLiveQuery<TData>(
  liveQueryResult: LiveQueryResult<TData>,
): QueryResult<TData> {
  // Transform TanStack DB result to TanStack Query shape
  const hasData = liveQueryResult.data !== undefined;
  const hasError = liveQueryResult.isError && liveQueryResult.error !== null;
  const isLoading = liveQueryResult.isLoading;

  // Determine status based on state
  let status: "pending" | "error" | "success";
  if (isLoading) {
    status = "pending";
  } else if (hasError) {
    status = "error";
  } else {
    status = "success";
  }

  return {
    data: liveQueryResult.data,
    isLoading,
    error: liveQueryResult.error ?? null, // Ensure null instead of undefined
    isError: hasError,
    isSuccess: status === "success",
    status,
  };
}

/**
 * Create a hook wrapper that transforms TanStack DB result to TanStack Query shape
 *
 * @param useLiveQueryHook - TanStack DB hook function
 * @returns Wrapped hook with TanStack Query API
 *
 * @example
 * ```ts
 * // Original TanStack Query hook
 * export function useProducts() {
 *   return useQuery({ queryKey: ["products"], queryFn: fetchProducts });
 * }
 *
 * // Migrated TanStack DB hook with wrapper
 * export function useProducts() {
 *   const liveResult = useLiveQuery(productsCollection.query());
 *   return wrapLiveQuery(liveResult);
 * }
 * ```
 */
export function createHookWrapper<TData, TArgs extends unknown[]>(
  useLiveQueryHook: (...args: TArgs) => LiveQueryResult<TData>,
) {
  return (...args: TArgs): QueryResult<TData> => {
    const result = useLiveQueryHook(...args);
    return wrapLiveQuery(result);
  };
}
