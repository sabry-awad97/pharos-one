/**
 * Inventory workspace component
 * Displays drug catalog table with stock levels
 * Matches PharmacyTabs.tsx WorkspaceContent component
 */

import { ModuleWorkspace } from "../components/ModuleWorkspace";

// Color constants matching old implementation
const W = {
  success: "#107c10",
  warn: "#7a5e00",
};

/**
 * Inventory workspace showing drug catalog
 * Exact match to PharmacyTabs.tsx WorkspaceContent component
 */
export function InventoryWorkspace({
  split = false,
  label,
}: {
  split?: boolean;
  label?: string;
}) {
  const data = [
    ["Amoxicillin 500mg", "AMX-500", "240", "₹12.50", "In Stock"],
    ["Paracetamol 650mg", "PCT-650", "18", "₹4.20", "Low"],
    ["Metformin 500mg", "MET-500", "302", "₹8.75", "In Stock"],
  ];
  const cols = ["Drug Name", "SKU", "Stock", "Price", "Status"];

  // Custom cell renderer for status badges
  const renderCell = (cell: string, _rowIndex: number, _colIndex: number) => {
    if (cell === "In Stock") {
      return (
        <span
          style={{
            fontSize: 10,
            padding: "2px 6px",
            borderRadius: 3,
            background: "#dff6dd",
            color: W.success,
            fontWeight: 500,
          }}
        >
          {cell}
        </span>
      );
    }
    if (cell === "Low") {
      return (
        <span
          style={{
            fontSize: 10,
            padding: "2px 6px",
            borderRadius: 3,
            background: "#fff4ce",
            color: W.warn,
            fontWeight: 500,
          }}
        >
          {cell}
        </span>
      );
    }
    return cell;
  };

  return (
    <ModuleWorkspace
      label={label || "Inventory"}
      color="#107c10"
      columns={cols}
      data={data}
      renderCell={renderCell}
      split={split}
    />
  );
}
