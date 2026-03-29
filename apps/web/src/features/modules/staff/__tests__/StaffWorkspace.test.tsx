/**
 * StaffWorkspace integration tests
 * Testing through public interface - behavior, not implementation
 */

import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { StaffWorkspace } from "../StaffWorkspace";

describe("StaffWorkspace", () => {
  it("should show StaffDetailPanel when staff is selected", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    renderWithProviders(<StaffWorkspace />);

    // Click Staff tab in sidebar
    const staffTab = screen.getByRole("button", { name: /staff/i });
    await user.click(staffTab);

    // Double-click a staff member
    const staffRow = screen.getByText("Dr. Sarah Chen").closest("tr");
    if (staffRow) {
      await user.dblClick(staffRow);
    }

    // Should show detail panel with tabs
    expect(screen.getByRole("tab", { name: /profile/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /credentials/i }),
    ).toBeInTheDocument();
  });

  it("should close StaffDetailPanel when close button is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    renderWithProviders(<StaffWorkspace />);

    // Click Staff tab in sidebar
    const staffTab = screen.getByRole("button", { name: /staff/i });
    await user.click(staffTab);

    // Double-click a staff member to open panel
    const staffRow = screen.getByText("Dr. Sarah Chen").closest("tr");
    if (staffRow) {
      await user.dblClick(staffRow);
    }

    // Panel should be visible
    expect(screen.getByRole("tab", { name: /profile/i })).toBeInTheDocument();

    // Click close button
    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    // Panel should be closed (tabs should not be visible)
    expect(
      screen.queryByRole("tab", { name: /profile/i }),
    ).not.toBeInTheDocument();
  });

  it("should replace panel content when selecting different staff", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    renderWithProviders(<StaffWorkspace />);

    // Click Staff tab in sidebar
    const staffTab = screen.getByRole("button", { name: /staff/i });
    await user.click(staffTab);

    // Select first staff member
    const firstStaffRow = screen.getByText("Dr. Sarah Chen").closest("tr");
    if (firstStaffRow) {
      await user.dblClick(firstStaffRow);
    }

    // Should show first staff's name in panel header
    const panelHeaders = screen.getAllByText("Dr. Sarah Chen");
    expect(panelHeaders.length).toBeGreaterThan(1); // In table and panel

    // Select second staff member
    const secondStaffRow = screen.getByText("Marcus Williams").closest("tr");
    if (secondStaffRow) {
      await user.dblClick(secondStaffRow);
    }

    // Should show second staff's name in panel header
    const newPanelHeaders = screen.getAllByText("Marcus Williams");
    expect(newPanelHeaders.length).toBeGreaterThan(1); // In table and panel
  });
});
