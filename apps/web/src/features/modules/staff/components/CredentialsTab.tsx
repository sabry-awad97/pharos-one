/**
 * CredentialsTab Component
 * Displays staff credentials with expiry status and renewal actions
 */

import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import type { Staff } from "../types";

export interface CredentialsTabProps {
  staff: Staff;
}

function CredBadge({ status, daysLeft }: { status: string; daysLeft: number }) {
  const styles: Record<
    string,
    { bg: string; text: string; border: string; label: string; icon: any }
  > = {
    valid: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      label: "Valid",
      icon: CheckCircle,
    },
    expiring: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      label: `${daysLeft}d left`,
      icon: Clock,
    },
    critical: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      label: `${daysLeft}d left`,
      icon: AlertCircle,
    },
    expired: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      label: "Expired",
      icon: AlertCircle,
    },
  };

  const style = styles[status] || styles.valid;
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-[11px] font-semibold ${style.bg} ${style.text} ${style.border}`}
    >
      <Icon size={12} />
      {style.label}
    </span>
  );
}

export function CredentialsTab({ staff }: CredentialsTabProps) {
  const sortedCreds = [...staff.credentials].sort((a, b) => {
    const order = { expired: 0, critical: 1, expiring: 2, valid: 3 };
    return (
      (order[a.status as keyof typeof order] || 4) -
      (order[b.status as keyof typeof order] || 4)
    );
  });

  return (
    <div className="p-4">
      {/* Summary */}
      <div className="mb-4 rounded-lg border border-border bg-muted/30 p-3">
        <div className="mb-2 text-[11px] font-semibold text-foreground">
          Credential Summary
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              label: "Total",
              val: staff.credentials.length,
              color: "text-foreground",
            },
            {
              label: "Valid",
              val: staff.credentials.filter((c) => c.status === "valid").length,
              color: "text-green-600",
            },
            {
              label: "Expiring",
              val: staff.credentials.filter((c) => c.status === "expiring")
                .length,
              color: "text-yellow-600",
            },
            {
              label: "Critical",
              val: staff.credentials.filter(
                (c) => c.status === "critical" || c.status === "expired",
              ).length,
              color: "text-red-600",
            },
          ].map((m, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {m.label}
              </span>
              <span className={`text-[13px] font-bold ${m.color}`}>
                {m.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Credentials List */}
      <div className="space-y-2">
        {sortedCreds.map((c, i) => (
          <div
            key={i}
            className={`rounded-lg border p-3 ${
              c.status === "expired"
                ? "border-red-200 bg-red-50"
                : c.status === "critical"
                  ? "border-orange-200 bg-orange-50/30"
                  : c.status === "expiring"
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-border bg-card"
            }`}
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="flex-1">
                <div className="text-[13px] font-bold text-foreground">
                  {c.type}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  {c.number}
                </div>
              </div>
              <CredBadge status={c.status} daysLeft={c.daysLeft} />
            </div>

            <div className="mb-2 flex items-center gap-4 text-[11px]">
              <div>
                <span className="text-muted-foreground">Expires: </span>
                <span
                  className={`font-semibold ${
                    c.status === "expired" || c.status === "critical"
                      ? "text-red-600"
                      : c.status === "expiring"
                        ? "text-yellow-600"
                        : "text-foreground"
                  }`}
                >
                  {c.expiry}
                </span>
              </div>
              {c.daysLeft >= 0 && (
                <div>
                  <span className="text-muted-foreground">Days left: </span>
                  <span
                    className={`font-semibold ${
                      c.daysLeft < 30
                        ? "text-red-600"
                        : c.daysLeft < 90
                          ? "text-yellow-600"
                          : "text-green-600"
                    }`}
                  >
                    {c.daysLeft}
                  </span>
                </div>
              )}
            </div>

            {(c.status === "expired" || c.status === "critical") && (
              <div className="flex gap-2">
                <button className="flex-1 rounded-md border border-primary/20 bg-primary/10 py-1.5 text-[11px] font-bold text-primary hover:bg-primary/20">
                  Start Renewal
                </button>
                <button className="rounded-md border border-border bg-background px-3 py-1.5 text-[11px] text-muted-foreground hover:bg-muted/50">
                  Upload
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
