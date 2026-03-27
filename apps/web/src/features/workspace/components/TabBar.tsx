/**
 * TabBar component
 * Container for all workspace tabs
 */

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Plus,
  SplitSquareHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Tab } from "../types";
import { SortableTabItem } from "./SortableTabItem";
import { TabContextMenu } from "./TabContextMenu";
import { TabOverflow } from "./TabOverflow";
import { NewWorkspaceDialog } from "./NewWorkspaceDialog";
import { calculateTabOverflow } from "../stores/tabs-store";
import type { TabOverflowMode } from "../stores/tabs-store";
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
  /** Handler for tab reordering */
  onTabReorder?: (fromIndex: number, toIndex: number) => void;
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
  onTabReorder,
}: TabBarProps) {
  const [contextMenu, setContextMenu] = useState<{
    tabId: string;
    x: number;
    y: number;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Calculate visible vs overflow tabs
  const { visibleTabs, overflowTabs, hasOverflow, mode } = useMemo(
    () => calculateTabOverflow(tabs),
    [tabs],
  );

  // Track scroll position for gradient indicators
  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || mode !== "scrollable") return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [mode, visibleTabs]);

  const scrollTabs = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -120 : 120,
      behavior: "smooth",
    });
  };

  // Setup drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Keyboard navigation for tab reordering
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+W: close active tab
      if (e.ctrlKey && !e.shiftKey && e.key === "w") {
        e.preventDefault();
        if (activeTabId) {
          onTabClose(activeTabId);
        }
        return;
      }

      // Ctrl+Shift+Arrow: reorder tabs
      if (
        e.ctrlKey &&
        e.shiftKey &&
        (e.key === "ArrowLeft" || e.key === "ArrowRight")
      ) {
        e.preventDefault();
        if (!activeTabId || !onTabReorder) return;

        const activeIndex = tabs.findIndex((t) => t.id === activeTabId);
        if (activeIndex === -1) return;

        const activeTab = tabs[activeIndex];
        const direction = e.key === "ArrowLeft" ? -1 : 1;
        const newIndex = activeIndex + direction;

        // Check if we're trying to move out of bounds
        if (newIndex < 0 || newIndex >= tabs.length) return;

        // Check if we're trying to move between pinned and regular sections
        const targetTab = tabs[newIndex];
        if (activeTab.pinned !== targetTab.pinned) return;

        onTabReorder(activeIndex, newIndex);
        return;
      }

      // Ctrl+Tab: cycle forward through all tabs (including overflow)
      if (e.ctrlKey && !e.shiftKey && e.key === "Tab") {
        e.preventDefault();
        if (tabs.length === 0) return;
        const activeIndex = tabs.findIndex((t) => t.id === activeTabId);
        const nextIndex = (activeIndex + 1) % tabs.length;
        onTabClick(tabs[nextIndex].id);
        return;
      }

      // Ctrl+Shift+Tab: cycle backward through all tabs
      if (e.ctrlKey && e.shiftKey && e.key === "Tab") {
        e.preventDefault();
        if (tabs.length === 0) return;
        const activeIndex = tabs.findIndex((t) => t.id === activeTabId);
        const prevIndex = (activeIndex - 1 + tabs.length) % tabs.length;
        onTabClick(tabs[prevIndex].id);
        return;
      }

      // Ctrl+1-9: jump to specific tab by position
      if (e.ctrlKey && !e.shiftKey && e.key >= "1" && e.key <= "9") {
        const index = parseInt(e.key, 10) - 1;
        if (index < tabs.length) {
          e.preventDefault();
          onTabClick(tabs[index].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tabs, activeTabId, onTabReorder, onTabClose]);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !onTabReorder) return;

    const oldIndex = tabs.findIndex((t) => t.id === active.id);
    const newIndex = tabs.findIndex((t) => t.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Prevent dragging between pinned and regular sections
    const activeTab = tabs[oldIndex];
    const overTab = tabs[newIndex];
    if (activeTab.pinned !== overTab.pinned) return;

    onTabReorder(oldIndex, newIndex);
  };

  // Arrow key navigation within tab list
  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let targetIndex = index;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        targetIndex = index > 0 ? index - 1 : tabs.length - 1;
        break;
      case "ArrowRight":
        e.preventDefault();
        targetIndex = index < tabs.length - 1 ? index + 1 : 0;
        break;
      case "Home":
        e.preventDefault();
        targetIndex = 0;
        break;
      case "End":
        e.preventDefault();
        targetIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    onTabClick(tabs[targetIndex].id);
  };

  const contextMenuTab = contextMenu
    ? tabs.find((t) => t.id === contextMenu.tabId)
    : null;

  // Separate pinned and regular tabs
  const pinnedTabs = visibleTabs.filter((t) => t.pinned);
  const regularTabs = visibleTabs.filter((t) => !t.pinned);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div
        role="tablist"
        aria-orientation="horizontal"
        aria-label="Workspace tabs"
        data-testid="tab-bar"
        style={{
          height: 36,
          background: "#f0f0f0",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "flex-end",
          flexShrink: 0,
          overflow: "hidden",
          position: "relative",
          zIndex: 5,
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Pinned tabs group */}
        {pinnedTabs.length > 0 && (
          <SortableContext
            items={pinnedTabs.map((t) => t.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                height: "100%",
                borderRight: "1px solid #e0e0e0",
                paddingRight: 2,
              }}
            >
              {pinnedTabs.map((tab, idx) => {
                const globalIndex = tabs.findIndex((t) => t.id === tab.id);
                return (
                  <SortableTabItem
                    key={tab.id}
                    id={tab.id}
                    tab={tab}
                    active={tab.id === activeTabId}
                    onClick={() => onTabClick(tab.id)}
                    onClose={(e) => {
                      e.stopPropagation();
                      onTabClose(tab.id);
                    }}
                    onContextMenu={(e) => handleContextMenu(tab.id, e)}
                    index={globalIndex}
                    totalTabs={tabs.length}
                    onKeyDown={(e) => handleTabKeyDown(e, globalIndex)}
                  />
                );
              })}
            </div>
          </SortableContext>
        )}

        {/* Regular tabs — scrollable or fixed */}
        <SortableContext
          items={regularTabs.map((t) => t.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              height: "100%",
              flex: 1,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Left scroll button + fade */}
            {mode === "scrollable" && canScrollLeft && (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 32,
                    background:
                      "linear-gradient(to right, #f0f0f0 60%, transparent)",
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                />
                <button
                  onClick={() => scrollTabs("left")}
                  style={{
                    position: "absolute",
                    left: 2,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 3,
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #d0d0d0",
                    borderRadius: 3,
                    background: "#f8f8f8",
                    color: "#616161",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  aria-label="Scroll tabs left"
                >
                  <ChevronLeft style={{ width: 12, height: 12 }} />
                </button>
              </>
            )}

            <div
              ref={scrollRef}
              onWheel={(e) => {
                if (mode === "scrollable") {
                  e.preventDefault();
                  scrollRef.current?.scrollBy({
                    left: e.deltaY + e.deltaX,
                    behavior: "auto",
                  });
                }
              }}
              style={{
                display: "flex",
                alignItems: "flex-end",
                height: "100%",
                flex: 1,
                overflowX: mode === "scrollable" ? "auto" : "hidden",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollBehavior: "smooth",
              }}
            >
              {regularTabs.map((tab) => {
                const globalIndex = tabs.findIndex((t) => t.id === tab.id);
                return (
                  <SortableTabItem
                    key={tab.id}
                    id={tab.id}
                    tab={tab}
                    active={tab.id === activeTabId}
                    onClick={() => onTabClick(tab.id)}
                    onClose={(e) => {
                      e.stopPropagation();
                      onTabClose(tab.id);
                    }}
                    onContextMenu={(e) => handleContextMenu(tab.id, e)}
                    index={globalIndex}
                    totalTabs={tabs.length}
                    onKeyDown={(e) => handleTabKeyDown(e, globalIndex)}
                  />
                );
              })}
            </div>

            {/* Right scroll button + fade */}
            {mode === "scrollable" && canScrollRight && (
              <>
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 32,
                    background:
                      "linear-gradient(to left, #f0f0f0 60%, transparent)",
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                />
                <button
                  onClick={() => scrollTabs("right")}
                  style={{
                    position: "absolute",
                    right: 2,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 3,
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #d0d0d0",
                    borderRadius: 3,
                    background: "#f8f8f8",
                    color: "#616161",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  aria-label="Scroll tabs right"
                >
                  <ChevronRight style={{ width: 12, height: 12 }} />
                </button>
              </>
            )}
          </div>
        </SortableContext>

        {/* Overflow indicator — dropdown mode only */}
        {mode === "dropdown" && overflowTabs.length > 0 && (
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
              (e.currentTarget as HTMLButtonElement).style.background =
                "#f0f0f0";
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
              const tabIndex = tabs.findIndex(
                (t) => t.id === contextMenu.tabId,
              );
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
    </DndContext>
  );
}
