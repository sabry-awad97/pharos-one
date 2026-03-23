/**
 * Component tests for TimelineItem
 * Verifies that TimelineItem displays batch data correctly after transaction joins implementation
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimelineItem } from "../TimelineItem";
import type { StockTransactionWithRelations } from "../../../schema";

describe("TimelineItem Component", () => {
  /**
   * Test 9: TimelineItem displays actual batch data (not fallbacks)
   * Verifies that the component shows real batch numbers and quantities
   * now that transactions include populated batch relations
   */
  it("displays actual batch number and quantity from joined data", () => {
    const mockTransaction: StockTransactionWithRelations = {
      id: 1,
      batchId: 100,
      type: "sale",
      quantity: -5,
      orderId: null,
      timestamp: "2024-01-15T10:30:00.000Z",
      userId: 1,
      reason: "Customer purchase",
      batch: {
        id: 100,
        batchNumber: "BATCH-2024-001",
        productId: 1,
        quantityRemaining: 45,
        quantityReceived: 50,
        costPerUnit: 10.5,
        expiryDate: "2025-01-15",
        supplierId: 1,
        purchaseOrderId: null,
        receivedDate: "2024-01-01",
        locationId: null,
        status: "available" as const,
        notes: null,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        product: {
          id: 1,
          name: "Test Product",
          sku: "TEST-001",
          genericName: null,
          manufacturer: null,
          description: "Test product description",
          categoryId: 1,
          defaultSupplierId: 1,
          basePrice: 10.5,
          reorderLevel: 10,
          requiresPrescription: false,
          controlledSubstance: false,
          isActive: true,
          category: {
            id: 1,
            name: "Test Category",
            description: "Test category description",
            parentCategoryId: null,
          },
          defaultSupplier: {
            id: 1,
            name: "Test Supplier",
            contactPerson: "John Doe",
            email: "john@supplier.com",
            phone: "123-456-7890",
            address: "123 Supplier St",
            isActive: true,
          },
        },
        supplier: {
          id: 1,
          name: "Test Supplier",
          contactPerson: "John Doe",
          email: "john@supplier.com",
          phone: "123-456-7890",
          address: "123 Supplier St",
          isActive: true,
        },
      },
    };

    render(<TimelineItem transaction={mockTransaction} />);

    // CRITICAL: Verify actual batch number is displayed (not "Batch #100" fallback)
    expect(screen.getByText("BATCH-2024-001")).toBeInTheDocument();

    // Open details to check quantity
    const detailsToggle = screen.getByText("View Details");
    detailsToggle.click();

    // CRITICAL: Verify actual quantity is displayed (not "N/A" fallback)
    expect(screen.getByText("45")).toBeInTheDocument();
  });

  /**
   * Test 10: TimelineItem handles null batch gracefully
   * Verifies that the component doesn't crash when batch is null
   * and shows appropriate fallback values
   */
  it("handles null batch data gracefully with fallbacks", () => {
    const mockTransaction: StockTransactionWithRelations = {
      id: 2,
      batchId: 200,
      type: "adjustment",
      quantity: 3,
      orderId: null,
      timestamp: "2024-01-16T14:20:00.000Z",
      userId: 1,
      reason: "Inventory correction",
      batch: null, // Simulate transaction with missing batch
    };

    render(<TimelineItem transaction={mockTransaction} />);

    // CRITICAL: Component should not crash with null batch
    expect(screen.getByText("Inventory correction")).toBeInTheDocument();

    // Open details to check fallback behavior
    const detailsToggle = screen.getByText("View Details");
    detailsToggle.click();

    // CRITICAL: Verify fallback values are shown for null batch
    expect(screen.getByText("N/A")).toBeInTheDocument(); // Balance
    expect(screen.getByText("Batch #200")).toBeInTheDocument(); // Reference fallback
  });
});
