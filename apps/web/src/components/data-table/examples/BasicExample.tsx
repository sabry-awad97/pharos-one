/**
 * Basic DataTable Example
 * Demonstrates simple usage with DataTableProvider
 *
 * This example shows:
 * - Type-safe column definitions
 * - Context-based composition
 * - Separation of concerns (toolbar, table, pagination)
 */

import * as React from "react";
import { DataTableProvider, useDataTableContext } from "../index";
import type { ColumnDef } from "@tanstack/react-table";

// Example data type
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

// Example data
const sampleProducts: Product[] = [
  { id: 1, name: "Aspirin", price: 5.99, stock: 100 },
  { id: 2, name: "Ibuprofen", price: 7.99, stock: 50 },
  { id: 3, name: "Acetaminophen", price: 6.49, stock: 75 },
];

// Column definitions
const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
];

/**
 * Toolbar component - demonstrates accessing context
 */
function ProductTableToolbar() {
  const { table, selectedRowIds } = useDataTableContext<Product>();

  return (
    <div style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          style={{
            padding: "0.5rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.375rem",
          }}
        />
        <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          {selectedRowIds.size} selected
        </span>
      </div>
    </div>
  );
}

/**
 * Table component - demonstrates rendering table
 */
function ProductTable() {
  const { table, handleRowClick, selectedRowIds, focusedRowId } =
    useDataTableContext<Product>();

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    borderBottom: "2px solid #e5e7eb",
                    fontWeight: 600,
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : typeof header.column.columnDef.header === "function"
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const rowId = row.original.id;
            const isSelected = selectedRowIds.has(rowId);
            const isFocused = focusedRowId === rowId;

            return (
              <tr
                key={row.id}
                onClick={(e) => handleRowClick(rowId, e)}
                style={{
                  backgroundColor: isSelected
                    ? "#dbeafe"
                    : isFocused
                      ? "#f3f4f6"
                      : "transparent",
                  cursor: "pointer",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ padding: "0.75rem" }}>
                    {typeof cell.column.columnDef.cell === "function"
                      ? cell.column.columnDef.cell(cell.getContext())
                      : (cell.getValue() as React.ReactNode)}
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

/**
 * Pagination component - demonstrates pagination controls
 */
function ProductTablePagination() {
  const { table } = useDataTableContext<Product>();

  return (
    <div
      style={{
        padding: "1rem",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </span>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.375rem",
            cursor: table.getCanPreviousPage() ? "pointer" : "not-allowed",
            opacity: table.getCanPreviousPage() ? 1 : 0.5,
          }}
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.375rem",
            cursor: table.getCanNextPage() ? "pointer" : "not-allowed",
            opacity: table.getCanNextPage() ? 1 : 0.5,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/**
 * Main example component
 */
export function BasicDataTableExample() {
  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h2 style={{ marginBottom: "1rem" }}>Product Inventory</h2>
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        <DataTableProvider columns={columns} data={sampleProducts}>
          <ProductTableToolbar />
          <ProductTable />
          <ProductTablePagination />
        </DataTableProvider>
      </div>
    </div>
  );
}
