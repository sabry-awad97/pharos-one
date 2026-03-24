/**
 * Role Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const roleSchema = z.object({
  id: idSchema,
  name: z.string(),
  display_name: z.string(),
  description: z.string().nullable(),
  level: z.number().int(),
  is_system: z.boolean(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export type Role = z.infer<typeof roleSchema>;
