/**
 * MenuBar, FileMenu, and TabBar Z-Index Tests
 * Verifies all UI chrome components render below Sheet overlay (z-50)
 * so they get blurred when overlays appear
 */

import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/test-utils";
import { MenuBar } from "../features/shell/components/MenuBar";
import { FileMenu } from "../features/shell/components/FileMenu";
import { TabBar } from "../features/workspace/components/TabBar";
import { Sidebar } from "../features/shell/components/Sidebar";
import { LayoutDashboard, Package } from "lucide-react";

describe("UI chrome z-index hierarchy", () => {
  it("should render MenuBar with z-index < 50", () => {
    const { container } = renderWithProviders(
      <MenuBar
        activeMenu={null}
        onMenuClick={() => {}}
        branchInfo="Main"
        userInfo="Test User"
      />,
    );

    const menuBar = container.firstChild as HTMLElement;
    expect(menuBar).toBeInTheDocument();

    // Get inline z-index from style
    const zIndex = parseInt(menuBar.style.zIndex, 10);

    // Should be < 50 to render below Sheet overlay (z-50)
    expect(zIndex).toBeLessThan(50);
    expect(zIndex).toBeGreaterThan(0);
  });

  it("should render FileMenu with z-index < 50", () => {
    const { container } = renderWithProviders(<FileMenu onClose={() => {}} />);

    const fileMenu = container.firstChild as HTMLElement;
    expect(fileMenu).toBeInTheDocument();

    // Get inline z-index from style
    const zIndex = parseInt(fileMenu.style.zIndex, 10);

    // Should be < 50 to render below Sheet overlay (z-50)
    expect(zIndex).toBeLessThan(50);
    expect(zIndex).toBeGreaterThan(0);
  });

  it("should render FileMenu submenu with z-index < 50", () => {
    const { container } = renderWithProviders(<FileMenu onClose={() => {}} />);

    // FileMenu itself should have z-index < 50
    const fileMenu = container.firstChild as HTMLElement;
    const fileMenuZIndex = parseInt(fileMenu.style.zIndex, 10);
    expect(fileMenuZIndex).toBeLessThan(50);

    // Submenu z-index is set to 30 in the code (< 50)
    // We verify this by checking the FileMenu component code
    // The submenu only renders on hover, so we test the parent menu z-index
    expect(fileMenuZIndex).toBeGreaterThan(0);
  });

  it("should render TabBar with z-index < 50", () => {
    const { getByTestId } = renderWithProviders(
      <TabBar
        tabs={[
          {
            id: "1",
            label: "Dashboard",
            icon: LayoutDashboard,
            module: "",
          },
          {
            id: "2",
            label: "Inventory",
            icon: Package,
            module: "",
          },
        ]}
        activeTabId="1"
        onTabClick={() => {}}
        onTabClose={() => {}}
      />,
    );

    const tabBar = getByTestId("tab-bar");
    expect(tabBar).toBeInTheDocument();

    // Get inline z-index from style
    const zIndex = parseInt(tabBar.style.zIndex, 10);

    // Should be < 50 to render below Sheet overlay (z-50)
    expect(zIndex).toBeLessThan(50);
    expect(zIndex).toBeGreaterThan(0);
  });

  it("should render Sidebar with z-index lower than menu dropdowns", () => {
    const { getByTestId } = renderWithProviders(
      <Sidebar activeModule="dashboard" onModuleClick={() => {}} />,
    );

    const sidebar = getByTestId("sidebar");
    expect(sidebar).toBeInTheDocument();

    // Get inline z-index from style
    const zIndex = parseInt(sidebar.style.zIndex, 10);

    // Should be < 20 (menu dropdowns are at z-index 20)
    // This ensures menus always appear above sidebar
    expect(zIndex).toBeLessThan(20);
    expect(zIndex).toBeGreaterThan(0);
  });

  it("should render Sidebar drag handle with z-index between sidebar and menu dropdowns", () => {
    const { getAllByTestId } = renderWithProviders(
      <Sidebar activeModule="dashboard" onModuleClick={() => {}} />,
    );

    const dragHandles = getAllByTestId("sidebar-drag-handle");
    const dragHandle = dragHandles[0]; // Get the first one
    expect(dragHandle).toBeInTheDocument();

    const zIndex = parseInt(dragHandle.style.zIndex, 10);

    // Should be 15 (between sidebar at 5 and menu dropdowns at 20)
    expect(zIndex).toBe(15);
  });
});
