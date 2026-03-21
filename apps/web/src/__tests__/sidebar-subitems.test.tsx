import {
  render,
  screen,
  within,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import type { JSX } from "react";
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

describe("Sidebar Sub-Items Navigation", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("should navigate to nested route when clicking dashboard overview sub-item", async () => {
    render(<HomeComponent />);

    // Find the sidebar
    const sidebar = screen.getByTestId("sidebar");

    // Find the chevron button next to Dashboard
    const dashboardSection = within(sidebar)
      .getByText("Dashboard")
      .closest("div");
    const chevronButton = dashboardSection?.querySelector(
      'button[style*="position: absolute"]',
    ) as HTMLButtonElement;

    // Click chevron to expand Dashboard sub-items
    fireEvent.click(chevronButton);

    // Wait for sub-items to appear
    await waitFor(() => {
      expect(within(sidebar).getByText("Overview")).toBeInTheDocument();
    });

    // Click the Overview sub-item
    const overviewSubItem = within(sidebar).getByText("Overview");
    fireEvent.click(overviewSubItem);

    // Verify navigation to nested route
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "/home/dashboard/overview",
      }),
    );
  });

  it("should show only tree line (no left border) when sub-item is active", async () => {
    render(<HomeComponent />);

    const sidebar = screen.getByTestId("sidebar");

    // Expand Dashboard
    const dashboardText = within(sidebar).getByText("Dashboard");
    const dashboardContainer = dashboardText.closest("div")?.parentElement;
    const chevronButton = dashboardContainer?.querySelector(
      "button",
    ) as HTMLButtonElement;
    fireEvent.click(chevronButton);

    // Wait for sub-items to appear
    await waitFor(() => {
      expect(within(sidebar).getByText("Overview")).toBeInTheDocument();
    });

    // Click Overview sub-item to make it active
    const overviewSubItem = within(sidebar).getByText("Overview");
    fireEvent.click(overviewSubItem);

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });

    // Verify the sub-item button has no left border (should be transparent)
    const subItemButton = overviewSubItem.closest("button");
    expect(subItemButton).toHaveStyle({ borderLeft: "3px solid transparent" });
  });

  it("should position tree line under center of parent icon", async () => {
    render(<HomeComponent />);

    const sidebar = screen.getByTestId("sidebar");

    // Expand Dashboard
    const dashboardText = within(sidebar).getByText("Dashboard");
    const dashboardContainer = dashboardText.closest("div")?.parentElement;
    const chevronButton = dashboardContainer?.querySelector(
      "button",
    ) as HTMLButtonElement;
    fireEvent.click(chevronButton);

    // Wait for sub-items to appear
    await waitFor(() => {
      expect(within(sidebar).getByText("Overview")).toBeInTheDocument();
    });

    // Find the tree line element (span with vertical line styling)
    const overviewSubItem = within(sidebar).getByText("Overview");
    const subItemButton = overviewSubItem.closest("button");
    const treeLine = subItemButton?.querySelector("span");

    // Tree line should be positioned at left: -8px
    // (parent icon center is at 20px from sidebar edge, sub-items container has 28px padding, so -8px relative to button)
    expect(treeLine).toHaveStyle({ left: "-8px" });
  });
});
