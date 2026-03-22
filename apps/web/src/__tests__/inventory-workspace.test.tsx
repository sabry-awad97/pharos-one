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
        name: "Test Product 2",
        sku: "TEST-002",
        availableQuantity: 5,
        reorderLevel: 20,
        nearestExpiry: "2026-06-30",
        basePrice: 49.99,
        category: { id: "cat2", name: "Category 2" },
        defaultSupplier: { id: "sup2", name: "Supplier 2" },
        stockStatus: "low" as const,
      },
      {
        id: "3",
        name: "Test Product 3",
        sku: "TEST-003",
        availableQuantity: 50,
        reorderLevel: 10,
        nearestExpiry: "2027-01-15",
        basePrice: 149.99,
        category: { id: "cat3", name: "Category 3" },
        defaultSupplier: null,
        stockStatus: "ok" as const,
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

describe("InventoryWorkspace - Row Selection Styling", () => {
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

  it("should use inset box-shadow instead of outline for selected rows", () => {
    renderComponent();

    // Find the first row checkbox and click it
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header row

    const checkbox = within(firstDataRow).getByRole("checkbox");
    fireEvent.click(checkbox);

    // Verify the row uses box-shadow inset with CSS variable
    const computedStyle = window.getComputedStyle(firstDataRow);
    expect(computedStyle.boxShadow).toContain("inset");
    // Check for hsl format (CSS variable usage)
    expect(computedStyle.boxShadow).toMatch(/hsl\(|oklch\(/);
  });

  it("should maintain consistent selection styling for all row positions", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");

    // Select first, middle, and last rows
    const firstDataRow = rows[1];
    const middleDataRow = rows[2];
    const lastDataRow = rows[3];

    // Click all checkboxes
    fireEvent.click(within(firstDataRow).getByRole("checkbox"));
    fireEvent.click(within(middleDataRow).getByRole("checkbox"));
    fireEvent.click(within(lastDataRow).getByRole("checkbox"));

    // Verify all rows have consistent box-shadow styling
    const firstStyle = window.getComputedStyle(firstDataRow);
    const middleStyle = window.getComputedStyle(middleDataRow);
    const lastStyle = window.getComputedStyle(lastDataRow);

    expect(firstStyle.boxShadow).toContain("inset");
    expect(middleStyle.boxShadow).toContain("inset");
    expect(lastStyle.boxShadow).toContain("inset");

    // All should have the same box-shadow value
    expect(firstStyle.boxShadow).toBe(middleStyle.boxShadow);
    expect(middleStyle.boxShadow).toBe(lastStyle.boxShadow);
  });

  it("should maintain hover states with inset box-shadow selection", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    // Select the row
    fireEvent.click(within(firstDataRow).getByRole("checkbox"));

    // Verify selected row has background style attribute with CSS variable
    const styleAttr = firstDataRow.getAttribute("style");
    expect(styleAttr).toContain("background");
    expect(styleAttr).toContain("hsl(var(--primary)");

    // Verify box-shadow
    const style = window.getComputedStyle(firstDataRow);
    expect(style.boxShadow).toContain("inset");

    // Simulate hover
    fireEvent.mouseEnter(firstDataRow);

    // Verify hover maintains selection background
    const styleAttrAfterHover = firstDataRow.getAttribute("style");
    expect(styleAttrAfterHover).toContain("background");
    expect(styleAttrAfterHover).toContain("hsl(var(--primary)");
  });

  it("should show consistent styling for adjacent selected rows without gaps", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");

    // Select two adjacent rows
    const firstDataRow = rows[1];
    const secondDataRow = rows[2];

    fireEvent.click(within(firstDataRow).getByRole("checkbox"));
    fireEvent.click(within(secondDataRow).getByRole("checkbox"));

    // Verify both rows have the same box-shadow
    const firstStyle = window.getComputedStyle(firstDataRow);
    const secondStyle = window.getComputedStyle(secondDataRow);

    expect(firstStyle.boxShadow).toContain("inset");
    expect(secondStyle.boxShadow).toContain("inset");
    expect(firstStyle.boxShadow).toBe(secondStyle.boxShadow);

    // Verify both have selection background using CSS variables in style attribute
    const firstStyleAttr = firstDataRow.getAttribute("style");
    const secondStyleAttr = secondDataRow.getAttribute("style");

    expect(firstStyleAttr).toContain("hsl(var(--primary)");
    expect(secondStyleAttr).toContain("hsl(var(--primary)");
  });
});
