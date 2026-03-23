import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProductDetailsTab } from "../features/modules/inventory/components/ProductDetailsTab";
import * as productHooks from "../features/modules/inventory/hooks/use-products";

// Mock the useProduct hook
vi.mock("../features/modules/inventory/hooks/use-products");

describe("ProductDetailsTab", () => {
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

  // TRACER BULLET: First test to verify basic rendering
  it("should display product name when data loads", async () => {
    const mockProduct = {
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
      totalQuantity: 240,
      availableQuantity: 240,
      reservedQuantity: 0,
      nearestExpiry: "2026-03-15",
      batchCount: 2,
      stockStatus: "ok" as const,
    };

    vi.spyOn(productHooks, "useProduct").mockReturnValue({
      data: mockProduct,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    } as any);

    render(<ProductDetailsTab productId={1} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Amoxicillin 500mg")).toBeInTheDocument();
    });
  });

  it("should show loading state while fetching data", () => {
    vi.spyOn(productHooks, "useProduct").mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
    } as any);

    render(<ProductDetailsTab productId={1} />, { wrapper: createWrapper() });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should show error state if fetch fails", () => {
    vi.spyOn(productHooks, "useProduct").mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: true,
      error: new Error("Failed to fetch product"),
    } as any);

    render(<ProductDetailsTab productId={1} />, { wrapper: createWrapper() });

    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to fetch product/i)).toBeInTheDocument();
  });

  it("should show empty state if product not found", () => {
    vi.spyOn(productHooks, "useProduct").mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    } as any);

    render(<ProductDetailsTab productId={1} />, { wrapper: createWrapper() });

    expect(screen.getByText(/product not found/i)).toBeInTheDocument();
  });

  it("should display all product fields in organized sections", async () => {
    const mockProduct = {
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
      totalQuantity: 240,
      availableQuantity: 240,
      reservedQuantity: 0,
      nearestExpiry: "2026-03-15",
      batchCount: 2,
      stockStatus: "ok" as const,
    };

    vi.spyOn(productHooks, "useProduct").mockReturnValue({
      data: mockProduct,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    } as any);

    render(<ProductDetailsTab productId={1} />, { wrapper: createWrapper() });

    // Basic Info
    expect(screen.getByText("Amoxicillin 500mg")).toBeInTheDocument();
    expect(screen.getByText("AMX-500")).toBeInTheDocument();
    expect(screen.getByText("Amoxicillin")).toBeInTheDocument();
    expect(screen.getByText("PharmaCorp")).toBeInTheDocument();

    // Classification
    expect(screen.getByText("Antibiotic")).toBeInTheDocument();

    // Supplier
    expect(screen.getByText("MedSupply Co")).toBeInTheDocument();

    // Pricing
    expect(screen.getByText(/12\.5/)).toBeInTheDocument();

    // Stock - use getAllByText for duplicate values
    const quantities = screen.getAllByText("240");
    expect(quantities).toHaveLength(2); // Available and Total
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();

    // Status - batch count
    const batchCount = screen.getAllByText("2");
    expect(batchCount.length).toBeGreaterThan(0);
  });
});
