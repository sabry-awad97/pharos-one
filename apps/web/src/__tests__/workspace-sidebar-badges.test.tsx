import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  SidebarNav,
  SidebarNavItem,
  SidebarNavGroup,
} from "@/features/workspace/components/SidebarNavComponents";
import { AlertTriangle, Clock, Package } from "lucide-react";

describe("Workspace Sidebar Badges", () => {
  it("should display badge on child items within a group", () => {
    render(
      <SidebarNav>
        <SidebarNavGroup label="Filters" defaultExpanded>
          <SidebarNavItem
            icon={AlertTriangle}
            label="Low Stock"
            badge={5}
            active={false}
            onClick={() => {}}
          />
          <SidebarNavItem
            icon={Clock}
            label="Expiring Soon"
            badge={3}
            active={false}
            onClick={() => {}}
          />
        </SidebarNavGroup>
      </SidebarNav>,
    );

    // Verify Low Stock badge
    const lowStockItem = screen.getByText("Low Stock").closest("button");
    expect(lowStockItem).toBeInTheDocument();
    const lowStockBadge = within(lowStockItem as HTMLElement).getByText("5");
    expect(lowStockBadge).toBeInTheDocument();
    expect(lowStockBadge).toHaveStyle({
      fontSize: "10px",
      fontWeight: "600",
      padding: "2px 6px",
      borderRadius: "10px",
    });

    // Verify Expiring Soon badge
    const expiringItem = screen.getByText("Expiring Soon").closest("button");
    expect(expiringItem).toBeInTheDocument();
    const expiringBadge = within(expiringItem as HTMLElement).getByText("3");
    expect(expiringBadge).toBeInTheDocument();
    expect(expiringBadge).toHaveStyle({
      fontSize: "10px",
      fontWeight: "600",
    });
  });

  it("should not display badge when count is undefined", () => {
    render(
      <SidebarNav>
        <SidebarNavItem
          icon={Package}
          label="All Products"
          active={false}
          onClick={() => {}}
        />
      </SidebarNav>,
    );

    const item = screen.getByText("All Products").closest("button");
    expect(item).toBeInTheDocument();

    // Badge should not exist
    const badges = within(item as HTMLElement).queryAllByText(/\d+/);
    expect(badges).toHaveLength(0);
  });

  it("should display badge with active styling when item is active", () => {
    render(
      <SidebarNav>
        <SidebarNavItem
          icon={AlertTriangle}
          label="Low Stock"
          badge={5}
          active={true}
          onClick={() => {}}
        />
      </SidebarNav>,
    );

    const item = screen.getByText("Low Stock").closest("button");
    const badge = within(item as HTMLElement).getByText("5");

    expect(badge).toHaveStyle({
      color: "#0078d4",
      background: "rgba(0,120,212,0.1)",
    });
  });

  it("should display badge with inactive styling when item is not active", () => {
    render(
      <SidebarNav>
        <SidebarNavItem
          icon={AlertTriangle}
          label="Low Stock"
          badge={5}
          active={false}
          onClick={() => {}}
        />
      </SidebarNav>,
    );

    const item = screen.getByText("Low Stock").closest("button");
    const badge = within(item as HTMLElement).getByText("5");

    expect(badge).toHaveStyle({
      color: "#616161",
      background: "#f0f0f0",
    });
  });

  it("should display string badges", () => {
    render(
      <SidebarNav>
        <SidebarNavItem
          icon={AlertTriangle}
          label="Low Stock"
          badge="NEW"
          active={false}
          onClick={() => {}}
        />
      </SidebarNav>,
    );

    const item = screen.getByText("Low Stock").closest("button");
    const badge = within(item as HTMLElement).getByText("NEW");
    expect(badge).toBeInTheDocument();
  });

  it("should not display badge on parent group header", () => {
    render(
      <SidebarNav>
        <SidebarNavGroup label="Filters" defaultExpanded>
          <SidebarNavItem
            icon={AlertTriangle}
            label="Low Stock"
            badge={5}
            active={false}
            onClick={() => {}}
          />
        </SidebarNavGroup>
      </SidebarNav>,
    );

    // Find the group header
    const groupHeader = screen.getByText("Filters").closest("button");
    expect(groupHeader).toBeInTheDocument();

    // Group header should not have any badge
    const badges = within(groupHeader as HTMLElement).queryAllByText(/\d+/);
    expect(badges).toHaveLength(0);
  });

  it("should display multiple badges in the same group", () => {
    render(
      <SidebarNav>
        <SidebarNavGroup label="Filters" defaultExpanded>
          <SidebarNavItem
            icon={AlertTriangle}
            label="Low Stock"
            badge={5}
            active={false}
            onClick={() => {}}
          />
          <SidebarNavItem
            icon={Clock}
            label="Expiring Soon"
            badge={3}
            active={false}
            onClick={() => {}}
          />
          <SidebarNavItem
            icon={Package}
            label="Out of Stock"
            badge={12}
            active={false}
            onClick={() => {}}
          />
        </SidebarNavGroup>
      </SidebarNav>,
    );

    // All three badges should be present
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });
});
