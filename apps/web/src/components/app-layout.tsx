import * as React from "react";
import {
  TitleBar,
  MenuBar,
  StatusBar,
  useMenuState,
  useViewState,
  type QuickAction,
  type TabStatistics,
} from "@/features/shell";
import { cn } from "@pharos-one/ui/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  appName?: string;
  quickActions?: QuickAction[];
  statistics?: TabStatistics;
  branchInfo?: string;
  userInfo?: string;
  shiftInfo?: string;
  keyboardShortcuts?: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  className?: string;
}

/**
 * AppLayout - Main application shell with title bar, menu bar, and status bar
 *
 * Composes TitleBar, MenuBar, and StatusBar components into a complete application chrome.
 * Uses flex-based layout for proper height management and scrolling.
 */
export function AppLayout({
  children,
  appName,
  quickActions,
  statistics,
  branchInfo,
  userInfo,
  shiftInfo,
  keyboardShortcuts,
  onMinimize,
  onMaximize,
  onClose,
  className,
}: AppLayoutProps) {
  const { activeMenu, toggleMenu, closeMenu } = useMenuState();
  const {
    statusBarVisible,
    toggleStatusBar,
    toggleSidebar,
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
  } = useViewState();

  // Close menu when clicking outside
  const handleLayoutClick = React.useCallback(() => {
    if (activeMenu) {
      closeMenu();
    }
  }, [activeMenu, closeMenu]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F11 to toggle focus mode
      if (e.key === "F11") {
        e.preventDefault();
        toggleFocusMode();
      }
      // Esc to exit focus mode
      if (e.key === "Escape" && focusMode) {
        e.preventDefault();
        exitFocusMode();
      }
      // Alt to temporarily show menu bar in focus mode
      if (e.key === "Alt" && focusMode) {
        e.preventDefault();
        setMenuBarTemporarilyVisible(true);
      }
      // Ctrl+B to toggle sidebar
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      }
      // Ctrl++ or Ctrl+= to zoom in
      if (e.ctrlKey && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        zoomIn();
      }
      // Ctrl+- to zoom out
      if (e.ctrlKey && e.key === "-") {
        e.preventDefault();
        zoomOut();
      }
      // Ctrl+0 to reset zoom
      if (e.ctrlKey && e.key === "0") {
        e.preventDefault();
        resetZoom();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Alt release hides menu bar again in focus mode
      if (e.key === "Alt" && focusMode) {
        setMenuBarTemporarilyVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    toggleSidebar,
    zoomIn,
    zoomOut,
    resetZoom,
    focusMode,
    toggleFocusMode,
    exitFocusMode,
    setMenuBarTemporarilyVisible,
  ]);

  return (
    <div
      className={cn(
        "flex h-screen flex-col overflow-hidden bg-background text-foreground",
        className,
      )}
      onClick={handleLayoutClick}
    >
      {/* Zoom container - applies CSS transform to scale entire UI */}
      <div
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "top left",
          width: `${(100 / zoomLevel) * 100}%`,
          height: `${(100 / zoomLevel) * 100}%`,
        }}
      >
        {/* Title bar with branding and window controls */}
        <TitleBar
          appName={appName}
          quickActions={quickActions}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onClose={onClose}
        />

        {/* Menu bar with navigation - hidden in focus mode unless Alt is pressed */}
        {(!focusMode || menuBarTemporarilyVisible) && (
          <MenuBar
            activeMenu={activeMenu}
            onMenuClick={toggleMenu}
            branchInfo={branchInfo}
            userInfo={userInfo}
            shiftInfo={shiftInfo}
            onToggleSidebar={toggleSidebar}
            onToggleStatusBar={toggleStatusBar}
            onToggleFocusMode={toggleFocusMode}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onResetZoom={resetZoom}
            density={density}
            onSetDensity={setDensity}
          />
        )}

        {/* Main content area - flex-1 with min-h-0 for proper scrolling */}
        <main className="flex-1 min-h-0 overflow-auto">{children}</main>

        {/* Status bar with statistics - conditionally rendered */}
        {statusBarVisible && (
          <StatusBar
            statistics={statistics}
            keyboardShortcuts={keyboardShortcuts}
          />
        )}
      </div>
    </div>
  );
}
