/**
 * OverviewTab Component
 * Dashboard overview showing staff metrics, duty status, and compliance alerts
 */

import { Users, CheckCircle, AlertTriangle, Award } from "lucide-react";
import { useMemo } from "react";
import { STAFF_DATA } from "../mock-data";
import type { Staff } from "../types";

// Avatar colors matching StaffDirectory
const avatarColors = [
  ["#EFF6FC", "#0078D4"],
  ["#DFF6DD", "#0F7B0F"],
  ["#FFF4CE", "#835400"],
  ["#FFF0EE", "#C42B1C"],
  ["#F4EBFF", "#7B61FF"],
];

// Avatar component
function Avatar({ staff, size = 32 }: { staff: Staff; size?: number }) {
  const [bg, fg] = avatarColors[parseInt(staff.id) % avatarColors.length];
  return (
    <div
      className="flex items-center justify-center shrink-0 rounded-full font-bold mx-auto"
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize: size * 0.36,
        letterSpacing: 0.3,
      }}
    >
      {staff.initials}
    </div>
  );
}

// Credential icon component
function CredIcon({ status }: { status: string }) {
  const iconClass = "w-[13px] h-[13px]";
  if (status === "valid")
    return (
      <svg
        className={`${iconClass} text-green-700`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeWidth="2" d="M9 12l2 2 4-4" />
      </svg>
    );
  if (status === "expiring" || status === "critical")
    return (
      <svg
        className={`${iconClass} ${status === "expiring" ? "text-yellow-800" : "text-red-700"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeWidth="2" d="M12 2L2 20h20L12 2z M12 9v6 M12 17h.01" />
      </svg>
    );
  return (
    <svg
      className={`${iconClass} text-gray-400`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeWidth="2" d="M15 9l-6 6 M9 9l6 6" />
    </svg>
  );
}

// Credential badge component
function CredBadge({ status, daysLeft }: { status: string; daysLeft: number }) {
  const statusMap = {
    valid: "bg-green-50 text-green-700 border-green-200",
    expiring: "bg-yellow-50 text-yellow-800 border-yellow-200",
    critical: "bg-red-50 text-red-700 border-red-200",
    expired: "bg-gray-50 text-gray-400 border-gray-200",
  };

  const label = status === "expired" ? "Expired" : `${daysLeft}d`;
  const className =
    statusMap[status as keyof typeof statusMap] || statusMap.valid;

  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded-[3px] font-bold border ${className}`}
    >
      {label}
    </span>
  );
}

export interface OverviewTabProps {
  selectedStaff: Staff | null;
  onSelectStaff: (staff: Staff | null) => void;
}

export function OverviewTab({
  selectedStaff,
  onSelectStaff,
}: OverviewTabProps) {
  // Calculate metrics
  const metrics = useMemo(() => {
    const onDuty = STAFF_DATA.filter((s) => s.dutyStatus === "On Duty").length;
    const onBreak = STAFF_DATA.filter(
      (s) => s.dutyStatus === "On Break",
    ).length;
    const offDuty = STAFF_DATA.filter(
      (s) => s.dutyStatus === "Off Duty",
    ).length;

    const allCreds = STAFF_DATA.flatMap((s) => s.credentials);
    const expired = allCreds.filter((c) => c.status === "expired").length;
    const critical = allCreds.filter((c) => c.status === "critical").length;
    const expiring = allCreds.filter((c) => c.status === "expiring").length;
    const valid = allCreds.filter((c) => c.status === "valid").length;

    const avgScore = Math.round(
      STAFF_DATA.reduce((a, s) => a + s.complianceScore, 0) / STAFF_DATA.length,
    );

    return {
      onDuty,
      onBreak,
      offDuty,
      expired,
      critical,
      expiring,
      valid,
      avgScore,
      totalAlerts: expired + critical + expiring,
    };
  }, []);

  const kpiCards = [
    {
      label: "Total Staff",
      value: STAFF_DATA.length,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      sub: "Main Street Branch",
    },
    {
      label: "On Duty Now",
      value: metrics.onDuty,
      icon: CheckCircle,
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
      sub: `${metrics.onBreak} on break`,
    },
    {
      label: "Compliance Alerts",
      value: metrics.totalAlerts,
      icon: AlertTriangle,
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      sub: `${metrics.expired} expired`,
    },
    {
      label: "Avg Compliance",
      value: `${metrics.avgScore}%`,
      icon: Award,
      color: metrics.avgScore >= 85 ? "text-green-700" : "text-yellow-700",
      bg: metrics.avgScore >= 85 ? "bg-green-50" : "bg-yellow-50",
      border: metrics.avgScore >= 85 ? "border-green-200" : "border-yellow-200",
      sub: "Target: 90%",
    },
  ];

  const dutyBreakdown = [
    { label: "On Duty", value: metrics.onDuty, color: "bg-green-700" },
    { label: "On Break", value: metrics.onBreak, color: "bg-yellow-600" },
    { label: "Off Duty", value: metrics.offDuty, color: "bg-gray-400" },
  ];

  const credentialAlerts = [
    {
      label: "Expired",
      value: metrics.expired,
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
    },
    {
      label: "Critical (<30d)",
      value: metrics.critical,
      color: "text-red-700",
      bg: "bg-red-50/50",
      border: "border-red-200",
    },
    {
      label: "Expiring (30–90d)",
      value: metrics.expiring,
      color: "text-yellow-800",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
    },
    {
      label: "Valid (>90d)",
      value: metrics.valid,
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
    },
  ];

  const recentAlerts = useMemo(() => {
    return STAFF_DATA.flatMap((s) =>
      s.credentials
        .filter((c) => c.status !== "valid")
        .map((c) => ({ staff: s, cred: c })),
    ).slice(0, 5);
  }, []);

  return (
    <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {kpiCards.map((kpi, i) => (
          <div
            key={i}
            className="bg-card rounded-lg shadow-sm border border-border p-3.5 md:p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  {kpi.label}
                </div>
                <div className={`text-2xl font-bold ${kpi.color}`}>
                  {kpi.value}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  {kpi.sub}
                </div>
              </div>
              <div
                className={`w-8 h-8 rounded ${kpi.bg} border ${kpi.border} flex items-center justify-center`}
              >
                <kpi.icon size={16} className={kpi.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Duty Status & Credential Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        {/* Duty Status Breakdown */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-3.5 md:p-4">
          <div className="text-xs font-semibold mb-3">
            Duty Status Breakdown
          </div>
          {dutyBreakdown.map((d, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span>{d.label}</span>
                <span className="font-bold">
                  {d.value} / {STAFF_DATA.length}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${d.color} rounded-full`}
                  style={{ width: `${(d.value / STAFF_DATA.length) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Credential Alerts */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-3.5 md:p-4">
          <div className="text-xs font-semibold mb-3">Credential Alerts</div>
          {credentialAlerts.map((a, i) => (
            <div
              key={i}
              className={`flex justify-between items-center px-2 py-1.5 ${a.bg} border ${a.border} rounded mb-1.5`}
            >
              <span className={`text-xs ${a.color} font-medium`}>
                {a.label}
              </span>
              <span className={`text-sm font-bold ${a.color}`}>{a.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Compliance Scorecard */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-3.5 md:p-4 mb-4">
        <div className="text-xs font-semibold mb-3">
          Staff Compliance Scorecard
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {STAFF_DATA.map((s) => {
            const color =
              s.complianceScore >= 90
                ? "text-green-700"
                : s.complianceScore >= 70
                  ? "text-yellow-700"
                  : "text-red-700";
            const isSelected = selectedStaff?.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => onSelectStaff(isSelected ? null : s)}
                className={`bg-muted rounded-lg p-2.5 cursor-pointer border-2 text-center transition-colors ${
                  isSelected
                    ? "border-primary"
                    : "border-transparent hover:border-border"
                }`}
              >
                <Avatar staff={s} size={32} />
                <div className="text-[10px] font-semibold mt-1.5 truncate">
                  {s.name.split(" ")[0]}
                </div>
                <div className={`text-[13px] font-bold ${color} mt-0.5`}>
                  {s.complianceScore}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-3.5 md:p-4">
        <div className="text-xs font-semibold mb-3">Recent Alerts</div>
        {recentAlerts.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 py-2 border-b border-border last:border-0"
          >
            <CredIcon status={item.cred.status} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">
                {item.staff.name} — {item.cred.type}
              </div>
              <div className="text-[10px] text-muted-foreground">
                Expires {item.cred.expiry}
              </div>
            </div>
            <CredBadge
              status={item.cred.status}
              daysLeft={item.cred.daysLeft}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
