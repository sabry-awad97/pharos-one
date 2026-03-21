/**
 * Purchases toolbar component
 * Module-specific actions for purchase order management
 */

import { Plus, Download, Filter, Truck } from "lucide-react";

/**
 * Purchases toolbar with module-specific actions
 * Provides New PO, Export, Filter, and Track Delivery actions
 */
export function PurchasesToolbar() {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
        onClick={() => console.log("Create new purchase order")}
      >
        <Plus className="h-4 w-4" />
        <span>New PO</span>
      </button>

      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
        onClick={() => console.log("Export purchase orders")}
      >
        <Download className="h-4 w-4" />
        <span>Export</span>
      </button>

      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
        onClick={() => console.log("Filter purchase orders")}
      >
        <Filter className="h-4 w-4" />
        <span>Filter</span>
      </button>

      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
        onClick={() => console.log("Track delivery")}
      >
        <Truck className="h-4 w-4" />
        <span>Track</span>
      </button>
    </div>
  );
}
