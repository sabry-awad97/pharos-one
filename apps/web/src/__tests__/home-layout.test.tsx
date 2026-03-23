import { render, screen, within } from "@testing-library/react";
import type { JSX } from "react";
import { describe, it, expect, vi } from "vitest";

// Mock the router hooks
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: (path: string) => (options: { component: any }) => ({
    ...options,
    path,
  }),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  useNavigate: () => vi.fn(),
  useMatches: () => [],
}));

// Import after mocking
const { Route } = await import("../routes/_app/home/route");
const HomeComponent = (Route as any).component as () => JSX.Element;

describe("Home Route Layout", () => {
  it("should have horizontal container below MenuBar containing sidebar and workspace area", () => {
    render(<HomeComponent />);

    // Find the main content container (should be horizontal flex with sidebar and workspace)
    // Look for the container that has both sidebar and workspace area as children
    const mainContainer = screen.getByTestId("main-horizontal-container");
    expect(mainContainer).toBeInTheDocument();

    // Verify it contains sidebar
    const sidebar = within(mainContainer).getByTestId("sidebar");
    expect(sidebar).toBeInTheDocument();

    // Verify it contains workspace area
    const workspaceArea = within(mainContainer).getByTestId("workspace-area");
    expect(workspaceArea).toBeInTheDocument();
  });

  it("should have TabBar inside workspace area, not as full-width element", () => {
    render(<HomeComponent />);

    // TabBar should be inside workspace area
    const workspaceArea = screen.getByTestId("workspace-area");
    const tabBar = within(workspaceArea).getByTestId("tab-bar");

    expect(tabBar).toBeInTheDocument();
    expect(workspaceArea).toContainElement(tabBar);
  });
});
