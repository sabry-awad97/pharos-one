/**
 * Category collection with eager sync mode
 * Pre-loads all categories (~20 records) for instant access
 */

import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import type { QueryClient } from "@tanstack/react-query";
import { generateCategory } from "../utils/generators";
import type { Category } from "../schema";

/**
 * Fetch all categories (mock data generator)
 * In production, this would call the Tauri API
 */
async function fetchCategories(): Promise<Category[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Generate 20 categories
  return Array.from({ length: 20 }, (_, i) => generateCategory(i + 1));
}

/**
 * Create category collection with provided QueryClient
 * Small dataset (~20 categories) loaded upfront for instant access
 *
 * Uses eager sync mode because:
 * - Small dataset (~20 records)
 * - Rarely changes
 * - Needed across many components (dropdowns, filters)
 * - Performance target: <50ms initial load, <1MB memory
 */
export function createCategoryCollection(queryClient: QueryClient) {
  return createCollection(
    queryCollectionOptions({
      queryClient,
      queryKey: ["inventory", "categories"],
      queryFn: fetchCategories,
      getKey: (item: Category) => item.id,
      staleTime: 1000 * 60 * 10, // 10 minutes (categories change rarely)
    }),
  );
}
