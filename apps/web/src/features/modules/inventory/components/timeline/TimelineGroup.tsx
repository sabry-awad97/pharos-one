/**
 * TimelineGroup Component
 * Groups transactions by date with header
 *
 * ARCHITECTURE: Composable component following shadcn/ui patterns
 * - Uses React.forwardRef for ref forwarding
 * - Composes TimelineItem for transaction display
 * - Groups transactions under date header
 * - Uses theme variables for colors
 *
 * USAGE:
 * ```typescript
 * <TimelineGroup date="2024-01-15" transactions={transactions} />
 * ```
 */

import * as React from "react";
import { cn } from "@pharos-one/ui/lib/utils";
import { TimelineItem } from "./TimelineItem";
import type { StockTransactionWithRelations } from "../../schema";

/**
 * Format date to readable format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Props for TimelineGroup component
 */
export interface TimelineGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Date for this group (YYYY-MM-DD format)
   */
  date: string;

  /**
   * Transactions for this date
   */
  transactions: StockTransactionWithRelations[];
}

/**
 * Timeline group with date header and transactions
 *
 * Features:
 * - Formatted date header
 * - Groups transactions by date
 * - Composable with TimelineItem
 * - Proper spacing and layout
 *
 * @example
 * ```typescript
 * <TimelineGroup date="2024-01-15" transactions={transactions} />
 * ```
 */
export const TimelineGroup = React.forwardRef<
  HTMLDivElement,
  TimelineGroupProps
>(({ className, date, transactions, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-3", className)} {...props}>
      <h3 className="text-sm font-semibold text-foreground sticky top-0 bg-background py-2">
        {formatDate(date)}
      </h3>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <TimelineItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
});

TimelineGroup.displayName = "TimelineGroup";
