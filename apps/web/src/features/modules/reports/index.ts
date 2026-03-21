/**
 * Reports module
 * Registers the reports module with the module registry
 */

import { BarChart2 } from "lucide-react";
import { registerModule } from "../registry";
import { ReportsWorkspace } from "./ReportsWorkspace";
import { ReportsToolbar } from "./ReportsToolbar";

// Register reports module on import
registerModule({
  id: "reports",
  label: "Reports",
  icon: BarChart2,
  component: ReportsWorkspace,
  toolbar: ReportsToolbar,
});

// Export components for direct use if needed
export { ReportsWorkspace, ReportsToolbar };
