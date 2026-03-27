/**
 * Dashboard workspace component
 * Displays KPI metrics in table format matching old implementation
 */

import { useState } from "react";
import { ModuleWorkspace } from "../components/ModuleWorkspace";
import {
  DashboardSidebar,
  type DashboardView,
} from "./components/DashboardSidebar";

// Color constants matching old implementation
const W = {
  success: "#107c10",
  danger: "#a4262c",
};

/**
 * Dashboard workspace showing KPI metrics in table format
 * Exact match to PharmacyTabs.tsx WorkspaceContent component
 */
export function DashboardWorkspace({
  split = false,
  label,
}: {
  split?: boolean;
  label?: string;
}) {
  const [activeView, setActiveView] = useState<DashboardView>("overview");

  const data = [
    ["Today's Sales", "₹14,820", "↑12%"],
    ["Orders", "47", "↑3%"],
    ["Low Stock", "7", "↓"],
    ["Profit", "₹3,940", "↑8%"],
  ];
  const cols = ["Metric", "Value", "Change"];

  // Custom cell renderer for trend indicators
  const renderCell = (cell: string, _rowIndex: number, _colIndex: number) => {
    if (cell.startsWith("↑")) {
      return <span style={{ color: W.success, fontWeight: 600 }}>{cell}</span>;
    }
    if (cell.startsWith("↓")) {
      return <span style={{ color: W.danger, fontWeight: 600 }}>{cell}</span>;
    }
    return cell;
  };

  return (
    <div className="flex flex-row flex-1 overflow-hidden font-sans bg-background">
      {/* Sidebar */}
      <DashboardSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        alertsCount={7}
        totalWidgets={12}
        activeWidgets={4}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <ModuleWorkspace
          label={label || "Dashboard"}
          color="#0078d4"
          columns={cols}
          data={data}
          renderCell={renderCell}
          split={split}
        />
      </div>
    </div>
  );
}
