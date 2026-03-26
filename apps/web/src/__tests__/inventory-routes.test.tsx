import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "@/test-utils";

// Mock the action registry
vi.mock("../features/modules/inventory/config/inventory-actions", () => ({
  inventoryActions: [
    {
      id: "edit-product",
      label: "Edit Product",
      group: "edit",
      shortcut: "⌘E",
      isVisible: () => true,
      handler: vi.fn((row: unknown) => console.log("Edit Product:", row)),
    },
    {
      id: "view-batches",
      label: "View Batches",
      group: "view",
      shortcut: "⌘B",
      isVisible: () => true,
      handler: vi.fn((row: unknown) => console.log("View Batches:", row)),
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
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

// Mock the router hooks
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: (path: string) => (options: { component: any }) => ({
    ...options,
    path,
  }),
}));

describe("Inventory Sub-Routes", () => {
  it("should render inventory-all route", async () => {
    const { Route } = await import("../routes/_app/home/inventory/all");
    const RouteComponent = (Route as any).component as () => React.JSX.Element;

    renderWithProviders(<RouteComponent />);

    // Verify WorkspaceContainer is rendered (it has a specific structure)
    const container = screen.getByTestId("workspace-container");
    expect(container).toBeInTheDocument();
  });

  it("should render inventory-low-stock route", async () => {
    const { Route } = await import("../routes/_app/home/inventory/low-stock");
    const RouteComponent = (Route as any).component as () => React.JSX.Element;

    renderWithProviders(<RouteComponent />);

    const container = screen.getByTestId("workspace-container");
    expect(container).toBeInTheDocument();
  });

  it("should render inventory-expiring route", async () => {
    const { Route } = await import("../routes/_app/home/inventory/expiring");
    const RouteComponent = (Route as any).component as () => React.JSX.Element;

    renderWithProviders(<RouteComponent />);

    const container = screen.getByTestId("workspace-container");
    expect(container).toBeInTheDocument();
  });

  it("should render inventory-categories route", async () => {
    const { Route } = await import("../routes/_app/home/inventory/categories");
    const RouteComponent = (Route as any).component as () => React.JSX.Element;

    renderWithProviders(<RouteComponent />);

    const container = screen.getByTestId("workspace-container");
    expect(container).toBeInTheDocument();
  });
});
