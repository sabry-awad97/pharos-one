import { useState, useEffect, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type PaginationState,
  getFacetedRowModel,
  getFacetedUniqueValues,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";

const DEFAULT_PAGE_SIZE = 25;

interface UseDataTableOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  persistenceKey?: string;
  getRowId?: (row: TData) => number;
  onRowDoubleClick?: (rowId: number) => void;
}

export function useDataTable<TData>({
  data,
  columns,
  persistenceKey,
  getRowId = (row: TData) => (row as { id: number }).id,
  onRowDoubleClick,
}: UseDataTableOptions<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [pageSize, setPageSize] = useState<number>(() => {
    if (!persistenceKey) return DEFAULT_PAGE_SIZE;
    try {
      const stored = localStorage.getItem(persistenceKey);
      return stored ? parseInt(stored, 10) : DEFAULT_PAGE_SIZE;
    } catch {
      return DEFAULT_PAGE_SIZE;
    }
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  // Row selection state for Windows-style multi-select
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());
  const [lastSelectedRowId, setLastSelectedRowId] = useState<number | null>(
    null,
  );
  const [focusedRowId, setFocusedRowId] = useState<number | null>(null);
  const [goToPageValue, setGoToPageValue] = useState<string>("");

  // Persist page size to localStorage
  useEffect(() => {
    if (!persistenceKey) return;
    try {
      localStorage.setItem(persistenceKey, pageSize.toString());
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, [pageSize, persistenceKey]);

  // Sync pageSize changes with pagination state
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageSize, pageIndex: 0 }));
  }, [pageSize]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

  // Handle row click with modifier keys for Windows-style selection
  const handleRowClick = useCallback(
    (rowId: number, event: React.MouseEvent) => {
      if (event.ctrlKey || event.metaKey) {
        // Ctrl+Click: Toggle selection (don't change focus)
        setSelectedRowIds((prev) => {
          const newSelection = new Set(prev);
          if (newSelection.has(rowId)) {
            newSelection.delete(rowId);
          } else {
            newSelection.add(rowId);
          }
          return newSelection;
        });
        setLastSelectedRowId(rowId);
      } else if (event.shiftKey) {
        // Shift+Click: Range selection AND move focus to clicked row
        if (lastSelectedRowId !== null) {
          // Find indices of lastSelectedRowId and rowId in data array
          const startIdx = data.findIndex(
            (row) => getRowId(row) === lastSelectedRowId,
          );
          const endIdx = data.findIndex((row) => getRowId(row) === rowId);
          if (startIdx !== -1 && endIdx !== -1) {
            const [minIdx, maxIdx] = [
              Math.min(startIdx, endIdx),
              Math.max(startIdx, endIdx),
            ];
            const rangeIds = data
              .slice(minIdx, maxIdx + 1)
              .map((row) => getRowId(row));
            setSelectedRowIds(new Set(rangeIds));
          }
        } else {
          // No anchor, just select single row
          setSelectedRowIds(new Set([rowId]));
          setLastSelectedRowId(rowId);
        }
        // Move focus to the clicked row
        setFocusedRowId(rowId);
      } else {
        // Normal click: Single selection AND set focus
        setSelectedRowIds(new Set([rowId]));
        setLastSelectedRowId(rowId);
        setFocusedRowId(rowId);
      }
    },
    [lastSelectedRowId, data, getRowId],
  );

  // Handle row double-click
  const handleRowDoubleClick = useCallback(
    (rowId: number) => {
      if (onRowDoubleClick) {
        onRowDoubleClick(rowId);
      }
    },
    [onRowDoubleClick],
  );

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

  return {
    table,
    sorting,
    setSorting,
    rowSelection,
    setRowSelection,
    pageSize,
    setPageSize,
    pagination,
    setPagination,
    selectedRowIds,
    setSelectedRowIds,
    lastSelectedRowId,
    setLastSelectedRowId,
    focusedRowId,
    setFocusedRowId,
    handleRowClick,
    handleRowDoubleClick,
    goToPageValue,
    setGoToPageValue,
    handleGoToPage,
  };
}
