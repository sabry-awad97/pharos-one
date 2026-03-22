import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as batchHooks from "../features/modules/inventory/hooks/use-batches";
import * as batchService from "../features/modules/inventory/services/batch.service";

// Mock the batch service
vi.mock("../features/modules/inventory/services/batch.service");

describe("useBatches Hook", () => {
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

  it("should fetch batches for a product", async () => {
    const mockBatches = [
      {
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
    ];

    vi.spyOn(batchService, "fetchBatchesByProductId").mockResolvedValue(
      mockBatches,
    );

    const { result } = renderHook(() => batchHooks.useBatches(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockBatches);
    expect(batchService.fetchBatchesByProductId).toHaveBeenCalledWith(1);
  });

  it("should only fetch when productId is provided", async () => {
    vi.spyOn(batchService, "fetchBatchesByProductId").mockResolvedValue([]);

    const { result } = renderHook(() => batchHooks.useBatches(0), {
      wrapper: createWrapper(),
    });

    // Wait a bit to ensure query doesn't execute
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(result.current.isFetching).toBe(false);
    expect(batchService.fetchBatchesByProductId).not.toHaveBeenCalled();
  });

  it("should handle service errors", async () => {
    const mockError = new Error("Failed to fetch batches");
    vi.spyOn(batchService, "fetchBatchesByProductId").mockRejectedValue(
      mockError,
    );

    const { result } = renderHook(() => batchHooks.useBatches(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeUndefined();
  });
});
