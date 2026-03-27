/**
 * TabItem component
 * Individual tab rendering with visual feedback
 */

import { useState } from "react";
import { X, Pin } from "lucide-react";
import type { Tab } from "../types";
import styles from "./TabItem.module.css";

export interface TabItemProps {
  /** Tab data */
  tab: Tab;
  /** Whether this tab is active */
  active: boolean;
  /** Click handler */
  onClick: () => void;
  /** Close handler */
  onClose: (e: React.MouseEvent) => void;
  /** Context menu handler */
  onContextMenu?: (e: React.MouseEvent) => void;
  /** Tab index in the list (for aria-label) */
  index?: number;
  /** Total number of tabs (for aria-label) */
  totalTabs?: number;
  /** Keyboard navigation handler */
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

/**
 * Individual tab component
 * Matches the old PharmacyTabs styling exactly
 */
export function TabItem({
  tab,
  active,
  onClick,
  onClose,
  onContextMenu,
  index,
  totalTabs,
  onKeyDown,
}: TabItemProps) {
  const [hov, setHov] = useState(false);
  const Icon = tab.icon;
  const pinned = tab.pinned;

  // Build accessible label
  const ariaLabel = [
    tab.label,
    tab.unsaved ? "unsaved changes" : "",
    index !== undefined && totalTabs !== undefined
      ? `tab ${index + 1} of ${totalTabs}`
      : "",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <button
      role="tab"
      aria-selected={active}
      aria-controls={`tabpanel-${tab.id}`}
      aria-label={ariaLabel}
      tabIndex={active ? 0 : -1}
      className={styles.tabContainer}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={
        tab.label +
        (tab.unsaved ? " (unsaved)" : "") +
        (tab.pinned ? " (pinned)" : "")
      }
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        height: 36,
        width: pinned ? 40 : undefined,
        minWidth: pinned ? 40 : 120,
        maxWidth: pinned ? 40 : 180,
        padding: pinned ? "0 10px" : "0 10px",
        cursor: "pointer",
        flexShrink: 0,
        background: active ? "#ffffff" : hov ? "#f5f5f5" : "#ececec",
        borderTop: active
          ? `2px solid ${tab.color || "#0078d4"}`
          : "2px solid transparent",
        borderRight: "1px solid #e0e0e0",
        borderBottom: active ? "1px solid #ffffff" : "1px solid #e0e0e0",
        borderLeft: "none",
        marginBottom: active ? -1 : 0,
        gap: 6,
        overflow: "hidden",
        justifyContent: pinned ? "center" : "flex-start",
      }}
    >
      {/* Drag indicator */}
      {!pinned && hov && !active && (
        <div
          style={{
            position: "absolute",
            left: 3,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            opacity: 0.3,
          }}
        >
          <div
            style={{
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: "#919191",
            }}
          />
          <div
            style={{
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: "#919191",
            }}
          />
          <div
            style={{
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: "#919191",
            }}
          />
        </div>
      )}

      <Icon
        style={{
          width: 13,
          height: 13,
          color: active ? tab.color || "#0078d4" : "#616161",
          flexShrink: 0,
        }}
      />

      {!pinned && (
        <span
          style={{
            fontSize: 11,
            fontWeight: active ? 600 : 400,
            color: active ? "#1a1a1a" : "#616161",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {tab.label}
        </span>
      )}

      {/* Unsaved indicator */}
      {tab.unsaved && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#0078d4",
            flexShrink: 0,
          }}
          title="Unsaved changes"
        />
      )}

      {/* Pin badge */}
      {tab.pinned && !active && (
        <div style={{ position: "absolute", top: 4, right: 4 }}>
          <Pin style={{ width: 8, height: 8, color: "#919191" }} />
        </div>
      )}

      {/* Close button */}
      {!pinned && (
        <button
          className={styles.closeButton}
          onClick={onClose}
          style={{
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            borderRadius: 3,
            background: hov || active ? "rgba(0,0,0,.08)" : "transparent",
            cursor: "pointer",
            color: "#919191",
            flexShrink: 0,
            padding: 0,
            opacity: hov || active ? 1 : 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(196,43,28,.15)";
            (e.currentTarget as HTMLButtonElement).style.color = "#a4262c";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(0,0,0,.08)";
            (e.currentTarget as HTMLButtonElement).style.color = "#919191";
          }}
        >
          <X style={{ width: 10, height: 10 }} />
        </button>
      )}
    </button>
  );
}
