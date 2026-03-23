/**
 * Inventory Schema Definitions
 *
 * IMPORTANT CONVENTIONS FOR FUTURE DEVELOPERS:
 *
 * 1. ALWAYS USE snake_case FOR ALL FIELD NAMES
 *    - Rust backend uses snake_case and does NOT use #[serde(rename_all = "camelCase")]
 *    - Field names must match exactly between TypeScript and Rust
 *    - Example: use `product_type_id` NOT `productTypeId`
 *
 * 2. DO NOT USE .optional() FOR NULLABLE FIELDS
 *    - Use .nullable() for fields that can be null in the database
 *    - Use .optional() ONLY for fields that can be omitted in create/update DTOs
 *    - Rust Option<T> serializes as null, not as missing field
 *    - Example: `description: z.string().nullable()` NOT `.optional()`
 *
 * 3. BRANDED TYPES
 *    - All base types (Id, DateTime, Date, Decimal) are branded for type safety
 *    - Import from "./utils" to use these branded types
 *    - This prevents accidental mixing of similar string/number types
 *
 * 4. COERCION
 *    - Dates: z.coerce.date() converts ISO strings from Rust to Date objects
 *    - Decimals: z.coerce.number() converts string decimals to numbers
 *    - IDs: remain as strings (UUID v7 format)
 */

import { z } from "zod";
import { idSchema, dateTimeSchema, dateSchema, decimalSchema } from "./utils";

// Re-export utility types for convenience
export type { Id, DateTime, DateType as Date, Decimal } from "./utils";

// ============================================================================
// Product Type Schemas
// ============================================================================

