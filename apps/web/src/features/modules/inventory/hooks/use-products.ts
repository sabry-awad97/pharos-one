/**
 * Product data hooks using TanStack DB with ON-DEMAND mode
 * Migrated from TanStack Query to support 1M+ records
 */

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLiveQuery, eq } from "@tanstack/react-db";
import { createProductCollection } from "../collections/product.collection";
import { wrapLiveQuery } from "./utils/hook-wrapper";
import type { QueryResult } from "./utils/hook-wrapper";
import type { ProductStockSummary } from "../schema";

/**
 * Hook to fetch products with live updates and on-demand loading
 *
 * Uses TanStack DB on-demand mode for 1M+ record scalability.
 * The hook API remains backward-compatible with TanStack Query.
 *
 * Performance targets:
 * - <200ms initial load for 50-record subset
 * - <1ms for subsequent queries
 * - <10MB memory for subset
 *
 * @example
 * const { data: products, isLoading } = useProducts();
 */
export function useProducts(): QueryResult<ProductStockSummary[]> {
  const queryClient = useQueryClient();

  // Create collection with QueryClient (memoized)
  const productCollection = useMemo(
    () => createProductCollection(queryClient),
    [queryClient],
  );

  const liveResult = useLiveQuery((q) =>
    q.from({ product: productCollection }),
  );

  return wrapLiveQuery(liveResult);
}

/**
 * Hook to fetch a single product by ID with live updates
 *
 * @example
 * const { data: product, isLoading } = useProduct(5);
 */
export function useProduct(
  id: number,
): QueryResult<ProductStockSummary | undefined> {
  const queryClient = useQueryClient();

  // Create collection with QueryClient (memoized)
  const productCollection = useMemo(
    () => createProductCollection(queryClient),
    [queryClient],
  );

  const liveResult = useLiveQuery(
    (q) => {
      if (!id) return undefined;

      return q
        .from({ product: productCollection })
        .where(({ product }) => eq(product.id, id))
        .findOne();
    },
    [id, productCollection],
  );

  return wrapLiveQuery(liveResult);
}
