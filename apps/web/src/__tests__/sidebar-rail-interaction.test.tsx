import { render, screen, within, fireEvent } from "@testing-library/react";
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

describe("Sidebar Rail Interaction", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("should show rail when sidebar is collapsed", () => {
    render(<HomeComponent />);

    const sidebar = screen.getByTestId("sidebar");

    // Get the rail element
    const rail = sidebar.querySelector(
      'div[style*="col-resize"]',
    ) as HTMLElement;
    expect(rail).toBeInTheDocument();

    // Collapse the sidebar using rail double-click
    let currentStyles = window.getComputedStyle(sidebar);
    let currentWidth = parseInt(currentStyles.width);

    if (currentWidth > 48) {
      fireEvent.doubleClick(rail);
    }

    // Rail should still exist and be visible when collapsed
    const railAfterCollapse = sidebar.querySelector('div[style*="col-resize"]');
    expect(railAfterCollapse).toBeInTheDocument();
  });

  it("should collapse sidebar when double-clicking rail while expanded", () => {
    render(<HomeComponent />);

    const sidebar = screen.getByTestId("sidebar");

    // Get the rail element
    const rail = sidebar.querySelector(
      'div[style*="col-resize"]',
    ) as HTMLElement;
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
    render(<HomeComponent />);

    const sidebar = screen.getByTestId("sidebar");

    // Get the rail element
    const rail = sidebar.querySelector(
      'div[style*="col-resize"]',
    ) as HTMLElement;
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
    render(<HomeComponent />);

    const sidebar = screen.getByTestId("sidebar");

    // Get the rail element
    const rail = sidebar.querySelector(
      'div[style*="col-resize"]',
    ) as HTMLElement;
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
    render(<HomeComponent />);

    const sidebar = screen.getByTestId("sidebar");

    // Get the rail element
    const rail = sidebar.querySelector(
      'div[style*="col-resize"]',
    ) as HTMLElement;
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
    render(<HomeComponent />);

    const sidebar = screen.getByTestId("sidebar");

    // The collapse button was the last button in the sidebar
    // After removal, we should not find a button with ChevronLeft or ChevronRight icons
    // We can check by looking for buttons at the bottom with specific styling
    const allButtons = within(sidebar).getAllByRole("button");

    // Check that no button has the collapse button styling (height: 32, borderTop)
    const collapseButton = Array.from(allButtons).find((button) => {
      const styles = window.getComputedStyle(button);
      return (
        styles.height === "32px" && styles.borderTop !== "0px none rgb(0, 0, 0)"
      );
    });

    expect(collapseButton).toBeUndefined();
  });
});
