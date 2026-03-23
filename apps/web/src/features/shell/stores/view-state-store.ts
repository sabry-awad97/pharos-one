/**
 * View state Zustand store with Immer and localStorage persistence
 * Centralized state management for UI view preferences
 */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DensityMode } from "../types";

// localStorage keys
const STORAGE_KEY = "pharmos-view-state";

// Zoom levels supported
const ZOOM_LEVELS = [50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200];
const DEFAULT_ZOOM = 100;

/**
 * View state interface
 */
interface ViewState {
  // State
  sidebarVisible: boolean;
  statusBarVisible: boolean;
  toolbarVisible: boolean;
  zoomLevel: number;
  density: DensityMode;
  focusMode: boolean;
  menuBarTemporarilyVisible: boolean;
  previousVisibility: {
    sidebar: boolean;
    statusBar: boolean;
    toolbar: boolean;
  };

  // Actions
  toggleSidebar: () => void;
  toggleStatusBar: () => void;
  toggleToolbar: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setDensity: (mode: DensityMode) => void;
  toggleFocusMode: () => void;
  exitFocusMode: () => void;
  setMenuBarTemporarilyVisible: (visible: boolean) => void;
}

/**
 * Create view state store with Zustand + Immer + persist middleware
 */
export const useViewStateStore = create<ViewState>()(
  persist(
    immer((set) => ({
      // Initial state
      sidebarVisible: true,
      statusBarVisible: true,
      toolbarVisible: true,
      zoomLevel: DEFAULT_ZOOM,
      density: "comfortable",
      focusMode: false,
      menuBarTemporarilyVisible: false,
      previousVisibility: {
        sidebar: true,
        statusBar: true,
        toolbar: true,
      },

      // Actions
      toggleSidebar: () =>
        set((state) => {
          state.sidebarVisible = !state.sidebarVisible;
        }),

      toggleStatusBar: () =>
        set((state) => {
          state.statusBarVisible = !state.statusBarVisible;
        }),

      toggleToolbar: () =>
        set((state) => {
          state.toolbarVisible = !state.toolbarVisible;
        }),

      zoomIn: () =>
        set((state) => {
          const currentIndex = ZOOM_LEVELS.indexOf(state.zoomLevel);
          if (currentIndex < ZOOM_LEVELS.length - 1) {
            state.zoomLevel = ZOOM_LEVELS[currentIndex + 1];
          }
        }),

      zoomOut: () =>
        set((state) => {
          const currentIndex = ZOOM_LEVELS.indexOf(state.zoomLevel);
          if (currentIndex > 0) {
            state.zoomLevel = ZOOM_LEVELS[currentIndex - 1];
          }
        }),

      resetZoom: () =>
        set((state) => {
          state.zoomLevel = DEFAULT_ZOOM;
        }),

      setDensity: (mode: DensityMode) =>
        set((state) => {
          state.density = mode;
        }),

      toggleFocusMode: () =>
        set((state) => {
          const newFocusMode = !state.focusMode;

          if (newFocusMode) {
            // Entering focus mode: store current visibility states
            state.previousVisibility = {
              sidebar: state.sidebarVisible,
              statusBar: state.statusBarVisible,
              toolbar: state.toolbarVisible,
            };

            // Hide all panels
            state.sidebarVisible = false;
            state.statusBarVisible = false;
            state.toolbarVisible = false;
          } else {
            // Exiting focus mode: restore previous visibility states
            state.sidebarVisible = state.previousVisibility.sidebar;
            state.statusBarVisible = state.previousVisibility.statusBar;
            state.toolbarVisible = state.previousVisibility.toolbar;
          }

          state.focusMode = newFocusMode;
        }),

      exitFocusMode: () =>
        set((state) => {
          if (state.focusMode) {
            // Restore previous visibility states
            state.sidebarVisible = state.previousVisibility.sidebar;
            state.statusBarVisible = state.previousVisibility.statusBar;
            state.toolbarVisible = state.previousVisibility.toolbar;
            state.focusMode = false;
          }
        }),

      setMenuBarTemporarilyVisible: (visible: boolean) =>
        set((state) => {
          state.menuBarTemporarilyVisible = visible;
        }),
    })),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Exclude focus mode and temporary states from persistence
      partialize: (state) => ({
        sidebarVisible: state.sidebarVisible,
        statusBarVisible: state.statusBarVisible,
        toolbarVisible: state.toolbarVisible,
        zoomLevel: state.zoomLevel,
        density: state.density,
        // focusMode, menuBarTemporarilyVisible, and previousVisibility are NOT persisted
      }),
    },
  ),
);
