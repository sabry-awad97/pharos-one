/**
 * Customers workspace component
 * Displays customer profiles table
 * Matches PharmacyTabs.tsx WorkspaceContent component
 */

import { ModuleWorkspace } from "../components/ModuleWorkspace";

/**
 * Customers workspace showing customer profiles
 * Exact match to PharmacyTabs.tsx WorkspaceContent component
 */
export function CustomersWorkspace({ split = false }: { split?: boolean }) {
  const data = [
    ["Priya Nair", "Platinum", "3,890 pts", "Chennai"],
    ["Anjali Sharma", "Gold", "1,240 pts", "Bengaluru"],
    ["Rajesh Kumar", "Silver", "450 pts", "Mumbai"],
  ];
  const cols = ["Name", "Tier", "Loyalty", "Location"];

  return (
    <ModuleWorkspace
      label="Customers"
      color="#6b69d6"
      columns={cols}
      data={data}
      split={split}
    />
  );
}
