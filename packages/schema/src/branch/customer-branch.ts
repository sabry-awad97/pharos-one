/**
 * Customer Branch Schema Definitions
 *
 * IMPORTANT: Follow conventions in utils.ts header comment
 * - Use snake_case for all field names
 * - Use .nullable() for Option<T> fields, not .optional()
 */

import { z } from "zod";
import { idSchema, dateTimeSchema } from "../utils";

export const customerBranchSchema = z.object({
  id: idSchema,
  customer_id: idSchema,
  branch_id: idSchema,
  is_primary: z.boolean(),
  last_visit: dateTimeSchema.nullable(),
  visit_count: z.number().int(),
  total_purchases: z.number(),
  loyalty_points: z.number().int(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export type CustomerBranch = z.infer<typeof customerBranchSchema>;
