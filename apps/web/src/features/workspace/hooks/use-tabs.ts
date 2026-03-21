/**
 * Tab management hook
 * Provides tab state and operations for the workspace
 */

import { useCallback, useState } from "react";
import type { Tab, TabState } from "../types";

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
  };
}
