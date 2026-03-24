/**
 * Branch Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "./utils";

export const branchSchema = z.object({
  id: idSchema,
  code: z.string(),
  name: z.string(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  postal_code: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  tax_rate: z.number(),
  is_active: z.boolean(),
  is_headquarters: z.boolean(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export type Branch = z.infer<typeof branchSchema>;
