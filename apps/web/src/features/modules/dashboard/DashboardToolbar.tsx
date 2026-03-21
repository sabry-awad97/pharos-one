/**
 * Dashboard toolbar component
 * Module-specific actions for the dashboard
 * Matches PharmacyDashboard.tsx ribbon button styling
 */

import { RefreshCw, Download, Filter } from "lucide-react";

interface RibbonBtnProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

function RibbonBtn({ icon: Icon, label, onClick }: RibbonBtnProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        padding: "4px 10px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        borderRadius: 4,
        transition: "background 0.1s",
        color: "#333",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#f0f0f0";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      <Icon style={{ width: 16, height: 16, color: "#616161" }} />
      <span style={{ fontSize: 11, color: "#333" }}>{label}</span>
    </button>
  );
}

/**
 * Dashboard toolbar with module-specific actions
 * Provides Refresh, Export, and Filter actions
 */
export function DashboardToolbar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        padding: "0 8px",
        background: "white",
        borderBottom: "1px solid #d1d1d1",
        height: 44,
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      <RibbonBtn
        icon={RefreshCw}
        label="Refresh"
        onClick={() => console.log("Refresh dashboard")}
      />
      <RibbonBtn
        icon={Download}
        label="Export"
        onClick={() => console.log("Export dashboard")}
      />
      <RibbonBtn
        icon={Filter}
        label="Filter"
        onClick={() => console.log("Filter dashboard")}
      />
    </div>
  );
}
