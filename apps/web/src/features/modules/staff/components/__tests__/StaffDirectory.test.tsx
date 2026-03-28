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

    // Should show staff members from STAFF_DATA
    expect(screen.getByText("Dr. Sarah Chen")).toBeInTheDocument();
    expect(screen.getByText("Marcus Williams")).toBeInTheDocument();
    expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
    expect(screen.getByText("James O'Brien")).toBeInTheDocument();
    expect(screen.getByText("Linda Park")).toBeInTheDocument();
  });

  it("should filter staff by search query", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    renderWithProviders(<StaffDirectory onSelectStaff={mockOnSelectStaff} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, "Sarah");

    // Should show only Sarah Chen
    expect(screen.getByText("Dr. Sarah Chen")).toBeInTheDocument();
    expect(screen.queryByText("Marcus Williams")).not.toBeInTheDocument();
  });

  it("should filter staff by role", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    renderWithProviders(<StaffDirectory onSelectStaff={mockOnSelectStaff} />);

    const pharmacistButton = screen.getByRole("button", {
      name: /pharmacist/i,
    });
    await user.click(pharmacistButton);

    // Should show only pharmacists
    expect(screen.getByText("Dr. Sarah Chen")).toBeInTheDocument();
    expect(screen.getByText("Linda Park")).toBeInTheDocument();
    expect(screen.queryByText("Marcus Williams")).not.toBeInTheDocument();
  });

  it("should call onSelectStaff when clicking a staff card", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    renderWithProviders(<StaffDirectory onSelectStaff={mockOnSelectStaff} />);

    const staffCard = screen.getByText("Dr. Sarah Chen").closest("div");
    if (staffCard) {
      await user.click(staffCard);
    }

    expect(mockOnSelectStaff).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Dr. Sarah Chen" }),
    );
  });

  it("should display staff count", () => {
    renderWithProviders(<StaffDirectory onSelectStaff={mockOnSelectStaff} />);

    // Should show count of 5 staff members
    expect(screen.getByText(/5.*staff/i)).toBeInTheDocument();
  });
});
