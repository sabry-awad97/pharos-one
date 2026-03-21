/**
 * SidebarContextMenu component
 * Right-click context menu for sidebar navigation items
 */

import { useState, useEffect, useRef } from "react";
import { FolderOpen, FolderPlus, Pin, EyeOff } from "lucide-react";

export interface SidebarContextMenuProps {
  /** Module/item ID this menu is for */
  itemId: string;
  /** X coordinate for menu positioning */
  x: number;
  /** Y coordinate for menu positioning */
  y: number;
  /** Whether the item is pinned */
  isPinned: boolean;
  /** Handler for Open action */
  onOpen: () => void;
  /** Handler for Open in New Tab action */
  onOpenInNewTab: () => void;
  /** Handler for Pin action */
  onPin: () => void;
  /** Handler for Hide action */
  onHide: () => void;
  /** Handler for closing the menu */
  onDismiss: () => void;
}

interface MenuItemProps {
  icon: any;
  label: string;
  onClick: () => void;
}

function MenuItem({ icon: Icon, label, onClick }: MenuItemProps) {
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
        background: hov ? "#f5f5f5" : "transparent",
      }}
    >
      <Icon
        style={{
          width: 13,
          height: 13,
          color: "#616161",
          flexShrink: 0,
        }}
      />
      <span style={{ flex: 1, fontSize: 12, color: "#1a1a1a" }}>{label}</span>
    </div>
  );
}

/**
 * Context menu for sidebar navigation items
 * Matches Windows 11 styling
 */
export function SidebarContextMenu({
  x,
  y,
  isPinned,
  onOpen,
  onOpenInNewTab,
  onPin,
  onHide,
  onDismiss,
}: SidebarContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onDismiss();
      }
    };

    // Close menu on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onDismiss();
      }
    };

    // Close menu on scroll
    const handleScroll = () => {
      onDismiss();
    };

    // Add listeners after a small delay to prevent immediate dismissal
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      window.addEventListener("scroll", handleScroll, true);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll, true);
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
        width: 200,
        background: "#ffffff",
        border: "1px solid #d1d1d1",
        boxShadow: "0 4px 16px rgba(0,0,0,.14), 0 1px 4px rgba(0,0,0,.1)",
        borderRadius: 6,
        padding: "4px 0",
        zIndex: 500,
      }}
    >
      <MenuItem icon={FolderOpen} label="Open" onClick={onOpen} />
      <MenuItem
        icon={FolderPlus}
        label="Open in New Tab"
        onClick={onOpenInNewTab}
      />

      <div
        style={{
          height: 1,
          background: "#ebebeb",
          margin: "3px 0",
        }}
      />

      <MenuItem
        icon={Pin}
        label={isPinned ? "Unpin from Sidebar" : "Pin to Sidebar"}
        onClick={onPin}
      />
      <MenuItem icon={EyeOff} label="Hide from Sidebar" onClick={onHide} />
    </div>
  );
}
