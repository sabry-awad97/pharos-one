/**
 * DateRangePicker Size Variants Tests
 * Tests for CVA size variant support
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DateRangePicker } from "@pharos-one/ui/components/date-range-picker";
import { DateRangeFilter } from "../features/modules/inventory/components/filters/DateRangeFilter";

describe("DateRangePicker - Size Variants", () => {
  it("renders with sm size variant", () => {
    render(<DateRangePicker size="sm" />);

    // Find the trigger button
    const button = screen.getByRole("button");

    // Should have h-6 class for sm size (matching Button size="sm")
    expect(button).toHaveClass("h-6");
  });

  it("renders with default size variant", () => {
    render(<DateRangePicker />);

    // Find the trigger button
    const button = screen.getByRole("button");

    // Should have h-7 class for default size (matching Button size="default")
    expect(button).toHaveClass("h-7");
  });

  it("renders with lg size variant", () => {
    render(<DateRangePicker size="lg" />);

    // Find the trigger button
    const button = screen.getByRole("button");

    // Should have h-8 class for lg size (matching Button size="lg")
    expect(button).toHaveClass("h-8");
  });
});

describe("DateRangeFilter - Size Integration", () => {
  it("defaults to sm size for filter context", () => {
    render(
      <DateRangeFilter dateFrom={null} dateTo={null} onChange={() => {}} />,
    );

    // Find the trigger button
    const button = screen.getByRole("button");

    // Should have h-6 class for sm size
    expect(button).toHaveClass("h-6");
  });

  it("accepts custom size prop", () => {
    render(
      <DateRangeFilter
        dateFrom={null}
        dateTo={null}
        onChange={() => {}}
        size="lg"
      />,
    );

    // Find the trigger button
    const button = screen.getByRole("button");

    // Should have h-8 class for lg size
    expect(button).toHaveClass("h-8");
  });
});
