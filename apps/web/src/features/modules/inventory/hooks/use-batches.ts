/**
 * Batch data hooks using TanStack Query
 */

import { useQuery } from "@tanstack/react-query";
import {
  fetchBatchesByProductId,
  fetchBatchById,
} from "../services/batch.service";

/**
 * Hook to fetch batches for a specific product
 *
 * @example
 * const { data: batches, isLoading } = useBatches(5);
 */
export function useBatches(productId: number) {
  return useQuery({
    queryKey: ["inventory", "batches", productId],
    queryFn: () => fetchBatchesByProductId(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
}

/**
 * Hook to fetch a single batch by ID
 *
 * @example
 * const { data: batch, isLoading } = useBatch(10);
 */
export function useBatch(id: number) {
  return useQuery({
    queryKey: ["inventory", "batch", id],
    queryFn: () => fetchBatchById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}
