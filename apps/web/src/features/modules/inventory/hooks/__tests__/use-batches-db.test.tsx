/**
 * Integration tests for batches migration to TanStack DB with ON-DEMAND mode
 * Tests the on-demand sync mode with predicate push-down for 100K+ records
 */

import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useBatches } from "../use-batches";

describe("useBatches with TanStack DB (On-Demand Mode)", () => {
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
   * Test 1 (Tracer Bullet): Batches load filtered by productId
   * Verifies basic functionality - hook returns batches for specific product
   */
  it("useBatches loads batches filtered by productId", async () => {
    const productId = 1;
    const { result } = renderHook(() => useBatches(productId), {
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

    // CRITICAL: Verify all batches belong to the requested productId
    result.current.data!.forEach((batch) => {
      expect(batch.productId).toBe(productId);
    });

    // Verify data structure
    expect(result.current.data![0]).toHaveProperty("id");
    expect(result.current.data![0]).toHaveProperty("batchNumber");
    expect(result.current.data![0]).toHaveProperty("productId");
    expect(result.current.data![0]).toHaveProperty("product");
    expect(result.current.data![0]).toHaveProperty("supplier");
  });

  /**
   * Test 2: Hook maintains backward-compatible API shape
   * Verifies the hook returns the same shape as TanStack Query
   */
  it("useBatches maintains backward-compatible API shape", async () => {
    const productId = 1;
    const { result } = renderHook(() => useBatches(productId), {
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

    // Verify hook returns expected properties
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("error");

    // Verify data is an array
    expect(Array.isArray(result.current.data)).toBe(true);

    // Verify each batch has required relations (can be null from left joins)
    const batch = result.current.data![0];
    expect(batch).toBeDefined();
    expect(batch).toHaveProperty("product");
    expect(batch).toHaveProperty("supplier");

    // If product exists, it should have category and defaultSupplier properties
    if (batch.product) {
      expect(batch.product).toHaveProperty("category");
      expect(batch.product).toHaveProperty("defaultSupplier");
    }
  });

  /**
   * Test 3: Performance - Initial load completes within 100ms
   * Verifies on-demand mode provides fast filtered loading
   */
  it("useBatches loads filtered data within 100ms", async () => {
    const productId = 1;
    const startTime = performance.now();

    const { result } = renderHook(() => useBatches(productId), {
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

    const endTime = performance.now();
    const loadTime = endTime - startTime;

    // CRITICAL: Verify load time is under 100ms
    expect(loadTime).toBeLessThan(100);
  });
});
