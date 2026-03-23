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

    // Should find inline panel container by its distinctive classes
    const panel = document.querySelector(
      ".flex.flex-col.h-full.bg-card.border-l.border-border",
    );
    expect(panel).toBeInTheDocument();
  });

  it("renders header with consistent styling", () => {
    renderPanel({ productName: "Amoxicillin 500mg" });

    // Check title styling
    const title = screen.getByText("Stock Movements");
    expect(title).toHaveClass(
      "text-[10px]",
      "font-semibold",
      "text-muted-foreground",
      "uppercase",
      "tracking-wider",
      "mb-1",
    );

    // Check product name styling
    const productName = screen.getByText("Amoxicillin 500mg");
    expect(productName).toHaveClass(
      "text-sm",
      "font-normal",
      "text-foreground",
      "truncate",
    );
  });

  it("renders close button with consistent styling", () => {
    const onClose = vi.fn();
    renderPanel({ onClose });

    const closeButton = screen.getByRole("button", { name: /close/i });
    expect(closeButton).toHaveClass(
      "ml-3",
      "w-8",
      "h-8",
      "flex",
      "items-center",
      "justify-center",
      "rounded-md",
      "hover:bg-muted/50",
      "text-muted-foreground",
      "hover:text-foreground",
      "transition-colors",
    );
  });

  it("renders content area with flex-1 min-h-0 overflow-auto", () => {
    renderPanel();

    // Content area should have proper scrolling classes
    const contentArea = document.querySelector(
      ".flex-1.min-h-0.overflow-auto.px-4.custom-scrollbar",
    );
    expect(contentArea).toBeInTheDocument();
  });
});
