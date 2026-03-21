/**
 * Dashboard module
 * Registers the dashboard module with the module registry
 */

import { LayoutDashboard } from "lucide-react";
import { registerModule } from "../registry";
import { DashboardWorkspace } from "./DashboardWorkspace";
import { DashboardOverviewWorkspace } from "./DashboardOverviewWorkspace";
import { DashboardAlertsWorkspace } from "./DashboardAlertsWorkspace";

// Register dashboard module on import
// Note: No toolbar - action buttons are in the workspace header itself (matching old implementation)
registerModule({
  id: "dashboard",
  label: "Dashboard",
  icon: LayoutDashboard,
  component: DashboardWorkspace,
});

// Register dashboard sub-item modules
registerModule({
  id: "dashboard-overview",
  label: "Dashboard - Overview",
  icon: LayoutDashboard,
  component: DashboardOverviewWorkspace,
});

registerModule({
  id: "dashboard-alerts",
  label: "Dashboard - Alerts & Notifications",
  icon: LayoutDashboard,
  component: DashboardAlertsWorkspace,
});

// Export components for direct use if needed
export {
  DashboardWorkspace,
  DashboardOverviewWorkspace,
  DashboardAlertsWorkspace,
};
