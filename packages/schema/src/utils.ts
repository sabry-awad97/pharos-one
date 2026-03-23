import { z } from "zod";

/**
 * Base branded schemas for type safety across the application
 */

export const idSchema = z.string().brand("Id");
export const dateTimeSchema = z.coerce.date().brand("DateTime");
export const dateSchema = z.coerce.date().brand("Date");
export const decimalSchema = z.coerce.number().brand("Decimal");

export type Id = z.infer<typeof idSchema>;
export type DateTime = z.infer<typeof dateTimeSchema>;
export type DateType = z.infer<typeof dateSchema>;
export type Decimal = z.infer<typeof decimalSchema>;
