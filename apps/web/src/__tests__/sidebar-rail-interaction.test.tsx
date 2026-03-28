import { screen, within, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "@/test-utils";
import { Sidebar } from "@/features/shell/components/Sidebar";
import { useSidebarStateStore } from "@/features/workspace/stores/sidebar-state-store";

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

const mockOnModuleClick = vi.fn();

describe("Sidebar Rail Interaction", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockOnModuleClick.mockClear();
    localStorage.clear();
    // Pre-initialize the 'global' workspace to avoid set() inside selector infinite loop
    useSidebarStateStore.setState({
      workspaces: {
        global: {
          expanded: true,
          expandedModules: new Set(),
          pinnedItems: new Set(),
          hiddenItems: new Set(),
          width: 180,
        },
      },
    });
  });

  const renderSidebar = () =>
    renderWithProviders(
      <Sidebar activeModule={null} onModuleClick={mockOnModuleClick} />
    );

  it("should show rail when sidebar is collapsed", () => {
    renderSidebar();

    const sidebar = screen.getByTestId("sidebar");

    // Get the rail element
    const rail = screen.getByTestId("sidebar-drag-handle");
    expect(rail).toBeInTheDocument();

    // Collapse the sidebar using rail double-click
    let currentStyles = window.getComputedStyle(sidebar);
    let currentWidth = parseInt(currentStyles.width);

    if (currentWidth > 48) {
      fireEvent.doubleClick(rail);
    }

    // Rail should still exist and be visible when collapsed
    const railAfterCollapse = screen.getByTestId("sidebar-drag-handle");
    expect(railAfterCollapse).toBeInTheDocument();
  });

  it("should collapse sidebar when double-clicking rail while expanded", () => {
    renderSidebar();

    const sidebar = screen.getByTestId("sidebar");

    // Get the rail element
    const rail = screen.getByTestId("sidebar-drag-handle");
    expect(rail).toBeInTheDocument();

    // Ensure sidebar is expanded first
    let currentStyles = window.getComputedStyle(sidebar);
    let currentWidth = parseInt(currentStyles.width);

    if (currentWidth === 48) {
      fireEvent.doubleClick(rail);
    }

    // Verify sidebar is now expanded (width should be > 48)
    currentStyles = window.getComputedStyle(sidebar);
    currentWidth = parseInt(currentStyles.width);
    expect(currentWidth).toBeGreaterThan(48);

    // Double-click the rail to collapse
    fireEvent.doubleClick(rail);

    // Sidebar should now be collapsed (width should be 48)
    const finalStyles = window.getComputedStyle(sidebar);
    const finalWidth = parseInt(finalStyles.width);
    expect(finalWidth).toBe(48);
  });

  it("should expand sidebar when double-clicking rail while collapsed", () => {
    renderSidebar();

    const sidebar = screen.getByTestId("sidebar");

    // Get the rail element
    const rail = screen.getByTestId("sidebar-drag-handle");
    expect(rail).toBeInTheDocument();

    // Ensure sidebar is collapsed first
    let currentStyles = window.getComputedStyle(sidebar);
    let currentWidth = parseInt(currentStyles.width);

    if (currentWidth > 48) {
      fireEvent.doubleClick(rail);
    }

    // Verify sidebar is now collapsed (width should be 48)
    currentStyles = window.getComputedStyle(sidebar);
    currentWidth = parseInt(currentStyles.width);
    expect(currentWidth).toBe(48);

    // Double-click the rail to expand
    fireEvent.doubleClick(rail);

    // Sidebar should now be expanded (width should be > 48)
    const finalStyles = window.getComputedStyle(sidebar);
    const finalWidth = parseInt(finalStyles.width);
    expect(finalWidth).toBeGreaterThan(48);
  });

  it("should resize sidebar when dragging rail while expanded", () => {
    renderSidebar();

    const sidebar = screen.getByTestId("sidebar");

    // Get the rail element
    const rail = screen.getByTestId("sidebar-drag-handle");
    expect(rail).toBeInTheDocument();

    // Ensure sidebar is expanded first
    let currentStyles = window.getComputedStyle(sidebar);
    let currentWidth = parseInt(currentStyles.width);

    if (currentWidth === 48) {
      fireEvent.doubleClick(rail);
    }

    // Get initial width
    currentStyles = window.getComputedStyle(sidebar);
    const initialWidth = parseInt(currentStyles.width);
    expect(initialWidth).toBeGreaterThan(48);

    // Simulate drag: mousedown, mousemove, mouseup
    fireEvent.mouseDown(rail, { clientX: 180 });
    fireEvent.mouseMove(document, { clientX: 220 }); // Move 40px to the right
    fireEvent.mouseUp(document);

    // Sidebar width should have increased
    const finalStyles = window.getComputedStyle(sidebar);
    const finalWidth = parseInt(finalStyles.width);
    expect(finalWidth).toBeGreaterThan(initialWidth);
  });

  it("should not resize sidebar when dragging rail while collapsed", () => {
    renderSidebar();

    const sidebar = screen.getByTestId("sidebar");

    // Get the rail element
    const rail = screen.getByTestId("sidebar-drag-handle");
    expect(rail).toBeInTheDocument();

    // Ensure sidebar is collapsed first
    let currentStyles = window.getComputedStyle(sidebar);
    let currentWidth = parseInt(currentStyles.width);

    if (currentWidth > 48) {
      fireEvent.doubleClick(rail);
    }

    // Verify sidebar is collapsed
    currentStyles = window.getComputedStyle(sidebar);
    const initialWidth = parseInt(currentStyles.width);
    expect(initialWidth).toBe(48);

    // Simulate drag: mousedown, mousemove, mouseup
    fireEvent.mouseDown(rail, { clientX: 48 });
    fireEvent.mouseMove(document, { clientX: 88 }); // Try to move 40px to the right
    fireEvent.mouseUp(document);

    // Sidebar width should remain unchanged
    const finalStyles = window.getComputedStyle(sidebar);
    const finalWidth = parseInt(finalStyles.width);
    expect(finalWidth).toBe(48);
  });

  it("should not render collapse/expand button", () => {
    renderSidebar();

    const sidebar = screen.getByTestId("sidebar");

    // The collapse button was removed - sidebar now uses double-click on drag handle
    // Verify that there's no dedicated collapse/expand button
    const allButtons = within(sidebar).getAllByRole("button");

    // All buttons should be navigation items or chevron toggles
    // None should have the old collapse button styling
    const collapseButton = Array.from(allButtons).find((button) => {
      const styles = window.getComputedStyle(button);
      // Old collapse button had height: 32px and a border-top
      return (
        styles.height === "32px" &&
        styles.borderTopWidth !== "0px" &&
        !button.querySelector("svg") // Exclude chevron buttons which have SVG icons
      );
    });

    expect(collapseButton).toBeUndefined();
  });
});
