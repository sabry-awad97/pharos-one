/**
 * Transaction data service (INTERNAL)
 * Handles stock transaction data fetching
 *
 * @internal - Do not import directly, use hooks from main index
 */

import {
  stockTransactionWithRelationsSchema,
  stockTransactionsWithRelationsArraySchema,
  type StockTransactionWithRelations,
} from "../schema";

// Mock transactions - will be replaced with API calls
const MOCK_TRANSACTIONS: StockTransactionWithRelations[] = [
  {
    id: 1,
    batchId: 1,
    type: "purchase",
    quantity: 150,
    orderId: null,
    userId: 1,
    reason: "Initial stock receipt",
    timestamp: "2024-01-10T10:00:00Z",
    batch: {
      id: 1,
      productId: 1,
      batchNumber: "AMX-2024-001",
      expiryDate: "2026-03-15",
      supplierId: 1,
      purchaseOrderId: 1001,
      receivedDate: "2024-01-10",
      costPerUnit: 10.0,
      quantityReceived: 150,
      quantityRemaining: 150,
      locationId: 1,
      status: "available",
      notes: null,
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2024-01-10T10:00:00Z",
      product: {
        id: 1,
        name: "Amoxicillin 500mg",
        sku: "AMX-500",
        genericName: "Amoxicillin",
        manufacturer: "PharmaCorp",
        categoryId: 1,
        defaultSupplierId: 1,
        basePrice: 12.5,
        reorderLevel: 50,
        requiresPrescription: true,
        controlledSubstance: false,
        description: "Antibiotic for bacterial infections",
        isActive: true,
        category: {
          id: 1,
          name: "Antibiotic",
          description: "Antibacterial medications",
          parentCategoryId: null,
        },
        defaultSupplier: {
          id: 1,
          name: "MedSupply Co",
          contactPerson: "John Smith",
          email: "john@medsupply.com",
          phone: "+1-555-0101",
          address: null,
          isActive: true,
        },
      },
      supplier: {
        id: 1,
        name: "MedSupply Co",
        contactPerson: "John Smith",
        email: "john@medsupply.com",
        phone: "+1-555-0101",
        address: null,
        isActive: true,
      },
    },
  },
  {
    id: 2,
    batchId: 1,
    type: "sale",
    quantity: -10,
    orderId: 5001,
    userId: 2,
    reason: null,
    timestamp: "2024-01-15T14:30:00Z",
    batch: {
      id: 1,
      productId: 1,
      batchNumber: "AMX-2024-001",
      expiryDate: "2026-03-15",
      supplierId: 1,
      purchaseOrderId: 1001,
      receivedDate: "2024-01-10",
      costPerUnit: 10.0,
      quantityReceived: 150,
      quantityRemaining: 140,
      locationId: 1,
      status: "available",
      notes: null,
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2024-01-15T14:30:00Z",
      product: {
        id: 1,
        name: "Amoxicillin 500mg",
        sku: "AMX-500",
        genericName: "Amoxicillin",
        manufacturer: "PharmaCorp",
        categoryId: 1,
        defaultSupplierId: 1,
        basePrice: 12.5,
        reorderLevel: 50,
        requiresPrescription: true,
        controlledSubstance: false,
        description: "Antibiotic for bacterial infections",
        isActive: true,
        category: {
          id: 1,
          name: "Antibiotic",
          description: "Antibacterial medications",
          parentCategoryId: null,
        },
        defaultSupplier: {
          id: 1,
          name: "MedSupply Co",
          contactPerson: "John Smith",
          email: "john@medsupply.com",
          phone: "+1-555-0101",
          address: null,
          isActive: true,
        },
      },
      supplier: {
        id: 1,
        name: "MedSupply Co",
        contactPerson: "John Smith",
        email: "john@medsupply.com",
        phone: "+1-555-0101",
        address: null,
        isActive: true,
      },
    },
  },
];

/**
 * Fetch transactions for a specific product
 * TODO: Replace with actual API call
 *
 * @throws {Error} If data validation fails
 */
export async function fetchTransactionsByProductId(
  productId: number,
): Promise<StockTransactionWithRelations[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Filter transactions by product ID through batch relation
  const transactions = MOCK_TRANSACTIONS.filter(
    (t) => t.batch.productId === productId,
  );

  // Validate data with Zod schema
  const result =
    stockTransactionsWithRelationsArraySchema.safeParse(transactions);

  if (!result.success) {
    console.error("Transaction data validation failed:", result.error);
    throw new Error("Invalid transaction data format");
  }

  return result.data;
}
