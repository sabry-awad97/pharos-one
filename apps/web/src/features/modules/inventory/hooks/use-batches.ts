/**
 * Batch data hooks using TanStack Query
 */

import { useQuery } from "@tanstack/react-query";
import {
  fetchBatches,
  fetchBatchesByProductId,
  fetchBatchById,
} from "../services/batch.service";

/**
 * Hook to fetch all batches
 *
 * @example
 * const { data: batches, isLoading } = useBatches();
 */
export function useBatches() {
  return useQuery({
    queryKey: ["inventory", "batches"],
    queryFn: fetchBatches,
    staleTime: 1000 * 60 * 2, // Batches change more frequently
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch batches for a specific product
 *
 * @example
 * const { data: batches, isLoading } = useProductBatches(5);
 */
export function useProductBatches(productId: number) {
  return useQuery({
    queryKey: ["inventory", "product", productId, "batches"],
    queryFn: () => fetchBatchesByProductId(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 2,
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
