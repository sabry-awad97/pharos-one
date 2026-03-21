/**
 * Sidebar state management hook
 * Provides state and operations for sidebar collapse/expand with localStorage persistence
 */

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "pharmos-sidebar-expanded";

/**
 * Return type for useSidebarState hook
 */
export interface UseSidebarStateReturn {
  /** Whether the sidebar is expanded (true) or collapsed (false) */
  expanded: boolean;
  /** Toggle the sidebar between expanded and collapsed states */
  toggle: () => void;
  /** Set the sidebar expanded state explicitly */
  setExpanded: (value: boolean) => void;
}

/**
 * Hook for managing sidebar collapse/expand state with localStorage persistence
 * State persists across sessions using localStorage
 *
 * @returns Sidebar state and control functions
 *
 * @example
 * ```tsx
 * const { expanded, toggle, setExpanded } = useSidebarState();
 *
 * <Sidebar
 *   expanded={expanded}
 *   onToggle={toggle}
 * />
 * ```
 */
export function useSidebarState(): UseSidebarStateReturn {
  // Initialize state from localStorage, defaulting to true if not found
  const [expanded, setExpandedState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null ? stored === "true" : true;
    } catch (error) {
      // Handle localStorage errors (e.g., incognito mode, storage disabled)
      console.warn("Failed to read sidebar state from localStorage:", error);
      return true;
    }
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(expanded));
    } catch (error) {
      // Handle localStorage errors gracefully
      console.warn("Failed to save sidebar state to localStorage:", error);
    }
  }, [expanded]);

  const toggle = useCallback(() => {
    setExpandedState((current) => !current);
  }, []);

  const setExpanded = useCallback((value: boolean) => {
    setExpandedState(value);
  }, []);

  return {
    expanded,
    toggle,
    setExpanded,
  };
}
