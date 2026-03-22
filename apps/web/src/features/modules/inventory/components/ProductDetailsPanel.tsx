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

import { X } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@pharos-one/ui/components/tabs";
import { ProductDetailsTab } from "./ProductDetailsTab";
import { ProductLotsTab } from "./ProductLotsTab";

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
 * - Displays batch details with tabs: Details, Lots
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
  return (
    <Tabs
      defaultValue="details"
      className="flex flex-col h-full bg-card border-l border-border"
    >
      {/* Header */}
      <div className="flex-none border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {productName || "Product Details"}
            </h3>
            <p className="text-[11px] font-normal text-muted-foreground mt-0.5">
              Product information and batches
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <TabsList variant="line" className="px-4 h-auto gap-6">
          <TabsTrigger
            value="details"
            className="font-semibold data-active:text-primary after:bg-primary after:h-[2px]"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="lots"
            className="font-semibold data-active:text-primary after:bg-primary after:h-[2px]"
          >
            Lots
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Content */}
      <TabsContent
        value="details"
        className="flex-1 m-0 p-0 overflow-auto custom-scrollbar"
      >
        <ProductDetailsTab productId={productId} />
      </TabsContent>

      <TabsContent
        value="lots"
        className="flex-1 m-0 p-0 overflow-auto custom-scrollbar"
      >
        <ProductLotsTab productId={productId} />
      </TabsContent>
    </Tabs>
  );
}
