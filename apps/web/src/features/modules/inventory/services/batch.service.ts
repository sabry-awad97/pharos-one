/**
 * Batch data service (INTERNAL)
 * Handles physical stock batch data fetching
 *
 * @internal - Do not import directly, use hooks from main index
 */

import {
  batchWithRelationsSchema,
  batchesWithRelationsArraySchema,
  type BatchWithRelations,
} from "../schema";

// Mock batches - will be replaced with API calls
const MOCK_BATCHES: BatchWithRelations[] = [
  {
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
  {
    id: 2,
    productId: 1,
    batchNumber: "AMX-2024-002",
    expiryDate: "2026-06-20",
    supplierId: 1,
    purchaseOrderId: 1005,
    receivedDate: "2024-02-15",
    costPerUnit: 9.5,
    quantityReceived: 100,
    quantityRemaining: 90,
    locationId: 1,
    status: "available",
    notes: null,
    createdAt: "2024-02-15T14:30:00Z",
    updatedAt: "2024-02-15T14:30:00Z",
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
];

/**
 * Fetch all batches with populated relations
 * TODO: Replace with actual API call
 *
 * @throws {Error} If data validation fails
 */
export async function fetchBatches(): Promise<BatchWithRelations[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Validate data with Zod schema
  const result = batchesWithRelationsArraySchema.safeParse(MOCK_BATCHES);

  if (!result.success) {
    console.error("Batch data validation failed:", result.error);
    throw new Error("Invalid batch data format");
  }

  return result.data;
}

/**
 * Fetch batches for a specific product
 * TODO: Replace with actual API call
 *
 * @throws {Error} If data validation fails
 */
export async function fetchBatchesByProductId(
  productId: number,
): Promise<BatchWithRelations[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const batches = MOCK_BATCHES.filter((b) => b.productId === productId);

  // Validate data with Zod schema
  const result = batchesWithRelationsArraySchema.safeParse(batches);

  if (!result.success) {
    console.error("Batch data validation failed:", result.error);
    throw new Error("Invalid batch data format");
  }

  return result.data;
}

/**
 * Fetch single batch by ID with populated relations
 * TODO: Replace with actual API call
 *
 * @throws {Error} If data validation fails
 */
export async function fetchBatchById(
  id: number,
): Promise<BatchWithRelations | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const batch = MOCK_BATCHES.find((b) => b.id === id);

  if (!batch) {
    return null;
  }

  // Validate single batch with Zod schema
  const result = batchWithRelationsSchema.safeParse(batch);

  if (!result.success) {
    console.error("Batch data validation failed:", result.error);
    throw new Error("Invalid batch data format");
  }

  return result.data;
}
