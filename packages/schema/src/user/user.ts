/**
 * User Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const userRoleSchema = z.enum([
  "ADMIN",
  "MANAGER",
  "PHARMACIST",
  "CASHIER",
]);

export const userSchema = z.object({
  id: idSchema,
  username: z.string(),
  password_hash: z.string(),
  pin: z.string().nullable(),
  staff_id: idSchema,
  role_id: idSchema,
  role: userRoleSchema,
  failed_login_attempts: z.number().int(),
  locked_until: dateTimeSchema.nullable(),
  must_change_password: z.boolean(),
  last_login_ip: z.string().nullable(),
  is_active: z.boolean(),
  last_login: dateTimeSchema.nullable(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type User = z.infer<typeof userSchema>;
