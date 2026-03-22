/**
 * Category data hooks using TanStack Query
 */

import { useQuery } from "@tanstack/react-query";
import {
  fetchCategories,
  fetchCategoryById,
} from "../services/category.service";

/**
 * Hook to fetch all categories
 *
 * @example
 * const { data: categories, isLoading } = useCategories();
 */
export function useCategories() {
  return useQuery({
    queryKey: ["inventory", "categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10, // Categories change less frequently
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch a single category by ID
 *
 * @example
 * const { data: category, isLoading } = useCategory(2);
 */
export function useCategory(id: number) {
  return useQuery({
    queryKey: ["inventory", "category", id],
    queryFn: () => fetchCategoryById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}
