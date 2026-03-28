/**
 * Module route registry
 *
 * Maps every module ID to its canonical leaf route — the deepest route that
 * renders content immediately without an intermediate index redirect.
 *
 * Rules:
 * - If a module has sub-routes with an index redirect, register the final
 *   destination here (e.g. inventory redirects to inventory/all).
 * - If a module has no sub-routes, register its direct path.
 * - The fallback in `getModuleRoute` covers unknown/dynamic modules.
 *
 * When adding a new module, add an entry here at the same time as creating
 * the route file. The exhaustive Record<ModuleId, string> type will produce
 * a TypeScript compile error if a ModuleId variant has no entry.
 */

/**
 * All known module IDs in the application.
 * Extend this union when registering a new module.
 */
export type ModuleId =
  | "dashboard"
  | "inventory"
  | "pos"
  | "reports"
  | "prescriptions"
  | "staff"
  | "customers"
  | "purchases";

/**
 * Maps each module ID to its canonical leaf route.
 *
 * Modules whose index route redirects to a child list the redirect target
 * to skip the extra navigation hop and prevent stale Outlet content.
 */
export const MODULE_ROUTES: Record<ModuleId, string> = {
  dashboard: "/home/dashboard",
  inventory: "/home/inventory/all",
  pos: "/home/pos",
  reports: "/home/reports",
  prescriptions: "/home/prescriptions",
  staff: "/home/staff/overview",
  customers: "/home/customers",
  purchases: "/home/purchases",
};

/**
 * Returns the canonical leaf route for a given module ID.
 * Falls back to `/home/${moduleId}` for unknown or future dynamic modules
 * so that unregistered modules still navigate correctly.
 */
export function getModuleRoute(moduleId: string): string {
  return MODULE_ROUTES[moduleId as ModuleId] ?? `/home/${moduleId}`;
}
