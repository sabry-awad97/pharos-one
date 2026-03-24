/**
 * Role Permission Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const rolePermissionSchema = z.object({
  id: idSchema,
  role_id: idSchema,
  permission_id: idSchema,
  created_at: dateTimeSchema,
});

export type RolePermission = z.infer<typeof rolePermissionSchema>;
