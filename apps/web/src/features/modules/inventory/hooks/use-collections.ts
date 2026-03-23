/**
 * Reusable hook to access all inventory collections
 * Provides memoized collection instances to avoid recreation on every render
 *
 * This hook centralizes collection creation and ensures consistent
 * collection instances across all hooks that need them.
 *
 * @example
 * const { products, categories, suppliers, batches, transactions } = useCollections();
 *
 * const liveResult = useLiveQuery((q) =>
 *   q.from({ product: products })
 *    .join({ category: categories }, ...)
 * );
 */

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createProductCollection } from "../collections/product.collection";
import { createCategoryCollection } from "../collections/category.collection";
import { createSupplierCollection } from "../collections/supplier.collection";
import { createBatchCollection } from "../collections/batch.collection";
import { createTransactionCollection } from "../collections/transaction.collection";

/**
 * Hook that provides access to all inventory collections
 *
 * Collections are memoized based on QueryClient instance to avoid
 * unnecessary recreation. Use this hook in any component or hook
 * that needs to query inventory data.
 *
 * @returns Object containing all inventory collections
 */
export function useCollections() {
  const queryClient = useQueryClient();

  const collections = useMemo(
    () => ({
      products: createProductCollection(queryClient),
      categories: createCategoryCollection(queryClient),
      suppliers: createSupplierCollection(queryClient),
      batches: createBatchCollection(queryClient),
      transactions: createTransactionCollection(queryClient),
    }),
    [queryClient],
  );

  return collections;
}
