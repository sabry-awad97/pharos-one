import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "@/test-utils";
import { ProductLotsTab } from "../features/modules/inventory/components/ProductLotsTab";
import * as batchHooks from "../features/modules/inventory/hooks/use-batches";

// Mock the useBatches hook
vi.mock("../features/modules/inventory/hooks/use-batches");

describe("ProductLotsTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it("should display batch data correctly", async () => {
    vi.spyOn(batchHooks, "useBatches").mockReturnValue({
      data: mockBatches,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    } as any);

    renderWithProviders(<ProductLotsTab productId={1} />);

    await waitFor(() => {
      expect(screen.getByText("AMX-2024-001")).toBeInTheDocument();
    });

    expect(screen.getByText("2026-03-15")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("MedSupply Co")).toBeInTheDocument();
  });

  it("should show loading state", () => {
    vi.spyOn(batchHooks, "useBatches").mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
    } as any);

    renderWithProviders(<ProductLotsTab productId={1} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should show empty state when no batches", () => {
    vi.spyOn(batchHooks, "useBatches").mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    } as any);

    renderWithProviders(<ProductLotsTab productId={1} />);

    expect(screen.getByText(/no batches found/i)).toBeInTheDocument();
  });

  it("should show error state", () => {
    vi.spyOn(batchHooks, "useBatches").mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: true,
      error: new Error("Failed to fetch batches"),
    } as any);

    renderWithProviders(<ProductLotsTab productId={1} />);

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
