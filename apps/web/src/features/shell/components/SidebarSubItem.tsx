import * as React from "react";

export interface SidebarSubItemProps {
  /** Unique identifier for the sub-item */
  id: string;
  /** Label text to display */
  label: string;
  /** Whether this item is currently active */
  active: boolean;
  /** Click handler that receives the item id */
  onClick: (id: string) => void;
}

/**
 * Sub-item component for hierarchical sidebar navigation
 * Displays label only (no icon) with indentation
 */
const SidebarSubItem = React.forwardRef<HTMLButtonElement, SidebarSubItemProps>(
  ({ id, label, active, onClick }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleClick = () => {
      onClick(id);
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          height: 32,
          padding: "6px 12px",
          paddingLeft: 40,
          border: "none",
          cursor: "pointer",
          background: active
            ? "rgba(0,120,212,0.1)"
            : isHovered
              ? "#f5f5f5"
              : "transparent",
          borderLeft: active ? "3px solid #0078d4" : "3px solid transparent",
          transition: "background .1s",
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: active ? 600 : 400,
            color: active ? "#0078d4" : "#333",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </button>
    );
  },
);
SidebarSubItem.displayName = "SidebarSubItem";

export { SidebarSubItem };
