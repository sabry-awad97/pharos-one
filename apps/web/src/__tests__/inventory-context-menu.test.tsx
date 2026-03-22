import {
  render,
  screen,
  within,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InventoryWorkspace } from "../features/modules/inventory/InventoryWorkspace";

// Mock the action registry
vi.mock("../features/modules/inventory/hooks/use-inventory-actions", () => ({
  useInventoryActions: () => [
    {
      id: "edit-product",
      label: "Edit Product",
      group: "edit",
      shortcut: "⌘E",
      isVisible: () => true,
      handler: vi.fn((row: unknown) => console.log("Edit Product:", row)),
    },
    {
      id: "batch-details",
      label: "Batch Details",
      group: "view",
      shortcut: "⌘D",
      isVisible: (row: { batchCount: number }) => row.batchCount > 0,
      handler: vi.fn((row: unknown) => console.log("Batch Details:", row)),
    },
    {
      id: "view-stock-movements",
      label: "View Stock Movements",
      group: "view",
      shortcut: "⌘M",
      isVisible: () => true,
      handler: vi.fn((row: unknown) =>
        console.log("View Stock Movements:", row),
      ),
    },
    {
      id: "view-history",
      label: "View History",
      group: "view",
      shortcut: "⌘H",
      isVisible: () => true,
      handler: vi.fn((row: unknown) => console.log("View History:", row)),
    },
    {
      id: "adjust-stock",
      label: "Adjust Stock",
      group: "stock",
      shortcut: "⌘S",
      isVisible: () => true,
      handler: vi.fn((row: unknown) => console.log("Adjust Stock:", row)),
    },
    {
      id: "mark-expiring",
      label: "Mark as Expiring",
      group: "stock",
      isVisible: (row: { stockStatus: string }) =>
        row.stockStatus === "expiring",
      handler: vi.fn((row: unknown) => console.log("Mark as Expiring:", row)),
    },
  ],
  actionGroups: {
    edit: { id: "edit", label: "Edit", order: 1 },
    view: { id: "view", label: "View", order: 2 },
    stock: { id: "stock", label: "Actions", order: 3 },
  },
}));

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
        batchCount: 3,
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
        batchCount: 1,
      },
    ],
    isLoading: false,
    error: null,
  }),
  useProduct: (id: string) => ({
    data: {
      id,
      name: "Test Product",
      sku: "TEST-001",
      availableQuantity: 100,
      reorderLevel: 20,
      nearestExpiry: "2026-12-31",
      basePrice: 99.99,
      category: { id: "cat1", name: "Category 1" },
      defaultSupplier: { id: "sup1", name: "Supplier 1" },
      stockStatus: "ok" as const,
      batchCount: 3,
    },
    isLoading: false,
    isError: false,
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
    const firstDataRow = rows[1]; // Skip header row

    // Right-click the row
    fireEvent.contextMenu(firstDataRow);

    // Verify context menu appears
    const contextMenu = screen.getByRole("menu");
    expect(contextMenu).toBeInTheDocument();

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
    expect(screen.getByText("View Stock Movements")).toBeInTheDocument();
    expect(screen.getByText("Adjust Stock")).toBeInTheDocument();

    // Type in search to filter actions
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "edit" } });

    // Verify filtered results
    expect(screen.getByText("Edit Product")).toBeInTheDocument();
    expect(screen.queryByText("View Stock Movements")).not.toBeInTheDocument();
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
      batchCount: 3,
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

  it("should close context menu when pressing Escape key", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    // Right-click the row
    fireEvent.contextMenu(firstDataRow);

    // Verify menu is open
    const contextMenu = screen.getByRole("menu");
    expect(contextMenu).toBeInTheDocument();

    // Press Escape to close
    fireEvent.keyDown(document.body, { key: "Escape" });

    // Verify menu is closed
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
    expect(screen.getByText("View Stock Movements")).toBeInTheDocument();
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
    expect(screen.getByText("⌘M")).toBeInTheDocument();
    expect(screen.getByText("⌘S")).toBeInTheDocument();
  });

  it("should close context menu after clicking an action item", async () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    // Right-click the row to open context menu
    fireEvent.contextMenu(firstDataRow);

    // Verify context menu is open
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // Click an action item
    const editAction = screen.getByText("Edit Product");
    fireEvent.click(editAction);

    // Wait for context menu to close (animation may take time)
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("should close context menu after clicking Batch Details action", async () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    // Right-click the row to open context menu
    fireEvent.contextMenu(firstDataRow);

    // Verify context menu is open
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // Find and click "Batch Details" action using role
    const batchDetailsAction = screen.getByRole("option", {
      name: /batch details/i,
    });
    fireEvent.click(batchDetailsAction);

    // Wait for context menu to close
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});
