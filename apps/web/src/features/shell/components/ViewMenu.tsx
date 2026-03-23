/**
 * ViewMenu component
 * Dropdown menu for View operations (panel visibility toggles)
 */

import { useState } from "react";
import { Sidebar, BarChart3, Wrench } from "lucide-react";

interface ViewMenuProps {
  onClose: () => void;
  onToggleSidebar?: () => void;
  onToggleStatusBar?: () => void;
  onToggleToolbar?: () => void;
}

interface MenuItemProps {
  icon: any;
  label: string;
  kbd?: string;
  onClick?: () => void;
}

function MenuItem({ icon: Icon, label, kbd, onClick }: MenuItemProps) {
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
        background: hov ? "#f0f0f0" : "transparent",
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
            color: "#616161",
          }}
        />
      </div>
      <span
        style={{
          flex: 1,
          fontSize: 12,
          color: "#1a1a1a",
          fontWeight: 400,
        }}
      >
        {label}
      </span>
      {kbd && <span style={{ fontSize: 10, color: "#919191" }}>{kbd}</span>}
    </div>
  );
}

export function ViewMenu({
  onClose,
  onToggleSidebar,
  onToggleStatusBar,
  onToggleToolbar,
}: ViewMenuProps) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        width: 240,
        background: "#ffffff",
        border: "1px solid #d1d1d1",
        boxShadow: "0 4px 16px rgba(0,0,0,.14), 0 1px 4px rgba(0,0,0,.1)",
        zIndex: 20,
        borderRadius: "0 0 6px 6px",
        overflow: "visible",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Menu items */}
      <div style={{ padding: "4px 0" }}>
        <MenuItem
          icon={Sidebar}
          label="Toggle Sidebar"
          kbd="Ctrl+B"
          onClick={() => {
            onToggleSidebar?.();
            onClose();
          }}
        />
        <MenuItem
          icon={BarChart3}
          label="Toggle Status Bar"
          onClick={() => {
            onToggleStatusBar?.();
            onClose();
          }}
        />
        <MenuItem
          icon={Wrench}
          label="Toggle Toolbar"
          onClick={() => {
            onToggleToolbar?.();
            onClose();
          }}
        />
      </div>
    </div>
  );
}
