/**
 * ProfileTab Component
 * Displays staff profile information: contact, activity, credentials, competencies
 */

import { Mail, Phone, MapPin, Edit, Upload, Clock } from "lucide-react";
import type { Staff } from "../types";

export interface ProfileTabProps {
  staff: Staff;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 mt-4 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
      {children}
    </div>
  );
}

function CredBadge({ status, daysLeft }: { status: string; daysLeft: number }) {
  const styles: Record<
    string,
    { bg: string; text: string; border: string; label: string }
  > = {
    valid: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      label: "Valid",
    },
    expiring: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      label: `${daysLeft}d left`,
    },
    critical: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      label: `${daysLeft}d left`,
    },
    expired: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      label: "Expired",
    },
  };

  const style = styles[status] || styles.valid;

  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold ${style.bg} ${style.text} ${style.border}`}
    >
      {style.label}
    </span>
  );
}

export function ProfileTab({ staff }: ProfileTabProps) {
  return (
    <div className="p-4">
      {/* Action Buttons */}
      <div className="mb-4 flex gap-1.5">
        <button className="flex flex-1 items-center justify-center gap-1 rounded-md bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90">
          <Edit size={11} />
          Edit
        </button>
        <button className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-[11px] text-foreground hover:bg-muted">
          <Upload size={11} />
          Upload
        </button>
        {(staff.dutyStatus === "On Duty" ||
          staff.dutyStatus === "On Break") && (
          <button className="flex items-center gap-1 rounded-md border border-yellow-200 bg-yellow-50 px-2.5 py-1.5 text-[11px] text-yellow-700 hover:bg-yellow-100">
            <Clock size={11} />
            Out
          </button>
        )}
      </div>

      <SectionTitle>Contact</SectionTitle>
      {[
        { icon: Mail, val: staff.email },
        { icon: Phone, val: staff.phone },
        { icon: MapPin, val: `${staff.branch} Branch` },
      ].map((r, i) => (
        <div key={i} className="mb-1 flex items-center gap-2 text-[12px]">
          <r.icon size={12} className="text-muted-foreground" />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-foreground">
            {r.val}
          </span>
        </div>
      ))}

      <SectionTitle>Activity</SectionTitle>
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { label: "This Week", val: `${staff.hoursThisWeek}h` },
          { label: "Last Active", val: staff.lastActive },
          { label: "Clock-In", val: staff.clockedIn || "—" },
          { label: "Compliance", val: `${staff.complianceScore}%` },
        ].map((m, i) => (
          <div key={i} className="rounded-md bg-muted/50 px-2.5 py-2">
            <div className="text-[14px] font-bold text-foreground">{m.val}</div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>Credentials</SectionTitle>
      {staff.credentials.map((c, i) => (
        <div
          key={i}
          className={`mb-1.5 rounded-md border p-2.5 ${
            c.status === "expired"
              ? "border-red-200 bg-red-50"
              : c.status === "critical"
                ? "border-orange-200 bg-orange-50/30"
                : c.status === "expiring"
                  ? "border-yellow-200 bg-yellow-50"
                  : "border-border bg-muted/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-foreground">
              {c.type}
            </span>
            <CredBadge status={c.status} daysLeft={c.daysLeft} />
          </div>
          <div className="mt-0.5 text-[10px] text-muted-foreground">
            {c.number} · Expires {c.expiry}
          </div>
          {(c.status === "expired" || c.status === "critical") && (
            <button className="mt-1.5 rounded border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary hover:bg-primary/20">
              Start Renewal →
            </button>
          )}
        </div>
      ))}

      <SectionTitle>Competencies</SectionTitle>
      <div className="flex flex-wrap gap-1">
        {staff.competencies.map((c, i) => (
          <span
            key={i}
            className="rounded border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
