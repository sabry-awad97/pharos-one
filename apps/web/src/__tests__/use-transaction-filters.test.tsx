/**
 * Tests for use-transaction-filters hook
 * TDD approach: Test behavior through public interface
 */

import { renderHook, act } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { useTransactionFilters } from "../features/modules/inventory/hooks/use-transaction-filters";
import type { StockTransactionWithRelations } from "../features/modules/inventory/schema";

describe("useTransactionFilters", () => {
  // RED: Test 1 - Hook returns initial state
  test("returns initial filter state", () => {
    const { result } = renderHook(() => useTransactionFilters());

    expect(result.current.filters).toEqual({
      types: [],
      dateFrom: null,
      dateTo: null,
    });
  });

  // RED: Test 2 - Can update transaction types filter
  test("updates transaction types filter", () => {
    const { result } = renderHook(() => useTransactionFilters());

    act(() => {
      result.current.setFilters({
        types: ["purchase", "sale"],
        dateFrom: null,
        dateTo: null,
      });
    });

    expect(result.current.filters.types).toEqual(["purchase", "sale"]);
  });

  // RED: Test 3 - Can update date range filter
  test("updates date range filter", () => {
    const { result } = renderHook(() => useTransactionFilters());
    const dateFrom = new Date("2024-01-01");
    const dateTo = new Date("2024-01-31");

    act(() => {
      result.current.setFilters({
        types: [],
        dateFrom,
        dateTo,
      });
    });

    expect(result.current.filters.dateFrom).toEqual(dateFrom);
    expect(result.current.filters.dateTo).toEqual(dateTo);
  });

  // RED: Test 4 - Clear filters resets to initial state
  test("clearFilters resets to initial state", () => {
    const { result } = renderHook(() => useTransactionFilters());

    act(() => {
      result.current.setFilters({
        types: ["purchase"],
        dateFrom: new Date("2024-01-01"),
        dateTo: new Date("2024-01-31"),
      });
    });

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters).toEqual({
      types: [],
      dateFrom: null,
      dateTo: null,
    });
  });

  // RED: Test 5 - applyFilters filters by transaction type
  test("applyFilters filters transactions by type", () => {
    const { result } = renderHook(() => useTransactionFilters());

    const mockTransactions: StockTransactionWithRelations[] = [
      {
        id: 1,
        batchId: 1,
        type: "purchase",
        quantity: 100,
        orderId: null,
        userId: 1,
        reason: null,
        timestamp: "2024-01-15T10:00:00Z",
        batch: {} as any,
      },
      {
        id: 2,
        batchId: 1,
        type: "sale",
        quantity: -10,
        orderId: 1,
        userId: 1,
        reason: null,
        timestamp: "2024-01-16T10:00:00Z",
        batch: {} as any,
      },
      {
        id: 3,
        batchId: 1,
        type: "adjustment",
        quantity: 5,
        orderId: null,
        userId: 1,
        reason: "Stock count correction",
        timestamp: "2024-01-17T10:00:00Z",
        batch: {} as any,
      },
    ];

    act(() => {
      result.current.setFilters({
        types: ["purchase", "sale"],
        dateFrom: null,
        dateTo: null,
      });
    });

    const filtered = result.current.applyFilters(mockTransactions);

    expect(filtered).toHaveLength(2);
    expect(filtered[0].type).toBe("purchase");
    expect(filtered[1].type).toBe("sale");
  });

  // RED: Test 6 - applyFilters filters by date range
  test("applyFilters filters transactions by date range", () => {
    const { result } = renderHook(() => useTransactionFilters());

    const mockTransactions: StockTransactionWithRelations[] = [
      {
        id: 1,
        batchId: 1,
        type: "purchase",
        quantity: 100,
        orderId: null,
        userId: 1,
        reason: null,
        timestamp: "2024-01-10T10:00:00Z",
        batch: {} as any,
      },
      {
        id: 2,
        batchId: 1,
        type: "sale",
        quantity: -10,
        orderId: 1,
        userId: 1,
        reason: null,
        timestamp: "2024-01-20T10:00:00Z",
        batch: {} as any,
      },
      {
        id: 3,
        batchId: 1,
        type: "adjustment",
        quantity: 5,
        orderId: null,
        userId: 1,
        reason: "Stock count correction",
        timestamp: "2024-02-05T10:00:00Z",
        batch: {} as any,
      },
    ];

    act(() => {
      result.current.setFilters({
        types: [],
        dateFrom: new Date("2024-01-15T00:00:00Z"),
        dateTo: new Date("2024-01-31T23:59:59Z"),
      });
    });

    const filtered = result.current.applyFilters(mockTransactions);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(2);
  });

  // RED: Test 7 - applyFilters combines multiple filters
  test("applyFilters combines type and date filters", () => {
    const { result } = renderHook(() => useTransactionFilters());

    const mockTransactions: StockTransactionWithRelations[] = [
      {
        id: 1,
        batchId: 1,
        type: "purchase",
        quantity: 100,
        orderId: null,
        userId: 1,
        reason: null,
        timestamp: "2024-01-10T10:00:00Z",
        batch: {} as any,
      },
      {
        id: 2,
        batchId: 1,
        type: "sale",
        quantity: -10,
        orderId: 1,
        userId: 1,
        reason: null,
        timestamp: "2024-01-20T10:00:00Z",
        batch: {} as any,
      },
      {
        id: 3,
        batchId: 1,
        type: "purchase",
        quantity: 50,
        orderId: null,
        userId: 1,
        reason: null,
        timestamp: "2024-01-25T10:00:00Z",
        batch: {} as any,
      },
    ];

    act(() => {
      result.current.setFilters({
        types: ["purchase"],
        dateFrom: new Date("2024-01-15T00:00:00Z"),
        dateTo: new Date("2024-01-31T23:59:59Z"),
      });
    });

    const filtered = result.current.applyFilters(mockTransactions);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(3);
    expect(filtered[0].type).toBe("purchase");
  });

  // RED: Test 8 - Empty type filter returns all transactions
  test("empty type filter returns all transactions", () => {
    const { result } = renderHook(() => useTransactionFilters());

    const mockTransactions: StockTransactionWithRelations[] = [
      {
        id: 1,
        batchId: 1,
        type: "purchase",
        quantity: 100,
        orderId: null,
        userId: 1,
        reason: null,
        timestamp: "2024-01-15T10:00:00Z",
        batch: {} as any,
      },
      {
        id: 2,
        batchId: 1,
        type: "sale",
        quantity: -10,
        orderId: 1,
        userId: 1,
        reason: null,
        timestamp: "2024-01-16T10:00:00Z",
        batch: {} as any,
      },
    ];

    const filtered = result.current.applyFilters(mockTransactions);

    expect(filtered).toHaveLength(2);
  });
});
