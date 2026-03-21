/**
 * TabOverflow component
 * Dropdown menu showing overflow tabs with count badge
 */

import { useState } from "react";
import { MoreHorizontal, X } from "lucide-react";
import type { Tab } from "../types";

export interface TabOverflowProps {
  /** Tabs that are in overflow */
  overflowTabs: Tab[];
  /** Handler for tab selection */
  onTabClick: (id: string) => void;
  /** Handler for tab close */
  onTabClose: (id: string) => void;
}

/**
 * Overflow indicator with dropdown menu
 * Shows count badge and displays hidden tabs
 */
export function TabOverflow({
  overflowTabs,
  onTabClick,
  onTabClose,
}: TabOverflowProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabClick = (id: string) => {
    onTabClick(id);
    setIsOpen(false);
  };

  const handleTabClose = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onTabClose(id);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        padding: "0 4px",
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          height: 26,
          padding: "0 8px",
          borderRadius: 4,
          border: "1px solid #e0e0e0",
          background: isOpen ? "#ffffff" : "#f0f0f0",
          color: "#616161",
          fontSize: 11,
          cursor: "pointer",
        }}
        aria-label={`${overflowTabs.length} more tabs`}
      >
        <MoreHorizontal style={{ width: 13, height: 13 }} />
        <span
          style={{
            fontSize: 10,
            background: "#0078d4",
            color: "white",
            padding: "1px 5px",
            borderRadius: 10,
            fontWeight: 600,
          }}
        >
          {overflowTabs.length}
        </span>
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            width: 220,
            background: "#ffffff",
            border: "1px solid #d1d1d1",
            boxShadow: "0 4px 16px rgba(0,0,0,.14), 0 1px 4px rgba(0,0,0,.1)",
            borderRadius: 6,
            padding: "4px 0",
            zIndex: 300,
          }}
        >
          <div
            style={{
              padding: "4px 10px 6px",
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
              More Tabs
            </span>
          </div>

          {overflowTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <div
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    "transparent";
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                <Icon
                  style={{
                    width: 13,
                    height: 13,
                    color: tab.color || "#0078d4",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "#1a1a1a",
                  }}
                >
                  {tab.label}
                </span>
                {tab.unsaved && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#0078d4",
                      flexShrink: 0,
                    }}
                  />
                )}
                <button
                  onClick={(e) => handleTabClose(tab.id, e)}
                  style={{
                    padding: 2,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#919191",
                    display: "flex",
                  }}
                  aria-label={`Close ${tab.label}`}
                >
                  <X style={{ width: 11, height: 11 }} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
