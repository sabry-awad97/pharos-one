import { screen, within, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "@/test-utils";
import { InventoryWorkspace } from "../features/modules/inventory/InventoryWorkspace";

// Mock the hooks
vi.mock("../features/modules/inventory/hooks/use-products", () => ({
  useProducts: () => ({
    data: [
      {
        id: 1,
        name: "Product A",
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

vi.mock("../features/modules/inventory/hooks/use-transactions", () => ({
  useTransactions: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

describe("Stock Movements Action", () => {
  const renderComponent = () => {
    return renderWithProviders(<InventoryWorkspace />);
  };

  it("should show View Stock Movements action in context menu", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    fireEvent.contextMenu(firstDataRow);

    expect(screen.getByText("View Stock Movements")).toBeInTheDocument();
  });

  it("should have TrendingUp icon for View Stock Movements action", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    fireEvent.contextMenu(firstDataRow);

    const actionItem = screen.getByText("View Stock Movements").closest("div");
    expect(actionItem).toBeInTheDocument();
    // Icon is rendered as SVG with lucide-trending-up class
    const icon = actionItem?.querySelector("svg.lucide-trending-up");
    expect(icon).toBeInTheDocument();
  });

  it("should open StockMovementsPanel when action is clicked", async () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    fireEvent.contextMenu(firstDataRow);

    const action = screen.getByText("View Stock Movements");
    fireEvent.click(action);

    // Wait for panel to appear after menu closes
    await waitFor(() => {
      const panel = screen.getByRole("complementary");
      expect(panel).toBeInTheDocument();
    });

    // Panel should show product name in the panel (not the table)
    const panel = screen.getByRole("complementary");
    expect(within(panel).getByText("Product A")).toBeInTheDocument();
  });

  it("should close StockMovementsPanel when close button is clicked", async () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    fireEvent.contextMenu(firstDataRow);

    const action = screen.getByText("View Stock Movements");
    fireEvent.click(action);

    // Wait for panel to appear
    await waitFor(() => {
      const panel = screen.getByRole("complementary");
      expect(panel).toBeInTheDocument();
    });

    // Close the panel by clicking the close button (X)
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    // Panel should be closed
    await waitFor(() => {
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    });
  });
});
