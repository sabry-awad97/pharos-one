import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DashboardSidebar } from "@/features/modules/dashboard/components/DashboardSidebar";

describe("Dashboard Sidebar", () => {
  it("should render sidebar with overview active", () => {
    const onViewChange = vi.fn();

    render(
      <DashboardSidebar
        activeView="overview"
        onViewChange={onViewChange}
        alertsCount={7}
        totalWidgets={12}
        activeWidgets={4}
      />,
    );

    // Overview should be active
    const overviewItem = screen.getByText("Overview").closest("button");
    expect(overviewItem).toHaveStyle({
      background: "rgba(0,120,212,0.1)",
      borderLeft: "3px solid #0078d4",
    });
  });

  it("should display alerts count badge", () => {
    const onViewChange = vi.fn();

    render(
      <DashboardSidebar
        activeView="overview"
        onViewChange={onViewChange}
        alertsCount={7}
        totalWidgets={12}
        activeWidgets={4}
      />,
    );

    const alertsItem = screen.getByText("Alerts").closest("button");
    const badge = within(alertsItem as HTMLElement).getByText("7");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle({
      fontSize: "10px",
      fontWeight: "600",
    });
  });

  it("should display widget stats in footer", () => {
    const onViewChange = vi.fn();

    render(
      <DashboardSidebar
        activeView="overview"
        onViewChange={onViewChange}
        alertsCount={7}
        totalWidgets={12}
        activeWidgets={4}
      />,
    );

    const statsSection = screen.getByTestId("sidebar-stats");
    expect(
      within(statsSection).getByText("Active Widgets"),
    ).toBeInTheDocument();
    expect(within(statsSection).getByText("4")).toBeInTheDocument();
    expect(within(statsSection).getByText("Total Widgets")).toBeInTheDocument();
    expect(within(statsSection).getByText("12")).toBeInTheDocument();
  });

  it("should call onViewChange when clicking different views", () => {
    const onViewChange = vi.fn();

    render(
      <DashboardSidebar
        activeView="overview"
        onViewChange={onViewChange}
        alertsCount={7}
        totalWidgets={12}
        activeWidgets={4}
      />,
    );

    const salesItem = screen.getByText("Sales").closest("button");
    salesItem?.click();

    expect(onViewChange).toHaveBeenCalledWith("sales");
  });

  it("should render Widgets group with Sales, Alerts, and Analytics", () => {
    const onViewChange = vi.fn();

    render(
      <DashboardSidebar
        activeView="overview"
        onViewChange={onViewChange}
        alertsCount={7}
        totalWidgets={12}
        activeWidgets={4}
      />,
    );

    // Widgets group should exist - find by aria-label
    const widgetsGroup = screen.getByLabelText("Widgets");
    expect(widgetsGroup).toBeInTheDocument();

    // Items should be in the group
    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.getByText("Alerts")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("should render Chart Types group", () => {
    const onViewChange = vi.fn();

    render(
      <DashboardSidebar
        activeView="overview"
        onViewChange={onViewChange}
        alertsCount={7}
        totalWidgets={12}
        activeWidgets={4}
      />,
    );

    // Chart Types group should exist
    expect(screen.getByText(/chart types/i)).toBeInTheDocument();

    // Chart type items should exist
    expect(screen.getByText("Bar Chart")).toBeInTheDocument();
    expect(screen.getByText("Pie Chart")).toBeInTheDocument();
    expect(screen.getByText("Line Chart")).toBeInTheDocument();
  });

  it("should display sales view as active", () => {
    const onViewChange = vi.fn();

    render(
      <DashboardSidebar
        activeView="sales"
        onViewChange={onViewChange}
        alertsCount={7}
        totalWidgets={12}
        activeWidgets={4}
      />,
    );

    const salesItem = screen.getByText("Sales").closest("button");
    expect(salesItem).toHaveStyle({
      background: "rgba(0,120,212,0.1)",
      borderLeft: "3px solid #0078d4",
    });
  });

  it("should display analytics view as active", () => {
    const onViewChange = vi.fn();

    render(
      <DashboardSidebar
        activeView="analytics"
        onViewChange={onViewChange}
        alertsCount={7}
        totalWidgets={12}
        activeWidgets={4}
      />,
    );

    const analyticsItem = screen.getByText("Analytics").closest("button");
    expect(analyticsItem).toHaveStyle({
      background: "rgba(0,120,212,0.1)",
      borderLeft: "3px solid #0078d4",
    });
  });

  it("should show zero alerts when count is 0", () => {
    const onViewChange = vi.fn();

    render(
      <DashboardSidebar
        activeView="overview"
        onViewChange={onViewChange}
        alertsCount={0}
        totalWidgets={12}
        activeWidgets={4}
      />,
    );

    const alertsItem = screen.getByText("Alerts").closest("button");
    const badge = within(alertsItem as HTMLElement).getByText("0");
    expect(badge).toBeInTheDocument();
  });

  it("should display zero widgets in footer", () => {
    const onViewChange = vi.fn();

    render(
      <DashboardSidebar
        activeView="overview"
        onViewChange={onViewChange}
        alertsCount={0}
        totalWidgets={0}
        activeWidgets={0}
      />,
    );

    const statsSection = screen.getByTestId("sidebar-stats");
    const zeroValues = within(statsSection).getAllByText("0");
    expect(zeroValues).toHaveLength(2); // Active Widgets: 0, Total Widgets: 0
  });
});
