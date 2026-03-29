/**
 * StaffDirectory component
 * Searchable, filterable list of staff members using TanStack Table
 */

import { useMemo, useState } from "react";
import { flexRender, type ColumnDef } from "@tanstack/react-table";
import {
  Search,
  Grid,
  AlignLeft,
  Eye,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { STAFF_DATA } from "../mock-data";
import type { Staff, StaffRole, DutyStatus } from "../types";
import {
  DataTableProvider,
  useDataTableContext,
  DataTable,
  DataTableColumnHeader,
  DataTableEmptyState,
} from "@/components/data-table";
import { CopyWrapper } from "@/components/copy-wrapper";
import { cn } from "@pharos-one/ui/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@pharos-one/ui/components/select";

export interface StaffDirectoryProps {
  onSelectStaff: (staff: Staff) => void;
}

const STORAGE_KEY = "staff-directory-page-size";

// Avatar colors for grid view
const avatarColors = [
  ["#EFF6FC", "#0078D4"],
  ["#DFF6DD", "#0F7B0F"],
  ["#FFF4CE", "#835400"],
  ["#FFF0EE", "#C42B1C"],
  ["#F4EBFF", "#7B61FF"],
];

// Avatar component for grid view
function Avatar({ staff, size = 36 }: { staff: Staff; size?: number }) {
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
      {staff.name
        .split(" ")
        .map((n) => n[0])
        .join("")}
    </div>
  );
}

// Status badge component matching inventory style
function StatusBadge({ status }: { status: DutyStatus }) {
  const config = {
    "On Duty": {
      className: "bg-green-50 text-green-700 border-green-200",
      label: "On Duty",
    },
    "On Break": {
      className: "bg-yellow-50 text-yellow-800 border-yellow-200",
      label: "On Break",
    },
    "Off Duty": {
      className: "bg-gray-50 text-gray-600 border-gray-200",
      label: "Off Duty",
    },
  };

  const { className, label } = config[status];

  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded-[3px] font-medium border ${className}`}
    >
      {label}
    </span>
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

// Credential icon component
function CredIcon({ status }: { status: string }) {
  if (status === "valid")
    return <CheckCircle className="w-[13px] h-[13px] text-green-700" />;
  if (status === "expiring")
    return <AlertTriangle className="w-[13px] h-[13px] text-yellow-800" />;
  if (status === "critical")
    return <AlertTriangle className="w-[13px] h-[13px] text-red-700" />;
  return <XCircle className="w-[13px] h-[13px] text-gray-400" />;
}

function ScoreBar({ score }: { score: number }) {
  const colorClass =
    score >= 90
      ? "text-green-700"
      : score >= 70
        ? "text-yellow-700"
        : "text-red-700";
  const bgClass =
    score >= 90 ? "bg-green-700" : score >= 70 ? "bg-yellow-600" : "bg-red-700";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${bgClass} rounded-full`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span
        className={`text-[11px] font-semibold ${colorClass} min-w-[22px] text-right`}
      >
        {score}
      </span>
    </div>
  );
}

/**
 * Staff directory with TanStack Table
 */
