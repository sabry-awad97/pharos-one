/**
 * ReportsSidebar component
 * Context-aware sidebar for reports workspace with filters and report type selection
 */

import {
  FileText,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  Users,
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

export type ReportType =
  | "all"
  | "sales"
  | "revenue"
  | "inventory"
  | "customers";

export type DateRange = "today" | "week" | "month" | "year" | "custom";

export interface ReportsSidebarProps {
  /** Currently active report type */
  activeReport: ReportType;
  /** Report type change handler */
  onReportChange: (report: ReportType) => void;
  /** Currently selected date range */
  dateRange?: DateRange;
  /** Date range change handler */
  onDateRangeChange?: (range: DateRange) => void;
  /** Total reports count */
  totalReports?: number;
  /** Generated reports count */
  generatedReports?: number;
}

/**
 * Reports workspace sidebar with filters and report type selection
 */
export function ReportsSidebar({
  activeReport,
  onReportChange,
  dateRange = "month",
  onDateRangeChange,
  totalReports = 0,
  generatedReports = 0,
}: ReportsSidebarProps) {
  // Stats for footer
  const stats: StatItem[] = [
    {
      label: "Generated",
      value: generatedReports.toString(),
    },
    {
      label: "Total Reports",
      value: totalReports.toString(),
    },
  ];

  return (
    <SidebarContainer workspaceId="reports" defaultWidth={220}>
      <SidebarContent>
        <SidebarNav>
          {/* Main view */}
          <SidebarNavItem
            icon={FileText}
            label="All Reports"
            active={activeReport === "all"}
            onClick={() => onReportChange("all")}
          />

          {/* Report Types group */}
          <SidebarNavGroup label="Report Types" defaultExpanded>
            <SidebarNavItem
              icon={TrendingUp}
              label="Sales"
              active={activeReport === "sales"}
              onClick={() => onReportChange("sales")}
            />
            <SidebarNavItem
              icon={DollarSign}
              label="Revenue"
              active={activeReport === "revenue"}
              onClick={() => onReportChange("revenue")}
            />
            <SidebarNavItem
              icon={Package}
              label="Inventory"
              active={activeReport === "inventory"}
              onClick={() => onReportChange("inventory")}
            />
            <SidebarNavItem
              icon={Users}
              label="Customers"
              active={activeReport === "customers"}
              onClick={() => onReportChange("customers")}
            />
          </SidebarNavGroup>

          {/* Date Range group */}
          <SidebarNavGroup label="Date Range" defaultExpanded={false}>
            <SidebarNavItem
              icon={Calendar}
              label="Today"
              active={dateRange === "today"}
              onClick={() => onDateRangeChange?.("today")}
            />
            <SidebarNavItem
              icon={Calendar}
              label="This Week"
              active={dateRange === "week"}
              onClick={() => onDateRangeChange?.("week")}
            />
            <SidebarNavItem
              icon={Calendar}
              label="This Month"
              active={dateRange === "month"}
              onClick={() => onDateRangeChange?.("month")}
            />
            <SidebarNavItem
              icon={Calendar}
              label="This Year"
              active={dateRange === "year"}
              onClick={() => onDateRangeChange?.("year")}
            />
            <SidebarNavItem
              icon={Calendar}
              label="Custom Range"
              active={dateRange === "custom"}
              onClick={() => onDateRangeChange?.("custom")}
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
