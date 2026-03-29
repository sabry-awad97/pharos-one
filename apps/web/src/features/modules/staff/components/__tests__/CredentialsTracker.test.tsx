/**
 * CredentialsTracker component tests
 * Testing through public interface - behavior, not implementation
 */

import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { CredentialsTracker } from "../CredentialsTracker";

describe("CredentialsTracker", () => {
  it("should display filter buttons with counts", () => {
    renderWithProviders(<CredentialsTracker />);

    // Should show filter buttons
    expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /expired.*\(1\)/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /critical.*\(3\)/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /expiring.*\(2\)/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /valid.*\(5\)/i }),
    ).toBeInTheDocument();
  });

  it("should display credential rows with staff names", () => {
    renderWithProviders(<CredentialsTracker />);

    // Should show staff names for credentials (staff can have multiple credentials)
    expect(screen.getAllByText("Dr. Sarah Chen").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Marcus Williams").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Priya Sharma").length).toBeGreaterThan(0);
  });

  it("should display credential types and masked numbers", () => {
    renderWithProviders(<CredentialsTracker />);

    // Should show credential types (multiple staff can have same type)
    expect(screen.getAllByText("Pharmacist License").length).toBeGreaterThan(0);
    expect(screen.getAllByText("DEA Registration").length).toBeGreaterThan(0);

    // Should show masked numbers
    expect(screen.getByText(/PH-\*\*\*\*-4892/)).toBeInTheDocument();
  });

  it("should filter credentials by status", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    renderWithProviders(<CredentialsTracker />);

    // Click "Critical" filter
    const criticalFilter = screen.getByRole("button", {
      name: /critical.*\(3\)/i,
    });
    await user.click(criticalFilter);

    // Should only show critical credentials (3 total)
    // Verify by checking that expired credential is not shown
    expect(screen.queryByText(/HP-\*\*\*\*-0012/)).not.toBeInTheDocument(); // expired credential
  });

  it("should show export button", () => {
    renderWithProviders(<CredentialsTracker />);

    // Should show export button
    expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument();
  });
});
