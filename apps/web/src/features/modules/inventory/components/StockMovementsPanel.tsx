/**
 * StockMovementsPanel Component
 * Inline panel displaying stock transaction history
 *
 * ARCHITECTURE: Matches PharmacyInventory mockup design
 * - Simple header with title and close button
 * - No filters (clean, minimal design)
 * - Timeline list of transactions
 * - Dark theme with subtle borders
 * - Transaction count at bottom
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
import { Skeleton } from "@pharos-one/ui/components/skeleton";
import { Timeline } from "./timeline/Timeline";
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
 * - Simple header with close button
 * - Transaction timeline
 * - Loading skeleton
 * - Error message display
 * - Empty state handling
 * - Transaction count display
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
  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useStockTransactions(productId);

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
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Stock Movements
            </h3>
            <p className="text-sm font-normal text-foreground truncate">
              {productName || "Product"}
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
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto px-4 custom-scrollbar">
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
            <Timeline transactions={transactions} />
          </div>
        )}
      </div>

      {/* Footer - Transaction count always at bottom */}
      {!isLoading && !isError && transactions.length > 0 && (
        <div className="flex-none px-4 py-3 border-t border-border bg-card">
          <p className="text-[11px] font-normal text-muted-foreground">
            {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
