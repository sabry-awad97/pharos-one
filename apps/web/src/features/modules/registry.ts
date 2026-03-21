/**
 * Module registry
 * Central registry for workspace modules using Map-based storage
 */

import type { WorkspaceModule } from "./types";

/**
 * Internal module storage
 * Uses Map for O(1) lookups by module ID
 */
const modules = new Map<string, WorkspaceModule>();

/**
 * Register a new workspace module
 * @param module - The module to register
 * @throws Error if module with same ID already exists
 */
export function registerModule(module: WorkspaceModule): void {
  if (modules.has(module.id)) {
    console.warn(
      `Module "${module.id}" is already registered. Overwriting existing module.`,
    );
  }
  modules.set(module.id, module);
}

/**
 * Get a module by ID
 * @param id - The module ID
 * @returns The module or undefined if not found
 */
export function getModule(id: string): WorkspaceModule | undefined {
  return modules.get(id);
}

/**
 * Get all registered modules
 * @returns Array of all registered modules
 */
export function getAllModules(): WorkspaceModule[] {
  return Array.from(modules.values());
}

/**
 * Check if a module is registered
 * @param id - The module ID
 * @returns True if module exists
 */
export function hasModule(id: string): boolean {
  return modules.has(id);
}

/**
 * Unregister a module (useful for testing)
 * @param id - The module ID
 * @returns True if module was removed
 */
export function unregisterModule(id: string): boolean {
  return modules.delete(id);
}

/**
 * Clear all modules (useful for testing)
 */
export function clearModules(): void {
  modules.clear();
}
