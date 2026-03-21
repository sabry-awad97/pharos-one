/**
 * Shell component types
 * Type definitions for the application shell (title bar, menu bar, status bar)
 */

/**
 * Menu type identifier
 * Represents the different menu categories in the menu bar
 */
export type MenuType =
  | "file"
  | "edit"
  | "view"
  | "workspace"
  | "tools"
  | "help";

/**
 * Quick action button configuration
 * Defines an action button in the title bar
 */
export interface QuickAction {
  /** Icon component to display */
  icon: React.ComponentType<{ className?: string }>;
  /** Accessible label for the action */
  label: string;
  /** Click handler for the action */
  onClick: () => void;
  /** Optional tooltip text (defaults to label) */
  tooltip?: string;
}

/**
 * Tab statistics for status bar display
 * Aggregated counts of tab states
 */
export interface TabStatistics {
  /** Total number of open tabs */
  totalTabs: number;
  /** Number of pinned tabs */
  pinnedTabs: number;
  /** Number of tabs with unsaved changes */
  unsavedTabs: number;
}
