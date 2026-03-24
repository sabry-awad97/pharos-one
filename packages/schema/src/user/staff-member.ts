/**
 * Staff Member Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const staffMemberSchema = z.object({
  id: idSchema,
  employee_id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  position: z.string(),
  department: z.string().nullable(),
  branch_id: idSchema.nullable(),
  hire_date: dateTimeSchema,
  is_active: z.boolean(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export type StaffMember = z.infer<typeof staffMemberSchema>;
