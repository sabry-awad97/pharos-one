/**
 * Module system types
 * Defines the interface for workspace modules
 */

import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

/**
 * Workspace module interface
 * Each module provides a workspace component, optional toolbar, and metadata
 */
export interface WorkspaceModule {
  /** Unique identifier for the module */
  id: string;
  /** Display label */
  label: string;
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Accent color for the module (CSS color value) */
  color?: string;
  /** Main workspace component */
  component: ComponentType<{ split?: boolean }>;
  /** Optional toolbar component for module-specific actions */
  toolbar?: ComponentType;
}

/**
 * Module registration function type
 */
export type RegisterModuleFn = (module: WorkspaceModule) => void;

/**
 * Module retrieval function type
 */
export type GetModuleFn = (id: string) => WorkspaceModule | undefined;

/**
 * Get all modules function type
 */
export type GetAllModulesFn = () => WorkspaceModule[];
