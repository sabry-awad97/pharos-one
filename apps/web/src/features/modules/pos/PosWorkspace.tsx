/**
 * POS workspace component
 * Displays cart interface with items and totals
 * Matches PharmacyTabs.tsx WorkspaceContent component
 */

import { useState, useMemo } from "react";
import { ModuleWorkspace } from "../components/ModuleWorkspace";
import { POSSidebar, type POSView } from "./components/POSSidebar";

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
  const [activeView, setActiveView] = useState<POSView>("cart");

  const data = [
    ["Amoxicillin 500mg", "2", "₹12.50", "₹25.00"],
    ["Paracetamol 650mg", "3", "₹4.20", "₹12.60"],
    ["Omeprazole 20mg", "1", "₹15.00", "₹15.00"],
  ];
  const cols = ["Item", "Qty", "Unit Price", "Total"];

  // Calculate cart stats
  const cartItemsCount = data.length;
  const cartTotal = useMemo(() => {
    const total = data.reduce((sum, item) => {
      const itemTotal = parseFloat(item[3].replace("₹", ""));
      return sum + itemTotal;
    }, 0);
    return `₹${total.toFixed(2)}`;
  }, [data]);

  return (
    <div className="flex flex-row flex-1 overflow-hidden font-sans bg-background">
      {/* Sidebar */}
      <POSSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        cartItemsCount={cartItemsCount}
        customerName="Walk-in Customer"
        cartTotal={cartTotal}
        itemsCount={cartItemsCount}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <ModuleWorkspace
          label={label || "Point of Sale"}
          color="#6b69d6"
          columns={cols}
          data={data}
          split={split}
        />
      </div>
    </div>
  );
}
