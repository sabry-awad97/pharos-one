import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
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
  it("should have workspace area as main container with TabBar and content", () => {
    renderWithProviders(<HomeComponent />);

    // Workspace area should be the main container (no global sidebar)
    const workspaceArea = screen.getByTestId("workspace-area");
    expect(workspaceArea).toBeInTheDocument();

    // Verify it contains TabBar
    const tabBar = within(workspaceArea).getByTestId("tab-bar");
    expect(tabBar).toBeInTheDocument();

    // Verify it contains outlet for workspace content
    const outlet = within(workspaceArea).getByTestId("outlet");
    expect(outlet).toBeInTheDocument();
  });

  it("should have TabBar inside workspace area", () => {
    renderWithProviders(<HomeComponent />);

    // TabBar should be inside workspace area
    const workspaceArea = screen.getByTestId("workspace-area");
    const tabBar = within(workspaceArea).getByTestId("tab-bar");

    expect(tabBar).toBeInTheDocument();
    expect(workspaceArea).toContainElement(tabBar);
  });

  it("should not have global sidebar (workspaces render their own)", () => {
    renderWithProviders(<HomeComponent />);

    // Global sidebar should not exist
    const sidebar = screen.queryByTestId("sidebar");
    expect(sidebar).not.toBeInTheDocument();
  });
});
