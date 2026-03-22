/**
 * InventoryWorkspace Row Click Tests
 * Tests for opening Product Details Panel by clicking table rows
 */

import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InventoryWorkspace } from "../features/modules/inventory/InventoryWorkspace";

// Mock the hooks
vi.mock("../features/modules/inventory/hooks/use-products", () => ({
  useProducts: () => ({
    data: [
      {
        id: 1,
        name: "Amoxicillin 500mg",
        sku: "AMX-500",
        availableQuantity: 100,
        reorderLevel: 20,
        nearestExpiry: "2026-12-31",
        basePrice: 99.99,
        category: { id: 1, name: "Antibiotics" },
        defaultSupplier: { id: 1, name: "PharmaCorp" },
        stockStatus: "ok" as const,
        batchCount: 3,
      },
      {
        id: 2,
        name: "Ibuprofen 200mg",
        sku: "IBU-200",
        availableQuantity: 50,
        reorderLevel: 10,
        nearestExpiry: "2027-06-30",
        basePrice: 49.99,
        category: { id: 2, name: "Pain Relief" },
        defaultSupplier: { id: 2, name: "MediSupply" },
        stockStatus: "ok" as const,
        batchCount: 2,
      },
    ],
    isLoading: false,
    error: null,
  }),
  useProduct: (id: number) => ({
    data:
      id === 1
        ? {
            id: 1,
            name: "Amoxicillin 500mg",
            sku: "AMX-500",
            availableQuantity: 100,
            reorderLevel: 20,
            nearestExpiry: "2026-12-31",
            basePrice: 99.99,
            category: { id: 1, name: "Antibiotics" },
            defaultSupplier: { id: 1, name: "PharmaCorp" },
            stockStatus: "ok" as const,
            batchCount: 3,
          }
        : {
            id: 2,
            name: "Ibuprofen 200mg",
            sku: "IBU-200",
            availableQuantity: 50,
            reorderLevel: 10,
            nearestExpiry: "2027-06-30",
            basePrice: 49.99,
            category: { id: 2, name: "Pain Relief" },
            defaultSupplier: { id: 2, name: "MediSupply" },
            stockStatus: "ok" as const,
            batchCount: 2,
          },
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

vi.mock("../features/modules/inventory/hooks/use-batches", () => ({
  useBatches: () => ({
    data: [],
    isLoading: false,
    error: null,
  }),
}));

vi.mock("../features/modules/inventory/hooks/use-transactions", () => ({
  useStockTransactions: () => ({
    data: [],
    isLoading: false,
    error: null,
  }),
}));

describe("InventoryWorkspace - Row Click", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <InventoryWorkspace />
      </QueryClientProvider>,
    );
  };

  it("should open Product Details Panel when clicking a table row", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Get first data row
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header

    // Click the row (not the checkbox)
    const productNameCell = within(firstDataRow).getByText("Amoxicillin 500mg");
    await user.click(productNameCell);

    // Verify panel opens
    const panel = await screen.findByRole("complementary");
    expect(panel).toBeInTheDocument();
    expect(within(panel).getByText("Amoxicillin 500mg")).toBeInTheDocument();
  });

  it("should not open Product Details Panel when clicking checkbox", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Get first data row
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header

    // Click the checkbox
    const checkbox = within(firstDataRow).getByRole("checkbox");
    await user.click(checkbox);

    // Verify checkbox is checked
    expect(checkbox).toBeChecked();

    // Verify panel does NOT open
    await waitFor(() => {
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    });
  });

  it("should switch panel to different product when clicking another row", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Get table rows
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header
    const secondDataRow = rows[2];

    // Click first row
    const firstProductName =
      within(firstDataRow).getByText("Amoxicillin 500mg");
    await user.click(firstProductName);

    // Verify first product panel opens
    let panel = await screen.findByRole("complementary");
    expect(within(panel).getByText("Amoxicillin 500mg")).toBeInTheDocument();

    // Click second row
    const secondProductName =
      within(secondDataRow).getByText("Ibuprofen 200mg");
    await user.click(secondProductName);

    // Verify panel switches to second product
    panel = await screen.findByRole("complementary");
    expect(within(panel).getByText("Ibuprofen 200mg")).toBeInTheDocument();
    expect(
      within(panel).queryByText("Amoxicillin 500mg"),
    ).not.toBeInTheDocument();
  });

  it("should apply focus border styling to clicked row", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Get first data row
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header

    // Click the row
    const productNameCell = within(firstDataRow).getByText("Amoxicillin 500mg");
    await user.click(productNameCell);

    // Verify row now has focus border (check that boxShadow is not "none")
    await waitFor(() => {
      const style = window.getComputedStyle(firstDataRow);
      // Should have an inset box-shadow (not "none")
      expect(style.boxShadow).not.toBe("none");
      expect(style.boxShadow).toContain("inset");
    });

    // Verify panel opened
    const panel = await screen.findByRole("complementary");
    expect(panel).toBeInTheDocument();
  });

  it("should move focus border when clicking different row", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Get table rows
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header
    const secondDataRow = rows[2];

    // Click first row
    const firstProductName =
      within(firstDataRow).getByText("Amoxicillin 500mg");
    await user.click(firstProductName);

    // Verify first row has focus border
    await waitFor(() => {
      const style = window.getComputedStyle(firstDataRow);
      expect(style.boxShadow).not.toBe("none");
      expect(style.boxShadow).toContain("inset");
    });

    // Click second row
    const secondProductName =
      within(secondDataRow).getByText("Ibuprofen 200mg");
    await user.click(secondProductName);

    // Verify second row now has focus border
    await waitFor(() => {
      const style = window.getComputedStyle(secondDataRow);
      expect(style.boxShadow).not.toBe("none");
      expect(style.boxShadow).toContain("inset");
    });

    // Verify first row no longer has focus border
    const firstStyle = window.getComputedStyle(firstDataRow);
    expect(firstStyle.boxShadow).toBe("none");
  });
});
