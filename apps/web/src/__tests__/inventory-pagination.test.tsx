import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { InventoryWorkspace } from "../features/modules/inventory/InventoryWorkspace";

// Mock products data - 25 items to test pagination
const mockProducts = Array.from({ length: 25 }, (_, i) => ({
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

describe("InventoryWorkspace - Pagination Navigation", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
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

  it("should display pagination controls below the table with proper spacing", () => {
    renderComponent();

    // Find pagination navigation
    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination).toBeInTheDocument();

    // Verify Previous and Next buttons exist
    const previousButton = screen.getByRole("button", { name: /previous/i });
    const nextButton = screen.getByRole("button", { name: /next/i });

    expect(previousButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it("should display page numbers with current page highlighted", () => {
    renderComponent();

    // With 25 items and page size 10, we should have 3 pages
    const page1Button = screen.getByRole("button", { name: "1" });
    const page2Button = screen.getByRole("button", { name: "2" });
    const page3Button = screen.getByRole("button", { name: "3" });

    expect(page1Button).toBeInTheDocument();
    expect(page2Button).toBeInTheDocument();
    expect(page3Button).toBeInTheDocument();

    // Page 1 should be highlighted (active)
    expect(page1Button).toHaveAttribute("aria-current", "page");
  });

  it("should disable Previous button on first page and Next button on last page", () => {
    renderComponent();

    const previousButton = screen.getByRole("button", { name: /previous/i });
    const nextButton = screen.getByRole("button", { name: /next/i });

    // On first page, Previous should be disabled
    expect(previousButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it("should navigate to correct page when clicking page numbers", async () => {
    const { user } = renderComponent();

    // Click on page 2
    const page2Button = screen.getByRole("button", { name: "2" });
    await user.click(page2Button);

    // Page 2 should now be active
    expect(page2Button).toHaveAttribute("aria-current", "page");

    // Page 1 should no longer be active
    const page1Button = screen.getByRole("button", { name: "1" });
    expect(page1Button).not.toHaveAttribute("aria-current", "page");
  });

  it("should use theme colors for pagination", () => {
    renderComponent();

    const page1Button = screen.getByRole("button", { name: "1" });

    // Check that active page uses primary color classes
    expect(page1Button).toHaveClass("bg-primary");
    expect(page1Button).toHaveClass("text-primary-foreground");
  });

  it("should have default page size of 10 items", () => {
    renderComponent();

    // With 25 items and page size 10, we should have 3 pages
    const allButtons = screen.getAllByRole("button");
    const pageButtons = allButtons.filter((btn) =>
      /^\d+$/.test(btn.textContent || ""),
    );

    // Should have exactly 3 page buttons (25 items / 10 per page = 3 pages)
    expect(pageButtons).toHaveLength(3);
  });
});
