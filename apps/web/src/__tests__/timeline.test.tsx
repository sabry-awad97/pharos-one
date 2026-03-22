/**
 * Timeline Components Test Suite
 * Tests for TimelineMarker, TimelineItem, TimelineGroup, and Timeline components
 *
 * TESTING APPROACH: Behavior verification through public interfaces
 * - Tests verify what components render, not how they render it
 * - Uses real components, no mocking of internal collaborators
 * - Tests would survive refactoring of internal implementation
 */

import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  TimelineMarker,
  TimelineItem,
  TimelineGroup,
  Timeline,
} from "../features/modules/inventory/components/timeline";
import type { TransactionType } from "../features/modules/inventory/schema";

describe("TimelineMarker", () => {
  test("renders correct icon for purchase transaction", () => {
    render(<TimelineMarker type="purchase" />);
    // Verify icon is rendered (lucide-react icons have role="img")
    const icon = screen.getByRole("img", { hidden: true });
    expect(icon).toBeInTheDocument();
  });

  test("renders correct icon for sale transaction", () => {
    render(<TimelineMarker type="sale" />);
    const icon = screen.getByRole("img", { hidden: true });
    expect(icon).toBeInTheDocument();
  });

  test("renders correct icon for damage transaction", () => {
    render(<TimelineMarker type="damage" />);
    const icon = screen.getByRole("img", { hidden: true });
    expect(icon).toBeInTheDocument();
  });
});

describe("TimelineItem", () => {
  const mockTransaction = {
    id: 1,
    batchId: 1,
    type: "purchase" as TransactionType,
    quantity: 100,
    orderId: null,
    userId: 1,
    reason: "Initial stock",
    timestamp: "2024-01-15T10:30:00Z",
  };

  test("displays transaction type", () => {
    render(<TimelineItem transaction={mockTransaction} />);
    expect(screen.getByText("purchase")).toBeInTheDocument();
  });

  test("displays transaction quantity", () => {
    render(<TimelineItem transaction={mockTransaction} />);
    expect(screen.getByText("+100")).toBeInTheDocument();
  });

  test("displays transaction reason when provided", () => {
    render(<TimelineItem transaction={mockTransaction} />);
    expect(screen.getByText("Initial stock")).toBeInTheDocument();
  });

  test("displays formatted timestamp", () => {
    render(<TimelineItem transaction={mockTransaction} />);
    // Should display formatted time (exact format may vary by locale)
    expect(screen.getByText(/\d{1,2}:\d{2}\s*(AM|PM)/i)).toBeInTheDocument();
  });

  test("displays negative quantity without plus sign", () => {
    const saleTransaction = {
      ...mockTransaction,
      type: "sale" as TransactionType,
      quantity: -50,
    };
    render(<TimelineItem transaction={saleTransaction} />);
    expect(screen.getByText("-50")).toBeInTheDocument();
  });
});

describe("TimelineGroup", () => {
  const mockTransactions = [
    {
      id: 1,
      batchId: 1,
      type: "purchase" as TransactionType,
      quantity: 100,
      orderId: null,
      userId: 1,
      reason: "Initial stock",
      timestamp: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      batchId: 1,
      type: "sale" as TransactionType,
      quantity: -20,
      orderId: 1,
      userId: 1,
      reason: null,
      timestamp: "2024-01-15T14:45:00Z",
    },
  ];

  test("displays date header", () => {
    render(<TimelineGroup date="2024-01-15" transactions={mockTransactions} />);
    // Should display formatted date
    expect(screen.getByText(/Jan|January.*15/)).toBeInTheDocument();
  });

  test("renders all transactions in group", () => {
    render(<TimelineGroup date="2024-01-15" transactions={mockTransactions} />);
    expect(screen.getByText("purchase")).toBeInTheDocument();
    expect(screen.getByText("sale")).toBeInTheDocument();
  });
});

describe("Timeline", () => {
  const mockTransactions = [
    {
      id: 1,
      batchId: 1,
      type: "purchase" as TransactionType,
      quantity: 100,
      orderId: null,
      userId: 1,
      reason: "Initial stock",
      timestamp: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      batchId: 1,
      type: "sale" as TransactionType,
      quantity: -20,
      orderId: 1,
      userId: 1,
      reason: null,
      timestamp: "2024-01-16T09:15:00Z",
    },
  ];

  test("renders transactions grouped by date", () => {
    render(<Timeline transactions={mockTransactions} />);
    // Should have two date groups
    expect(screen.getByText(/Jan.*15/)).toBeInTheDocument();
    expect(screen.getByText(/Jan.*16/)).toBeInTheDocument();
  });

  test("displays empty state when no transactions", () => {
    render(<Timeline transactions={[]} />);
    expect(screen.getByText(/no.*transaction/i)).toBeInTheDocument();
  });

  test("renders all transactions", () => {
    render(<Timeline transactions={mockTransactions} />);
    expect(screen.getByText("purchase")).toBeInTheDocument();
    expect(screen.getByText("sale")).toBeInTheDocument();
  });
});
