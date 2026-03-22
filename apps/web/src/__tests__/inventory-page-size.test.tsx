import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { InventoryWorkspace } from "../features/modules/inventory/InventoryWorkspace";

// Mock products data - 55 items to test different page sizes
const mockProducts = Array.from({ length: 55 }, (_, i) => ({
  id: i + 1,
  name: `Test Product ${i + 1}`,
  sku: `TEST-${String(i + 1).padStart(3, "0")}`,
  availableQuantity: 100 - i,
  reorderLevel: 20,
  nearestExpiry: "2026-12-31",
  basePrice: 99.99 + i,
  category: { id: `cat${i + 1}`, name: `Category ${i + 1}` },
  defaultSupplier: { id: `sup${i + 1}`, name: `Supplier ${i + 1}` },
  stockStatus: "ok" as const,
}));

// Mock the hooks
vi.mock("../features/modules/inventory/hooks/use-products", () => ({
  useProducts: () => ({
    data: mockProducts,
    isLoading: false,
    error: null,
  }),
}));

describe("InventoryWorkspace - Page Size Selector", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const renderComponent = () => {
    const user = userEvent.setup();
    const result = render(
      <QueryClientProvider client={queryClient}>
        <InventoryWorkspace />
      </QueryClientProvider>,
    );
    return { ...result, user };
  };

  it("should display page size selector on the left side of pagination", () => {
    renderComponent();

    // Look for "Items per page:" label
    expect(screen.getByText(/items per page/i)).toBeInTheDocument();

    // Look for the select trigger button
    const selectTrigger = screen.getByRole("combobox");
    expect(selectTrigger).toBeInTheDocument();
  });

  it("should show page size options: 10, 25, 50, 100", async () => {
    const { user } = renderComponent();

    // Click the select trigger to open dropdown
    const selectTrigger = screen.getByRole("combobox");
    await user.click(selectTrigger);

    // Wait for options to appear
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /10.*page/i }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("option", { name: /25.*page/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /50.*page/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /100.*page/i }),
    ).toBeInTheDocument();
  });

  it("should change page size when option selected and reset to page 1", async () => {
    const { user } = renderComponent();

    // Initially on page 1 with 10 items per page (6 pages total for 55 items)
    expect(screen.getByRole("button", { name: "1" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    // Navigate to page 2
    await user.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    // Change page size to 25
    const selectTrigger = screen.getByRole("combobox");
    await user.click(selectTrigger);

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /25.*page/i }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("option", { name: /25.*page/i }));

    // Should reset to page 1
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "1" })).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    // With 55 items and 25 per page, should have 3 pages
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "4" })).not.toBeInTheDocument();
  });

  it("should display items count text on the right side", () => {
    renderComponent();

    // Should show "Showing 1-10 of 55 items" (or similar format)
    expect(screen.getByText(/showing.*1.*10.*55.*items/i)).toBeInTheDocument();
  });

  it("should persist page size preference to localStorage", async () => {
    const { user } = renderComponent();

    // Change page size to 50
    const selectTrigger = screen.getByRole("combobox");
    await user.click(selectTrigger);

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /50.*page/i }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("option", { name: /50.*page/i }));

    // Check localStorage
    await waitFor(() => {
      expect(localStorage.getItem("inventory-page-size")).toBe("50");
    });
  });

  it("should load page size from localStorage on mount", () => {
    // Set localStorage before rendering
    localStorage.setItem("inventory-page-size", "25");

    renderComponent();

    // With 55 items and 25 per page, should have 3 pages
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "4" })).not.toBeInTheDocument();
  });

  it("should update items display when page changes", async () => {
    const { user } = renderComponent();

    // Initially showing 1-10 of 55
    expect(screen.getByText(/showing.*1.*10.*55/i)).toBeInTheDocument();

    // Navigate to page 2
    await user.click(screen.getByRole("button", { name: "2" }));

    // Should now show 11-20 of 55
    await waitFor(() => {
      expect(screen.getByText(/showing.*11.*20.*55/i)).toBeInTheDocument();
    });
  });

  it("should handle edge case: 0 items", () => {
    // Override mock to return empty array
    vi.mock("../features/modules/inventory/hooks/use-products", () => ({
      useProducts: () => ({
        data: [],
        isLoading: false,
        error: null,
      }),
    }));

    renderComponent();

    // Should show "No items"
    expect(screen.getByText(/no items/i)).toBeInTheDocument();
  });
});
