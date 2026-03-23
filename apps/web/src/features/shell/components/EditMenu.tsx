/**
 * EditMenu component
 * Dropdown menu for Edit operations
 */

import { useState } from "react";
import {
  Undo,
  Redo,
  Scissors,
  Copy,
  Clipboard,
  Search,
  Replace,
} from "lucide-react";

interface EditMenuProps {
  onClose: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onCut?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onFind?: () => void;
  onReplace?: () => void;
}

interface MenuItemProps {
  icon: any;
  label: string;
  kbd?: string;
  disabled?: boolean;
  onClick?: () => void;
}

function MenuItem({
  icon: Icon,
  label,
  kbd,
  disabled,
  onClick,
}: MenuItemProps) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 12px",
        cursor: disabled ? "default" : "pointer",
        background: hov && !disabled ? "#f0f0f0" : "transparent",
        opacity: disabled ? 0.4 : 1,
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

function MenuDivider() {
  return <div style={{ height: 1, background: "#ebebeb", margin: "3px 0" }} />;
}

export function EditMenu({
  onClose,
  onUndo,
  onRedo,
  onCut,
  onCopy,
  onPaste,
  onFind,
  onReplace,
}: EditMenuProps) {
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
          icon={Undo}
          label="Undo"
          kbd="Ctrl+Z"
          onClick={() => {
            onUndo?.();
            onClose();
          }}
        />
        <MenuItem
          icon={Redo}
          label="Redo"
          kbd="Ctrl+Y"
          onClick={() => {
            onRedo?.();
            onClose();
          }}
        />
        <MenuDivider />
        <MenuItem
          icon={Scissors}
          label="Cut"
          kbd="Ctrl+X"
          onClick={() => {
            onCut?.();
            onClose();
          }}
        />
        <MenuItem
          icon={Copy}
          label="Copy"
          kbd="Ctrl+C"
          onClick={() => {
            onCopy?.();
            onClose();
          }}
        />
        <MenuItem
          icon={Clipboard}
          label="Paste"
          kbd="Ctrl+V"
          onClick={() => {
            onPaste?.();
            onClose();
          }}
        />
        <MenuDivider />
        <MenuItem
          icon={Search}
          label="Find"
          kbd="Ctrl+F"
          onClick={() => {
            onFind?.();
            onClose();
          }}
        />
        <MenuItem
          icon={Replace}
          label="Replace"
          kbd="Ctrl+H"
          onClick={() => {
            onReplace?.();
            onClose();
          }}
        />
      </div>
    </div>
  );
}
