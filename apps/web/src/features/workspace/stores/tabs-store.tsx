/**
 * Tabs Zustand store with Immer and localStorage persistence
 * Manages workspace tabs state
 * Includes tab overflow calculation utilities
 */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Tab, TabState } from "../types";
import { VISIBLE_TAB_COUNT } from "../constants";

// Direct localStorage access for tab order (simpler than persist middleware)
const TAB_ORDER_KEY = "pharmos-tab-order";

/**
 * Tabs store interface
 */
interface TabsStore {
  // State
  state: TabState;
  activeTabLabel: string | undefined;

  // Actions
  addTab: (tab: Omit<Tab, "id">) => string;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  getActiveTab: () => Tab | null;
  togglePin: (id: string) => void;
  duplicateTab: (id: string) => string | null;
  markUnsaved: (id: string, unsaved: boolean) => void;
  toggleSplitView: () => void;
  setSplitModules: (
    leftModuleId: string | null,
    rightModuleId: string | null,
  ) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;

  // Initialization
  initializeTabs: (initialTabs: Tab[]) => void;
}

/**
 * Load tab order from localStorage
 */
function loadTabOrder(): string[] {
  try {
    const stored = localStorage.getItem(TAB_ORDER_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save tab order to localStorage
 */
function saveTabOrder(tabIds: string[]) {
  try {
    localStorage.setItem(TAB_ORDER_KEY, JSON.stringify(tabIds));
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Create tabs store with Zustand + Immer
 */
export const useTabsStore = create<TabsStore>()(
  immer((set, get) => ({
    // Initial state
    state: {
      tabs: [],
      activeTabId: null,
      splitView: {
        enabled: false,
        leftModuleId: null,
        rightModuleId: null,
      },
    },
    activeTabLabel: undefined,

    // Initialize tabs (called on mount with initial tabs)
    initializeTabs: (initialTabs: Tab[]) =>
      set((store) => {
        // Only initialize if no tabs exist
        if (store.state.tabs.length === 0 && initialTabs.length > 0) {
          // Load saved tab order
          const savedOrder = loadTabOrder();

          // Reorder initial tabs based on saved order
          if (savedOrder.length > 0) {
            const orderedTabs = [...initialTabs].sort((a, b) => {
              const aIndex = savedOrder.indexOf(a.id);
              const bIndex = savedOrder.indexOf(b.id);
              // If tab not in saved order, put it at the end
              if (aIndex === -1) return 1;
              if (bIndex === -1) return -1;
              return aIndex - bIndex;
            });
            store.state.tabs = orderedTabs;
          } else {
            store.state.tabs = initialTabs;
          }

          store.state.activeTabId = initialTabs[0]?.id ?? null;
          store.activeTabLabel = initialTabs[0]?.label;
        }
      }),

    // Add a new tab
    addTab: (tabData: Omit<Tab, "id">) => {
      const newTab: Tab = {
        ...tabData,
        id: crypto.randomUUID(),
      };

      set((store) => {
        store.state.tabs.push(newTab);
        store.state.activeTabId = newTab.id;
        store.activeTabLabel = newTab.label;
      });

      // Save tab order
      const tabIds = get().state.tabs.map((t) => t.id);
      saveTabOrder(tabIds);

      return newTab.id;
    },

    // Close a tab by ID
    closeTab: (id: string) =>
      set((store) => {
        const remaining = store.state.tabs.filter((t) => t.id !== id);
        store.state.tabs = remaining;

        // If closing the active tab, switch to the last remaining tab
        if (store.state.activeTabId === id && remaining.length > 0) {
          store.state.activeTabId = remaining[remaining.length - 1].id;
        } else if (remaining.length === 0) {
          store.state.activeTabId = null;
        }

        // Save tab order
        saveTabOrder(remaining.map((t) => t.id));
      }),

    // Set the active tab
    setActiveTab: (id: string) =>
      set((store) => {
        // Only update if the tab exists
        const tab = store.state.tabs.find((t) => t.id === id);
        if (tab) {
          store.state.activeTabId = id;
          store.activeTabLabel = tab.label;
        }
      }),

    // Get the currently active tab
    getActiveTab: () => {
      const state = get().state;
      if (!state.activeTabId) return null;
      return state.tabs.find((t) => t.id === state.activeTabId) ?? null;
    },

    // Toggle pin state of a tab
    togglePin: (id: string) =>
      set((store) => {
        const tab = store.state.tabs.find((t) => t.id === id);
        if (tab) {
          tab.pinned = !tab.pinned;
        }
      }),

    // Duplicate a tab with "(copy)" suffix
    duplicateTab: (id: string) => {
      const sourceTab = get().state.tabs.find((t) => t.id === id);
      if (!sourceTab) return null;

      const newTab: Tab = {
        ...sourceTab,
        id: crypto.randomUUID(),
        label: sourceTab.label + " (copy)",
        unsaved: false,
        pinned: false,
      };

      set((store) => {
        store.state.tabs.push(newTab);
        store.state.activeTabId = newTab.id;
        store.activeTabLabel = newTab.label;
      });

      // Save tab order
      const tabIds = get().state.tabs.map((t) => t.id);
      saveTabOrder(tabIds);

      return newTab.id;
    },

    // Mark a tab as having unsaved changes
    markUnsaved: (id: string, unsaved: boolean) =>
      set((store) => {
        const tab = store.state.tabs.find((t) => t.id === id);
        if (tab) {
          tab.unsaved = unsaved;
        }
      }),

    // Toggle split view on/off
    toggleSplitView: () =>
      set((store) => {
        store.state.splitView.enabled = !store.state.splitView.enabled;
      }),

    // Set modules for split view panes
    setSplitModules: (
      leftModuleId: string | null,
      rightModuleId: string | null,
    ) =>
      set((store) => {
        store.state.splitView.leftModuleId = leftModuleId;
        store.state.splitView.rightModuleId = rightModuleId;
      }),

    // Reorder tabs by moving from one index to another
    reorderTabs: (fromIndex: number, toIndex: number) =>
      set((store) => {
        const [movedTab] = store.state.tabs.splice(fromIndex, 1);
        store.state.tabs.splice(toIndex, 0, movedTab);

        // Save tab order
        saveTabOrder(store.state.tabs.map((t) => t.id));
      }),
  })),
);

// ============================================================================
// Tab Overflow Utilities
// ============================================================================

export interface UseTabOverflowReturn {
  /** Tabs that should be visible in the tab bar */
  visibleTabs: Tab[];
  /** Tabs that should be in the overflow menu */
  overflowTabs: Tab[];
  /** Whether there are any overflow tabs */
  hasOverflow: boolean;
}

/**
 * Calculate visible vs overflow tabs
 * Used by components to determine which tabs to show
 *
 * @param tabs - All tabs
 * @param visibleCount - Maximum number of visible tabs (defaults to VISIBLE_TAB_COUNT)
 * @returns Object with visible tabs, overflow tabs, and hasOverflow flag
 */
export function calculateTabOverflow(
  tabs: Tab[],
  visibleCount: number = VISIBLE_TAB_COUNT,
): UseTabOverflowReturn {
  const visibleTabs = tabs.slice(0, visibleCount);
  const overflowTabs = tabs.slice(visibleCount);

  return {
    visibleTabs,
    overflowTabs,
    hasOverflow: overflowTabs.length > 0,
  };
}
