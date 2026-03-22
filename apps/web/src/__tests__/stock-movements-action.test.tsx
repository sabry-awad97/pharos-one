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
  useStockTransactions: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

describe("Stock Movements Action", () => {
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

  it("should open StockMovementsPanel when action is clicked", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    fireEvent.contextMenu(firstDataRow);

    const action = screen.getByText("View Stock Movements");
    fireEvent.click(action);

    // Panel should be visible with the description text
    expect(screen.getByText("Stock transaction history")).toBeInTheDocument();
    // Panel title should show product name
    expect(
      screen.getByRole("heading", { name: "Product A" }),
    ).toBeInTheDocument();
  });

  it("should close StockMovementsPanel when close button is clicked", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    fireEvent.contextMenu(firstDataRow);

    const action = screen.getByText("View Stock Movements");
    fireEvent.click(action);

    // Panel should be visible
    expect(screen.getByText("Stock transaction history")).toBeInTheDocument();

    // Close the panel by clicking the close button (X)
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    // Panel should be closed
    expect(
      screen.queryByText("Stock transaction history"),
    ).not.toBeInTheDocument();
  });
});
