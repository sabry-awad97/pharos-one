/**
 * Reports workspace component
 * Displays analytics metrics and charts
 * Matches PharmacyTabs.tsx WorkspaceContent component
 */

import { ModuleWorkspace } from "../components/ModuleWorkspace";

// Color constants matching old implementation
const W = {
  success: "#107c10",
};

/**
 * Reports workspace showing analytics and metrics
 * Exact match to PharmacyTabs.tsx WorkspaceContent component
 */
export function ReportsWorkspace({
  split = false,
  label,
}: {
  split?: boolean;
  label?: string;
}) {
  const data = [
    ["Revenue – March", "₹4,48,200", "↑18%"],
    ["Gross Profit", "₹1,12,050", "↑11%"],
    ["Top Drug", "Amoxicillin", "—"],
  ];
  const cols = ["Metric", "Value", "Change"];

  // Custom cell renderer for trend indicators
  const renderCell = (cell: string, _rowIndex: number, _colIndex: number) => {
    if (cell.startsWith("↑")) {
      return <span style={{ color: W.success, fontWeight: 600 }}>{cell}</span>;
    }
    return cell;
  };

  return (
    <ModuleWorkspace
      label={label || "Reports"}
      color="#c43501"
      columns={cols}
      data={data}
      renderCell={renderCell}
      split={split}
    />
  );
}
