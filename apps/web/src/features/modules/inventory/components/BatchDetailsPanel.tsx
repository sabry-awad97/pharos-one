/**
 * BatchDetailsPanel Component
 * Read-only panel displaying all batches for a selected product
 *
 * ARCHITECTURE: Inline panel component (not overlay)
 * - Displays next to table in workspace
 * - Uses Card component for container
 * - Handles loading, empty, and error states
 * - Zero hardcoded colors (theme variables only)
 *
 * USAGE:
 * ```typescript
 * <BatchDetailsPanel
 *   productId={1}
 *   productName="Amoxicillin 500mg"
 *   onClose={() => setIsOpen(false)}
 * />
 * ```
 */

import * as React from "react";
import { X } from "lucide-react";
import { useBatches } from "../hooks/use-batches";
import { ProductDetailsTab } from "./ProductDetailsTab";

/**
 * Props for BatchDetailsPanel component
 */
export interface BatchDetailsPanelProps {
  /**
   * Product ID to fetch batches for
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
 * Read-only panel displaying all batches for a product
 *
 * Features:
 * - Displays batch details with tabs: Details, Lots, History
 * - Handles loading, empty, and error states
 * - Closes when X button clicked
 * - Zero hardcoded colors (uses theme variables)
 *
 * @example
 * ```typescript
 * <BatchDetailsPanel
 *   productId={1}
 *   productName="Amoxicillin 500mg"
 *   onClose={() => setIsOpen(false)}
 * />
 * ```
 */
export function BatchDetailsPanel({
  productId,
  productName,
  onClose,
}: BatchDetailsPanelProps) {
  const { data: batches, isLoading, isError, error } = useBatches(productId);
  const [activeTab, setActiveTab] = React.useState<
    "details" | "lots" | "history"
  >("details");

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Header */}
      <div className="flex-none px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {productName || "Product Details"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {batches?.length || 0}{" "}
              {batches?.length === 1 ? "batch" : "batches"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === "details"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("lots")}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === "lots"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Lots
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === "history"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto">
        {activeTab === "details" && <ProductDetailsTab productId={productId} />}

        {activeTab === "lots" && (
          <div className="p-4">
            {isLoading && (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Loading batches...
              </div>
            )}

            {isError && (
              <div className="flex items-center justify-center h-full text-destructive text-sm">
                Error loading batches: {error?.message}
              </div>
            )}

            {!isLoading && !isError && batches && batches.length === 0 && (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                No batches found for this product.
              </div>
            )}

            {!isLoading && !isError && batches && batches.length > 0 && (
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
                        <span className="ml-1 text-foreground">
                          {batch.expiryDate}
                        </span>
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
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="p-4">
            <div className="text-sm text-muted-foreground">
              Transaction history coming soon...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
