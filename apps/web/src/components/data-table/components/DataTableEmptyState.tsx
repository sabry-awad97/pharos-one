/**
 * DataTableEmptyState Component
 * Shows a friendly message when the table has no data
 *
 * ARCHITECTURE: Standalone component for empty states
 * - Displays icon and message
 * - Supports filtered vs. no data states
 * - Provides action to clear filters
 *
 * USAGE:
 * ```typescript
 * {table.getFilteredRowModel().rows.length === 0 && (
 *   <DataTableEmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
 * )}
 * ```
 */

import { Package } from "lucide-react";

/**
 * Props for DataTableEmptyState
 */
export interface DataTableEmptyStateProps {
  /**
   * Whether filters are currently active
   */
  hasFilters?: boolean;

  /**
   * Callback to clear all filters
   */
  onClearFilters?: () => void;

  /**
   * Custom message to display
   */
  message?: string;

  /**
   * Custom icon component
   */
  icon?: React.ReactNode;
}

/**
 * Empty state component for data tables
 *
 * Shows a friendly message when there's no data to display,
 * with different messaging for filtered vs. unfiltered states.
 *
 * @example
 * ```typescript
 * <DataTableEmptyState
 *   hasFilters={columnFilters.length > 0}
 *   onClearFilters={() => table.resetColumnFilters()}
 * />
 * ```
 */
export function DataTableEmptyState({
  hasFilters = false,
  onClearFilters,
  message,
  icon,
}: DataTableEmptyStateProps) {
  const defaultMessage = hasFilters
    ? "No items match your filters"
    : "No items to display";

  const defaultDescription = hasFilters
    ? "Try adjusting your filters to see more results"
    : "Add items to get started";

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-card">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon || <Package className="w-8 h-8 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {message || defaultMessage}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
        {defaultDescription}
      </p>
      {hasFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
