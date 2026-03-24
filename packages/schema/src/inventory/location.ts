/**
 * Location Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const locationTypeSchema = z.enum([
  "SHELF",
  "FRIDGE",
  "CABINET",
  "DRAWER",
  "COUNTER",
]);

export const locationSchema = z.object({
  id: idSchema,
  branch_id: idSchema,
  code: z.string(),
  name: z.string(),
  type: locationTypeSchema,
  zone: z.string().nullable(),
  description: z.string().nullable(),
  is_active: z.boolean(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export type LocationType = z.infer<typeof locationTypeSchema>;
export type Location = z.infer<typeof locationSchema>;
