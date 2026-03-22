/**
 * StockMovementsPanel Component
 * Inline panel displaying stock transaction history with filters
 *
 * ARCHITECTURE: Inline panel component (not overlay)
 * - Displays next to table in workspace
 * - Integrates Timeline, TransactionTypeFilter, DateRangeFilter
 * - Uses useStockTransactions hook for data
 * - Uses useTransactionFilters hook for filtering
 * - Handles loading, error, and empty states
 * - Zero hardcoded colors (theme variables only)
 *
 * USAGE:
 * ```typescript
 * <StockMovementsPanel
 *   productId={1}
 *   productName="Amoxicillin 500mg"
 *   onClose={() => setIsOpen(false)}
 * />
 * ```
 */

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@pharos-one/ui/components/button";
import { Skeleton } from "@pharos-one/ui/components/skeleton";
import { TransactionTypeFilter } from "./filters/TransactionTypeFilter";
import { DateRangeFilter } from "./filters/DateRangeFilter";
import { Timeline } from "./timeline/Timeline";
import { useTransactionFilters } from "../hooks/use-transaction-filters";
import { useStockTransactions } from "../hooks/use-transactions";

/**
 * Props for StockMovementsPanel component
 */
export interface StockMovementsPanelProps {
  /**
   * Product ID to fetch transactions for
   */
  productId: number;

  /**
   * Product name to display in header
   */
  productName?: string;

  /**
   * Callback when panel should close
   */
  onClose: () => void;
}

/**
 * Stock Movements Panel - displays transaction history inline
 *
 * Features:
 * - Inline panel next to table
 * - Transaction timeline with date grouping
 * - Type and date range filters
 * - Loading skeleton
 * - Error message display
 * - Empty state handling
 * - Transaction count display
 * - Closes when X button clicked
 *
 * @example
 * ```typescript
 * <StockMovementsPanel
 *   productId={1}
 *   productName="Amoxicillin 500mg"
 *   onClose={() => setIsOpen(false)}
 * />
 * ```
 */
export function StockMovementsPanel({
  productId,
  productName,
  onClose,
}: StockMovementsPanelProps) {
  const { filters, setFilters, clearFilters, applyFilters } =
    useTransactionFilters();
  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useStockTransactions(productId);

  // Apply filters to transactions
  const filteredTransactions = React.useMemo(
    () => applyFilters(transactions),
    [transactions, applyFilters],
  );

  return (
    <div
      className="flex flex-col h-full bg-card border-l border-border"
      role="complementary"
    >
      {/* Header */}
      <div className="flex-none px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {productName || "Stock Movements"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Stock transaction history
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-3">
          <TransactionTypeFilter
            value={filters.types}
            onChange={(types) => setFilters({ ...filters, types })}
          />
          <DateRangeFilter
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            onChange={(dateFrom, dateTo) =>
              setFilters({ ...filters, dateFrom, dateTo })
            }
          />
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto px-4">
        {isLoading && (
          <div data-testid="loading-skeleton" className="space-y-4 mt-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex items-center justify-center h-full text-destructive text-sm">
            Failed to load transactions. Please try again.
          </div>
        )}

        {!isLoading && !isError && (
          <div className="mt-4">
            <Timeline transactions={filteredTransactions} />
            {/* Transaction count */}
            <p className="text-xs text-muted-foreground mt-4 pb-4">
              {filteredTransactions.length} of {transactions.length}{" "}
              transactions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
