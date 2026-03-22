/**
 * ProductLotsTab Component
 * Displays batch/lot tracking information for a product
 *
 * ARCHITECTURE: Read-only display component
 * - Extracted from BatchDetailsPanel
 * - Uses useBatches hook for data fetching
 * - Handles loading, error, and empty states
 * - Uses shadcn theme variables (no hardcoded colors)
 *
 * USAGE:
 * ```typescript
 * <ProductLotsTab productId={1} />
 * ```
 */

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
 * Lots tab showing batch/lot tracking information
 *
 * Features:
 * - Displays batch number, supplier, expiry date, quantity, cost, status
 * - Handles loading, error, and empty states
 * - Uses shadcn theme variables for consistent styling
 * - Accessible with semantic HTML
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
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Loading batches...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full text-destructive text-sm">
        Error loading batches: {error?.message}
      </div>
    );
  }

  if (!batches || batches.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        No batches found for this product.
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {batch.batchNumber}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {batch.supplier.name}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 text-xs rounded ${
                  batch.status === "available"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {batch.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Expiry:</span>
                <span className="ml-1 text-foreground">{batch.expiryDate}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Quantity:</span>
                <span className="ml-1 text-foreground">
                  {batch.quantityRemaining}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Received:</span>
                <span className="ml-1 text-foreground">
                  {batch.receivedDate}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Cost:</span>
                <span className="ml-1 text-foreground">
                  ${batch.costPerUnit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
