/**
 * Transaction data hooks using TanStack DB with ON-DEMAND mode
 * Migrated from TanStack Query to support millions of records
 */

import { useLiveQuery, eq, gte, lte, and } from "@tanstack/react-db";
import { useCollections } from "./use-collections";
import { wrapLiveQuery } from "./utils/hook-wrapper";
import type { QueryResult } from "./utils/hook-wrapper";
import type { StockTransactionWithRelations } from "../schema";

/**
 * Transaction filters for on-demand loading
 */
export interface TransactionFilters {
  productId?: number;
  startDate?: string;
  endDate?: string;
}

/**
 * Hook to fetch stock transactions with optional filters
 *
 * Uses TanStack DB on-demand mode for millions of records scalability.
 * Returns transactions with full batch relations including product, category, and supplier data.
 * The hook API remains backward-compatible with TanStack Query.
 *
 * Performance targets:
 * - <200ms initial load for 30-day subset
 * - <1ms for subsequent queries
 * - <10MB memory for subset
 *
 * @example
 * // All transactions (default subset)
 * const { data: transactions } = useTransactions();
 * // transactions[0].batch.batchNumber
 * // transactions[0].batch.product.name
 *
 * @example
 * // Filter by date range
 * const { data: transactions } = useTransactions({
 *   startDate: "2024-01-01",
 *   endDate: "2024-01-31"
 * });
 *
 * @example
 * // Filter by productId (via batch join)
 * const { data: transactions } = useTransactions({ productId: 5 });
 * // All transactions will have batch.productId === 5
 *
 * @example
 * // Combined filters
 * const { data: transactions } = useTransactions({
 *   productId: 5,
 *   startDate: "2024-01-01",
 *   endDate: "2024-01-31"
 * });
 */
export function useTransactions(
  filters?: TransactionFilters,
): QueryResult<StockTransactionWithRelations[]> {
  const { transactions, batches, products, categories, suppliers } =
    useCollections();

  const liveResult = useLiveQuery(
    (q) => {
      let query = q
        .from({ transaction: transactions })
        .join(
          { batch: batches },
          ({ transaction, batch }) => eq(transaction.batchId, batch.id),
          "left",
        )
        .join(
          { product: products },
          ({ batch, product }) => eq(batch.productId, product.id),
          "left",
        )
        .join(
          { category: categories },
          ({ product, category }) => eq(product.categoryId, category.id),
          "left",
        )
        .join(
          { batchSupplier: suppliers },
          ({ batch, batchSupplier }) => eq(batch.supplierId, batchSupplier.id),
          "left",
        )
        .join(
          { productSupplier: suppliers },
          ({ product, productSupplier }) =>
            eq(product.defaultSupplierId, productSupplier.id),
          "left",
        );

      // Apply filters using TanStack DB operators
      if (filters?.startDate || filters?.endDate || filters?.productId) {
        query = query.where(({ transaction, batch }) => {
          const conditions = [];

          if (filters.startDate) {
            // Convert date-only string to ISO timestamp for comparison
            const startDateTime = `${filters.startDate}T00:00:00.000Z`;
            conditions.push(gte(transaction.timestamp, startDateTime));
          }

          if (filters.endDate) {
            // Include the entire end date by using end of day
            const endDateTime = `${filters.endDate}T23:59:59.999Z`;
            conditions.push(lte(transaction.timestamp, endDateTime));
          }

          if (filters.productId) {
            // Filter by productId via batch join
            conditions.push(eq(batch.productId, filters.productId));
          }

          // Combine all conditions with AND
          return conditions.length === 0
            ? true
            : conditions.reduce((acc, condition) => and(acc, condition));
        });
      }

      return query.select(
        ({
          transaction,
          batch,
          product,
          category,
          batchSupplier,
          productSupplier,
        }) => ({
          ...transaction,
          batch: (batch
            ? {
                ...batch,
                product: product
                  ? {
                      ...product,
                      category: category ?? null,
                      defaultSupplier: productSupplier ?? null,
                    }
                  : null,
                supplier: batchSupplier ?? null,
              }
            : null) as StockTransactionWithRelations["batch"],
        }),
      );
    },
    [
      filters?.startDate,
      filters?.endDate,
      filters?.productId,
      transactions,
      batches,
      products,
      categories,
      suppliers,
    ],
  );

  return wrapLiveQuery(liveResult);
}

/**
 * Legacy hook for backward compatibility
 * @deprecated Use useTransactions({ productId }) instead
 */
export function useStockTransactions(productId: number) {
  return useTransactions({ productId });
}
