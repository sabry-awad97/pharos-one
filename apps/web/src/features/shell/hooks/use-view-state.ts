/**
 * View state management hook
 * Provides state and operations for UI view preferences with localStorage persistence
 */

import { useState, useCallback, useEffect } from "react";
import type { DensityMode } from "../types";

// localStorage keys
const SIDEBAR_VISIBLE_KEY = "pharmos-sidebar-visible";
const STATUS_BAR_VISIBLE_KEY = "pharmos-status-bar-visible";
const TOOLBAR_VISIBLE_KEY = "pharmos-toolbar-visible";
const ZOOM_LEVEL_KEY = "pharmos-zoom-level";
const DENSITY_MODE_KEY = "pharmos-density-mode";
// Note: Focus mode is NOT persisted - it's temporary state only

// Zoom levels supported
const ZOOM_LEVELS = [50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200];
const DEFAULT_ZOOM = 100;

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
  // Initialize sidebar visibility from localStorage
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_VISIBLE_KEY);
      return stored !== null ? stored === "true" : true;
    } catch (error) {
      console.warn(
        "Failed to read sidebar visibility from localStorage:",
        error,
      );
      return true;
    }
  });

  // Initialize status bar visibility from localStorage
  const [statusBarVisible, setStatusBarVisible] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STATUS_BAR_VISIBLE_KEY);
      return stored !== null ? stored === "true" : true;
    } catch (error) {
      console.warn(
        "Failed to read status bar visibility from localStorage:",
        error,
      );
      return true;
    }
  });

  // Initialize toolbar visibility from localStorage
  const [toolbarVisible, setToolbarVisible] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(TOOLBAR_VISIBLE_KEY);
      return stored !== null ? stored === "true" : true;
    } catch (error) {
      console.warn(
        "Failed to read toolbar visibility from localStorage:",
        error,
      );
      return true;
    }
  });

  // Initialize zoom level from localStorage
  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(ZOOM_LEVEL_KEY);
      if (stored !== null) {
        const level = parseInt(stored, 10);
        if (!isNaN(level) && ZOOM_LEVELS.includes(level)) {
          return level;
        }
      }
      return DEFAULT_ZOOM;
    } catch (error) {
      console.warn("Failed to read zoom level from localStorage:", error);
      return DEFAULT_ZOOM;
    }
  });

  // Initialize density mode from localStorage
  const [density, setDensityState] = useState<DensityMode>(() => {
    try {
      const stored = localStorage.getItem(DENSITY_MODE_KEY);
      if (
        stored &&
        (stored === "compact" ||
          stored === "comfortable" ||
          stored === "spacious")
      ) {
        return stored as DensityMode;
      }
      return "comfortable";
    } catch (error) {
      console.warn("Failed to read density mode from localStorage:", error);
      return "comfortable";
    }
  });

  // Initialize focus mode - always starts false (not persisted)
  const [focusMode, setFocusMode] = useState<boolean>(false);

  // Track if menu bar should be temporarily visible (Alt key in focus mode)
  const [menuBarTemporarilyVisible, setMenuBarTemporarilyVisible] =
    useState<boolean>(false);

  // Store previous visibility states for restoration when exiting focus mode
  const [previousVisibility, setPreviousVisibility] = useState<{
    sidebar: boolean;
    statusBar: boolean;
    toolbar: boolean;
  }>({
    sidebar: true,
    statusBar: true,
    toolbar: true,
  });

  // Persist sidebar visibility to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_VISIBLE_KEY, String(sidebarVisible));
    } catch (error) {
      console.warn("Failed to save sidebar visibility to localStorage:", error);
    }
  }, [sidebarVisible]);

  // Persist status bar visibility to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STATUS_BAR_VISIBLE_KEY, String(statusBarVisible));
    } catch (error) {
      console.warn(
        "Failed to save status bar visibility to localStorage:",
        error,
      );
    }
  }, [statusBarVisible]);

  // Persist toolbar visibility to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TOOLBAR_VISIBLE_KEY, String(toolbarVisible));
    } catch (error) {
      console.warn("Failed to save toolbar visibility to localStorage:", error);
    }
  }, [toolbarVisible]);

  // Persist zoom level to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ZOOM_LEVEL_KEY, String(zoomLevel));
    } catch (error) {
      console.warn("Failed to save zoom level to localStorage:", error);
    }
  }, [zoomLevel]);

  // Persist density mode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DENSITY_MODE_KEY, density);
    } catch (error) {
      console.warn("Failed to save density mode to localStorage:", error);
    }
  }, [density]);

  // Note: Focus mode is NOT persisted - it's temporary state only

  const toggleSidebar = useCallback(() => {
    setSidebarVisible((current) => !current);
  }, []);

  const toggleStatusBar = useCallback(() => {
    setStatusBarVisible((current) => !current);
  }, []);

  const toggleToolbar = useCallback(() => {
    setToolbarVisible((current) => !current);
  }, []);

  const zoomIn = useCallback(() => {
    setZoomLevel((current) => {
      const currentIndex = ZOOM_LEVELS.indexOf(current);
      if (currentIndex < ZOOM_LEVELS.length - 1) {
        return ZOOM_LEVELS[currentIndex + 1];
      }
      return current;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel((current) => {
      const currentIndex = ZOOM_LEVELS.indexOf(current);
      if (currentIndex > 0) {
        return ZOOM_LEVELS[currentIndex - 1];
      }
      return current;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(DEFAULT_ZOOM);
  }, []);

  const setDensity = useCallback((mode: DensityMode) => {
    setDensityState(mode);
  }, []);

  const toggleFocusMode = useCallback(() => {
    setFocusMode((current) => {
      const newFocusMode = !current;

      if (newFocusMode) {
        // Entering focus mode: store current visibility states
        setPreviousVisibility({
          sidebar: sidebarVisible,
          statusBar: statusBarVisible,
          toolbar: toolbarVisible,
        });

        // Hide all panels
        setSidebarVisible(false);
        setStatusBarVisible(false);
        setToolbarVisible(false);
      } else {
        // Exiting focus mode: restore previous visibility states
        setSidebarVisible(previousVisibility.sidebar);
        setStatusBarVisible(previousVisibility.statusBar);
        setToolbarVisible(previousVisibility.toolbar);
      }

      return newFocusMode;
    });
  }, [sidebarVisible, statusBarVisible, toolbarVisible, previousVisibility]);

  const exitFocusMode = useCallback(() => {
    if (focusMode) {
      // Restore previous visibility states
      setSidebarVisible(previousVisibility.sidebar);
      setStatusBarVisible(previousVisibility.statusBar);
      setToolbarVisible(previousVisibility.toolbar);
      setFocusMode(false);
    }
  }, [focusMode, previousVisibility]);

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
