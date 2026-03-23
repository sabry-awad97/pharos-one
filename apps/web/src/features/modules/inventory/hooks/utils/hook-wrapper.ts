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
  liveQueryResult: QueryResult<TData>,
): QueryResult<TData> {
  // Thin wrapper - just pass through all properties
  // This maintains the same API shape as TanStack Query
  return {
    data: liveQueryResult.data,
    isLoading: liveQueryResult.isLoading,
    error: liveQueryResult.error,
    isError: liveQueryResult.isError,
    isSuccess: liveQueryResult.isSuccess,
    status: liveQueryResult.status,
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
  useLiveQueryHook: (...args: TArgs) => QueryResult<TData>,
) {
  return (...args: TArgs): QueryResult<TData> => {
    const result = useLiveQueryHook(...args);
    return wrapLiveQuery(result);
  };
}