export function StaffDirectory({ onSelectStaff }: StaffDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<StaffRole | "All">("All");
  const [statusFilter, setStatusFilter] = useState<DutyStatus | "All">("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return STAFF_DATA.filter((staff) => {
      const matchesSearch = staff.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "All" || staff.role === roleFilter;
      const matchesStatus =
        statusFilter === "All" || staff.dutyStatus === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchQuery, roleFilter, statusFilter]);

  // Define columns matching inventory style
  const columns = useMemo<ColumnDef<Staff>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Member" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar staff={row.original} size={30} />
            <div>
              <CopyWrapper value={row.original.name} size="xs">
                <span className="text-xs font-semibold text-foreground">
                  {row.original.name}
                </span>
              </CopyWrapper>
              <div className="text-[10px] text-muted-foreground">
                {row.original.email}
              </div>
            </div>
          </div>
        ),
        size: undefined, // auto width
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ getValue }) => (
          <span className="text-[11px] px-1.5 py-0.5 rounded-[3px] bg-muted text-muted-foreground border border-border">
            {getValue() as string}
          </span>
        ),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        enableColumnFilter: true,
        size: 110,
      },
      {
        accessorKey: "dutyStatus",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => <StatusBadge status={row.original.dutyStatus} />,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        enableColumnFilter: true,
        size: 100,
      },
      {
        accessorKey: "hoursThisWeek",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Hrs/Wk" />
        ),
        cell: ({ getValue }) => (
          <span className="text-xs font-bold text-foreground">
            {getValue() as number}
            <span className="text-[10px] font-normal text-muted-foreground">
              h
            </span>
          </span>
        ),
        size: 70,
      },
      {
        accessorKey: "credentials",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Credentials" />
        ),
        cell: ({ row }) => {
          const credentials = row.original.credentials || [];
          if (credentials.length === 0)
            return <span className="text-[10px] text-muted-foreground">—</span>;

          // Find worst credential status
          const statusOrder = {
            expired: 0,
            critical: 1,
            expiring: 2,
            valid: 3,
          };
          const worst = credentials.reduce((w, c) => {
            return (statusOrder[c.status as keyof typeof statusOrder] || 3) <
              (statusOrder[w.status as keyof typeof statusOrder] || 3)
              ? c
              : w;
          }, credentials[0]);

          return (
            <div className="flex items-center gap-1">
              <CredIcon status={worst.status} />
              <CredBadge status={worst.status} daysLeft={worst.daysLeft} />
              {credentials.length > 1 && (
                <span className="text-[10px] text-muted-foreground">
                  +{credentials.length - 1}
                </span>
              )}
            </div>
          );
        },
        size: 120,
      },
      {
        accessorKey: "complianceScore",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Compliance" />
        ),
        cell: ({ row }) => <ScoreBar score={row.original.complianceScore} />,
        size: 140,
      },
      {
        id: "actions",
        header: () => <span />,
        cell: ({ row }) => (
          <div className="flex gap-0.5 justify-end">
            <button
              title="View Details"
              className="w-6 h-6 flex items-center justify-center rounded border border-transparent transition-colors text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/20"
              onClick={(e) => {
                e.stopPropagation();
                console.log("View staff:", row.original.id);
              }}
            >
              <Eye className="w-3 h-3" />
            </button>
            <button
              title="More Options"
              className="w-6 h-6 flex items-center justify-center rounded border border-transparent transition-colors text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/20"
              onClick={(e) => {
                e.stopPropagation();
                console.log("More options for staff:", row.original.id);
              }}
            >
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </div>
        ),
        size: 52,
      },
    ],
    [],
  );

  return (
    <DataTableProvider<Staff, string>
      columns={columns}
      data={filteredData}
      persistenceKey={STORAGE_KEY}
      getRowId={(staff) => staff.id}
      onRowDoubleClick={(staffId) => {
        const staff = STAFF_DATA.find((s) => s.id === staffId);
        if (staff) onSelectStaff(staff);
      }}
    >
      <StaffDirectoryContent
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        filteredCount={filteredData.length}
      />
    </DataTableProvider>
  );
}

/**
 * Staff directory content that uses DataTableContext
 */
