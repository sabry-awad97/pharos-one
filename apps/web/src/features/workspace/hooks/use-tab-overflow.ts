/**
 * Tab overflow hook
 * Calculates visible vs overflow tabs with memoization
 */

import { useMemo } from "react";
import type { Tab } from "../types";
import { VISIBLE_TAB_COUNT } from "../constants";

export interface UseTabOverflowReturn {
  /** Tabs that should be visible in the tab bar */
  visibleTabs: Tab[];
  /** Tabs that should be in the overflow menu */
  overflowTabs: Tab[];
  /** Whether there are any overflow tabs */
  hasOverflow: boolean;
}

/**
 * Hook to calculate visible vs overflow tabs
 * Memoized to prevent recalculation on every render
 *
 * @param tabs - All tabs
 * @param visibleCount - Maximum number of visible tabs (defaults to VISIBLE_TAB_COUNT)
 * @returns Object with visible tabs, overflow tabs, and hasOverflow flag
 */
export function useTabOverflow(
  tabs: Tab[],
  visibleCount: number = VISIBLE_TAB_COUNT,
): UseTabOverflowReturn {
  return useMemo(() => {
    const visibleTabs = tabs.slice(0, visibleCount);
    const overflowTabs = tabs.slice(visibleCount);

    return {
      visibleTabs,
      overflowTabs,
      hasOverflow: overflowTabs.length > 0,
    };
  }, [tabs, visibleCount]);
}
