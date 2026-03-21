/**
 * Dashboard workspace component
 * Displays KPI metrics in table format matching old implementation
 */

import { ModuleWorkspace } from "../components/ModuleWorkspace";

// Color constants matching old implementation
const W = {
  success: "#107c10",
  danger: "#a4262c",
};

/**
 * Dashboard workspace showing KPI metrics in table format
 * Exact match to PharmacyTabs.tsx WorkspaceContent component
 */
export function DashboardWorkspace({ split = false }: { split?: boolean }) {
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
    <ModuleWorkspace
      label="Dashboard"
      color="#0078d4"
      columns={cols}
      data={data}
      renderCell={renderCell}
      split={split}
    />
  );
}
