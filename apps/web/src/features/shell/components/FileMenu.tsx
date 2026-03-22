/**
 * FileMenu component
 * Dropdown menu for File operations
 */

import { useState } from "react";
import {
  Plus,
  FolderOpen,
  Clock,
  Pin,
  Copy,
  SplitSquareHorizontal,
  Save,
  Download,
  Printer,
  X,
  LogOut,
  Pill,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

interface FileMenuProps {
  onClose: () => void;
  onNewWorkspace?: () => void;
  onPinActiveTab?: () => void;
  onDuplicateTab?: () => void;
  onSplitView?: () => void;
  onCloseTab?: () => void;
}

interface MenuItemProps {
  icon: any;
  label: string;
  kbd?: string;
  accent?: boolean;
  danger?: boolean;
  arrow?: boolean;
  onClick?: () => void;
}

function MenuItem({
  icon: Icon,
  label,
  kbd,
  accent,
  danger,
  arrow,
  onClick,
}: MenuItemProps) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 12px",
        cursor: "pointer",
        background: hov
          ? danger
            ? "#fde7e9"
            : accent
              ? "#cce4f7"
              : "#f0f0f0"
          : "transparent",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon
          style={{
            width: 14,
            height: 14,
            color: danger ? "#a4262c" : accent ? "#0078d4" : "#616161",
          }}
        />
      </div>
      <span
        style={{
          flex: 1,
          fontSize: 12,
          color: danger ? "#a4262c" : accent ? "#0078d4" : "#1a1a1a",
          fontWeight: accent ? 500 : 400,
        }}
      >
        {label}
      </span>
      {kbd && <span style={{ fontSize: 10, color: "#919191" }}>{kbd}</span>}
      {arrow && (
        <ChevronRight
          className="w-[11px] h-[11px]"
          style={{ color: "#919191" }}
        />
      )}
    </div>
  );
}

function MenuDivider() {
  return <div style={{ height: 1, background: "#ebebeb", margin: "3px 0" }} />;
}

export function FileMenu({
  onClose,
  onNewWorkspace,
  onPinActiveTab,
  onDuplicateTab,
  onSplitView,
  onCloseTab,
}: FileMenuProps) {
  const [recentOpen, setRecentOpen] = useState(false);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        width: 280,
        background: "#ffffff",
        border: "1px solid #d1d1d1",
        boxShadow: "0 4px 16px rgba(0,0,0,.14), 0 1px 4px rgba(0,0,0,.1)",
        zIndex: 20,
        borderRadius: "0 0 6px 6px",
        overflow: "visible",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* App header stripe */}
      <div
        style={{
          background: "#0078d4",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "rgba(255,255,255,.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pill className="w-4 h-4 text-white" />
        </div>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 700,
              color: "white",
            }}
          >
            PharmOS
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              color: "rgba(255,255,255,.75)",
            }}
          >
            Pharmacy Management Suite v2.4
          </p>
        </div>
      </div>

      {/* Menu items */}
      <div style={{ padding: "4px 0" }}>
        <MenuItem
          icon={Plus}
          label="New Workspace"
          kbd="Ctrl+T"
          accent
          onClick={() => {
            onNewWorkspace?.();
            onClose();
          }}
        />
        <MenuItem
          icon={FolderOpen}
          label="Open Workspace…"
          kbd="Ctrl+O"
          onClick={onClose}
        />
        <MenuDivider />

        {/* Recent Workspaces with submenu */}
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setRecentOpen(true)}
          onMouseLeave={() => setRecentOpen(false)}
        >
          <MenuItem icon={Clock} label="Recent Workspaces" arrow />
          {recentOpen && (
            <div
              style={{
                position: "absolute",
                left: "100%",
                top: 0,
                width: 260,
                background: "#ffffff",
                border: "1px solid #d1d1d1",
                boxShadow:
                  "0 4px 16px rgba(0,0,0,.14), 0 1px 4px rgba(0,0,0,.1)",
                borderRadius: 6,
                padding: "4px 0",
                zIndex: 30,
              }}
            >
              <div
                style={{
                  padding: "4px 12px 6px",
                  borderBottom: "1px solid #ebebeb",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: "#919191",
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    fontWeight: 600,
                  }}
                >
                  Recently Opened
                </span>
              </div>
              <div
                style={{
                  borderTop: "1px solid #ebebeb",
                  padding: "5px 12px",
                }}
              >
                <button
                  onClick={onClose}
                  style={{
                    fontSize: 11,
                    color: "#0078d4",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  View all workspaces →
                </button>
              </div>
            </div>
          )}
        </div>

        <MenuDivider />
        <MenuItem
          icon={Pin}
          label="Pin Active Tab"
          kbd="Ctrl+P"
          onClick={() => {
            onPinActiveTab?.();
            onClose();
          }}
        />
        <MenuItem
          icon={Copy}
          label="Duplicate Tab"
          kbd="Ctrl+D"
          onClick={() => {
            onDuplicateTab?.();
            onClose();
          }}
        />
        <MenuItem
          icon={SplitSquareHorizontal}
          label="Split View"
          kbd="Ctrl+\\"
          onClick={() => {
            onSplitView?.();
            onClose();
          }}
        />
        <MenuDivider />
        <MenuItem
          icon={Save}
          label="Save Session"
          kbd="Ctrl+S"
          onClick={onClose}
        />
        <MenuItem icon={Download} label="Export Workspace" onClick={onClose} />
        <MenuItem icon={Printer} label="Print" kbd="Ctrl+P" onClick={onClose} />
        <MenuDivider />
        <MenuItem
          icon={X}
          label="Close Tab"
          kbd="Ctrl+W"
          danger
          onClick={() => {
            onCloseTab?.();
            onClose();
          }}
        />
        <MenuItem
          icon={LogOut}
          label="Exit PharmOS"
          kbd="Alt+F4"
          danger
          onClick={onClose}
        />
      </div>
    </div>
  );
}
