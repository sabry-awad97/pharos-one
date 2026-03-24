/**
 * Category Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const categorySchema = z.object({
  id: idSchema,
  name: z.string(),
  icon: z.string(),
  description: z.string().nullable(),
  is_active: z.boolean(),
  sort_order: z.number().int(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export type Category = z.infer<typeof categorySchema>;
