/**
 * Reports toolbar component
 * Module-specific actions for reports and analytics
 */

import { Download, Calendar, Filter, RefreshCw } from "lucide-react";

/**
 * Reports toolbar with module-specific actions
 * Provides Export, Date Range, Filter, and Refresh actions
 */
export function ReportsToolbar() {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
        onClick={() => console.log("Export report")}
      >
        <Download className="h-4 w-4" />
        <span>Export</span>
      </button>

      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
        onClick={() => console.log("Select date range")}
      >
        <Calendar className="h-4 w-4" />
        <span>Date Range</span>
      </button>

      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
        onClick={() => console.log("Filter reports")}
      >
        <Filter className="h-4 w-4" />
        <span>Filter</span>
      </button>

      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
        onClick={() => console.log("Refresh reports")}
      >
        <RefreshCw className="h-4 w-4" />
        <span>Refresh</span>
      </button>
    </div>
  );
}
