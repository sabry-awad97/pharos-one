/**
 * Timeline Component
 * Main container for transaction timeline with grouping
 *
 * ARCHITECTURE: Composable component following shadcn/ui patterns
 * - Uses React.forwardRef for ref forwarding
 * - Composes TimelineGroup for date grouping
 * - Handles empty state gracefully
 * - Groups transactions by date automatically
 * - Uses theme variables for colors
 *
 * USAGE:
 * ```typescript
 * <Timeline transactions={transactions} />
 * ```
 */

import * as React from "react";
import { cn } from "@pharos-one/ui/lib/utils";
import { TimelineGroup } from "./TimelineGroup";
import type { StockTransaction } from "../../schema";

/**
 * Group transactions by date
 */
function groupByDate(
  transactions: StockTransaction[],
): Record<string, StockTransaction[]> {
  return transactions.reduce(
    (groups, transaction) => {
      const date = transaction.timestamp.split("T")[0]; // Extract YYYY-MM-DD
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    },
    {} as Record<string, StockTransaction[]>,
  );
}

/**
 * Props for Timeline component
 */
export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Transactions to display
   */
  transactions: StockTransaction[];
}

/**
 * Timeline container with automatic date grouping
 *
 * Features:
 * - Automatic grouping by date
 * - Empty state handling
 * - Reverse chronological order (newest first)
 * - Composable with TimelineGroup
 * - Scrollable container
 *
 * @example
 * ```typescript
 * <Timeline transactions={transactions} />
 * ```
 */
export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, transactions, ...props }, ref) => {
    // Handle empty state
    if (!transactions || transactions.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-center h-full text-muted-foreground text-sm",
            className,
          )}
          {...props}
        >
          No transaction history available.
        </div>
      );
    }

    // Sort transactions in reverse chronological order
    const sortedTransactions = [...transactions].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    // Group by date
    const groupedByDate = groupByDate(sortedTransactions);

    // Sort dates in reverse chronological order
    const sortedDates = Object.keys(groupedByDate).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );

    return (
      <div ref={ref} className={cn("space-y-6 p-4", className)} {...props}>
        {sortedDates.map((date) => (
          <TimelineGroup
            key={date}
            date={date}
            transactions={groupedByDate[date]}
          />
        ))}
      </div>
    );
  },
);

Timeline.displayName = "Timeline";
