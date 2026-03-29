/**
 * AttendanceTab Component (Detail Panel)
 * Displays individual staff attendance history and schedule
 */

import { Clock, Calendar, TrendingUp } from "lucide-react";
import type { Staff } from "../types";
import { ATTENDANCE_RECORDS } from "../mock-data";

export interface AttendanceTabProps {
  staff: Staff;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 mt-4 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
      {children}
    </div>
  );
}

function AttStatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    present: {
      bg: "bg-green-50",
      text: "text-green-700",
      label: "Present",
    },
    late: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      label: "Late",
    },
    early_departure: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      label: "Early Out",
    },
    absent: {
      bg: "bg-red-50",
      text: "text-red-700",
      label: "Absent",
    },
    auto_closed: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      label: "Auto",
    },
  };

  const style = styles[status] || styles.present;

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}

export function AttendanceTab({ staff }: AttendanceTabProps) {
  const staffRecords = ATTENDANCE_RECORDS.filter((r) => r.staffId === staff.id);
  const todayRecord = staffRecords.find((r) => r.date === "Today");
  const weekRecords = staffRecords.filter(
    (r) => r.date === "Today" || r.date === "Yesterday",
  );

  const totalHours = weekRecords.reduce((sum, r) => sum + r.hoursWorked, 0);
  const totalOT = weekRecords.reduce((sum, r) => sum + r.otHours, 0);
  const avgHours = weekRecords.length > 0 ? totalHours / weekRecords.length : 0;

  return (
    <div className="p-4">
      {/* Current Status */}
      {todayRecord && (
        <div className="mb-4 rounded-lg border border-border bg-card p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-foreground">
              Today's Status
            </span>
            <AttStatusBadge status={todayRecord.status} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[11px] text-muted-foreground">Clock In</div>
              <div className="font-mono text-[13px] font-bold text-foreground">
                {todayRecord.actualIn || "—"}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground">Clock Out</div>
              <div className="font-mono text-[13px] font-bold text-foreground">
                {todayRecord.actualOut || (
                  <span className="text-green-600">On shift</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground">
                Hours Worked
              </div>
              <div className="text-[13px] font-bold text-foreground">
                {todayRecord.hoursWorked.toFixed(1)}h
              </div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground">Break</div>
              <div className="text-[13px] font-bold text-foreground">
                {todayRecord.breakMins > 0 ? `${todayRecord.breakMins}m` : "—"}
              </div>
            </div>
          </div>
          {todayRecord.note && (
            <div className="mt-2 rounded border border-yellow-200 bg-yellow-50 px-2 py-1 text-[10px] text-yellow-700">
              {todayRecord.note}
            </div>
          )}
        </div>
      )}

      {/* Weekly Summary */}
      <SectionTitle>This Week</SectionTitle>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {[
          {
            label: "Total Hours",
            val: `${totalHours.toFixed(1)}h`,
            icon: Clock,
            color: "text-primary",
          },
          {
            label: "OT Hours",
            val: `${totalOT.toFixed(1)}h`,
            icon: TrendingUp,
            color: "text-yellow-600",
          },
          {
            label: "Avg/Day",
            val: `${avgHours.toFixed(1)}h`,
            icon: Calendar,
            color: "text-green-600",
          },
        ].map((m, i) => (
          <div key={i} className="rounded-md bg-muted/50 p-2 text-center">
            <m.icon size={14} className={`mx-auto mb-1 ${m.color}`} />
            <div className={`text-[13px] font-bold ${m.color}`}>{m.val}</div>
            <div className="text-[9px] text-muted-foreground">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Records */}
      <SectionTitle>Recent Attendance</SectionTitle>
      <div className="space-y-2">
        {staffRecords.slice(0, 5).map((r, i) => (
          <div
            key={i}
            className={`rounded-lg border p-2.5 ${
              r.status === "absent"
                ? "border-red-200 bg-red-50/30"
                : r.status === "late" || r.status === "early_departure"
                  ? "border-yellow-200 bg-yellow-50/30"
                  : "border-border bg-card"
            }`}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-foreground">
                {r.date}
              </span>
              <AttStatusBadge status={r.status} />
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
              <div>
                <span className="text-muted-foreground">In: </span>
                <span className="font-mono font-semibold text-foreground">
                  {r.actualIn || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Out: </span>
                <span className="font-mono font-semibold text-foreground">
                  {r.actualOut || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Hours: </span>
                <span className="font-semibold text-foreground">
                  {r.hoursWorked > 0 ? `${r.hoursWorked.toFixed(1)}h` : "—"}
                </span>
              </div>
              {r.otHours > 0 && (
                <div>
                  <span className="text-muted-foreground">OT: </span>
                  <span className="font-semibold text-yellow-600">
                    +{r.otHours}h
                  </span>
                </div>
              )}
            </div>
            {r.note && (
              <div className="mt-1 text-[10px] text-yellow-700">{r.note}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
