/**
 * Schema Package - Main Entry Point
 *
 * Exports all schema definitions organized by domain module
 */

// Utility types and schemas
export * from "./utils";

// Domain modules
export * from "./branch";
export * from "./customer";
export * from "./inventory";
export * from "./user";

// Re-export individual top-level entities for convenience
export { branchSchema, type Branch } from "./branch";
export { customerSchema, type Customer } from "./customer";
