/**
 * StockMovementsPanel Component
 * Inline panel displaying stock transaction history with filters
 *
 * ARCHITECTURE: Inline panel component (not overlay)
 * - Displays next to table in workspace
 * - Integrates Timeline, TransactionTypeFilter, DateRangePicker
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
import { DateRangePicker } from "@/components/date-range-picker";
import { TransactionTypeFilter } from "./filters/TransactionTypeFilter";
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
 * - Type filter and date range picker
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
      <div className="flex-none border-b border-border">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-normal text-foreground truncate">
              {productName || "Stock Movements"}
            </h3>
            <p className="text-[11px] font-normal text-muted-foreground mt-0.5">
              Transaction history
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2">
            {/* Date Range Picker - Left */}
            <div className="flex-1">
              <DateRangePicker
                size="sm"
                initialDateFrom={filters.dateFrom || undefined}
                initialDateTo={filters.dateTo || undefined}
                onUpdate={({ range }) => {
                  setFilters({
                    ...filters,
                    dateFrom: range.from || null,
                    dateTo: range.to || null,
                  });
                }}
              />
            </div>

            {/* Type Filter - Right */}
            <TransactionTypeFilter
              value={filters.types}
              onChange={(types) => setFilters({ ...filters, types })}
            />

            {/* Clear Button - X Icon */}
            <button
              onClick={clearFilters}
              className="flex items-center justify-center w-6 h-6 rounded-md border border-border bg-background hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors group"
              aria-label="Clear filters"
              title="Clear filters"
            >
              <X className="w-3 h-3 transition-transform group-hover:rotate-90" />
            </button>
          </div>
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
          <div className="flex items-center justify-center h-full text-destructive text-sm font-normal">
            Failed to load transactions. Please try again.
          </div>
        )}

        {!isLoading && !isError && (
          <div className="mt-4">
            <Timeline transactions={filteredTransactions} />
            {/* Transaction count */}
            <p className="text-[11px] font-normal text-muted-foreground mt-4 pb-4">
              {filteredTransactions.length} of {transactions.length}{" "}
              transactions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
