/**
 * Dashboard module
 * Registers the dashboard module with the module registry
 */

import { LayoutDashboard } from "lucide-react";
import { registerModule } from "../registry";
import { DashboardWorkspace } from "./DashboardWorkspace";

// Register dashboard module on import
// Note: No toolbar - action buttons are in the workspace header itself (matching old implementation)
registerModule({
  id: "dashboard",
  label: "Dashboard",
  icon: LayoutDashboard,
  component: DashboardWorkspace,
});

// Export components for direct use if needed
export { DashboardWorkspace };
