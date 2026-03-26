import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useDataTable } from "../hooks/useDataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { AllProviders } from "@/test-utils";

interface TestData {
  id: number;
  name: string;
}

const mockData: TestData[] = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
];

const mockColumns: ColumnDef<TestData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
];

describe("useDataTable", () => {
  it("should initialize with default pagination state", () => {
    const { result } = renderHook(
      () =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
        }),
      {
        wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
      },
    );

    const paginationState = result.current.table.getState().pagination;
    expect(paginationState.pageIndex).toBe(0);
    expect(paginationState.pageSize).toBe(25); // DEFAULT_PAGE_SIZE
  });
});

it("should initialize with empty row selection state", () => {
  const { result } = renderHook(
    () =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
      }),
    {
      wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
    },
  );

  expect(result.current.selectedRowIds.size).toBe(0);
  expect(result.current.focusedRowId).toBe(null);
  expect(result.current.lastSelectedRowId).toBe(null);
});

it("should handle single row click (normal click)", () => {
  const { result } = renderHook(
    () =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
      }),
    {
      wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
    },
  );

  // Simulate normal click on row with id 1
  const mockEvent = {
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
  } as React.MouseEvent;

  act(() => {
    result.current.handleRowClick(1, mockEvent);
  });

  expect(result.current.selectedRowIds.has(1)).toBe(true);
  expect(result.current.selectedRowIds.size).toBe(1);
  expect(result.current.focusedRowId).toBe(1);
  expect(result.current.lastSelectedRowId).toBe(1);
});

it("should handle Ctrl+Click to toggle selection", () => {
  const { result } = renderHook(
    () =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
      }),
    {
      wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
    },
  );

  // First click - select row 1
  act(() => {
    result.current.handleRowClick(1, {
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    } as React.MouseEvent);
  });

  expect(result.current.selectedRowIds.has(1)).toBe(true);

  // Ctrl+Click row 2 - add to selection
  act(() => {
    result.current.handleRowClick(2, {
      ctrlKey: true,
      metaKey: false,
      shiftKey: false,
    } as React.MouseEvent);
  });

  expect(result.current.selectedRowIds.has(1)).toBe(true);
  expect(result.current.selectedRowIds.has(2)).toBe(true);
  expect(result.current.selectedRowIds.size).toBe(2);

  // Ctrl+Click row 2 again - remove from selection
  act(() => {
    result.current.handleRowClick(2, {
      ctrlKey: true,
      metaKey: false,
      shiftKey: false,
    } as React.MouseEvent);
  });

  expect(result.current.selectedRowIds.has(1)).toBe(true);
  expect(result.current.selectedRowIds.has(2)).toBe(false);
  expect(result.current.selectedRowIds.size).toBe(1);
});

it("should handle Shift+Click for range selection", () => {
  const { result } = renderHook(
    () =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
      }),
    {
      wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
    },
  );

  // First click - select row 1
  act(() => {
    result.current.handleRowClick(1, {
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    } as React.MouseEvent);
  });

  expect(result.current.selectedRowIds.has(1)).toBe(true);
  expect(result.current.lastSelectedRowId).toBe(1);

  // Shift+Click row 3 - select range 1-3
  act(() => {
    result.current.handleRowClick(3, {
      ctrlKey: false,
      metaKey: false,
      shiftKey: true,
    } as React.MouseEvent);
  });

  expect(result.current.selectedRowIds.has(1)).toBe(true);
  expect(result.current.selectedRowIds.has(2)).toBe(true);
  expect(result.current.selectedRowIds.has(3)).toBe(true);
  expect(result.current.selectedRowIds.size).toBe(3);
  expect(result.current.focusedRowId).toBe(3);
});

it("should handle double-click with custom callback", () => {
  const onRowDoubleClick = vi.fn();
  const { result } = renderHook(
    () =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
        onRowDoubleClick,
      }),
    {
      wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
    },
  );

  act(() => {
    result.current.handleRowDoubleClick(2);
  });

  expect(onRowDoubleClick).toHaveBeenCalledWith(2);
  expect(onRowDoubleClick).toHaveBeenCalledOnce();
});

it("should navigate to valid page number", () => {
  // Create enough data for multiple pages (50 items with 25 per page = 2 pages)
  const largeDataSet = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));

  const { result } = renderHook(
    () =>
      useDataTable({
        data: largeDataSet,
        columns: mockColumns,
      }),
    {
      wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
    },
  );

  // Set go to page value
  act(() => {
    result.current.setGoToPageValue("2");
  });

  expect(result.current.goToPageValue).toBe("2");

  // Navigate to page 2
  act(() => {
    result.current.handleGoToPage();
  });

  expect(result.current.table.getState().pagination.pageIndex).toBe(1); // 0-based
  expect(result.current.goToPageValue).toBe(""); // Input cleared
});

it("should handle invalid page numbers gracefully", () => {
  const { result } = renderHook(
    () =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
      }),
    {
      wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
    },
  );

  // Try to go to page 0 (invalid)
  act(() => {
    result.current.setGoToPageValue("0");
    result.current.handleGoToPage();
  });

  expect(result.current.table.getState().pagination.pageIndex).toBe(0); // Stay on page 1
  expect(result.current.goToPageValue).toBe(""); // Input cleared
});

it("should navigate to last page when page number exceeds total", () => {
  const { result } = renderHook(
    () =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
      }),
    {
      wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
    },
  );

  // Try to go to page 100 (beyond total)
  act(() => {
    result.current.setGoToPageValue("100");
    result.current.handleGoToPage();
  });

  const totalPages = result.current.table.getPageCount();
  expect(result.current.table.getState().pagination.pageIndex).toBe(
    totalPages - 1,
  ); // Last page
  expect(result.current.goToPageValue).toBe(""); // Input cleared
});
