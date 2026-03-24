/**
 * Product Batch Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const productBatchSchema = z.object({
  id: idSchema,
  product_id: idSchema,
  batch_number: z.string(),
  expiry_date: dateTimeSchema,
  purchase_price: z.number(),
  supplier: z.string().nullable(),
  branch_id: idSchema.nullable(),
  quantity: z.number().int(),
  received_date: dateTimeSchema,
  is_active: z.boolean(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export type ProductBatch = z.infer<typeof productBatchSchema>;
