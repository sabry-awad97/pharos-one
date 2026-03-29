import { Activity, BarChart2, Calendar, ClipboardList } from "lucide-react";
import { useState } from "react";
import type { AttRecord, AttSubTab, LeaveReq, Staff } from "../types";
import { AnalyticsView } from "./attendance/AnalyticsView";
import { LeaveView } from "./attendance/LeaveView";
import { LiveView } from "./attendance/LiveView";
import { ScheduleView } from "./attendance/ScheduleView";

interface AttendanceTabProps {
  allStaff: Staff[];
  selectedStaff: Staff | null;
  onSelectStaff: (staff: Staff | null) => void;
  records: AttRecord[];
  leaves: LeaveReq[];
}

export function AttendanceWorkspace({
  allStaff,
  selectedStaff,
  onSelectStaff,
  records,
  leaves,
}: AttendanceTabProps) {
  const [sub, setSub] = useState<AttSubTab>("live");
  const pendingCount = leaves.filter((l) => l.status === "pending").length;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Sub-nav */}
      <div className="flex shrink-0 items-stretch border-b border-border bg-background pl-5">
        {[
          { id: "live" as const, label: "Live View", icon: Activity },
          { id: "schedule" as const, label: "Shift Schedule", icon: Calendar },
          {
            id: "leave" as const,
            label: "Leave Requests",
            icon: ClipboardList,
          },
          { id: "analytics" as const, label: "Analytics", icon: BarChart2 },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSub(item.id)}
            className={`flex h-9 items-center gap-1.5 border-b-2 bg-transparent px-3.5 text-[11px] transition-colors ${
              sub === item.id
                ? "border-primary font-bold text-primary"
                : "border-transparent font-normal text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon size={12} />
            {item.label}
            {item.id === "leave" && pendingCount > 0 && (
              <span className="rounded-full bg-yellow-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sub content */}
      {sub === "live" && (
        <LiveView
          allStaff={allStaff}
          selectedStaff={selectedStaff}
          onSelectStaff={onSelectStaff}
          records={records}
        />
      )}
      {sub === "schedule" && (
        <ScheduleView
          allStaff={allStaff}
          selectedStaff={selectedStaff}
          onSelectStaff={onSelectStaff}
          records={records}
        />
      )}
      {sub === "leave" && (
        <LeaveView
          allStaff={allStaff}
          selectedStaff={selectedStaff}
          onSelectStaff={onSelectStaff}
          leaves={leaves}
        />
      )}
      {sub === "analytics" && (
        <AnalyticsView allStaff={allStaff} records={records} />
      )}
    </div>
  );
}
