/**
 * DataTable Component
 * Generic table renderer that consumes DataTableContext
 *
 * ARCHITECTURE: Minimal component with small interface
 * - Renders table structure (table, thead, tbody)
 * - Delegates row rendering to parent via renderRow prop
 * - Consumes DataTableContext for table state
 *
 * USAGE:
 * ```typescript
 * <DataTableProvider columns={columns} data={data}>
 *   <DataTable renderRow={(row) => <CustomRow row={row} />} />
 * </DataTableProvider>
 * ```
 */

import { flexRender } from "@tanstack/react-table";
import { useDataTableContext } from "../context/DataTableContext";
import type { Row } from "@tanstack/react-table";

/**
 * Props for DataTable component
 */
export interface DataTableProps<TData> {
  /**
   * Optional custom row renderer
   * If not provided, uses default row rendering
   */
  renderRow?: (row: Row<TData>, index: number) => React.ReactNode;

  /**
   * Optional className for the table element
   */
  className?: string;

  /**
   * Optional style object for the table element
   */
  style?: React.CSSProperties;

  /**
   * Optional className for the container div
   */
  containerClassName?: string;
}

/**
 * Generic table component that renders table structure
 *
 * Features:
 * - Renders headers from column definitions
 * - Renders rows using custom renderer or default
 * - Consumes DataTableContext for state
 * - Minimal interface for maximum flexibility
 *
 * @example
 * ```typescript
 * <DataTableProvider columns={columns} data={data}>
 *   <DataTable />
 * </DataTableProvider>
 * ```
 */
export function DataTable<TData>({
  renderRow,
  className = "w-full border-collapse",
  style,
  containerClassName,
}: DataTableProps<TData> = {}) {
  const { table } = useDataTableContext<TData>();

  return (
    <div className={containerClassName}>
      <table className={className} style={style}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // Get width from column size (150 is TanStack Table's default)
                const width =
                  header.column.getSize() !== 150
                    ? header.column.getSize()
                    : undefined;

                return (
                  <th
                    key={header.id}
                    className="text-left py-2 px-3 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap bg-muted/30 sticky top-0 z-10 border-b"
                    style={{
                      width,
                      borderBottomColor: "#e0e0e0",
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, idx) => {
            if (renderRow) {
              return renderRow(row, idx);
            }

            // Default row rendering
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
