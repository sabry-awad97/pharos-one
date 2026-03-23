/**
 * DataTableColumnHeader Component
 * Generic column header with sorting support
 *
 * ARCHITECTURE: Reusable component for table headers
 * - Handles sorting interaction
 * - Shows sort indicators
 * - Supports custom styling
 *
 * USAGE:
 * ```typescript
 * {
 *   accessorKey: "name",
 *   header: ({ column }) => (
 *     <DataTableColumnHeader column={column} title="Name" />
 *   ),
 * }
 * ```
 */

import type { Column } from "@tanstack/react-table";

/**
 * Props for DataTableColumnHeader
 */
export interface DataTableColumnHeaderProps<TData, TValue = unknown> {
  /**
   * The column instance from TanStack Table
   */
  column: Column<TData, TValue>;

  /**
   * The title text to display
   */
  title: string;

  /**
   * Optional custom className
   */
  className?: string;
}

/**
 * Generic column header component with sorting support
 *
 * Features:
 * - Displays column title
 * - Shows sort indicators (↑/↓)
 * - Handles click to toggle sorting
 * - Supports custom styling
 *
 * @example
 * ```typescript
 * <DataTableColumnHeader column={column} title="Product Name" />
 * ```
 */
export function DataTableColumnHeader<TData, TValue = unknown>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <div
      className={`flex items-center gap-1.5 cursor-pointer select-none text-muted-foreground hover:text-foreground transition-colors ${className || ""}`}
      onClick={column.getToggleSortingHandler()}
    >
      {title}
      {column.getIsSorted() && (
        <span className="text-primary font-bold">
          {{
            asc: "↑",
            desc: "↓",
          }[column.getIsSorted() as string] ?? null}
        </span>
      )}
    </div>
  );
}
