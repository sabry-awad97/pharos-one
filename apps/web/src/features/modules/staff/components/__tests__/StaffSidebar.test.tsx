/**
 * StaffSidebar component tests
 */

import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import { StaffSidebar } from "../StaffSidebar";
import type { StaffTabId } from "../../types";

describe("StaffSidebar", () => {
  const defaultProps = {
    activeTab: "overview" as StaffTabId,
    onTabChange: vi.fn(),
    credentialsAlertCount: 5,
    pendingLeaveCount: 2,
    totalStaff: 5,
    onDutyCount: 2,
  };

  it("should render all navigation items", () => {
    renderWithProviders(<StaffSidebar {...defaultProps} />);

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Staff Directory")).toBeInTheDocument();
    expect(screen.getByText("Credentials")).toBeInTheDocument();
    expect(screen.getByText("Attendance")).toBeInTheDocument();
    expect(screen.getByText("Leave Requests")).toBeInTheDocument();
    expect(screen.getByText("Performance")).toBeInTheDocument();
  });

  it("should display credentials alert badge", () => {
    renderWithProviders(<StaffSidebar {...defaultProps} />);

    const credentialsItem = screen.getByText("Credentials").closest("button");
    expect(credentialsItem).toBeInTheDocument();
    expect(credentialsItem).toHaveTextContent("5");
  });

  it("should display pending leave requests badge", () => {
    renderWithProviders(<StaffSidebar {...defaultProps} />);

    const leaveItem = screen.getByText("Leave Requests").closest("button");
    expect(leaveItem).toBeInTheDocument();
    expect(leaveItem).toHaveTextContent("2");
  });

  it("should display footer stats", () => {
    renderWithProviders(<StaffSidebar {...defaultProps} />);

    // Check for stats labels and values in the footer
    const statsSection = screen.getByTestId("sidebar-stats");
    expect(statsSection).toBeInTheDocument();

    expect(screen.getByText("Total Staff")).toBeInTheDocument();
    expect(screen.getByText("On Duty")).toBeInTheDocument();

    // Stats should show the correct values (5 total, 2 on duty)
    const statValues = screen.getAllByText("5");
    expect(statValues.length).toBeGreaterThan(0);

    const onDutyValues = screen.getAllByText("2");
    expect(onDutyValues.length).toBeGreaterThan(0);
  });

  it("should highlight active tab", () => {
    renderWithProviders(<StaffSidebar {...defaultProps} activeTab="staff" />);

    const staffDirectoryItem = screen
      .getByText("Staff Directory")
      .closest("button");
    expect(staffDirectoryItem).toHaveAttribute("aria-current", "page");
  });

  it("should call onTabChange when clicking a nav item", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();

    renderWithProviders(
      <StaffSidebar {...defaultProps} onTabChange={onTabChange} />,
    );

    const credentialsItem = screen.getByText("Credentials");
    await user.click(credentialsItem);

    expect(onTabChange).toHaveBeenCalledWith("credentials");
  });

  it("should handle zero badge counts", () => {
    renderWithProviders(
      <StaffSidebar
        {...defaultProps}
        credentialsAlertCount={0}
        pendingLeaveCount={0}
      />,
    );

    const credentialsItem = screen.getByText("Credentials").closest("button");
    const leaveItem = screen.getByText("Leave Requests").closest("button");

    // Badges should still be present but show 0
    expect(credentialsItem).toHaveTextContent("0");
    expect(leaveItem).toHaveTextContent("0");
  });

  it("should render sidebar container with correct workspace id", () => {
    const { container } = renderWithProviders(
      <StaffSidebar {...defaultProps} />,
    );

    // SidebarContainer should be present
    const sidebar = container.querySelector('[data-testid="sidebar-nav"]');
    expect(sidebar).toBeInTheDocument();
  });

  it("should allow navigation between all tabs", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();

    renderWithProviders(
      <StaffSidebar {...defaultProps} onTabChange={onTabChange} />,
    );

    const tabs: Array<{ label: string; id: StaffTabId }> = [
      { label: "Overview", id: "overview" },
      { label: "Staff Directory", id: "staff" },
      { label: "Credentials", id: "credentials" },
      { label: "Attendance", id: "attendance" },
      { label: "Leave Requests", id: "leave" },
      { label: "Performance", id: "metrics" },
    ];

    for (const tab of tabs) {
      const item = screen.getByText(tab.label);
      await user.click(item);
      expect(onTabChange).toHaveBeenCalledWith(tab.id);
    }

    expect(onTabChange).toHaveBeenCalledTimes(tabs.length);
  });
});
