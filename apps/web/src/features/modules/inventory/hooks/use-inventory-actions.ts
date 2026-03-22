/**
 * Inventory action management hook
 * Provides action filtering, execution, and confirmation dialog support
 *
 * ARCHITECTURE: Encapsulates action management logic
 * - Filters actions by visibility rules
 * - Handles confirmation dialogs for destructive actions
 * - Supports async action handlers
 * - Memoizes results for performance
 *
 * USAGE:
 * ```typescript
 * const { actions, actionGroups, executeAction } = useInventoryActions(row);
 *
 * // Execute an action by ID
 * await executeAction("edit-product");
 * ```
 *
 * @see ../types/actions.ts for type definitions
 * @see ../config/inventory-actions.ts for action registry
 */

import { useMemo, useCallback } from "react";
import { inventoryActions, actionGroups } from "../config/inventory-actions";
import type { ProductStockSummary } from "../schema";

/**
 * Hook for managing inventory actions
 *
 * Features:
 * - Automatic action filtering by visibility
 * - Confirmation dialog support
 * - Async action handler support
 * - Memoized results for performance
 *
 * @param row - The product row data for action filtering and execution
 * @returns Object containing filtered actions, action groups, and executeAction function
 *
 * @example
 * ```typescript
 * function MyComponent({ product }: { product: ProductStockSummary }) {
 *   const { actions, actionGroups, executeAction } = useInventoryActions(product);
 *
 *   return (
 *     <button onClick={() => executeAction("edit-product")}>
 *       Edit
 *     </button>
 *   );
 * }
 * ```
 */
export function useInventoryActions(row: ProductStockSummary) {
  /**
   * Filter actions by visibility predicate
   * Memoized to avoid recalculating on every render
   */
  const visibleActions = useMemo(
    () => inventoryActions.filter((action) => action.isVisible(row)),
    [row],
  );

  /**
   * Execute an action by ID with confirmation support
   *
   * Flow:
   * 1. Find action by ID
   * 2. Check if confirmation is required
   * 3. Show confirmation dialog if needed
   * 4. Execute action handler if confirmed
   * 5. Support async handlers with await
   *
   * @param actionId - The unique identifier of the action to execute
   * @returns Promise that resolves when action completes
   *
   * @example
   * ```typescript
   * // Execute action without confirmation
   * await executeAction("edit-product");
   *
   * // Execute action with confirmation (if requiresConfirmation: true)
   * await executeAction("delete-product");
   * ```
   */
  const executeAction = useCallback(
    async (actionId: string) => {
      // Find the action by ID
      const action = inventoryActions.find((a) => a.id === actionId);
      if (!action) {
        console.warn(`Action with id "${actionId}" not found`);
        return;
      }

      // Handle confirmation if required
      if (action.requiresConfirmation) {
        const message =
          typeof action.confirmMessage === "function"
            ? action.confirmMessage(row)
            : "Are you sure?";

        // Show browser confirmation dialog
        const confirmed = window.confirm(message);
        if (!confirmed) {
          return; // User cancelled
        }
      }

      // Execute the action handler (supports async)
      await action.handler(row);
    },
    [row],
  );

  return {
    /**
     * Filtered actions visible for the current row
     */
    actions: visibleActions,

    /**
     * Action group definitions for organization
     */
    actionGroups,

    /**
     * Function to execute an action by ID
     */
    executeAction,
  };
}
