/**
 * ModuleWorkspace component
 * Reusable wrapper for module content with header, table, and annotation callouts
 * Matches PharmacyTabs.tsx WorkspaceContent component structure
 */

import { Hash, Filter, Download, RefreshCw } from "lucide-react";
import { AnnotationCallouts } from "./AnnotationCallouts";

// Color constants matching old implementation
const W = {
  bg: "#f3f3f3",
  surface: "#ffffff",
  surfaceAlt: "#f9f9f9",
  surfaceHov: "#f0f0f0",
  border: "#e0e0e0",
  borderLight: "#ebebeb",
  text: "#1a1a1a",
  textSub: "#616161",
  textMuted: "#919191",
  success: "#107c10",
  danger: "#a4262c",
  warn: "#7a5e00",
};

export interface ModuleWorkspaceProps {
  /** Module label */
  label: string;
  /** Module accent color */
  color: string;
  /** Table column headers */
  columns: string[];
  /** Table data rows */
  data: string[][];
  /** Whether this is in split view (hides annotation callouts) */
  split?: boolean;
  /** Custom cell renderer for special formatting */
  renderCell?: (
    cell: string,
    rowIndex: number,
    colIndex: number,
  ) => React.ReactNode;
}

/**
 * Reusable module workspace with table layout
 * Exact match to PharmacyTabs.tsx WorkspaceContent component
 */
export function ModuleWorkspace({
  label,
  color,
  columns,
  data,
  split = false,
  renderCell,
}: ModuleWorkspaceProps) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: W.bg,
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Module header */}
      <div
        style={{
          padding: "10px 16px 8px",
          borderBottom: `1px solid ${W.border}`,
          background: W.surface,
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: color + "20",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Hash style={{ width: 14, height: 14, color: color }} />
        </div>
        <div>
          <p
            style={{ margin: 0, fontSize: 13, fontWeight: 600, color: W.text }}
          >
            {label}
          </p>
          <p style={{ margin: 0, fontSize: 10, color: W.textMuted }}>
            Last updated: just now
          </p>
        </div>
        <div style={{ flex: 1 }} />
        {!split && (
          <div style={{ display: "flex", gap: 4 }}>
            {[Filter, Download, RefreshCw].map((Icon, i) => (
              <button
                key={i}
                style={{
                  width: 26,
                  height: 26,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${W.border}`,
                  borderRadius: 4,
                  background: W.surface,
                  cursor: "pointer",
                  color: W.textSub,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    W.surfaceHov;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    W.surface;
                }}
              >
                <Icon style={{ width: 12, height: 12 }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Data table */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: W.surface,
            borderRadius: 6,
            overflow: "hidden",
            boxShadow: `0 1px 3px rgba(0,0,0,.06)`,
            border: `1px solid ${W.border}`,
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f5f5f5",
                borderBottom: `1px solid ${W.border}`,
              }}
            >
              {columns.map((c) => (
                <th
                  key={c}
                  style={{
                    textAlign: "left",
                    padding: "7px 12px",
                    fontSize: 10,
                    fontWeight: 600,
                    color: W.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: `1px solid ${W.borderLight}`,
                  background: i % 2 === 1 ? W.surfaceAlt : W.surface,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLTableRowElement).style.background =
                    "#f0f6ff")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLTableRowElement).style.background =
                    i % 2 === 1 ? W.surfaceAlt : W.surface)
                }
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    style={{
                      padding: "6px 12px",
                      fontSize: 12,
                      color: j === 0 ? W.text : W.textSub,
                      fontWeight: j === 0 ? 500 : 400,
                    }}
                  >
                    {renderCell ? renderCell(cell, i, j) : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Annotation callouts - only shown when not in split view */}
        {!split && <AnnotationCallouts />}
      </div>
    </div>
  );
}
