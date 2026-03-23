/**
 * Inventory workspace component
 * Displays product catalog table with stock levels using TanStack Table
 * Enhanced table layout with sorting, filtering, and selection
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Hash,
  Download,
  ChevronRight,
  Edit2,
  Trash2,
  Filter,
} from "lucide-react";
import { CopyWrapper } from "@/components/copy-wrapper";
import { flexRender, type ColumnDef } from "@tanstack/react-table";
import { TableRowContextMenu } from "./components/TableRowContextMenu";
import { BatchDetailsPanel } from "./components/ProductDetailsPanel";
import { StockMovementsPanel } from "./components/StockMovementsPanel";
import {
  useInventoryActions,
  actionGroups,
} from "./hooks/use-inventory-actions";
import { useProducts } from "./hooks/use-products";
import { formatCurrency } from "@/constants/currency";
import {
  DataTableProvider,
  useDataTableContext,
  DataTablePagination,
  DataTable,
  DataTableColumnHeader,
  DataTableFilters,
  DataTableEmptyState,
  DataTableLoadingSkeleton,
  type ColumnFilter,
} from "@/components/data-table";
import type { ProductStockSummary } from "./schema";
import { useViewState } from "@/features/shell";

const STORAGE_KEY = "inventory-page-size";

// Filter options
const stockStatusOptions = [
  { label: "In Stock", value: "ok" },
  { label: "Low Stock", value: "low" },
  { label: "Expiring", value: "expiring" },
  { label: "Out of Stock", value: "out" },
];

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
export function InventoryWorkspace() {
  const { data: products = [], isLoading, error } = useProducts();
  const { density } = useViewState();

  const [batchDetailsPanelProductId, setBatchDetailsPanelProductId] = useState<
    number | null
  >(null);
  const [stockMovementsPanelProductId, setStockMovementsPanelProductId] =
    useState<number | null>(null);

  // Callbacks for opening panels
  const handleBatchDetailsOpen = useCallback((productId: number) => {
    console.log("Opening batch details for product:", productId);
    setBatchDetailsPanelProductId(productId);
  }, []);

  const handleStockMovementsOpen = useCallback((productId: number) => {
    console.log("Opening stock movements for product:", productId);
    setStockMovementsPanelProductId(productId);
  }, []);

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

  // Define columns
  const columns = useMemo<ColumnDef<ProductStockSummary>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Product Name" />
        ),
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
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="SKU" />
        ),
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
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Stock" />
        ),
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
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Expiry" />
        ),
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
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ getValue }) => (
          <span className="text-xs font-medium text-foreground">
            {formatCurrency(getValue() as number)}
          </span>
        ),
        size: 80,
      },
      {
        id: "category.name",
        accessorFn: (row) => row.category?.name ?? "Uncategorized",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Category" />
        ),
        cell: ({ row }) => (
          <span className="text-[10px] px-1.5 py-0.5 rounded-[3px] bg-muted text-muted-foreground border border-border">
            {row.original.category?.name ?? "Uncategorized"}
          </span>
        ),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        enableColumnFilter: true,
        size: 110,
      },
      {
        accessorKey: "defaultSupplier.name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Supplier" />
        ),
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
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => <StatusBadge status={row.original.stockStatus} />,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        enableColumnFilter: true,
        size: 100,
      },
      {
        id: "actions",
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

  // Check if any panel is open
  const isPanelOpen =
    batchDetailsPanelProductId !== null ||
    stockMovementsPanelProductId !== null;

  if (isLoading || error) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden font-sans bg-background">
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
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          {error && (
            <div className="p-4 m-3 rounded-md border border-red-700 bg-red-50 text-red-700">
              Error loading inventory: {error.message}
            </div>
          )}
          {isLoading && <DataTableLoadingSkeleton columns={columns} />}
        </div>
      </div>
    );
  }

  return (
    <DataTableProvider
      columns={columns}
      data={products}
      persistenceKey={STORAGE_KEY}
      getRowId={(product) => product.id}
      onRowDoubleClick={handleBatchDetailsOpen}
    >
      <InventoryWorkspaceContent
        isPanelOpen={isPanelOpen}
        batchDetailsPanelProductId={batchDetailsPanelProductId}
        setBatchDetailsPanelProductId={setBatchDetailsPanelProductId}
        stockMovementsPanelProductId={stockMovementsPanelProductId}
        setStockMovementsPanelProductId={setStockMovementsPanelProductId}
        customActions={customActions}
        products={products}
        density={density}
        isLoading={isLoading}
      />
    </DataTableProvider>
  );
}

/**
 * Inventory workspace content that uses DataTableContext
 */
