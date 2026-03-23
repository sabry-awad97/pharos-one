/**
 * Batch data hooks using TanStack DB with ON-DEMAND mode
 * Migrated from TanStack Query to support 100K+ records
 *
 * NOTE: Uses TanStack DB joins to combine batches with products, categories, and suppliers.
 * Collections return raw table data, joins happen in the hooks.
 */

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLiveQuery, eq } from "@tanstack/react-db";
import { createBatchCollection } from "../collections/batch.collection";
import { createProductCollection } from "../collections/product.collection";
import { createCategoryCollection } from "../collections/category.collection";
import { createSupplierCollection } from "../collections/supplier.collection";
import { wrapLiveQuery } from "./utils/hook-wrapper";

/**
 * Hook to fetch batches for a specific product with live updates
 *
 * Uses TanStack DB on-demand mode for 100K+ record scalability.
 * Joins batches with products, categories, and suppliers using TanStack DB joins.
 *
 * Performance targets:
 * - <100ms initial load for filtered subset
 * - <1ms for subsequent queries
 * - <5MB memory for subset
 *
 * @example
 * const { data: batches, isLoading } = useBatches(5);
 */
export function useBatches(productId: number) {
  const queryClient = useQueryClient();

  // Create collections with QueryClient (memoized)
  const batchCollection = useMemo(
    () => createBatchCollection(queryClient),
    [queryClient],
  );
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
    (q) =>
      q
        .from({ batch: batchCollection })
        .where(({ batch }) => eq(batch.productId, productId))
        .join(
          { product: productCollection },
          ({ batch, product }) => eq(batch.productId, product.id),
          "left",
        )
        .join(
          { category: categoryCollection },
          ({ product, category }) => eq(product.categoryId, category.id),
          "left",
        )
        .join(
          { batchSupplier: supplierCollection },
          ({ batch, batchSupplier }) => eq(batch.supplierId, batchSupplier.id),
          "left",
        )
        .join(
          { productSupplier: supplierCollection },
          ({ product, productSupplier }) =>
            eq(product.defaultSupplierId, productSupplier.id),
          "left",
        )
        .select(
          ({ batch, product, category, batchSupplier, productSupplier }) => ({
            ...batch,
            product: {
              ...product,
              category: category ?? null,
              defaultSupplier: productSupplier ?? null,
            },
            supplier: batchSupplier ?? null,
          }),
        ),
    [
      productId,
      batchCollection,
      productCollection,
      categoryCollection,
      supplierCollection,
    ],
  );

  return wrapLiveQuery(liveResult);
}

/**
 * Hook to fetch a single batch by ID with live updates
 *
 * @example
 * const { data: batch, isLoading } = useBatch(10);
 */
export function useBatch(id: number) {
  const queryClient = useQueryClient();

  // Create collections with QueryClient (memoized)
  const batchCollection = useMemo(
    () => createBatchCollection(queryClient),
    [queryClient],
  );
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
        .from({ batch: batchCollection })
        .where(({ batch }) => eq(batch.id, id))
        .join(
          { product: productCollection },
          ({ batch, product }) => eq(batch.productId, product.id),
          "left",
        )
        .join(
          { category: categoryCollection },
          ({ product, category }) => eq(product.categoryId, category.id),
          "left",
        )
        .join(
          { batchSupplier: supplierCollection },
          ({ batch, batchSupplier }) => eq(batch.supplierId, batchSupplier.id),
          "left",
        )
        .join(
          { productSupplier: supplierCollection },
          ({ product, productSupplier }) =>
            eq(product.defaultSupplierId, productSupplier.id),
          "left",
        )
        .select(
          ({ batch, product, category, batchSupplier, productSupplier }) => ({
            ...batch,
            product: {
              ...product,
              category: category ?? null,
              defaultSupplier: productSupplier ?? null,
            },
            supplier: batchSupplier ?? null,
          }),
        )
        .findOne();
    },
    [
      id,
      batchCollection,
      productCollection,
      categoryCollection,
      supplierCollection,
    ],
  );

  return wrapLiveQuery(liveResult);
}
