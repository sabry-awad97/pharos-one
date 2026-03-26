import * as React from "react";
import { ChevronDown } from "lucide-react";
import { WORKSPACE_TEMPLATES } from "@/features/workspace/constants";
import {
  useSidebarStateStore,
  DEFAULT_WIDTH,
} from "@/features/workspace/stores/sidebar-state-store";
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
    // Use Zustand store directly for global sidebar state
    // Select the entire workspace state object to avoid calling getWorkspaceState in selector
    const workspaceState = useSidebarStateStore(
      (state) =>
        state.workspaces["global"] || {
          expanded: true,
          expandedModules: [],
          pinnedItems: [],
          hiddenItems: [],
          width: DEFAULT_WIDTH,
        },
    );

    const {
      expanded,
      expandedModules,
      pinnedItems,
      hiddenItems,
      width: sidebarWidth,
    } = workspaceState;

    const toggle = useSidebarStateStore((state) => state.toggle);
    const toggleModule = useSidebarStateStore((state) => state.toggleModule);
    const togglePin = useSidebarStateStore((state) => state.togglePin);
    const toggleHide = useSidebarStateStore((state) => state.toggleHide);
    const setSidebarWidth = useSidebarStateStore(
      (state) => state.setSidebarWidth,
    );

    const [hoveredHandle, setHoveredHandle] = React.useState(false);
    const [isResizing, setIsResizing] = React.useState(false);
    const [resizeTooltipWidth, setResizeTooltipWidth] = React.useState<
      number | null
    >(null);
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
        (t) => !hiddenItems.includes(t.id),
      );
      return filtered.sort((a, b) => {
        const aPinned = pinnedItems.includes(a.id);
        const bPinned = pinnedItems.includes(b.id);
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
        if (
          template.subItems &&
          expanded &&
          expandedModules.includes(template.id)
        ) {
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
          toggle("global");
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
        isPinned: pinnedItems.includes(itemId),
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
        togglePin("global", contextMenu.itemId);
        setContextMenu(null);
      }
    };

    const handleContextMenuHide = () => {
      if (contextMenu) {
        toggleHide("global", contextMenu.itemId);
        setContextMenu(null);
      }
    };

    // Drag handle resize logic
    const handleMouseDown = (e: React.MouseEvent) => {
      if (!expanded) return; // Disable resize when collapsed

      e.preventDefault();
      setIsResizing(true);
      setResizeTooltipWidth(sidebarWidth);

      const startX = e.clientX;
      const startWidth = sidebarWidth;
      const minWidth = 160;

      const handleMouseMove = (e: MouseEvent) => {
        const delta = e.clientX - startX;
        const newWidth = Math.max(minWidth, startWidth + delta);
        setSidebarWidth("global", newWidth);
        setResizeTooltipWidth(newWidth);
      };

      const cleanup = () => {
        setIsResizing(false);
        setResizeTooltipWidth(null);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", cleanup);
        window.removeEventListener("blur", cleanup);
        document.removeEventListener("visibilitychange", cleanup);
      };

      // Attach to window for global event handling
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", cleanup);
      window.addEventListener("blur", cleanup); // 🔥 CRITICAL: Stop dragging if window loses focus
      document.addEventListener("visibilitychange", cleanup); // Stop if tab becomes hidden
    };

    // Double-click handle to toggle collapse/expand
    const handleDoubleClick = () => {
      toggle("global");
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
          zIndex: 5,
        }}
      >
        {/* Navigation items */}
        <nav style={{ flex: 1, overflow: "auto" }} className="custom-scrollbar">
          {visibleTemplates.map((template, moduleIndex) => {
            const hasSubItems =
              template.subItems && template.subItems.length > 0;
            const isModuleExpanded = expandedModules.includes(template.id);

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
                expandedModules.includes(prevTemplate.id)
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
                    onClick={(id) => {
                      // If item has sub-items, only toggle expansion (don't navigate)
                      if (hasSubItems) {
                        toggleModule("global", id);
                      } else {
                        // Leaf items navigate normally
                        onModuleClick(id);
                      }
                    }}
                    focused={isModuleFocused}
                    onContextMenu={handleContextMenu}
                    badge={template.badge}
                  />
                  {/* Chevron for modules with sub-items */}
                  {hasSubItems && expanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleModule("global", template.id);
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = isActive
                          ? "rgba(0,120,212,0.2)"
                          : "#f0f0f0";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = isActive
                          ? "rgba(0,120,212,0.15)"
                          : "transparent";
                      }}
                      style={{
                        position: "absolute",
                        right: 8,
                        width: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isActive
                          ? "rgba(0,120,212,0.15)"
                          : "transparent",
                        border: "none",
                        cursor: "default",
                        color: isActive ? "#0078d4" : "#616161",
                        transition: "transform 0.2s ease, background 0.1s ease",
                        transform: isModuleExpanded
                          ? "rotate(0deg)"
                          : "rotate(-90deg)",
                        borderRadius: "50%",
                      }}
                    >
                      <ChevronDown style={{ width: 12, height: 12 }} />
                    </button>
                  )}
                </div>

                {/* Sub-items (only when module is expanded and sidebar is expanded) */}
                {hasSubItems && expanded && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: isModuleExpanded ? "1fr" : "0fr",
                      opacity: isModuleExpanded ? 1 : 0,
                      transition: "all 0.2s ease-in-out",
                      marginTop: isModuleExpanded ? 4 : 0,
                      marginBottom: isModuleExpanded ? 4 : 0,
                    }}
                  >
                    <div
                      style={{
                        overflow: "hidden",
                        paddingLeft: 28,
                        paddingRight: 8,
                        display: "flex",
                        flexDirection: "column",
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
                            badge={subItem.badge}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Stats panel (only when expanded) */}
        {expanded && stats && <SidebarStats stats={stats} />}

        {/* Drag handle for resizing */}
        <div
          data-testid="sidebar-drag-handle"
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
            cursor: "ew-resize",
            background: hoveredHandle || isResizing ? "#91c9f7" : "transparent",
            transition: "background 0.1s",
            zIndex: 15,
          }}
        />

        {/* Resize width tooltip */}
        {resizeTooltipWidth !== null && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: resizeTooltipWidth + 16,
              transform: "translateY(-50%)",
              pointerEvents: "none",
              zIndex: 50,
            }}
          >
            <div
              style={{
                background: "rgba(0, 0, 0, 0.85)",
                color: "#ffffff",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                letterSpacing: "0.5px",
                boxShadow:
                  "0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              {Math.round(resizeTooltipWidth)}px
            </div>
            {/* Arrow pointing to rail */}
            <div
              style={{
                position: "absolute",
                left: "-6px",
                top: "50%",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderRight: "6px solid rgba(0, 0, 0, 0.85)",
              }}
            />
          </div>
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
