/**
 * TabBar component
 * Container for all workspace tabs
 */

import { useState } from "react";
import { Plus, SplitSquareHorizontal } from "lucide-react";
import type { Tab } from "../types";
import { TabItem } from "./TabItem";
import { TabContextMenu } from "./TabContextMenu";
import { TabOverflow } from "./TabOverflow";
import { NewWorkspaceDialog } from "./NewWorkspaceDialog";
import { useTabOverflow } from "../hooks/use-tab-overflow";
import type { WorkspaceTemplate } from "../constants";

export interface TabBarProps {
  /** All tabs to display */
  tabs: Tab[];
  /** ID of the active tab */
  activeTabId: string | null;
  /** Handler for tab selection */
  onTabClick: (id: string) => void;
  /** Handler for tab close */
  onTabClose: (id: string) => void;
  /** Handler for pin toggle */
  onTabPin?: (id: string) => void;
  /** Handler for tab duplicate */
  onTabDuplicate?: (id: string) => void;
  /** Handler for adding new tab from template */
  onAddTab?: (template: WorkspaceTemplate) => void;
  /** Whether split view is enabled */
  splitViewEnabled?: boolean;
  /** Handler for split view toggle */
  onSplitViewToggle?: () => void;
}

/**
 * Tab bar component
 * Displays all tabs with proper height management using flex
 */
export function TabBar({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onTabPin,
  onTabDuplicate,
  onAddTab,
  splitViewEnabled = false,
  onSplitViewToggle,
}: TabBarProps) {
  const [contextMenu, setContextMenu] = useState<{
    tabId: string;
    x: number;
    y: number;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Calculate visible vs overflow tabs
  const { visibleTabs, overflowTabs, hasOverflow } = useTabOverflow(tabs);

  const handleContextMenu = (tabId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      tabId,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleDismissContextMenu = () => {
    setContextMenu(null);
  };

  const handleAddTab = (template: WorkspaceTemplate) => {
    onAddTab?.(template);
    setIsDialogOpen(false);
  };

  const contextMenuTab = contextMenu
    ? tabs.find((t) => t.id === contextMenu.tabId)
    : null;

  // Separate pinned and regular tabs
  const pinnedTabs = visibleTabs.filter((t) => t.pinned);
  const regularTabs = visibleTabs.filter((t) => !t.pinned);

  return (
    <div
      style={{
        height: 36,
        background: "#f0f0f0",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        alignItems: "flex-end",
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
        zIndex: 100,
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Pinned tabs group */}
      {pinnedTabs.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            height: "100%",
            borderRight: "1px solid #e0e0e0",
            paddingRight: 2,
          }}
        >
          {pinnedTabs.map((tab) => (
            <TabItem
              key={tab.id}
              tab={tab}
              active={tab.id === activeTabId}
              onClick={() => onTabClick(tab.id)}
              onClose={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              onContextMenu={(e) => handleContextMenu(tab.id, e)}
            />
          ))}
        </div>
      )}

      {/* Regular tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          height: "100%",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {regularTabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            active={tab.id === activeTabId}
            onClick={() => onTabClick(tab.id)}
            onClose={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            onContextMenu={(e) => handleContextMenu(tab.id, e)}
          />
        ))}
      </div>

      {/* Overflow indicator */}
      {hasOverflow && (
        <TabOverflow
          overflowTabs={overflowTabs}
          onTabClick={onTabClick}
          onTabClose={onTabClose}
        />
      )}

      {/* New Tab button */}
      <button
        onClick={() => setIsDialogOpen(true)}
        title="New Workspace (Ctrl+T)"
        style={{
          width: 32,
          height: 32,
          marginBottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          borderRadius: 4,
          background: "transparent",
          color: "#616161",
          cursor: "pointer",
          flexShrink: 0,
          alignSelf: "center",
          marginRight: 6,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#e0e0e0";
          (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "#616161";
        }}
      >
        <Plus style={{ width: 14, height: 14 }} />
      </button>

      {/* Split View toggle button */}
      <button
        onClick={() => onSplitViewToggle?.()}
        title="Split View (Ctrl+\)"
        style={{
          width: 28,
          height: 28,
          marginRight: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${splitViewEnabled ? "#0078d4" : "#e0e0e0"}`,
          borderRadius: 4,
          background: splitViewEnabled ? "#cce4f7" : "transparent",
          color: splitViewEnabled ? "#0078d4" : "#919191",
          cursor: "pointer",
          flexShrink: 0,
          alignSelf: "center",
        }}
        onMouseEnter={(e) => {
          if (!splitViewEnabled) {
            (e.currentTarget as HTMLButtonElement).style.background = "#f0f0f0";
          }
        }}
        onMouseLeave={(e) => {
          if (!splitViewEnabled) {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
          }
        }}
      >
        <SplitSquareHorizontal style={{ width: 13, height: 13 }} />
      </button>

      {/* Context menu */}
      {contextMenu && contextMenuTab && (
        <TabContextMenu
          tabId={contextMenu.tabId}
          isPinned={contextMenuTab.pinned ?? false}
          x={contextMenu.x}
          y={contextMenu.y}
          tabLabel={contextMenuTab.label}
          tabIcon={contextMenuTab.icon}
          tabColor={contextMenuTab.color}
          onPin={() => {
            onTabPin?.(contextMenu.tabId);
            handleDismissContextMenu();
          }}
          onDuplicate={() => {
            onTabDuplicate?.(contextMenu.tabId);
            handleDismissContextMenu();
          }}
          onClose={() => {
            onTabClose(contextMenu.tabId);
            handleDismissContextMenu();
          }}
          onSplitView={() => {
            onSplitViewToggle?.();
            handleDismissContextMenu();
          }}
          onCloseOthers={() => {
            // Close all tabs except this one
            tabs.forEach((t) => {
              if (t.id !== contextMenu.tabId) {
                onTabClose(t.id);
              }
            });
            handleDismissContextMenu();
          }}
          onCloseToRight={() => {
            // Close all tabs to the right of this one
            const tabIndex = tabs.findIndex((t) => t.id === contextMenu.tabId);
            if (tabIndex !== -1) {
              tabs.slice(tabIndex + 1).forEach((t) => {
                onTabClose(t.id);
              });
            }
            handleDismissContextMenu();
          }}
          onDismiss={handleDismissContextMenu}
        />
      )}

      {/* New Workspace Dialog */}
      <NewWorkspaceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSelectTemplate={handleAddTab}
      />
    </div>
  );
}
