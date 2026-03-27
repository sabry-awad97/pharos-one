import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ReportsSidebar } from "@/features/modules/reports/components/ReportsSidebar";

describe("Reports Sidebar", () => {
  it("should render sidebar with all reports active", () => {
    const onReportChange = vi.fn();
    const onDateRangeChange = vi.fn();

    render(
      <ReportsSidebar
        activeReport="all"
        onReportChange={onReportChange}
        dateRange="month"
        onDateRangeChange={onDateRangeChange}
        totalReports={24}
        generatedReports={18}
      />,
    );

    // All Reports should be active
    const allReportsItem = screen.getByText("All Reports").closest("button");
    expect(allReportsItem).toHaveStyle({
      background: "rgba(0,120,212,0.1)",
      borderLeft: "3px solid #0078d4",
    });
  });

  it("should display report stats in footer", () => {
    const onReportChange = vi.fn();
    const onDateRangeChange = vi.fn();

    render(
      <ReportsSidebar
        activeReport="all"
        onReportChange={onReportChange}
        dateRange="month"
        onDateRangeChange={onDateRangeChange}
        totalReports={24}
        generatedReports={18}
      />,
    );

    const statsSection = screen.getByTestId("sidebar-stats");
    expect(within(statsSection).getByText("Generated")).toBeInTheDocument();
    expect(within(statsSection).getByText("18")).toBeInTheDocument();
    expect(within(statsSection).getByText("Total Reports")).toBeInTheDocument();
    expect(within(statsSection).getByText("24")).toBeInTheDocument();
  });

  it("should call onReportChange when clicking different report types", () => {
    const onReportChange = vi.fn();
    const onDateRangeChange = vi.fn();

    render(
      <ReportsSidebar
        activeReport="all"
        onReportChange={onReportChange}
        dateRange="month"
        onDateRangeChange={onDateRangeChange}
        totalReports={24}
        generatedReports={18}
      />,
    );

    const salesItem = screen.getByText("Sales").closest("button");
    salesItem?.click();

    expect(onReportChange).toHaveBeenCalledWith("sales");
  });

  it("should call onDateRangeChange when clicking date range options", () => {
    const onReportChange = vi.fn();
    const onDateRangeChange = vi.fn();

    render(
      <ReportsSidebar
        activeReport="all"
        onReportChange={onReportChange}
        dateRange="month"
        onDateRangeChange={onDateRangeChange}
        totalReports={24}
        generatedReports={18}
      />,
    );

    const todayItem = screen.getByText("Today").closest("button");
    todayItem?.click();

    expect(onDateRangeChange).toHaveBeenCalledWith("today");
  });

  it("should render Report Types group with all report types", () => {
    const onReportChange = vi.fn();
    const onDateRangeChange = vi.fn();

    render(
      <ReportsSidebar
        activeReport="all"
        onReportChange={onReportChange}
        dateRange="month"
        onDateRangeChange={onDateRangeChange}
        totalReports={24}
        generatedReports={18}
      />,
    );

    // Report Types group should exist
    const reportTypesGroup = screen.getByLabelText("Report Types");
    expect(reportTypesGroup).toBeInTheDocument();

    // Report types should be in the group
    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Inventory")).toBeInTheDocument();
    expect(screen.getByText("Customers")).toBeInTheDocument();
  });

  it("should render Date Range group with all date options", () => {
    const onReportChange = vi.fn();
    const onDateRangeChange = vi.fn();

    render(
      <ReportsSidebar
        activeReport="all"
        onReportChange={onReportChange}
        dateRange="month"
        onDateRangeChange={onDateRangeChange}
        totalReports={24}
        generatedReports={18}
      />,
    );

    // Date Range group should exist
    const dateRangeGroup = screen.getByLabelText("Date Range");
    expect(dateRangeGroup).toBeInTheDocument();

    // Date range options should exist
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("This Week")).toBeInTheDocument();
    expect(screen.getByText("This Month")).toBeInTheDocument();
    expect(screen.getByText("This Year")).toBeInTheDocument();
    expect(screen.getByText("Custom Range")).toBeInTheDocument();
  });

  it("should display sales report as active", () => {
    const onReportChange = vi.fn();
    const onDateRangeChange = vi.fn();

    render(
      <ReportsSidebar
        activeReport="sales"
        onReportChange={onReportChange}
        dateRange="month"
        onDateRangeChange={onDateRangeChange}
        totalReports={24}
        generatedReports={18}
      />,
    );

    const salesItem = screen.getByText("Sales").closest("button");
    expect(salesItem).toHaveStyle({
      background: "rgba(0,120,212,0.1)",
      borderLeft: "3px solid #0078d4",
    });
  });

  it("should display revenue report as active", () => {
    const onReportChange = vi.fn();
    const onDateRangeChange = vi.fn();

    render(
      <ReportsSidebar
        activeReport="revenue"
        onReportChange={onReportChange}
        dateRange="month"
        onDateRangeChange={onDateRangeChange}
        totalReports={24}
        generatedReports={18}
      />,
    );

    const revenueItem = screen.getByText("Revenue").closest("button");
    expect(revenueItem).toHaveStyle({
      background: "rgba(0,120,212,0.1)",
      borderLeft: "3px solid #0078d4",
    });
  });

  it("should display this month date range as active", () => {
    const onReportChange = vi.fn();
    const onDateRangeChange = vi.fn();

    render(
      <ReportsSidebar
        activeReport="all"
        onReportChange={onReportChange}
        dateRange="month"
        onDateRangeChange={onDateRangeChange}
        totalReports={24}
        generatedReports={18}
      />,
    );

    const monthItem = screen.getByText("This Month").closest("button");
    expect(monthItem).toHaveStyle({
      background: "rgba(0,120,212,0.1)",
      borderLeft: "3px solid #0078d4",
    });
  });

  it("should display zero reports in footer", () => {
    const onReportChange = vi.fn();
    const onDateRangeChange = vi.fn();

    render(
      <ReportsSidebar
        activeReport="all"
        onReportChange={onReportChange}
        dateRange="month"
        onDateRangeChange={onDateRangeChange}
        totalReports={0}
        generatedReports={0}
      />,
    );

    const statsSection = screen.getByTestId("sidebar-stats");
    const zeroValues = within(statsSection).getAllByText("0");
    expect(zeroValues).toHaveLength(2); // Generated: 0, Total Reports: 0
  });
});
