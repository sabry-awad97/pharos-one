/**
 * Product data hooks using TanStack DB with ON-DEMAND mode
 * Migrated from TanStack Query to support 1M+ records
 *
 * NOTE: Uses TanStack DB joins to combine products with categories, suppliers, and batches.
 * Stock aggregation is computed by joining with batches and using TanStack DB aggregation functions.
 */

import { useLiveQuery, eq, sum, count, min } from "@tanstack/react-db";
import { useCollections } from "./use-collections";
import { wrapLiveQuery } from "./utils/hook-wrapper";

/**
 * Compute stock status from aggregated values
 * This must be done outside the TanStack DB query since we can't use
 * JavaScript operators on proxy objects
 */
function computeStockStatus(
  totalQuantity: number,
  reorderLevel: number,
  nearestExpiry: string | null,
): "ok" | "low" | "expiring" | "out" {
  if (totalQuantity === 0) {
    return "out";
  }

  if (totalQuantity < reorderLevel) {
    return "low";
  }

  if (nearestExpiry) {
    const now = new Date();
    const expiryDate = new Date(nearestExpiry);
    const daysUntilExpiry = Math.floor(
      (expiryDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000),
    );
    if (daysUntilExpiry <= 90) {
      return "expiring";
    }
  }

  return "ok";
}

/**
 * Hook to fetch products with live updates and on-demand loading
 *
 * Uses TanStack DB on-demand mode for 1M+ record scalability.
 * Joins products with categories, suppliers, and batches.
 * Computes stock aggregation fields from batches using TanStack DB aggregations.
 *
 * Performance targets:
 * - <200ms initial load for 50-record subset
 * - <1ms for subsequent queries
 * - <10MB memory for subset
 *
 * @example
 * const { data: products, isLoading } = useProducts();
 */
export function useProducts() {
  const { products, categories, suppliers, batches } = useCollections();

  const liveResult = useLiveQuery((q) => {
    // First, aggregate batch data per product
    const batchAggregates = q
      .from({ batch: batches })
      .groupBy(({ batch }) => batch.productId)
      .select(({ batch }) => ({
        productId: batch.productId,
        totalQuantity: sum(batch.quantityRemaining),
        batchCount: count(batch.id),
        nearestExpiry: min(batch.expiryDate),
      }));

    // Then join products with aggregated batch data and other relations
    return q
      .from({ product: products })
      .leftJoin({ category: categories }, ({ product, category }) =>
        eq(product.categoryId, category.id),
      )
      .leftJoin({ supplier: suppliers }, ({ product, supplier }) =>
        eq(product.defaultSupplierId, supplier.id),
      )
      .leftJoin({ batchAgg: batchAggregates }, ({ product, batchAgg }) =>
        eq(product.id, batchAgg.productId),
      )
      .select(({ product, category, supplier, batchAgg }) => ({
        ...product,
        category: category ?? null,
        defaultSupplier: supplier ?? null,
        // Stock fields from batch aggregates
        totalQuantity: batchAgg?.totalQuantity ?? 0,
        availableQuantity: batchAgg?.totalQuantity ?? 0, // Simplified: no reservations yet
        reservedQuantity: 0, // Simplified: no reservations yet
        nearestExpiry: batchAgg?.nearestExpiry ?? null,
        batchCount: batchAgg?.batchCount ?? 0,
        // We'll compute stockStatus after the query since we can't use JS operators here
        _reorderLevel: product.reorderLevel, // Pass through for post-processing
      }));
  });

  // Post-process to compute stock status
  const wrappedResult = wrapLiveQuery(liveResult);

  return {
    ...wrappedResult,
    data: wrappedResult.data?.map((product) => {
      const { _reorderLevel, ...rest } = product;
      return {
        ...rest,
        stockStatus: computeStockStatus(
          product.totalQuantity ?? 0,
          _reorderLevel,
          product.nearestExpiry ?? null,
        ),
      };
    }),
  };
}

/**
 * Hook to fetch a single product by ID with live updates
 *
 * @example
 * const { data: product, isLoading } = useProduct(5);
 */
export function useProduct(id: number) {
  const { products, categories, suppliers, batches } = useCollections();

  const liveResult = useLiveQuery(
    (q) => {
      if (!id) return undefined;

      // First, aggregate batch data for this product
      const batchAggregates = q
        .from({ batch: batches })
        .where(({ batch }) => eq(batch.productId, id))
        .groupBy(({ batch }) => batch.productId)
        .select(({ batch }) => ({
          productId: batch.productId,
          totalQuantity: sum(batch.quantityRemaining),
          batchCount: count(batch.id),
          nearestExpiry: min(batch.expiryDate),
        }));

      return q
        .from({ product: products })
        .where(({ product }) => eq(product.id, id))
        .leftJoin({ category: categories }, ({ product, category }) =>
          eq(product.categoryId, category.id),
        )
        .leftJoin({ supplier: suppliers }, ({ product, supplier }) =>
          eq(product.defaultSupplierId, supplier.id),
        )
        .leftJoin({ batchAgg: batchAggregates }, ({ product, batchAgg }) =>
          eq(product.id, batchAgg.productId),
        )
        .select(({ product, category, supplier, batchAgg }) => ({
          ...product,
          category,
          defaultSupplier: supplier,
          // Stock fields from batch aggregates
          totalQuantity: batchAgg?.totalQuantity ?? 0,
          availableQuantity: batchAgg?.totalQuantity ?? 0,
          reservedQuantity: 0,
          nearestExpiry: batchAgg?.nearestExpiry ?? null,
          batchCount: batchAgg?.batchCount ?? 0,
          _reorderLevel: product.reorderLevel,
        }))
        .findOne();
    },
    [id, products, categories, suppliers, batches],
  );

  // Post-process to compute stock status
  const wrappedResult = wrapLiveQuery(liveResult);

  return {
    ...wrappedResult,
    data: wrappedResult.data
      ? (() => {
          const { _reorderLevel, ...rest } = wrappedResult.data;
          return {
            ...rest,
            stockStatus: computeStockStatus(
              wrappedResult.data.totalQuantity ?? 0,
              _reorderLevel,
              wrappedResult.data.nearestExpiry ?? null,
            ),
          };
        })()
      : undefined,
  };
}
