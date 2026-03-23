/**
 * DataTableLoadingSkeleton Component
 * Reusable loading skeleton for data tables
 *
 * ARCHITECTURE: Standalone component for loading states
 * - Accepts column definitions dynamically
 * - Generates skeleton rows based on column structure
 * - Supports density modes
 * - Uses theme variables only
 *
 * USAGE:
 * ```typescript
 * {isLoading && (
 *   <DataTableLoadingSkeleton columns={columns} rowCount={25} />
 * )}
 * ```
 */

import type { ColumnDef } from "@tanstack/react-table";

/**
 * Props for DataTableLoadingSkeleton
 */
export interface DataTableLoadingSkeletonProps<TData> {
  /**
   * Column definitions from TanStack Table
   */
  columns: ColumnDef<TData>[];

  /**
   * Number of skeleton rows to render
   * @default 25
   */
  rowCount?: number;
}

/**
 * Loading skeleton component for data tables
 *
 * Generates a realistic loading skeleton based on column definitions.
 * Uses theme variables for colors and supports density modes.
 *
 * @example
 * ```typescript
 * <DataTableLoadingSkeleton
 *   columns={columns}
 *   rowCount={25}
 * />
 * ```
 */
export function DataTableLoadingSkeleton<TData>({
  columns,
  rowCount = 25,
}: DataTableLoadingSkeletonProps<TData>) {
  return (
    <div className="flex-1 overflow-auto custom-scrollbar bg-card">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/30 sticky top-0 z-10 border-b border-border">
            {columns.map((column, idx) => (
              <th
                key={idx}
                className="text-left py-2 px-3 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap text-muted-foreground"
              >
                {typeof column.header === "string" ? column.header : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, idx) => (
            <tr
              key={idx}
              className="border-b border-border"
              style={{
                background: idx % 2 === 1 ? "var(--muted)" : "transparent",
              }}
            >
              {columns.map((column, colIdx) => (
                <td key={colIdx} className="py-1.5 px-3">
                  <div className="h-3 bg-muted rounded animate-pulse w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
