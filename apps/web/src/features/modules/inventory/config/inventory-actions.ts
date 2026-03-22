/**
 * Inventory Action Registry
 * Centralized configuration for all inventory context menu actions
 *
 * ARCHITECTURE: Registry pattern for extensibility
 * - All actions defined in one place
 * - Easy to add new actions (just add to array)
 * - Actions are filtered by visibility rules at runtime
 * - Groups provide logical organization with ordering
 *
 * USAGE:
 * ```typescript
 * import { inventoryActions, actionGroups } from './config/inventory-actions';
 * <TableRowContextMenu actions={inventoryActions} actionGroups={actionGroups} />
 * ```
 *
 * @see ../types/actions.ts for type definitions
 * @see docs/epics/context-menu-actions.md for full roadmap
 */

import { Edit, Eye, Package, Clock } from "lucide-react";
import type { InventoryAction, ActionGroup } from "../types/actions";

/**
 * All available inventory actions
 *
 * Actions are executed when clicked in the context menu.
 * Currently all handlers use console.log placeholders - these will be
 * replaced with actual implementations in future issues.
 *
 * To add a new action:
 * 1. Add new entry to this array
 * 2. Define visibility rules in isVisible
 * 3. Implement handler (or use console.log placeholder)
 * 4. Optionally add icon and keyboard shortcut
 */
export const inventoryActions: InventoryAction[] = [
  // ============================================================================
  // EDIT GROUP
  // ============================================================================

  {
    id: "edit-product",
    label: "Edit Product",
    group: "edit",
    shortcut: "⌘E",
    icon: Edit,
    isVisible: () => true,
    handler: (row) => {
      console.log("Edit Product:", row);
      // TODO: Open edit product dialog
    },
  },

  // ============================================================================
  // VIEW GROUP
  // ============================================================================

  {
    id: "view-batches",
    label: "View Batches",
    group: "view",
    shortcut: "⌘B",
    icon: Package,
    isVisible: () => true,
    handler: (row) => {
      console.log("View Batches:", row);
      // TODO: Open batches panel showing all batches for this product
    },
  },

  {
    id: "view-history",
    label: "View History",
    group: "view",
    shortcut: "⌘H",
    icon: Clock,
    isVisible: () => true,
    handler: (row) => {
      console.log("View History:", row);
      // TODO: Open history timeline showing all transactions
    },
  },

  // ============================================================================
  // STOCK GROUP (Actions)
  // ============================================================================

  {
    id: "adjust-stock",
    label: "Adjust Stock",
    group: "stock",
    shortcut: "⌘S",
    icon: Package,
    isVisible: () => true,
    handler: (row) => {
      console.log("Adjust Stock:", row);
      // TODO: Open stock adjustment dialog
    },
  },

  {
    id: "mark-expiring",
    label: "Mark as Expiring",
    group: "stock",
    isVisible: (row) => row.stockStatus === "expiring",
    handler: (row) => {
      console.log("Mark as Expiring:", row);
      // TODO: Update stock status to expiring
    },
  },
];

/**
 * Action group definitions
 *
 * Groups organize actions into logical sections in the context menu.
 * Groups are displayed in order (lower numbers first) with visual separators.
 *
 * To add a new group:
 * 1. Add entry to this object
 * 2. Use the group id in action definitions
 * 3. Set appropriate order for positioning
 */
export const actionGroups: Record<string, ActionGroup> = {
  edit: {
    id: "edit",
    label: "Edit",
    order: 1,
  },
  view: {
    id: "view",
    label: "View",
    order: 2,
  },
  stock: {
    id: "stock",
    label: "Actions",
    order: 3,
  },
  compliance: {
    id: "compliance",
    label: "Compliance",
    order: 4,
  },
  export: {
    id: "export",
    label: "Export",
    order: 5,
  },
  workflow: {
    id: "workflow",
    label: "Workflow",
    order: 6,
  },
};
