/**
 * TabContextMenu component
 * Right-click context menu for tab operations
 */

import { useState, useEffect, useRef } from "react";
import {
  Pin,
  PinOff,
  Copy,
  X,
  Layers,
  ChevronRight,
  SplitSquareHorizontal,
} from "lucide-react";

export interface TabContextMenuProps {
  /** Tab ID this menu is for */
  tabId: string;
  /** Whether the tab is pinned */
  isPinned: boolean;
  /** X coordinate for menu positioning */
  x: number;
  /** Y coordinate for menu positioning */
  y: number;
  /** Handler for pin toggle */
  onPin: () => void;
  /** Handler for duplicate */
  onDuplicate: () => void;
  /** Handler for close */
  onClose: () => void;
  /** Handler for closing the menu */
  onDismiss: () => void;
  /** Optional: Handler for split view */
  onSplitView?: () => void;
  /** Optional: Handler for close other tabs */
  onCloseOthers?: () => void;
  /** Optional: Handler for close tabs to right */
  onCloseToRight?: () => void;
  /** Optional: Tab label for header */
  tabLabel?: string;
  /** Optional: Tab icon for header */
  tabIcon?: any;
  /** Optional: Tab color for header */
  tabColor?: string;
}

interface MenuItemProps {
  icon: any;
  label: string;
  kbd?: string;
  danger?: boolean;
  onClick: () => void;
}

function MenuItem({ icon: Icon, label, kbd, danger, onClick }: MenuItemProps) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 12px",
        cursor: "pointer",
        background: hov ? (danger ? "#fde7e9" : "#f0f0f0") : "transparent",
      }}
    >
      <Icon
        style={{
          width: 13,
          height: 13,
          color: danger ? "#a4262c" : "#616161",
          flexShrink: 0,
        }}
      />
      <span
        style={{ flex: 1, fontSize: 12, color: danger ? "#a4262c" : "#1a1a1a" }}
      >
        {label}
      </span>
      {kbd && <span style={{ fontSize: 10, color: "#919191" }}>{kbd}</span>}
    </div>
  );
}

/**
 * Context menu for tab operations
 * Matches the old PharmacyTabs styling exactly
 */
export function TabContextMenu({
  isPinned,
  x,
  y,
  onPin,
  onDuplicate,
  onClose,
  onDismiss,
  onSplitView,
  onCloseOthers,
  onCloseToRight,
  tabLabel,
  tabIcon: TabIcon,
  tabColor,
}: TabContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onDismiss();
      }
    };

    // Add listener after a small delay to prevent immediate dismissal
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onDismiss]);

  return (
    <div
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: 220,
        background: "#ffffff",
        border: "1px solid #d1d1d1",
        boxShadow: "0 4px 16px rgba(0,0,0,.14), 0 1px 4px rgba(0,0,0,.1)",
        borderRadius: 6,
        padding: "4px 0",
        zIndex: 500,
      }}
    >
      {/* Tab header (if provided) */}
      {tabLabel && TabIcon && (
        <div
          style={{
            padding: "6px 12px 8px",
            borderBottom: "1px solid #ebebeb",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <TabIcon
            style={{ width: 14, height: 14, color: tabColor || "#0078d4" }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#1a1a1a",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {tabLabel}
          </span>
        </div>
      )}

      <MenuItem icon={Copy} label="Duplicate Tab" onClick={onDuplicate} />
      <MenuItem
        icon={isPinned ? PinOff : Pin}
        label={isPinned ? "Unpin Tab" : "Pin Tab"}
        onClick={onPin}
      />
      {onSplitView && (
        <MenuItem
          icon={SplitSquareHorizontal}
          label="Open in Split View"
          onClick={onSplitView}
        />
      )}

      <div
        style={{
          height: 1,
          background: "#ebebeb",
          margin: "3px 0",
        }}
      />

      <MenuItem
        icon={X}
        label="Close Tab"
        kbd="Ctrl+W"
        danger
        onClick={onClose}
      />
      {onCloseOthers && (
        <MenuItem
          icon={Layers}
          label="Close Other Tabs"
          danger
          onClick={onCloseOthers}
        />
      )}
      {onCloseToRight && (
        <MenuItem
          icon={ChevronRight}
          label="Close Tabs to Right"
          danger
          onClick={onCloseToRight}
        />
      )}
    </div>
  );
}
