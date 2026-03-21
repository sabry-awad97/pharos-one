import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatItem {
  /** Label for the metric */
  label: string;
  /** Value to display (formatted string) */
  value: string;
  /** Trend direction */
  trend: "up" | "down";
}

export interface SidebarStatsProps {
  /** Array of stat items to display */
  stats: StatItem[];
}

/**
 * Stats panel component for the sidebar
 * Displays today's key metrics with trend indicators
 * Only renders when sidebar is expanded (controlled by parent)
 */
const SidebarStats = React.forwardRef<HTMLDivElement, SidebarStatsProps>(
  ({ stats }, ref) => {
    return (
      <div
        ref={ref}
        style={{ padding: "8px 12px", borderTop: "1px solid #e8e8e8" }}
      >
        <p
          style={{
            fontSize: 10,
            color: "#919191",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          Today
        </p>
        {stats.map(({ label, value, trend }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 3,
            }}
          >
            <span style={{ fontSize: 11, color: "#616161" }}>{label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#1a1a1a",
                }}
              >
                {value}
              </span>
              {trend === "up" ? (
                <TrendingUp
                  style={{ width: 11, height: 11, color: "#107c10" }}
                />
              ) : (
                <TrendingDown
                  style={{ width: 11, height: 11, color: "#a4262c" }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  },
);
SidebarStats.displayName = "SidebarStats";

export { SidebarStats };
