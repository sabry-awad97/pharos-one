/**
 * Sidebar state Zustand store with Immer and localStorage persistence
 * Workspace-scoped sidebar state management
 */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { enableMapSet } from "immer";
import { z } from "zod";

// Enable Immer MapSet plugin to support Set and Map
enableMapSet();

// Temporary dev user ID until real user system exists
const DEV_USER_ID = "dev-user";

export const DEFAULT_WIDTH = 180;
export const MIN_WIDTH = 48;
export const MAX_WIDTH = 280;

/**
 * Zod schema for workspace state stored in localStorage (with arrays)
 */
const StoredWorkspaceStateSchema = z.object({
  expanded: z.boolean(),
  expandedModules: z.array(z.string()),
  pinnedItems: z.array(z.string()),
  hiddenItems: z.array(z.string()),
  width: z.number(),
});

const StoredStateSchema = z.object({
  state: z.object({
    workspaces: z.record(z.string(), StoredWorkspaceStateSchema),
  }),
  version: z.number().optional(),
});

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
  resetForUser: (userId: string) => void;

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

      // Reset store for a specific user
      // Clears current state - data will be rehydrated from localStorage on next app load
      resetForUser: (userId: string) => {
        set({ workspaces: {} });
      },
    })),
    {
      name: `pharmos-sidebar-state-${DEV_USER_ID}`,
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;

          try {
            const parsed = JSON.parse(str);
            const validated = StoredStateSchema.parse(parsed);

            // Convert arrays back to Sets
            const workspaces: Record<string, SidebarState> = {};
            Object.entries(validated.state.workspaces).forEach(
              ([id, workspace]) => {
                workspaces[id] = {
                  expanded: workspace.expanded,
                  expandedModules: new Set(workspace.expandedModules),
                  pinnedItems: new Set(workspace.pinnedItems),
                  hiddenItems: new Set(workspace.hiddenItems),
                  width: workspace.width,
                };
              },
            );

            return {
              state: { workspaces },
              version: validated.version,
            };
          } catch (error) {
            console.warn(
              "Failed to parse sidebar state from localStorage:",
              error,
            );
            return null;
          }
        },
        setItem: (name, newValue) => {
          // Convert Sets to arrays for storage
          const workspaces: Record<
            string,
            z.infer<typeof StoredWorkspaceStateSchema>
          > = {};

          Object.entries(newValue.state.workspaces).forEach(
            ([id, workspace]) => {
              workspaces[id] = {
                expanded: workspace.expanded,
                expandedModules: Array.from(workspace.expandedModules),
                pinnedItems: Array.from(workspace.pinnedItems),
                hiddenItems: Array.from(workspace.hiddenItems),
                width: workspace.width,
              };
            },
          );

          const toStore = {
            state: { workspaces },
            version: newValue.version,
          };

          localStorage.setItem(name, JSON.stringify(toStore));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
