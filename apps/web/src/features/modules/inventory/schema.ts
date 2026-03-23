/**
 * Inventory domain types
 * Shared type definitions for inventory feature
 *
 * ARCHITECTURE: Product-Batch-Transaction separation
 * - Product: Master catalog (what you CAN sell)
 * - Batch: Physical stock with expiry/lot tracking (what you HAVE)
 * - Transaction: Audit trail (what you DID)
 *
 * CONVENTION: Use .nullable() instead of .optional()
 * - nullable() = field exists but can be null (database NULL)
 * - optional() = field may not exist in object (avoid this)
 */

import { z } from "zod";

// ============================================================================
// MASTER DATA SCHEMAS
// ============================================================================

// Supplier schema - separate table
export const supplierSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  contactPerson: z.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  isActive: z.boolean().default(true),
});

// Category schema - separate table
export const categorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  description: z.string().nullable(),
  parentCategoryId: z.number().int().positive().nullable(),
});

// ============================================================================
// PRODUCT SCHEMA (Master Catalog)
// ============================================================================

export const productSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  sku: z.string().min(1), // Unique product identifier
  genericName: z.string().nullable(),
  manufacturer: z.string().nullable(),
  categoryId: z.number().int().positive(),
  defaultSupplierId: z.number().int().positive().nullable(),
  basePrice: z.number().positive(), // Selling price
  reorderLevel: z.number().int().nonnegative(), // When to reorder
  requiresPrescription: z.boolean().default(false),
  controlledSubstance: z.boolean().default(false),
  description: z.string().nullable(),
  isActive: z.boolean().default(true),
});

// Product with relations (from TanStack DB joins)
// NOTE: Left joins return fields with undefined in their types
export const productWithRelationsSchema = productSchema.extend({
  category: categorySchema
    .extend({
      id: z.number().int().positive().optional(),
      name: z.string().min(1).optional(),
      description: z.string().nullable().optional(),
      parentCategoryId: z.number().int().positive().nullable().optional(),
    })
    .nullable(),
  defaultSupplier: supplierSchema
    .extend({
      id: z.number().int().positive().optional(),
      name: z.string().min(1).optional(),
      contactPerson: z.string().nullable().optional(),
      email: z.string().email().nullable().optional(),
      phone: z.string().nullable().optional(),
      address: z.string().nullable().optional(),
      isActive: z.boolean().default(true).optional(),
    })
    .nullable(),
});

// ============================================================================
// BATCH SCHEMA (Physical Stock)
// ============================================================================

export const batchStatusSchema = z.enum([
  "available", // Normal stock
  "reserved", // Allocated to order
  "quarantine", // Quality check
  "expired", // Past expiry
  "recalled", // Manufacturer recall
]);

export const batchSchema = z.object({
  id: z.number().int().positive(),
  productId: z.number().int().positive(), // FK to Product
  batchNumber: z.string().min(1), // Lot number from supplier
  expiryDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expiry must be YYYY-MM-DD"),

  // Purchase details
  supplierId: z.number().int().positive(),
  purchaseOrderId: z.number().int().positive().nullable(),
  receivedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  costPerUnit: z.number().positive(), // Actual purchase cost

  // Quantity tracking
  quantityReceived: z.number().int().positive(),
  quantityRemaining: z.number().int().nonnegative(),

  // Location & status
  locationId: z.number().int().positive().nullable(),
  status: batchStatusSchema,

  // Metadata
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Batch with relations
export const batchWithRelationsSchema = batchSchema.extend({
  product: productWithRelationsSchema,
  supplier: supplierSchema,
});

// ============================================================================
// STOCK TRANSACTION SCHEMA (Audit Trail)
// ============================================================================

export const transactionTypeSchema = z.enum([
  "purchase", // Receiving new stock
  "sale", // Customer purchase
  "adjustment", // Manual correction
  "transfer", // Between locations
  "return", // Customer return
  "damage", // Damaged/destroyed
  "expiry", // Expired removal
]);

export const stockTransactionSchema = z.object({
  id: z.number().int().positive(),
  batchId: z.number().int().positive(),
  type: transactionTypeSchema,
  quantity: z.number().int(), // Positive = add, Negative = remove

  // References
  orderId: z.number().int().positive().nullable(), // For sales
  userId: z.number().int().positive(), // Who performed action

  // Details
  reason: z.string().nullable(),
  timestamp: z.string().datetime(),
});

// Stock transaction with relations
export const stockTransactionWithRelationsSchema =
  stockTransactionSchema.extend({
    batch: batchWithRelationsSchema.nullable(),
  });

// ============================================================================
// COMPUTED VIEWS
// ============================================================================

// Product with aggregated stock info (for inventory list)
export const productStockSummarySchema = productWithRelationsSchema.extend({
  totalQuantity: z.number().int().nonnegative(),
  availableQuantity: z.number().int().nonnegative(),
  reservedQuantity: z.number().int().nonnegative(),
  nearestExpiry: z.string().nullable(), // Earliest expiry date
  batchCount: z.number().int().nonnegative(),
  stockStatus: z.enum(["ok", "low", "expiring", "out"]),
});

// ============================================================================
// FILTERS
// ============================================================================

export const inventoryFiltersSchema = z.object({
  status: batchStatusSchema.nullable(),
  categoryId: z.number().int().positive().nullable(),
  supplierId: z.number().int().positive().nullable(),
  search: z.string().nullable(),
  expiringWithinDays: z.number().int().positive().nullable(),
});

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

export type Supplier = z.infer<typeof supplierSchema>;
export type Category = z.infer<typeof categorySchema>;

export type Product = z.infer<typeof productSchema>;
export type ProductWithRelations = z.infer<typeof productWithRelationsSchema>;

export type BatchStatus = z.infer<typeof batchStatusSchema>;
export type Batch = z.infer<typeof batchSchema>;
export type BatchWithRelations = z.infer<typeof batchWithRelationsSchema>;

export type TransactionType = z.infer<typeof transactionTypeSchema>;
export type StockTransaction = z.infer<typeof stockTransactionSchema>;
export type StockTransactionWithRelations = z.infer<
  typeof stockTransactionWithRelationsSchema
>;

export type ProductStockSummary = z.infer<typeof productStockSummarySchema>;
export type InventoryFilters = z.infer<typeof inventoryFiltersSchema>;

// ============================================================================
// ARRAY SCHEMAS
// ============================================================================

export const suppliersArraySchema = z.array(supplierSchema);
export const categoriesArraySchema = z.array(categorySchema);
export const productsArraySchema = z.array(productSchema);
export const productsWithRelationsArraySchema = z.array(
  productWithRelationsSchema,
);
export const batchesArraySchema = z.array(batchSchema);
export const batchesWithRelationsArraySchema = z.array(
  batchWithRelationsSchema,
);
export const stockTransactionsArraySchema = z.array(stockTransactionSchema);
export const stockTransactionsWithRelationsArraySchema = z.array(
  stockTransactionWithRelationsSchema,
);
export const productStockSummariesArraySchema = z.array(
  productStockSummarySchema,
);
