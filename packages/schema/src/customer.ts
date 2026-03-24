/**
 * Customer Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "./utils";

export const customerSchema = z.object({
  id: idSchema,
  name: z.string(),
  email: z.string(),
  date_of_birth: dateTimeSchema.nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  postal_code: z.string().nullable(),
  notes: z.string().nullable(),
  last_visit: dateTimeSchema.nullable(),
  total_purchases: z.number(),
  loyalty_points: z.number().int(),
  is_active: z.boolean(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export type Customer = z.infer<typeof customerSchema>;
