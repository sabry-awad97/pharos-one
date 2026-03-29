import { useState } from "react";
import type { Staff, LeaveReq, LeaveStatus } from "../../types";

interface LeaveViewProps {
  allStaff: Staff[];
  selectedStaff: Staff | null;
  onSelectStaff: (staff: Staff | null) => void;
  leaves: LeaveReq[];
}

function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  const styles: Record<
    LeaveStatus,
    { bg: string; text: string; label: string }
  > = {
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

  const style = styles[status];

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}

export function LeaveView({
  allStaff,
  selectedStaff,
  onSelectStaff,
  leaves,
}: LeaveViewProps) {
  const [filter, setFilter] = useState<LeaveStatus | "all">("all");
  const shown =
    filter === "all" ? leaves : leaves.filter((l) => l.status === filter);
  const pending = leaves.filter((l) => l.status === "pending");

  return (
    <div className="custom-scrollbar flex-1 overflow-auto p-4">
      {/* Leave balance overview */}
      <div className="mb-4 grid grid-cols-5 gap-2">
        {allStaff.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelectStaff(selectedStaff?.id === s.id ? null : s)}
            className={`cursor-pointer rounded-lg bg-card p-2.5 text-center shadow-sm ${
              selectedStaff?.id === s.id
                ? "border-2 border-primary"
                : "border-2 border-transparent"
            }`}
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
          >
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
              {s.initials}
            </div>
            <div className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-bold text-foreground">
              {s.name.split(" ")[0]}
            </div>
            <div
              className={`mt-0.5 text-[16px] font-extrabold ${
                (s.leaveBalance || 0) < 5 ? "text-red-600" : "text-primary"
              }`}
            >
              {s.leaveBalance}d
            </div>
            <div className="text-[9px] text-muted-foreground">leave left</div>
          </div>
        ))}
      </div>

      {/* Pending approvals */}
      {pending.length > 0 && (
        <div className="mb-3.5 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <div className="mb-2 text-[11px] font-bold text-yellow-700">
            ⏳ {pending.length} Pending Approval{pending.length > 1 ? "s" : ""}
          </div>
          {pending.map((l) => {
            const staff = allStaff.find((s) => s.id === l.staffId);
            return (
              <div
                key={l.id}
                className="flex items-center gap-2.5 border-b border-yellow-200 py-2 last:border-b-0"
              >
                {staff && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                    {staff.initials}
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-[11px] font-bold">
                    {staff?.name} — {l.type}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {l.startDate} – {l.endDate} · {l.days} day
                    {l.days > 1 ? "s" : ""}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {l.reason}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-600 hover:bg-green-100">
                    Approve
                  </button>
                  <button className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] text-red-600 hover:bg-red-100">
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All requests */}
      <div
        className="overflow-hidden rounded-lg bg-card shadow-sm"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="text-[12px] font-bold">All Leave Requests</div>
          <div className="flex gap-1">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-2 py-0.5 text-[10px] ${
                  filter === f
                    ? "border-primary/20 bg-primary/10 font-bold text-primary"
                    : "border-border bg-transparent font-normal text-muted-foreground"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div
          className="grid border-b border-border bg-muted/50 px-4 py-1.5 text-[9px] font-bold uppercase tracking-wide text-muted-foreground"
          style={{
            gridTemplateColumns: "1.8fr 1fr 1.5fr 0.8fr 1.5fr 0.8fr",
          }}
        >
          <span>Staff</span>
          <span>Type</span>
          <span>Dates</span>
          <span>Days</span>
          <span>Reason</span>
          <span>Status</span>
        </div>
        {shown.map((l, i) => {
          const staff = allStaff.find((s) => s.id === l.staffId);
          if (!staff) return null;
          const isSelected = selectedStaff?.id === staff.id;
          return (
            <div
              key={l.id}
              onClick={() => onSelectStaff(isSelected ? null : staff)}
              className={`grid cursor-pointer items-center border-l-[2.5px] px-4 py-2 ${
                i < shown.length - 1 ? "border-b border-border/50" : ""
              } ${
                isSelected
                  ? "border-l-primary bg-primary/5"
                  : "border-l-transparent"
              }`}
              style={{
                gridTemplateColumns: "1.8fr 1fr 1.5fr 0.8fr 1.5fr 0.8fr",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  {staff.initials}
                </div>
                <span className="text-[11px] font-bold">{staff.name}</span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {l.type}
              </span>
              <span className="text-[11px]">
                {l.startDate} – {l.endDate}
              </span>
              <span className="text-[12px] font-bold text-foreground">
                {l.days}d
              </span>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-muted-foreground">
                {l.reason}
              </span>
              <LeaveStatusBadge status={l.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
