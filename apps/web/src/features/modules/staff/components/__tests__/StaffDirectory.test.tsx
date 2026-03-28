/**
 * StaffDirectory component tests
 * Testing through public interface - behavior, not implementation
 */

import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { StaffDirectory } from "../StaffDirectory";

describe("StaffDirectory", () => {
  const mockOnSelectStaff = vi.fn();

  it("should render staff list from mock data", () => {
    renderWithProviders(<StaffDirectory onSelectStaff={mockOnSelectStaff} />);

    // Should show staff members from STAFF_DATA in table
    expect(screen.getByText("Dr. Sarah Chen")).toBeInTheDocument();
    expect(screen.getByText("Marcus Williams")).toBeInTheDocument();
    expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
    expect(screen.getByText("James O'Brien")).toBeInTheDocument();
    expect(screen.getByText("Linda Park")).toBeInTheDocument();
  });

  it("should display staff roles", () => {
    renderWithProviders(<StaffDirectory onSelectStaff={mockOnSelectStaff} />);

    // Should show role badges
    expect(screen.getAllByText("Pharmacist")).toHaveLength(2); // Sarah and Linda
    expect(screen.getAllByText("Technician")).toHaveLength(2); // Marcus and James
    expect(screen.getByText("Manager")).toBeInTheDocument(); // Priya
  });

  it("should display duty status badges", () => {
    renderWithProviders(<StaffDirectory onSelectStaff={mockOnSelectStaff} />);

    // Should show duty status badges
    expect(screen.getAllByText("On Duty")).toHaveLength(2);
    expect(screen.getByText("On Break")).toBeInTheDocument();
    expect(screen.getAllByText("Off Duty")).toHaveLength(2);
  });

  it("should call onSelectStaff when double-clicking a staff row", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    renderWithProviders(<StaffDirectory onSelectStaff={mockOnSelectStaff} />);

    const staffRow = screen.getByText("Dr. Sarah Chen").closest("tr");
    if (staffRow) {
      await user.dblClick(staffRow);
    }

    expect(mockOnSelectStaff).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Dr. Sarah Chen" }),
    );
  });

  it("should display compliance scores", () => {
    renderWithProviders(<StaffDirectory onSelectStaff={mockOnSelectStaff} />);

    // Should show compliance scores
    expect(screen.getByText("88")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();
    expect(screen.getByText("95")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("82")).toBeInTheDocument();
  });
});
