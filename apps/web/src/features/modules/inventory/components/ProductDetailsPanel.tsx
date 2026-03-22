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
import { ProductDetailsTab } from "./ProductDetailsTab";
import { ProductLotsTab } from "./ProductLotsTab";
import { ProductHistoryTab } from "./ProductHistoryTab";

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
              Product information and batches
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

        {activeTab === "lots" && <ProductLotsTab productId={productId} />}

        {activeTab === "history" && <ProductHistoryTab productId={productId} />}
      </div>
    </div>
  );
}
