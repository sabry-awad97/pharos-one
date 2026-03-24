/**
 * Permission Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const permissionSchema = z.object({
  id: idSchema,
  name: z.string(),
  resource: z.string(),
  action: z.string(),
  description: z.string().nullable(),
  created_at: dateTimeSchema,
});

export type Permission = z.infer<typeof permissionSchema>;
