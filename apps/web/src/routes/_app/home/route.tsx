import {
  createFileRoute,
  Outlet,
  useNavigate,
  useMatches,
} from "@tanstack/react-router";
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
  Sidebar,
  useMenuState,
  type QuickAction,
  type TabStatistics,
} from "@/features/shell";
import { useTabs } from "@/features/workspace/hooks/use-tabs";
import { TabBar } from "@/features/workspace/components/TabBar";
import { RibbonBar } from "@/features/workspace/components/RibbonBar";
import { TabProvider } from "@/features/workspace/context/TabContext";
import { WorkspaceContainer } from "@/features/modules/components/WorkspaceContainer";
import { WORKSPACE_TEMPLATES } from "@/features/workspace/constants";
import type { Tab } from "@/features/workspace/types";
import type { WorkspaceTemplate } from "@/features/workspace/constants";

export const Route = createFileRoute("/_app/home")({
  component: HomeComponent,
});

// Initial tabs matching the old mockup exactly
const INITIAL_TABS: Tab[] = [
  {
    id: crypto.randomUUID(),
    label: "Dashboard",
    icon: LayoutDashboard,
    module: "dashboard",
    unsaved: false,
    pinned: false,
    color: "#0078d4",
  },
  {
    id: crypto.randomUUID(),
    label: "Inventory",
    icon: Package,
    module: "inventory",
    unsaved: false,
    pinned: true,
    color: "#107c10",
  },
  {
    id: crypto.randomUUID(),
    label: "POS – Terminal 1",
    icon: ShoppingCart,
    module: "pos",
    unsaved: false,
    pinned: false,
    color: "#6b69d6",
  },
  {
    id: crypto.randomUUID(),
    label: "POS – Terminal 2",
    icon: ShoppingCart,
    module: "pos",
    unsaved: true,
    pinned: false,
    color: "#6b69d6",
  },
  {
    id: crypto.randomUUID(),
    label: "Reports",
    icon: BarChart2,
    module: "reports",
    unsaved: false,
    pinned: false,
    color: "#c43501",
  },
  {
    id: crypto.randomUUID(),
    label: "Purchase Orders",
    icon: Truck,
    module: "purchases",
    unsaved: false,
    pinned: false,
    color: "#b8860b",
  },
];

function HomeComponent() {
  const navigate = useNavigate();
  const matches = useMatches();
  const { activeMenu, toggleMenu, closeMenu } = useMenuState();
  const {
    state,
    setActiveTab,
    closeTab,
    togglePin,
    duplicateTab,
    addTab,
    toggleSplitView,
  } = useTabs(INITIAL_TABS);

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

  // Handler for sidebar module click
  const handleSidebarModuleClick = (moduleId: string) => {
    // Find first existing tab of this module type
    const existingTab = state.tabs.find((t) => t.module === moduleId);

    if (existingTab) {
      // Switch to existing tab
      setActiveTab(existingTab.id);
      navigate({ to: `/home/${moduleId}` });
    } else {
      // Create new tab
      const template = WORKSPACE_TEMPLATES.find((t) => t.id === moduleId);
      if (template) {
        addTab({
          label: template.label,
          icon: template.icon,
          module: template.id,
        });
        navigate({ to: `/home/${moduleId}` });
      }
    }
  };

  // Mock stats data
  const mockStats = [
    { label: "Sales", value: "₹14,820", trend: "up" as const },
    { label: "Profit", value: "₹3,940", trend: "up" as const },
    { label: "Orders", value: "47", trend: "down" as const },
  ];

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

      {/* Tab Bar */}
      <TabBar
        tabs={state.tabs}
        activeTabId={activeTab.id}
        onTabClick={handleTabClick}
        onTabClose={closeTab}
        onTabPin={togglePin}
        onTabDuplicate={duplicateTab}
        onAddTab={handleAddTab}
        splitViewEnabled={state.splitView.enabled}
        onSplitViewToggle={toggleSplitView}
      />

      {/* Ribbon Bar with active tab info, actions, search, notifications, and user */}
      <RibbonBar
        activeTabLabel={activeTab?.label}
        activeTabIcon={activeTab?.icon}
        activeTabColor={activeTab?.color}
        activeTabUnsaved={activeTab?.unsaved}
        activeTabPinned={activeTab?.pinned}
        moduleId={activeTab?.module}
      />

      {/* Main Content Area - Render child routes via Outlet */}
      <TabProvider value={{ activeTabLabel: activeTab?.label }}>
        <div
          style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}
        >
          {/* Sidebar */}
          <Sidebar
            activeModule={activeTab?.module ?? null}
            onModuleClick={handleSidebarModuleClick}
            stats={mockStats}
          />

          {/* Content area */}
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
        </div>
      </TabProvider>

      {/* Status bar with statistics */}
      <StatusBar
        statistics={statistics}
        keyboardShortcuts="Ctrl+T New · Ctrl+W Close · Ctrl+Tab Switch · Ctrl+\ Split"
      />
    </div>
  );
}
