/**
 * Supplier collection with eager sync mode
 * Pre-loads all suppliers (~10 records) for instant access
 */

import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import type { QueryClient } from "@tanstack/react-query";
import { generateSupplier } from "../utils/generators";
import type { Supplier } from "../schema";

/**
 * Fetch all suppliers (mock data generator)
 * In production, this would call the Tauri API
 */
async function fetchSuppliers(): Promise<Supplier[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Generate 10 suppliers
  return Array.from({ length: 10 }, (_, i) => generateSupplier(i + 1));
}

/**
 * Create supplier collection with provided QueryClient
 * Small dataset (~10 suppliers) loaded upfront for instant access
 *
 * Uses eager sync mode because:
 * - Small dataset (~10 records)
 * - Rarely changes
 * - Needed across many components (dropdowns, filters)
 * - Performance target: <50ms initial load, <1MB memory
 */
export function createSupplierCollection(queryClient: QueryClient) {
  return createCollection(
    queryCollectionOptions({
      queryClient,
      queryKey: ["inventory", "suppliers"],
      queryFn: fetchSuppliers,
      getKey: (item: Supplier) => item.id,
      staleTime: 1000 * 60 * 10, // 10 minutes (suppliers change rarely)
    }),
  );
}
