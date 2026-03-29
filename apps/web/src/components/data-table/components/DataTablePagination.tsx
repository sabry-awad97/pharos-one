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
import { usePaginationKeyboard } from "../hooks/usePaginationKeyboard";
import { useState, useEffect } from "react";

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
 * Loading skeleton for pagination
 */
function PaginationSkeleton() {
  return (
    <div
      className="flex-none flex flex-col sm:flex-row items-center justify-between gap-3 px-3 py-3 border-t border-border bg-card transition-opacity duration-150"
      data-testid="pagination-skeleton"
    >
      {/* Left side skeleton */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        <div className="h-8 w-[130px] bg-muted animate-pulse rounded" />
      </div>

      {/* Center skeleton */}
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-8 w-8 bg-muted animate-pulse rounded"
            data-testid="pagination-skeleton"
          />
        ))}
      </div>

      {/* Right side skeleton */}
      <div className="h-4 w-32 bg-muted animate-pulse rounded hidden md:block" />
    </div>
  );
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

  /**
   * Loading state - shows skeleton when true
   * @default false
   */
  isLoading?: boolean;
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
 * - Loading skeleton
 * - Empty state handling
 * - Single page hiding
 * - Responsive design
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
  isLoading = false,
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

  // Keyboard navigation
  const { handleKeyDown } = usePaginationKeyboard({ table });

  // Screen reader announcement state
  const [announcement, setAnnouncement] = useState<string>("");

  // Update announcement when page changes
  useEffect(() => {
    const currentPage = pageIndex + 1;
    setAnnouncement(`Navigated to page ${currentPage} of ${pageCount}`);
  }, [pageIndex, pageCount]);

  // Show loading skeleton
  if (isLoading) {
    return <PaginationSkeleton />;
  }

  // Hide pagination if only 1 page or no data
  if (pageCount <= 1) {
    return null;
  }

  return (
    <div className="flex-none flex flex-col sm:flex-row items-center justify-between gap-3 py-3 border-t border-border bg-card transition-opacity duration-150">
      {/* Left side: Page size selector and go to page */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {showPageSize && (
          <>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Items per page:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(parseInt(value, 10))}
            >
              <SelectTrigger className="h-8 w-full sm:w-[130px]">
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
          <div className="flex items-center gap-2 ml-0 sm:ml-4">
            <label
              htmlFor="go-to-page"
              className="text-xs text-muted-foreground hidden sm:inline"
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
      <nav
        aria-label="pagination"
        className="flex justify-center w-full sm:w-auto"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 sm:px-3 h-8 text-xs border border-border rounded bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Go to previous page"
          >
            Previous
          </button>

          {/* Page number buttons - show fewer on mobile */}
          {Array.from({ length: pageCount }, (_, i) => i).map((pageIdx) => {
            const isActive = pageIdx === pageIndex;
            return (
              <button
                key={pageIdx}
                onClick={() => table.setPageIndex(pageIdx)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Go to page ${pageIdx + 1}`}
                className={`w-8 h-8 text-xs border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
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
            className="px-2 sm:px-3 h-8 text-xs border border-border rounded bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Go to next page"
          >
            Next
          </button>
        </div>
      </nav>

      {/* Right side: Items display and screen reader announcements */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
        {showItemsCount && (
          <div
            className="text-xs text-muted-foreground hidden md:block"
            aria-live="polite"
          >
            {getItemsDisplayText(pageIndex, pageSize, totalItems)}
          </div>
        )}

        {/* Screen reader announcement region */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>
      </div>
    </div>
  );
}
