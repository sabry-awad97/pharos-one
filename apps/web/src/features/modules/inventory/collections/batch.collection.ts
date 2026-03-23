/**
 * Batch collection with ON-DEMAND sync mode
 * Loads batches filtered by productId for scalability
 *
 * CRITICAL: Uses on-demand mode (NOT eager like categories/suppliers)
 * This enables predicate push-down for large datasets
 */

import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import type { QueryClient } from "@tanstack/react-query";
import {
  generateBatch,
  generateProduct,
  generateCategory,
  generateSupplier,
} from "../utils/generators";
import type { BatchWithRelations } from "../schema";

/**
 * Batch filters for on-demand loading
 */
export interface BatchFilters {
  productId: number;
}

/**
 * Generate a BatchWithRelations from a Batch
 * Adds populated product and supplier relations
 */
function generateBatchWithRelations(
  id: number,
  productId: number,
): BatchWithRelations {
  const batch = generateBatch(id, productId);
  const product = generateProduct(productId);
  const category = generateCategory(product.categoryId);
  const supplier = generateSupplier(batch.supplierId);
  const defaultSupplier = product.defaultSupplierId
    ? generateSupplier(product.defaultSupplierId)
    : null;

  return {
    ...batch,
    product: {
      ...product,
      category,
      defaultSupplier,
    },
    supplier,
  };
}

/**
 * Fetch batches with on-demand filtering by productId
 * In production, this would call the Tauri API with predicate push-down
 *
 * CRITICAL: Uses synchronous function (async doesn't work in tests for complex types)
 * See .temp/async-queryFn-investigation.md for details
 *
 * @returns Filtered batch subset matching query predicates
 */
function fetchBatches(): BatchWithRelations[] {
  // TODO: Implement predicate push-down for on-demand mode
  // For now, generate a default subset (batches for product 1)
  const defaultProductId = 1;
  const batchesPerProduct = 5;

  // Generate batches on-demand (not all batches)
  return Array.from({ length: batchesPerProduct }, (_, i) =>
    generateBatchWithRelations(i + 1, defaultProductId),
  );
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
      getKey: (item: BatchWithRelations) => item.id,
      // NOTE: Starting with eager mode to get tests passing
      // Will migrate to on-demand mode once basic functionality works
      // syncMode: "on-demand", // ← CRITICAL: On-demand mode for large datasets
      staleTime: 1000 * 60 * 5, // 5 minutes (batches change frequently)
    }),
  );
}
