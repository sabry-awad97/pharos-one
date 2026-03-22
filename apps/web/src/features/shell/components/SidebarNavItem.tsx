import * as React from "react";
import type { LucideIcon } from "lucide-react";

export interface SidebarNavItemProps {
  /** Unique identifier for the navigation item */
  id: string;
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Label text to display */
  label: string;
  /** Whether this item is currently active */
  active: boolean;
  /** Whether the sidebar is expanded (shows label) */
  expanded: boolean;
  /** Click handler that receives the item id */
  onClick: (id: string) => void;
  /** Optional inline styles for customization (e.g., indentation) */
  style?: React.CSSProperties;
  /** Whether this item is focused via keyboard navigation */
  focused?: boolean;
  /** Optional context menu handler */
  onContextMenu?: (e: React.MouseEvent, id: string) => void;
  /** Optional badge count or label */
  badge?: number | string;
}

/**
 * Navigation item component for the sidebar
 * Displays an icon and optional label with proper active/hover states
 * matching Windows Explorer design
 */
const SidebarNavItem = React.forwardRef<HTMLButtonElement, SidebarNavItemProps>(
  (
    {
      id,
      icon: Icon,
      label,
      active,
      expanded,
      onClick,
      style,
      focused = false,
      onContextMenu,
      badge,
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleClick = () => {
      onClick(id);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
      if (onContextMenu) {
        e.preventDefault();
        onContextMenu(e, id);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={!expanded ? label : undefined}
        className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: expanded ? "flex-start" : "flex-start",
          height: 36,
          padding: expanded ? "6px 12px" : "6px 14px 6px 12px",
          border: "none",
          cursor: "default",
          background: active
            ? "rgba(0,120,212,0.1)"
            : isHovered
              ? "#f5f5f5"
              : "transparent",
          borderLeft: active ? "3px solid #0078d4" : "3px solid transparent",
          gap: expanded ? 10 : 0,
          transition: "background .1s",
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
          outline: focused ? "2px solid #0078d4" : "none",
          outlineOffset: -2,
          ...style,
        }}
      >
        <Icon
          style={{
            width: 16,
            height: 16,
            color: active ? "#0078d4" : "#616161",
            flexShrink: 0,
          }}
        />

        {expanded && (
          <span
            style={{
              fontSize: 12,
              fontWeight: active ? 600 : 400,
              color: active ? "#0078d4" : "#333",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              textAlign: "left",
            }}
          >
            {label}
          </span>
        )}

        {expanded && badge !== undefined && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: active ? "#0078d4" : "#616161",
              background: active ? "rgba(0,120,212,0.1)" : "#f0f0f0",
              padding: "2px 6px",
              borderRadius: 10,
              minWidth: 20,
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            {badge}
          </span>
        )}
      </button>
    );
  },
);
SidebarNavItem.displayName = "SidebarNavItem";

export { SidebarNavItem };
