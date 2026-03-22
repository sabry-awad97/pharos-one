/**
 * Product data hooks using TanStack Query
 */

import { useQuery } from "@tanstack/react-query";
import {
  fetchProductSummaries,
  fetchProductSummaryById,
} from "../services/product.service";

/**
 * Hook to fetch all products with stock summary
 *
 * @example
 * const { data: products, isLoading, error } = useProducts();
 */
export function useProducts() {
  return useQuery({
    queryKey: ["inventory", "products"],
    queryFn: fetchProductSummaries,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch a single product with stock summary by ID
 *
 * @example
 * const { data: product, isLoading } = useProduct(5);
 */
export function useProduct(id: number) {
  return useQuery({
    queryKey: ["inventory", "product", id],
    queryFn: () => fetchProductSummaryById(id),
    enabled: !!id, // Only fetch if ID is provided
    staleTime: 1000 * 60 * 5,
  });
}
