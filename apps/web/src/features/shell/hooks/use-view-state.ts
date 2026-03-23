/**
 * View state management hook
 * Provides state and operations for UI view preferences with localStorage persistence
 * Now powered by Zustand + Immer for better performance and maintainability
 */

import { useViewStateStore } from "../stores/view-state-store";
import type { DensityMode } from "../types";

/**
 * Return type for useViewState hook
 */
export interface UseViewStateReturn {
  /** Whether the sidebar is visible */
  sidebarVisible: boolean;
  /** Whether the status bar is visible */
  statusBarVisible: boolean;
  /** Whether the toolbar is visible */
  toolbarVisible: boolean;
  /** Toggle sidebar visibility */
  toggleSidebar: () => void;
  /** Toggle status bar visibility */
  toggleStatusBar: () => void;
  /** Toggle toolbar visibility */
  toggleToolbar: () => void;

  /** Current zoom level (50-200) */
  zoomLevel: number;
  /** Zoom in to next level */
  zoomIn: () => void;
  /** Zoom out to previous level */
  zoomOut: () => void;
  /** Reset zoom to 100% */
  resetZoom: () => void;

  /** Current density mode */
  density: DensityMode;
  /** Set density mode */
  setDensity: (mode: DensityMode) => void;

  /** Whether focus mode is active */
  focusMode: boolean;
  /** Toggle focus mode */
  toggleFocusMode: () => void;
  /** Exit focus mode */
  exitFocusMode: () => void;
  /** Whether menu bar should be temporarily visible (Alt key pressed in focus mode) */
  menuBarTemporarilyVisible: boolean;
  /** Set menu bar temporarily visible */
  setMenuBarTemporarilyVisible: (visible: boolean) => void;
}

/**
 * Hook for managing view state preferences with localStorage persistence
 * State persists across sessions using localStorage
 * Now powered by Zustand + Immer for better performance and maintainability
 *
 * @returns View state and control functions
 *
 * @example
 * ```tsx
 * const { sidebarVisible, toggleSidebar, zoomLevel, zoomIn } = useViewState();
 *
 * <ViewMenu
 *   sidebarVisible={sidebarVisible}
 *   onToggleSidebar={toggleSidebar}
 *   zoomLevel={zoomLevel}
 *   onZoomIn={zoomIn}
 * />
 * ```
 */
export function useViewState(): UseViewStateReturn {
  // Use Zustand store - all state and actions come from the store
  const sidebarVisible = useViewStateStore((state) => state.sidebarVisible);
  const statusBarVisible = useViewStateStore((state) => state.statusBarVisible);
  const toolbarVisible = useViewStateStore((state) => state.toolbarVisible);
  const zoomLevel = useViewStateStore((state) => state.zoomLevel);
  const density = useViewStateStore((state) => state.density);
  const focusMode = useViewStateStore((state) => state.focusMode);
  const menuBarTemporarilyVisible = useViewStateStore(
    (state) => state.menuBarTemporarilyVisible,
  );

  const toggleSidebar = useViewStateStore((state) => state.toggleSidebar);
  const toggleStatusBar = useViewStateStore((state) => state.toggleStatusBar);
  const toggleToolbar = useViewStateStore((state) => state.toggleToolbar);
  const zoomIn = useViewStateStore((state) => state.zoomIn);
  const zoomOut = useViewStateStore((state) => state.zoomOut);
  const resetZoom = useViewStateStore((state) => state.resetZoom);
  const setDensity = useViewStateStore((state) => state.setDensity);
  const toggleFocusMode = useViewStateStore((state) => state.toggleFocusMode);
  const exitFocusMode = useViewStateStore((state) => state.exitFocusMode);
  const setMenuBarTemporarilyVisible = useViewStateStore(
    (state) => state.setMenuBarTemporarilyVisible,
  );

  return {
    sidebarVisible,
    statusBarVisible,
    toolbarVisible,
    toggleSidebar,
    toggleStatusBar,
    toggleToolbar,
    zoomLevel,
    zoomIn,
    zoomOut,
    resetZoom,
    density,
    setDensity,
    focusMode,
    toggleFocusMode,
    exitFocusMode,
    menuBarTemporarilyVisible,
    setMenuBarTemporarilyVisible,
  };
}
