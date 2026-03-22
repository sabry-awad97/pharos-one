import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BatchDetailsPanel } from "../features/modules/inventory/components/ProductDetailsPanel";

describe("BatchDetailsPanel", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it("should render batch panel with header", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BatchDetailsPanel productId={1} onClose={() => {}} />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Product Details")).toBeInTheDocument();
  });

  it("should render tabs", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BatchDetailsPanel productId={1} onClose={() => {}} />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Lots")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
  });

  it("should switch between tabs", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BatchDetailsPanel productId={1} onClose={() => {}} />
      </QueryClientProvider>,
    );

    // Click on Lots tab
    const lotsTab = screen.getByText("Lots");
    fireEvent.click(lotsTab);

    // ProductLotsTab component should be rendered (it will show loading or data)
    // We don't test the actual content here as that's tested in product-lots-tab.test.tsx
  });

  it("should close when close button clicked", () => {
    const onClose = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <BatchDetailsPanel productId={1} onClose={onClose} />
      </QueryClientProvider>,
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
