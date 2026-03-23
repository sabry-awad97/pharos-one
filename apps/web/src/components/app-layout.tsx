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
  const { statusBarVisible, toggleStatusBar, toggleSidebar } = useViewState();

  // Close menu when clicking outside
  const handleLayoutClick = React.useCallback(() => {
    if (activeMenu) {
      closeMenu();
    }
  }, [activeMenu, closeMenu]);

  // Keyboard shortcut: Ctrl+B to toggle sidebar
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  return (
    <div
      className={cn(
        "flex h-screen flex-col overflow-hidden bg-background text-foreground",
        className,
      )}
      onClick={handleLayoutClick}
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
  );
}
