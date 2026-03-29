/**
 * CredentialsTracker Component
 * Displays all staff credentials with filtering using TanStack Table
 */

import { useMemo, useState } from "react";
import { flexRender, type ColumnDef } from "@tanstack/react-table";
import { Shield, Download } from "lucide-react";
import { STAFF_DATA } from "../mock-data";
import type { LicenseStatus, Staff } from "../types";
import {
  DataTableProvider,
  useDataTableContext,
  DataTable,
  DataTableColumnHeader,
} from "@/components/data-table";
import { cn } from "@pharos-one/ui/lib/utils";
import { cva } from "class-variance-authority";

interface CredentialWithStaff {
  staffId: string;
  staffName: string;
  staffInitials: string;
  staff: Staff;
  type: string;
  number: string;
  expiry: string;
  status: LicenseStatus;
  daysLeft: number;
}

const STORAGE_KEY = "credentials-tracker-page-size";

// Avatar colors matching StaffDirectory
const avatarColors = [
  ["#EFF6FC", "#0078D4"],
  ["#DFF6DD", "#0F7B0F"],
  ["#FFF4CE", "#835400"],
  ["#FFF0EE", "#C42B1C"],
  ["#F4EBFF", "#7B61FF"],
];

// Avatar component
function Avatar({ staff, size = 26 }: { staff: Staff; size?: number }) {
  const [bg, fg] = avatarColors[parseInt(staff.id) % avatarColors.length];
  return (
    <div
      className="flex items-center justify-center shrink-0 rounded-full font-bold"
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

// Credential badge variants using cva
const credBadgeVariants = cva(
  "text-[10px] px-1.5 py-0.5 rounded-[3px] font-bold border",
  {
    variants: {
      status: {
        valid: "bg-green-50 text-green-700 border-green-200",
        expiring: "bg-yellow-50 text-yellow-800 border-yellow-200",
        critical: "bg-red-50 text-red-700 border-red-200",
        expired: "bg-gray-50 text-gray-400 border-gray-200",
      },
    },
    defaultVariants: {
      status: "valid",
    },
  },
);

// Credential badge component
function CredBadge({
  status,
  daysLeft,
}: {
  status: LicenseStatus;
  daysLeft: number;
}) {
  const label = status === "expired" ? "Expired" : `${daysLeft}d`;
  return <span className={cn(credBadgeVariants({ status }))}>{label}</span>;
}

// Credential icon component
function CredIcon({ status }: { status: LicenseStatus }) {
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

export function CredentialsTracker() {
  const [statusFilter, setStatusFilter] = useState<LicenseStatus | "all">(
    "all",
  );

  // Flatten all credentials with staff info
  const allCredentials = useMemo(() => {
    const credentials: CredentialWithStaff[] = [];

    STAFF_DATA.forEach((staff) => {
      staff.credentials.forEach((cred) => {
        credentials.push({
          staffId: staff.id,
          staffName: staff.name,
          staffInitials: staff.initials,
          staff: staff,
          type: cred.type,
          number: cred.number,
          expiry: cred.expiry,
          status: cred.status,
          daysLeft: cred.daysLeft,
        });
      });
    });

    // Sort by urgency: expired, critical, expiring, valid
    const statusOrder = { expired: 0, critical: 1, expiring: 2, valid: 3 };
    return credentials.sort(
      (a, b) => statusOrder[a.status] - statusOrder[b.status],
    );
  }, []);

  // Calculate counts for filter buttons
  const counts = useMemo(() => {
    return {
      expired: allCredentials.filter((c) => c.status === "expired").length,
      critical: allCredentials.filter((c) => c.status === "critical").length,
      expiring: allCredentials.filter((c) => c.status === "expiring").length,
      valid: allCredentials.filter((c) => c.status === "valid").length,
    };
  }, [allCredentials]);

  // Filter credentials
  const filteredCredentials = useMemo(() => {
    if (statusFilter === "all") return allCredentials;
    return allCredentials.filter((c) => c.status === statusFilter);
  }, [allCredentials, statusFilter]);

  // Define columns matching mockup
  const columns = useMemo<ColumnDef<CredentialWithStaff>[]>(
    () => [
      {
        accessorKey: "staffName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Staff Member" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar staff={row.original.staff} size={26} />
            <span className="text-xs font-semibold text-foreground">
              {row.original.staffName}
            </span>
          </div>
        ),
        size: undefined, // auto width
      },
      {
        accessorKey: "type",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Credential Type" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <CredIcon status={row.original.status} />
            <span className="text-xs">{row.original.type}</span>
          </div>
        ),
        size: undefined, // auto width
      },
      {
        accessorKey: "number",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="License #" />
        ),
        cell: ({ getValue }) => (
          <span className="text-[11px] text-muted-foreground font-mono">
            {getValue() as string}
          </span>
        ),
        size: 140,
      },
      {
        accessorKey: "expiry",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Expiry Date" />
        ),
        cell: ({ row }) => (
          <span
            className={`text-xs ${row.original.status === "expired" ? "text-red-700 font-semibold" : "text-foreground"}`}
          >
            {row.original.expiry}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
          <CredBadge
            status={row.original.status}
            daysLeft={row.original.daysLeft}
          />
        ),
        size: 100,
      },
      {
        id: "actions",
        header: () => <span className="text-[10px]">Action</span>,
        cell: ({ row }) => {
          const needsRenewal =
            row.original.status === "expired" ||
            row.original.status === "critical";
          return needsRenewal ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log("Renew credential:", row.original.type);
              }}
              className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded px-2 py-0.5 hover:bg-blue-100 transition-colors"
            >
              Renew →
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log("View credential:", row.original.type);
              }}
              className="text-[11px] text-muted-foreground bg-muted border border-border rounded px-2 py-0.5 hover:bg-muted/80 transition-colors"
            >
              View
            </button>
          );
        },
        size: 100,
      },
    ],
    [],
  );

  return (
    <DataTableProvider<CredentialWithStaff, string>
      columns={columns}
      data={filteredCredentials}
      persistenceKey={STORAGE_KEY}
      getRowId={(cred) => `${cred.staffId}-${cred.type}`}
    >
      <CredentialsTrackerContent
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        counts={counts}
      />
    </DataTableProvider>
  );
}

