/**
 * Sidebar state management hook
 * Provides state and operations for sidebar collapse/expand with localStorage persistence
 */

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "pharmos-sidebar-expanded";
const EXPANDED_MODULES_KEY = "pharmos-sidebar-expanded-modules";
const PINNED_ITEMS_KEY = "pharmos-sidebar-pinned-items";
const HIDDEN_ITEMS_KEY = "pharmos-sidebar-hidden-items";

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
  /** Set of module IDs that have their sub-items expanded */
  expandedModules: Set<string>;
  /** Toggle a module's sub-items expansion */
  toggleModule: (moduleId: string) => void;
  /** Set of item IDs that are pinned to top */
  pinnedItems: Set<string>;
  /** Toggle an item's pinned state */
  togglePin: (itemId: string) => void;
  /** Set of item IDs that are hidden */
  hiddenItems: Set<string>;
  /** Toggle an item's hidden state */
  toggleHide: (itemId: string) => void;
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

  // Initialize expanded modules from localStorage
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(EXPANDED_MODULES_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (error) {
      console.warn("Failed to read expanded modules from localStorage:", error);
      return new Set();
    }
  });

  // Initialize pinned items from localStorage
  const [pinnedItems, setPinnedItems] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(PINNED_ITEMS_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (error) {
      console.warn("Failed to read pinned items from localStorage:", error);
      return new Set();
    }
  });

  // Initialize hidden items from localStorage
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(HIDDEN_ITEMS_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (error) {
      console.warn("Failed to read hidden items from localStorage:", error);
      return new Set();
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

  // Persist expanded modules to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        EXPANDED_MODULES_KEY,
        JSON.stringify(Array.from(expandedModules)),
      );
    } catch (error) {
      console.warn("Failed to save expanded modules to localStorage:", error);
    }
  }, [expandedModules]);

  // Persist pinned items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        PINNED_ITEMS_KEY,
        JSON.stringify(Array.from(pinnedItems)),
      );
    } catch (error) {
      console.warn("Failed to save pinned items to localStorage:", error);
    }
  }, [pinnedItems]);

  // Persist hidden items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        HIDDEN_ITEMS_KEY,
        JSON.stringify(Array.from(hiddenItems)),
      );
    } catch (error) {
      console.warn("Failed to save hidden items to localStorage:", error);
    }
  }, [hiddenItems]);

  const toggle = useCallback(() => {
    setExpandedState((current) => !current);
  }, []);

  const setExpanded = useCallback((value: boolean) => {
    setExpandedState(value);
  }, []);

  const toggleModule = useCallback((moduleId: string) => {
    setExpandedModules((current) => {
      const next = new Set(current);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }, []);

  const togglePin = useCallback((itemId: string) => {
    setPinnedItems((current) => {
      const next = new Set(current);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const toggleHide = useCallback((itemId: string) => {
    setHiddenItems((current) => {
      const next = new Set(current);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  return {
    expanded,
    toggle,
    setExpanded,
    expandedModules,
    toggleModule,
    pinnedItems,
    togglePin,
    hiddenItems,
    toggleHide,
  };
}
