/**
 * Product Unit Config Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const productUnitConfigSchema = z.object({
  id: idSchema,
  product_id: idSchema,
  base_unit_id: idSchema,
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export type ProductUnitConfig = z.infer<typeof productUnitConfigSchema>;