function CredentialsTrackerContent({
  statusFilter,
  setStatusFilter,
  counts,
}: {
  statusFilter: LicenseStatus | "all";
  setStatusFilter: (value: LicenseStatus | "all") => void;
  counts: Record<LicenseStatus, number>;
}) {
  const { selectedRowIds, focusedRowId, handleRowClick, table } =
    useDataTableContext<CredentialWithStaff, string>();

  const hasData = table.getFilteredRowModel().rows.length > 0;

  const filterButtons: Array<{
    value: LicenseStatus | "all";
    label: string;
    color: string;
    bg: string;
    border: string;
  }> = [
    {
      value: "all",
      label: "All",
      color: "text-muted-foreground",
      bg: "bg-muted",
      border: "border-border",
    },
    {
      value: "expired",
      label: "Expired",
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
    },
    {
      value: "critical",
      label: "Critical",
      color: "text-red-700",
      bg: "bg-red-50/50",
      border: "border-red-200",
    },
    {
      value: "expiring",
      label: "Expiring",
      color: "text-yellow-800",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
    },
    {
      value: "valid",
      label: "Valid",
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
    },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Filter toolbar matching mockup */}
      <div className="h-10 px-5 flex items-center gap-2 shrink-0 border-b border-border bg-card">
        <Shield size={14} className="text-muted-foreground" />
        <span className="text-xs font-semibold text-foreground mr-1">
          Filter
        </span>
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setStatusFilter(btn.value)}
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[11px] border transition-colors",
              statusFilter === btn.value
                ? `${btn.color} ${btn.bg} ${btn.border} font-bold`
                : "text-muted-foreground bg-transparent border-border font-medium hover:bg-muted",
            )}
          >
            {btn.label}
            {btn.value !== "all" && ` (${counts[btn.value]})`}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-1.5 px-2.5 py-1 bg-muted border border-border rounded text-[11px] text-foreground hover:bg-muted/80 transition-colors">
          <Download size={12} />
          Export
        </button>
      </div>

      {/* Table area */}
      <div className="flex-1 flex flex-col overflow-hidden p-4">
        <div
          className="flex-1 flex flex-col overflow-hidden bg-card rounded-lg"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,.07), 0 0 0 1px rgba(0,0,0,0.07)",
          }}
        >
          {hasData ? (
            <DataTable<CredentialWithStaff>
              containerClassName="flex-1 overflow-auto custom-scrollbar"
              className="w-full border-collapse"
              renderRow={(row, idx) => {
                const selected = selectedRowIds.has(
                  `${row.original.staffId}-${row.original.type}`,
                );
                const focused =
                  focusedRowId ===
                  `${row.original.staffId}-${row.original.type}`;
                const isExpired = row.original.status === "expired";

                return (
                  <tr
                    key={row.id}
                    data-selected={selected ? "true" : undefined}
                    data-focused={focused ? "true" : undefined}
                    className="border-b transition-[background] cursor-pointer"
                    style={{
                      borderBottomColor:
                        idx === table.getRowModel().rows.length - 1
                          ? "transparent"
                          : focused
                            ? "transparent"
                            : "#ebebeb",
                      background: focused
                        ? "oklch(from var(--primary) l c h / 0.07)"
                        : selected
                          ? "oklch(from var(--primary) l c h / 0.05)"
                          : isExpired
                            ? "#FFFBFB"
                            : "transparent",
                      boxShadow: focused
                        ? "inset 0 0 0 1.5px var(--primary)"
                        : "none",
                      borderLeft: selected
                        ? "2.5px solid var(--primary)"
                        : "2.5px solid transparent",
                    }}
                    onClick={(e) =>
                      handleRowClick(
                        `${row.original.staffId}-${row.original.type}`,
                        e,
                      )
                    }
                    onMouseEnter={(e) => {
                      if (!focused && !selected) {
                        (
                          e.currentTarget as HTMLTableRowElement
                        ).style.background = "#f0f6ff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!focused && !selected) {
                        (
                          e.currentTarget as HTMLTableRowElement
                        ).style.background = isExpired
                          ? "#FFFBFB"
                          : "transparent";
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap"
                        style={{
                          padding: "10px 14px",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                );
              }}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              No credentials found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
