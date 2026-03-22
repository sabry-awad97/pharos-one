/**
 * StockMovementsPanel Component
 * Slide-in drawer displaying stock transaction history with filters
 *
 * ARCHITECTURE: Sheet-based overlay panel
 * - Opens as slide-in drawer from right
 * - Integrates Timeline, TransactionTypeFilter, DateRangeFilter
 * - Uses useStockTransactions hook for data
 * - Uses useTransactionFilters hook for filtering
 * - Handles loading, error, and empty states
 * - Zero hardcoded colors (theme variables only)
 *
 * USAGE:
 * ```typescript
 * <StockMovementsPanel
 *   open={true}
 *   onOpenChange={setOpen}
 *   productId={1}
 *   productName="Amoxicillin 500mg"
 * />
 * ```
 */

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@pharos-one/ui/components/sheet";
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
   * Whether the panel is open
   */
  open: boolean;

  /**
   * Callback when panel open state changes
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Product ID to fetch transactions for
   */
  productId: number;

  /**
   * Product name to display in header
   */
  productName?: string;
}

/**
 * Stock Movements Panel - displays transaction history in a slide-in drawer
 *
 * Features:
 * - Slide-in drawer from right
 * - Transaction timeline with date grouping
 * - Type and date range filters
 * - Loading skeleton
 * - Error message display
 * - Empty state handling
 * - Transaction count in footer
 * - Closes on backdrop click or ESC key
 *
 * @example
 * ```typescript
 * <StockMovementsPanel
 *   open={true}
 *   onOpenChange={setOpen}
 *   productId={1}
 *   productName="Amoxicillin 500mg"
 * />
 * ```
 */
export function StockMovementsPanel({
  open,
  onOpenChange,
  productId,
  productName,
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[500px] flex flex-col">
        <SheetHeader>
          <SheetTitle>{productName || "Stock Movements"}</SheetTitle>
          <SheetDescription>Stock transaction history</SheetDescription>
        </SheetHeader>

        {/* Filters */}
        <div className="flex gap-2 my-4 px-6">
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

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-auto px-6">
          {isLoading && (
            <div data-testid="loading-skeleton" className="space-y-4">
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
            <Timeline transactions={filteredTransactions} />
          )}
        </div>

        {/* Footer */}
        {!isLoading && !isError && (
          <SheetFooter>
            <p className="text-sm text-muted-foreground">
              {filteredTransactions.length} of {transactions.length}{" "}
              transactions
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