export const productTypeSchema = z.object({
  id: idSchema,
  name: z.string(),
  code: z.string(),
  description: z.string().nullable(),
  requires_prescription: z.boolean(),
  requires_batch_tracking: z.boolean(),
  requires_expiry_date: z.boolean(),
  requires_temperature_control: z.boolean(),
  regulatory_category: z.string().nullable(),
  display_order: z.number().int(),
  is_active: z.boolean(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const createProductTypeSchema = z.object({
  name: z.string(),
  code: z.string(),
  description: z.string().nullable(),
  requires_prescription: z.boolean().nullable(),
  requires_batch_tracking: z.boolean().nullable(),
  requires_expiry_date: z.boolean().nullable(),
  requires_temperature_control: z.boolean().nullable(),
  regulatory_category: z.string().nullable(),
  display_order: z.number().int().nullable(),
});

export const updateProductTypeSchema = z.object({
  name: z.string().nullable(),
  code: z.string().nullable(),
  description: z.string().nullable(),
  requires_prescription: z.boolean().nullable(),
  requires_batch_tracking: z.boolean().nullable(),
  requires_expiry_date: z.boolean().nullable(),
  requires_temperature_control: z.boolean().nullable(),
  regulatory_category: z.string().nullable(),
  display_order: z.number().int().nullable(),
  is_active: z.boolean().nullable(),
});

export type ProductType = z.infer<typeof productTypeSchema>;
export type CreateProductType = z.infer<typeof createProductTypeSchema>;
export type UpdateProductType = z.infer<typeof updateProductTypeSchema>;

// ============================================================================
// Manufacturer Schemas
// ============================================================================

export const manufacturerSchema = z.object({
  id: idSchema,
  name: z.string(),
  short_name: z.string().nullable(),
  country: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  website: z.string().nullable(),
  notes: z.string().nullable(),
  is_active: z.boolean(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const createManufacturerSchema = z.object({
  name: z.string(),
  short_name: z.string().nullable(),
  country: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  website: z.string().nullable(),
  notes: z.string().nullable(),
});

export const updateManufacturerSchema = z.object({
  name: z.string().nullable(),
  short_name: z.string().nullable(),
  country: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  website: z.string().nullable(),
  notes: z.string().nullable(),
  is_active: z.boolean().nullable(),
});

export type Manufacturer = z.infer<typeof manufacturerSchema>;
export type CreateManufacturer = z.infer<typeof createManufacturerSchema>;
export type UpdateManufacturer = z.infer<typeof updateManufacturerSchema>;

// ============================================================================
// Category Schemas
// ============================================================================

export const categorySchema = z.object({
  id: idSchema,
  name: z.string(),
  description: z.string().nullable(),
  parent_category_id: idSchema.nullable(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const createCategorySchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  parent_category_id: idSchema.nullable(),
});

export const updateCategorySchema = z.object({
  name: z.string().nullable(),
  description: z.string().nullable(),
  parent_category_id: idSchema.nullable(),
});

export type Category = z.infer<typeof categorySchema>;
export type CreateCategory = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;

// ============================================================================
// Supplier Schemas
// ============================================================================

export const supplierSchema = z.object({
  id: idSchema,
  name: z.string(),
  contact_person: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  is_active: z.boolean(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const createSupplierSchema = z.object({
  name: z.string(),
  contact_person: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
});

export const updateSupplierSchema = z.object({
  name: z.string().nullable(),
  contact_person: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  is_active: z.boolean().nullable(),
});

export type Supplier = z.infer<typeof supplierSchema>;
export type CreateSupplier = z.infer<typeof createSupplierSchema>;
export type UpdateSupplier = z.infer<typeof updateSupplierSchema>;

// ============================================================================
// Product Schemas
// ============================================================================

export const productSchema = z.object({
  id: idSchema,
  name: z.string(),
  sku: z.string(),
  generic_name: z.string().nullable(),
  manufacturer_id: idSchema.nullable(),
  product_type_id: idSchema,
  category_id: idSchema,
  description: z.string().nullable(),
  base_price: decimalSchema,
  unit_of_measure: z.string(),
  reorder_level: z.number().int(),
  requires_prescription: z.boolean(),
  controlled_substance: z.boolean(),
  is_active: z.boolean(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const createProductSchema = z.object({
  name: z.string(),
  sku: z.string(),
  generic_name: z.string().nullable(),
  manufacturer_id: idSchema.nullable(),
  product_type_id: idSchema,
  category_id: idSchema,
  description: z.string().nullable(),
  base_price: decimalSchema,
  unit_of_measure: z.string(),
  reorder_level: z.number().int().nullable(),
  requires_prescription: z.boolean().nullable(),
  controlled_substance: z.boolean().nullable(),
});

export const updateProductSchema = z.object({
  name: z.string().nullable(),
  sku: z.string().nullable(),
  generic_name: z.string().nullable(),
  manufacturer_id: idSchema.nullable(),
  product_type_id: idSchema.nullable(),
  category_id: idSchema.nullable(),
  description: z.string().nullable(),
  base_price: decimalSchema.nullable(),
  unit_of_measure: z.string().nullable(),
  reorder_level: z.number().int().nullable(),
  requires_prescription: z.boolean().nullable(),
  controlled_substance: z.boolean().nullable(),
  is_active: z.boolean().nullable(),
});

export type Product = z.infer<typeof productSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;

// ============================================================================
// Inventory Item Schemas
// ============================================================================

export const inventoryItemSchema = z.object({
  id: idSchema,
  product_id: idSchema,
  batch_number: z.string(),
  expiry_date: dateSchema,
  supplier_id: idSchema,
  purchase_order_id: idSchema.nullable(),
  received_date: dateSchema,
  cost_per_unit: decimalSchema,
  quantity_received: z.number().int(),
  quantity_remaining: z.number().int(),
  location_id: idSchema.nullable(),
  status: z.string(),
  notes: z.string().nullable(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const createInventoryItemSchema = z.object({
  product_id: idSchema,
  batch_number: z.string(),
  expiry_date: dateSchema,
  supplier_id: idSchema,
  purchase_order_id: idSchema.nullable(),
  received_date: dateSchema,
  cost_per_unit: decimalSchema,
  quantity_received: z.number().int(),
  location_id: idSchema.nullable(),
  notes: z.string().nullable(),
});

export const updateInventoryItemSchema = z.object({
  quantity_remaining: z.number().int().nullable(),
  location_id: idSchema.nullable(),
  status: z.string().nullable(),
  notes: z.string().nullable(),
});

export type InventoryItem = z.infer<typeof inventoryItemSchema>;
export type CreateInventoryItem = z.infer<typeof createInventoryItemSchema>;
export type UpdateInventoryItem = z.infer<typeof updateInventoryItemSchema>;

// ============================================================================
// Stock Transaction Schemas
// ============================================================================

export const stockTransactionSchema = z.object({
  id: idSchema,
  inventory_item_id: idSchema,
  transaction_type: z.string(),
  quantity: z.number().int(),
  order_id: idSchema.nullable(),
  user_id: idSchema,
  reason: z.string().nullable(),
  timestamp: dateTimeSchema,
  created_at: dateTimeSchema,
});

export const createStockTransactionSchema = z.object({
  inventory_item_id: idSchema,
  transaction_type: z.string(),
  quantity: z.number().int(),
  order_id: idSchema.nullable(),
  user_id: idSchema,
  reason: z.string().nullable(),
});

export type StockTransaction = z.infer<typeof stockTransactionSchema>;
export type CreateStockTransaction = z.infer<
  typeof createStockTransactionSchema
>;

// ============================================================================
// Inventory Operations (Unified Command Pattern)
// ============================================================================

export const inventoryOperationSchema = z.discriminatedUnion("type", [
  // Product Type Operations
  z.object({ type: z.literal("GetAllProductTypes") }),
  z.object({ type: z.literal("GetProductTypeById"), payload: idSchema }),
  z.object({ type: z.literal("GetActiveProductTypes") }),
  z.object({
    type: z.literal("CreateProductType"),
    payload: createProductTypeSchema,
  }),
  z.object({
    type: z.literal("UpdateProductType"),
    payload: z.object({ id: idSchema, dto: updateProductTypeSchema }),
  }),
  z.object({ type: z.literal("DeleteProductType"), payload: idSchema }),

  // Manufacturer Operations
  z.object({ type: z.literal("GetAllManufacturers") }),
  z.object({ type: z.literal("GetManufacturerById"), payload: idSchema }),
  z.object({ type: z.literal("GetActiveManufacturers") }),
  z.object({
    type: z.literal("CreateManufacturer"),
    payload: createManufacturerSchema,
  }),
  z.object({
    type: z.literal("UpdateManufacturer"),
    payload: z.object({ id: idSchema, dto: updateManufacturerSchema }),
  }),
  z.object({ type: z.literal("DeleteManufacturer"), payload: idSchema }),

  // Category Operations
  z.object({ type: z.literal("GetAllCategories") }),
  z.object({ type: z.literal("GetCategoryById"), payload: idSchema }),
  z.object({ type: z.literal("GetRootCategories") }),
  z.object({
    type: z.literal("CreateCategory"),
    payload: createCategorySchema,
  }),
  z.object({
    type: z.literal("UpdateCategory"),
    payload: z.object({ id: idSchema, dto: updateCategorySchema }),
  }),
  z.object({ type: z.literal("DeleteCategory"), payload: idSchema }),

  // Supplier Operations
  z.object({ type: z.literal("GetAllSuppliers") }),
  z.object({ type: z.literal("GetSupplierById"), payload: idSchema }),
  z.object({ type: z.literal("GetActiveSuppliers") }),
  z.object({
    type: z.literal("CreateSupplier"),
    payload: createSupplierSchema,
  }),
  z.object({
    type: z.literal("UpdateSupplier"),
    payload: z.object({ id: idSchema, dto: updateSupplierSchema }),
  }),
  z.object({ type: z.literal("DeleteSupplier"), payload: idSchema }),

  // Product Operations
  z.object({ type: z.literal("GetAllProducts") }),
  z.object({ type: z.literal("GetProductById"), payload: idSchema }),
  z.object({ type: z.literal("GetProductBySku"), payload: z.string() }),
  z.object({ type: z.literal("GetActiveProducts") }),
  z.object({ type: z.literal("SearchProducts"), payload: z.string() }),
  z.object({ type: z.literal("CreateProduct"), payload: createProductSchema }),
  z.object({
    type: z.literal("UpdateProduct"),
    payload: z.object({ id: idSchema, dto: updateProductSchema }),
  }),
  z.object({ type: z.literal("DeleteProduct"), payload: idSchema }),

  // Inventory Item Operations
  z.object({ type: z.literal("GetAllInventoryItems") }),
  z.object({ type: z.literal("GetInventoryItemById"), payload: idSchema }),
  z.object({
    type: z.literal("GetInventoryItemsByProduct"),
    payload: idSchema,
  }),
  z.object({
    type: z.literal("GetInventoryItemsByBatch"),
    payload: z.string(),
  }),
  z.object({
    type: z.literal("GetInventoryItemsByStatus"),
    payload: z.string(),
  }),
  z.object({
    type: z.literal("CreateInventoryItem"),
    payload: createInventoryItemSchema,
  }),
  z.object({
    type: z.literal("UpdateInventoryItem"),
    payload: z.object({ id: idSchema, dto: updateInventoryItemSchema }),
  }),
  z.object({ type: z.literal("DeleteInventoryItem"), payload: idSchema }),

  // Stock Transaction Operations
  z.object({ type: z.literal("GetAllStockTransactions") }),
  z.object({ type: z.literal("GetStockTransactionById"), payload: idSchema }),
  z.object({
    type: z.literal("GetStockTransactionsByInventoryItem"),
    payload: idSchema,
  }),
  z.object({
    type: z.literal("GetStockTransactionsByType"),
    payload: z.string(),
  }),
  z.object({
    type: z.literal("CreateStockTransaction"),
    payload: createStockTransactionSchema,
  }),
]);

export type InventoryOperation = z.infer<typeof inventoryOperationSchema>;

// ============================================================================
// Inventory Responses (Unified Response Pattern)
// ============================================================================

export const inventoryResponseSchema = z.union([
  // Product Type Responses
  z.object({ ProductTypes: z.array(productTypeSchema) }),
  z.object({ ProductType: productTypeSchema.nullable() }),
  z.object({ ProductTypeCreated: productTypeSchema }),

  // Manufacturer Responses
  z.object({ Manufacturers: z.array(manufacturerSchema) }),
  z.object({ Manufacturer: manufacturerSchema.nullable() }),
  z.object({ ManufacturerCreated: manufacturerSchema }),

  // Category Responses
  z.object({ Categories: z.array(categorySchema) }),
  z.object({ Category: categorySchema.nullable() }),
  z.object({ CategoryCreated: categorySchema }),

  // Supplier Responses
  z.object({ Suppliers: z.array(supplierSchema) }),
  z.object({ Supplier: supplierSchema.nullable() }),
  z.object({ SupplierCreated: supplierSchema }),

  // Product Responses
  z.object({ Products: z.array(productSchema) }),
  z.object({ Product: productSchema.nullable() }),
  z.object({ ProductCreated: productSchema }),

  // Inventory Item Responses
  z.object({ InventoryItems: z.array(inventoryItemSchema) }),
  z.object({ InventoryItem: inventoryItemSchema.nullable() }),
  z.object({ InventoryItemCreated: inventoryItemSchema }),

  // Stock Transaction Responses
  z.object({ StockTransactions: z.array(stockTransactionSchema) }),
  z.object({ StockTransaction: stockTransactionSchema.nullable() }),
  z.object({ StockTransactionCreated: stockTransactionSchema }),

  // Generic Responses
  z.object({ Deleted: idSchema }),
]);

export type InventoryResponse = z.infer<typeof inventoryResponseSchema>;
