/**
 * MetricsWorkspace Component
 * Displays staff performance metrics, hours worked, and compliance scores
 * Combines attendance KPIs, punctuality leaderboard, hours breakdown, and visual analytics
 */

import {
  CheckCircle,
  Zap,
  AlertCircle,
  LogOut,
  Award,
  TrendingUp,
} from "lucide-react";
import type { Staff } from "../types";
import { ATTENDANCE_RECORDS } from "../mock-data";

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
  // Calculate attendance metrics from records
  const todayRecords = ATTENDANCE_RECORDS.filter((r) => r.date === "Today");
  const totalScheduled = todayRecords.length;
  const presentCount = todayRecords.filter(
    (r) => r.status === "present" || r.status === "late",
  ).length;
  const attendanceRate =
    totalScheduled > 0 ? Math.round((presentCount / totalScheduled) * 100) : 0;
  const totalOT = allStaff.reduce((sum, s) => sum + (s.otHours || 0), 0);
  const lateCount = todayRecords.filter((r) => r.status === "late").length;
  const earlyDepartureCount = todayRecords.filter(
    (r) => r.status === "early_departure",
  ).length;

  // Calculate weekly hours data for chart
  const weeklyData = [
    { day: "Mon", h: 38 },
    { day: "Tue", h: 42 },
    { day: "Wed", h: 35 },
    { day: "Thu", h: 44 },
    { day: "Fri", h: 40 },
    { day: "Sat", h: 22 },
    { day: "Sun", h: 10 },
  ];
  const maxWeeklyHours = Math.max(...weeklyData.map((d) => d.h));
  const maxHours = Math.max(...allStaff.map((s) => s.hoursThisWeek));

  return (
    <div className="custom-scrollbar flex-1 overflow-auto p-4">
      {/* Primary KPI Cards - Attendance Metrics */}
      <div className="mb-4 grid grid-cols-4 gap-3">
        {[
          {
            label: "Attendance Rate",
            val: attendanceRate,
            unit: "%",
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-50",
            border: "border-green-200",
          },
          {
            label: "Total OT Hours",
            val: totalOT.toFixed(1),
            unit: "h",
            icon: Zap,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
            border: "border-yellow-200",
          },
          {
            label: "Late Arrivals",
            val: lateCount,
            unit: "",
            icon: AlertCircle,
            color: "text-red-600",
            bg: "bg-red-50",
            border: "border-red-200",
          },
          {
            label: "Early Departures",
            val: earlyDepartureCount,
            unit: "",
            icon: LogOut,
            color: "text-orange-600",
            bg: "bg-orange-50",
            border: "border-orange-200",
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
                <div className="flex items-baseline gap-1">
                  <span className={`text-[26px] font-bold ${m.color}`}>
                    {m.val}
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    {m.unit}
                  </span>
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

      {/* Visual Analytics Row */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {/* Weekly Hours Trend Chart */}
        <div
          className="rounded-lg bg-card p-3.5 shadow-sm"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
        >
          <div className="mb-3.5 flex items-center justify-between">
            <div className="text-[12px] font-semibold">
              Pharmacy Hours — This Week
            </div>
            <TrendingUp size={14} className="text-primary" />
          </div>
          <div className="flex h-20 items-end gap-2">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t border transition-all ${
                    i === 3
                      ? "border-primary bg-primary"
                      : "border-primary/20 bg-primary/10 hover:bg-primary/20"
                  }`}
                  style={{ height: `${(d.h / maxWeeklyHours) * 70}px` }}
                  title={`${d.day}: ${d.h}h`}
                />
                <span className="text-[10px] text-muted-foreground">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-[10px] text-muted-foreground">
            Total: {weeklyData.reduce((sum, d) => sum + d.h, 0)}h this week
          </div>
        </div>

        {/* Compliance Score Overview */}
        <div
          className="rounded-lg bg-card p-3.5 shadow-sm"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[12px] font-semibold">
              Compliance Score Overview
            </div>
            <Award size={14} className="text-yellow-600" />
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
                    className={`cursor-pointer rounded-lg border-2 bg-muted/50 p-2 text-center transition-all hover:bg-muted ${
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
                    <div
                      className={`mt-0.5 text-[16px] font-extrabold ${color}`}
                    >
                      {s.complianceScore}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Punctuality Leaderboard & Hours Breakdown Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Punctuality Leaderboard */}
        <div
          className="rounded-lg bg-card p-3.5 shadow-sm"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
        >
          <div className="mb-3 text-[12px] font-semibold">
            🎯 Punctuality Leaderboard
          </div>
          <div
            className="mb-2 grid items-center gap-2 border-b border-border pb-2 text-[9px] font-bold uppercase tracking-wide text-muted-foreground"
            style={{ gridTemplateColumns: "40px 1fr 120px 60px" }}
          >
            <span>Rank</span>
            <span>Staff</span>
            <span>Score</span>
            <span className="text-right">%</span>
          </div>
          {[...allStaff]
            .sort(
              (a, b) => (b.punctualityScore || 0) - (a.punctualityScore || 0),
            )
            .map((s, i) => {
              const score = s.punctualityScore || 0;
              const color =
                score >= 95
                  ? "text-green-600"
                  : score >= 85
                    ? "text-yellow-600"
                    : "text-red-600";
              const bgColor =
                score >= 95
                  ? "bg-green-600"
                  : score >= 85
                    ? "bg-yellow-600"
                    : "bg-red-600";
              const isSelected = selectedStaff?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => onSelectStaff(isSelected ? null : s)}
                  className={`grid cursor-pointer items-center gap-2 border-l-[2.5px] py-2 transition-colors hover:bg-muted/50 ${
                    i < allStaff.length - 1 ? "border-b border-border/50" : ""
                  } ${
                    isSelected
                      ? "border-l-primary bg-primary/5"
                      : "border-l-transparent"
                  }`}
                  style={{ gridTemplateColumns: "40px 1fr 120px 60px" }}
                >
                  <div className="flex items-center justify-center">
                    {i === 0 && <span className="text-[16px]">🏆</span>}
                    {i === 1 && <span className="text-[16px]">🥈</span>}
                    {i === 2 && <span className="text-[16px]">🥉</span>}
                    {i > 2 && (
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        #{i + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary shrink-0">
                      {s.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold truncate">
                        {s.name}
                      </div>
                      <div className="text-[9px] text-muted-foreground">
                        {s.role}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${bgColor}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-right text-[13px] font-bold ${color}`}>
                    {score}%
                  </span>
                </div>
              );
            })}
        </div>

        {/* Hours Breakdown Table */}
        <div
          className="rounded-lg bg-card p-3.5 shadow-sm"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
        >
          <div className="mb-3 text-[12px] font-semibold">📊 Hours & Leave</div>
          <div
            className="mb-2 grid items-center gap-2 border-b border-border pb-2 text-[9px] font-bold uppercase tracking-wide text-muted-foreground"
            style={{ gridTemplateColumns: "1fr 80px 70px 80px" }}
          >
            <span>Staff</span>
            <span>Hours</span>
            <span>OT</span>
            <span>Leave</span>
          </div>
          {[...allStaff]
            .sort((a, b) => b.hoursThisWeek - a.hoursThisWeek)
            .map((s, i) => {
              const isSelected = selectedStaff?.id === s.id;
              const hasOT = (s.otHours || 0) > 0;
              return (
                <div
                  key={s.id}
                  onClick={() => onSelectStaff(isSelected ? null : s)}
                  className={`grid cursor-pointer items-center gap-2 border-l-[2.5px] py-2 transition-colors hover:bg-muted/50 ${
                    i < allStaff.length - 1 ? "border-b border-border/50" : ""
                  } ${
                    isSelected
                      ? "border-l-primary bg-primary/5"
                      : "border-l-transparent"
                  }`}
                  style={{ gridTemplateColumns: "1fr 80px 70px 80px" }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary shrink-0">
                      {s.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold truncate">
                        {s.name}
                      </div>
                      <div className="text-[9px] text-muted-foreground">
                        {s.role}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[12px] font-bold text-primary">
                      {s.hoursThisWeek}h
                    </span>
                    <div className="h-1.5 w-8 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${(s.hoursThisWeek / maxHours) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span
                    className={`text-[12px] font-bold ${
                      hasOT ? "text-yellow-600" : "text-muted-foreground"
                    }`}
                  >
                    {s.otHours || 0}h
                    {hasOT && (
                      <span className="ml-0.5 text-[9px] font-normal">⚡</span>
                    )}
                  </span>
                  <span className="text-[12px] font-semibold text-foreground">
                    {s.leaveBalance || 0}d
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
