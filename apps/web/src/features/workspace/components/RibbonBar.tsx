/**
 * RibbonBar component
 * Displays active tab info, module actions, search, notifications, and user profile
 * Matches PharmacyTabs.tsx ribbon bar (lines 1100-1320)
 */

import { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  RefreshCw,
  Download,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Save,
  Printer,
  Check,
} from "lucide-react";

// Color constants matching old implementation
const W = {
  surface: "#ffffff",
  surfaceAlt: "#f9f9f9",
  surfaceHov: "#f0f0f0",
  border: "#e0e0e0",
  accent: "#0078d4",
  accentLight: "#cce4f7",
  text: "#1a1a1a",
  textSub: "#616161",
  textMuted: "#919191",
};

interface RibbonBarProps {
  activeTabLabel?: string;
  activeTabIcon?: React.ElementType;
  activeTabColor?: string;
  activeTabUnsaved?: boolean;
  activeTabPinned?: boolean;
  moduleId?: string;
}

// Module-specific actions matching old implementation
function getModuleActions(module: string) {
  const map: Record<string, { icon: React.ElementType; label: string }[]> = {
    dashboard: [
      { icon: RefreshCw, label: "Refresh" },
      { icon: Download, label: "Export" },
      { icon: Filter, label: "Filter" },
    ],
    inventory: [
      { icon: Plus, label: "Add Drug" },
      { icon: Edit2, label: "Edit" },
      { icon: Trash2, label: "Delete" },
      { icon: Download, label: "Export" },
    ],
    pos: [
      { icon: Plus, label: "Add Item" },
      { icon: Save, label: "Hold" },
      { icon: Printer, label: "Print" },
      { icon: Check, label: "Checkout" },
    ],
    reports: [
      { icon: Filter, label: "Filter" },
      { icon: Download, label: "Export" },
      { icon: Printer, label: "Print" },
    ],
    purchases: [
      { icon: Plus, label: "New Order" },
      { icon: Edit2, label: "Edit" },
      { icon: Printer, label: "Print" },
    ],
    customers: [
      { icon: Plus, label: "Add Customer" },
      { icon: Filter, label: "Filter" },
      { icon: Download, label: "Export" },
    ],
  };
  return map[module] ?? map.dashboard;
}

/**
 * Ribbon bar with active tab info, actions, search, notifications, and user profile
 * Exact match to PharmacyTabs.tsx ribbon bar
 */
export function RibbonBar({
  activeTabLabel = "Dashboard",
  activeTabIcon: Icon,
  activeTabColor = "#0078d4",
  activeTabUnsaved = false,
  activeTabPinned = false,
  moduleId = "dashboard",
}: RibbonBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const actions = getModuleActions(moduleId);

  return (
    <div
      style={{
        height: 44,
        background: W.surface,
        borderBottom: `1px solid ${W.border}`,
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "0 12px",
        flexShrink: 0,
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Active tab info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          paddingRight: 12,
          borderRight: `1px solid ${W.border}`,
        }}
      >
        {Icon && (
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              background: activeTabColor + "20",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon style={{ width: 12, height: 12, color: activeTabColor }} />
          </div>
        )}
        <span style={{ fontSize: 12, fontWeight: 600, color: W.text }}>
          {activeTabLabel}
        </span>
        {activeTabUnsaved && (
          <span
            style={{
              fontSize: 10,
              color: W.accent,
              background: W.accentLight,
              padding: "1px 6px",
              borderRadius: 10,
              fontWeight: 500,
            }}
          >
            ● Unsaved
          </span>
        )}
        {activeTabPinned && (
          <span
            style={{
              fontSize: 10,
              color: "#b8860b",
              background: "#fff4ce",
              padding: "1px 6px",
              borderRadius: 10,
              fontWeight: 500,
            }}
          >
            📌 Pinned
          </span>
        )}
      </div>

      {/* Module actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {actions.map(({ icon: BIcon, label }) => (
          <button
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              height: 28,
              padding: "0 10px",
              borderRadius: 4,
              border: `1px solid transparent`,
              background: "transparent",
              color: W.textSub,
              fontSize: 12,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                W.surfaceHov;
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                W.border;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "transparent";
            }}
          >
            <BIcon style={{ width: 13, height: 13 }} />
            {label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Search input */}
      <div style={{ position: "relative" }}>
        <Search
          style={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 13,
            height: 13,
            color: W.textMuted,
          }}
        />
        <input
          placeholder="Search modules…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: 180,
            height: 28,
            paddingLeft: 28,
            fontSize: 11,
            border: `1px solid ${W.border}`,
            borderRadius: 4,
            background: W.surfaceAlt,
            color: W.text,
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = W.accent)}
          onBlur={(e) => (e.target.style.borderColor = W.border)}
        />
      </div>

      {/* Notification bell */}
      <button
        style={{
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          borderRadius: 4,
          background: "transparent",
          cursor: "pointer",
          color: W.textMuted,
          position: "relative",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background =
            W.surfaceHov)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background =
            "transparent")
        }
      >
        <Bell style={{ width: 15, height: 15 }} />
        <span
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            width: 7,
            height: 7,
            background: "#c42b1c",
            borderRadius: "50%",
            border: "1.5px solid white",
          }}
        />
      </button>

      {/* User profile */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          cursor: "pointer",
          padding: "2px 8px",
          borderRadius: 4,
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLDivElement).style.background = W.surfaceHov)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLDivElement).style.background = "transparent")
        }
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#0078d4,#6b69d6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            fontWeight: 700,
            color: "white",
          }}
        >
          RK
        </div>
        <span style={{ fontSize: 11, color: W.textSub }}>Dr. Ravi K.</span>
        <ChevronDown style={{ width: 12, height: 12, color: W.textMuted }} />
      </div>
    </div>
  );
}
