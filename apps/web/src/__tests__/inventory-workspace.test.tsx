import { screen, within, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "@/test-utils";
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return renderWithProviders(<InventoryWorkspace />);
  };

  it("should use inset box-shadow instead of outline for focused rows", () => {
    renderComponent();

    // Find the first row and click it
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header row

    // Click the row to select and focus it
    fireEvent.click(firstDataRow);

    // Verify the row has data-focused attribute
    expect(firstDataRow).toHaveAttribute("data-focused", "true");

    // Verify the row uses box-shadow inset with CSS variable
    const styleAttr = firstDataRow.getAttribute("style");
    expect(styleAttr).toContain("box-shadow");
    expect(styleAttr).toContain("inset");
  });

  it("should maintain consistent selection styling for all row positions", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");

    // Select first, middle, and last rows using Ctrl+Click
    const firstDataRow = rows[1];
    const middleDataRow = rows[2];
    const lastDataRow = rows[3];

    // Click first row normally
    fireEvent.click(firstDataRow);

    // Ctrl+Click to add middle and last rows to selection
    fireEvent.click(middleDataRow, { ctrlKey: true });
    fireEvent.click(lastDataRow, { ctrlKey: true });

    // Verify all rows have data-selected attribute
    expect(firstDataRow).toHaveAttribute("data-selected", "true");
    expect(middleDataRow).toHaveAttribute("data-selected", "true");
    expect(lastDataRow).toHaveAttribute("data-selected", "true");

    // Verify all have selection background using CSS variables in style attribute
    const firstStyleAttr = firstDataRow.getAttribute("style");
    const middleStyleAttr = middleDataRow.getAttribute("style");
    const lastStyleAttr = lastDataRow.getAttribute("style");

    expect(firstStyleAttr).toContain("background");
    expect(middleStyleAttr).toContain("background");
    expect(lastStyleAttr).toContain("background");
  });

  it("should maintain hover states with focused row styling", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];

    // Click the row to focus it
    fireEvent.click(firstDataRow);

    // Verify focused row has data-focused attribute
    expect(firstDataRow).toHaveAttribute("data-focused", "true");

    // Verify focused row has background style attribute
    const styleAttr = firstDataRow.getAttribute("style");
    expect(styleAttr).toContain("background");

    // Verify box-shadow for focus
    expect(styleAttr).toContain("box-shadow");
    expect(styleAttr).toContain("inset");
  });

  it("should show consistent styling for adjacent selected rows without gaps", () => {
    renderComponent();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");

    // Select two adjacent rows using Shift+Click
    const firstDataRow = rows[1];
    const secondDataRow = rows[2];

    // Click first row
    fireEvent.click(firstDataRow);

    // Shift+Click second row to select range
    fireEvent.click(secondDataRow, { shiftKey: true });

    // Verify both rows have data-selected attribute
    expect(firstDataRow).toHaveAttribute("data-selected", "true");
    expect(secondDataRow).toHaveAttribute("data-selected", "true");

    // Verify both have selection background in style attribute
    const firstStyleAttr = firstDataRow.getAttribute("style");
    const secondStyleAttr = secondDataRow.getAttribute("style");

    expect(firstStyleAttr).toContain("background");
    expect(secondStyleAttr).toContain("background");
  });
});
