/**
 * ViewMenu component
 * Dropdown menu for View operations (panel visibility toggles, zoom controls, theme switcher)
 */

import { useState } from "react";
import {
  Sidebar,
  BarChart3,
  Wrench,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Palette,
  ChevronRight,
  Check,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";

interface ViewMenuProps {
  onClose: () => void;
  onToggleSidebar?: () => void;
  onToggleStatusBar?: () => void;
  onToggleToolbar?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

interface MenuItemProps {
  icon: any;
  label: string;
  kbd?: string;
  arrow?: boolean;
  onClick?: () => void;
}

function MenuItem({ icon: Icon, label, kbd, arrow, onClick }: MenuItemProps) {
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
      {arrow && (
        <ChevronRight
          className="w-[11px] h-[11px]"
          style={{ color: "#919191" }}
        />
      )}
    </div>
  );
}

export function ViewMenu({
  onClose,
  onToggleSidebar,
  onToggleStatusBar,
  onToggleToolbar,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: ViewMenuProps) {
  const [themeSubmenuOpen, setThemeSubmenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: 240,
        background: "#ffffff",
        border: "1px solid #d1d1d1",
        boxShadow: "0 4px 16px rgba(0,0,0,.14), 0 1px 4px rgba(0,0,0,.1)",
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
        <MenuDivider />
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setThemeSubmenuOpen(true)}
          onMouseLeave={() => setThemeSubmenuOpen(false)}
        >
          <MenuItem icon={Palette} label="Theme" arrow />
          {themeSubmenuOpen && (
            <div
              style={{
                position: "absolute",
                left: "100%",
                top: 0,
                width: 200,
                background: "#ffffff",
                border: "1px solid #d1d1d1",
                boxShadow:
                  "0 4px 16px rgba(0,0,0,.14), 0 1px 4px rgba(0,0,0,.1)",
                borderRadius: 6,
                padding: "4px 0",
                zIndex: 30,
              }}
            >
              <MenuItem
                icon={theme === "light" ? Check : Palette}
                label="Light"
                onClick={() => {
                  setTheme("light");
                  onClose();
                }}
              />
              <MenuItem
                icon={theme === "dark" ? Check : Palette}
                label="Dark"
                onClick={() => {
                  setTheme("dark");
                  onClose();
                }}
              />
              <MenuItem
                icon={theme === "system" ? Check : Palette}
                label="Auto (System)"
                onClick={() => {
                  setTheme("system");
                  onClose();
                }}
              />
            </div>
          )}
        </div>
        <MenuDivider />
        <MenuItem
          icon={ZoomIn}
          label="Zoom In"
          kbd="Ctrl++"
          onClick={() => {
            onZoomIn?.();
            onClose();
          }}
        />
        <MenuItem
          icon={ZoomOut}
          label="Zoom Out"
          kbd="Ctrl+-"
          onClick={() => {
            onZoomOut?.();
            onClose();
          }}
        />
        <MenuItem
          icon={Maximize2}
          label="Reset Zoom"
          kbd="Ctrl+0"
          onClick={() => {
            onResetZoom?.();
            onClose();
          }}
        />
      </div>
    </div>
  );
}

function MenuDivider() {
  return <div style={{ height: 1, background: "#ebebeb", margin: "3px 0" }} />;
}
