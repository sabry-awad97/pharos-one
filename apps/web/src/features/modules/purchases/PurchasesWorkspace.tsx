/**
 * Purchases workspace component
 * Displays purchase order list
 * Matches PharmacyTabs.tsx WorkspaceContent component
 */

import { ModuleWorkspace } from "../components/ModuleWorkspace";

// Color constants matching old implementation
const W = {
  success: "#107c10",
  warn: "#7a5e00",
};

/**
 * Purchases workspace showing purchase orders
 * Exact match to PharmacyTabs.tsx WorkspaceContent component
 */
export function PurchasesWorkspace({ split = false }: { split?: boolean }) {
  const data = [
    ["PO-2026-0041", "MedSupply Co", "₹28,400", "Pending"],
    ["PO-2026-0040", "PharmGen", "₹11,800", "Received"],
    ["PO-2026-0039", "GeneriCo", "₹9,200", "Received"],
  ];
  const cols = ["PO Number", "Supplier", "Amount", "Status"];

  // Custom cell renderer for status badges
  const renderCell = (cell: string, _rowIndex: number, _colIndex: number) => {
    if (cell === "Pending") {
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
    if (cell === "Received") {
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
    return cell;
  };

  return (
    <ModuleWorkspace
      label="Purchase Orders"
      color="#b8860b"
      columns={cols}
      data={data}
      renderCell={renderCell}
      split={split}
    />
  );
}
