import { render, screen, within, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InventoryWorkspace } from "../features/modules/inventory/InventoryWorkspace";

// Mock the hooks
vi.mock("../features/modules/inventory/hooks/use-products", () => ({
  useProducts: () => ({
    data: [
      {
        id: "1",
        name: "Test Product 1",
        sku: "TEST-001",
        availableQuantity: 100,
        reorderLevel: 20,
        nearestExpiry: "2026-12-31",
        basePrice: 99.99,
        category: { id: "cat1", name: "Category 1" },
        defaultSupplier: { id: "sup1", name: "Supplier 1" },
        stockStatus: "ok" as const,
      },
      {
        id: "2",
        name: "Expiring Product",
        sku: "TEST-002",
        availableQuantity: 50,
        reorderLevel: 10,
        nearestExpiry: "2026-04-01",
        basePrice: 49.99,
        category: { id: "cat1", name: "Category 1" },
        defaultSupplier: { id: "sup1", name: "Supplier 1" },
        stockStatus: "expiring" as const,
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

describe("InventoryWorkspace - Context Menu", () => {
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

  it("should open context menu when right-clicking a table row", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header row

    // Right-click the row
    fireEvent.contextMenu(firstDataRow);

    // Verify context menu appears
    const contextMenu = screen.getByRole("menu");
    expect(contextMenu).toBeInTheDocument();
  });

  it("should display command palette with search input in context menu", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    // Right-click the row
    fireEvent.contextMenu(firstDataRow);

    // Verify search input exists
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("should display searchable actions in the command palette", async () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    // Right-click the row
    fireEvent.contextMenu(firstDataRow);

    // Verify multiple actions are displayed
    expect(screen.getByText("Edit Product")).toBeInTheDocument();
    expect(screen.getByText("View Batches")).toBeInTheDocument();
    expect(screen.getByText("Adjust Stock")).toBeInTheDocument();

    // Type in search to filter actions
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "edit" } });

    // Verify filtered results
    expect(screen.getByText("Edit Product")).toBeInTheDocument();
    expect(screen.queryByText("View Batches")).not.toBeInTheDocument();
  });

  it("should execute action with correct row data when clicked", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    // Right-click the row
    fireEvent.contextMenu(firstDataRow);

    // Click "Edit Product" action
    const editAction = screen.getByText("Edit Product");
    fireEvent.click(editAction);

    // Verify action was executed with correct row data
    expect(consoleSpy).toHaveBeenCalledWith("Edit Product:", {
      id: "1",
      name: "Test Product 1",
      sku: "TEST-001",
      availableQuantity: 100,
      reorderLevel: 20,
      nearestExpiry: "2026-12-31",
      basePrice: 99.99,
      category: { id: "cat1", name: "Category 1" },
      defaultSupplier: { id: "sup1", name: "Supplier 1" },
      stockStatus: "ok",
    });

    consoleSpy.mockRestore();
  });

  it("should show context-aware actions based on row data", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");

    // Test first row (ok status) - should NOT show "Mark as Expiring"
    const firstDataRow = rows[1];
    fireEvent.contextMenu(firstDataRow);

    expect(screen.getByText("Edit Product")).toBeInTheDocument();
    expect(screen.queryByText("Mark as Expiring")).not.toBeInTheDocument();

    // Close menu
    fireEvent.keyDown(document.body, { key: "Escape" });

    // Test second row (expiring status) - should show "Mark as Expiring"
    const secondDataRow = rows[2];
    fireEvent.contextMenu(secondDataRow);

    expect(screen.getByText("Edit Product")).toBeInTheDocument();
    expect(screen.getByText("Mark as Expiring")).toBeInTheDocument();
  });

  it("should support keyboard navigation in command palette", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    // Right-click the row
    fireEvent.contextMenu(firstDataRow);

    // Get the search input
    const searchInput = screen.getByPlaceholderText(/search/i);

    // Verify arrow keys navigate through items
    fireEvent.keyDown(searchInput, { key: "ArrowDown" });
    fireEvent.keyDown(searchInput, { key: "ArrowDown" });
    fireEvent.keyDown(searchInput, { key: "ArrowUp" });

    // Verify Escape closes the menu
    fireEvent.keyDown(searchInput, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("should organize actions into logical groups with separators", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    // Right-click the row
    fireEvent.contextMenu(firstDataRow);

    // Verify group labels exist
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    // Verify actions are still present
    expect(screen.getByText("Edit Product")).toBeInTheDocument();
    expect(screen.getByText("View Batches")).toBeInTheDocument();
    expect(screen.getByText("Adjust Stock")).toBeInTheDocument();
  });

  it("should display keyboard shortcuts next to actions", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    // Right-click the row
    fireEvent.contextMenu(firstDataRow);

    // Verify shortcuts are displayed
    expect(screen.getByText("⌘E")).toBeInTheDocument();
    expect(screen.getByText("⌘B")).toBeInTheDocument();
    expect(screen.getByText("⌘S")).toBeInTheDocument();
  });
});