function InventoryWorkspaceContent({
  isPanelOpen,
  batchDetailsPanelProductId,
  setBatchDetailsPanelProductId,
  stockMovementsPanelProductId,
  setStockMovementsPanelProductId,
  customActions,
  products,
  density,
  isLoading,
}: {
  isPanelOpen: boolean;
  batchDetailsPanelProductId: number | null;
  setBatchDetailsPanelProductId: (id: number | null) => void;
  stockMovementsPanelProductId: number | null;
  setStockMovementsPanelProductId: (id: number | null) => void;
  customActions: ReturnType<typeof useInventoryActions>;
  products: ProductStockSummary[];
  density: string;
  isLoading: boolean;
}) {
  const {
    selectedRowIds,
    focusedRowId,
    setFocusedRowId,
    handleRowClick,
    handleRowDoubleClick,
    table,
  } = useDataTableContext<ProductStockSummary>();

  // Sync focusedRowId when batch details panel opens
  useEffect(() => {
    if (batchDetailsPanelProductId !== null) {
      setFocusedRowId(batchDetailsPanelProductId);
    }
  }, [batchDetailsPanelProductId, setFocusedRowId]);

  const hasData = table.getFilteredRowModel().rows.length > 0;

  return (
    <div
      className={`flex ${isPanelOpen ? "flex-row" : "flex-col"} flex-1 overflow-hidden font-sans bg-background`}
    >
      {/* Table container - takes flex-1 when panel is open */}
      <div
        className={`flex flex-col ${isPanelOpen ? "flex-1 min-h-0" : "flex-1"} overflow-hidden`}
      >
        <InventoryToolbar products={products} />

        {/* Table content */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          data-density={density}
        >
          {/* Scrollable table area */}
          {hasData ? (
            <DataTable<ProductStockSummary>
              containerClassName="flex-1 overflow-auto custom-scrollbar bg-card"
              className="w-full border-collapse"
              style={{
                boxShadow: "0 1px 3px rgba(0,0,0,.06)",
              }}
              renderRow={(row, idx) => {
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
                        borderBottomColor: focused ? "transparent" : "#ebebeb",
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
                          className="whitespace-nowrap"
                          style={{
                            padding: "var(--density-padding)",
                          }}
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
              }}
            />
          ) : (
            <DataTableEmptyState
              hasFilters={table.getState().columnFilters.length > 0}
              onClearFilters={() => table.resetColumnFilters()}
            />
          )}

          {/* Pagination controls */}
          <DataTablePagination isLoading={isLoading} />
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

/**
 * Inventory toolbar component
 */
function InventoryToolbar({ products }: { products: ProductStockSummary[] }) {
  const { table } = useDataTableContext<ProductStockSummary>();

  // Get unique categories from products
  const categoryOptions = useMemo(() => {
    const uniqueCategories = new Set(
      products
        .map((p) => p.category?.name)
        .filter((name): name is string => Boolean(name)),
    );
    return Array.from(uniqueCategories)
      .sort()
      .map((cat) => ({ label: cat, value: cat }));
  }, [products]);

  // Get the columns for filtering
  const statusColumn = table.getColumn("stockStatus");
  const categoryColumn = table.getColumn("category.name");

  // Prepare filters array
  const filters: ColumnFilter<ProductStockSummary, any>[] = useMemo(() => {
    const result: ColumnFilter<ProductStockSummary, any>[] = [];

    if (statusColumn) {
      result.push({
        column: statusColumn,
        options: stockStatusOptions,
        title: "Status",
      });
    }

    if (categoryColumn) {
      result.push({
        column: categoryColumn,
        options: categoryOptions,
        title: "Category",
      });
    }

    return result;
  }, [statusColumn, categoryColumn, categoryOptions]);

  return (
    <div className="h-9 px-3 flex items-center gap-2 shrink-0 border-b border-border bg-card">
      <span className="text-[11px] text-muted-foreground">Pharos One</span>
      <ChevronRight className="w-3 h-3 text-border" />
      <span className="text-[11px] text-primary font-semibold">Inventory</span>
      <span className="w-px h-4 bg-border mx-1" />
      <span className="text-[11px] text-muted-foreground">
        {products.length} items
      </span>
      <div className="flex-1" />

      {/* Unified Filters */}
      <button
        title="Filter"
        className="flex items-center gap-1 h-[26px] px-2 rounded border border-transparent text-muted-foreground hover:bg-muted hover:border-border transition-colors text-[11px]"
      >
        <Filter className="w-3.5 h-3.5" />
      </button>

      <span className="w-px h-4 bg-border mx-0.5" />
      <button
        title="Export"
        className="flex items-center gap-1 h-[26px] px-2 rounded border border-transparent text-muted-foreground hover:bg-muted hover:border-border transition-colors text-[11px]"
      >
        <Download className="w-3.5 h-3.5" />
      </button>
      <span className="w-px h-4 bg-border mx-0.5" />
      <button className="flex items-center gap-1.5 h-[26px] px-2.5 bg-primary text-primary-foreground rounded border-none text-xs cursor-pointer font-medium hover:opacity-90 transition-opacity">
        <Hash className="w-3 h-3" />
        Add Product
      </button>
    </div>
  );
}
