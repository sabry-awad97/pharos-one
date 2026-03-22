/**
 * Timeline Component
 * Simple list of transactions without date grouping
 *
 * ARCHITECTURE: Matches PharmacyInventory mockup design
 * - No date grouping (flat list)
 * - Reverse chronological order
 * - Minimal spacing
 * - Dark theme
 *
 * USAGE:
 * ```typescript
 * <Timeline transactions={transactions} />
 * ```
 */

import * as React from "react";
import { cn } from "@pharos-one/ui/lib/utils";
import { TimelineItem } from "./TimelineItem";
import type { StockTransactionWithRelations } from "../../schema";

/**
 * Props for Timeline component
 */
export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Transactions to display
   */
  transactions: StockTransactionWithRelations[];
}

/**
 * Timeline container with flat transaction list
 *
 * Features:
 * - Flat list (no date grouping)
 * - Empty state handling
 * - Reverse chronological order (newest first)
 * - Minimal design matching mockup
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

    return (
      <div ref={ref} className={cn("flex flex-col", className)} {...props}>
        {sortedTransactions.map((transaction, index) => (
          <TimelineItem
            key={transaction.id}
            transaction={transaction}
            isLast={index === sortedTransactions.length - 1}
          />
        ))}
      </div>
    );
  },
);

Timeline.displayName = "Timeline";
