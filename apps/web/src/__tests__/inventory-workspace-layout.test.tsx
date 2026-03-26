/**
 * InventoryWorkspace Layout Tests
 * Tests for horizontal layout when product detail panel is open
 */

import { screen, within, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "@/test-utils";
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
    ],
    isLoading: false,
    error: null,
  }),
  useProduct: (id: number) => ({
    data: {
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

describe("InventoryWorkspace - Horizontal Layout", () => {
  const renderComponent = () => {
    return renderWithProviders(<InventoryWorkspace />);
  };

  it("should use vertical layout (flex-col) when panel is closed", () => {
    const { container } = renderComponent();

    // Find the main workspace container
    const workspace = container.querySelector('[class*="flex"]');

    expect(workspace?.className).toContain("flex-col");
    expect(workspace?.className).not.toContain("flex-row");
  });

  it("should switch to horizontal layout (flex-row) when panel opens", async () => {
    const user = userEvent.setup();
    const { container } = renderComponent();

    // Open context menu and trigger batch details action
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header

    // Right-click to open context menu
    await user.pointer({ keys: "[MouseRight>]", target: firstDataRow });

    // Click "Batch Details" action using role="option" (CommandItem)
    const batchDetailsAction = screen.getByRole("option", {
      name: /batch details/i,
    });
    await user.click(batchDetailsAction);

    // Wait for panel to appear and layout to change
    await waitFor(() => {
      const workspace = container.querySelector('[class*="flex"]');
      expect(workspace?.className).toContain("flex-row");
    });
  });

  it("should render panel with fixed width when open", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Open panel
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    await user.pointer({ keys: "[MouseRight>]", target: firstDataRow });
    const batchDetailsAction = screen.getByRole("option", {
      name: /batch details/i,
    });
    await user.click(batchDetailsAction);

    // Wait for panel to appear
    const panel = await screen.findByRole("complementary");

    expect(panel).toBeInTheDocument();
    expect(panel.className).toContain("w-[360px]");
    expect(panel.className).toContain("flex-none");
  });

  it("should render table container with flex-1 when panel is open", async () => {
    const user = userEvent.setup();
    const { container } = renderComponent();

    // Open panel
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    await user.pointer({ keys: "[MouseRight>]", target: firstDataRow });
    const batchDetailsAction = screen.getByRole("option", {
      name: /batch details/i,
    });
    await user.click(batchDetailsAction);

    // Wait for panel to appear
    await screen.findByRole("complementary");

    // Find the table container (parent of module header)
    const tableContainer = container.querySelector(
      '[class*="flex-1"][class*="min-h-0"]',
    );

    expect(tableContainer).toBeInTheDocument();
    expect(tableContainer?.className).toContain("flex-1");
  });

  it("should close panel and restore vertical layout when close button clicked", async () => {
    const user = userEvent.setup();
    const { container } = renderComponent();

    // Open panel
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    await user.pointer({ keys: "[MouseRight>]", target: firstDataRow });
    const batchDetailsAction = screen.getByRole("option", {
      name: /batch details/i,
    });
    await user.click(batchDetailsAction);

    // Wait for panel to appear
    await screen.findByRole("complementary");

    // Click close button
    const closeButton = screen.getByLabelText(/close/i);
    await user.click(closeButton);

    // Verify panel is closed
    await waitFor(() => {
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    });

    // Verify layout is back to vertical
    const workspace = container.querySelector('[class*="flex"]');
    expect(workspace?.className).toContain("flex-col");
  });

  it("should display panel inline on right side (not as overlay)", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Open panel
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    await user.pointer({ keys: "[MouseRight>]", target: firstDataRow });
    const batchDetailsAction = screen.getByRole("option", {
      name: /batch details/i,
    });
    await user.click(batchDetailsAction);

    // Wait for panel to appear
    const panel = await screen.findByRole("complementary");

    // Panel should not have overlay positioning (fixed, absolute)
    const computedStyle = window.getComputedStyle(panel);
    expect(computedStyle.position).not.toBe("fixed");
    expect(computedStyle.position).not.toBe("absolute");

    // Panel should be inline (static or relative)
    expect(["static", "relative", ""]).toContain(computedStyle.position);
  });

  it("should maintain table functionality when panel is open", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Open panel
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    await user.pointer({ keys: "[MouseRight>]", target: firstDataRow });
    const batchDetailsAction = screen.getByRole("option", {
      name: /batch details/i,
    });
    await user.click(batchDetailsAction);

    // Wait for panel to appear
    await screen.findByRole("complementary");

    // Close context menu first
    await user.keyboard("{Escape}");

    // Wait for context menu to close
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    // Verify table is still visible and functional
    expect(table).toBeVisible();

    // Verify we can still select rows by clicking
    await user.click(firstDataRow);
    expect(firstDataRow).toHaveAttribute("data-selected", "true");
  });

  it("should show product name in panel header", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Open panel
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    await user.pointer({ keys: "[MouseRight>]", target: firstDataRow });
    const batchDetailsAction = screen.getByRole("option", {
      name: /batch details/i,
    });
    await user.click(batchDetailsAction);

    // Wait for panel to appear
    const panel = await screen.findByRole("complementary");
    expect(within(panel).getByText("Amoxicillin 500mg")).toBeInTheDocument();
  });
});
