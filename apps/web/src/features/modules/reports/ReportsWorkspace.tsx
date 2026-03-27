/**
 * Reports workspace component
 * Displays analytics metrics and charts
 * Matches PharmacyTabs.tsx WorkspaceContent component
 */

import { useState } from "react";
import { ModuleWorkspace } from "../components/ModuleWorkspace";
import {
  ReportsSidebar,
  type ReportType,
  type DateRange,
} from "./components/ReportsSidebar";

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
  const [activeReport, setActiveReport] = useState<ReportType>("all");
  const [dateRange, setDateRange] = useState<DateRange>("month");

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
    <div className="flex flex-row flex-1 overflow-hidden font-sans bg-background">
      {/* Sidebar */}
      <ReportsSidebar
        activeReport={activeReport}
        onReportChange={setActiveReport}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        totalReports={24}
        generatedReports={18}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <ModuleWorkspace
          label={label || "Reports"}
          color="#c43501"
          columns={cols}
          data={data}
          renderCell={renderCell}
          split={split}
        />
      </div>
    </div>
  );
}
