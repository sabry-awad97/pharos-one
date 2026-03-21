/**
 * SidebarContextMenu component
 * Right-click context menu for sidebar navigation items with search
 */

import { useState, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
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

interface MenuAction {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  searchTerms: string[];
}

interface MenuItemProps {
  icon: LucideIcon;
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
 * Matches Windows 11 styling with searchable actions
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
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Define all menu actions with search terms
  const menuActions: MenuAction[] = [
    {
      icon: FolderOpen,
      label: "Open",
      onClick: onOpen,
      searchTerms: ["open", "activate", "switch"],
    },
    {
      icon: FolderPlus,
      label: "Open in New Tab",
      onClick: onOpenInNewTab,
      searchTerms: ["open", "new", "tab", "create"],
    },
    {
      icon: Pin,
      label: isPinned ? "Unpin from Sidebar" : "Pin to Sidebar",
      onClick: onPin,
      searchTerms: isPinned
        ? ["unpin", "remove", "sidebar"]
        : ["pin", "add", "sidebar", "favorite"],
    },
    {
      icon: EyeOff,
      label: "Hide from Sidebar",
      onClick: onHide,
      searchTerms: ["hide", "remove", "sidebar"],
    },
  ];

  // Filter actions based on search query
  const filteredActions = searchQuery.trim()
    ? menuActions.filter((action) => {
        const query = searchQuery.toLowerCase();
        return (
          action.label.toLowerCase().includes(query) ||
          action.searchTerms.some((term) => term.includes(query))
        );
      })
    : menuActions;

  // Auto-focus search input on mount
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

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
        width: 240,
        background: "#ffffff",
        border: "1px solid #d1d1d1",
        boxShadow: "0 4px 16px rgba(0,0,0,.14), 0 1px 4px rgba(0,0,0,.1)",
        borderRadius: 6,
        padding: "6px 0",
        zIndex: 500,
      }}
    >
      {/* Search input */}
      <div style={{ padding: "0 8px 6px 8px" }}>
        <input
          ref={searchRef}
          type="text"
          placeholder="Search actions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "6px 10px",
            border: "1px solid #d1d1d1",
            borderRadius: 4,
            fontSize: 12,
            fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
            outline: "none",
            background: "#fafafa",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#0078d4";
            e.target.style.background = "#ffffff";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d1d1";
            e.target.style.background = "#fafafa";
          }}
        />
      </div>

      {/* Filtered menu items */}
      {filteredActions.length > 0 ? (
        <div style={{ padding: "0 0 2px 0" }}>
          {filteredActions.map((action, index) => (
            <MenuItem
              key={index}
              icon={action.icon}
              label={action.label}
              onClick={action.onClick}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: "8px 12px",
            fontSize: 12,
            color: "#616161",
            textAlign: "center",
          }}
        >
          No actions found
        </div>
      )}
    </div>
  );
}
