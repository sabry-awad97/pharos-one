/**
 * Branch Inventory Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const branchInventorySchema = z.object({
  id: idSchema,
  branch_id: idSchema,
  product_id: idSchema,
  stock: z.number().int(),
  min_stock: z.number().int(),
  max_stock: z.number().int().nullable(),
  is_active: z.boolean(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export type BranchInventory = z.infer<typeof branchInventorySchema>;
