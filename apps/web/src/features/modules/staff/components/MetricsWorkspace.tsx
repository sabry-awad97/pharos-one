/**
 * MetricsWorkspace Component
 * Displays staff performance metrics, hours worked, and compliance scores
 */

import { Clock, TrendingUp, Award, Activity } from "lucide-react";
import type { Staff } from "../types";

interface MetricsWorkspaceProps {
  allStaff: Staff[];
  selectedStaff: Staff | null;
  onSelectStaff: (staff: Staff | null) => void;
}

export function MetricsWorkspace({
  allStaff,
  selectedStaff,
  onSelectStaff,
}: MetricsWorkspaceProps) {
  const maxHours = Math.max(...allStaff.map((s) => s.hoursThisWeek));
  const weeklyData = [
    { day: "Mon", h: 38 },
    { day: "Tue", h: 42 },
    { day: "Wed", h: 35 },
    { day: "Thu", h: 44 },
    { day: "Fri", h: 40 },
    { day: "Sat", h: 22 },
    { day: "Sun", h: 10 },
  ];
  const maxW = Math.max(...weeklyData.map((d) => d.h));

  return (
    <div className="custom-scrollbar flex-1 overflow-auto p-4">
      {/* KPI Cards */}
      <div className="mb-4 grid grid-cols-4 gap-3">
        {[
          {
            label: "Total Hrs This Week",
            val: allStaff.reduce((a, s) => a + s.hoursThisWeek, 0),
            unit: "h",
            icon: Clock,
            color: "text-primary",
          },
          {
            label: "Avg Hrs Per Staff",
            val: Math.round(
              allStaff.reduce((a, s) => a + s.hoursThisWeek, 0) /
                allStaff.length,
            ),
            unit: "h",
            icon: TrendingUp,
            color: "text-green-600",
          },
          {
            label: "Compliance Score",
            val: Math.round(
              allStaff.reduce((a, s) => a + s.complianceScore, 0) /
                allStaff.length,
            ),
            unit: "%",
            icon: Award,
            color: "text-yellow-600",
          },
          {
            label: "Active Today",
            val: allStaff.filter((s) => s.dutyStatus !== "Off Duty").length,
            unit: "",
            icon: Activity,
            color: "text-green-600",
          },
        ].map((m, i) => (
          <div
            key={i}
            className="rounded-lg bg-card p-3.5 shadow-sm"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
          >
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {m.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-[26px] font-bold ${m.color}`}>
                {m.val}
              </span>
              <span className="text-[13px] text-muted-foreground">
                {m.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {/* Pharmacy Hours Chart */}
        <div
          className="rounded-lg bg-card p-3.5 shadow-sm"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
        >
          <div className="mb-3.5 text-[12px] font-semibold">
            Pharmacy Hours — This Week
          </div>
          <div className="flex h-20 items-end gap-2">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t border ${
                    i === 3
                      ? "border-primary bg-primary"
                      : "border-primary/20 bg-primary/10"
                  }`}
                  style={{ height: `${(d.h / maxW) * 70}px` }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hours by Staff */}
        <div
          className="rounded-lg bg-card p-3.5 shadow-sm"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
        >
          <div className="mb-3 text-[12px] font-semibold">
            Hours This Week — By Staff
          </div>
          {[...allStaff]
            .sort((a, b) => b.hoursThisWeek - a.hoursThisWeek)
            .map((s, i) => {
              const isSelected = selectedStaff?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => onSelectStaff(isSelected ? null : s)}
                  className={`mb-2 flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-0.5 ${
                    isSelected ? "bg-primary/5" : ""
                  }`}
                >
                  <span className="w-3.5 text-right text-[10px] text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                    {s.initials}
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-semibold">{s.name}</div>
                    <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${(s.hoursThisWeek / maxHours) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-[13px] font-bold text-primary">
                    {s.hoursThisWeek}h
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Compliance Leaderboard */}
      <div
        className="rounded-lg bg-card p-3.5 shadow-sm"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
      >
        <div className="mb-3 text-[12px] font-semibold">
          Compliance Score Leaderboard
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[...allStaff]
            .sort((a, b) => b.complianceScore - a.complianceScore)
            .map((s, i) => {
              const color =
                s.complianceScore >= 90
                  ? "text-green-600"
                  : s.complianceScore >= 70
                    ? "text-yellow-600"
                    : "text-red-600";
              const isSelected = selectedStaff?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => onSelectStaff(isSelected ? null : s)}
                  className={`cursor-pointer rounded-lg border-2 bg-muted/50 p-2 text-center ${
                    isSelected ? "border-primary" : "border-transparent"
                  }`}
                >
                  {i === 0 && <div className="mb-1 text-[14px]">🏆</div>}
                  <div className="mx-auto flex h-7.5 w-7.5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                    {s.initials}
                  </div>
                  <div className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-semibold">
                    {s.name.split(" ")[0]}
                  </div>
                  <div className={`mt-0.5 text-[16px] font-extrabold ${color}`}>
                    {s.complianceScore}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
