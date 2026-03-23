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
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar, zoomIn, zoomOut, resetZoom]);

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

        {/* Menu bar with navigation */}
        <MenuBar
          activeMenu={activeMenu}
          onMenuClick={toggleMenu}
          branchInfo={branchInfo}
          userInfo={userInfo}
          shiftInfo={shiftInfo}
          onToggleSidebar={toggleSidebar}
          onToggleStatusBar={toggleStatusBar}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
        />

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
