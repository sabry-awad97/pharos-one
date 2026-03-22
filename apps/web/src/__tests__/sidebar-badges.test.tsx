import {
  render,
  screen,
  within,
  fireEvent,
  waitFor,
} from "@testing-library/react";
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

describe("Sidebar Badges", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("should align navigation items to the left when sidebar is expanded", () => {
    render(<HomeComponent />);

    const sidebar = screen.getByTestId("sidebar");

    // Find a navigation item (Dashboard)
    const dashboardText = within(sidebar).getByText("Dashboard");
    const dashboardButton = dashboardText.closest("button");

    // Check that the button uses flex-start for justifyContent (left alignment)
    expect(dashboardButton).toHaveStyle({ justifyContent: "flex-start" });

    // Check that the button is not centered
    expect(dashboardButton).not.toHaveStyle({ justifyContent: "center" });
  });

  it("should display badge pill next to label when sidebar is expanded", () => {
    render(<HomeComponent />);

    const sidebar = screen.getByTestId("sidebar");

    // Customers has badge: 142 in WORKSPACE_TEMPLATES (leaf node without sub-items)
    const customersText = within(sidebar).getByText("Customers");
    const customersButton = customersText.closest("button");

    // Badge should be visible as a pill showing "142"
    const badge = within(customersButton as HTMLElement).getByText("142");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle({ fontSize: "10px" });
  });

  it("should display badge on sub-items when parent is expanded", async () => {
    render(<HomeComponent />);

    const sidebar = screen.getByTestId("sidebar");

    // Find Dashboard nav item
    const dashboardText = within(sidebar).getByText("Dashboard");

    // The chevron button is positioned absolutely on the right side
    // We need to find all buttons and get the one that's not the nav item itself
    const dashboardNavItem = dashboardText.closest("button");
    const dashboardContainer = dashboardNavItem?.parentElement;

    // Get all buttons in the container - first is nav item, second is chevron
    const buttons = dashboardContainer?.querySelectorAll("button");
    const chevronButton = buttons?.[1] as HTMLButtonElement;

    // Click chevron to expand Dashboard sub-items
    fireEvent.click(chevronButton);

    // Wait for sub-items to appear
    await waitFor(() => {
      expect(
        within(sidebar).getByText("Alerts & Notifications"),
      ).toBeInTheDocument();
    });

    // Find the "Alerts & Notifications" sub-item
    const alertsText = within(sidebar).getByText("Alerts & Notifications");
    const alertsButton = alertsText.closest("button");

    // Badge "3" should be visible on the sub-item
    const badge = within(alertsButton as HTMLElement).getByText("3");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle({ fontSize: "10px" });
  });
});
