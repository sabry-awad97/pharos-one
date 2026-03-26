/**
 * Sidebar state Zustand store with Immer and localStorage persistence
 * Workspace-scoped sidebar state management
 */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

export const DEFAULT_WIDTH = 180;
export const MIN_WIDTH = 48;
export const MAX_WIDTH = 280;

/**
 * Sidebar state for a single workspace
 */
interface SidebarState {
  expanded: boolean;
  expandedModules: Set<string>;
  pinnedItems: Set<string>;
  hiddenItems: Set<string>;
  width: number;
}

/**
 * Store state with workspace-scoped sidebar states
 */
interface SidebarStateStore {
  // State: Map of workspaceId to sidebar state
  workspaces: Record<string, SidebarState>;

  // Actions
  toggle: (workspaceId: string) => void;
  setExpanded: (workspaceId: string, expanded: boolean) => void;
  toggleModule: (workspaceId: string, moduleId: string) => void;
  togglePin: (workspaceId: string, itemId: string) => void;
  toggleHide: (workspaceId: string, itemId: string) => void;
  setSidebarWidth: (workspaceId: string, width: number) => void;
  resetWidth: (workspaceId: string) => void;

  // Helpers
  getWorkspaceState: (workspaceId: string) => SidebarState;
  hasWorkspace: (workspaceId: string) => boolean;
}

/**
 * Get default sidebar state for a workspace
 */
const getDefaultState = (): SidebarState => ({
  expanded: true,
  expandedModules: new Set(),
  pinnedItems: new Set(),
  hiddenItems: new Set(),
  width: DEFAULT_WIDTH,
});

/**
 * Create sidebar state store with Zustand + Immer + persist middleware
 */
export const useSidebarStateStore = create<SidebarStateStore>()(
  persist(
    immer((set, get) => ({
      // Initial state
      workspaces: {},

      // Helper to get or create workspace state
      getWorkspaceState: (workspaceId: string) => {
        const state = get().workspaces[workspaceId];
        return state || getDefaultState();
      },

      // Helper to check if workspace exists in store
      hasWorkspace: (workspaceId: string) => {
        return workspaceId in get().workspaces;
      },

      // Actions
      toggle: (workspaceId: string) =>
        set((state) => {
          if (!state.workspaces[workspaceId]) {
            state.workspaces[workspaceId] = getDefaultState();
          }
          state.workspaces[workspaceId].expanded =
            !state.workspaces[workspaceId].expanded;
        }),

      setExpanded: (workspaceId: string, expanded: boolean) =>
        set((state) => {
          if (!state.workspaces[workspaceId]) {
            state.workspaces[workspaceId] = getDefaultState();
          }
          state.workspaces[workspaceId].expanded = expanded;
        }),

      toggleModule: (workspaceId: string, moduleId: string) =>
        set((state) => {
          if (!state.workspaces[workspaceId]) {
            state.workspaces[workspaceId] = getDefaultState();
          }
          const modules = state.workspaces[workspaceId].expandedModules;
          if (modules.has(moduleId)) {
            modules.delete(moduleId);
          } else {
            modules.add(moduleId);
          }
        }),

      togglePin: (workspaceId: string, itemId: string) =>
        set((state) => {
          if (!state.workspaces[workspaceId]) {
            state.workspaces[workspaceId] = getDefaultState();
          }
          const items = state.workspaces[workspaceId].pinnedItems;
          if (items.has(itemId)) {
            items.delete(itemId);
          } else {
            items.add(itemId);
          }
        }),

      toggleHide: (workspaceId: string, itemId: string) =>
        set((state) => {
          if (!state.workspaces[workspaceId]) {
            state.workspaces[workspaceId] = getDefaultState();
          }
          const items = state.workspaces[workspaceId].hiddenItems;
          if (items.has(itemId)) {
            items.delete(itemId);
          } else {
            items.add(itemId);
          }
        }),

      setSidebarWidth: (workspaceId: string, width: number) =>
        set((state) => {
          if (!state.workspaces[workspaceId]) {
            state.workspaces[workspaceId] = getDefaultState();
          }
          // Clamp width between MIN_WIDTH and MAX_WIDTH
          const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width));
          state.workspaces[workspaceId].width = clampedWidth;
        }),

      resetWidth: (workspaceId: string) =>
        set((state) => {
          if (!state.workspaces[workspaceId]) {
            state.workspaces[workspaceId] = getDefaultState();
          }
          state.workspaces[workspaceId].width = DEFAULT_WIDTH;
        }),
    })),
    {
      name: "pharmos-sidebar-state",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;

          try {
            const parsed = JSON.parse(str);
            // Convert arrays back to Sets
            if (parsed.state && parsed.state.workspaces) {
              const workspaces: Record<string, SidebarState> = {};
              for (const [id, workspace] of Object.entries(
                parsed.state.workspaces,
              )) {
                const ws = workspace as any;
                workspaces[id] = {
                  ...ws,
                  expandedModules: new Set(ws.expandedModules || []),
                  pinnedItems: new Set(ws.pinnedItems || []),
                  hiddenItems: new Set(ws.hiddenItems || []),
                };
              }
              parsed.state.workspaces = workspaces;
            }
            return str;
          } catch {
            return str;
          }
        },
        setItem: (name, value) => {
          try {
            const parsed = JSON.parse(value);
            // Convert Sets to arrays for storage
            if (parsed.state && parsed.state.workspaces) {
              const workspaces: Record<string, any> = {};
              for (const [id, workspace] of Object.entries(
                parsed.state.workspaces,
              )) {
                const ws = workspace as SidebarState;
                workspaces[id] = {
                  ...ws,
                  expandedModules: Array.from(ws.expandedModules),
                  pinnedItems: Array.from(ws.pinnedItems),
                  hiddenItems: Array.from(ws.hiddenItems),
                };
              }
              parsed.state.workspaces = workspaces;
            }
            localStorage.setItem(name, JSON.stringify(parsed));
          } catch {
            localStorage.setItem(name, value);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    },
  ),
);
