/**
 * Inventory domain types
 * Shared type definitions for inventory feature
 */

import { z } from "zod";

// Supplier schema - will be a separate table
export const supplierSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  contactPerson: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Category schema - will be a separate table
export const categorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  description: z.string().optional(),
  parentCategoryId: z.number().int().positive().nullable().optional(),
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
  status: drugStatusSchema.optional(),
  categoryId: z.number().int().positive().optional(),
  supplierId: z.number().int().positive().optional(),
  search: z.string().optional(),
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
