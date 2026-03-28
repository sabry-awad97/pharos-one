/**
 * StaffDirectory component
 * Searchable, filterable list of staff members using TanStack Table
 */

import { useMemo } from "react";
import { flexRender, type ColumnDef } from "@tanstack/react-table";
import { STAFF_DATA } from "../mock-data";
import type { Staff, StaffRole, DutyStatus } from "../types";
import {
  DataTableProvider,
  useDataTableContext,
  DataTablePagination,
  DataTable,
  DataTableColumnHeader,
  DataTableEmptyState,
  DataTableLoadingSkeleton,
} from "@/components/data-table";
import { CopyWrapper } from "@/components/copy-wrapper";

export interface StaffDirectoryProps {
  onSelectStaff: (staff: Staff) => void;
}

const STORAGE_KEY = "staff-directory-page-size";

// Duty status badge styles
const dutyStatusStyles: Record<
  DutyStatus,
  { bg: string; text: string; dot: string }
> = {
  "On Duty": { bg: "#DFF6DD", text: "#0F7B0F", dot: "#0F7B0F" },
  "On Break": { bg: "#FFF4CE", text: "#835400", dot: "#9D5D00" },
  "Off Duty": { bg: "#F5F5F5", text: "#616161", dot: "#ABABAB" },
};

// Status dot color mapping
const statusDotClass: Record<DutyStatus, string> = {
  "On Duty": "bg-green-700",
  "On Break": "bg-yellow-600",
  "Off Duty": "bg-gray-400",
};

function StatusBadge({ status }: { status: DutyStatus }) {
  const s = dutyStatusStyles[status];
  return (
    <span
      style={{
        background: s.bg,
        color: s.text,
        borderRadius: 100,
        padding: "2px 9px",
        fontSize: 11,
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          position: "relative",
          width: 6,
          height: 6,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {status === "On Duty" && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: s.dot,
              opacity: 0.5,
            }}
          />
        )}
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: s.dot,
            position: "relative",
            zIndex: 1,
          }}
        />
      </span>
      {status}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? "#0F7B0F" : score >= 70 ? "#9D5D00" : "#C42B1C";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div
        style={{
          flex: 1,
          height: 4,
          background: "#F5F5F5",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: color,
            borderRadius: 99,
          }}
        />
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color,
          minWidth: 22,
          textAlign: "right",
        }}
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
  // Define columns
  const columns = useMemo<ColumnDef<Staff>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Member" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span
              className={`w-[7px] h-[7px] rounded-full shrink-0 ${statusDotClass[row.original.dutyStatus]}`}
            />
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
          <span className="text-[10px] px-1.5 py-0.5 rounded-[3px] bg-muted text-muted-foreground border border-border">
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
        size: 120,
      },
      {
        accessorKey: "hoursThisWeek",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Hrs/Wk" />
        ),
        cell: ({ getValue }) => (
          <span className="text-xs font-semibold">
            {getValue() as number}
            <span className="text-[10px] font-normal text-muted-foreground">
              h
            </span>
          </span>
        ),
        size: 80,
      },
      {
        accessorKey: "complianceScore",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Compliance" />
        ),
        cell: ({ row }) => <ScoreBar score={row.original.complianceScore} />,
        size: 140,
      },
    ],
    [],
  );

  return (
    <DataTableProvider
      columns={columns}
      data={STAFF_DATA}
      persistenceKey={STORAGE_KEY}
      getRowId={(staff) => staff.id}
      onRowDoubleClick={(staffId) => {
        const staff = STAFF_DATA.find((s) => s.id === staffId);
        if (staff) onSelectStaff(staff);
      }}
    >
      <StaffDirectoryContent onSelectStaff={onSelectStaff} />
    </DataTableProvider>
  );
}

/**
 * Staff directory content that uses DataTableContext
 */
function StaffDirectoryContent({
  onSelectStaff,
}: {
  onSelectStaff: (staff: Staff) => void;
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
      {/* Table content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable table area */}
        {hasData ? (
          <DataTable<Staff>
            containerClassName="flex-1 overflow-auto custom-scrollbar bg-card"
            className="w-full border-collapse"
            style={{
              boxShadow: "0 1px 3px rgba(0,0,0,.06)",
            }}
            renderRow={(row, idx) => {
              const selected = selectedRowIds.has(row.original.id);
              const focused = focusedRowId === row.original.id;
              return (
                <tr
                  key={row.id}
                  data-selected={selected ? "true" : undefined}
                  data-focused={focused ? "true" : undefined}
                  className="border-b transition-[background]"
                  style={{
                    borderBottomColor: focused ? "transparent" : "#ebebeb",
                    background: focused
                      ? "oklch(from var(--primary) l c h / 0.07)"
                      : selected
                        ? "oklch(from var(--primary) l c h / 0.05)"
                        : idx % 2 === 1
                          ? "#f9f9f9"
                          : "#ffffff",
                    boxShadow: focused
                      ? "inset 0 0 0 1.5px var(--primary)"
                      : "none",
                  }}
                  onClick={(e) => handleRowClick(row.original.id, e)}
                  onDoubleClick={() => handleRowDoubleClick(row.original.id)}
                  onMouseEnter={(e) => {
                    if (!focused) {
                      (
                        e.currentTarget as HTMLTableRowElement
                      ).style.background = "#f0f6ff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background =
                      focused
                        ? "oklch(from var(--primary) l c h / 0.07)"
                        : selected
                          ? "oklch(from var(--primary) l c h / 0.05)"
                          : idx % 2 === 1
                            ? "#f9f9f9"
                            : "#ffffff";
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="whitespace-nowrap"
                      style={{
                        padding: "var(--density-padding)",
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

        {/* Pagination controls */}
        <DataTablePagination isLoading={false} />
      </div>
    </div>
  );
}
