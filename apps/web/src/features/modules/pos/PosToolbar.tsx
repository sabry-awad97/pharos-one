/**
 * POS toolbar component
 * Module-specific actions for point of sale
 */

import { ShoppingCart, Trash2, User, Receipt } from "lucide-react";

/**
 * POS toolbar with module-specific actions
 * Provides New Sale, Clear Cart, Customer, and Print Receipt actions
 */
export function PosToolbar() {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
        onClick={() => console.log("New sale")}
      >
        <ShoppingCart className="h-4 w-4" />
        <span>New Sale</span>
      </button>

      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
        onClick={() => console.log("Clear cart")}
      >
        <Trash2 className="h-4 w-4" />
        <span>Clear Cart</span>
      </button>

      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
        onClick={() => console.log("Select customer")}
      >
        <User className="h-4 w-4" />
        <span>Customer</span>
      </button>

      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
        onClick={() => console.log("Print receipt")}
      >
        <Receipt className="h-4 w-4" />
        <span>Print</span>
      </button>
    </div>
  );
}