function StaffDirectoryContent({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
  filteredCount,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  roleFilter: StaffRole | "All";
  setRoleFilter: (value: StaffRole | "All") => void;
  statusFilter: DutyStatus | "All";
  setStatusFilter: (value: DutyStatus | "All") => void;
  viewMode: "list" | "grid";
  setViewMode: (value: "list" | "grid") => void;
  filteredCount: number;
}) {
  const {
    selectedRowIds,
    focusedRowId,
    handleRowClick,
    handleRowDoubleClick,
    table,
  } = useDataTableContext<Staff, string>();

  const hasData = table.getFilteredRowModel().rows.length > 0;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Toolbar matching credentials style */}
      <div className="h-10 px-5 flex items-center gap-2 shrink-0 border-b border-border bg-card">
        {/* Search */}
        <div className="relative flex items-center">
          <Search size={13} className="absolute left-2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 pl-7 pr-2.5 bg-muted border border-border rounded text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-border transition-colors w-40"
          />
        </div>

        {/* Role filter */}
        <Select
          value={roleFilter}
          onValueChange={(value) => setRoleFilter(value as StaffRole | "All")}
        >
          <SelectTrigger className="h-7 w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="bottom" align="start" position="popper">
            <SelectItem value="All">All Roles</SelectItem>
            {(["Pharmacist", "Technician", "Manager"] as const).map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as DutyStatus | "All")
          }
        >
          <SelectTrigger className="h-7 w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="bottom" align="start" position="popper">
            <SelectItem value="All">All Statuses</SelectItem>
            {(["On Duty", "On Break", "Off Duty"] as const).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Staff count badge */}
        <span className="px-2 py-0.5 bg-muted border border-border rounded-full text-[11px] text-muted-foreground">
          {filteredCount} shown
        </span>

        <div className="flex-1" />

        {/* View toggle */}
        <div className="flex bg-muted border border-border rounded p-0.5">
          {(["list", "grid"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`p-0.5 px-1.5 rounded transition-colors ${
                viewMode === v
                  ? "bg-card text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v === "list" ? (
                <AlignLeft className="w-3.5 h-3.5" />
              ) : (
                <Grid className="w-3.5 h-3.5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content area - Table or Grid */}
      <div className="flex-1 flex flex-col overflow-hidden p-4">
        {viewMode === "list" ? (
          <div
            className="flex-1 flex flex-col overflow-hidden bg-card rounded-lg"
            style={{
              boxShadow:
                "0 1px 3px rgba(0,0,0,.07), 0 0 0 1px rgba(0,0,0,0.07)",
            }}
          >
            {hasData ? (
              <DataTable<Staff>
                containerClassName="flex-1 overflow-auto custom-scrollbar"
                className="w-full border-collapse"
                renderRow={(row, idx) => {
                  const selected = selectedRowIds.has(row.original.id);
                  const focused = focusedRowId === row.original.id;
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
                            : "transparent",
                        boxShadow: focused
                          ? "inset 0 0 0 1.5px var(--primary)"
                          : "none",
                        borderLeft: selected
                          ? "2.5px solid var(--primary)"
                          : "2.5px solid transparent",
                      }}
                      onClick={(e) => handleRowClick(row.original.id, e)}
                      onDoubleClick={() =>
                        handleRowDoubleClick(row.original.id)
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
                          ).style.background = "transparent";
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
              <DataTableEmptyState
                hasFilters={table.getState().columnFilters.length > 0}
                onClearFilters={() => table.resetColumnFilters()}
              />
            )}
          </div>
        ) : (
          /* Grid view */
          <div className="flex-1 overflow-auto custom-scrollbar bg-card p-4">
            {hasData ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5">
                {table.getRowModel().rows.map((row) => {
                  const staff = row.original;
                  const selected = selectedRowIds.has(staff.id);
                  return (
                    <div
                      key={staff.id}
                      onClick={(e) => handleRowClick(staff.id, e)}
                      onDoubleClick={() => handleRowDoubleClick(staff.id)}
                      className={cn(
                        "bg-card rounded-lg p-3.5 cursor-pointer border-[1.5px] transition-all",
                        selected
                          ? "border-primary shadow-[0_4px_16px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.06)]"
                          : "border-transparent shadow-[0_1px_3px_rgba(0,0,0,0.07),0_0_0_1px_rgba(0,0,0,0.07)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.06)]",
                      )}
                    >
                      {/* Header: Avatar + Name + Role */}
                      <div className="flex items-center gap-2 mb-2.5">
                        <Avatar staff={staff} size={36} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-foreground truncate">
                            {staff.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {staff.role}
                          </div>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="mb-2">
                        <StatusBadge status={staff.dutyStatus} />
                      </div>

                      {/* Compliance score */}
                      <div>
                        <ScoreBar score={staff.complianceScore} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <DataTableEmptyState
                hasFilters={table.getState().columnFilters.length > 0}
                onClearFilters={() => table.resetColumnFilters()}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
