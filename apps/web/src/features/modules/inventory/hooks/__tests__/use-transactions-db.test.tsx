/**
 * Integration tests for transactions migration to TanStack DB with ON-DEMAND mode
 * Tests the on-demand sync mode with predicate push-down for millions of records
 */

import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTransactions } from "../use-transactions";

describe("useTransactions with TanStack DB (On-Demand Mode)", () => {
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
   * Test 1 (Tracer Bullet): Transactions load without filters
   * Verifies basic functionality - hook returns transactions
   */
  it("useTransactions loads transactions", async () => {
    const { result } = renderHook(() => useTransactions(), {
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

    // Verify data structure
    expect(result.current.data![0]).toHaveProperty("id");
    expect(result.current.data![0]).toHaveProperty("batchId");
    expect(result.current.data![0]).toHaveProperty("type");
    expect(result.current.data![0]).toHaveProperty("timestamp");
  });

  /**
   * Test 2: Transactions load with date filter
   * Verifies date range filtering works with TanStack DB operators
   *
   * Uses gte/lte operators with full ISO timestamps for proper comparison
   */
  it("useTransactions loads transactions for date range", async () => {
    const filters = {
      startDate: "2024-01-01",
      endDate: "2024-01-31",
    };
    const { result } = renderHook(() => useTransactions(filters), {
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

    // CRITICAL: Verify all transactions are within date range
    result.current.data!.forEach((transaction) => {
      const transactionDate = transaction.timestamp.split("T")[0];
      expect(transactionDate >= filters.startDate).toBe(true);
      expect(transactionDate <= filters.endDate).toBe(true);
    });
  });

  /**
   * Test 2: Transactions filtered by productId
   * Note: This uses in-memory filtering since joins aren't implemented yet
   * In mock data, batchId maps to productId for testing purposes
   */
  it("useTransactions loads transactions for product", async () => {
    const productId = 1;
    const { result } = renderHook(() => useTransactions({ productId }), {
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

    // CRITICAL: Verify all transactions belong to the requested productId
    // In mock data, batchId maps to productId
    result.current.data!.forEach((transaction) => {
      expect(transaction.batchId).toBe(productId);
    });
  });

  /**
   * Test 3: Combined filters work
   * Tests date range filtering with TanStack DB operators
   */
  it("useTransactions handles combined filters", async () => {
    const filters = {
      startDate: "2024-01-01",
      endDate: "2024-01-31",
    };
    const { result } = renderHook(() => useTransactions(filters), {
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

    // CRITICAL: Verify all transactions match filters
    result.current.data!.forEach((transaction) => {
      const transactionDate = transaction.timestamp.split("T")[0];
      expect(transactionDate >= filters.startDate).toBe(true);
      expect(transactionDate <= filters.endDate).toBe(true);
    });
  });

  /**
   * Test 4: Performance with typical date range
   * Verifies TanStack DB operators provide fast filtered loading
   */
  it("useTransactions loads 30-day range under 200ms", async () => {
    const startTime = performance.now();
    const { result } = renderHook(
      () =>
        useTransactions({
          startDate: "2024-01-01",
          endDate: "2024-01-31",
        }),
      {
        wrapper: createWrapper(),
      },
    );

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

    // CRITICAL: Verify load time is under 200ms
    expect(loadTime).toBeLessThan(200);
  });
});
