/**
 * ProductLotsTab Component
 * Displays batch/lot tracking information with compact, beautiful layout
 *
 * ARCHITECTURE: Compact card-based design matching StockMovementsPanel
 * - Dense information display with visual hierarchy
 * - Status indicators with color coding
 * - Expiry warnings with visual cues
 * - Hover states for interactivity
 * - Uses shadcn theme variables exclusively
 *
 * DESIGN DIRECTION: Utilitarian/Industrial
 * - Function-first with technical aesthetics
 * - Monospace fonts for data
 * - Subtle borders and spacing
 * - Status-driven color system
 *
 * USAGE:
 * ```typescript
 * <ProductLotsTab productId={1} />
 * ```
 */

import { Package, Calendar, DollarSign, AlertTriangle } from "lucide-react";
import { useBatches } from "../hooks/use-batches";

/**
 * Props for ProductLotsTab component
 */
export interface ProductLotsTabProps {
  /**
   * Product ID to fetch batches for
   */
  productId: number;
}

/**
 * Check if batch is expiring soon (within 90 days)
 */
function isExpiringSoon(expiryDate: string): boolean {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.floor(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
}

/**
 * Check if batch is expired
 */
function isExpired(expiryDate: string): boolean {
  const expiry = new Date(expiryDate);
  const now = new Date();
  return expiry < now;
}

/**
 * Lots tab showing batch/lot tracking information
 *
 * Features:
 * - Compact card layout with visual hierarchy
 * - Status badges with semantic colors
 * - Expiry warnings with icons
 * - Hover states for interactivity
 * - Monospace fonts for technical data
 * - Loading, error, and empty states
 *
 * @example
 * ```typescript
 * <ProductLotsTab productId={1} />
 * ```
 */
export function ProductLotsTab({ productId }: ProductLotsTabProps) {
  const { data: batches, isLoading, isError, error } = useBatches(productId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
        Loading batches...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full text-destructive text-xs">
        Error loading batches: {error?.message}
      </div>
    );
  }

  if (!batches || batches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Package className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-xs">No batches found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-auto px-4 py-3 custom-scrollbar">
        <div className="space-y-2">
          {batches.map((batch) => {
            const expiring = isExpiringSoon(batch.expiryDate);
            const expired = isExpired(batch.expiryDate);
            const isLowStock = batch.quantityRemaining < 10;

            return (
              <div
                key={batch.id}
                className="group relative rounded-md border border-border bg-card hover:bg-[#f0f6ff] dark:hover:bg-muted/50 transition-colors"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <p className="text-xs font-mono font-semibold text-foreground">
                      {batch.batchNumber}
                    </p>
                    {(expired || expiring) && (
                      <AlertTriangle
                        className={`w-3 h-3 flex-none ${expired ? "text-destructive" : "text-warning"}`}
                      />
                    )}
                  </div>
                  <span
                    className={`flex-none ml-2 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide rounded ${
                      batch.status === "available"
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>

                {/* Content Grid - 2 columns with aligned labels and values */}
                <div className="px-3 py-2">
                  <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
                    {/* Row 1: Supplier */}
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Package className="w-3 h-3 flex-none" />
                      <span>Supplier:</span>
                    </div>
                    <p className="text-[10px] text-foreground truncate">
                      {batch.supplier.name}
                    </p>

                    {/* Row 2: Expiry Date */}
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Calendar className="w-3 h-3 flex-none" />
                      <span>Expires:</span>
                    </div>
                    <p
                      className={`text-[10px] font-mono font-medium ${
                        expired
                          ? "text-destructive"
                          : expiring
                            ? "text-warning"
                            : "text-foreground"
                      }`}
                    >
                      {batch.expiryDate}
                    </p>

                    {/* Row 3: Quantity */}
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Package className="w-3 h-3 flex-none" />
                      <span>Stock:</span>
                    </div>
                    <p className="text-[10px]">
                      <span
                        className={`font-mono font-semibold ${
                          isLowStock ? "text-warning" : "text-foreground"
                        }`}
                      >
                        {batch.quantityRemaining}
                      </span>
                      <span className="text-muted-foreground ml-1">units</span>
                    </p>

                    {/* Row 4: Cost */}
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <DollarSign className="w-3 h-3 flex-none" />
                      <span>Cost:</span>
                    </div>
                    <p className="text-[10px]">
                      <span className="font-mono font-medium text-foreground">
                        ${batch.costPerUnit}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        per unit
                      </span>
                    </p>

                    {/* Row 5: Received Date */}
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Calendar className="w-3 h-3 flex-none" />
                      <span>Received:</span>
                    </div>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      {batch.receivedDate}
                    </p>
                  </div>

                  {/* Expiry Status Badge - Bottom Right */}
                  <div className="flex justify-end mt-2">
                    {expired ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide rounded bg-destructive/10 text-destructive border border-destructive/20">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Expired
                      </span>
                    ) : expiring ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide rounded bg-warning/10 text-warning border border-warning/20">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Expiring Soon
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide rounded bg-primary/10 text-primary border border-primary/20">
                        Valid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer - Batch count always at bottom */}
      <div className="flex-none px-4 py-3 border-t border-border bg-card">
        <p className="text-[11px] font-normal text-muted-foreground">
          {batches.length} batch{batches.length !== 1 ? "es" : ""} • Total:{" "}
          {batches.reduce((sum, b) => sum + b.quantityRemaining, 0)} units
        </p>
      </div>
    </div>
  );
}
