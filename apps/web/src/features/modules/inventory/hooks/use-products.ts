/**
 * Product data hooks using TanStack DB with ON-DEMAND mode
 * Migrated from TanStack Query to support 1M+ records
 *
 * NOTE: Uses TanStack DB joins to combine products with categories and suppliers.
 * Collections return raw table data, joins happen in the hooks.
 */

import { useLiveQuery, eq } from "@tanstack/react-db";
import { useCollections } from "./use-collections";
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
  const { products, categories, suppliers } = useCollections();

  const liveResult = useLiveQuery((q) =>
    q
      .from({ product: products })
      .join(
        { category: categories },
        ({ product, category }) => eq(product.categoryId, category.id),
        "left", // Left join to include products without category
      )
      .join(
        { supplier: suppliers },
        ({ product, supplier }) => eq(product.defaultSupplierId, supplier.id),
        "left", // Left join to include products without supplier
      )
      .select(({ product, category, supplier }) => ({
        ...product, // Spread all product fields including stock fields
        category: category ?? null,
        defaultSupplier: supplier ?? null,
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
  const { products, categories, suppliers } = useCollections();

  const liveResult = useLiveQuery(
    (q) => {
      if (!id) return undefined;

      return q
        .from({ product: products })
        .where(({ product }) => eq(product.id, id))
        .join(
          { category: categories },
          ({ product, category }) => eq(product.categoryId, category.id),
          "left",
        )
        .join(
          { supplier: suppliers },
          ({ product, supplier }) => eq(product.defaultSupplierId, supplier.id),
          "left",
        )
        .select(({ product, category, supplier }) => ({
          ...product, // Spread all product fields including stock fields
          category,
          defaultSupplier: supplier,
        }))
        .findOne();
    },
    [id, products, categories, suppliers],
  );

  return wrapLiveQuery(liveResult);
}
