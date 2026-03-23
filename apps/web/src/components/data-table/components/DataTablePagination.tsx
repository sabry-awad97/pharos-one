/**
 * DataTablePagination Component
 * Reusable pagination controls for data tables
 *
 * ARCHITECTURE: Composable component using context
 * - Consumes DataTableContext for table state
 * - Handles page size selection
 * - Provides page navigation controls
 * - Shows items count display
 * - Supports "go to page" input
 *
 * USAGE:
 * ```typescript
 * <DataTableProvider columns={columns} data={data}>
 *   <DataTable />
 *   <DataTablePagination />
 * </DataTableProvider>
 * ```
 */

import { useDataTableContext } from "../context/DataTableContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@pharos-one/ui/components/select";

/**
 * Page size options
 */
const PAGE_SIZE_OPTIONS = [
  { value: "25", label: "25 / page" },
  { value: "50", label: "50 / page" },
  { value: "100", label: "100 / page" },
] as const;

/**
 * Calculate items display text
 */
function getItemsDisplayText(
  pageIndex: number,
  pageSize: number,
  totalItems: number,
): string {
  if (totalItems === 0) {
    return "No items";
  }

  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalItems);

  return `Showing ${start}–${end} of ${totalItems} items`;
}

/**
 * Props for DataTablePagination
 */
export interface DataTablePaginationProps {
  /**
   * Optional custom page size options
   */
  pageSizeOptions?: readonly { value: string; label: string }[];

  /**
   * Show page size selector
   * @default true
   */
  showPageSize?: boolean;

  /**
   * Show "go to page" input
   * @default true
   */
  showGoToPage?: boolean;

  /**
   * Show items count display
   * @default true
   */
  showItemsCount?: boolean;
}

/**
 * Pagination controls for data tables
 *
 * Features:
 * - Page size selector
 * - Previous/Next navigation
 * - Page number buttons
 * - Go to page input
 * - Items count display
 * - Fully accessible with ARIA labels
 *
 * @example
 * ```typescript
 * <DataTableProvider columns={columns} data={data}>
 *   <DataTable />
 *   <DataTablePagination />
 * </DataTableProvider>
 * ```
 */
export function DataTablePagination({
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  showPageSize = true,
  showGoToPage = true,
  showItemsCount = true,
}: DataTablePaginationProps = {}) {
  const {
    table,
    pageSize,
    setPageSize,
    goToPageValue,
    setGoToPageValue,
    handleGoToPage,
  } = useDataTableContext();

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const totalItems = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex-none flex items-center justify-between px-3 py-3 border-t border-border bg-card">
      {/* Left side: Page size selector and go to page */}
      <div className="flex items-center gap-2">
        {showPageSize && (
          <>
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
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        {showGoToPage && (
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
              aria-label="Go to page number"
            />
          </div>
        )}
      </div>

      {/* Center: Pagination controls */}
      <nav aria-label="pagination" className="flex justify-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 h-8 text-xs border border-border rounded bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Go to previous page"
          >
            Previous
          </button>

          {/* Page number buttons */}
          {Array.from({ length: pageCount }, (_, i) => i).map((pageIdx) => {
            const isActive = pageIdx === pageIndex;
            return (
              <button
                key={pageIdx}
                onClick={() => table.setPageIndex(pageIdx)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Go to page ${pageIdx + 1}`}
                className={`w-8 h-8 text-xs border rounded transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                {pageIdx + 1}
              </button>
            );
          })}

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 h-8 text-xs border border-border rounded bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Go to next page"
          >
            Next
          </button>
        </div>
      </nav>

      {/* Right side: Items display */}
      {showItemsCount && (
        <div className="text-xs text-muted-foreground" aria-live="polite">
          {getItemsDisplayText(pageIndex, pageSize, totalItems)}
        </div>
      )}
    </div>
  );
}
