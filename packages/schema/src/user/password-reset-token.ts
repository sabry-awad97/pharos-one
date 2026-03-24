/**
 * Password Reset Token Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const passwordResetTokenSchema = z.object({
  id: idSchema,
  user_id: idSchema,
  token: z.string(),
  expires_at: dateTimeSchema,
  used_at: dateTimeSchema.nullable(),
  created_at: dateTimeSchema,
});

export type PasswordResetToken = z.infer<typeof passwordResetTokenSchema>;
