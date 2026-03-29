/**
 * AuditTrailWorkspace Component
 * Displays audit trail of all staff-related events and actions
 */

import { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle,
  Eye,
  Edit,
  Coffee,
  AlertTriangle,
  LogOut,
  UserPlus,
  Calendar,
} from "lucide-react";
import type { Staff } from "../types";

interface AuditTrailWorkspaceProps {
  allStaff: Staff[];
  selectedStaff: Staff | null;
  onSelectStaff: (staff: Staff | null) => void;
}

interface AuditEvent {
  id: number;
  user: string;
  action: string;
  type: "Clock" | "Compliance" | "Security" | "Admin";
  time: string;
  detail: string;
  icon: any;
  color: string;
}

export function AuditTrailWorkspace({
  allStaff,
  selectedStaff,
  onSelectStaff,
}: AuditTrailWorkspaceProps) {
  const [filter, setFilter] = useState<string>("All");

  const events: AuditEvent[] = [
    {
      id: 1,
      user: "Priya Sharma",
      action: "Clocked In",
      type: "Clock",
      time: "Today 07:45 AM",
      detail: "Shift started",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 2,
      user: "Dr. Sarah Chen",
      action: "Clocked In",
      type: "Clock",
      time: "Today 08:28 AM",
      detail: "Shift started — 28 min late",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 3,
      user: "Marcus Williams",
      action: "Clocked In",
      type: "Clock",
      time: "Today 09:03 AM",
      detail: "Shift started",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 4,
      user: "Priya Sharma",
      action: "Credential Viewed",
      type: "Security",
      time: "Today 09:14 AM",
      detail: "HIPAA Cert — HP-****-0012",
      icon: Eye,
      color: "text-primary",
    },
    {
      id: 5,
      user: "Admin",
      action: "Role Updated",
      type: "Admin",
      time: "Today 09:30 AM",
      detail: "Marcus Williams → Technician",
      icon: Edit,
      color: "text-yellow-600",
    },
    {
      id: 6,
      user: "Marcus Williams",
      action: "Break Started",
      type: "Clock",
      time: "Today 12:15 PM",
      detail: "Break started",
      icon: Coffee,
      color: "text-yellow-600",
    },
    {
      id: 7,
      user: "Admin",
      action: "Leave Approved",
      type: "Compliance",
      time: "Yesterday 11:00 AM",
      detail: "Linda Park sick leave Mar 26–27",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 8,
      user: "Linda Park",
      action: "Credential Expired",
      type: "Compliance",
      time: "Yesterday 11:59 PM",
      detail: "Pharmacist License PH-****-9021",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      id: 9,
      user: "Admin",
      action: "Attendance Adjusted",
      type: "Admin",
      time: "Yesterday 09:00 AM",
      detail: "Linda Park early departure flagged",
      icon: Edit,
      color: "text-yellow-600",
    },
    {
      id: 10,
      user: "James O'Brien",
      action: "Clocked Out",
      type: "Clock",
      time: "Mar 25, 5:00 PM",
      detail: "8h shift completed",
      icon: LogOut,
      color: "text-muted-foreground",
    },
    {
      id: 11,
      user: "Admin",
      action: "Staff Added",
      type: "Admin",
      time: "Mar 20, 10:00 AM",
      detail: "Linda Park added to Main Street",
      icon: UserPlus,
      color: "text-green-600",
    },
    {
      id: 12,
      user: "Marcus Williams",
      action: "Leave Requested",
      type: "Compliance",
      time: "Mar 20, 3:00 PM",
      detail: "Vacation Apr 5–9 (5 days)",
      icon: Calendar,
      color: "text-primary",
    },
  ];

  const filterTypes = ["All", "Clock", "Compliance", "Security", "Admin"];
  const shown =
    filter === "All" ? events : events.filter((e) => e.type === filter);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Filter Bar */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border bg-card px-5 py-2.5">
        <FileText size={14} className="text-muted-foreground" />
        <span className="mr-1 text-[12px] font-semibold text-foreground">
          Event Filter
        </span>
        {filterTypes.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-2.5 py-0.5 text-[11px] ${
              filter === f
                ? "border-primary/20 bg-primary/10 font-bold text-primary"
                : "border-border bg-transparent font-medium text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2.5 py-1 text-[11px] text-foreground hover:bg-muted">
          <Download size={12} />
          Export PDF
        </button>
      </div>

      {/* Events List */}
      <div className="custom-scrollbar flex-1 overflow-auto p-4">
        <div
          className="overflow-hidden rounded-lg bg-card shadow-sm"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
        >
          {shown.map((e, i) => {
            const staffMember = allStaff.find((s) => s.name === e.user);
            const isSelected =
              staffMember && selectedStaff?.id === staffMember.id;
            return (
              <div
                key={e.id}
                onClick={() =>
                  staffMember && onSelectStaff(isSelected ? null : staffMember)
                }
                className={`flex items-start gap-3 border-l-[2.5px] px-4 py-3 ${
                  i < shown.length - 1 ? "border-b border-border/50" : ""
                } ${
                  isSelected
                    ? "border-l-primary bg-primary/5"
                    : "border-l-transparent"
                } ${staffMember ? "cursor-pointer" : ""}`}
              >
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${e.color}`}
                  style={{
                    backgroundColor: `${e.color.replace("text-", "bg-")}/10`,
                    borderColor: `${e.color.replace("text-", "border-")}/30`,
                  }}
                >
                  <e.icon size={13} className={e.color} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold">{e.user}</span>
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[11px] font-medium ${e.color}`}
                      style={{
                        backgroundColor: `${e.color.replace("text-", "bg-")}/10`,
                        borderColor: `${e.color.replace("text-", "border-")}/25`,
                      }}
                    >
                      {e.action}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {e.detail}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="whitespace-nowrap text-[10px] text-muted-foreground">
                    {e.time}
                  </span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
                    {e.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
