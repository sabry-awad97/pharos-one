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
  expandedModules: string[];
  pinnedItems: string[];
  hiddenItems: string[];
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
  expandedModules: [],
  pinnedItems: [],
  hiddenItems: [],
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
        const workspaces = get().workspaces;
        if (!workspaces[workspaceId]) {
          // Initialize workspace if it doesn't exist
          set((state) => {
            if (!state.workspaces[workspaceId]) {
              state.workspaces[workspaceId] = getDefaultState();
            }
          });
          return get().workspaces[workspaceId];
        }
        return workspaces[workspaceId];
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
          const index = modules.indexOf(moduleId);
          if (index > -1) {
            modules.splice(index, 1);
          } else {
            modules.push(moduleId);
          }
        }),

      togglePin: (workspaceId: string, itemId: string) =>
        set((state) => {
          if (!state.workspaces[workspaceId]) {
            state.workspaces[workspaceId] = getDefaultState();
          }
          const items = state.workspaces[workspaceId].pinnedItems;
          const index = items.indexOf(itemId);
          if (index > -1) {
            items.splice(index, 1);
          } else {
            items.push(itemId);
          }
        }),

      toggleHide: (workspaceId: string, itemId: string) =>
        set((state) => {
          if (!state.workspaces[workspaceId]) {
            state.workspaces[workspaceId] = getDefaultState();
          }
          const items = state.workspaces[workspaceId].hiddenItems;
          const index = items.indexOf(itemId);
          if (index > -1) {
            items.splice(index, 1);
          } else {
            items.push(itemId);
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
          return str;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, value);
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    },
  ),
);
