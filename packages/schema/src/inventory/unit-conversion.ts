/**
 * Unit Conversion Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const unitConversionSchema = z.object({
  id: idSchema,
  from_unit_id: idSchema,
  to_unit_id: idSchema,
  factor: z.number(),
  is_default: z.boolean(),
  is_enabled: z.boolean(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export type UnitConversion = z.infer<typeof unitConversionSchema>;
