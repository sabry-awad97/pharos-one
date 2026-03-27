import {
  createFileRoute,
  Outlet,
  useNavigate,
  useMatches,
} from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Save,
  RotateCcw,
  RefreshCw,
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart2,
  Truck,
} from "lucide-react";
import {
  TitleBar,
  MenuBar,
  StatusBar,
  useMenuState,
  type QuickAction,
  type TabStatistics,
} from "@/features/shell";
import { useTabsStore } from "@/features/workspace/stores/tabs-store";
import { TabBar } from "@/features/workspace/components/TabBar";
import { EmptyWorkspaceState } from "@/features/workspace/components/EmptyWorkspaceState";
import { WorkspaceContainer } from "@/features/modules/components/WorkspaceContainer";
import { WORKSPACE_TEMPLATES } from "@/features/workspace/constants";
import type { WorkspaceTemplate } from "@/features/workspace/constants";

export const Route = createFileRoute("/_app/home")({
  component: HomeComponent,
});

function HomeComponent() {
  const navigate = useNavigate();
  const matches = useMatches();
  const { activeMenu, toggleMenu, closeMenu } = useMenuState();

  // Use Zustand store directly
  const state = useTabsStore((store) => store.state);
  const setActiveTab = useTabsStore((store) => store.setActiveTab);
  const closeTab = useTabsStore((store) => store.closeTab);
  const togglePin = useTabsStore((store) => store.togglePin);
  const duplicateTab = useTabsStore((store) => store.duplicateTab);
  const addTab = useTabsStore((store) => store.addTab);
  const toggleSplitView = useTabsStore((store) => store.toggleSplitView);
  const reorderTabs = useTabsStore((store) => store.reorderTabs);

  // Use the activeTabId from state, not derived from URL
  // This allows multiple tabs with the same module (e.g., POS Terminal 1 & 2)
  const activeTab =
    state.tabs.find((t) => t.id === state.activeTabId) ?? state.tabs[0];

  // Get the first pinned tab for split view (fallback to inventory)
  const pinnedTab =
    state.tabs.find((t) => t.pinned) ??
    state.tabs.find((t) => t.module === "inventory");

  // Handler for tab click - navigate to module route
  const handleTabClick = (tabId: string) => {
    const tab = state.tabs.find((t) => t.id === tabId);
    if (tab) {
      setActiveTab(tabId);
      navigate({ to: `/home/${tab.module}` });
    }
  };

  // Handler for adding new tab from template
  const handleAddTab = (template: WorkspaceTemplate) => {
    addTab({
      label: template.label,
      icon: template.icon,
      module: template.id,
    });
    // Navigate to the new tab's module
    navigate({ to: `/home/${template.id}` });
  };

  // Handler for opening dashboard from empty state
  const handleOpenDashboard = () => {
    addTab({
      label: "Dashboard",
      icon: LayoutDashboard,
      module: "dashboard",
    });
    navigate({ to: "/home/dashboard" });
  };

  // Tab statistics for status bar
  const statistics: TabStatistics = {
    totalTabs: state.tabs.length,
    pinnedTabs: state.tabs.filter((t) => t.pinned).length,
    unsavedTabs: state.tabs.filter((t) => t.unsaved).length,
  };

  // Quick actions for title bar
  const quickActions: QuickAction[] = [
    {
      icon: Save,
      label: "Save",
      tooltip: "Save (Ctrl+S)",
      onClick: () => console.log("Save clicked"),
    },
    {
      icon: RotateCcw,
      label: "Undo",
      tooltip: "Undo (Ctrl+Z)",
      onClick: () => console.log("Undo clicked"),
    },
    {
      icon: RefreshCw,
      label: "Refresh",
      tooltip: "Refresh (F5)",
      onClick: () => console.log("Refresh clicked"),
    },
  ];

  // Close menu when clicking layout
  const handleLayoutClick = () => {
    if (activeMenu) {
      closeMenu();
    }
  };

  return (
    <div
      className="flex h-screen flex-col overflow-hidden text-foreground"
      style={{
        background: "#f3f3f3",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        fontSize: 12,
        userSelect: "none",
      }}
      onClick={handleLayoutClick}
    >
      {/* Title bar with branding and window controls */}
      <TitleBar
        appName="PharmOS"
        quickActions={quickActions}
        onMinimize={() => console.log(`Minimize`)}
        onMaximize={() => console.log("Maximize")}
        onClose={() => console.log(`Close`)}
      />

      {/* Menu bar with navigation */}
      <MenuBar
        activeMenu={activeMenu}
        onMenuClick={toggleMenu}
        branchInfo="Main Branch"
        userInfo="Cashier: Dr. Ravi K."
        shiftInfo="Shift 2 · 14:35"
        onNewWorkspace={() => console.log(`New workspace`)}
        onPinActiveTab={() => {
          if (state.activeTabId) {
            togglePin(state.activeTabId);
          }
        }}
        onDuplicateTab={() => {
          if (state.activeTabId) {
            duplicateTab(state.activeTabId);
          }
        }}
        onSplitView={toggleSplitView}
        onCloseTab={() => {
          if (state.activeTabId) {
            closeTab(state.activeTabId);
          }
        }}
      />

      {/* Main Content Area - Workspace area with TabBar and content */}
      <div
        data-testid="workspace-area"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {state.tabs.length === 0 ? (
          <EmptyWorkspaceState
            onOpenDashboard={handleOpenDashboard}
            onChooseTemplate={() =>
              console.log("Template picker coming in Phase 4")
            }
          />
        ) : (
          <>
            {/* Tab Bar */}
            <TabBar
              tabs={state.tabs}
              activeTabId={activeTab?.id ?? null}
              onTabClick={handleTabClick}
              onTabClose={closeTab}
              onTabPin={togglePin}
              onTabDuplicate={duplicateTab}
              onAddTab={handleAddTab}
              splitViewEnabled={state.splitView.enabled}
              onSplitViewToggle={toggleSplitView}
              onTabReorder={reorderTabs}
            />

            {/* Content area - Each workspace renders its own sidebar */}
            <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
              <Outlet />
              {state.splitView.enabled && pinnedTab && (
                <>
                  <div
                    style={{
                      width: 1,
                      background: "#e0e0e0",
                      flexShrink: 0,
                    }}
                  />
                  <WorkspaceContainer
                    moduleId={pinnedTab.module}
                    label={pinnedTab.label}
                    split={true}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Status bar with statistics */}
      <StatusBar
        statistics={statistics}
        keyboardShortcuts="Ctrl+T New · Ctrl+W Close · Ctrl+Tab Switch · Ctrl+\ Split"
      />
    </div>
  );
}
