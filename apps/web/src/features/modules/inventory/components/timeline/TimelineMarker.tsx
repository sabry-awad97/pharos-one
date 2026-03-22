/**
 * TimelineMarker Component
 * Displays icon and color for transaction type
 *
 * ARCHITECTURE: Composable component following shadcn/ui patterns
 * - Uses React.forwardRef for ref forwarding
 * - Uses theme variables for colors (no hardcoded colors)
 * - Uses lucide-react icons
 * - Follows class-variance-authority pattern for variants
 *
 * USAGE:
 * ```typescript
 * <TimelineMarker type="purchase" />
 * <TimelineMarker type="sale" />
 * ```
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  ShoppingCart,
  TrendingDown,
  Edit3,
  ArrowRightLeft,
  RotateCcw,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { cn } from "@pharos-one/ui/lib/utils";
import type { TransactionType } from "../../schema";

/**
 * Icon mapping for transaction types
 */
const transactionIcons: Record<TransactionType, React.ComponentType<any>> = {
  purchase: ShoppingCart,
  sale: TrendingDown,
  adjustment: Edit3,
  transfer: ArrowRightLeft,
  return: RotateCcw,
  damage: AlertTriangle,
  expiry: Clock,
};

/**
 * Marker variants using theme variables
 */
const markerVariants = cva(
  "flex items-center justify-center rounded-full w-8 h-8 flex-none",
  {
    variants: {
      type: {
        purchase: "bg-primary/10 text-primary",
        sale: "bg-foreground/10 text-foreground",
        adjustment: "bg-muted text-muted-foreground",
        transfer: "bg-accent/10 text-accent",
        return: "bg-primary/10 text-primary",
        damage: "bg-destructive/10 text-destructive",
        expiry: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      type: "purchase",
    },
  },
);

/**
 * Props for TimelineMarker component
 */
export interface TimelineMarkerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof markerVariants> {
  /**
   * Transaction type to display
   */
  type: TransactionType;
}

/**
 * Timeline marker showing icon and color for transaction type
 *
 * Features:
 * - Icon per transaction type (lucide-react)
 * - Color coding using theme variables
 * - Composable with other timeline components
 * - Accessible with proper ARIA attributes
 *
 * @example
 * ```typescript
 * <TimelineMarker type="purchase" />
 * <TimelineMarker type="damage" />
 * ```
 */
export const TimelineMarker = React.forwardRef<
  HTMLDivElement,
  TimelineMarkerProps
>(({ className, type, ...props }, ref) => {
  const Icon = transactionIcons[type];

  return (
    <div
      ref={ref}
      className={cn(markerVariants({ type }), className)}
      role="img"
      aria-label={`${type} transaction`}
      {...props}
    >
      <Icon className="w-4 h-4" />
    </div>
  );
});

TimelineMarker.displayName = "TimelineMarker";
