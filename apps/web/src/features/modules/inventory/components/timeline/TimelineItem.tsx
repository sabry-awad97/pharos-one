/**
 * TimelineItem Component
 * Clean transaction card with vertical timeline
 *
 * ARCHITECTURE: Simplified shadcn/ui pattern
 * - Vertical timeline with connecting line
 * - Icon-based transaction types
 * - Professional font hierarchy (semibold/medium/normal)
 * - Compact card design
 * - Theme variables only
 *
 * USAGE:
 * ```typescript
 * <TimelineItem transaction={transaction} />
 * ```
 */

import * as React from "react";
import { cn } from "@pharos-one/ui/lib/utils";
import {
  ShoppingCart,
  Package,
  Edit2,
  ArrowLeftRight,
  Clock,
} from "lucide-react";
import type { StockTransactionWithRelations } from "../../schema";

/**
 * Format timestamp to time and date separately
 */
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Get transaction type configuration
 */
function getTypeConfig(type: string) {
  switch (type) {
    case "sale":
      return {
        icon: ShoppingCart,
        label: "Sale",
        colorClass: "text-primary",
        bgClass: "bg-primary/10",
        borderClass: "border-primary/20",
      };
    case "purchase":
      return {
        icon: Package,
        label: "Stock In",
        colorClass: "text-green-700 dark:text-green-400",
        bgClass: "bg-green-50 dark:bg-green-950/30",
        borderClass: "border-green-200 dark:border-green-900/30",
      };
    case "adjustment":
      return {
        icon: Edit2,
        label: "Adjustment",
        colorClass: "text-yellow-700 dark:text-yellow-400",
        bgClass: "bg-yellow-50 dark:bg-yellow-950/30",
        borderClass: "border-yellow-200 dark:border-yellow-900/30",
      };
    case "transfer":
      return {
        icon: ArrowLeftRight,
        label: "Transfer",
        colorClass: "text-purple-700 dark:text-purple-400",
        bgClass: "bg-purple-50 dark:bg-purple-950/30",
        borderClass: "border-purple-200 dark:border-purple-900/30",
      };
    default:
      return {
        icon: Package,
        label: "Unknown",
        colorClass: "text-muted-foreground",
        bgClass: "bg-muted/10",
        borderClass: "border-border",
      };
  }
}

/**
 * Props for TimelineItem component
 */
export interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Transaction to display
   */
  transaction: StockTransactionWithRelations;

  /**
   * Whether this is the last item (no connecting line below)
   */
  isLast?: boolean;
}

/**
 * Timeline item with vertical line, icon node, and card
 *
 * Features:
 * - Vertical timeline with connecting line
 * - Icon node with color-coded background
 * - Card with hover effects
 * - Type badge and quantity display
 * - Timestamp with clock icon
 * - Note/reference display
 *
 * @example
 * ```typescript
 * <TimelineItem transaction={transaction} isLast={false} />
 * ```
 */
export const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, transaction, isLast = false, ...props }, ref) => {
    const config = getTypeConfig(transaction.type);
    const Icon = config.icon;
    const isPositive = transaction.quantity > 0;
    const quantitySign = isPositive ? "+" : "";

    return (
      <div
        ref={ref}
        className={cn("relative flex items-start gap-3 group", className)}
        {...props}
      >
        {/* Vertical Line */}
        {!isLast && (
          <div className="absolute left-[13px] top-8 bottom-0 w-px bg-border" />
        )}

        {/* Timeline Node */}
        <div className="relative z-10 mt-1 shrink-0">
          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center border ring-4 ring-background",
              config.bgClass,
              config.borderClass,
            )}
          >
            <Icon className={cn("w-3 h-3", config.colorClass)} />
          </div>
        </div>

        {/* Content Card */}
        <div className="flex-1 min-w-0 pb-4">
          <div className="bg-card border border-border rounded-lg p-2.5">
            {/* Header: Badge, Quantity & Timestamp */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full",
                    config.bgClass,
                    config.colorClass,
                  )}
                >
                  {config.label}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-normal",
                    isPositive
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400",
                  )}
                >
                  {quantitySign}
                  {transaction.quantity} units
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(transaction.timestamp)}
                </span>
                <span className="text-border">•</span>
                <span>{formatDate(transaction.timestamp)}</span>
              </div>
            </div>

            {/* Note/Reference */}
            <p className="text-[11px] font-normal text-foreground mb-2 truncate">
              {transaction.reason || transaction.batch.batchNumber}
            </p>

            {/* Collapsible Details */}
            <details className="group">
              <summary className="text-[9px] font-medium text-primary cursor-pointer list-none flex items-center gap-1 hover:text-primary/80 transition-colors">
                <span className="inline-block transition-transform group-open:rotate-90">
                  ▸
                </span>
                View Details
              </summary>
              <div className="mt-2 pt-2 border-t border-border">
                <div className="grid grid-cols-2 gap-2">
                  {/* Balance */}
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Balance
                    </span>
                    <span className="text-[11px] font-normal text-foreground">
                      {transaction.batch.quantityRemaining}
                    </span>
                  </div>

                  {/* Reference */}
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Reference
                    </span>
                    <span className="text-[11px] font-normal text-foreground truncate">
                      {transaction.batch.batchNumber}
                    </span>
                  </div>

                  {/* User */}
                  <div className="flex flex-col gap-0.5 col-span-2">
                    <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">
                      User
                    </span>
                    <span className="text-[11px] font-normal text-foreground">
                      User #{transaction.userId}
                    </span>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    );
  },
);

TimelineItem.displayName = "TimelineItem";
