/**
 * usePaginationKeyboard Hook
 * Handles keyboard navigation for pagination controls
 *
 * Features:
 * - Arrow Left/Right for previous/next page
 * - Home/End for first/last page
 * - Keyboard event handling with cleanup
 */

import { useEffect, useCallback } from "react";
import type { Table } from "@tanstack/react-table";

export interface UsePaginationKeyboardOptions {
  /**
   * TanStack Table instance
   */
  table: Table<unknown>;

  /**
   * Whether keyboard navigation is enabled
   * @default true
   */
  enabled?: boolean;
}

/**
 * Hook for keyboard navigation in pagination
 *
 * @example
 * ```typescript
 * const { handleKeyDown } = usePaginationKeyboard({ table });
 *
 * <nav onKeyDown={handleKeyDown}>
 *   {/* pagination controls *\/}
 * </nav>
 * ```
 */
export function usePaginationKeyboard({
  table,
  enabled = true,
}: UsePaginationKeyboardOptions) {
  /**
   * Handle keyboard events for pagination navigation
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (!enabled) return;

      // Only handle keyboard events when pagination buttons have focus
      const target = event.target as HTMLElement;
      const isPaginationButton =
        target.tagName === "BUTTON" &&
        target.closest("nav[aria-label='pagination']") !== null;

      if (!isPaginationButton) return;

      switch (event.key) {
        case "ArrowRight":
          if (table.getCanNextPage()) {
            event.preventDefault();
            table.nextPage();
          }
          break;

        case "ArrowLeft":
          if (table.getCanPreviousPage()) {
            event.preventDefault();
            table.previousPage();
          }
          break;

        case "Home":
          event.preventDefault();
          table.setPageIndex(0);
          break;

        case "End":
          event.preventDefault();
          table.setPageIndex(table.getPageCount() - 1);
          break;

        default:
          // Let other keys pass through (Tab, Enter, etc.)
          break;
      }
    },
    [table, enabled],
  );

  return {
    handleKeyDown,
  };
}
