/**
 * Session Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const sessionSchema = z.object({
  id: idSchema,
  user_id: idSchema,
  branch_id: idSchema,
  token: z.string(),
  device_id: z.string().nullable(),
  device_name: z.string().nullable(),
  ip_address: z.string().nullable(),
  user_agent: z.string().nullable(),
  expires_at: dateTimeSchema,
  last_activity_at: dateTimeSchema,
  is_active: z.boolean(),
  created_at: dateTimeSchema,
});

export type Session = z.infer<typeof sessionSchema>;
