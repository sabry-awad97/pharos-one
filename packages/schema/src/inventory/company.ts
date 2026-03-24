/**
 * Company (Manufacturer) Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const companySchema = z.object({
  id: idSchema,
  name: z.string(),
  code: z.string().nullable(),
  country: z.string().nullable(),
  website: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  description: z.string().nullable(),
  is_active: z.boolean(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export type Company = z.infer<typeof companySchema>;
