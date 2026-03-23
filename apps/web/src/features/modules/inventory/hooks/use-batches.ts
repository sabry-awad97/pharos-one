/**
 * Batch data hooks using TanStack DB with ON-DEMAND mode
 * Migrated from TanStack Query to support 100K+ records
 */

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLiveQuery, eq } from "@tanstack/react-db";
import { createBatchCollection } from "../collections/batch.collection";
import { wrapLiveQuery } from "./utils/hook-wrapper";
import type { QueryResult } from "./utils/hook-wrapper";
import type { BatchWithRelations } from "../schema";

/**
 * Hook to fetch batches for a specific product with live updates
 *
 * Uses TanStack DB on-demand mode for 100K+ record scalability.
 * The hook API remains backward-compatible with TanStack Query.
 *
 * Performance targets:
 * - <100ms initial load for filtered subset
 * - <1ms for subsequent queries
 * - <5MB memory for subset
 *
 * @example
 * const { data: batches, isLoading } = useBatches(5);
 */
export function useBatches(
  productId: number,
): QueryResult<BatchWithRelations[]> {
  const queryClient = useQueryClient();

  // Create collection with QueryClient (memoized)
  const batchCollection = useMemo(
    () => createBatchCollection(queryClient),
    [queryClient],
  );

  const liveResult = useLiveQuery(
    (q) =>
      q
        .from({ batch: batchCollection })
        .where(({ batch }) => eq(batch.productId, productId)),
    [productId, batchCollection],
  );

  return wrapLiveQuery(liveResult);
}

/**
 * Hook to fetch a single batch by ID with live updates
 *
 * @example
 * const { data: batch, isLoading } = useBatch(10);
 */
export function useBatch(
  id: number,
): QueryResult<BatchWithRelations | undefined> {
  const queryClient = useQueryClient();

  // Create collection with QueryClient (memoized)
  const batchCollection = useMemo(
    () => createBatchCollection(queryClient),
    [queryClient],
  );

  const liveResult = useLiveQuery(
    (q) => {
      if (!id) return undefined;

      return q
        .from({ batch: batchCollection })
        .where(({ batch }) => eq(batch.id, id))
        .findOne();
    },
    [id, batchCollection],
  );

  return wrapLiveQuery(liveResult);
}
