/**
 * Inventory workspace component
 * Displays product catalog table with stock levels using TanStack Table
 * Enhanced table layout with sorting, filtering, and selection
 */

import { useState, useMemo } from "react";
import { Hash, Filter, Download, RefreshCw } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from "@tanstack/react-table";
import { Checkbox } from "@pharos-one/ui/components/checkbox";
import { AnnotationCallouts } from "../components/AnnotationCallouts";
import { TableRowContextMenu } from "./components/TableRowContextMenu";
import { BatchDetailsPanel } from "./components/BatchDetailsPanel";
import { inventoryActions, actionGroups } from "./config/inventory-actions";
import { useProducts } from "./hooks/use-products";
import type { ProductStockSummary } from "./schema";

// Status badge component
function StatusBadge({
  status,
}: {
  status: ProductStockSummary["stockStatus"];
}) {
  const config = {
    ok: {
      className: "bg-green-50 text-green-700 border-green-200",
      dotClassName: "bg-green-700",
      label: "In Stock",
    },
    low: {
      className: "bg-yellow-50 text-yellow-800 border-yellow-200",
      dotClassName: "bg-yellow-600",
      label: "Low Stock",
    },
    expiring: {
      className: "bg-orange-50 text-orange-700 border-orange-200",
      dotClassName: "bg-orange-600",
      label: "Expiring",
    },
    out: {
      className: "bg-red-50 text-red-700 border-red-200",
      dotClassName: "bg-red-700",
      label: "Out of Stock",
    },
  };

  const { className, label } = config[status];

  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded-[3px] font-medium border ${className}`}
    >
      {label}
    </span>
  );
}

// Status dot color mapping
const statusDotClass: Record<string, string> = {
  ok: "bg-green-700",
  low: "bg-yellow-600",
  expiring: "bg-orange-600",
  out: "bg-red-700",
};

/**
 * Inventory workspace showing product catalog with TanStack Table
 */
export function InventoryWorkspace({
  split = false,
  label,
}: {
  split?: boolean;
  label?: string;
}) {
  const { data: products = [], isLoading, error } = useProducts();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [batchDetailsPanelProductId, setBatchDetailsPanelProductId] = useState<
    number | null
  >(null);

  // Create custom actions with batch details handler
  const customActions = useMemo(
    () =>
      inventoryActions.map((action) => {
        if (action.id === "batch-details") {
          return {
            ...action,
            handler: (row: ProductStockSummary) => {
              setBatchDetailsPanelProductId(row.id);
            },
          };
        }
        return action;
      }),
    [],
  );

  // Define columns
  const columns = useMemo<ColumnDef<ProductStockSummary>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onCheckedChange={(checked) => {
              table.toggleAllRowsSelected(!!checked);
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => {
              row.toggleSelected(!!checked);
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Select row"
          />
        ),
        size: 40,
      },
      {
        accessorKey: "name",
        header: "Product Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span
              className={`w-[7px] h-[7px] rounded-full shrink-0 ${statusDotClass[row.original.stockStatus]}`}
            />
            <span className="text-xs font-medium text-foreground">
              {row.original.name}
            </span>
          </div>
        ),
        size: undefined, // auto width
      },
      {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ getValue }) => (
          <span className="text-[11px] font-mono text-muted-foreground">
            {getValue() as string}
          </span>
        ),
        size: 90,
      },
      {
        accessorKey: "availableQuantity",
        header: "Stock",
        cell: ({ row }) => {
          const qty = row.original.availableQuantity;
          const reorder = row.original.reorderLevel;
          return (
            <span
              className={`text-xs font-semibold ${
                qty === 0
                  ? "text-red-700"
                  : qty < reorder
                    ? "text-yellow-700"
                    : "text-foreground"
              }`}
            >
              {qty}
            </span>
          );
        },
        size: 70,
      },
      {
        accessorKey: "nearestExpiry",
        header: "Expiry",
        cell: ({ row }) => (
          <span
            className={`text-[11px] whitespace-nowrap ${
              row.original.stockStatus === "expiring"
                ? "text-orange-700"
                : "text-muted-foreground"
            }`}
          >
            {row.original.nearestExpiry || "N/A"}
          </span>
        ),
        size: 80,
      },
      {
        accessorKey: "basePrice",
        header: "Price",
        cell: ({ getValue }) => (
          <span className="text-xs font-medium text-foreground">
            ₹{(getValue() as number).toFixed(2)}
          </span>
        ),
        size: 80,
      },
      {
        accessorKey: "category.name",
        header: "Category",
        cell: ({ row }) => (
          <span className="text-[10px] px-1.5 py-0.5 rounded-[3px] bg-muted text-muted-foreground border border-border">
            {row.original.category.name}
          </span>
        ),
        size: 110,
      },
      {
        accessorKey: "defaultSupplier.name",
        header: "Supplier",
        cell: ({ row }) => (
          <span className="text-[11px] text-muted-foreground">
            {row.original.defaultSupplier?.name || "N/A"}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "stockStatus",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.stockStatus} />,
        size: 100,
      },
    ],
    [],
  );

  // Create table instance
  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
  });

  return (
    <div
      className={`flex ${batchDetailsPanelProductId !== null ? "flex-row" : "flex-col"} flex-1 overflow-hidden font-sans bg-background`}
    >
      {/* Table container - takes flex-1 when panel is open */}
      <div
        className={`flex flex-col ${batchDetailsPanelProductId !== null ? "flex-1 min-h-0" : "flex-1"} overflow-hidden`}
      >
        {/* Module header */}
        <div className="pt-2.5 px-4 pb-2 flex items-center gap-2.5 shrink-0 border-b border-border bg-card">
          <div className="w-7 h-7 rounded-md flex items-center justify-center bg-green-700/10">
            <Hash className="w-[14px] h-[14px] text-green-700" />
          </div>
          <div>
            <p className="m-0 text-[13px] font-semibold text-foreground">
              {label || "Inventory"}
            </p>
            <p className="m-0 text-[10px] text-muted-foreground">
              {isLoading
                ? "Loading..."
                : `${products.length} items • Last updated: just now`}
            </p>
          </div>
          <div className="flex-1" />
          {!split && (
            <div className="flex gap-1">
              {[Filter, Download, RefreshCw].map((Icon, i) => (
                <button
                  key={i}
                  className="w-[26px] h-[26px] flex items-center justify-center border border-border rounded bg-card text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <Icon className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Table content */}
        <div className="flex-1 overflow-y-auto p-3">
          {error && (
            <div className="p-4 rounded-md border border-red-700 bg-red-50 text-red-700">
              Error loading inventory: {error.message}
            </div>
          )}

          {isLoading && (
            <div className="p-4 text-center text-muted-foreground">
              Loading inventory...
            </div>
          )}

          {!isLoading && !error && (
            <div className="rounded-md overflow-hidden shadow-sm border border-border bg-card">
              <table className="w-full border-collapse">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      className="bg-muted/50 sticky top-0 z-10 border-b border-border"
                    >
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="text-left py-[7px] px-3 text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap cursor-pointer select-none text-muted-foreground"
                          style={{
                            width:
                              header.column.getSize() !== 150
                                ? header.column.getSize()
                                : undefined,
                          }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                          {{
                            asc: " ↑",
                            desc: " ↓",
                          }[header.column.getIsSorted() as string] ?? null}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row, idx) => {
                    const selected = row.getIsSelected();
                    return (
                      <TableRowContextMenu
                        key={row.id}
                        row={row.original}
                        actions={customActions}
                        actionGroups={actionGroups}
                      >
                        <tr
                          className="transition-colors duration-100 border-b border-border/50 hover:bg-blue-50/50"
                          style={{
                            background: selected
                              ? "hsl(var(--primary) / 0.1)"
                              : idx % 2 === 1
                                ? "hsl(var(--muted) / 0.3)"
                                : "hsl(var(--card))",
                            boxShadow: selected
                              ? "inset 0 0 0 1.5px hsl(var(--primary))"
                              : "none",
                          }}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="py-1.5 px-3 whitespace-nowrap"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </td>
                          ))}
                        </tr>
                      </TableRowContextMenu>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Annotation callouts - only shown when not in split view */}
          {!split && <AnnotationCallouts />}
        </div>
      </div>

      {/* Batch Details Panel - inline side-by-side */}
      {batchDetailsPanelProductId !== null && (
        <aside role="complementary" className="w-[360px] flex-none">
          <BatchDetailsPanel
            productId={batchDetailsPanelProductId}
            onClose={() => setBatchDetailsPanelProductId(null)}
          />
        </aside>
      )}
    </div>
  );
}
