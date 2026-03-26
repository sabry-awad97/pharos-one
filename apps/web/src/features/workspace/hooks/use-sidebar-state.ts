/**
 * Sidebar state management hook
 * Provides state and operations for sidebar collapse/expand with localStorage persistence
 * Supports workspace-scoped state for independent sidebar configurations per workspace
 */

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY_PREFIX = "pharmos-sidebar";

const DEFAULT_WIDTH = 180;
const MIN_WIDTH = 48;
const MAX_WIDTH = 280;

/**
 * Generate workspace-specific storage keys
 * @param workspaceId - Workspace identifier (defaults to "global" for backward compatibility)
 */
function getStorageKeys(workspaceId: string = "global") {
  return {
    expanded: `${STORAGE_KEY_PREFIX}-${workspaceId}-expanded`,
    expandedModules: `${STORAGE_KEY_PREFIX}-${workspaceId}-expanded-modules`,
    pinnedItems: `${STORAGE_KEY_PREFIX}-${workspaceId}-pinned-items`,
    hiddenItems: `${STORAGE_KEY_PREFIX}-${workspaceId}-hidden-items`,
    width: `${STORAGE_KEY_PREFIX}-${workspaceId}-width`,
  };
}

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
  /** Current sidebar width in pixels */
  sidebarWidth: number;
  /** Set the sidebar width (clamped between MIN_WIDTH and MAX_WIDTH) */
  setSidebarWidth: (width: number) => void;
  /** Reset sidebar width to default */
  resetWidth: () => void;
}

/**
 * Hook for managing sidebar collapse/expand state with localStorage persistence
 * State persists across sessions using localStorage with workspace-specific keys
 *
 * @param workspaceId - Optional workspace identifier for scoped state (defaults to "global")
 * @returns Sidebar state and control functions
 *
 * @example
 * ```tsx
 * // Global sidebar (backward compatible)
 * const { expanded, toggle } = useSidebarState();
 *
 * // Workspace-scoped sidebar
 * const { expanded, toggle } = useSidebarState("inventory");
 *
 * <Sidebar
 *   expanded={expanded}
 *   onToggle={toggle}
 * />
 * ```
 */
export function useSidebarState(workspaceId?: string): UseSidebarStateReturn {
  // Get workspace-specific storage keys
  const storageKeys = getStorageKeys(workspaceId);

  // Initialize state from localStorage, defaulting to true if not found
  const [expanded, setExpandedState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(storageKeys.expanded);
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
      const stored = localStorage.getItem(storageKeys.expandedModules);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (error) {
      console.warn("Failed to read expanded modules from localStorage:", error);
      return new Set();
    }
  });

  // Initialize pinned items from localStorage
  const [pinnedItems, setPinnedItems] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(storageKeys.pinnedItems);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (error) {
      console.warn("Failed to read pinned items from localStorage:", error);
      return new Set();
    }
  });

  // Initialize hidden items from localStorage
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(storageKeys.hiddenItems);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (error) {
      console.warn("Failed to read hidden items from localStorage:", error);
      return new Set();
    }
  });

  // Initialize sidebar width from localStorage
  const [sidebarWidth, setSidebarWidthState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(storageKeys.width);
      if (stored !== null) {
        const width = parseInt(stored, 10);
        // Validate width is within bounds
        if (!isNaN(width) && width >= MIN_WIDTH && width <= MAX_WIDTH) {
          return width;
        }
      }
      return DEFAULT_WIDTH;
    } catch (error) {
      console.warn("Failed to read sidebar width from localStorage:", error);
      return DEFAULT_WIDTH;
    }
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKeys.expanded, String(expanded));
    } catch (error) {
      // Handle localStorage errors gracefully
      console.warn("Failed to save sidebar state to localStorage:", error);
    }
  }, [expanded, storageKeys.expanded]);

  // Persist expanded modules to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKeys.expandedModules,
        JSON.stringify(Array.from(expandedModules)),
      );
    } catch (error) {
      console.warn("Failed to save expanded modules to localStorage:", error);
    }
  }, [expandedModules, storageKeys.expandedModules]);

  // Persist pinned items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKeys.pinnedItems,
        JSON.stringify(Array.from(pinnedItems)),
      );
    } catch (error) {
      console.warn("Failed to save pinned items to localStorage:", error);
    }
  }, [pinnedItems, storageKeys.pinnedItems]);

  // Persist hidden items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKeys.hiddenItems,
        JSON.stringify(Array.from(hiddenItems)),
      );
    } catch (error) {
      console.warn("Failed to save hidden items to localStorage:", error);
    }
  }, [hiddenItems, storageKeys.hiddenItems]);

  // Persist sidebar width to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKeys.width, String(sidebarWidth));
    } catch (error) {
      console.warn("Failed to save sidebar width to localStorage:", error);
    }
  }, [sidebarWidth, storageKeys.width]);

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

  const setSidebarWidth = useCallback((width: number) => {
    // Clamp width between MIN_WIDTH and MAX_WIDTH
    const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width));
    setSidebarWidthState(clampedWidth);
  }, []);

  const resetWidth = useCallback(() => {
    setSidebarWidthState(DEFAULT_WIDTH);
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
    sidebarWidth,
    setSidebarWidth,
    resetWidth,
  };
}
