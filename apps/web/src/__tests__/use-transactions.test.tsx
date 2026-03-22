import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as transactionHooks from "../features/modules/inventory/hooks/use-transactions";
import * as transactionService from "../features/modules/inventory/services/transaction.service";

// Mock the transaction service
vi.mock("../features/modules/inventory/services/transaction.service", () => ({
  fetchTransactionsByProductId: vi.fn(),
}));

describe("useStockTransactions Hook", () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch transactions for a product", async () => {
    const mockTransactions = [
      {
        id: 1,
        batchId: 1,
        type: "purchase" as const,
        quantity: 150,
        orderId: null,
        userId: 1,
        reason: "Initial stock receipt",
        timestamp: "2024-01-10T10:00:00Z",
        batch: {
          id: 1,
          productId: 1,
          batchNumber: "AMX-2024-001",
          expiryDate: "2026-03-15",
          supplierId: 1,
          purchaseOrderId: 1001,
          receivedDate: "2024-01-10",
          costPerUnit: 10.0,
          quantityReceived: 150,
          quantityRemaining: 150,
          locationId: 1,
          status: "available" as const,
          notes: null,
          createdAt: "2024-01-10T10:00:00Z",
          updatedAt: "2024-01-10T10:00:00Z",
          product: {
            id: 1,
            name: "Amoxicillin 500mg",
            sku: "AMX-500",
            genericName: "Amoxicillin",
            manufacturer: "PharmaCorp",
            categoryId: 1,
            defaultSupplierId: 1,
            basePrice: 12.5,
            reorderLevel: 50,
            requiresPrescription: true,
            controlledSubstance: false,
            description: "Antibiotic for bacterial infections",
            isActive: true,
            category: {
              id: 1,
              name: "Antibiotic",
              description: "Antibacterial medications",
              parentCategoryId: null,
            },
            defaultSupplier: {
              id: 1,
              name: "MedSupply Co",
              contactPerson: "John Smith",
              email: "john@medsupply.com",
              phone: "+1-555-0101",
              address: null,
              isActive: true,
            },
          },
          supplier: {
            id: 1,
            name: "MedSupply Co",
            contactPerson: "John Smith",
            email: "john@medsupply.com",
            phone: "+1-555-0101",
            address: null,
            isActive: true,
          },
        },
      },
    ];

    vi.spyOn(
      transactionService,
      "fetchTransactionsByProductId",
    ).mockResolvedValue(mockTransactions);

    const { result } = renderHook(
      () => transactionHooks.useStockTransactions(1),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockTransactions);
    expect(
      transactionService.fetchTransactionsByProductId,
    ).toHaveBeenCalledWith(1);
  });

  it("should only fetch when productId is provided", async () => {
    vi.spyOn(
      transactionService,
      "fetchTransactionsByProductId",
    ).mockResolvedValue([]);

    const { result } = renderHook(
      () => transactionHooks.useStockTransactions(0),
      {
        wrapper: createWrapper(),
      },
    );

    // Wait a bit to ensure query doesn't execute
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(result.current.isFetching).toBe(false);
    expect(
      transactionService.fetchTransactionsByProductId,
    ).not.toHaveBeenCalled();
  });

  it("should handle service errors", async () => {
    const mockError = new Error("Failed to fetch transactions");
    vi.spyOn(
      transactionService,
      "fetchTransactionsByProductId",
    ).mockRejectedValue(mockError);

    const { result } = renderHook(
      () => transactionHooks.useStockTransactions(1),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeUndefined();
  });
});
