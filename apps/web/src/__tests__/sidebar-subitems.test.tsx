import { screen, within, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
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

describe("Sidebar Sub-Items Navigation", () => {
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

  it("should navigate to nested route when clicking dashboard overview sub-item", async () => {
    renderWithProviders(
      <Sidebar activeModule={null} onModuleClick={mockOnModuleClick} />
    );

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

    // Verify navigation callback was called with the sub-item id
    expect(mockOnModuleClick).toHaveBeenCalledWith(
      expect.stringContaining("overview"),
    );
  });

  it("should show only tree line (no left border) when sub-item is active", async () => {
    renderWithProviders(
      <Sidebar activeModule={null} onModuleClick={mockOnModuleClick} />
    );

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

    // Verify callback was called
    await waitFor(() => {
      expect(mockOnModuleClick).toHaveBeenCalled();
    });

    // Verify the sub-item button has no left border (should be transparent)
    const subItemButton = overviewSubItem.closest("button");
    expect(subItemButton).toHaveStyle({ borderLeft: "3px solid transparent" });
  });

  it("should position tree line under center of parent icon", async () => {
    renderWithProviders(
      <Sidebar activeModule={null} onModuleClick={mockOnModuleClick} />
    );

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
    expect(treeLine).toHaveStyle({ left: "-8px" });
  });
});
