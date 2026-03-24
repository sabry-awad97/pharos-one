/**
 * Phone Number Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const phoneTypeSchema = z.enum([
  "MOBILE",
  "HOME",
  "WORK",
  "FAX",
  "OTHER",
]);

export const phoneNumberSchema = z.object({
  id: idSchema,
  number: z.string(),
  type: phoneTypeSchema,
  is_primary: z.boolean(),
  is_active: z.boolean(),
  notes: z.string().nullable(),
  staff_member_id: idSchema.nullable(),
  customer_id: idSchema.nullable(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export type PhoneType = z.infer<typeof phoneTypeSchema>;
export type PhoneNumber = z.infer<typeof phoneNumberSchema>;
