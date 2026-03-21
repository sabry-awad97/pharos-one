import { z } from "zod";

/**
 * Medicine schema - maps to Rust Medicine entity
 * Rust uses snake_case, TypeScript uses camelCase
 */
export const medicineSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  generic_name: z.string(),
  unit_price: z.number(),
  quantity: z.number().int(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Medicine = z.infer<typeof medicineSchema>;

/**
 * Inventory operations - maps to Rust InventoryOperations enum
 */
export const inventoryOperationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("GetAll"),
  }),
  z.object({
    type: z.literal("GetById"),
    data: z.object({
      id: z.string().uuid(),
    }),
  }),
  z.object({
    type: z.literal("Create"),
    data: z.object({
      name: z.string(),
      generic_name: z.string(),
      unit_price: z.number(),
      quantity: z.number().int(),
    }),
  }),
  z.object({
    type: z.literal("UpdateStock"),
    data: z.object({
      id: z.string().uuid(),
      quantity_change: z.number().int(),
    }),
  }),
]);

export type InventoryOperation = z.infer<typeof inventoryOperationSchema>;

/**
 * Inventory responses - maps to Rust InventoryResponse enum
 */
export const inventoryResponseSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("Medicines"),
    data: z.array(medicineSchema),
  }),
  z.object({
    type: z.literal("Medicine"),
    data: medicineSchema.nullable(),
  }),
]);

export type InventoryResponse = z.infer<typeof inventoryResponseSchema>;

/**
 * Parse and validate inventory response from Rust backend
 */
export function parseInventoryResponse(data: unknown): InventoryResponse {
  return inventoryResponseSchema.parse(data);
}

/**
 * Parse and validate medicine data
 */
export function parseMedicine(data: unknown): Medicine {
  return medicineSchema.parse(data);
}

/**
 * Parse and validate array of medicines
 */
export function parseMedicines(data: unknown): Medicine[] {
  return z.array(medicineSchema).parse(data);
}
