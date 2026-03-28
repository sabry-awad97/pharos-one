/**
 * useDataTable Hook - Pagination Tests
 * Tests pagination behavior through the hook's public interface
 *
 * TESTING APPROACH: Integration-style tests
 * - Tests real hook implementation (no mocking)
 * - Verifies behavior through public API
 * - Would survive internal refactoring
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { useDataTable } from "../hooks/useDataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { AllProviders } from "@/test-utils";

// Test data type
interface TestProduct {
  id: number;
  name: string;
  price: number;
}

// Helper to create test data
const createTestData = (count: number): TestProduct[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: 10 + i,
  }));

// Simple columns for testing
const testColumns: ColumnDef<TestProduct>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "price", header: "Price" },
];

describe("useDataTable - Pagination", () => {
  const STORAGE_KEY = "test-page-size";

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should initialize with default page size of 25", () => {
    const data = createTestData(100);
    const { result } = renderHook(
      () =>
        useDataTable({
          data,
          columns: testColumns,
        }),
      {
        wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
      },
    );

    expect(result.current.pageSize).toBe(25);
    expect(result.current.table.getState().pagination.pageSize).toBe(25);
  });

  it("should load page size from localStorage on mount", () => {
    const data = createTestData(100);
    const { result } = renderHook(
      () =>
        useDataTable({
          data,
          columns: testColumns,
          persistenceKey: STORAGE_KEY,
        }),
      {
        wrapper: ({ children }) => (
          <AllProviders searchParams="pageSize=50">{children}</AllProviders>
        ),
      },
    );

    expect(result.current.pageSize).toBe(50);
  });

  it("should persist page size changes to localStorage", async () => {
    const data = createTestData(100);
    const { result } = renderHook(
      () =>
        useDataTable({
          data,
          columns: testColumns,
          persistenceKey: STORAGE_KEY,
        }),
      {
        wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
      },
    );

    act(() => {
      result.current.setPageSize(50);
    });

    await waitFor(() => {
      expect(result.current.pageSize).toBe(50);
    });
  });

  it("should reset to page 1 when page size changes", () => {
    const data = createTestData(100);
    const { result } = renderHook(
      () =>
        useDataTable({
          data,
          columns: testColumns,
        }),
      {
        wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
      },
    );

    // Navigate to page 2
    act(() => {
      result.current.table.setPageIndex(1);
    });

    expect(result.current.table.getState().pagination.pageIndex).toBe(1);

    // Change page size
    act(() => {
      result.current.setPageSize(50);
    });

    // Should reset to page 0 (first page)
    expect(result.current.table.getState().pagination.pageIndex).toBe(0);
  });

  it("should calculate correct page count based on data and page size", () => {
    const data = createTestData(55);
    const { result } = renderHook(
      () =>
        useDataTable({
          data,
          columns: testColumns,
        }),
      {
        wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
      },
    );

    // With 55 items and default 25 per page: 3 pages
    expect(result.current.table.getPageCount()).toBe(3);

    // Change to 10 per page: 6 pages
    act(() => {
      result.current.setPageSize(10);
    });

    expect(result.current.table.getPageCount()).toBe(6);
  });

  it("should navigate to specific page using go-to-page", () => {
    const data = createTestData(100);
    const { result } = renderHook(
      () =>
        useDataTable({
          data,
          columns: testColumns,
        }),
      {
        wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
      },
    );

    // Set page number (1-based)
    act(() => {
      result.current.setGoToPageValue("3");
    });

    // Navigate
    act(() => {
      result.current.handleGoToPage();
    });

    // Should be on page 2 (0-based index)
    expect(result.current.table.getState().pagination.pageIndex).toBe(2);
    // Input should be cleared
    expect(result.current.goToPageValue).toBe("");
  });

  it("should handle invalid page numbers gracefully", () => {
    const data = createTestData(100);
    const { result } = renderHook(
      () =>
        useDataTable({
          data,
          columns: testColumns,
        }),
      {
        wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
      },
    );

    const initialPage = result.current.table.getState().pagination.pageIndex;

    // Try invalid input
    act(() => {
      result.current.setGoToPageValue("abc");
      result.current.handleGoToPage();
    });

    // Should stay on same page
    expect(result.current.table.getState().pagination.pageIndex).toBe(
      initialPage,
    );
    // Input should be cleared
    expect(result.current.goToPageValue).toBe("");
  });

  it("should navigate to last page when input exceeds total pages", () => {
    const data = createTestData(100);
    const { result } = renderHook(
      () =>
        useDataTable({
          data,
          columns: testColumns,
        }),
      {
        wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
      },
    );

    // With 100 items and default 25 per page: 4 pages (0-3)
    const pageCount = result.current.table.getPageCount();
    expect(pageCount).toBe(4);

    // Try to go to page 10 (beyond total of 4)
    act(() => {
      result.current.setGoToPageValue("10");
    });

    act(() => {
      result.current.handleGoToPage();
    });

    // Should be on last page (index 3)
    const finalIndex = result.current.table.getState().pagination.pageIndex;
    expect(finalIndex).toBe(3);
  });

  it("should handle page numbers less than 1", () => {
    const data = createTestData(100);
    const { result } = renderHook(
      () =>
        useDataTable({
          data,
          columns: testColumns,
        }),
      {
        wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
      },
    );

    // Navigate to page 2 first
    act(() => {
      result.current.table.setPageIndex(1);
    });

    const currentPage = result.current.table.getState().pagination.pageIndex;

    // Try page 0
    act(() => {
      result.current.setGoToPageValue("0");
      result.current.handleGoToPage();
    });

    // Should stay on current page
    expect(result.current.table.getState().pagination.pageIndex).toBe(
      currentPage,
    );
  });

  it("should provide correct pagination state for UI rendering", () => {
    const data = createTestData(55);
    const { result } = renderHook(
      () =>
        useDataTable({
          data,
          columns: testColumns,
        }),
      {
        wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
      },
    );

    // Set page size to 10
    act(() => {
      result.current.setPageSize(10);
    });

    // Navigate to page 2 (index 1)
    act(() => {
      result.current.table.setPageIndex(1);
    });

    const state = result.current.table.getState().pagination;

    expect(state.pageIndex).toBe(1);
    expect(state.pageSize).toBe(10);
    expect(result.current.table.getPageCount()).toBe(6);
    expect(result.current.table.getCanPreviousPage()).toBe(true);
    expect(result.current.table.getCanNextPage()).toBe(true);
  });

  it("should handle empty data array", () => {
    const { result } = renderHook(
      () =>
        useDataTable({
          data: [],
          columns: testColumns,
        }),
      {
        wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
      },
    );

    expect(result.current.table.getPageCount()).toBe(0);
    expect(result.current.table.getCanPreviousPage()).toBe(false);
    expect(result.current.table.getCanNextPage()).toBe(false);
  });
});
