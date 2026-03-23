/**
 * DataTableEmptyState Component
 * Shows a friendly message when the table has no data
 *
 * ARCHITECTURE: Standalone component for empty states using shadcn/ui Empty
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

import { Package, Search } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@pharos-one/ui/components/empty";
import { Button } from "@pharos-one/ui/components/button";

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

  const defaultIcon = hasFilters ? (
    <Search className="w-8 h-8 text-muted-foreground" />
  ) : (
    <Package className="w-8 h-8 text-muted-foreground" />
  );

  return (
    <Empty className="bg-card">
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon || defaultIcon}</EmptyMedia>
        <EmptyTitle>{message || defaultMessage}</EmptyTitle>
        <EmptyDescription>{defaultDescription}</EmptyDescription>
      </EmptyHeader>
      {hasFilters && onClearFilters && (
        <EmptyContent>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-xs"
          >
            Clear all filters
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}
