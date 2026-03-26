/**
 * Sidebar state management hook
 * Provides state and operations for sidebar collapse/expand with localStorage persistence
 * Supports workspace-scoped state for independent sidebar configurations per workspace
 */

import { useCallback, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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

  // Use centralized localStorage hooks for all state
  const [expanded, setExpanded] = useLocalStorage<boolean>({
    key: storageKeys.expanded,
    initialValue: true,
    serialize: String,
    deserialize: (value) => value === "true",
  });

  const [expandedModules, setExpandedModules] = useLocalStorage<Set<string>>({
    key: storageKeys.expandedModules,
    initialValue: new Set(),
    serialize: (value) => JSON.stringify(Array.from(value)),
    deserialize: (value) => new Set(JSON.parse(value)),
  });

  const [pinnedItems, setPinnedItems] = useLocalStorage<Set<string>>({
    key: storageKeys.pinnedItems,
    initialValue: new Set(),
    serialize: (value) => JSON.stringify(Array.from(value)),
    deserialize: (value) => new Set(JSON.parse(value)),
  });

  const [hiddenItems, setHiddenItems] = useLocalStorage<Set<string>>({
    key: storageKeys.hiddenItems,
    initialValue: new Set(),
    serialize: (value) => JSON.stringify(Array.from(value)),
    deserialize: (value) => new Set(JSON.parse(value)),
  });

  const [sidebarWidth, setSidebarWidthState] = useLocalStorage<number>({
    key: storageKeys.width,
    initialValue: DEFAULT_WIDTH,
    serialize: String,
    deserialize: (value) => {
      const width = parseInt(value, 10);
      // Validate width is within bounds
      if (!isNaN(width) && width >= MIN_WIDTH && width <= MAX_WIDTH) {
        return width;
      }
      return DEFAULT_WIDTH;
    },
  });

  const toggle = useCallback(() => {
    setExpanded((current) => !current);
  }, [setExpanded]);

  const setExpandedValue = useCallback(
    (value: boolean) => {
      setExpanded(value);
    },
    [setExpanded],
  );

  const toggleModule = useCallback(
    (moduleId: string) => {
      setExpandedModules((current) => {
        const next = new Set(current);
        if (next.has(moduleId)) {
          next.delete(moduleId);
        } else {
          next.add(moduleId);
        }
        return next;
      });
    },
    [setExpandedModules],
  );

  const togglePin = useCallback(
    (itemId: string) => {
      setPinnedItems((current) => {
        const next = new Set(current);
        if (next.has(itemId)) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }
        return next;
      });
    },
    [setPinnedItems],
  );

  const toggleHide = useCallback(
    (itemId: string) => {
      setHiddenItems((current) => {
        const next = new Set(current);
        if (next.has(itemId)) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }
        return next;
      });
    },
    [setHiddenItems],
  );

  const setSidebarWidth = useCallback(
    (width: number) => {
      // Clamp width between MIN_WIDTH and MAX_WIDTH
      const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width));
      setSidebarWidthState(clampedWidth);
    },
    [setSidebarWidthState],
  );

  const resetWidth = useCallback(() => {
    setSidebarWidthState(DEFAULT_WIDTH);
  }, [setSidebarWidthState]);

  return {
    expanded: expanded ?? true,
    toggle,
    setExpanded: setExpandedValue,
    expandedModules: expandedModules ?? new Set(),
    toggleModule,
    pinnedItems: pinnedItems ?? new Set(),
    togglePin,
    hiddenItems: hiddenItems ?? new Set(),
    toggleHide,
    sidebarWidth: sidebarWidth ?? DEFAULT_WIDTH,
    setSidebarWidth,
    resetWidth,
  };
}
