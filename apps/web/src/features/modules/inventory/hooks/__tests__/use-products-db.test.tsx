/**
 * Integration tests for products migration to TanStack DB with ON-DEMAND mode
 * Tests the on-demand sync mode with predicate push-down for 1M+ records
 */

import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProducts } from "../use-products";

describe("useProducts with TanStack DB (On-Demand Mode)", () => {
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
   * Test 1 (Tracer Bullet): Products load through hook with on-demand mode
   * Verifies basic functionality - hook returns product subset, NOT all records
   */
  it("useProducts loads product subset", async () => {
    const { result } = renderHook(() => useProducts(), {
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

    // CRITICAL: Verify we're NOT loading all records (on-demand mode)
    // With on-demand mode, we should load a subset (e.g., 50-100 records)
    expect(result.current.data!.length).toBeLessThan(100);

    // Verify data structure
    expect(result.current.data![0]).toHaveProperty("id");
    expect(result.current.data![0]).toHaveProperty("name");
    expect(result.current.data![0]).toHaveProperty("sku");
  });
});
