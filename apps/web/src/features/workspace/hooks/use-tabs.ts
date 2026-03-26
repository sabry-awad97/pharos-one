/**
 * Tab management hook
 * Provides tab state and operations for the workspace
 */

import { useCallback, useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Tab, TabState } from "../types";

const TAB_ORDER_KEY = "pharmos-tab-order";

export interface UseTabsReturn {
  /** Current tab state */
  state: TabState;
  /** Add a new tab */
  addTab: (tab: Omit<Tab, "id">) => string;
  /** Close a tab by ID */
  closeTab: (id: string) => void;
  /** Set the active tab */
  setActiveTab: (id: string) => void;
  /** Get the currently active tab */
  getActiveTab: () => Tab | null;
  /** Toggle pin state of a tab */
  togglePin: (id: string) => void;
  /** Duplicate a tab with "(copy)" suffix */
  duplicateTab: (id: string) => string | null;
  /** Mark a tab as having unsaved changes */
  markUnsaved: (id: string, unsaved: boolean) => void;
  /** Toggle split view on/off */
  toggleSplitView: () => void;
  /** Set modules for split view panes */
  setSplitModules: (
    leftModuleId: string | null,
    rightModuleId: string | null,
  ) => void;
  /** Reorder tabs by moving from one index to another */
  reorderTabs: (fromIndex: number, toIndex: number) => void;
}

/**
 * Hook for managing workspace tabs
 * Follows the pattern from use-inventory.ts with clear return interface
 */
export function useTabs(initialTabs: Tab[] = []): UseTabsReturn {
  const [state, setState] = useState<TabState>({
    tabs: initialTabs,
    activeTabId: initialTabs[0]?.id ?? null,
    splitView: {
      enabled: false,
      leftModuleId: null,
      rightModuleId: null,
    },
  });

  // Use centralized localStorage hook for tab order persistence
  const [tabOrder, setTabOrder] = useLocalStorage<string[]>({
    key: TAB_ORDER_KEY,
    initialValue: [],
  });

  // Load tab order from localStorage on mount
  useEffect(() => {
    if (tabOrder && tabOrder.length > 0) {
      setState((prev) => {
        // Reorder tabs based on saved order
        const orderedTabs = [...prev.tabs].sort((a, b) => {
          const aIndex = tabOrder.indexOf(a.id);
          const bIndex = tabOrder.indexOf(b.id);
          // If tab not in saved order, put it at the end
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });
        return { ...prev, tabs: orderedTabs };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Save tab order to localStorage whenever tabs change
  useEffect(() => {
    const tabIds = state.tabs.map((t) => t.id);
    setTabOrder(tabIds);
  }, [state.tabs, setTabOrder]);

  const addTab = useCallback((tabData: Omit<Tab, "id">): string => {
    const newTab: Tab = {
      ...tabData,
      id: crypto.randomUUID(),
    };

    setState((prev) => ({
      ...prev,
      tabs: [...prev.tabs, newTab],
      activeTabId: newTab.id,
    }));

    return newTab.id;
  }, []);

  const closeTab = useCallback((id: string) => {
    setState((prev) => {
      const remaining = prev.tabs.filter((t) => t.id !== id);

      // If closing the active tab, switch to the last remaining tab
      let newActiveId = prev.activeTabId;
      if (prev.activeTabId === id && remaining.length > 0) {
        newActiveId = remaining[remaining.length - 1].id;
      } else if (remaining.length === 0) {
        newActiveId = null;
      }

      return {
        ...prev,
        tabs: remaining,
        activeTabId: newActiveId,
      };
    });
  }, []);

  const setActiveTab = useCallback((id: string) => {
    setState((prev) => {
      // Only update if the tab exists
      const tabExists = prev.tabs.some((t) => t.id === id);
      if (!tabExists) return prev;

      return {
        ...prev,
        activeTabId: id,
      };
    });
  }, []);

  const getActiveTab = useCallback((): Tab | null => {
    if (!state.activeTabId) return null;
    return state.tabs.find((t) => t.id === state.activeTabId) ?? null;
  }, [state.activeTabId, state.tabs]);

  const togglePin = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((t) =>
        t.id === id ? { ...t, pinned: !t.pinned } : t,
      ),
    }));
  }, []);

  const duplicateTab = useCallback(
    (id: string): string | null => {
      const sourceTab = state.tabs.find((t) => t.id === id);
      if (!sourceTab) return null;

      const newTab: Tab = {
        ...sourceTab,
        id: crypto.randomUUID(),
        label: sourceTab.label + " (copy)",
        unsaved: false,
        pinned: false,
      };

      setState((prev) => ({
        ...prev,
        tabs: [...prev.tabs, newTab],
        activeTabId: newTab.id,
      }));

      return newTab.id;
    },
    [state.tabs],
  );

  const markUnsaved = useCallback((id: string, unsaved: boolean) => {
    setState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((t) => (t.id === id ? { ...t, unsaved } : t)),
    }));
  }, []);

  const toggleSplitView = useCallback(() => {
    setState((prev) => ({
      ...prev,
      splitView: {
        ...prev.splitView,
        enabled: !prev.splitView.enabled,
      },
    }));
  }, []);

  const setSplitModules = useCallback(
    (leftModuleId: string | null, rightModuleId: string | null) => {
      setState((prev) => ({
        ...prev,
        splitView: {
          ...prev.splitView,
          leftModuleId,
          rightModuleId,
        },
      }));
    },
    [],
  );

  const reorderTabs = useCallback((fromIndex: number, toIndex: number) => {
    setState((prev) => {
      const newTabs = [...prev.tabs];
      const [movedTab] = newTabs.splice(fromIndex, 1);
      newTabs.splice(toIndex, 0, movedTab);
      return { ...prev, tabs: newTabs };
    });
  }, []);

  return {
    state,
    addTab,
    closeTab,
    setActiveTab,
    getActiveTab,
    togglePin,
    duplicateTab,
    markUnsaved,
    toggleSplitView,
    setSplitModules,
    reorderTabs,
  };
}
