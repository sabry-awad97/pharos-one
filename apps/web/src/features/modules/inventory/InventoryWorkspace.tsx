/**
 * Inventory workspace component
 * Displays product catalog table with stock levels using TanStack Table
 * Enhanced table layout with sorting, filtering, and selection
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Hash,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  Edit2,
  Trash2,
} from "lucide-react";
import { CopyWrapper } from "@/components/CopyWrapper";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type PaginationState,
  type Table,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@pharos-one/ui/components/select";
import { TableRowContextMenu } from "./components/TableRowContextMenu";
import { BatchDetailsPanel } from "./components/ProductDetailsPanel";
import { StockMovementsPanel } from "./components/StockMovementsPanel";
import {
  useInventoryActions,
  actionGroups,
} from "./hooks/use-inventory-actions";
import { useProducts } from "./hooks/use-products";
import type { ProductStockSummary } from "./schema";

// Page size options
const PAGE_SIZE_OPTIONS = [
  { value: "25", label: "25 / page" },
  { value: "50", label: "50 / page" },
  { value: "100", label: "100 / page" },
] as const;

const DEFAULT_PAGE_SIZE = 25;
const STORAGE_KEY = "inventory-page-size";

// Hook for persisted page size
function usePersistedPageSize() {
  const [pageSize, setPageSize] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? parseInt(stored, 10) : DEFAULT_PAGE_SIZE;
    } catch {
      return DEFAULT_PAGE_SIZE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, pageSize.toString());
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, [pageSize]);

  return [pageSize, setPageSize] as const;
}

// Helper function to calculate items display text
function getItemsDisplayText(table: Table<ProductStockSummary>): string {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = table.getFilteredRowModel().rows.length;

  if (totalItems === 0) {
    return "No items";
  }

  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalItems);

  return `Showing ${start}–${end} of ${totalItems} items`;
}

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
  const [pageSize, setPageSize] = usePersistedPageSize();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [goToPageValue, setGoToPageValue] = useState<string>("");

  // Sync pageSize changes with pagination state
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageSize, pageIndex: 0 }));
  }, [pageSize]);

  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());
  const [lastSelectedRowId, setLastSelectedRowId] = useState<number | null>(
    null,
  );
  const [batchDetailsPanelProductId, setBatchDetailsPanelProductId] = useState<
    number | null
  >(null);
  const [stockMovementsPanelProductId, setStockMovementsPanelProductId] =
    useState<number | null>(null);
  const [focusedRowId, setFocusedRowId] = useState<number | null>(null);

  // Callbacks for opening panels
  const handleBatchDetailsOpen = useCallback((productId: number) => {
    console.log("Opening batch details for product:", productId);
    setBatchDetailsPanelProductId(productId);
    setFocusedRowId(productId);
  }, []);

  const handleStockMovementsOpen = useCallback((productId: number) => {
    console.log("Opening stock movements for product:", productId);
    setStockMovementsPanelProductId(productId);
  }, []);

  // Handle row click with modifier keys for Windows-style selection
  const handleRowClick = useCallback(
    (productId: number, event: React.MouseEvent) => {
      if (event.ctrlKey || event.metaKey) {
        // Ctrl+Click: Toggle selection (don't change focus)
        setSelectedRowIds((prev) => {
          const newSelection = new Set(prev);
          if (newSelection.has(productId)) {
            newSelection.delete(productId);
          } else {
            newSelection.add(productId);
          }
          return newSelection;
        });
        setLastSelectedRowId(productId);
      } else if (event.shiftKey) {
        // Shift+Click: Range selection AND move focus to clicked row
        if (lastSelectedRowId !== null) {
          // Find indices of lastSelectedRowId and productId in products array
          const startIdx = products.findIndex(
            (p) => p.id === lastSelectedRowId,
          );
          const endIdx = products.findIndex((p) => p.id === productId);
          if (startIdx !== -1 && endIdx !== -1) {
            const [minIdx, maxIdx] = [
              Math.min(startIdx, endIdx),
              Math.max(startIdx, endIdx),
            ];
            const rangeIds = products
              .slice(minIdx, maxIdx + 1)
              .map((p) => p.id);
            setSelectedRowIds(new Set(rangeIds));
          }
        } else {
          // No anchor, just select single row
          setSelectedRowIds(new Set([productId]));
          setLastSelectedRowId(productId);
        }
        // Move focus to the clicked row
        setFocusedRowId(productId);
      } else {
        // Normal click: Single selection AND set focus
        setSelectedRowIds(new Set([productId]));
        setLastSelectedRowId(productId);
        setFocusedRowId(productId);
      }
    },
    [lastSelectedRowId, products],
  );

  // Handle row double-click to open panel
  const handleRowDoubleClick = useCallback(
    (productId: number) => {
      handleBatchDetailsOpen(productId);
    },
    [handleBatchDetailsOpen],
  );

  // Get inventory actions with custom handlers
  const customActions = useInventoryActions({
    onBatchDetailsOpen: handleBatchDetailsOpen,
    onStockMovementsOpen: handleStockMovementsOpen,
  });

  // Debug: Log when state changes
  useEffect(() => {
    console.log(
      "stockMovementsPanelProductId changed to:",
      stockMovementsPanelProductId,
    );
  }, [stockMovementsPanelProductId]);

  useEffect(() => {
    console.log("focusedRowId changed to:", focusedRowId);
  }, [focusedRowId]);

  // Define columns
  const columns = useMemo<ColumnDef<ProductStockSummary>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span
              className={`w-[7px] h-[7px] rounded-full shrink-0 ${statusDotClass[row.original.stockStatus]}`}
            />
            <CopyWrapper value={row.original.name} size="xs">
              <span className="text-xs font-medium text-foreground">
                {row.original.name}
              </span>
            </CopyWrapper>
          </div>
        ),
        size: undefined, // auto width
      },
      {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ getValue }) => (
          <CopyWrapper value={getValue() as string} size="xs">
            <span className="text-[11px] font-mono text-muted-foreground">
              {getValue() as string}
            </span>
          </CopyWrapper>
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
        cell: ({ row }) => {
          const supplierName = row.original.defaultSupplier?.name || "N/A";
          return (
            <CopyWrapper
              value={supplierName}
              size="xs"
              className={supplierName === "N/A" ? "pointer-events-none" : ""}
            >
              <span className="text-[11px] text-muted-foreground">
                {supplierName}
              </span>
            </CopyWrapper>
          );
        },
        size: 120,
      },
      {
        accessorKey: "stockStatus",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.stockStatus} />,
        size: 100,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex gap-0.5">
            <button
              title="Edit"
              className="w-6 h-6 flex items-center justify-center rounded border border-transparent transition-colors text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/20"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Edit product:", row.original.id);
              }}
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              title="Delete"
              className="w-6 h-6 flex items-center justify-center rounded border border-transparent transition-colors text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Delete product:", row.original.id);
              }}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ),
        size: 56,
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
      pagination,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  });

  // Handle go to page navigation
  const handleGoToPage = useCallback(() => {
    const pageNumber = parseInt(goToPageValue, 10);

    // Validate page number
    if (isNaN(pageNumber) || pageNumber < 1) {
      // Invalid or less than 1: stay on current page
      setGoToPageValue("");
      return;
    }

    const totalPages = table.getPageCount();

    if (pageNumber > totalPages) {
      // Beyond total pages: go to last page
      table.setPageIndex(totalPages - 1);
    } else {
      // Valid page: navigate (pageIndex is 0-based)
      table.setPageIndex(pageNumber - 1);
    }

    // Clear input after navigation
    setGoToPageValue("");
  }, [goToPageValue, table]);

  // Check if any panel is open
  const isPanelOpen =
    batchDetailsPanelProductId !== null ||
    stockMovementsPanelProductId !== null;

  return (
    <div
      className={`flex ${isPanelOpen ? "flex-row" : "flex-col"} flex-1 overflow-hidden font-sans bg-background`}
    >
      {/* Table container - takes flex-1 when panel is open */}
      <div
        className={`flex flex-col ${isPanelOpen ? "flex-1 min-h-0" : "flex-1"} overflow-hidden`}
      >
        {/* Breadcrumb + Toolbar */}
        <div className="h-9 px-3 flex items-center gap-2 shrink-0 border-b border-border bg-card">
          <span className="text-[11px] text-muted-foreground">Pharos One</span>
          <ChevronRight className="w-3 h-3 text-border" />
          <span className="text-[11px] text-primary font-semibold">
            Inventory
          </span>
          <span className="w-px h-4 bg-border mx-1" />
          <span className="text-[11px] text-muted-foreground">
            {products.length} items
          </span>
          <div className="flex-1" />
          <button
            title="Filter"
            className="flex items-center gap-1 h-[26px] px-2 rounded border border-transparent text-muted-foreground hover:bg-muted hover:border-border transition-colors text-[11px]"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
          <button
            title="Sort"
            className="flex items-center gap-1 h-[26px] px-2 rounded border border-transparent text-muted-foreground hover:bg-muted hover:border-border transition-colors text-[11px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sort</span>
          </button>
          <button
            title="Export"
            className="flex items-center gap-1 h-[26px] px-2 rounded border border-transparent text-muted-foreground hover:bg-muted hover:border-border transition-colors text-[11px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
          <span className="w-px h-4 bg-border mx-0.5" />
          <button className="flex items-center gap-1.5 h-[26px] px-2.5 bg-primary text-primary-foreground rounded border-none text-xs cursor-pointer font-medium hover:opacity-90 transition-opacity">
            <Hash className="w-3 h-3" />
            Add Product
          </button>
        </div>

        {/* Table content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {error && (
            <div className="p-4 m-3 rounded-md border border-red-700 bg-red-50 text-red-700">
              Error loading inventory: {error.message}
            </div>
          )}

          {isLoading && (
            <div className="flex-1 overflow-auto custom-scrollbar bg-card">
              <table
                className="w-full border-collapse"
                style={{
                  boxShadow: "0 1px 3px rgba(0,0,0,.06)",
                }}
              >
                <thead>
                  <tr
                    className="bg-muted/30 sticky top-0 z-10 border-b"
                    style={{ borderBottomColor: "#e0e0e0" }}
                  >
                    {[
                      "Product Name",
                      "SKU",
                      "Stock",
                      "Expiry",
                      "Price",
                      "Category",
                      "Supplier",
                      "Status",
                      "",
                    ].map((header) => (
                      <th
                        key={header}
                        className="text-left py-2 px-3 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap text-muted-foreground"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 25 }).map((_, idx) => (
                    <tr
                      key={idx}
                      className="border-b"
                      style={{
                        borderBottomColor: "#ebebeb",
                        background: idx % 2 === 1 ? "#f9f9f9" : "#ffffff",
                      }}
                    >
                      {/* Product Name with dot */}
                      <td className="py-1.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-[7px] h-[7px] rounded-full bg-muted animate-pulse" />
                          <div
                            className="h-3 bg-muted rounded animate-pulse"
                            style={{ width: `${120 + Math.random() * 80}px` }}
                          />
                        </div>
                      </td>
                      {/* SKU */}
                      <td className="py-1.5 px-3">
                        <div
                          className="h-3 bg-muted rounded animate-pulse"
                          style={{ width: `${60 + Math.random() * 20}px` }}
                        />
                      </td>
                      {/* Stock */}
                      <td className="py-1.5 px-3">
                        <div className="h-3 bg-muted rounded animate-pulse w-8" />
                      </td>
                      {/* Expiry */}
                      <td className="py-1.5 px-3">
                        <div className="h-3 bg-muted rounded animate-pulse w-16" />
                      </td>
                      {/* Price */}
                      <td className="py-1.5 px-3">
                        <div className="h-3 bg-muted rounded animate-pulse w-12" />
                      </td>
                      {/* Category */}
                      <td className="py-1.5 px-3">
                        <div
                          className="h-4 bg-muted rounded animate-pulse"
                          style={{ width: `${60 + Math.random() * 30}px` }}
                        />
                      </td>
                      {/* Supplier */}
                      <td className="py-1.5 px-3">
                        <div
                          className="h-3 bg-muted rounded animate-pulse"
                          style={{ width: `${70 + Math.random() * 40}px` }}
                        />
                      </td>
                      {/* Status */}
                      <td className="py-1.5 px-3">
                        <div className="h-4 bg-muted rounded animate-pulse w-20" />
                      </td>
                      {/* Actions */}
                      <td className="py-1.5 px-2">
                        <div className="flex gap-0.5">
                          <div className="w-6 h-6 bg-muted rounded animate-pulse" />
                          <div className="w-6 h-6 bg-muted rounded animate-pulse" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {/* Scrollable table area */}
              <div className="flex-1 overflow-auto custom-scrollbar bg-card">
                <table
                  className="w-full border-collapse"
                  style={{
                    boxShadow: "0 1px 3px rgba(0,0,0,.06)",
                  }}
                >
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr
                        key={headerGroup.id}
                        className="bg-muted/30 sticky top-0 z-10 border-b"
                        style={{ borderBottomColor: "#e0e0e0" }}
                      >
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="text-left py-2 px-3 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer select-none text-muted-foreground hover:text-foreground transition-colors group"
                            style={{
                              width:
                                header.column.getSize() !== 150
                                  ? header.column.getSize()
                                  : undefined,
                            }}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <div className="flex items-center gap-1.5">
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                              {header.column.getIsSorted() && (
                                <span className="text-primary font-bold">
                                  {{
                                    asc: "↑",
                                    desc: "↓",
                                  }[header.column.getIsSorted() as string] ??
                                    null}
                                </span>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row, idx) => {
                      const selected = selectedRowIds.has(row.original.id);
                      const focused = focusedRowId === row.original.id;
                      return (
                        <TableRowContextMenu
                          key={row.id}
                          row={row.original}
                          actions={customActions}
                          actionGroups={actionGroups}
                        >
                          <tr
                            data-selected={selected ? "true" : undefined}
                            data-focused={focused ? "true" : undefined}
                            className="border-b transition-[background]"
                            style={{
                              borderBottomColor: focused
                                ? "transparent"
                                : "#ebebeb",
                              background: focused
                                ? "oklch(from var(--primary) l c h / 0.07)"
                                : selected
                                  ? "oklch(from var(--primary) l c h / 0.05)"
                                  : idx % 2 === 1
                                    ? "#f9f9f9"
                                    : "#ffffff",
                              boxShadow: focused
                                ? "inset 0 0 0 1.5px var(--primary)"
                                : "none",
                            }}
                            onClick={(e) => handleRowClick(row.original.id, e)}
                            onDoubleClick={() =>
                              handleRowDoubleClick(row.original.id)
                            }
                            onMouseEnter={(e) => {
                              if (!focused) {
                                (
                                  e.currentTarget as HTMLTableRowElement
                                ).style.background = "#f0f6ff";
                              }
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLTableRowElement
                              ).style.background = focused
                                ? "oklch(from var(--primary) l c h / 0.07)"
                                : selected
                                  ? "oklch(from var(--primary) l c h / 0.05)"
                                  : idx % 2 === 1
                                    ? "#f9f9f9"
                                    : "#ffffff";
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

              {/* Pagination controls - fixed at bottom */}
              <div className="flex-none flex items-center justify-between px-3 py-3 border-t border-border bg-card">
                {/* Left side: Page size selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Items per page:
                  </span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => setPageSize(parseInt(value, 10))}
                  >
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Go to page input */}
                  <div className="flex items-center gap-2 ml-4">
                    <label
                      htmlFor="go-to-page"
                      className="text-xs text-muted-foreground"
                    >
                      Go to page:
                    </label>
                    <input
                      id="go-to-page"
                      type="text"
                      value={goToPageValue}
                      onChange={(e) => setGoToPageValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleGoToPage();
                        }
                      }}
                      className="h-8 w-16 px-2 text-xs border border-border rounded bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* Center: Pagination controls */}
                <nav aria-label="pagination" className="flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="px-3 h-8 text-xs border border-border rounded bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {/* Page number buttons */}
                    {Array.from(
                      { length: table.getPageCount() },
                      (_, i) => i,
                    ).map((pageIndex) => {
                      const isActive =
                        pageIndex === table.getState().pagination.pageIndex;
                      return (
                        <button
                          key={pageIndex}
                          onClick={() => table.setPageIndex(pageIndex)}
                          aria-current={isActive ? "page" : undefined}
                          className={`w-8 h-8 text-xs border rounded ${
                            isActive
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-foreground hover:bg-muted"
                          }`}
                        >
                          {pageIndex + 1}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="px-3 h-8 text-xs border border-border rounded bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </nav>

                {/* Right side: Items display */}
                <div className="text-xs text-muted-foreground">
                  {getItemsDisplayText(table)}
                </div>
              </div>
            </>
          )}

          {/* Annotation callouts - only shown when not in split view */}
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

      {/* Stock Movements Panel - inline side-by-side */}
      {stockMovementsPanelProductId !== null && (
        <aside role="complementary" className="w-[360px] flex-none">
          <StockMovementsPanel
            productId={stockMovementsPanelProductId}
            productName={
              products.find((p) => p.id === stockMovementsPanelProductId)?.name
            }
            onClose={() => setStockMovementsPanelProductId(null)}
          />
        </aside>
      )}
    </div>
  );
}
