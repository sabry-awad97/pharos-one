/**
 * InventoryWorkspace Layout Tests
 * Tests for horizontal layout when product detail panel is open
 */

import { render, screen, within, fireEvent } from "@testing-library/react";
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
      },
    ],
    isLoading: false,
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

describe("InventoryWorkspace - Horizontal Layout", () => {
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

  it("should use vertical layout (flex-col) when panel is closed", () => {
    renderComponent();

    // Find the main workspace container
    const workspace =
      screen.getByRole("main", { hidden: true }) ||
      document.querySelector('[class*="flex"]');

    expect(workspace?.className).toContain("flex-col");
    expect(workspace?.className).not.toContain("flex-row");
  });

  it("should switch to horizontal layout (flex-row) when panel opens", () => {
    const { container } = renderComponent();

    // Open context menu and trigger batch details action
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header

    // Right-click to open context menu
    fireEvent.contextMenu(firstDataRow);

    // Click "Batch Details" action
    const batchDetailsAction = screen.getByText(/batch details/i);
    fireEvent.click(batchDetailsAction);

    // Find the workspace container
    const workspace = container.querySelector('[class*="flex"]');

    expect(workspace?.className).toContain("flex-row");
    expect(workspace?.className).not.toContain("flex-col");
  });

  it("should render panel with fixed width when open", () => {
    renderComponent();

    // Open panel
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    fireEvent.contextMenu(firstDataRow);
    const batchDetailsAction = screen.getByText(/batch details/i);
    fireEvent.click(batchDetailsAction);

    // Find the panel aside element
    const panel = screen.getByRole("complementary");

    expect(panel).toBeInTheDocument();
    expect(panel.className).toContain("w-[360px]");
    expect(panel.className).toContain("flex-none");
  });

  it("should render table container with flex-1 when panel is open", () => {
    const { container } = renderComponent();

    // Open panel
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    fireEvent.contextMenu(firstDataRow);
    const batchDetailsAction = screen.getByText(/batch details/i);
    fireEvent.click(batchDetailsAction);

    // Find the table container (parent of module header)
    const tableContainer = container.querySelector(
      '[class*="flex-1"][class*="min-h-0"]',
    );

    expect(tableContainer).toBeInTheDocument();
    expect(tableContainer?.className).toContain("flex-1");
  });

  it("should close panel and restore vertical layout when close button clicked", () => {
    const { container } = renderComponent();

    // Open panel
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    fireEvent.contextMenu(firstDataRow);
    const batchDetailsAction = screen.getByText(/batch details/i);
    fireEvent.click(batchDetailsAction);

    // Verify panel is open
    expect(screen.getByRole("complementary")).toBeInTheDocument();

    // Click close button
    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);

    // Verify panel is closed
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();

    // Verify layout is back to vertical
    const workspace = container.querySelector('[class*="flex"]');
    expect(workspace?.className).toContain("flex-col");
  });

  it("should display panel inline on right side (not as overlay)", () => {
    renderComponent();

    // Open panel
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    fireEvent.contextMenu(firstDataRow);
    const batchDetailsAction = screen.getByText(/batch details/i);
    fireEvent.click(batchDetailsAction);

    // Find the panel
    const panel = screen.getByRole("complementary");

    // Panel should not have overlay positioning (fixed, absolute)
    const computedStyle = window.getComputedStyle(panel);
    expect(computedStyle.position).not.toBe("fixed");
    expect(computedStyle.position).not.toBe("absolute");

    // Panel should be inline (static or relative)
    expect(["static", "relative", ""]).toContain(computedStyle.position);
  });

  it("should maintain table functionality when panel is open", () => {
    renderComponent();

    // Open panel
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    fireEvent.contextMenu(firstDataRow);
    const batchDetailsAction = screen.getByText(/batch details/i);
    fireEvent.click(batchDetailsAction);

    // Verify table is still visible and functional
    expect(table).toBeVisible();

    // Verify we can still select rows
    const checkbox = within(firstDataRow).getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("should show product name in panel header", () => {
    renderComponent();

    // Open panel
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    fireEvent.contextMenu(firstDataRow);
    const batchDetailsAction = screen.getByText(/batch details/i);
    fireEvent.click(batchDetailsAction);

    // Verify product name is displayed in panel header
    const panel = screen.getByRole("complementary");
    expect(within(panel).getByText("Amoxicillin 500mg")).toBeInTheDocument();
  });
});
