/**
 * InventoryWorkspace Row Click Tests
 * Tests for row focus styling and Product Details Panel opening
 */

import {
  render,
  screen,
  within,
  waitFor,
  fireEvent,
} from "@testing-library/react";
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

describe("InventoryWorkspace - Row Focus Styling", () => {
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

  it("should show focus border on single-click (without opening panel)", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Get first data row
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header

    // Single-click the row
    const productNameCell = within(firstDataRow).getByText("Amoxicillin 500mg");
    await user.click(productNameCell);

    // Verify row has focus border (data-focused attribute)
    await waitFor(() => {
      expect(firstDataRow).toHaveAttribute("data-focused", "true");
    });

    // Verify panel does NOT open on single click
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
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
      expect(firstDataRow).toHaveAttribute("data-focused", "true");
    });

    // Click second row
    const secondProductName =
      within(secondDataRow).getByText("Ibuprofen 200mg");
    await user.click(secondProductName);

    // Verify second row now has focus border
    await waitFor(() => {
      expect(secondDataRow).toHaveAttribute("data-focused", "true");
    });

    // Verify first row no longer has focus border
    expect(firstDataRow).not.toHaveAttribute("data-focused", "true");
  });

  it("should open Product Details Panel when double-clicking a table row", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Get first data row
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header

    // Double-click the row
    const productNameCell = within(firstDataRow).getByText("Amoxicillin 500mg");
    await user.dblClick(productNameCell);

    // Verify panel opens
    const panel = await screen.findByRole("complementary");
    expect(panel).toBeInTheDocument();
    expect(within(panel).getByText("Amoxicillin 500mg")).toBeInTheDocument();

    // Verify row still has focus border
    expect(firstDataRow).toHaveAttribute("data-focused", "true");
  });

  it("should switch panel to different product when double-clicking another row", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Get table rows
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header
    const secondDataRow = rows[2];

    // Double-click first row
    const firstProductName =
      within(firstDataRow).getByText("Amoxicillin 500mg");
    await user.dblClick(firstProductName);

    // Verify first product panel opens
    let panel = await screen.findByRole("complementary");
    expect(within(panel).getByText("Amoxicillin 500mg")).toBeInTheDocument();

    // Double-click second row
    const secondProductName =
      within(secondDataRow).getByText("Ibuprofen 200mg");
    await user.dblClick(secondProductName);

    // Verify panel switches to second product
    panel = await screen.findByRole("complementary");
    expect(within(panel).getByText("Ibuprofen 200mg")).toBeInTheDocument();
    expect(
      within(panel).queryByText("Amoxicillin 500mg"),
    ).not.toBeInTheDocument();

    // Verify focus moved to second row
    expect(secondDataRow).toHaveAttribute("data-focused", "true");
    expect(firstDataRow).not.toHaveAttribute("data-focused", "true");
  });
});

describe("InventoryWorkspace - Windows-style Multi-Selection", () => {
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

  it("should select single row when clicking without modifiers and clear previous selection", async () => {
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

    // Verify first row is selected (has selection background, not just focus)
    await waitFor(() => {
      // Check for data-selected attribute
      expect(firstDataRow).toHaveAttribute("data-selected", "true");
    });

    // Click second row without modifiers
    const secondProductName =
      within(secondDataRow).getByText("Ibuprofen 200mg");
    await user.click(secondProductName);

    // Verify second row is now selected
    await waitFor(() => {
      expect(secondDataRow).toHaveAttribute("data-selected", "true");
    });

    // Verify first row is NO LONGER selected (should not have selection background)
    expect(firstDataRow).not.toHaveAttribute("data-selected", "true");
  });

  it("should toggle row selection when Ctrl+Click (multi-select)", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Get table rows
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header
    const secondDataRow = rows[2];

    // Click first row normally (selects and opens panel, setting focused state)
    const firstProductName =
      within(firstDataRow).getByText("Amoxicillin 500mg");
    await user.click(firstProductName);

    // Verify first row is selected (has selection background)
    await waitFor(() => {
      expect(firstDataRow).toHaveAttribute("data-selected", "true");
    });

    // Ctrl+Click second row to add to selection (without opening panel)
    const secondProductName =
      within(secondDataRow).getByText("Ibuprofen 200mg");
    fireEvent.click(secondProductName, { ctrlKey: true });

    // Verify BOTH rows are now selected
    await waitFor(() => {
      expect(firstDataRow).toHaveAttribute("data-selected", "true");
      expect(secondDataRow).toHaveAttribute("data-selected", "true");
    });

    // Ctrl+Click second row again to deselect it
    fireEvent.click(secondProductName, { ctrlKey: true });

    // Force a re-render by triggering mouse events
    fireEvent.mouseLeave(secondDataRow);
    fireEvent.mouseEnter(secondDataRow);
    fireEvent.mouseLeave(secondDataRow);

    // Verify second row is now deselected
    // First row should still be selected (but NOT focused since we didn't double-click)
    await waitFor(() => {
      expect(firstDataRow).toHaveAttribute("data-selected", "true");
      expect(secondDataRow).not.toHaveAttribute("data-selected", "true");
    });
  });

  it("should move focus when Shift+Click (range selection)", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Get table rows
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header
    const secondDataRow = rows[2];

    // Click first row normally to establish anchor
    const firstProductName =
      within(firstDataRow).getByText("Amoxicillin 500mg");
    await user.click(firstProductName);

    // Verify first row is selected and focused
    await waitFor(() => {
      expect(firstDataRow).toHaveAttribute("data-selected", "true");
      expect(firstDataRow).toHaveAttribute("data-focused", "true");
    });

    // Shift+Click second row to select range
    const secondProductName =
      within(secondDataRow).getByText("Ibuprofen 200mg");
    fireEvent.click(secondProductName, { shiftKey: true });

    // Verify BOTH rows are now selected (range from first to second)
    await waitFor(() => {
      expect(firstDataRow).toHaveAttribute("data-selected", "true");
      expect(secondDataRow).toHaveAttribute("data-selected", "true");
    });

    // Verify focus moved to second row (the clicked row)
    expect(secondDataRow).toHaveAttribute("data-focused", "true");
    expect(firstDataRow).not.toHaveAttribute("data-focused", "true");
  });

  it("should not have checkbox column", async () => {
    renderComponent();

    // Get table header row
    const table = screen.getByRole("table");
    const headerRow = within(table).getAllByRole("row")[0];

    // Verify there's no checkbox in header
    const checkboxes = within(headerRow).queryAllByRole("checkbox");
    expect(checkboxes).toHaveLength(0);

    // Verify data rows don't have checkboxes either
    const dataRows = within(table).getAllByRole("row").slice(1);
    dataRows.forEach((row) => {
      const rowCheckboxes = within(row).queryAllByRole("checkbox");
      expect(rowCheckboxes).toHaveLength(0);
    });
  });

  it("should open panel on double-click, not single-click", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Get first data row
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header

    // Single click the row
    const productNameCell = within(firstDataRow).getByText("Amoxicillin 500mg");
    await user.click(productNameCell);

    // Verify panel does NOT open on single click
    await waitFor(() => {
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    });

    // Verify row is selected though
    expect(firstDataRow).toHaveAttribute("data-selected", "true");

    // Double-click the row
    await user.dblClick(productNameCell);

    // Verify panel opens on double-click
    const panel = await screen.findByRole("complementary");
    expect(panel).toBeInTheDocument();
    expect(within(panel).getByText("Amoxicillin 500mg")).toBeInTheDocument();
  });
});
