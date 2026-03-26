/**
 * DateRangePicker Refactored Tests
 * Tests verify behavior through public interface
 */

import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import { DateRangePicker } from "@/components/date-range-picker";

describe("DateRangePicker - Named Export and Size Variants", () => {
  it("renders with named export and default size", () => {
    renderWithProviders(<DateRangePicker />);

    // Should render a button trigger
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Should have default size class (h-7 from Button component)
    expect(button).toHaveClass("h-7");
  });

  it("renders with sm size variant", () => {
    renderWithProviders(<DateRangePicker size="sm" />);

    const button = screen.getByRole("button");

    // Should have sm size class (h-6 from Button component)
    expect(button).toHaveClass("h-6");
  });

  it("renders with lg size variant", () => {
    renderWithProviders(<DateRangePicker size="lg" />);

    const button = screen.getByRole("button");

    // Should have lg size class (h-8 from Button component)
    expect(button).toHaveClass("h-8");
  });
});

describe("DateRangePicker - Apply and Cancel Behavior", () => {
  it("calls onUpdate with selected range when Apply is clicked", async () => {
    const user = userEvent.setup();
    let updateCalled = false;
    let capturedValues: any = null;

    renderWithProviders(
      <DateRangePicker
        onUpdate={(values) => {
          updateCalled = true;
          capturedValues = values;
        }}
      />,
    );

    // Open popover
    const button = screen.getByRole("button");
    await user.click(button);

    // Click Apply button
    const applyButton = screen.getByText("Apply");
    await user.click(applyButton);

    // Should have called onUpdate
    expect(updateCalled).toBe(true);
    expect(capturedValues).toHaveProperty("range");
    expect(capturedValues).toHaveProperty("isComparing");
  });

  it("closes popover without calling onUpdate when Cancel is clicked", async () => {
    const user = userEvent.setup();
    let updateCalled = false;

    renderWithProviders(
      <DateRangePicker
        onUpdate={() => {
          updateCalled = true;
        }}
      />,
    );

    // Open popover
    const button = screen.getByRole("button");
    await user.click(button);

    // Click Cancel button
    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);

    // Should NOT have called onUpdate
    expect(updateCalled).toBe(false);

    // Popover should be closed (Apply button should not be visible)
    expect(screen.queryByText("Apply")).not.toBeInTheDocument();
  });
});

