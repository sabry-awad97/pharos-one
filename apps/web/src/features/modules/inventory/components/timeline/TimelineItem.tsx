/**
 * TimelineItem Component
 * Displays full transaction details with marker
 *
 * ARCHITECTURE: Composable component following shadcn/ui patterns
 * - Uses React.forwardRef for ref forwarding
 * - Composes TimelineMarker for icon display
 * - Uses theme variables for colors
 * - Formats timestamps for readability
 *
 * USAGE:
 * ```typescript
 * <TimelineItem transaction={transaction} />
 * ```
 */

import * as React from "react";
import { cn } from "@pharos-one/ui/lib/utils";
import { TimelineMarker } from "./TimelineMarker";
import type { StockTransaction } from "../../schema";

/**
 * Format timestamp to readable time
 */
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Props for TimelineItem component
 */
export interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Transaction to display
   */
  transaction: StockTransaction;
}

/**
 * Timeline item displaying transaction details
 *
 * Features:
 * - Transaction type with color-coded marker
 * - Quantity change with +/- indicator
 * - Formatted timestamp
 * - Optional reason display
 * - Hover state for interactivity
 *
 * @example
 * ```typescript
 * <TimelineItem transaction={transaction} />
 * ```
 */
export const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, transaction, ...props }, ref) => {
    const quantitySign = transaction.quantity > 0 ? "+" : "";

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors",
          className,
        )}
        {...props}
      >
        <TimelineMarker type={transaction.type} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {transaction.type}
              </span>
              <span
                className={cn(
                  "text-sm font-semibold",
                  transaction.quantity > 0
                    ? "text-primary"
                    : "text-destructive",
                )}
              >
                {quantitySign}
                {transaction.quantity}
              </span>
            </div>
            <span className="text-xs text-muted-foreground flex-none">
              {formatTime(transaction.timestamp)}
            </span>
          </div>
          {transaction.reason && (
            <p className="text-xs text-muted-foreground">
              {transaction.reason}
            </p>
          )}
        </div>
      </div>
    );
  },
);

TimelineItem.displayName = "TimelineItem";
