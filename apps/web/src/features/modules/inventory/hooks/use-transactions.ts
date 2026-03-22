/**
 * Transaction data hooks using TanStack Query
 */

import { useQuery } from "@tanstack/react-query";
import { fetchTransactionsByProductId } from "../services/transaction.service";

/**
 * Hook to fetch stock transactions for a specific product
 *
 * @example
 * const { data: transactions, isLoading } = useStockTransactions(5);
 */
export function useStockTransactions(productId: number) {
  return useQuery({
    queryKey: ["inventory", "transactions", productId],
    queryFn: () => fetchTransactionsByProductId(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
}
