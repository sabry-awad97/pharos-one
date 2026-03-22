/**
 * Action System Types
 * Type definitions for the extensible context menu action system
 *
 * ARCHITECTURE: Registry-based action system
 * - Action: Individual menu item with handler and visibility rules
 * - ActionGroup: Logical grouping of related actions with ordering
 * - Context-aware: Actions can be shown/hidden based on row data
 *
 * USAGE:
 * 1. Define actions in config/inventory-actions.ts
 * 2. Use TableRowContextMenu component to render
 * 3. Actions are automatically filtered by visibility rules
 *
 * @see docs/epics/context-menu-actions.md for full design
 */

import type { LucideIcon } from "lucide-react";
import type { ProductStockSummary } from "../schema";

/**
 * Individual action definition for context menu
 *
 * Actions are the building blocks of the context menu system. Each action
 * represents a single menu item with its own handler, visibility rules,
 * and optional keyboard shortcut.
 *
 * @example
 * ```typescript
 * const editAction: InventoryAction = {
 *   id: "edit-product",
 *   label: "Edit Product",
 *   group: "edit",
 *   shortcut: "⌘E",
 *   icon: Edit,
 *   isVisible: () => true,
 *   handler: (row) => console.log("Edit:", row),
 * };
 * ```
 */
export interface InventoryAction {
  /**
   * Unique identifier for the action
   * Used for action lookup and testing
   * @example "edit-product", "view-batches", "quick-reorder"
   */
  id: string;

  /**
   * Display label shown in the context menu
   * Should be concise and action-oriented
   * @example "Edit Product", "View Batches", "Quick Reorder"
   */
  label: string;

  /**
   * Action group for logical organization
   * Actions in the same group are displayed together
   * @see ActionGroup for group definitions
   */
  group: "edit" | "view" | "stock" | "compliance" | "export" | "workflow";

  /**
   * Optional keyboard shortcut displayed next to the action
   * Use platform-specific format (⌘ for Mac, Ctrl+ for Windows)
   * @example "⌘E", "⌘B", "⌘S"
   */
  shortcut?: string;

  /**
   * Optional icon displayed before the label
   * Use lucide-react icons for consistency
   * @example Edit, Eye, Package, Clock
   */
  icon?: LucideIcon;

  /**
   * Visibility predicate - determines if action should be shown
   * Called for each row to filter context-aware actions
   * @param row - The product row data
   * @returns true if action should be visible, false otherwise
   * @example (row) => row.stockStatus === "expiring"
   */
  isVisible: (row: ProductStockSummary) => boolean;

  /**
   * Optional disabled predicate - determines if action should be disabled
   * Action is shown but not clickable when disabled
   * @param row - The product row data
   * @returns true if action should be disabled, false otherwise
   * @example (row) => row.availableQuantity === 0
   */
  isDisabled?: (row: ProductStockSummary) => boolean;

  /**
   * Action handler - executed when action is clicked
   * Can be async for actions that require API calls
   * @param row - The product row data
   * @returns void or Promise<void>
   * @example (row) => console.log("Edit Product:", row)
   */
  handler: (row: ProductStockSummary) => void | Promise<void>;

  /**
   * Whether action requires confirmation before execution
   * If true, a confirmation dialog will be shown
   * @default false
   */
  requiresConfirmation?: boolean;

  /**
   * Optional confirmation message function
   * Only used if requiresConfirmation is true
   * @param row - The product row data
   * @returns Confirmation message string
   * @example (row) => `Delete ${row.name}? This cannot be undone.`
   */
  confirmMessage?: (row: ProductStockSummary) => string;
}

/**
 * Action group definition for organizing actions
 *
 * Groups provide logical organization and ordering for actions in the
 * context menu. Actions within the same group are displayed together,
 * and groups are separated by visual dividers.
 *
 * @example
 * ```typescript
 * const editGroup: ActionGroup = {
 *   id: "edit",
 *   label: "Edit",
 *   order: 1,
 * };
 * ```
 */
export interface ActionGroup {
  /**
   * Unique identifier for the group
   * Must match the group field in InventoryAction
   * @example "edit", "view", "stock"
   */
  id: string;

  /**
   * Display label shown as group header in context menu
   * @example "Edit", "View", "Actions"
   */
  label: string;

  /**
   * Display order for the group
   * Lower numbers appear first in the menu
   * @example 1, 2, 3
   */
  order: number;
}
