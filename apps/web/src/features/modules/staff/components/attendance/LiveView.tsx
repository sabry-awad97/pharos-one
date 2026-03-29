import {
  UserCheck,
  UserX,
  Timer,
  Zap,
  Clock,
  PlayCircle,
  PauseCircle,
  Calendar,
} from "lucide-react";
import type { Staff, AttRecord, DutyStatus } from "../../types";
import { STAFF_DATA } from "../../mock-data";

interface LiveViewProps {
  allStaff: Staff[];
  selectedStaff: Staff | null;
  onSelectStaff: (staff: Staff | null) => void;
  records: AttRecord[];
}

export function LiveView({
  allStaff,
  selectedStaff,
  onSelectStaff,
  records,
}: LiveViewProps) {
  const todayRecs = records.filter((r) => r.date === "Today");
  const present = allStaff.filter((s) => s.dutyStatus !== "Off Duty").length;
  const absent = allStaff.filter((s) => s.dutyStatus === "Off Duty").length;
  const totalHrs = todayRecs.reduce((a, r) => a + r.hoursWorked, 0);
  const totalOT = todayRecs.reduce((a, r) => a + r.otHours, 0);

  return (
    <div className="custom-scrollbar flex-1 overflow-auto p-4">
      {/* Live stats */}
      <div className="mb-4 grid grid-cols-4 gap-3">
        {[
          {
            label: "Present Today",
            val: present,
            icon: UserCheck,
            color: "text-green-600",
            bg: "bg-green-50",
            border: "border-green-200",
          },
          {
            label: "Absent Today",
            val: absent,
            icon: UserX,
            color: "text-red-600",
            bg: "bg-red-50",
            border: "border-red-200",
          },
          {
            label: "Hours Clocked",
            val: `${totalHrs.toFixed(1)}h`,
            icon: Timer,
            color: "text-primary",
            bg: "bg-primary/10",
            border: "border-primary/20",
          },
          {
            label: "OT Hours Today",
            val: `${totalOT.toFixed(1)}h`,
            icon: Zap,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
            border: "border-yellow-200",
          },
        ].map((m, i) => (
          <div
            key={i}
            className="rounded-lg bg-card p-3.5 shadow-sm"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {m.label}
                </div>
                <div className={`text-[22px] font-bold ${m.color}`}>
                  {m.val}
                </div>
              </div>
              <div
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-md border ${m.bg} ${m.border}`}
              >
                <m.icon size={14} className={m.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shift columns */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        {(["On Duty", "On Break", "Off Duty"] as DutyStatus[]).map((status) => {
          const staff = allStaff.filter((s) => s.dutyStatus === status);
          const styleMap: Record<
            DutyStatus,
            { color: string; bg: string; border: string }
          > = {
            "On Duty": {
              color: "text-green-600",
              bg: "bg-green-50",
              border: "border-green-200",
            },
            "On Break": {
              color: "text-yellow-600",
              bg: "bg-yellow-50",
              border: "border-yellow-200",
            },
            "Off Duty": {
              color: "text-muted-foreground",
              bg: "bg-muted/50",
              border: "border-border",
            },
          };
          const gs = styleMap[status];
          return (
            <div
              key={status}
              className="overflow-hidden rounded-lg bg-card shadow-sm"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
            >
              <div
                className={`flex items-center gap-2 border-b px-3 py-2 ${gs.bg} ${gs.border}`}
              >
                <span className={`text-[11px] font-bold ${gs.color}`}>
                  {status}
                </span>
                <span
                  className={`rounded-full border px-1.5 text-[10px] font-bold ${gs.color} ${gs.border} bg-white`}
                >
                  {staff.length}
                </span>
              </div>
              {staff.length === 0 ? (
                <div className="p-4 text-center text-[11px] text-muted-foreground">
                  No staff
                </div>
              ) : (
                staff.map((s, i) => {
                  const rec = todayRecs.find((r) => r.staffId === s.id);
                  const isSelected = selectedStaff?.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => onSelectStaff(isSelected ? null : s)}
                      className={`cursor-pointer border-l-[2.5px] px-3 py-2 ${
                        i < staff.length - 1 ? "border-b border-border/50" : ""
                      } ${
                        isSelected
                          ? "border-l-primary bg-primary/5"
                          : "border-l-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${gs.bg} ${gs.color}`}
                        >
                          {s.initials}
                        </div>
                        <div className="flex-1">
                          <div className="text-[11px] font-bold">{s.name}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {s.role}
                          </div>
                        </div>
                      </div>
                      {rec?.actualIn && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock size={9} />
                          In {rec.actualIn} · {rec.hoursWorked.toFixed(1)}h
                          {rec.otHours > 0 && (
                            <span className="font-bold text-yellow-600">
                              +{rec.otHours}h OT
                            </span>
                          )}
                        </div>
                      )}
                      {rec?.note && (
                        <div className="mt-0.5 text-[9px] text-red-600">
                          {rec.note}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>

      {/* Clock event log */}
      <div
        className="rounded-lg bg-card p-3.5 shadow-sm"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
      >
        <div className="mb-3 text-[12px] font-semibold">
          Today's Clock Events
        </div>
        {[
          {
            staff: STAFF_DATA[2],
            action: "Clocked In",
            time: "07:45 AM",
            icon: PlayCircle,
            color: "text-green-600",
          },
          {
            staff: STAFF_DATA[0],
            action: "Clocked In",
            time: "08:28 AM",
            icon: PlayCircle,
            color: "text-green-600",
          },
          {
            staff: STAFF_DATA[1],
            action: "Clocked In",
            time: "09:03 AM",
            icon: PlayCircle,
            color: "text-green-600",
          },
          {
            staff: STAFF_DATA[1],
            action: "Break Started",
            time: "12:15 PM",
            icon: PauseCircle,
            color: "text-yellow-600",
          },
          {
            staff: STAFF_DATA[4],
            action: "Sick Leave (Approved)",
            time: "—",
            icon: UserX,
            color: "text-red-600",
          },
          {
            staff: STAFF_DATA[3],
            action: "Day Off (Approved)",
            time: "—",
            icon: Calendar,
            color: "text-muted-foreground",
          },
        ].map((e, i) => (
          <div
            key={i}
            className={`flex items-center gap-2.5 py-1.5 ${
              i < 5 ? "border-b border-border/50" : ""
            }`}
          >
            <e.icon size={14} className={e.color} />
            <div
              className={`flex h-5.5 w-5.5 items-center justify-center rounded-full text-[10px] font-semibold ${
                e.staff.dutyStatus === "On Duty"
                  ? "bg-green-50 text-green-600"
                  : e.staff.dutyStatus === "On Break"
                    ? "bg-yellow-50 text-yellow-600"
                    : "bg-muted/50 text-muted-foreground"
              }`}
            >
              {e.staff.initials}
            </div>
            <span className="flex-1 text-[12px] font-medium">
              {e.staff.name}
            </span>
            <span className={`text-[11px] font-medium ${e.color}`}>
              {e.action}
            </span>
            <span className="min-w-[60px] text-right font-mono text-[10px] text-muted-foreground">
              {e.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
