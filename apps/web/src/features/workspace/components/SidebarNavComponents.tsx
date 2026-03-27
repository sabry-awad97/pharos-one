/**
 * Sidebar navigation compound components
 * SidebarNav, SidebarNavItem, SidebarNavGroup, SidebarStats
 *
 * Used to build workspace-specific sidebar navigation.
 */

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";

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
        gap: 8,
        height: 32,
        padding: "0 12px",
        border: "none",
        borderLeft: active ? "3px solid var(--sidebar-primary, #0078d4)" : "3px solid transparent",
        background: active
          ? "var(--sidebar-accent, rgba(0,120,212,0.1))"
          : hovered
            ? "var(--surface-hover, #f0f0f0)"
            : "transparent",
        cursor: "default",
        fontFamily: "var(--font-sans, 'Segoe UI', system-ui, sans-serif)",
        transition: "background var(--duration-instant, 100ms)",
      }}
    >
      {Icon && (
        <Icon
          aria-hidden
          style={{
            width: 14,
            height: 14,
            color: active ? "var(--sidebar-primary, #0078d4)" : "var(--sidebar-foreground, #616161)",
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
          color: active ? "var(--sidebar-primary, #0078d4)" : "var(--foreground, #333)",
        }}
      >
        {label}
      </span>
      {badge !== undefined && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: active ? "var(--sidebar-primary, #0078d4)" : "var(--muted-foreground, #616161)",
            background: active
              ? "var(--sidebar-accent, rgba(0,120,212,0.1))"
              : "var(--muted, #f0f0f0)",
            padding: "1px 5px",
            borderRadius: 10,
            minWidth: 18,
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
          gap: 6,
          height: 28,
          padding: "0 12px",
          border: "none",
          background: hovered ? "var(--surface-hover, #f0f0f0)" : "transparent",
          cursor: "default",
          fontFamily: "var(--font-sans, 'Segoe UI', system-ui, sans-serif)",
          transition: "background var(--duration-instant, 100ms)",
        }}
      >
        <ChevronRight
          aria-hidden
          style={{
            width: 12,
            height: 12,
            color: "var(--muted-foreground, #616161)",
            flexShrink: 0,
            transform: expanded ? "rotate(90deg)" : "none",
            transition: "transform var(--duration-fast, 150ms) var(--ease-standard, ease)",
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            color: "var(--muted-foreground, #888)",
            flex: 1,
            textAlign: "left",
          }}
        >
          {label}
        </span>
      </button>

      {expanded && (
        <div
          style={{
            paddingLeft: 8,
          }}
        >
          {children}
        </div>
      )}
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
        gap: 6,
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
              color: "var(--muted-foreground, #888)",
              flex: 1,
            }}
          >
            {stat.label}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--foreground, #1a1a1a)",
              }}
            >
              {stat.value}
            </span>
            {stat.trend === "up" && (
              <TrendingUp
                aria-label="trending up"
                style={{ width: 11, height: 11, color: "var(--success, #16a34a)" }}
              />
            )}
            {stat.trend === "down" && (
              <TrendingDown
                aria-label="trending down"
                style={{ width: 11, height: 11, color: "var(--destructive, #dc2626)" }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