describe("DateRangePicker - Compare Functionality", () => {
  it("shows compare toggle when showCompare is true", () => {
    renderWithProviders(<DateRangePicker showCompare={true} />);

    // Open popover
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Should have Compare switch/toggle
    expect(screen.getByText("Compare")).toBeInTheDocument();
  });

  it("shows compare toggle by default when showCompare is undefined", () => {
    renderWithProviders(<DateRangePicker />);

    // Open popover
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Should have Compare switch/toggle (default is true)
    expect(screen.getByText("Compare")).toBeInTheDocument();
  });

  it("hides compare toggle when showCompare is false", () => {
    renderWithProviders(<DateRangePicker showCompare={false} />);

    // Open popover
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Should NOT have Compare switch/toggle
    expect(screen.queryByText("Compare")).not.toBeInTheDocument();
  });

  it("expands compare section when compare switch is toggled on", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DateRangePicker showCompare={true} />);

    // Open popover
    const button = screen.getByRole("button");
    await user.click(button);

    // Initially, compare mode buttons should not be visible
    expect(screen.queryByText("Previous Period")).not.toBeInTheDocument();

    // Toggle compare on
    const compareSwitch = screen.getByRole("switch");
    await user.click(compareSwitch);

    // Compare section should expand and show mode buttons
    expect(screen.getByText("Previous Period")).toBeInTheDocument();
    expect(screen.getByText("Previous Year")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("auto-calculates previous period compare dates when compare is enabled", async () => {
    const user = userEvent.setup();
    let capturedValues: any = null;

    const startDate = new Date(2025, 2, 15); // March 15, 2025
    const endDate = new Date(2025, 2, 22); // March 22, 2025

    render(
      <DateRangePicker
        initialDateFrom={startDate}
        initialDateTo={endDate}
        onUpdate={(values) => {
          capturedValues = values;
        }}
      />,
    );

    // Open popover
    const button = screen.getByRole("button");
    await user.click(button);

    // Toggle compare on
    const compareSwitch = screen.getByRole("switch");
    await user.click(compareSwitch);

    // Click Apply
    const applyButton = screen.getByText("Apply");
    await user.click(applyButton);

    // Should have called onUpdate with compare dates
    expect(capturedValues).toBeTruthy();
    expect(capturedValues.isComparing).toBe(true);
    expect(capturedValues.rangeCompare).toBeDefined();
    expect(capturedValues.rangeCompare?.from).toBeInstanceOf(Date);
    expect(capturedValues.rangeCompare?.to).toBeInstanceOf(Date);

    // Previous period should be 7 days (March 15-22 is 7 days)
    // So compare should be March 7-14
    const compareFrom = capturedValues.rangeCompare?.from;
    const compareTo = capturedValues.rangeCompare?.to;

    expect(compareFrom?.getDate()).toBe(7);
    expect(compareFrom?.getMonth()).toBe(2); // March
    expect(compareTo?.getDate()).toBe(14);
    expect(compareTo?.getMonth()).toBe(2); // March
  });

  it("switches to previous year mode and calculates dates correctly", async () => {
    const user = userEvent.setup();
    let capturedValues: any = null;

    const startDate = new Date(2025, 2, 15); // March 15, 2025
    const endDate = new Date(2025, 2, 22); // March 22, 2025

    render(
      <DateRangePicker
        initialDateFrom={startDate}
        initialDateTo={endDate}
        onUpdate={(values) => {
          capturedValues = values;
        }}
      />,
    );

    // Open popover
    const button = screen.getByRole("button");
    await user.click(button);

    // Toggle compare on
    const compareSwitch = screen.getByRole("switch");
    await user.click(compareSwitch);

    // Click Previous Year button
    const previousYearButton = screen.getByText("Previous Year");
    await user.click(previousYearButton);

    // Click Apply
    const applyButton = screen.getByText("Apply");
    await user.click(applyButton);

    // Should have called onUpdate with previous year dates
    expect(capturedValues).toBeTruthy();
    expect(capturedValues.isComparing).toBe(true);
    expect(capturedValues.rangeCompare).toBeDefined();

    // Previous year should be March 15-22, 2024
    const compareFrom = capturedValues.rangeCompare?.from;
    const compareTo = capturedValues.rangeCompare?.to;

    expect(compareFrom?.getDate()).toBe(15);
    expect(compareFrom?.getMonth()).toBe(2); // March
    expect(compareFrom?.getFullYear()).toBe(2024);
    expect(compareTo?.getDate()).toBe(22);
    expect(compareTo?.getMonth()).toBe(2); // March
    expect(compareTo?.getFullYear()).toBe(2024);
  });

  it("shows custom compare calendar when custom mode is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DateRangePicker />);

    // Open popover
    const button = screen.getByRole("button");
    await user.click(button);

    // Toggle compare on
    const compareSwitch = screen.getByRole("switch");
    await user.click(compareSwitch);

    // Initially, custom calendar should not be visible
    expect(screen.queryByText("Compare Range")).not.toBeInTheDocument();

    // Click Custom button
    const customButton = screen.getByText("Custom");
    await user.click(customButton);

    // Custom compare calendar should now be visible
    expect(screen.getByText("Compare Range")).toBeInTheDocument();
  });

  it("collapses compare section when compare switch is toggled off", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DateRangePicker />);

    // Open popover
    const button = screen.getByRole("button");
    await user.click(button);

    // Toggle compare on
    const compareSwitch = screen.getByRole("switch");
    await user.click(compareSwitch);

    // Compare section should be visible
    expect(screen.getByText("Previous Period")).toBeInTheDocument();

    // Toggle compare off
    await user.click(compareSwitch);

    // Compare section should collapse (AnimatePresence removes it from DOM)
    // Wait for animation to complete
    await waitFor(() => {
      expect(screen.queryByText("Previous Period")).not.toBeInTheDocument();
    });
  });

  it("sends undefined rangeCompare when compare is disabled on apply", async () => {
    const user = userEvent.setup();
    let capturedValues: any = null;

    renderWithProviders(
      <DateRangePicker
        onUpdate={(values) => {
          capturedValues = values;
        }}
      />,
    );

    // Open popover
    const button = screen.getByRole("button");
    await user.click(button);

    // Toggle compare on then off
    const compareSwitch = screen.getByRole("switch");
    await user.click(compareSwitch);
    await user.click(compareSwitch);

    // Click Apply
    const applyButton = screen.getByText("Apply");
    await user.click(applyButton);

    // Should have called onUpdate with no compare dates
    expect(capturedValues).toBeTruthy();
    expect(capturedValues.isComparing).toBe(false);
    expect(capturedValues.rangeCompare).toBeUndefined();
  });

  it("displays compare date range in trigger button when comparing", () => {
    const compareFrom = new Date(2025, 2, 22);
    const compareTo = new Date(2025, 2, 22);

    renderWithProviders(
      <DateRangePicker
        initialCompareFrom={compareFrom}
        initialCompareTo={compareTo}
      />,
    );

    const button = screen.getByRole("button");

    // Should show "vs" text indicating compare mode
    expect(button.textContent).toContain("vs");
    expect(button.textContent).toContain("Mar 22, 2025");
  });

  it("shows legend with Primary and Compare indicators when comparing", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DateRangePicker />);

    // Open popover
    const button = screen.getByRole("button");
    await user.click(button);

    // Initially, legend should not be visible (only toggle label "Compare" is visible)
    expect(screen.queryByText("Primary")).not.toBeInTheDocument();
    // Note: "Compare" appears in the toggle label, so we check for "Primary" only

    // Toggle compare on
    const compareSwitch = screen.getByRole("switch");
    await user.click(compareSwitch);

    // Legend should now be visible with both Primary and Compare
    expect(screen.getByText("Primary")).toBeInTheDocument();
    // "Compare" appears twice now: in toggle label and in legend
    const compareTexts = screen.getAllByText("Compare");
    expect(compareTexts.length).toBeGreaterThanOrEqual(2);
  });
});
