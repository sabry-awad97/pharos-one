import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { WORKSPACE_TEMPLATES } from "@/features/workspace/constants";
import { useSidebarState } from "../hooks/use-sidebar-state";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarSubItem } from "./SidebarSubItem";
import { SidebarStats } from "./SidebarStats";
import { SidebarContextMenu } from "./SidebarContextMenu";

export interface SidebarProps {
  /** Currently active module ID */
  activeModule: string | null;
  /** Handler called when a module is clicked */
  onModuleClick: (moduleId: string) => void;
  /** Optional stats data to display */
  stats?: Array<{ label: string; value: string; trend: "up" | "down" }>;
}

/**
 * Main sidebar component
 * Composes navigation items, stats panel, and collapse toggle
 * Matches Windows Explorer aesthetic
 */
const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ activeModule, onModuleClick, stats }, ref) => {
    const {
      expanded,
      toggle,
      expandedModules,
      toggleModule,
      pinnedItems,
      togglePin,
      hiddenItems,
      toggleHide,
      sidebarWidth,
      setSidebarWidth,
      resetWidth,
    } = useSidebarState();
    const [hoveredToggle, setHoveredToggle] = React.useState(false);
    const [hoveredHandle, setHoveredHandle] = React.useState(false);
    const [isResizing, setIsResizing] = React.useState(false);
    const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
    const [keyboardMode, setKeyboardMode] = React.useState(false);
    const [contextMenu, setContextMenu] = React.useState<{
      x: number;
      y: number;
      itemId: string;
      isPinned: boolean;
    } | null>(null);

    // Filter and sort templates: remove hidden, sort pinned to top
    const visibleTemplates = React.useMemo(() => {
      const filtered = WORKSPACE_TEMPLATES.filter(
        (t) => !hiddenItems.has(t.id),
      );
      return filtered.sort((a, b) => {
        const aPinned = pinnedItems.has(a.id);
        const bPinned = pinnedItems.has(b.id);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        return 0;
      });
    }, [hiddenItems, pinnedItems]);

    // Build flat list of all navigable items (modules + visible sub-items)
    const navItems = React.useMemo(() => {
      const items: Array<{ id: string; type: "module" | "subitem" }> = [];
      visibleTemplates.forEach((template) => {
        items.push({ id: template.id, type: "module" });
        if (template.subItems && expanded && expandedModules.has(template.id)) {
          template.subItems.forEach((subItem) => {
            items.push({ id: subItem.id, type: "subitem" });
          });
        }
      });
      return items;
    }, [visibleTemplates, expanded, expandedModules]);

    // Keyboard shortcuts
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Ctrl+B: Toggle collapse
        if (e.ctrlKey && e.key === "b") {
          e.preventDefault();
          toggle();
          return;
        }

        // Ctrl+1-6: Jump to module
        if (e.ctrlKey && e.key >= "1" && e.key <= "6") {
          e.preventDefault();
          const index = parseInt(e.key) - 1;
          const module = WORKSPACE_TEMPLATES[index];
          if (module) {
            onModuleClick(module.id);
          }
          return;
        }

        // Alt+Arrow: Navigate items
        if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
          e.preventDefault();
          setKeyboardMode(true);

          setFocusedIndex((current) => {
            if (navItems.length === 0) return -1;

            if (current === -1) {
              // Start from first item
              return e.key === "ArrowDown" ? 0 : navItems.length - 1;
            }

            // Navigate up or down with wrapping
            if (e.key === "ArrowDown") {
              return (current + 1) % navItems.length;
            } else {
              return current === 0 ? navItems.length - 1 : current - 1;
            }
          });
          return;
        }

        // Enter: Activate focused item
        if (e.key === "Enter" && focusedIndex >= 0 && keyboardMode) {
          e.preventDefault();
          const item = navItems[focusedIndex];
          if (item) {
            onModuleClick(item.id);
          }
          return;
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggle, onModuleClick, navItems, focusedIndex, keyboardMode]);

    // Reset keyboard mode on mouse interaction
    const handleMouseInteraction = () => {
      if (keyboardMode) {
        setKeyboardMode(false);
        setFocusedIndex(-1);
      }
    };

    // Context menu handlers
    const handleContextMenu = (e: React.MouseEvent, itemId: string) => {
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        itemId,
        isPinned: pinnedItems.has(itemId),
      });
    };

    const handleContextMenuDismiss = () => {
      setContextMenu(null);
    };

    const handleContextMenuOpen = () => {
      if (contextMenu) {
        onModuleClick(contextMenu.itemId);
        setContextMenu(null);
      }
    };

    const handleContextMenuOpenInNewTab = () => {
      if (contextMenu) {
        // Always create a new tab by calling onModuleClick
        // The parent component will handle creating a new tab
        onModuleClick(contextMenu.itemId);
        setContextMenu(null);
      }
    };

    const handleContextMenuPin = () => {
      if (contextMenu) {
        togglePin(contextMenu.itemId);
        setContextMenu(null);
      }
    };

    const handleContextMenuHide = () => {
      if (contextMenu) {
        toggleHide(contextMenu.itemId);
        setContextMenu(null);
      }
    };

    // Drag handle resize logic
    const handleMouseDown = (e: React.MouseEvent) => {
      if (!expanded) return; // Disable resize when collapsed

      e.preventDefault();
      setIsResizing(true);

      const startX = e.clientX;
      const startWidth = sidebarWidth;

      const handleMouseMove = (e: MouseEvent) => {
        const delta = e.clientX - startX;
        const newWidth = startWidth + delta;
        setSidebarWidth(newWidth);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    // Double-click handle to reset width
    const handleDoubleClick = () => {
      if (expanded) {
        resetWidth();
      }
    };

    // Clean up event listeners on unmount
    React.useEffect(() => {
      return () => {
        // Cleanup in case component unmounts during resize
        document.removeEventListener("mousemove", () => {});
        document.removeEventListener("mouseup", () => {});
      };
    }, []);

    return (
      <div
        ref={ref}
        data-testid="sidebar"
        onMouseMove={handleMouseInteraction}
        onClick={handleMouseInteraction}
        style={{
          background: "#ffffff",
          borderRight: "1px solid #d1d1d1",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          width: expanded ? sidebarWidth : 48,
          transition: isResizing ? "none" : "width 0.15s ease",
          position: "relative",
        }}
      >
        {/* Navigation items */}
        <nav style={{ flex: 1, paddingTop: 6, overflow: "auto" }}>
          {visibleTemplates.map((template, moduleIndex) => {
            const hasSubItems =
              template.subItems && template.subItems.length > 0;
            const isModuleExpanded = expandedModules.has(template.id);

            // Check if this module or any of its sub-items are active
            const isModuleActive = activeModule === template.id;
            const isSubItemActive = !!(
              hasSubItems && activeModule?.startsWith(`${template.id}-`)
            );
            const isActive = isModuleActive || isSubItemActive;

            // Calculate if this module or any of its sub-items are focused
            let itemIndex = moduleIndex;
            for (let i = 0; i < moduleIndex; i++) {
              const prevTemplate = visibleTemplates[i];
              if (
                prevTemplate.subItems &&
                expanded &&
                expandedModules.has(prevTemplate.id)
              ) {
                itemIndex += prevTemplate.subItems.length;
              }
            }
            const isModuleFocused = keyboardMode && focusedIndex === itemIndex;

            return (
              <div key={template.id}>
                {/* Parent nav item */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <SidebarNavItem
                    id={template.id}
                    icon={template.icon}
                    label={template.label}
                    active={isActive}
                    expanded={expanded}
                    onClick={onModuleClick}
                    focused={isModuleFocused}
                    onContextMenu={handleContextMenu}
                  />
                  {/* Chevron for modules with sub-items */}
                  {hasSubItems && expanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleModule(template.id);
                      }}
                      style={{
                        position: "absolute",
                        right: 8,
                        width: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#616161",
                        transition: "transform 0.2s ease",
                        transform: isModuleExpanded
                          ? "rotate(0deg)"
                          : "rotate(-90deg)",
                      }}
                    >
                      <ChevronDown style={{ width: 12, height: 12 }} />
                    </button>
                  )}
                </div>

                {/* Sub-items (only when module is expanded and sidebar is expanded) */}
                {hasSubItems && expanded && isModuleExpanded && (
                  <div
                    style={{
                      overflow: "hidden",
                      transition: "max-height 0.2s ease",
                      marginTop: 2,
                      marginBottom: 4,
                      paddingLeft: 28,
                      paddingRight: 8,
                    }}
                  >
                    {template.subItems!.map((subItem, subIndex) => {
                      const subItemIndex = itemIndex + 1 + subIndex;
                      const isSubItemFocused =
                        keyboardMode && focusedIndex === subItemIndex;

                      return (
                        <SidebarSubItem
                          key={subItem.id}
                          id={subItem.id}
                          label={subItem.label}
                          active={activeModule === subItem.id}
                          onClick={onModuleClick}
                          focused={isSubItemFocused}
                          onContextMenu={handleContextMenu}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Stats panel (only when expanded) */}
        {expanded && stats && <SidebarStats stats={stats} />}

        {/* Collapse toggle button */}
        <button
          onClick={toggle}
          onMouseEnter={() => setHoveredToggle(true)}
          onMouseLeave={() => setHoveredToggle(false)}
          style={{
            height: 32,
            borderTop: "1px solid #e8e8e8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: hoveredToggle ? "#f5f5f5" : "transparent",
            border: "none",
            cursor: "pointer",
            color: "#919191",
            transition: "background 0.1s",
          }}
        >
          {expanded ? (
            <ChevronLeft style={{ width: 14, height: 14 }} />
          ) : (
            <ChevronRight style={{ width: 14, height: 14 }} />
          )}
        </button>

        {/* Drag handle for resizing (only when expanded) */}
        {expanded && (
          <div
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={() => setHoveredHandle(true)}
            onMouseLeave={() => setHoveredHandle(false)}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 2,
              height: "100%",
              cursor: "col-resize",
              background:
                hoveredHandle || isResizing ? "#91c9f7" : "transparent",
              transition: "background 0.1s",
              zIndex: 10,
            }}
          />
        )}

        {/* Context menu */}
        {contextMenu && (
          <SidebarContextMenu
            itemId={contextMenu.itemId}
            x={contextMenu.x}
            y={contextMenu.y}
            isPinned={contextMenu.isPinned}
            onOpen={handleContextMenuOpen}
            onOpenInNewTab={handleContextMenuOpenInNewTab}
            onPin={handleContextMenuPin}
            onHide={handleContextMenuHide}
            onDismiss={handleContextMenuDismiss}
          />
        )}
      </div>
    );
  },
);
Sidebar.displayName = "Sidebar";

export { Sidebar };
