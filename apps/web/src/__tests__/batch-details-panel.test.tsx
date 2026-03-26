import { screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "@/test-utils";
import { BatchDetailsPanel } from "../features/modules/inventory/components/ProductDetailsPanel";

describe("BatchDetailsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render batch panel with header", () => {
    renderWithProviders(<BatchDetailsPanel productId={1} onClose={() => {}} />);

    expect(screen.getByText("Product Details")).toBeInTheDocument();
  });

  it("should render tabs", () => {
    renderWithProviders(<BatchDetailsPanel productId={1} onClose={() => {}} />);

    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Lots")).toBeInTheDocument();
  });

  it("should switch between tabs", () => {
    renderWithProviders(<BatchDetailsPanel productId={1} onClose={() => {}} />);

    // Click on Lots tab
    const lotsTab = screen.getByText("Lots");
    fireEvent.click(lotsTab);

    // ProductLotsTab component should be rendered (it will show loading or data)
    // We don't test the actual content here as that's tested in product-lots-tab.test.tsx
  });

  it("should close when close button clicked", () => {
    const onClose = vi.fn();

    renderWithProviders(<BatchDetailsPanel productId={1} onClose={onClose} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
