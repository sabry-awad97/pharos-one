/**
 * Inventory domain types
 * Shared type definitions for inventory feature
 *
 * CONVENTION: Use .nullable() instead of .optional()
 * - nullable() = field exists but can be null (database NULL)
 * - optional() = field may not exist in object (avoid this)
 */

import { z } from "zod";

// Supplier schema - will be a separate table
export const supplierSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  contactPerson: z.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  isActive: z.boolean().default(true),
});

// Category schema - will be a separate table
export const categorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  description: z.string().nullable(),
  parentCategoryId: z.number().int().positive().nullable(),
});

// Drug status enum
export const drugStatusSchema = z.enum(["ok", "low", "expiring", "out"]);

// Drug schema with foreign key references
export const drugSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  sku: z.string().min(1),
  stock: z.number().int().nonnegative(),
  expiry: z.string().regex(/^\d{4}-\d{2}$/, "Expiry must be in YYYY-MM format"),
  price: z.number().positive(),
  categoryId: z.number().int().positive(), // Foreign key to category
  supplierId: z.number().int().positive(), // Foreign key to supplier
  status: drugStatusSchema,
});

// Extended drug schema with populated relations (for API responses)
export const drugWithRelationsSchema = drugSchema.extend({
  category: categorySchema,
  supplier: supplierSchema,
});

// Inventory filters
export const inventoryFiltersSchema = z.object({
  status: drugStatusSchema.nullable(),
  categoryId: z.number().int().positive().nullable(),
  supplierId: z.number().int().positive().nullable(),
  search: z.string().nullable(),
});

// TypeScript types inferred from schemas
export type Supplier = z.infer<typeof supplierSchema>;
export type Category = z.infer<typeof categorySchema>;
export type DrugStatus = z.infer<typeof drugStatusSchema>;
export type Drug = z.infer<typeof drugSchema>;
export type DrugWithRelations = z.infer<typeof drugWithRelationsSchema>;
export type InventoryFilters = z.infer<typeof inventoryFiltersSchema>;

// Array schemas
export const suppliersArraySchema = z.array(supplierSchema);
export const categoriesArraySchema = z.array(categorySchema);
export const drugsArraySchema = z.array(drugSchema);
export const drugsWithRelationsArraySchema = z.array(drugWithRelationsSchema);
