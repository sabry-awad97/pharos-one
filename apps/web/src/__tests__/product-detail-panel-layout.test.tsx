import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InventoryWorkspace } from "../features/modules/inventory/InventoryWorkspace";

// Mock the hooks
vi.mock("../features/modules/inventory/hooks/use-products", () => ({
  useProducts: () => ({
    data: [
      {
        id: 1,
        name: "Test Product",
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
}));

describe("Product Detail Panel Layout", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it("should display vertical layout when panel is closed", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <InventoryWorkspace />
      </QueryClientProvider>,
    );

    // Find the main workspace container
    const table = screen.getByRole("table");
    const tableWrapper = table.closest("div"); // rounded-md div
    const scrollArea = tableWrapper?.parentElement; // overflow-auto div
    const contentContainer = scrollArea?.parentElement; // flex flex-col div
    const workspace = contentContainer?.parentElement; // main workspace

    // Verify vertical layout (flex-col class should be present when panel is closed)
    expect(workspace).toHaveClass("flex-col");

    // Panel should not be present
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  });

  it("should have proper DOM structure for layout switching", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <InventoryWorkspace />
      </QueryClientProvider>,
    );

    const table = screen.getByRole("table");

    // Verify the DOM structure exists for layout switching
    const tableWrapper = table.closest("div");
    const scrollArea = tableWrapper?.parentElement;
    const contentContainer = scrollArea?.parentElement;

    expect(contentContainer).toBeInTheDocument();
    expect(contentContainer).toHaveClass("flex");
    expect(contentContainer).toHaveClass("flex-col");
  });
});
