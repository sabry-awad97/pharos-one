/**
 * Hook for managing transaction filter state
 * Provides filter state management and filter application logic
 */

import { useState, useCallback } from "react";
import type { TransactionType, StockTransactionWithRelations } from "../schema";

export interface TransactionFilters {
  types: TransactionType[];
  dateFrom: Date | null;
  dateTo: Date | null;
}

const initialFilters: TransactionFilters = {
  types: [],
  dateFrom: null,
  dateTo: null,
};

export function useTransactionFilters() {
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const applyFilters = useCallback(
    (transactions: StockTransactionWithRelations[]) => {
      return transactions.filter((transaction) => {
        // Type filter
        if (
          filters.types.length > 0 &&
          !filters.types.includes(transaction.type)
        ) {
          return false;
        }

        // Date range filter
        const txDate = new Date(transaction.timestamp);
        if (filters.dateFrom && txDate < filters.dateFrom) {
          return false;
        }
        if (filters.dateTo && txDate > filters.dateTo) {
          return false;
        }

        return true;
      });
    },
    [filters],
  );

  return {
    filters,
    setFilters,
    clearFilters,
    applyFilters,
  };
}
