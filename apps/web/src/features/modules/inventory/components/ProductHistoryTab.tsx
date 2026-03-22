/**
 * ProductHistoryTab Component
 * Displays stock transaction timeline for a product
 *
 * ARCHITECTURE: Read-only display component
 * - Uses useStockTransactions hook for data fetching
 * - Handles loading, error, and empty states
 * - Uses shadcn theme variables (no hardcoded colors)
 * - Displays transactions in reverse chronological order
 *
 * USAGE:
 * ```typescript
 * <ProductHistoryTab productId={1} />
 * ```
 */

import { useStockTransactions } from "../hooks/use-transactions";
import type { TransactionType } from "../schema";

/**
 * Props for ProductHistoryTab component
 */
export interface ProductHistoryTabProps {
  /**
   * Product ID to fetch transactions for
   */
  productId: number;
}

/**
 * Get color classes for transaction type
 */
function getTransactionTypeColor(type: TransactionType): string {
  const colors: Record<TransactionType, string> = {
    purchase: "text-primary",
    sale: "text-foreground",
    adjustment: "text-muted-foreground",
    transfer: "text-accent",
    return: "text-primary",
    damage: "text-destructive",
    expiry: "text-destructive",
  };
  return colors[type];
}

/**
 * Format timestamp to readable date/time
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * History tab showing stock transaction timeline
 *
 * Features:
 * - Displays transaction type, quantity change, timestamp, reason
 * - Transaction types are color-coded using shadcn theme variables
 * - Handles loading, error, and empty states
 * - Reverse chronological order (newest first)
 * - Accessible with semantic HTML
 *
 * @example
 * ```typescript
 * <ProductHistoryTab productId={1} />
 * ```
 */
export function ProductHistoryTab({ productId }: ProductHistoryTabProps) {
  const {
    data: transactions,
    isLoading,
    isError,
    error,
  } = useStockTransactions(productId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Loading transaction history...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full text-destructive text-sm">
        Error loading transactions: {error?.message}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        No transaction history found for this product.
      </div>
    );
  }

  // Sort transactions in reverse chronological order (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className="p-4">
      <div className="space-y-3">
        {sortedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${getTransactionTypeColor(transaction.type)}`}
                >
                  {transaction.type}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    transaction.quantity > 0
                      ? "text-primary"
                      : "text-destructive"
                  }`}
                >
                  {transaction.quantity > 0 ? "+" : ""}
                  {transaction.quantity}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(transaction.timestamp)}
              </span>
            </div>
            {transaction.reason && (
              <p className="text-xs text-muted-foreground">
                {transaction.reason}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
