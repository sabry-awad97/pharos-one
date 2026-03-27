/**
 * Sidebar navigation compound components
 * SidebarNav, SidebarNavItem, SidebarNavGroup, SidebarStats
 *
 * Used to build workspace-specific sidebar navigation.
 */

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, ChevronDown } from "lucide-react";

// ============================================================================
// SidebarNav
// ============================================================================

export interface SidebarNavProps {
  /** Navigation items or groups */
  children: React.ReactNode;
}

/**
 * Container for workspace sidebar navigation items.
 * Scrolls vertically when content overflows.
 */
export function SidebarNav({ children }: SidebarNavProps) {
  return (
    <nav
      data-testid="sidebar-nav"
      aria-label="Sidebar navigation"
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflowY: "auto",
        padding: "4px 0",
      }}
    >
      {children}
    </nav>
  );
}

// ============================================================================
// SidebarNavItem
// ============================================================================

export interface SidebarNavItemProps {
  /** Optional icon from lucide-react */
  icon?: LucideIcon;
  /** Display label */
  label: string;
  /** Optional badge count or string */
  badge?: number | string;
  /** Whether this item is currently active */
  active?: boolean;
  /** Click handler */
  onClick?: () => void;
}

/**
 * Individual navigation item in the sidebar.
 * Supports icon, badge, active state, and keyboard navigation.
 * Matches global sidebar styling exactly.
 */
export function SidebarNavItem({
  icon: Icon,
  label,
  badge,
  active = false,
  onClick,
}: SidebarNavItemProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type="button"
      role="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      tabIndex={0}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: 10,
        height: 36,
        padding: "6px 12px",
        border: "none",
        borderLeft: active ? "3px solid #0078d4" : "3px solid transparent",
        background: active
          ? "rgba(0,120,212,0.1)"
          : hovered
            ? "#f5f5f5"
            : "transparent",
        cursor: "default",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        transition: "background .1s",
      }}
    >
      {Icon && (
        <Icon
          aria-hidden
          style={{
            width: 16,
            height: 16,
            color: active ? "#0078d4" : "#616161",
            flexShrink: 0,
          }}
        />
      )}
      <span
        style={{
          fontSize: 12,
          flex: 1,
          textAlign: "left",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontWeight: active ? 600 : 400,
          color: active ? "#0078d4" : "#333",
        }}
      >
        {label}
      </span>
      {badge !== undefined && (
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
}

// ============================================================================
// SidebarNavGroup
// ============================================================================

export interface SidebarNavGroupProps {
  /** Group header label */
  label: string;
  /** Whether the group is expanded by default (default: false) */
  defaultExpanded?: boolean;
  /** Child nav items */
  children: React.ReactNode;
}

/**
 * Collapsible navigation group with a header.
 * Remembers expanded state via local React state.
 */
export function SidebarNavGroup({
  label,
  defaultExpanded = false,
  children,
}: SidebarNavGroupProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const [hovered, setHovered] = React.useState(false);

  return (
    <div data-testid="sidebar-nav-group">
      <div style={{ position: "relative" }}>
        <button
          type="button"
          aria-label={label}
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: 28,
            padding: "0 12px",
            border: "none",
            background: hovered ? "#f5f5f5" : "transparent",
            cursor: "default",
            fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
            transition: "background .1s",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              color: "#888",
              flex: 1,
              textAlign: "left",
            }}
          >
            {label}
          </span>
        </button>

        {/* Chevron button positioned absolutely on the right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#f0f0f0";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
          }}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "default",
            color: "#616161",
            transition: "transform 0.2s ease, background 0.1s ease",
            borderRadius: "50%",
          }}
        >
          <ChevronDown
            style={{
              width: 12,
              height: 12,
              transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>
      </div>

      {/* Sub-items with grid animation like global sidebar */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: expanded ? "1fr" : "0fr",
          opacity: expanded ? 1 : 0,
          transition: "all 0.2s ease-in-out",
          marginTop: expanded ? 4 : 0,
          marginBottom: expanded ? 4 : 0,
        }}
      >
        <div
          style={{
            overflow: "hidden",
            paddingLeft: 28,
            paddingRight: 8,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Tree border line - positioned to align with parent icon center */}
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 0,
              bottom: 0,
              width: 2,
              background: "#e0e0e0",
            }}
          />
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SidebarStats
// ============================================================================

export interface StatItem {
  /** Stat label */
  label: string;
  /** Stat display value */
  value: string;
  /** Optional trend direction */
  trend?: "up" | "down";
}

export interface SidebarStatsProps {
  /** Array of stat items to display */
  stats: StatItem[];
}

/**
 * Stats panel for the sidebar footer.
 * Displays a compact grid of label/value pairs with optional trend indicators.
 */
export function SidebarStats({ stats }: SidebarStatsProps) {
  return (
    <div
      data-testid="sidebar-stats"
      style={{
        padding: "8px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "#616161",
              flex: 1,
            }}
          >
            {stat.label}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#1a1a1a",
              }}
            >
              {stat.value}
            </span>
            {stat.trend === "up" && (
              <TrendingUp
                aria-label="trending up"
                style={{
                  width: 11,
                  height: 11,
                  color: "#107c10",
                }}
              />
            )}
            {stat.trend === "down" && (
              <TrendingDown
                aria-label="trending down"
                style={{
                  width: 11,
                  height: 11,
                  color: "#a4262c",
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
