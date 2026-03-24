/**
 * Unit Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const unitSchema = z.object({
  id: idSchema,
  name: z.string(),
  abbreviation: z.string(),
  description: z.string().nullable(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export type Unit = z.infer<typeof unitSchema>;
