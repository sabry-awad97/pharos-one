import {
  createFileRoute,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
import { UserSwitcher } from "@/features/auth/components/UserSwitcher";
import { useUserProfileStore } from "@/features/auth/stores/user-profile-store";
import { useTabsStore } from "@/features/workspace/stores/tabs-store";
import { TabBar } from "@/features/workspace/components/TabBar";
import { EmptyWorkspaceState } from "@/features/workspace/components/EmptyWorkspaceState";
import { WorkspaceTemplatePicker } from "@/features/workspace/components/WorkspaceTemplatePicker";
import { WorkspaceContainer } from "@/features/modules/components/WorkspaceContainer";
import {
  WORKSPACE_TEMPLATES,
  getModuleRoute,
} from "@/features/workspace/constants/workspace-templates";
import type { WorkspaceTemplate } from "@/features/workspace/constants/workspace-templates";

export const Route = createFileRoute("/_app/home")({
  component: HomeComponent,
});

function HomeComponent() {
  const navigate = useNavigate();
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

  // User profile store
  const currentUserId = useUserProfileStore((s) => s.currentUserId);
  const getCurrentUser = useUserProfileStore((s) => s.getCurrentUser);
  const setShowTemplatePicker = useUserProfileStore(
    (s) => s.setShowTemplatePicker,
  );

  // Template picker state
  const [showPicker, setShowPicker] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Derive showTemplatePickerOnStartup from current user preferences
  const currentUser = getCurrentUser();
  const showTemplatePickerOnStartup =
    currentUser?.preferences.showTemplatePickerOnStartup ?? true;

  // Show picker when tabs are empty and preference allows
  useEffect(() => {
    if (state.tabs.length === 0 && showTemplatePickerOnStartup) {
      setShowPicker(true);
    } else if (state.tabs.length > 0) {
      setShowPicker(false);
    }
  }, [state.tabs.length, showTemplatePickerOnStartup]);

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
      navigate({ to: getModuleRoute(tab.module) });
    }
  };

  // Handler for adding new tab from template
  const handleAddTab = (template: WorkspaceTemplate) => {
    addTab({
      label: template.label,
      icon: template.icon,
      module: template.id,
    });
    navigate({ to: getModuleRoute(template.id) });
  };

  // Handler for opening dashboard from empty state
  const handleOpenDashboard = () => {
    addTab({
      label: "Dashboard",
      icon: LayoutDashboard,
      module: "dashboard",
    });
    navigate({ to: getModuleRoute("dashboard") });
  };

  // Handler for template selection from picker
  const handleTemplateSelect = (templateId: string) => {
    const template = WORKSPACE_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      template.tabs.forEach((tab) => {
        addTab({
          label: tab.label,
          icon: tab.icon,
          module: tab.module,
          pinned: tab.pinned,
        });
      });
      if (template.tabs.length > 0) {
        navigate({ to: getModuleRoute(template.tabs[0].module) });
      }
    }
    if (dontShowAgain && currentUserId) {
      setShowTemplatePicker(currentUserId, false);
    }
    setShowPicker(false);
  };

  // Handler for skip button in picker
  const handlePickerSkip = () => {
    setShowPicker(false);
  };

  // Handler for "don't show again" checkbox change
  const handleDontShowAgainChange = (checked: boolean) => {
    setDontShowAgain(checked);
    if (checked && currentUserId) {
      setShowTemplatePicker(currentUserId, false);
    }
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
      >
        <UserSwitcher />
      </TitleBar>

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
            onChooseTemplate={() => setShowPicker(true)}
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

      {/* Workspace template picker */}
      <WorkspaceTemplatePicker
        open={showPicker}
        onSelect={handleTemplateSelect}
        onSkip={handlePickerSkip}
        dontShowAgain={dontShowAgain}
        onDontShowAgainChange={handleDontShowAgainChange}
      />
    </div>
  );
}
