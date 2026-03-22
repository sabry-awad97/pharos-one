import * as React from "react";
import { MoreVertical } from "lucide-react";

export interface SidebarSubItemProps {
  /** Unique identifier for the sub-item */
  id: string;
  /** Label text to display */
  label: string;
  /** Whether this item is currently active */
  active: boolean;
  /** Click handler that receives the item id */
  onClick: (id: string) => void;
  /** Whether this item is focused via keyboard navigation */
  focused?: boolean;
  /** Optional context menu handler */
  onContextMenu?: (e: React.MouseEvent, id: string) => void;
  /** Optional badge count or label */
  badge?: number | string;
}

/**
 * Sub-item component for hierarchical sidebar navigation
 * Displays label only (no icon) with indentation
 */
const SidebarSubItem = React.forwardRef<HTMLButtonElement, SidebarSubItemProps>(
  (
    { id, label, active, onClick, focused = false, onContextMenu, badge },
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
        className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          height: 32,
          padding: "6px 8px",
          border: "none",
          cursor: "default",
          background: active
            ? "rgba(0,120,212,0.05)"
            : isHovered
              ? "#fafafa"
              : "transparent",
          borderLeft: "3px solid transparent",
          transition: "background .1s",
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
          outline: focused ? "2px solid #0078d4" : "none",
          outlineOffset: -2,
          position: "relative",
          borderRadius: 4,
        }}
      >
        {/* Tree line positioned under parent icon */}
        <span
          style={{
            position: "absolute",
            left: -8,
            top: 0,
            bottom: 0,
            width: 2,
            background: active ? "#0078d4" : "#e0e0e0",
          }}
        />
        <span
          style={{
            fontSize: 11,
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
        {/* Badge pill */}
        {badge !== undefined && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#616161",
              background: "#f0f0f0",
              borderRadius: 10,
              padding: "2px 6px",
              marginLeft: 8,
              flexShrink: 0,
            }}
          >
            {badge}
          </span>
        )}
        {/* MoreVertical icon */}
        {onContextMenu && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (onContextMenu) {
                onContextMenu(e, id);
              }
            }}
            style={{
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.1s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              borderRadius: 4,
              flexShrink: 0,
              marginLeft: 4,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background =
                "transparent";
            }}
          >
            <MoreVertical
              style={{
                width: 14,
                height: 14,
                color: "#616161",
              }}
            />
          </div>
        )}
      </button>
    );
  },
);
SidebarSubItem.displayName = "SidebarSubItem";

export { SidebarSubItem };
