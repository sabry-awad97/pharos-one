/**
 * POS workspace component
 * Displays cart interface with items and totals
 * Matches PharmacyTabs.tsx WorkspaceContent component
 */

import { ModuleWorkspace } from "../components/ModuleWorkspace";

/**
 * POS workspace showing cart interface
 * Exact match to PharmacyTabs.tsx WorkspaceContent component
 */
export function PosWorkspace({
  split = false,
  label,
}: {
  split?: boolean;
  label?: string;
}) {
  const data = [
    ["Amoxicillin 500mg", "2", "₹12.50", "₹25.00"],
    ["Paracetamol 650mg", "3", "₹4.20", "₹12.60"],
    ["Omeprazole 20mg", "1", "₹15.00", "₹15.00"],
  ];
  const cols = ["Item", "Qty", "Unit Price", "Total"];

  return (
    <ModuleWorkspace
      label={label || "Point of Sale"}
      color="#6b69d6"
      columns={cols}
      data={data}
      split={split}
    />
  );
}
