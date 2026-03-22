import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProductHistoryTab } from "../features/modules/inventory/components/ProductHistoryTab";
import * as transactionHooks from "../features/modules/inventory/hooks/use-transactions";

// Mock the useStockTransactions hook
vi.mock("../features/modules/inventory/hooks/use-transactions");

describe("ProductHistoryTab", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

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
    {
      id: 2,
      batchId: 1,
      type: "sale" as const,
      quantity: -10,
      orderId: 5001,
      userId: 2,
      reason: null,
      timestamp: "2024-01-15T14:30:00Z",
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
        quantityRemaining: 140,
        locationId: 1,
        status: "available" as const,
        notes: null,
        createdAt: "2024-01-10T10:00:00Z",
        updatedAt: "2024-01-15T14:30:00Z",
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

  it("should display transaction data correctly", async () => {
    vi.spyOn(transactionHooks, "useStockTransactions").mockReturnValue({
      data: mockTransactions,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <ProductHistoryTab productId={1} />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("purchase")).toBeInTheDocument();
    });

    expect(screen.getByText("sale")).toBeInTheDocument();
    expect(screen.getByText("+150")).toBeInTheDocument();
    expect(screen.getByText("-10")).toBeInTheDocument();
  });

  it("should show loading state", () => {
    vi.spyOn(transactionHooks, "useStockTransactions").mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <ProductHistoryTab productId={1} />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should show empty state when no transactions", () => {
    vi.spyOn(transactionHooks, "useStockTransactions").mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <ProductHistoryTab productId={1} />
      </QueryClientProvider>,
    );

    expect(
      screen.getByText(/no transaction history found/i),
    ).toBeInTheDocument();
  });

  it("should show error state", () => {
    vi.spyOn(transactionHooks, "useStockTransactions").mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: true,
      error: new Error("Failed to fetch transactions"),
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <ProductHistoryTab productId={1} />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
