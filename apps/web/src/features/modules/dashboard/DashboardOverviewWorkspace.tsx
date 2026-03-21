/**
 * Dashboard Overview workspace component
 */

import { ModuleWorkspace } from "../components/ModuleWorkspace";

export function DashboardOverviewWorkspace({
  split = false,
  label,
}: {
  split?: boolean;
  label?: string;
}) {
  const data = [
    ["Today's Sales", "₹14,820", "↑12%"],
    ["Orders", "47", "↑3%"],
    ["Low Stock", "7", "↓"],
    ["Profit", "₹3,940", "↑8%"],
  ];
  const cols = ["Metric", "Value", "Change"];

  return (
    <ModuleWorkspace
      label={label || "Dashboard - Overview"}
      color="#0078d4"
      columns={cols}
      data={data}
      split={split}
    />
  );
}
