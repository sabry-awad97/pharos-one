/**
 * Integration tests for transaction filter components
 * Tests behavior through public interface
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { TransactionTypeFilter } from "../features/modules/inventory/components/filters/TransactionTypeFilter";
import { DateRangeFilter } from "../features/modules/inventory/components/filters/DateRangeFilter";
import type { TransactionType } from "../features/modules/inventory/schema";

describe("TransactionTypeFilter", () => {
  test("renders with default state", () => {
    const onChange = vi.fn();
    render(<TransactionTypeFilter value={[]} onChange={onChange} />);

    const button = screen.getByRole("button", { name: /type/i });
    expect(button).toBeInTheDocument();
  });

  test("shows selected count badge when types are selected", () => {
    const onChange = vi.fn();
    const selectedTypes: TransactionType[] = ["purchase", "sale"];
    render(<TransactionTypeFilter value={selectedTypes} onChange={onChange} />);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("opens popover when clicked", async () => {
    const onChange = vi.fn();
    render(<TransactionTypeFilter value={[]} onChange={onChange} />);

    const button = screen.getByRole("button", { name: /type/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Purchase")).toBeInTheDocument();
      expect(screen.getByText("Sale")).toBeInTheDocument();
      expect(screen.getByText("Adjustment")).toBeInTheDocument();
    });
  });

  test("calls onChange when type is selected", async () => {
    const onChange = vi.fn();
    render(<TransactionTypeFilter value={[]} onChange={onChange} />);

    const button = screen.getByRole("button", { name: /type/i });
    fireEvent.click(button);

    await waitFor(() => {
      const purchaseOption = screen.getByText("Purchase");
      fireEvent.click(purchaseOption);
    });

    expect(onChange).toHaveBeenCalledWith(["purchase"]);
  });

  test("calls onChange when type is deselected", async () => {
    const onChange = vi.fn();
    const selectedTypes: TransactionType[] = ["purchase", "sale"];
    render(<TransactionTypeFilter value={selectedTypes} onChange={onChange} />);

    const button = screen.getByRole("button", { name: /type/i });
    fireEvent.click(button);

    await waitFor(() => {
      const purchaseOption = screen.getByText("Purchase");
      fireEvent.click(purchaseOption);
    });

    expect(onChange).toHaveBeenCalledWith(["sale"]);
  });

  test("allows multiple type selection", async () => {
    const onChange = vi.fn();
    render(<TransactionTypeFilter value={["purchase"]} onChange={onChange} />);

    const button = screen.getByRole("button", { name: /type/i });
    fireEvent.click(button);

    await waitFor(() => {
      const saleOption = screen.getByText("Sale");
      fireEvent.click(saleOption);
    });

    expect(onChange).toHaveBeenCalledWith(["purchase", "sale"]);
  });
});

describe("DateRangeFilter", () => {
  test("renders with default state", () => {
    const onChange = vi.fn();
    render(
      <DateRangeFilter dateFrom={null} dateTo={null} onChange={onChange} />,
    );

    const button = screen.getByRole("button", { name: /date range/i });
    expect(button).toBeInTheDocument();
  });

  test("displays selected date range", () => {
    const onChange = vi.fn();
    const dateFrom = new Date("2024-01-01");
    const dateTo = new Date("2024-01-31");

    render(
      <DateRangeFilter
        dateFrom={dateFrom}
        dateTo={dateTo}
        onChange={onChange}
      />,
    );

    expect(screen.getByText(/1\/1\/2024.*1\/31\/2024/)).toBeInTheDocument();
  });

  test("displays 'From' date when only dateFrom is set", () => {
    const onChange = vi.fn();
    const dateFrom = new Date("2024-01-01");

    render(
      <DateRangeFilter dateFrom={dateFrom} dateTo={null} onChange={onChange} />,
    );

    expect(screen.getByText(/From 1\/1\/2024/)).toBeInTheDocument();
  });

  test("displays 'Until' date when only dateTo is set", () => {
    const onChange = vi.fn();
    const dateTo = new Date("2024-01-31");

    render(
      <DateRangeFilter dateFrom={null} dateTo={dateTo} onChange={onChange} />,
    );

    expect(screen.getByText(/Until 1\/31\/2024/)).toBeInTheDocument();
  });

  test("opens calendar popover when clicked", async () => {
    const onChange = vi.fn();
    render(
      <DateRangeFilter dateFrom={null} dateTo={null} onChange={onChange} />,
    );

    const button = screen.getByRole("button", { name: /date range/i });
    fireEvent.click(button);

    await waitFor(() => {
      // Calendar popover should be visible (role="dialog")
      const popover = screen.getByRole("dialog");
      expect(popover).toBeInTheDocument();
    });
  });
});

describe("Filter Integration", () => {
  test("filters work together correctly", () => {
    const typeOnChange = vi.fn();
    const dateOnChange = vi.fn();

    render(
      <div>
        <TransactionTypeFilter value={["purchase"]} onChange={typeOnChange} />
        <DateRangeFilter
          dateFrom={new Date("2024-01-01")}
          dateTo={new Date("2024-01-31")}
          onChange={dateOnChange}
        />
      </div>,
    );

    // Both filters should be rendered
    expect(screen.getByText("1")).toBeInTheDocument(); // Type filter badge
    expect(screen.getByText(/1\/1\/2024.*1\/31\/2024/)).toBeInTheDocument(); // Date range
  });
});
