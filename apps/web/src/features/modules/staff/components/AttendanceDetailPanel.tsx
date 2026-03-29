/**
 * AttendanceDetailPanel Component
 * Special detail panel for attendance tab showing attendance-specific information
 */

import { X, Clock } from "lucide-react";
import type { Staff, AttRecord, LeaveReq } from "../types";

interface AttendanceDetailPanelProps {
  staff: Staff | null;
  records: AttRecord[];
  leaves: LeaveReq[];
  onClose: () => void;
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

function LeaveStatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    pending: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      label: "Pending",
    },
    approved: {
      bg: "bg-green-50",
      text: "text-green-700",
      label: "Approved",
    },
    rejected: {
      bg: "bg-red-50",
      text: "text-red-700",
      label: "Rejected",
    },
  };

  const style = styles[status] || styles.pending;

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}

export function AttendanceDetailPanel({
  staff,
  records,
  leaves,
  onClose,
}: AttendanceDetailPanelProps) {
  if (!staff) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Clock size={22} className="text-muted-foreground" />
        </div>
        <div className="text-[13px] font-semibold text-muted-foreground">
          No staff selected
        </div>
        <div className="text-[12px] leading-relaxed text-muted-foreground">
          Click any staff member
          <br />
          to view attendance
        </div>
      </div>
    );
  }

  const myRecords = records.filter((r) => r.staffId === staff.id);
  const myLeaves = leaves.filter((l) => l.staffId === staff.id);
  const todayRec = myRecords.find((r) => r.date === "Today");
  const weekHrs = myRecords.reduce((a, r) => a + r.hoursWorked, 0);
  const totalOT = myRecords.reduce((a, r) => a + r.otHours, 0);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-card border-l border-border">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-muted/30 p-3.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-[13px] font-semibold text-primary">
              {staff.initials}
            </div>
            <div>
              <div className="text-[13px] font-bold text-foreground">
                {staff.name}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {staff.role}
              </div>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold ${
                    staff.dutyStatus === "On Duty"
                      ? "bg-green-50 text-green-700"
                      : staff.dutyStatus === "On Break"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {staff.dutyStatus}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>

        {/* Today's shift */}
        {todayRec && (
          <div
            className={`mt-3 rounded-md border p-2 ${
              todayRec.status === "absent"
                ? "border-red-200 bg-red-50"
                : "border-green-200 bg-green-50"
            }`}
          >
            <div
              className={`mb-1 text-[10px] font-bold uppercase tracking-wide ${
                todayRec.status === "absent" ? "text-red-700" : "text-green-700"
              }`}
            >
              Today's Shift
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">Scheduled</span>
              <span className="font-semibold">
                {todayRec.scheduledStart} – {todayRec.scheduledEnd}
              </span>
            </div>
            {todayRec.actualIn && (
              <div className="mt-0.5 flex justify-between text-[11px]">
                <span className="text-muted-foreground">Clocked In</span>
                <span className="font-bold text-green-600">
                  {todayRec.actualIn}
                </span>
              </div>
            )}
            {todayRec.note && (
              <div className="mt-1 text-[10px] text-muted-foreground">
                {todayRec.note}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="custom-scrollbar flex-1 overflow-auto px-4 pb-4">
        <SectionTitle>This Period</SectionTitle>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            {
              label: "Hours Worked",
              val: `${weekHrs.toFixed(1)}h`,
              sub: "This week",
            },
            {
              label: "OT Hours",
              val: `${totalOT.toFixed(1)}h`,
              sub: "This week",
            },
            {
              label: "Punctuality",
              val: `${staff.punctualityScore}%`,
              sub: "30-day score",
            },
            {
              label: "Leave Balance",
              val: `${staff.leaveBalance}d`,
              sub: "Remaining",
            },
          ].map((m, i) => (
            <div key={i} className="rounded-md bg-muted/50 px-2.5 py-2">
              <div className="text-[14px] font-bold text-foreground">
                {m.val}
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                {m.label}
              </div>
              <div className="text-[9px] text-muted-foreground">{m.sub}</div>
            </div>
          ))}
        </div>

        <SectionTitle>Attendance Log</SectionTitle>
        {myRecords.map((r, i) => (
          <div
            key={i}
            className={`mb-1 rounded-md border-l-2 bg-muted/50 px-2.5 py-2 ${
              r.status === "present"
                ? "border-l-green-600"
                : r.status === "late"
                  ? "border-l-yellow-500"
                  : r.status === "absent"
                    ? "border-l-red-600"
                    : "border-l-yellow-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-foreground">
                {r.date}
              </span>
              <AttStatusBadge status={r.status} />
            </div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              {r.actualIn ? `In ${r.actualIn}` : "No clock-in"}
              {r.actualOut
                ? ` · Out ${r.actualOut}`
                : r.actualIn
                  ? " · Still on shift"
                  : ""}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {r.hoursWorked > 0 ? `${r.hoursWorked.toFixed(1)}h worked` : "—"}
              {r.otHours > 0 ? ` · +${r.otHours}h OT` : ""}
            </div>
            {r.note && (
              <div className="mt-0.5 text-[9px] text-red-600">{r.note}</div>
            )}
          </div>
        ))}

        <SectionTitle>Leave Requests</SectionTitle>
        {myLeaves.length === 0 ? (
          <div className="py-2.5 text-center text-[12px] text-muted-foreground">
            No leave requests
          </div>
        ) : (
          myLeaves.map((l, i) => (
            <div key={i} className="mb-1 rounded-md bg-muted/50 px-2.5 py-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold">{l.type}</span>
                <LeaveStatusBadge status={l.status} />
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                {l.startDate} – {l.endDate} · {l.days} day
                {l.days > 1 ? "s" : ""}
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                {l.reason}
              </div>
            </div>
          ))
        )}

        <SectionTitle>Quick Actions</SectionTitle>
        <div className="flex flex-col gap-1">
          {staff.dutyStatus === "Off Duty" && (
            <button className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-left text-[11px] font-bold text-green-700 hover:bg-green-100">
              ▶ Clock In
            </button>
          )}
          {staff.dutyStatus === "On Duty" && (
            <button className="rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-left text-[11px] font-bold text-yellow-700 hover:bg-yellow-100">
              ⏸ Start Break
            </button>
          )}
          {(staff.dutyStatus === "On Duty" ||
            staff.dutyStatus === "On Break") && (
            <button className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-left text-[11px] font-bold text-red-700 hover:bg-red-100">
              ⏹ Clock Out
            </button>
          )}
          <button className="rounded-md border border-border bg-muted/50 px-3 py-2 text-left text-[11px] text-foreground hover:bg-muted">
            + Submit Leave Request
          </button>
          <button className="rounded-md border border-border bg-muted/50 px-3 py-2 text-left text-[11px] text-foreground hover:bg-muted">
            ✎ Adjust Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
