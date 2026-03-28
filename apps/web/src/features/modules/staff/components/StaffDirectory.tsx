/**
 * StaffDirectory component
 * Searchable, filterable list/grid of staff members
 */

import { useState, useMemo } from "react";
import { Search, Grid, AlignLeft } from "lucide-react";
import { STAFF_DATA } from "../mock-data";
import type { Staff, StaffRole, DutyStatus } from "../types";

export interface StaffDirectoryProps {
  onSelectStaff: (staff: Staff) => void;
}

// Avatar colors from mockup
const avatarColors = [
  ["#EFF6FC", "#0078D4"],
  ["#DFF6DD", "#0F7B0F"],
  ["#FFF4CE", "#835400"],
  ["#FFF0EE", "#C42B1C"],
  ["#F4EBFF", "#7B61FF"],
];

// Duty status badge styles
const dutyStatusStyles: Record<
  DutyStatus,
  { bg: string; text: string; dot: string }
> = {
  "On Duty": { bg: "#DFF6DD", text: "#0F7B0F", dot: "#0F7B0F" },
  "On Break": { bg: "#FFF4CE", text: "#835400", dot: "#9D5D00" },
  "Off Duty": { bg: "#F5F5F5", text: "#616161", dot: "#ABABAB" },
};

function Avatar({ staff, size = 32 }: { staff: Staff; size?: number }) {
  const [bg, fg] = avatarColors[parseInt(staff.id) % avatarColors.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: fg,
        fontSize: size * 0.36,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        letterSpacing: 0.3,
      }}
    >
      {staff.initials}
    </div>
  );
}

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
 * Staff directory with search, filters, and list/grid toggle
 */
export function StaffDirectory({ onSelectStaff }: StaffDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<StaffRole | "All">("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filteredStaff = useMemo(() => {
    return STAFF_DATA.filter((staff) => {
      const matchesSearch = staff.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "All" || staff.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, roleFilter]);

  return (
    <div
      style={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: "10px 20px",
          background: "#FFFFFF",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        {/* Search */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search
            size={13}
            color="#616161"
            style={{ position: "absolute", left: 8 }}
          />
          <input
            type="text"
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: 28,
              paddingRight: 10,
              height: 28,
              background: "#F5F5F5",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 6,
              fontSize: 12,
              color: "#1A1A1A",
              width: 160,
              outline: "none",
            }}
          />
        </div>

        {/* Role filter chips */}
        {(["All", "Pharmacist", "Technician", "Manager"] as const).map(
          (role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              style={{
                padding: "3px 10px",
                borderRadius: 100,
                fontSize: 11,
                fontWeight: roleFilter === role ? 700 : 500,
                color: roleFilter === role ? "#0078D4" : "#616161",
                background: roleFilter === role ? "#EFF6FC" : "transparent",
                border: `1px solid ${roleFilter === role ? "#C7E2F5" : "rgba(0,0,0,0.12)"}`,
                cursor: "pointer",
              }}
            >
              {role}
            </button>
          ),
        )}

        {/* Staff count */}
        <span
          style={{
            padding: "2px 8px",
            background: "#F5F5F5",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 100,
            fontSize: 11,
            color: "#616161",
          }}
        >
          {filteredStaff.length} staff members
        </span>

        {/* View toggle */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            background: "#F5F5F5",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 6,
            padding: 2,
          }}
        >
          {(["list", "grid"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              style={{
                padding: "3px 6px",
                borderRadius: 4,
                background: viewMode === v ? "#FFFFFF" : "transparent",
                border: "none",
                cursor: "pointer",
                color: viewMode === v ? "#0078D4" : "#616161",
                display: "flex",
                alignItems: "center",
              }}
            >
              {v === "list" ? <AlignLeft size={13} /> : <Grid size={13} />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        style={{ flex: 1, overflow: "auto", padding: 16 }}
        className="custom-scrollbar"
      >
        {viewMode === "list" ? (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 8,
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.07)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2.2fr 1fr 1fr 0.7fr 1.4fr",
                padding: "7px 14px",
                background: "#F5F5F5",
                borderBottom: "1px solid rgba(0,0,0,0.12)",
                fontSize: 10,
                fontWeight: 700,
                color: "#616161",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              <span>Member</span>
              <span>Role</span>
              <span>Status</span>
              <span>Hrs/Wk</span>
              <span>Compliance</span>
            </div>
            {/* Rows */}
            {filteredStaff.map((staff, i) => (
              <div
                key={staff.id}
                onClick={() => onSelectStaff(staff)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.2fr 1fr 1fr 0.7fr 1.4fr",
                  padding: "10px 14px",
                  borderBottom:
                    i < filteredStaff.length - 1
                      ? "1px solid rgba(0,0,0,0.08)"
                      : "none",
                  cursor: "pointer",
                  alignItems: "center",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F0F6FF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <Avatar staff={staff} size={30} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>
                      {staff.name}
                    </div>
                    <div style={{ fontSize: 10, color: "#616161" }}>
                      {staff.email}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: "#616161",
                    background: "#F5F5F5",
                    padding: "2px 7px",
                    borderRadius: 4,
                  }}
                >
                  {staff.role}
                </span>
                <StatusBadge status={staff.dutyStatus} />
                <span style={{ fontSize: 12, fontWeight: 700 }}>
                  {staff.hoursThisWeek}
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 400,
                      color: "#616161",
                    }}
                  >
                    h
                  </span>
                </span>
                <ScoreBar score={staff.complianceScore} />
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 10,
            }}
          >
            {filteredStaff.map((staff) => (
              <div
                key={staff.id}
                onClick={() => onSelectStaff(staff)}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 8,
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.07)",
                  padding: 14,
                  cursor: "pointer",
                  border: "1.5px solid transparent",
                  transition: "box-shadow 0.1s, border-color 0.1s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.07)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <Avatar staff={staff} size={36} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>
                      {staff.name}
                    </div>
                    <div style={{ fontSize: 10, color: "#616161" }}>
                      {staff.role}
                    </div>
                  </div>
                </div>
                <StatusBadge status={staff.dutyStatus} />
                <div style={{ marginTop: 8 }}>
                  <ScoreBar score={staff.complianceScore} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
