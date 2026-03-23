/**
 * Product data hooks using TanStack DB with ON-DEMAND mode
 * Migrated from TanStack Query to support 1M+ records
 *
 * NOTE: Uses TanStack DB joins to combine products with categories and suppliers.
 * Collections return raw table data, joins happen in the hooks.
 */

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLiveQuery, eq } from "@tanstack/react-db";
import { createProductCollection } from "../collections/product.collection";
import { createCategoryCollection } from "../collections/category.collection";
import { createSupplierCollection } from "../collections/supplier.collection";
import { wrapLiveQuery } from "./utils/hook-wrapper";

/**
 * Hook to fetch products with live updates and on-demand loading
 *
 * Uses TanStack DB on-demand mode for 1M+ record scalability.
 * Joins products with categories and suppliers using TanStack DB joins.
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
  const queryClient = useQueryClient();

  // Create collections with QueryClient (memoized)
  const productCollection = useMemo(
    () => createProductCollection(queryClient),
    [queryClient],
  );
  const categoryCollection = useMemo(
    () => createCategoryCollection(queryClient),
    [queryClient],
  );
  const supplierCollection = useMemo(
    () => createSupplierCollection(queryClient),
    [queryClient],
  );

  const liveResult = useLiveQuery((q) =>
    q
      .from({ product: productCollection })
      .join(
        { category: categoryCollection },
        ({ product, category }) => eq(product.categoryId, category.id),
        "left", // Left join to include products without category
      )
      .join(
        { supplier: supplierCollection },
        ({ product, supplier }) => eq(product.defaultSupplierId, supplier.id),
        "left", // Left join to include products without supplier
      )
      .select(({ product, category, supplier }) => ({
        ...product,
        category: category ?? null,
        defaultSupplier: supplier ?? null,
        // Add computed fields for UI compatibility
        // TODO: Calculate these from batches when batch aggregation is implemented
        totalQuantity: 0,
        availableQuantity: 0,
        reservedQuantity: 0,
        nearestExpiry: null as string | null,
        batchCount: 0,
        stockStatus: "ok" as const,
      })),
  );

  return wrapLiveQuery(liveResult);
}

/**
 * Hook to fetch a single product by ID with live updates
 *
 * @example
 * const { data: product, isLoading } = useProduct(5);
 */
export function useProduct(id: number) {
  const queryClient = useQueryClient();

  // Create collections with QueryClient (memoized)
  const productCollection = useMemo(
    () => createProductCollection(queryClient),
    [queryClient],
  );
  const categoryCollection = useMemo(
    () => createCategoryCollection(queryClient),
    [queryClient],
  );
  const supplierCollection = useMemo(
    () => createSupplierCollection(queryClient),
    [queryClient],
  );

  const liveResult = useLiveQuery(
    (q) => {
      if (!id) return undefined;

      return q
        .from({ product: productCollection })
        .where(({ product }) => eq(product.id, id))
        .join(
          { category: categoryCollection },
          ({ product, category }) => eq(product.categoryId, category.id),
          "left",
        )
        .join(
          { supplier: supplierCollection },
          ({ product, supplier }) => eq(product.defaultSupplierId, supplier.id),
          "left",
        )
        .select(({ product, category, supplier }) => ({
          ...product,
          category: category ?? null,
          defaultSupplier: supplier ?? null,
          // Add computed fields for UI compatibility
          // TODO: Calculate these from batches when batch aggregation is implemented
          totalQuantity: 0,
          availableQuantity: 0,
          reservedQuantity: 0,
          nearestExpiry: null as string | null,
          batchCount: 0,
          stockStatus: "ok" as const,
        }))
        .findOne();
    },
    [id, productCollection, categoryCollection, supplierCollection],
  );

  return wrapLiveQuery(liveResult);
}
