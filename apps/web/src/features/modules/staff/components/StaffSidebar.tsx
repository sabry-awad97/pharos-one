/**
 * StaffSidebar component
 * Context-aware sidebar for staff workspace with staff-specific navigation
 */

import {
  LayoutGrid,
  Users,
  Shield,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react";
import {
  SidebarContainer,
  SidebarContent,
  SidebarFooter,
} from "@/features/workspace/components/SidebarContainer";
import {
  SidebarNav,
  SidebarNavItem,
  SidebarStats,
  type StatItem,
} from "@/features/workspace/components/SidebarNavComponents";
import type { StaffTabId } from "../types";

export interface StaffSidebarProps {
  /** Currently active tab */
  activeTab: StaffTabId;
  /** Tab change handler */
  onTabChange: (tab: StaffTabId) => void;
  /** Critical/expiring credentials count for badge */
  credentialsAlertCount?: number;
  /** Pending leave requests count for badge */
  pendingLeaveCount?: number;
  /** Total staff count */
  totalStaff?: number;
  /** On duty staff count */
  onDutyCount?: number;
}

/**
 * Staff workspace sidebar with staff-specific navigation
 */
export function StaffSidebar({
  activeTab,
  onTabChange,
  credentialsAlertCount = 0,
  pendingLeaveCount = 0,
  totalStaff = 0,
  onDutyCount = 0,
}: StaffSidebarProps) {
  // Stats for footer
  const stats: StatItem[] = [
    {
      label: "Total Staff",
      value: totalStaff.toString(),
    },
    {
      label: "On Duty",
      value: onDutyCount.toString(),
    },
  ];

  return (
    <SidebarContainer workspaceId="staff" defaultWidth={220}>
      <SidebarContent>
        <SidebarNav>
          <SidebarNavItem
            icon={LayoutGrid}
            label="Overview"
            active={activeTab === "overview"}
            onClick={() => onTabChange("overview")}
          />
          <SidebarNavItem
            icon={Users}
            label="Staff Directory"
            active={activeTab === "staff"}
            onClick={() => onTabChange("staff")}
          />
          <SidebarNavItem
            icon={Shield}
            label="Credentials"
            badge={credentialsAlertCount}
            active={activeTab === "credentials"}
            onClick={() => onTabChange("credentials")}
          />
          <SidebarNavItem
            icon={Clock}
            label="Attendance"
            active={activeTab === "attendance"}
            onClick={() => onTabChange("attendance")}
          />
          <SidebarNavItem
            icon={FileText}
            label="Leave Requests"
            badge={pendingLeaveCount}
            active={activeTab === "leave"}
            onClick={() => onTabChange("leave")}
          />
          <SidebarNavItem
            icon={TrendingUp}
            label="Performance"
            active={activeTab === "metrics"}
            onClick={() => onTabChange("metrics")}
          />
        </SidebarNav>
      </SidebarContent>

      <SidebarFooter>
        <SidebarStats stats={stats} />
      </SidebarFooter>
    </SidebarContainer>
  );
}
