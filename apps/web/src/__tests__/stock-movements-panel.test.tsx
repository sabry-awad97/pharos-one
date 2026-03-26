/**
 * StockMovementsPanel Tests
 * Tests for the Stock Movements Panel component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import { StockMovementsPanel } from "../features/modules/inventory/components/StockMovementsPanel";
import * as transactionService from "../features/modules/inventory/services/transaction.service";

// Mock the transaction service
vi.mock("../features/modules/inventory/services/transaction.service");

// Mock transaction data
const mockTransactions = [
  {
    id: 1,
    batchId: 1,
    type: "purchase" as const,
    quantity: 100,
    orderId: null,
    userId: 1,
    reason: null,
    timestamp: "2024-01-15T10:00:00Z",
    batch: {
      id: 1,
      productId: 1,
      batchNumber: "BATCH001",
      expiryDate: "2025-12-31",
      supplierId: 1,
      purchaseOrderId: null,
      receivedDate: "2024-01-15",
      costPerUnit: 10,
      quantityReceived: 100,
      quantityRemaining: 100,
      locationId: null,
      status: "available" as const,
      notes: null,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      product: {
        id: 1,
        name: "Amoxicillin 500mg",
        sku: "AMX500",
        genericName: "Amoxicillin",
        manufacturer: "PharmaCo",
        categoryId: 1,
        defaultSupplierId: 1,
        basePrice: 15,
        reorderLevel: 50,
        requiresPrescription: true,
        controlledSubstance: false,
        description: null,
        isActive: true,
        category: {
          id: 1,
          name: "Antibiotics",
          description: null,
          parentCategoryId: null,
        },
        defaultSupplier: {
          id: 1,
          name: "MedSupply Inc",
          contactPerson: null,
          email: null,
          phone: null,
          address: null,
          isActive: true,
        },
      },
      supplier: {
        id: 1,
        name: "MedSupply Inc",
        contactPerson: null,
        email: null,
        phone: null,
        address: null,
        isActive: true,
      },
    },
  },
  {
    id: 2,
    batchId: 1,
    type: "sale" as const,
    quantity: -10,
    orderId: 1,
    userId: 1,
    reason: null,
    timestamp: "2024-01-16T14:30:00Z",
    batch: {
      id: 1,
      productId: 1,
      batchNumber: "BATCH001",
      expiryDate: "2025-12-31",
      supplierId: 1,
      purchaseOrderId: null,
      receivedDate: "2024-01-15",
      costPerUnit: 10,
      quantityReceived: 100,
      quantityRemaining: 90,
      locationId: null,
      status: "available" as const,
      notes: null,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-16T14:30:00Z",
      product: {
        id: 1,
        name: "Amoxicillin 500mg",
        sku: "AMX500",
        genericName: "Amoxicillin",
        manufacturer: "PharmaCo",
        categoryId: 1,
        defaultSupplierId: 1,
        basePrice: 15,
        reorderLevel: 50,
        requiresPrescription: true,
        controlledSubstance: false,
        description: null,
        isActive: true,
        category: {
          id: 1,
          name: "Antibiotics",
          description: null,
          parentCategoryId: null,
        },
        defaultSupplier: {
          id: 1,
          name: "MedSupply Inc",
          contactPerson: null,
          email: null,
          phone: null,
          address: null,
          isActive: true,
        },
      },
      supplier: {
        id: 1,
        name: "MedSupply Inc",
        contactPerson: null,
        email: null,
        phone: null,
        address: null,
        isActive: true,
      },
    },
  },
];

describe("StockMovementsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders as inline panel", () => {
    vi.mocked(
      transactionService.fetchTransactionsByProductId,
    ).mockResolvedValue([]);

    const onClose = vi.fn();
    renderWithProviders(
      <StockMovementsPanel
        productId={1}
        productName="Amoxicillin 500mg"
        onClose={onClose}
      />,
    );

    // Should render as inline panel with distinctive classes
    const panel = document.querySelector(
      ".flex.flex-col.h-full.bg-card.border-l.border-border",
    );
    expect(panel).toBeInTheDocument();
  });

  it("displays product name in header", () => {
    vi.mocked(
      transactionService.fetchTransactionsByProductId,
    ).mockResolvedValue([]);

    const onClose = vi.fn();
    renderWithProviders(
      <StockMovementsPanel
        productId={1}
        productName="Amoxicillin 500mg"
        onClose={onClose}
      />,
    );

    expect(screen.getByText("Amoxicillin 500mg")).toBeInTheDocument();
  });

  it("displays panel header with product name and close button", () => {
    vi.mocked(
      transactionService.fetchTransactionsByProductId,
    ).mockResolvedValue([]);

    const onClose = vi.fn();
    renderWithProviders(
      <StockMovementsPanel
        productId={1}
        productName="Amoxicillin 500mg"
        onClose={onClose}
      />,
    );

    // Should have product name in header
    expect(screen.getByText("Amoxicillin 500mg")).toBeInTheDocument();

    // Should have Stock Movements title
    expect(screen.getByText("Stock Movements")).toBeInTheDocument();

    // Should have Close button
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("displays loading skeleton while fetching transactions", () => {
    vi.mocked(
      transactionService.fetchTransactionsByProductId,
    ).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    const onClose = vi.fn();
    renderWithProviders(
      <StockMovementsPanel
        productId={1}
        productName="Amoxicillin 500mg"
        onClose={onClose}
      />,
    );

    // Should show loading skeleton
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("displays error message when fetch fails", async () => {
    vi.mocked(
      transactionService.fetchTransactionsByProductId,
    ).mockRejectedValue(new Error("Failed to fetch"));

    const onClose = vi.fn();
    renderWithProviders(
      <StockMovementsPanel
        productId={1}
        productName="Amoxicillin 500mg"
        onClose={onClose}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/failed to load transactions/i),
      ).toBeInTheDocument();
    });
  });

  it("displays timeline with transactions", async () => {
    vi.mocked(
      transactionService.fetchTransactionsByProductId,
    ).mockResolvedValue(mockTransactions);

    const onClose = vi.fn();
    renderWithProviders(
      <StockMovementsPanel
        productId={1}
        productName="Amoxicillin 500mg"
        onClose={onClose}
      />,
    );

    await waitFor(() => {
      // Should display transaction types (Stock In instead of Purchase)
      expect(screen.getByText("Stock In")).toBeInTheDocument();
      expect(screen.getByText("Sale")).toBeInTheDocument();
    });
  });

  it("displays transaction count in footer", async () => {
    vi.mocked(
      transactionService.fetchTransactionsByProductId,
    ).mockResolvedValue(mockTransactions);

    const onClose = vi.fn();
    renderWithProviders(
      <StockMovementsPanel
        productId={1}
        productName="Amoxicillin 500mg"
        onClose={onClose}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/2.*transactions/i)).toBeInTheDocument();
    });
  });

  it("calls onClose when close button is clicked", async () => {
    vi.mocked(
      transactionService.fetchTransactionsByProductId,
    ).mockResolvedValue([]);

    const onClose = vi.fn();
    renderWithProviders(
      <StockMovementsPanel
        productId={1}
        productName="Amoxicillin 500mg"
        onClose={onClose}
      />,
    );

    // Click the close button (X)
    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    // Should have called onClose
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
