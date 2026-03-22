import {
  render,
  screen,
  within,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InventoryWorkspace } from "../features/modules/inventory/InventoryWorkspace";
import * as batchService from "../features/modules/inventory/services/batch.service";

// Mock the batch service
vi.mock("../features/modules/inventory/services/batch.service");

// Mock the hooks
vi.mock("../features/modules/inventory/hooks/use-products", () => ({
  useProducts: () => ({
    data: [
      {
        id: 1,
        name: "Product with Batches",
        sku: "TEST-001",
        availableQuantity: 100,
        reorderLevel: 20,
        nearestExpiry: "2026-12-31",
        basePrice: 99.99,
        batchCount: 2,
        totalQuantity: 100,
        reservedQuantity: 0,
        category: { id: 1, name: "Category 1" },
        defaultSupplier: { id: 1, name: "Supplier 1" },
        stockStatus: "ok" as const,
      },
    ],
    isLoading: false,
    error: null,
  }),
  useProduct: () => ({
    data: null,
    isLoading: true,
    isSuccess: false,
    isError: false,
    error: null,
  }),
}));

describe("Batch Details Integration", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <InventoryWorkspace />
      </QueryClientProvider>,
    );
  };

  it("should fetch batches when Batch Details action clicked", async () => {
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

    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    // Right-click to open context menu
    fireEvent.contextMenu(firstDataRow);

    // Click Batch Details action
    const batchDetailsAction = screen.getByText("Batch Details");
    fireEvent.click(batchDetailsAction);

    // Should fetch batches for product 1
    await waitFor(() => {
      expect(batchService.fetchBatchesByProductId).toHaveBeenCalledWith(1);
    });

    // Click on Lots tab to see batch data
    const lotsTab = screen.getByText("Lots");
    fireEvent.click(lotsTab);

    // Should show batch data
    await waitFor(() => {
      expect(screen.getByText("AMX-2024-001")).toBeInTheDocument();
    });
  });
});
