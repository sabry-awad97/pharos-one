/**
 * Integration tests for categories migration to TanStack DB
 * Tests the backward-compatible hook API with eager mode
 */

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCategories } from "../use-categories";

describe("useCategories with TanStack DB", () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  /**
   * Test 1 (Tracer Bullet): Categories load through hook
   * Verifies basic functionality - hook returns category list
   */
  it("useCategories returns category list", async () => {
    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    // Wait for data to load
    await waitFor(
      () => {
        expect(result.current.data).toBeDefined();
        expect(result.current.data!.length).toBeGreaterThan(0);
      },
      { timeout: 3000 },
    );

    expect(result.current.data![0]).toHaveProperty("name");
    expect(result.current.data![0]).toHaveProperty("id");
  });

  /**
   * Test 2: Hook maintains backward-compatible API shape
   * Verifies the hook returns the same shape as TanStack Query
   */
  it("useCategories returns TanStack Query shape", async () => {
    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    // Check all required properties exist
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("isSuccess");
    expect(result.current).toHaveProperty("status");

    // Wait for data to load
    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 3000 },
    );

    // Verify status is correct
    expect(result.current.status).toBe("success");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  /**
   * Test 3: Categories data is consistent across renders
   * Verifies the hook returns stable data (eager mode pre-loads data)
   */
  it("useCategories returns consistent data", async () => {
    const { result, rerender } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    // Wait for initial data load
    await waitFor(
      () => {
        expect(result.current.data).toBeDefined();
        expect(result.current.data!.length).toBeGreaterThan(0);
      },
      { timeout: 3000 },
    );

    const initialData = result.current.data;
    const initialLength = initialData!.length;

    // Rerender the hook
    rerender();

    // Data should remain the same (eager mode)
    expect(result.current.data).toBeDefined();
    expect(result.current.data!.length).toBe(initialLength);

    // Verify data structure is consistent
    expect(result.current.data![0]).toHaveProperty("id");
    expect(result.current.data![0]).toHaveProperty("name");
    expect(result.current.data![0]).toHaveProperty("description");
    expect(result.current.data![0]).toHaveProperty("parentCategoryId");
  });
});
