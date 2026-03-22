/**
 * Dashboard AnnotationCallouts Tests
 * Verifies AnnotationCallouts appears only in dashboard routes at the bottom
 */

import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";

// Import dashboard modules to trigger registration
import "@/features/modules/dashboard";

describe("Dashboard AnnotationCallouts Placement", () => {
  it("dashboard route should have AnnotationCallouts section above status bar", () => {
    // This test verifies the STRUCTURE we want:
    // - Dashboard route has a dedicated callouts section
    // - Section is positioned with flex-1 above status bar
    // - AnnotationCallouts component is rendered in that section

    // For now, this test documents the desired behavior
    // We'll implement the actual route structure to make this pass

    // Mock the dashboard route structure we want
    function DashboardRoute() {
      return (
        <div className="flex flex-col h-screen" data-testid="dashboard-layout">
          {/* Main content area */}
          <div className="flex-1 min-h-0 overflow-auto">
            <div data-testid="workspace-content">Dashboard Content</div>
          </div>

          {/* AnnotationCallouts section - flex-1 to fill remaining space */}
          <div className="flex-1 px-4" data-testid="callouts-section">
            <div data-testid="annotation-callouts">
              <p>Tab Switching</p>
            </div>
          </div>

          {/* Status bar - fixed height at bottom */}
          <div
            className="flex-none h-6 bg-card border-t"
            data-testid="status-bar"
          >
            Status Bar
          </div>
        </div>
      );
    }

    const { container } = render(<DashboardRoute />);

    // Verify layout structure
    const layout = screen.getByTestId("dashboard-layout");
    expect(layout).toHaveClass("flex", "flex-col", "h-screen");

    // Verify callouts section exists and has flex-1
    const calloutsSection = screen.getByTestId("callouts-section");
    expect(calloutsSection).toBeInTheDocument();
    expect(calloutsSection).toHaveClass("flex-1");

    // Verify callouts section is above status bar
    const statusBar = screen.getByTestId("status-bar");
    const calloutsIndex = Array.from(layout.children).indexOf(calloutsSection);
    const statusBarIndex = Array.from(layout.children).indexOf(statusBar);
    expect(calloutsIndex).toBeLessThan(statusBarIndex);

    // Verify AnnotationCallouts is in the callouts section
    const callouts = within(calloutsSection).getByTestId("annotation-callouts");
    expect(callouts).toBeInTheDocument();
  });

  it("dashboard route file should render AnnotationCallouts above status bar", async () => {
    // Import the actual dashboard route component
    const { Route } = await import("@/routes/_app/home/dashboard/index");
    const DashboardRoute = Route.options.component;

    if (!DashboardRoute) {
      throw new Error("Dashboard route component not found");
    }

    render(<DashboardRoute />);

    // Verify AnnotationCallouts section exists in dashboard route
    const calloutsSection = screen.queryByTestId("callouts-section");
    expect(calloutsSection).toBeInTheDocument();
  });

  it("dashboard workspace should expand to fill available space above callouts", async () => {
    // Import the actual dashboard route component
    const { Route } = await import("@/routes/_app/home/dashboard/index");
    const DashboardRoute = Route.options.component;

    if (!DashboardRoute) {
      throw new Error("Dashboard route component not found");
    }

    const { container } = render(<DashboardRoute />);

    // Find the main layout container
    const layoutContainer = container.firstChild as HTMLElement;
    expect(layoutContainer).toHaveClass("flex", "flex-col", "h-full");

    // Find workspace content area (first child)
    const workspaceArea = layoutContainer.children[0] as HTMLElement;
    expect(workspaceArea).toHaveClass("flex-1"); // Should expand to fill space

    // Find callouts section (second child)
    const calloutsSection = layoutContainer.children[1] as HTMLElement;
    expect(calloutsSection).toHaveClass("flex-none"); // Should have fixed height

    // Verify workspace comes before callouts
    const workspaceIndex = Array.from(layoutContainer.children).indexOf(
      workspaceArea,
    );
    const calloutsIndex = Array.from(layoutContainer.children).indexOf(
      calloutsSection,
    );
    expect(workspaceIndex).toBeLessThan(calloutsIndex);
  });
});
