/**
 * MetricsWorkspace component tests
 * Testing through public interface - behavior, not implementation
 */

import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { MetricsWorkspace } from "../MetricsWorkspace";
import { STAFF_DATA } from "../../mock-data";

describe("MetricsWorkspace", () => {
  const mockOnSelectStaff = vi.fn();

  it("should render with scrollable container", () => {
    const { container } = renderWithProviders(
      <MetricsWorkspace
        allStaff={STAFF_DATA}
        selectedStaff={null}
        onSelectStaff={mockOnSelectStaff}
      />,
    );

    // Should have a scrollable container with overflow-auto
    const scrollableContainer = container.querySelector(".overflow-auto");
    expect(scrollableContainer).toBeInTheDocument();
    expect(scrollableContainer).toHaveClass("flex-1");
    expect(scrollableContainer).toHaveClass("custom-scrollbar");
  });

  it("should render KPI cards", () => {
    renderWithProviders(
      <MetricsWorkspace
        allStaff={STAFF_DATA}
        selectedStaff={null}
        onSelectStaff={mockOnSelectStaff}
      />,
    );

    // Should show attendance KPI cards
    expect(screen.getByText("Attendance Rate")).toBeInTheDocument();
    expect(screen.getByText("Total OT Hours")).toBeInTheDocument();
    expect(screen.getByText("Late Arrivals")).toBeInTheDocument();
    expect(screen.getByText("Early Departures")).toBeInTheDocument();
  });

  it("should render punctuality leaderboard", () => {
    renderWithProviders(
      <MetricsWorkspace
        allStaff={STAFF_DATA}
        selectedStaff={null}
        onSelectStaff={mockOnSelectStaff}
      />,
    );

    // Should show punctuality leaderboard
    expect(screen.getByText("🎯 Punctuality Leaderboard")).toBeInTheDocument();

    // Should show all staff members (they appear in multiple places)
    STAFF_DATA.forEach((staff) => {
      const elements = screen.getAllByText(staff.name);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it("should render hours breakdown table", () => {
    renderWithProviders(
      <MetricsWorkspace
        allStaff={STAFF_DATA}
        selectedStaff={null}
        onSelectStaff={mockOnSelectStaff}
      />,
    );

    // Should show hours breakdown table
    expect(
      screen.getByText("📊 Hours & Leave Breakdown — This Week"),
    ).toBeInTheDocument();
    expect(screen.getByText("Staff Member")).toBeInTheDocument();
    expect(screen.getByText("Hours This Week")).toBeInTheDocument();
    expect(screen.getByText("OT Hours")).toBeInTheDocument();
    expect(screen.getByText("Leave Balance")).toBeInTheDocument();
  });
});
