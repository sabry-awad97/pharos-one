import { screen, within, fireEvent } from "@testing-library/react";
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

describe("Sidebar Collapsed Alignment", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("should have balanced spacing around icon when sidebar is collapsed", () => {
    renderWithProviders(<HomeComponent />);

    const sidebar = screen.getByTestId("sidebar");

    // Get the rail element to collapse the sidebar
    const rail = screen.getByTestId("sidebar-drag-handle");

    // Check if sidebar is expanded, if so collapse it using rail double-click
    let currentStyles = window.getComputedStyle(sidebar);
    let currentWidth = parseInt(currentStyles.width);

    if (currentWidth > 48) {
      fireEvent.doubleClick(rail);
    }

    // Find a navigation item button (Dashboard) - should still be accessible by name
    const dashboardButton = within(sidebar).getByRole("button", {
      name: /dashboard/i,
    });

    // Get computed styles
    const styles = window.getComputedStyle(dashboardButton);

    // When collapsed, icon should be centered
    // Total width: 48px, border: 3px, icon: 16px
    // Available space: 48 - 3 - 16 = 29px
    // Should be split: ~14.5px per side
    // Left: 3px border + 12px padding = 15px
    // Right: 14px padding
    const paddingLeft = parseInt(styles.paddingLeft);
    const paddingRight = parseInt(styles.paddingRight);

    // Verify the icon is approximately centered
    expect(paddingLeft).toBe(12);
    expect(paddingRight).toBe(14);
  });
});
