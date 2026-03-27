/**
 * Unit tests for SidebarNav, SidebarNavItem, SidebarNavGroup, SidebarStats
 * Written TDD-first: tests define expected behavior before implementation.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import {
  SidebarNav,
  SidebarNavItem,
  SidebarNavGroup,
  SidebarStats,
} from "../SidebarNavComponents";
import { Package, LayoutDashboard } from "lucide-react";

// ============================================================================
// SidebarNav
// ============================================================================

describe("SidebarNav", () => {
  it("renders children", () => {
    render(
      <SidebarNav>
        <div>Nav content</div>
      </SidebarNav>,
    );
    expect(screen.getByText("Nav content")).toBeInTheDocument();
  });

  it("has correct test id", () => {
    render(
      <SidebarNav><div /></SidebarNav>,
    );
    expect(screen.getByTestId("sidebar-nav")).toBeInTheDocument();
  });

  it("is scrollable (overflow-y auto)", () => {
    render(
      <SidebarNav><div /></SidebarNav>,
    );
    const nav = screen.getByTestId("sidebar-nav");
    expect(nav).toHaveStyle({ overflowY: "auto" });
  });

  it("renders nav element with role navigation", () => {
    render(
      <SidebarNav><div /></SidebarNav>,
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});

// ============================================================================
// SidebarNavItem
// ============================================================================

describe("SidebarNavItem", () => {
  it("renders label", () => {
    render(<SidebarNavItem label="All Products" />);
    expect(screen.getByText("All Products")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(<SidebarNavItem label="Products" icon={Package} />);
    // Icon renders as SVG inside the button
    const btn = screen.getByRole("button", { name: /products/i });
    expect(btn.querySelector("svg")).toBeTruthy();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<SidebarNavItem label="Products" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders badge when provided", () => {
    render(<SidebarNavItem label="Low Stock" badge={7} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("has aria-current='page' when active", () => {
    render(<SidebarNavItem label="Active Item" active />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-current", "page");
  });

  it("does not have aria-current when inactive", () => {
    render(<SidebarNavItem label="Inactive" />);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-current");
  });

  it("is focusable via keyboard (tabIndex=0)", () => {
    render(<SidebarNavItem label="Nav Item" />);
    expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "0");
  });

  it("renders without icon", () => {
    render(<SidebarNavItem label="Text Only" />);
    expect(screen.getByText("Text Only")).toBeInTheDocument();
  });
});

// ============================================================================
// SidebarNavGroup
// ============================================================================

describe("SidebarNavGroup", () => {
  it("renders group label", () => {
    render(
      <SidebarNavGroup label="Filters">
        <SidebarNavItem label="Child" />
      </SidebarNavGroup>,
    );
    expect(screen.getByText("Filters")).toBeInTheDocument();
  });

  it("renders children when expanded", () => {
    render(
      <SidebarNavGroup label="Filters" defaultExpanded>
        <SidebarNavItem label="Child Item" />
      </SidebarNavGroup>,
    );
    expect(screen.getByText("Child Item")).toBeInTheDocument();
  });

  it("hides children when collapsed by default", () => {
    render(
      <SidebarNavGroup label="Filters">
        <SidebarNavItem label="Hidden Child" />
      </SidebarNavGroup>,
    );
    expect(screen.queryByText("Hidden Child")).not.toBeInTheDocument();
  });

  it("toggles children on header click", () => {
    render(
      <SidebarNavGroup label="Filters">
        <SidebarNavItem label="Toggle Child" />
      </SidebarNavGroup>,
    );
    expect(screen.queryByText("Toggle Child")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /filters/i }));
    expect(screen.getByText("Toggle Child")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /filters/i }));
    expect(screen.queryByText("Toggle Child")).not.toBeInTheDocument();
  });

  it("header button has aria-expanded attribute", () => {
    render(
      <SidebarNavGroup label="Filters" defaultExpanded>
        <SidebarNavItem label="Child" />
      </SidebarNavGroup>,
    );
    expect(screen.getByRole("button", { name: /filters/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("has correct test id", () => {
    render(
      <SidebarNavGroup label="Group"><div /></SidebarNavGroup>,
    );
    expect(screen.getByTestId("sidebar-nav-group")).toBeInTheDocument();
  });
});

// ============================================================================
// SidebarStats
// ============================================================================

describe("SidebarStats", () => {
  const stats = [
    { label: "Products", value: "142" },
    { label: "Low Stock", value: "7", trend: "down" as const },
    { label: "Revenue", value: "$4,200", trend: "up" as const },
  ];

  it("renders all stat labels", () => {
    render(<SidebarStats stats={stats} />);
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Low Stock")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("renders all stat values", () => {
    render(<SidebarStats stats={stats} />);
    expect(screen.getByText("142")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("$4,200")).toBeInTheDocument();
  });

  it("has correct test id", () => {
    render(<SidebarStats stats={stats} />);
    expect(screen.getByTestId("sidebar-stats")).toBeInTheDocument();
  });

  it("renders trend indicators when trend is provided", () => {
    render(<SidebarStats stats={stats} />);
    // Trend icons should be rendered; check via aria-label
    expect(screen.getByLabelText("trending up")).toBeInTheDocument();
    expect(screen.getByLabelText("trending down")).toBeInTheDocument();
  });

  it("renders empty stats list without error", () => {
    render(<SidebarStats stats={[]} />);
    expect(screen.getByTestId("sidebar-stats")).toBeInTheDocument();
  });

  it("renders stats without trend without trend indicator", () => {
    render(<SidebarStats stats={[{ label: "Total", value: "10" }]} />);
    expect(screen.queryByLabelText("trending up")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("trending down")).not.toBeInTheDocument();
  });
});
