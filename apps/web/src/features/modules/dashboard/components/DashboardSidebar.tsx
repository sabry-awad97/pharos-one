/**
 * DashboardSidebar component
 * Context-aware sidebar for dashboard workspace with widget selector and customization
 */

import {
  LayoutDashboard,
  TrendingUp,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import {
  SidebarContainer,
  SidebarContent,
  SidebarFooter,
} from "@/features/workspace/components/SidebarContainer";
import {
  SidebarNav,
  SidebarNavItem,
  SidebarNavGroup,
  SidebarStats,
  type StatItem,
} from "@/features/workspace/components/SidebarNavComponents";

export type DashboardView = "overview" | "sales" | "alerts" | "analytics";

export interface DashboardSidebarProps {
  /** Currently active view */
  activeView: DashboardView;
  /** View change handler */
  onViewChange: (view: DashboardView) => void;
  /** Alerts count */
  alertsCount?: number;
  /** Total widgets */
  totalWidgets?: number;
  /** Active widgets */
  activeWidgets?: number;
}

/**
 * Dashboard workspace sidebar with widget selector and customization
 */
export function DashboardSidebar({
  activeView,
  onViewChange,
  alertsCount = 0,
  totalWidgets = 0,
  activeWidgets = 0,
}: DashboardSidebarProps) {
  // Stats for footer
  const stats: StatItem[] = [
    {
      label: "Active Widgets",
      value: activeWidgets.toString(),
    },
    {
      label: "Total Widgets",
      value: totalWidgets.toString(),
    },
  ];

  return (
    <SidebarContainer workspaceId="dashboard" defaultWidth={220}>
      <SidebarContent>
        <SidebarNav>
          {/* Main view */}
          <SidebarNavItem
            icon={LayoutDashboard}
            label="Overview"
            active={activeView === "overview"}
            onClick={() => onViewChange("overview")}
          />

          {/* Widgets group */}
          <SidebarNavGroup label="Widgets" defaultExpanded>
            <SidebarNavItem
              icon={TrendingUp}
              label="Sales"
              active={activeView === "sales"}
              onClick={() => onViewChange("sales")}
            />
            <SidebarNavItem
              icon={AlertCircle}
              label="Alerts"
              badge={alertsCount}
              active={activeView === "alerts"}
              onClick={() => onViewChange("alerts")}
            />
            <SidebarNavItem
              icon={BarChart3}
              label="Analytics"
              active={activeView === "analytics"}
              onClick={() => onViewChange("analytics")}
            />
          </SidebarNavGroup>

          {/* Chart Types group */}
          <SidebarNavGroup label="Chart Types" defaultExpanded={false}>
            <SidebarNavItem
              icon={BarChart3}
              label="Bar Chart"
              active={false}
              onClick={() => console.log("Bar Chart")}
            />
            <SidebarNavItem
              icon={PieChart}
              label="Pie Chart"
              active={false}
              onClick={() => console.log("Pie Chart")}
            />
            <SidebarNavItem
              icon={Activity}
              label="Line Chart"
              active={false}
              onClick={() => console.log("Line Chart")}
            />
          </SidebarNavGroup>
        </SidebarNav>
      </SidebarContent>

      <SidebarFooter>
        <SidebarStats stats={stats} />
      </SidebarFooter>
    </SidebarContainer>
  );
}
