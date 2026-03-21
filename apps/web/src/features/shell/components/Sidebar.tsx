import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { WORKSPACE_TEMPLATES } from "@/features/workspace/constants";
import { useSidebarState } from "../hooks/use-sidebar-state";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarSubItem } from "./SidebarSubItem";
import { SidebarStats } from "./SidebarStats";

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
    const { expanded, toggle, expandedModules, toggleModule } =
      useSidebarState();
    const [hoveredToggle, setHoveredToggle] = React.useState(false);

    return (
      <div
        ref={ref}
        style={{
          background: "#ffffff",
          borderRight: "1px solid #d1d1d1",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          width: expanded ? 180 : 48,
          transition: "width 0.15s ease",
        }}
      >
        {/* Navigation items */}
        <nav style={{ flex: 1, paddingTop: 6, overflow: "auto" }}>
          {WORKSPACE_TEMPLATES.map((template) => {
            const hasSubItems =
              template.subItems && template.subItems.length > 0;
            const isModuleExpanded = expandedModules.has(template.id);

            return (
              <div key={template.id}>
                {/* Parent nav item */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <SidebarNavItem
                    id={template.id}
                    icon={template.icon}
                    label={template.label}
                    active={activeModule === template.id}
                    expanded={expanded}
                    onClick={onModuleClick}
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
                    }}
                  >
                    {template.subItems!.map((subItem) => (
                      <SidebarSubItem
                        key={subItem.id}
                        id={subItem.id}
                        label={subItem.label}
                        active={activeModule === subItem.id}
                        onClick={onModuleClick}
                      />
                    ))}
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
      </div>
    );
  },
);
Sidebar.displayName = "Sidebar";

export { Sidebar };
