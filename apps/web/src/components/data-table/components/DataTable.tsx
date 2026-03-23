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
   * Optional custom header cell renderer
   * If not provided, uses default header rendering
   */
  renderHeaderCell?: (header: any) => React.ReactNode;

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
  renderHeaderCell,
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
                if (renderHeaderCell) {
                  return renderHeaderCell(header);
                }

                // Default header rendering
                return (
                  <th key={header.id}>
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
