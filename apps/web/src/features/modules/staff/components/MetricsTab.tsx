/**
 * MetricsTab Component
 * Displays staff performance metrics and analytics
 */

import { Award, Clock, Zap, Calendar, TrendingUp, Target } from "lucide-react";
import type { Staff } from "../types";

export interface MetricsTabProps {
  staff: Staff;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 mt-4 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
      {children}
    </div>
  );
}

export function MetricsTab({ staff }: MetricsTabProps) {
  const punctuality = staff.punctualityScore || 0;
  const compliance = staff.complianceScore || 0;

  return (
    <div className="p-4">
      {/* Key Metrics */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        {[
          {
            label: "Punctuality",
            val: `${punctuality}%`,
            icon: Clock,
            color:
              punctuality >= 95
                ? "text-green-600"
                : punctuality >= 80
                  ? "text-yellow-600"
                  : "text-red-600",
            bg:
              punctuality >= 95
                ? "bg-green-50"
                : punctuality >= 80
                  ? "bg-yellow-50"
                  : "bg-red-50",
          },
          {
            label: "Compliance",
            val: `${compliance}%`,
            icon: Award,
            color:
              compliance >= 90
                ? "text-green-600"
                : compliance >= 75
                  ? "text-yellow-600"
                  : "text-red-600",
            bg:
              compliance >= 90
                ? "bg-green-50"
                : compliance >= 75
                  ? "bg-yellow-50"
                  : "bg-red-50",
          },
        ].map((m, i) => (
          <div
            key={i}
            className={`rounded-lg border p-3 ${m.bg} ${
              m.color === "text-green-600"
                ? "border-green-200"
                : m.color === "text-yellow-600"
                  ? "border-yellow-200"
                  : "border-red-200"
            }`}
          >
            <m.icon size={16} className={`mb-2 ${m.color}`} />
            <div className={`text-[18px] font-bold ${m.color}`}>{m.val}</div>
            <div className="text-[10px] text-muted-foreground">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Punctuality Score */}
      <SectionTitle>Punctuality Score</SectionTitle>
      <div className="mb-4 rounded-lg border border-border bg-card p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-foreground">
            30-Day Average
          </span>
          <span
            className={`text-[16px] font-bold ${
              punctuality >= 95
                ? "text-green-600"
                : punctuality >= 80
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            {punctuality}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${
              punctuality >= 95
                ? "bg-green-600"
                : punctuality >= 80
                  ? "bg-yellow-500"
                  : "bg-red-600"
            }`}
            style={{ width: `${punctuality}%` }}
          />
        </div>
        <div className="mt-2 text-[10px] text-muted-foreground">
          {punctuality === 100
            ? "Perfect attendance! 🏆"
            : punctuality >= 95
              ? "Excellent punctuality"
              : punctuality >= 80
                ? "Good, room for improvement"
                : "Needs attention"}
        </div>
      </div>

      {/* Work Hours */}
      <SectionTitle>Work Hours</SectionTitle>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {[
          {
            label: "This Week",
            val: `${staff.hoursThisWeek}h`,
            icon: Calendar,
            color: "text-primary",
          },
          {
            label: "OT Hours",
            val: `${staff.otHours || 0}h`,
            icon: Zap,
            color: "text-yellow-600",
          },
          {
            label: "Avg/Day",
            val: `${(staff.hoursThisWeek / 5).toFixed(1)}h`,
            icon: TrendingUp,
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

      {/* Leave Balance */}
      <SectionTitle>Leave Balance</SectionTitle>
      <div className="mb-4 rounded-lg border border-border bg-card p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-foreground">
            Days Remaining
          </span>
          <span
            className={`text-[18px] font-bold ${
              (staff.leaveBalance || 0) < 5
                ? "text-red-600"
                : (staff.leaveBalance || 0) < 10
                  ? "text-yellow-600"
                  : "text-green-600"
            }`}
          >
            {staff.leaveBalance || 0}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${
              (staff.leaveBalance || 0) < 5
                ? "bg-red-600"
                : (staff.leaveBalance || 0) < 10
                  ? "bg-yellow-500"
                  : "bg-green-600"
            }`}
            style={{ width: `${((staff.leaveBalance || 0) / 20) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-[10px] text-muted-foreground">
          Out of 20 days annual leave
        </div>
      </div>

      {/* Performance Summary */}
      <SectionTitle>Performance Summary</SectionTitle>
      <div className="space-y-2">
        {[
          {
            label: "Attendance Rate",
            val: punctuality,
            target: 95,
            icon: Target,
          },
          {
            label: "Compliance Score",
            val: compliance,
            target: 90,
            icon: Award,
          },
          {
            label: "Weekly Hours",
            val: (staff.hoursThisWeek / 40) * 100,
            target: 100,
            icon: Clock,
          },
        ].map((m, i) => (
          <div key={i} className="rounded-md border border-border bg-card p-2">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <m.icon size={12} className="text-muted-foreground" />
                <span className="text-[11px] font-semibold text-foreground">
                  {m.label}
                </span>
              </div>
              <span
                className={`text-[12px] font-bold ${
                  m.val >= m.target
                    ? "text-green-600"
                    : m.val >= m.target * 0.8
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {m.val.toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${
                    m.val >= m.target
                      ? "bg-green-600"
                      : m.val >= m.target * 0.8
                        ? "bg-yellow-500"
                        : "bg-red-600"
                  }`}
                  style={{ width: `${Math.min(m.val, 100)}%` }}
                />
              </div>
              <span className="text-[9px] text-muted-foreground">
                Target: {m.target}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
