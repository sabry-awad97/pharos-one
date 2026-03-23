/**
 * useInventoryActions Hook
 * Provides all inventory actions with custom handlers for panel management
 *
 * ARCHITECTURE: Hook-based action registry
 * - All actions defined in one place
 * - Custom handlers for panel state management
 * - Delayed execution to avoid conflicts with context menu auto-close
 * - Easy to add new actions
 *
 * This hook creates action handlers that manage panel state while avoiding
 * conflicts with the context menu's auto-close mechanism by using setTimeout.
 */

import { useMemo } from "react";
import { Edit, Package, Clock, TrendingUp, Copy } from "lucide-react";
import type { InventoryAction, ActionGroup } from "../types/actions";

export interface UseInventoryActionsProps {
  onBatchDetailsOpen: (productId: number) => void;
  onStockMovementsOpen: (productId: number) => void;
}

/**
 * Action group definitions
 *
 * Groups organize actions into logical sections in the context menu.
 * Groups are displayed in order (lower numbers first) with visual separators.
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

/**
 * Hook that provides all inventory actions with custom handlers
 *
 * @param onBatchDetailsOpen - Callback to open batch details panel
 * @param onStockMovementsOpen - Callback to open stock movements panel
 * @returns Array of inventory actions with handlers
 */
export function useInventoryActions({
  onBatchDetailsOpen,
  onStockMovementsOpen,
}: UseInventoryActionsProps) {
  return useMemo((): InventoryAction[] => {
    return [
      // ========================================================================
      // EDIT GROUP
      // ========================================================================

      {
        id: "edit-product",
        label: "Edit Product",
        group: "edit",
        shortcut: "⌘E",
        icon: Edit,
        isVisible: () => true,
        handler: (row) => {
          setTimeout(() => {
            console.log("Edit Product:", row);
            // TODO: Open edit product dialog
          }, 100);
        },
      },

      {
        id: "duplicate-product",
        label: "Duplicate Product",
        group: "edit",
        shortcut: "⌘D",
        icon: Copy,
        isVisible: () => true,
        handler: (row) => {
          setTimeout(() => {
            console.log("Duplicate Product:", row);
            // TODO: Create a copy of the product with new SKU
          }, 100);
        },
      },

      // ========================================================================
      // VIEW GROUP
      // ========================================================================

      {
        id: "batch-details",
        label: "Batch Details",
        group: "view",
        shortcut: "⌘B",
        icon: Package,
        isVisible: (row) => row.batchCount > 0,
        handler: (row) => {
          // Use setTimeout to ensure context menu closes first
          setTimeout(() => {
            onBatchDetailsOpen(row.id);
          }, 100);
        },
      },

      {
        id: "view-stock-movements",
        label: "View Stock Movements",
        group: "view",
        shortcut: "⌘M",
        icon: TrendingUp,
        isVisible: () => true,
        handler: (row) => {
          // Use setTimeout to ensure context menu closes first
          setTimeout(() => {
            onStockMovementsOpen(row.id);
          }, 100);
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
          setTimeout(() => {
            console.log("View History:", row);
            // TODO: Open history timeline showing all transactions
          }, 100);
        },
      },

      // ========================================================================
      // STOCK GROUP (Actions)
      // ========================================================================

      {
        id: "adjust-stock",
        label: "Adjust Stock",
        group: "stock",
        shortcut: "⌘S",
        icon: Package,
        isVisible: () => true,
        handler: (row) => {
          setTimeout(() => {
            console.log("Adjust Stock:", row);
            // TODO: Open stock adjustment dialog
          }, 100);
        },
      },

      {
        id: "mark-expiring",
        label: "Mark as Expiring",
        group: "stock",
        isVisible: (row) => row.stockStatus === "expiring",
        handler: (row) => {
          setTimeout(() => {
            console.log("Mark as Expiring:", row);
            // TODO: Update stock status to expiring
          }, 100);
        },
      },
    ];
  }, [onBatchDetailsOpen, onStockMovementsOpen]);
}
