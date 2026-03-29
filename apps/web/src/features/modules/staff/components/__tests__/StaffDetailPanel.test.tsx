/**
 * StaffDetailPanel component tests
 * Testing through public interface - behavior, not implementation
 */

import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { StaffDetailPanel } from "../StaffDetailPanel";
import { STAFF_DATA } from "../../mock-data";

describe("StaffDetailPanel", () => {
  const mockOnClose = vi.fn();
  const testStaff = STAFF_DATA[0]; // Dr. Sarah Chen

  it("should render panel with staff data", () => {
    renderWithProviders(
      <StaffDetailPanel staff={testStaff} onClose={mockOnClose} />,
    );

    // Should show staff name in header
    expect(screen.getByText("Dr. Sarah Chen")).toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    renderWithProviders(
      <StaffDetailPanel staff={testStaff} onClose={mockOnClose} />,
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should display staff role and duty status in header", () => {
    renderWithProviders(
      <StaffDetailPanel staff={testStaff} onClose={mockOnClose} />,
    );

    // Should show role and duty status
    expect(screen.getByText("Pharmacist")).toBeInTheDocument();
    expect(screen.getByText("On Duty")).toBeInTheDocument();
  });

  it("should display all four tabs", () => {
    renderWithProviders(
      <StaffDetailPanel staff={testStaff} onClose={mockOnClose} />,
    );

    // Should show all four tabs
    expect(screen.getByRole("tab", { name: /profile/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /credentials/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /attendance/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /metrics/i })).toBeInTheDocument();
  });

  it("should display profile information in Profile tab", () => {
    renderWithProviders(
      <StaffDetailPanel staff={testStaff} onClose={mockOnClose} />,
    );

    // Profile tab should be active by default and show contact info
    expect(screen.getByText("s.chen@rxpharmacy.com")).toBeInTheDocument();
    expect(screen.getByText("+1 (555) 001-0001")).toBeInTheDocument();
    expect(screen.getByText("Main Street")).toBeInTheDocument();

    // Should show competencies
    expect(screen.getByText("Immunizations")).toBeInTheDocument();
    expect(screen.getByText("Compounding")).toBeInTheDocument();
    expect(screen.getByText("MTM")).toBeInTheDocument();

    // Should show compliance score
    expect(screen.getByText(/88/)).toBeInTheDocument();
  });

  it("should display credentials in Credentials tab", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    renderWithProviders(
      <StaffDetailPanel staff={testStaff} onClose={mockOnClose} />,
    );

    // Click Credentials tab
    const credentialsTab = screen.getByRole("tab", { name: /credentials/i });
    await user.click(credentialsTab);

    // Should show credential types
    expect(screen.getByText("Pharmacist License")).toBeInTheDocument();
    expect(screen.getByText("DEA Registration")).toBeInTheDocument();
    expect(screen.getByText("CPR Certification")).toBeInTheDocument();

    // Should show expiry dates
    expect(screen.getByText("Dec 31, 2025")).toBeInTheDocument();
    expect(screen.getByText("Mar 15, 2026")).toBeInTheDocument();
    expect(screen.getByText("Jun 1, 2025")).toBeInTheDocument();

    // Should show status badges
    expect(screen.getByText("expiring")).toBeInTheDocument();
    expect(screen.getByText("valid")).toBeInTheDocument();
    expect(screen.getByText("critical")).toBeInTheDocument();
  });

  it("should display attendance records in Attendance tab", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    renderWithProviders(
      <StaffDetailPanel staff={testStaff} onClose={mockOnClose} />,
    );

    // Click Attendance tab
    const attendanceTab = screen.getByRole("tab", { name: /attendance/i });
    await user.click(attendanceTab);

    // Should show attendance records for this staff member (staffId: "1")
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Yesterday")).toBeInTheDocument();

    // Should show status (multiple records with "present")
    expect(screen.getAllByText("present").length).toBeGreaterThan(0);
  });

  it("should display metrics in Metrics tab", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    renderWithProviders(
      <StaffDetailPanel staff={testStaff} onClose={mockOnClose} />,
    );

    // Click Metrics tab
    const metricsTab = screen.getByRole("tab", { name: /metrics/i });
    await user.click(metricsTab);

    // Should show performance metrics
    expect(screen.getByText(/96/)).toBeInTheDocument(); // punctualityScore
    expect(screen.getByText(/32/)).toBeInTheDocument(); // hoursThisWeek
    expect(screen.getByText(/2\.5/)).toBeInTheDocument(); // otHours
    expect(screen.getByText(/12/)).toBeInTheDocument(); // leaveBalance
  });
});
