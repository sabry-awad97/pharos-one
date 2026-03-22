/**
 * Stock Movements Panel - Inline Layout Tests
 * Tests for refactored inline panel architecture (not overlay)
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StockMovementsPanel } from "../features/modules/inventory/components/StockMovementsPanel";

// Mock hooks
vi.mock("../features/modules/inventory/hooks/use-transaction-filters", () => ({
  useTransactionFilters: () => ({
    filters: { types: [], dateFrom: null, dateTo: null },
    setFilters: vi.fn(),
    clearFilters: vi.fn(),
    applyFilters: vi.fn((transactions) => transactions),
  }),
}));

vi.mock("../features/modules/inventory/hooks/use-transactions", () => ({
  useStockTransactions: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function renderPanel(
  props: Partial<React.ComponentProps<typeof StockMovementsPanel>> = {},
) {
  return render(
    <QueryClientProvider client={queryClient}>
      <StockMovementsPanel
        productId={1}
        productName="Test Product"
        onClose={vi.fn()}
        {...props}
      />
    </QueryClientProvider>,
  );
}

describe("StockMovementsPanel - Inline Architecture", () => {
  it("renders as inline element, not Sheet portal", () => {
    renderPanel();

    // Should NOT find Sheet/Dialog portal elements
    const portals = document.querySelectorAll("[data-radix-portal]");
    expect(portals.length).toBe(0);

    // Should find inline panel container
    const panel = screen.getByRole("complementary");
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveClass(
      "flex",
      "flex-col",
      "h-full",
      "bg-card",
      "border-l",
      "border-border",
    );
  });

  it("renders header with consistent styling", () => {
    renderPanel({ productName: "Amoxicillin 500mg" });

    // Find header section - the parent div with border-b
    const panel = screen.getByRole("complementary");
    const header = panel.querySelector(
      ".flex-none.px-4.py-3.border-b.border-border",
    );
    expect(header).toBeInTheDocument();

    // Check title styling
    const title = screen.getByText("Amoxicillin 500mg");
    expect(title).toHaveClass("text-sm", "font-semibold", "text-foreground");

    // Check subtitle styling
    const subtitle = screen.getByText("Stock transaction history");
    expect(subtitle).toHaveClass("text-xs", "text-muted-foreground", "mt-0.5");
  });

  it("renders close button with consistent styling", () => {
    const onClose = vi.fn();
    renderPanel({ onClose });

    const closeButton = screen.getByRole("button", { name: /close/i });
    expect(closeButton).toHaveClass(
      "w-6",
      "h-6",
      "flex",
      "items-center",
      "justify-center",
      "rounded",
      "hover:bg-muted",
    );
  });

  it("renders content area with flex-1 min-h-0 overflow-auto", () => {
    renderPanel();

    // Content area should have proper scrolling classes
    const contentArea = document.querySelector(".flex-1.min-h-0.overflow-auto");
    expect(contentArea).toBeInTheDocument();
  });
});
