/**
 * Dashboard Alerts workspace component
 */

import { ModuleWorkspace } from "../components/ModuleWorkspace";

export function DashboardAlertsWorkspace({
  split = false,
  label,
}: {
  split?: boolean;
  label?: string;
}) {
  const data = [
    ["Low Stock Alert", "Paracetamol 500mg", "5 units left"],
    ["Expiry Alert", "Amoxicillin 250mg", "Expires in 7 days"],
    ["Reorder Alert", "Ibuprofen 400mg", "Below threshold"],
  ];
  const cols = ["Alert Type", "Product", "Details"];

  return (
    <ModuleWorkspace
      label={label || "Dashboard - Alerts & Notifications"}
      color="#0078d4"
      columns={cols}
      data={data}
      split={split}
    />
  );
}
