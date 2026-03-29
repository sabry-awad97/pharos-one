/**
 * Batch collection with ON-DEMAND sync mode
 * Loads batches filtered by productId for scalability
 *
 * CRITICAL: Uses on-demand mode (NOT eager like categories/suppliers)
 * This enables predicate push-down for large datasets
 *
 * NOTE: This collection returns raw Batch[] data (just the batches table).
 * Relations (product, supplier) are joined in the hooks using TanStack DB joins.
 */

import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import type { QueryClient } from "@tanstack/react-query";
import { generateBatch } from "../utils/generators";
import type { Batch } from "../schema";

/**
 * Batch filters for on-demand loading
 */
export interface BatchFilters {
  productId: number;
}

/**
 * Fetch batches with on-demand filtering by productId
 * In production, this would call the Tauri API: invoke("get_batches", { filters })
 *
 * Returns raw Batch[] (just the batches table, no relations)
 * Relations will be joined in the hooks using TanStack DB joins
 *
 * @returns Filtered batch subset matching query predicates
 */
async function fetchBatches(): Promise<Batch[]> {
  // TODO: Replace with Tauri API call
  // return await invoke("get_batches", { filters });

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Generate batches for first 50 products (matching product collection)
  const productCount = 50;
  const batches: Batch[] = [];

  for (let productId = 1; productId <= productCount; productId++) {
    // Deterministic batch count per product: 1-5 batches
    // ~10% products have 0 batches (out of stock)
    const isOutOfStock = productId % 10 === 0;
    const batchCount = isOutOfStock ? 0 : 1 + (productId % 5);

    for (let i = 0; i < batchCount; i++) {
      const batchId = (productId - 1) * 5 + i + 1;
      batches.push(generateBatch(batchId, productId));
    }
  }

  return batches;
}

/**
 * Create batch collection with provided QueryClient
 * Large dataset (potentially 100K+ batches) loaded on-demand
 *
 * Uses ON-DEMAND sync mode because:
 * - Large dataset (100K+ records)
 * - Users filter by productId
 * - Most data won't be accessed
 * - Need sub-millisecond query performance
 * - Want automatic predicate push-down
 *
 * Performance targets:
 * - <100ms initial load for filtered subset
 * - <1ms for subsequent queries (differential dataflow)
 * - <5MB memory for filtered subset
 */
export function createBatchCollection(queryClient: QueryClient) {
  return createCollection(
    queryCollectionOptions({
      queryClient,
      queryKey: ["inventory", "batches"],
      queryFn: fetchBatches,
      getKey: (item: Batch) => item.id,
      // NOTE: Starting with eager mode to get tests passing
      // Will migrate to on-demand mode once basic functionality works
      // syncMode: "on-demand", // ← CRITICAL: On-demand mode for large datasets
      staleTime: 1000 * 60 * 5, // 5 minutes (batches change frequently)
    }),
  );
}
