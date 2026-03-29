import { useState } from "react";
import type { Staff, AttRecord } from "../../types";
import { SHIFT_TEMPLATES } from "../../mock-data";

interface ScheduleViewProps {
  allStaff: Staff[];
  selectedStaff: Staff | null;
  onSelectStaff: (staff: Staff | null) => void;
  records: AttRecord[];
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

export function ScheduleView({
  allStaff,
  selectedStaff,
  onSelectStaff,
  records,
}: ScheduleViewProps) {
  const [dateView, setDateView] = useState<"today" | "yesterday">("today");
  const shown = records.filter(
    (r) => r.date === (dateView === "today" ? "Today" : "Yesterday"),
  );

  return (
    <div className="custom-scrollbar flex-1 overflow-auto p-4">
      {/* Shift templates */}
      <div className="mb-4 grid grid-cols-3 gap-2.5">
        {SHIFT_TEMPLATES.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2.5 rounded-lg bg-card p-3 shadow-sm"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-md border"
              style={{
                backgroundColor: t.bg,
                borderColor: t.border,
              }}
            >
              <t.icon size={16} style={{ color: t.color }} />
            </div>
            <div>
              <div className="text-[12px] font-bold" style={{ color: t.color }}>
                {t.name} Shift
              </div>
              <div className="text-[11px] text-muted-foreground">
                {t.start} – {t.end}
              </div>
            </div>
            <span
              className="ml-auto rounded px-1.5 py-0.5 text-[10px] font-bold"
              style={{
                color: t.color,
                backgroundColor: t.bg,
                border: `1px solid ${t.border}`,
              }}
            >
              8h
            </span>
          </div>
        ))}
      </div>

      {/* Date toggle + attendance table */}
      <div
        className="overflow-hidden rounded-lg bg-card shadow-sm"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="text-[12px] font-bold">
            Attendance Record — Actual vs Scheduled
          </div>
          <div className="flex gap-0.5 rounded-md border border-border bg-muted/50 p-0.5">
            {(["today", "yesterday"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setDateView(v)}
                className={`rounded px-2.5 py-0.5 text-[11px] ${
                  dateView === v
                    ? "bg-background font-bold text-primary"
                    : "bg-transparent font-normal text-muted-foreground"
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div
          className="grid border-b border-border bg-muted/50 px-4 py-2 text-[9px] font-bold uppercase tracking-wide text-muted-foreground"
          style={{
            gridTemplateColumns:
              "1.8fr 1.2fr 1.2fr 1.2fr 1.2fr 0.8fr 1fr 100px",
          }}
        >
          <span>Staff</span>
          <span>Sched. Start</span>
          <span>Sched. End</span>
          <span>Actual In</span>
          <span>Actual Out</span>
          <span>Break</span>
          <span>Hours / OT</span>
          <span>Status</span>
        </div>
        {shown.map((r, i) => {
          const staff = allStaff.find((s) => s.id === r.staffId);
          if (!staff) return null;
          const isSelected = selectedStaff?.id === staff.id;
          return (
            <div
              key={i}
              onClick={() => onSelectStaff(isSelected ? null : staff)}
              className={`grid cursor-pointer items-center border-l-[2.5px] px-4 py-2 ${
                i < shown.length - 1 ? "border-b border-border/50" : ""
              } ${
                isSelected
                  ? "border-l-primary bg-primary/5"
                  : r.status === "absent"
                    ? "border-l-red-600 bg-red-50/30"
                    : "border-l-transparent"
              }`}
              style={{
                gridTemplateColumns:
                  "1.8fr 1.2fr 1.2fr 1.2fr 1.2fr 0.8fr 1fr 100px",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  {staff.initials}
                </div>
                <span className="text-[11px] font-bold">{staff.name}</span>
              </div>
              <span className="text-[11px]">{r.scheduledStart}</span>
              <span className="text-[11px]">{r.scheduledEnd}</span>
              <span
                className={`text-[11px] ${
                  r.status === "late" ? "font-bold text-red-600" : ""
                }`}
              >
                {r.actualIn || <span className="text-muted-foreground">—</span>}
              </span>
              <span className="text-[11px]">
                {r.actualOut || (
                  <span
                    className={`text-[10px] ${
                      r.actualIn
                        ? "italic text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {r.actualIn ? "On shift" : "—"}
                  </span>
                )}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {r.breakMins > 0 ? `${r.breakMins}m` : "—"}
              </span>
              <span className="text-[11px] font-bold">
                {r.hoursWorked > 0 ? `${r.hoursWorked.toFixed(1)}h` : "—"}
                {r.otHours > 0 && (
                  <span className="text-[10px] text-yellow-600">
                    {" "}
                    +{r.otHours}h OT
                  </span>
                )}
              </span>
              <AttStatusBadge status={r.status} />
            </div>
          );
        })}
      </div>

      {/* Absence alerts */}
      {shown.some((r) => r.note) && (
        <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <div className="mb-1.5 text-[11px] font-bold text-yellow-700">
            ⚠ Variance Flags
          </div>
          {shown
            .filter((r) => r.note)
            .map((r, i) => {
              const staff = allStaff.find((s) => s.id === r.staffId);
              return (
                <div key={i} className="mb-0.5 text-[11px] text-yellow-700">
                  <strong>{staff?.name}</strong> — {r.note}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
