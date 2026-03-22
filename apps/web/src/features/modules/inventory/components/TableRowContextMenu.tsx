/**
 * TableRowContextMenu Component
 * Reusable context menu with command palette for table rows
 *
 * ARCHITECTURE: Composable component following shadcn/ui patterns
 * - Accepts actions as props for maximum flexibility
 * - Filters actions by visibility rules
 * - Groups and sorts actions automatically
 * - Renders icons, shortcuts, and disabled states
 * - Includes searchable command palette
 *
 * USAGE:
 * ```typescript
 * <TableRowContextMenu
 *   row={row.original}
 *   actions={inventoryActions}
 *   actionGroups={actionGroups}
 * >
 *   <tr>...</tr>
 * </TableRowContextMenu>
 * ```
 *
 * @see ../types/actions.ts for type definitions
 * @see ../config/inventory-actions.ts for action registry
 */

import * as React from "react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
} from "@pharos-one/ui/components/context-menu";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
  CommandSeparator,
  CommandShortcut,
} from "@pharos-one/ui/components/command";
import type { InventoryAction, ActionGroup } from "../types/actions";
import type { ProductStockSummary } from "../schema";

/**
 * Props for TableRowContextMenu component
 */
export interface TableRowContextMenuProps {
  /**
   * The product row data passed to action handlers and predicates
   */
  row: ProductStockSummary;

  /**
   * Array of available actions
   * Actions will be filtered by visibility rules
   */
  actions: InventoryAction[];

  /**
   * Action group definitions for organization and ordering
   */
  actionGroups: Record<string, ActionGroup>;

  /**
   * Children to wrap with context menu trigger
   * Typically a table row element
   */
  children: React.ReactNode;
}

/**
 * Reusable context menu component for table rows
 *
 * Features:
 * - Automatic action filtering by visibility
 * - Automatic grouping and sorting
 * - Command palette with search
 * - Icon and shortcut rendering
 * - Disabled state handling
 * - Automatic closing after action execution
 * - Zero hardcoded colors (uses theme variables)
 *
 * @example
 * ```typescript
 * <TableRowContextMenu
 *   row={product}
 *   actions={inventoryActions}
 *   actionGroups={actionGroups}
 * >
 *   <tr className="...">
 *     <td>Product Name</td>
 *   </tr>
 * </TableRowContextMenu>
 * ```
 */
export function TableRowContextMenu({
  row,
  actions,
  actionGroups,
  children,
}: TableRowContextMenuProps) {
  // Filter actions by visibility predicate
  const visibleActions = React.useMemo(
    () => actions.filter((action) => action.isVisible(row)),
    [actions, row],
  );

  // Group actions by their group property
  const groupedActions = React.useMemo(() => {
    return visibleActions.reduce(
      (acc, action) => {
        if (!acc[action.group]) {
          acc[action.group] = [];
        }
        acc[action.group].push(action);
        return acc;
      },
      {} as Record<string, InventoryAction[]>,
    );
  }, [visibleActions]);

  // Sort groups by order defined in actionGroups
  const sortedGroups = React.useMemo(() => {
    return Object.entries(groupedActions).sort(
      ([groupIdA], [groupIdB]) =>
        actionGroups[groupIdA].order - actionGroups[groupIdB].order,
    );
  }, [groupedActions, actionGroups]);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="p-0">
        <Command>
          <CommandInput placeholder="Search actions..." />
          <CommandList>
            <CommandEmpty>No actions found.</CommandEmpty>
            {sortedGroups.map(([groupId, groupActions], idx) => (
              <React.Fragment key={groupId}>
                {idx > 0 && <CommandSeparator />}
                <CommandGroup heading={actionGroups[groupId].label}>
                  {groupActions.map((action) => {
                    const Icon = action.icon;
                    const isDisabled = action.isDisabled?.(row) ?? false;

                    return (
                      <CommandItem
                        key={action.id}
                        onSelect={() => {
                          if (!isDisabled) {
                            action.handler(row);
                            // Close menu after action executes
                            // Using requestAnimationFrame to ensure action completes first
                            requestAnimationFrame(() => {
                              const event = new KeyboardEvent("keydown", {
                                key: "Escape",
                                code: "Escape",
                                keyCode: 27,
                                bubbles: true,
                                cancelable: true,
                              });
                              document.dispatchEvent(event);
                            });
                          }
                        }}
                        disabled={isDisabled}
                      >
                        {Icon && <Icon className="mr-2" />}
                        {action.label}
                        {action.shortcut && (
                          <CommandShortcut>{action.shortcut}</CommandShortcut>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </ContextMenuContent>
    </ContextMenu>
  );
}
