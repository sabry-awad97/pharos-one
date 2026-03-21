/**
 * Customers toolbar component
 * Module-specific actions for customer management
 */

import { Plus, Download, Filter, Search } from "lucide-react";

/**
 * Customers toolbar with module-specific actions
 * Provides Add Customer, Export, Filter, and Search actions
 */
export function CustomersToolbar() {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
        onClick={() => console.log("Add new customer")}
      >
        <Plus className="h-4 w-4" />
        <span>Add Customer</span>
      </button>

      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
        onClick={() => console.log("Export customers")}
      >
        <Download className="h-4 w-4" />
        <span>Export</span>
      </button>

      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
        onClick={() => console.log("Filter customers")}
      >
        <Filter className="h-4 w-4" />
        <span>Filter</span>
      </button>

      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
        onClick={() => console.log("Search customers")}
      >
        <Search className="h-4 w-4" />
        <span>Search</span>
      </button>
    </div>
  );
}
