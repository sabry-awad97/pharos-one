/**
 * Inventory toolbar component
 * Module-specific actions for inventory management
 */

import { Plus, Download, Filter, Search } from "lucide-react";

/**
 * Inventory toolbar with module-specific actions
 * Provides Add Item, Export, Filter, and Search actions
 */
export function InventoryToolbar() {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
        onClick={() => console.log("Add new item")}
      >
        <Plus className="h-4 w-4" />
        <span>Add Item</span>
      </button>

      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
        onClick={() => console.log("Export inventory")}
      >
        <Download className="h-4 w-4" />
        <span>Export</span>
      </button>

      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
        onClick={() => console.log("Filter inventory")}
      >
        <Filter className="h-4 w-4" />
        <span>Filter</span>
      </button>

      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
        onClick={() => console.log("Search inventory")}
      >
        <Search className="h-4 w-4" />
        <span>Search</span>
      </button>
    </div>
  );
}
