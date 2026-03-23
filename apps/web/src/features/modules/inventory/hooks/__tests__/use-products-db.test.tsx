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

  /**
   * Test 2: Products load with joined relations (category, supplier)
   * Verifies TanStack DB joins work correctly
   */
  it("useProducts loads products with joined relations", async () => {
    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        expect(result.current.data).toBeDefined();
        expect(result.current.data!.length).toBeGreaterThan(0);
      },
      { timeout: 3000 },
    );

    const product = result.current.data![0];

    // Verify joined category (can be null due to left join)
    if (product.category) {
      expect(product.category).toHaveProperty("id");
      expect(product.category).toHaveProperty("name");
    }

    // Verify joined supplier (can be null due to left join)
    if (product.defaultSupplier) {
      expect(product.defaultSupplier).toHaveProperty("id");
      expect(product.defaultSupplier).toHaveProperty("name");
    }

    // Verify computed stock fields exist
    expect(product).toHaveProperty("totalQuantity");
    expect(product).toHaveProperty("availableQuantity");
    expect(product).toHaveProperty("stockStatus");
  });

  /**
   * Test 3: Performance - Initial load under 200ms
   * Verifies on-demand mode provides fast initial load
   */
  it("useProducts initial load completes under 200ms", async () => {
    const start = performance.now();

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        expect(result.current.data).toBeDefined();
      },
      { timeout: 3000 },
    );

    const duration = performance.now() - start;

    // Should load quickly with on-demand mode
    expect(duration).toBeLessThan(200);
  });

  /**
   * Test 4: Backward compatibility with existing API
   * Verifies hook maintains same shape as TanStack Query version
   */
  it("useProducts maintains backward-compatible API shape", async () => {
    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        expect(result.current.data).toBeDefined();
      },
      { timeout: 3000 },
    );

    // Verify TanStack Query-compatible shape
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("error");

    // Verify data is array
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});
