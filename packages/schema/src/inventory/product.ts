/**
 * Product Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const productSchema = z.object({
  id: idSchema,
  name: z.string(),
  sku: z.string(),
  barcode: z.string(),
  category_id: idSchema,
  company_id: idSchema.nullable(),
  location_id: idSchema.nullable(),
  price: z.number(),
  notes: z.string().nullable(),
  is_active: z.boolean(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export type Product = z.infer<typeof productSchema>;
