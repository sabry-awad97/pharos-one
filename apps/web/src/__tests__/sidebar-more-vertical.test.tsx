import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { SidebarNavItem } from "@/features/shell/components/SidebarNavItem";
import { SidebarSubItem } from "@/features/shell/components/SidebarSubItem";
import { LayoutDashboard } from "lucide-react";

describe("SidebarNavItem MoreVertical Icon", () => {
  it("should NOT render MoreVertical icon for parent items (only for sub-items)", () => {
    const onModuleClick = vi.fn();
    const onContextMenu = vi.fn();
    const { container } = render(
      <SidebarNavItem
        id="dashboard"
        icon={LayoutDashboard}
        label="Dashboard"
        active={false}
        expanded={true}
        onClick={onModuleClick}
        onContextMenu={onContextMenu}
      />,
    );

    // Should have only 1 SVG: the module icon (no MoreVertical for parent items)
    const allSvgs = container.querySelectorAll("svg");
    expect(allSvgs.length).toBe(1);
  });

  it("should have only module icon when sidebar is collapsed", () => {
    const onModuleClick = vi.fn();
    const onContextMenu = vi.fn();
    const { container } = render(
      <SidebarNavItem
        id="dashboard"
        icon={LayoutDashboard}
        label="Dashboard"
        active={false}
        expanded={false}
        onClick={onModuleClick}
        onContextMenu={onContextMenu}
      />,
    );

    // Should have only 1 SVG: the module icon
    const allSvgs = container.querySelectorAll("svg");
    expect(allSvgs.length).toBe(1);
  });

  it("should have only module icon when onContextMenu is not provided", () => {
    const onModuleClick = vi.fn();
    const { container } = render(
      <SidebarNavItem
        id="dashboard"
        icon={LayoutDashboard}
        label="Dashboard"
        active={false}
        expanded={true}
        onClick={onModuleClick}
      />,
    );

    // Should have only 1 SVG: the module icon
    const allSvgs = container.querySelectorAll("svg");
    expect(allSvgs.length).toBe(1);
  });
});

describe("SidebarSubItem MoreVertical Icon", () => {
  it("should render MoreVertical icon when onContextMenu is provided", () => {
    const onClick = vi.fn();
    const onContextMenu = vi.fn();
    const { container } = render(
      <SidebarSubItem
        id="overview"
        label="Overview"
        active={false}
        onClick={onClick}
        onContextMenu={onContextMenu}
      />,
    );

    // Should have 1 SVG: MoreVertical (sub-items don't have an icon)
    const allSvgs = container.querySelectorAll("svg");
    expect(allSvgs.length).toBe(1);
  });

  it("should NOT render MoreVertical icon when onContextMenu is not provided", () => {
    const onClick = vi.fn();
    const { container } = render(
      <SidebarSubItem
        id="overview"
        label="Overview"
        active={false}
        onClick={onClick}
      />,
    );

    // Should have 0 SVGs
    const allSvgs = container.querySelectorAll("svg");
    expect(allSvgs.length).toBe(0);
  });
});
