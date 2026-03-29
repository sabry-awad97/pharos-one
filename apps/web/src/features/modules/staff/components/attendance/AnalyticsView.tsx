import type { Staff, AttRecord } from "../../types";

interface AnalyticsViewProps {
  allStaff: Staff[];
  records: AttRecord[];
}

export function AnalyticsView({ allStaff, records }: AnalyticsViewProps) {
  const weeklyTrend = [
    { day: "Mon", rate: 100, hours: 40 },
    { day: "Tue", rate: 80, hours: 35 },
    { day: "Wed", rate: 100, hours: 41 },
    { day: "Thu", rate: 80, hours: 34 },
    { day: "Fri", rate: 80, hours: 32 },
    { day: "Today", rate: 60, hours: 19 },
  ];
  const maxH = Math.max(...weeklyTrend.map((d) => d.hours));
  const totalOT = records.reduce((a, r) => a + r.otHours, 0);
  const lateCount = records.filter((r) => r.status === "late").length;
  const earlyCount = records.filter(
    (r) => r.status === "early_departure",
  ).length;

  return (
    <div className="custom-scrollbar flex-1 overflow-auto p-4">
      {/* Summary KPIs */}
      <div className="mb-4 grid grid-cols-4 gap-3">
        {[
          {
            label: "Attendance Rate",
            val: "80%",
            sub: "This week avg",
            color: "text-yellow-600",
          },
          {
            label: "Total OT Hours",
            val: `${totalOT.toFixed(1)}h`,
            sub: "This week",
            color: "text-primary",
          },
          {
            label: "Late Arrivals",
            val: lateCount,
            sub: "This week",
            color: "text-yellow-600",
          },
          {
            label: "Early Departures",
            val: earlyCount,
            sub: "This week",
            color: "text-red-600",
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
            <div className={`text-[22px] font-bold ${m.color}`}>{m.val}</div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        {/* Attendance rate trend */}
        <div
          className="rounded-lg bg-card p-3.5 shadow-sm"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
        >
          <div className="mb-3.5 text-[12px] font-semibold">
            Daily Attendance Rate — This Week
          </div>
          <div className="flex h-20 items-end gap-2">
            {weeklyTrend.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span
                  className={`text-[9px] font-bold ${
                    d.rate < 100 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {d.rate}%
                </span>
                <div
                  className={`w-full rounded-t ${
                    d.rate === 100
                      ? "bg-green-600"
                      : d.rate >= 80
                        ? "bg-yellow-500"
                        : "bg-red-600"
                  }`}
                  style={{
                    height: `${(d.rate / 100) * 60}px`,
                    opacity: i === weeklyTrend.length - 1 ? 0.7 : 1,
                  }}
                />
                <span className="text-[9px] text-muted-foreground">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hours worked chart */}
        <div
          className="rounded-lg bg-card p-3.5 shadow-sm"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
        >
          <div className="mb-3.5 text-[12px] font-semibold">
            Total Hours Per Day
          </div>
          <div className="flex h-20 items-end gap-2">
            {weeklyTrend.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[9px] font-bold text-muted-foreground">
                  {d.hours}h
                </span>
                <div
                  className="w-full rounded-t border border-primary/20 bg-primary/10"
                  style={{
                    height: `${(d.hours / maxH) * 60}px`,
                    opacity: i === weeklyTrend.length - 1 ? 0.7 : 1,
                  }}
                />
                <span className="text-[9px] text-muted-foreground">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Punctuality leaderboard */}
      <div
        className="mb-3 rounded-lg bg-card p-3.5 shadow-sm"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
      >
        <div className="mb-3 text-[12px] font-semibold">
          Punctuality Scores — 30 Day
        </div>
        {[...allStaff]
          .sort((a, b) => (b.punctualityScore || 0) - (a.punctualityScore || 0))
          .map((s, i) => {
            const score = s.punctualityScore || 0;
            const color =
              score >= 95
                ? "bg-green-600"
                : score >= 80
                  ? "bg-yellow-500"
                  : "bg-red-600";
            const textColor =
              score >= 95
                ? "text-green-600"
                : score >= 80
                  ? "text-yellow-600"
                  : "text-red-600";
            return (
              <div key={s.id} className="mb-2 flex items-center gap-2.5">
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
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
                <span
                  className={`min-w-9 text-right text-[13px] font-extrabold ${textColor}`}
                >
                  {score}%
                </span>
                {score === 100 && <span className="text-[12px]">🏆</span>}
              </div>
            );
          })}
      </div>

      {/* OT by staff */}
      <div
        className="rounded-lg bg-card p-3.5 shadow-sm"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[12px] font-semibold">
            Overtime Hours — This Week
          </div>
        </div>
        {[...allStaff]
          .sort((a, b) => (b.otHours || 0) - (a.otHours || 0))
          .map((s) => {
            const ot = s.otHours || 0;
            return (
              <div key={s.id} className="mb-2 flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  {s.initials}
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-semibold">{s.name}</div>
                  <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-yellow-500"
                      style={{ width: `${(ot / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="min-w-12 text-right text-[13px] font-extrabold text-yellow-600">
                  {ot.toFixed(1)}h
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
