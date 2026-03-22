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
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
} from "@pharos-one/ui/components/context-menu";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
  CommandSeparator,
  CommandShortcut,
} from "@pharos-one/ui/components/command";
import { AnnotationCallouts } from "../components/AnnotationCallouts";
import { useProducts } from "./hooks/use-products";
import type { ProductStockSummary } from "./schema";

// Color constants matching ModuleWorkspace.tsx
const W = {
  bg: "#f3f3f3",
  surface: "#ffffff",
  surfaceAlt: "#f9f9f9",
  surfaceHov: "#f0f0f0",
  border: "#e0e0e0",
  borderLight: "#ebebeb",
  text: "#1a1a1a",
  textSub: "#616161",
  textMuted: "#919191",
  success: "#107c10",
  warn: "#7a5e00",
  danger: "#a4262c",
  expiring: "#c43501",
};

// Status dot colors
const statusDot: Record<string, string> = {
  ok: "#107c10",
  low: "#d4a017",
  expiring: "#d83b01",
  out: "#a4262c",
};

// Status badge component
function StatusBadge({
  status,
}: {
  status: ProductStockSummary["stockStatus"];
}) {
  const config = {
    ok: {
      bg: "#dff6dd",
      color: statusDot.ok,
      border: statusDot.ok,
      label: "In Stock",
    },
    low: {
      bg: "#fff4ce",
      color: statusDot.low,
      border: statusDot.low,
      label: "Low Stock",
    },
    expiring: {
      bg: "#fed9cc",
      color: statusDot.expiring,
      border: statusDot.expiring,
      label: "Expiring",
    },
    out: {
      bg: "#fde7e9",
      color: statusDot.out,
      border: statusDot.out,
      label: "Out of Stock",
    },
  };

  const { bg, color, border, label } = config[status];

  return (
    <span
      className="text-[10px] px-1.5 py-0.5 rounded-[3px] font-medium border"
      style={{
        background: bg,
        color: color,
        borderColor: `${border}20`,
      }}
    >
      {label}
    </span>
  );
}

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
              className="w-[7px] h-[7px] rounded-full shrink-0"
              style={{
                background: statusDot[row.original.stockStatus],
              }}
            />
            <span
              className="text-xs font-medium"
              style={{
                color: W.text,
              }}
            >
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
          <span
            className="text-[11px] font-mono"
            style={{
              color: W.textSub,
            }}
          >
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
              className="text-xs font-semibold"
              style={{
                color: qty === 0 ? W.danger : qty < reorder ? W.warn : W.text,
              }}
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
            className="text-[11px]"
            style={{
              color:
                row.original.stockStatus === "expiring"
                  ? W.expiring
                  : W.textSub,
              whiteSpace: "nowrap",
            }}
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
          <span
            className="text-xs font-medium"
            style={{
              color: W.text,
            }}
          >
            ₹{(getValue() as number).toFixed(2)}
          </span>
        ),
        size: 80,
      },
      {
        accessorKey: "category.name",
        header: "Category",
        cell: ({ row }) => (
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-[3px] bg-[#f0f0f0] border"
            style={{
              color: W.textSub,
              borderColor: W.border,
            }}
          >
            {row.original.category.name}
          </span>
        ),
        size: 110,
      },
      {
        accessorKey: "defaultSupplier.name",
        header: "Supplier",
        cell: ({ row }) => (
          <span
            className="text-[11px]"
            style={{
              color: W.textSub,
            }}
          >
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
      className="flex-1 flex flex-col overflow-hidden font-sans"
      style={{
        background: W.bg,
      }}
    >
      {/* Module header */}
      <div
        className="pt-2.5 px-4 pb-2 flex items-center gap-2.5 shrink-0"
        style={{
          borderBottom: `1px solid ${W.border}`,
          background: W.surface,
        }}
      >
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{
            background: "#107c1020",
          }}
        >
          <Hash style={{ width: 14, height: 14, color: "#107c10" }} />
        </div>
        <div>
          <p
            style={{ margin: 0, fontSize: 13, fontWeight: 600, color: W.text }}
          >
            {label || "Inventory"}
          </p>
          <p style={{ margin: 0, fontSize: 10, color: W.textMuted }}>
            {isLoading
              ? "Loading..."
              : `${products.length} items • Last updated: just now`}
          </p>
        </div>
        <div style={{ flex: 1 }} />
        {!split && (
          <div style={{ display: "flex", gap: 4 }}>
            {[Filter, Download, RefreshCw].map((Icon, i) => (
              <button
                key={i}
                className="w-[26px] h-[26px] flex items-center justify-center border rounded cursor-pointer"
                style={{
                  borderColor: W.border,
                  background: W.surface,
                  color: W.textSub,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    W.surfaceHov;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    W.surface;
                }}
              >
                <Icon style={{ width: 12, height: 12 }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table content */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {error && (
          <div
            className="p-4 rounded-md border"
            style={{
              background: "#fde7e9",
              borderColor: W.danger,
              color: W.danger,
            }}
          >
            Error loading inventory: {error.message}
          </div>
        )}

        {isLoading && (
          <div
            className="p-4 text-center"
            style={{
              color: W.textMuted,
            }}
          >
            Loading inventory...
          </div>
        )}

        {!isLoading && !error && (
          <div
            className="rounded-md overflow-hidden shadow-sm border"
            style={{
              background: W.surface,
              borderColor: W.border,
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="bg-[#f5f5f5] sticky top-0 z-10"
                    style={{
                      borderBottom: `1px solid ${W.border}`,
                    }}
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left py-[7px] px-3 text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap cursor-pointer select-none"
                        style={{
                          color: W.textMuted,
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
                    <ContextMenu key={row.id}>
                      <ContextMenuTrigger asChild>
                        <tr
                          className="transition-[background] duration-100"
                          style={{
                            borderBottom: `1px solid ${W.borderLight}`,
                            background: selected
                              ? "rgba(0,120,212,0.07)"
                              : idx % 2 === 1
                                ? W.surfaceAlt
                                : W.surface,
                            boxShadow: selected
                              ? "inset 0 0 0 1.5px #0078d4"
                              : "none",
                          }}
                          onMouseEnter={(e) => {
                            if (!selected)
                              (
                                e.currentTarget as HTMLTableRowElement
                              ).style.background = "#f0f6ff";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLTableRowElement
                            ).style.background = selected
                              ? "rgba(0,120,212,0.07)"
                              : idx % 2 === 1
                                ? W.surfaceAlt
                                : W.surface;
                          }}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              style={{
                                padding: "6px 12px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </td>
                          ))}
                        </tr>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search actions..." />
                          <CommandList>
                            <CommandEmpty>No actions found.</CommandEmpty>
                            <CommandGroup heading="Edit">
                              <CommandItem
                                onSelect={() => {
                                  console.log("Edit Product:", row.original);
                                }}
                              >
                                Edit Product
                                <CommandShortcut>⌘E</CommandShortcut>
                              </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="View">
                              <CommandItem
                                onSelect={() => {
                                  console.log("View Batches:", row.original);
                                }}
                              >
                                View Batches
                                <CommandShortcut>⌘B</CommandShortcut>
                              </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Actions">
                              <CommandItem
                                onSelect={() => {
                                  console.log("Adjust Stock:", row.original);
                                }}
                              >
                                Adjust Stock
                                <CommandShortcut>⌘S</CommandShortcut>
                              </CommandItem>
                              {row.original.stockStatus === "expiring" && (
                                <CommandItem
                                  onSelect={() => {
                                    console.log(
                                      "Mark as Expiring:",
                                      row.original,
                                    );
                                  }}
                                >
                                  Mark as Expiring
                                </CommandItem>
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </ContextMenuContent>
                    </ContextMenu>
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
  );
}
