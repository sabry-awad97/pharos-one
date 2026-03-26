import { screen, within, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the router hooks
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: (path: string) => (options: { component: any }) => ({
    ...options,
    path,
  }),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  useNavigate: () => mockNavigate,
  useMatches: () => [],
}));

// Import after mocking
const { Route } = await import("../routes/_app/home/route");
const HomeComponent = (Route as any).component as () => React.JSX.Element;

describe("Sidebar Parent Item Click Behavior", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("should not navigate when clicking parent item with sub-items", async () => {
    renderWithProviders(<HomeComponent />);

    const sidebar = screen.getByTestId("sidebar");

    // Find the Inventory parent item (has sub-items)
    const inventoryItem = within(sidebar).getByText("Inventory");
    const inventoryButton = inventoryItem.closest(
      "button",
    ) as HTMLButtonElement;

    // Click the parent item
    fireEvent.click(inventoryButton);

    // Wait a moment to ensure no navigation occurs
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    // Verify the sub-items are now visible (expansion happened)
    await waitFor(() => {
      expect(within(sidebar).getByText("All Products")).toBeInTheDocument();
    });
  });
});

it("should navigate when clicking leaf item without sub-items", async () => {
  renderWithProviders(<HomeComponent />);

  const sidebar = screen.getByTestId("sidebar");

  // Find the Customers item (no sub-items, it's a leaf)
  const customersItem = within(sidebar).getByText("Customers");
  const customersButton = customersItem.closest("button") as HTMLButtonElement;

  // Click the leaf item
  fireEvent.click(customersButton);

  // Verify navigation was called
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "/home/customers",
      }),
    );
  });
});
