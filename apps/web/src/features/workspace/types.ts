/**
 * Workspace tab types
 * Core type definitions for the tab navigation system
 */

import type { LucideIcon } from "lucide-react";

/**
 * Represents a single tab in the workspace
 */
export interface Tab {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Module identifier (e.g., 'dashboard', 'inventory', 'pos') */
  module: string;
  /** Whether the tab has unsaved changes */
  unsaved?: boolean;
  /** Whether the tab is pinned */
  pinned?: boolean;
  /** Accent color for the tab (future extension) */
  color?: string;
}

/**
 * Tab state management interface
 */
export interface TabState {
  /** All open tabs */
  tabs: Tab[];
  /** ID of the currently active tab */
  activeTabId: string | null;
  /** Split view state */
  splitView: {
    /** Whether split view is enabled */
    enabled: boolean;
    /** Module ID for left pane (uses active tab if null) */
    leftModuleId: string | null;
    /** Module ID for right pane */
    rightModuleId: string | null;
  };
}
