import * as React from "react";
import { Clock } from "lucide-react";
import type { MenuType, DensityMode } from "../types";
import { cn } from "@pharos-one/ui/lib/utils";
import { FileMenu } from "./FileMenu";
import { EditMenu } from "./EditMenu";
import { ViewMenu } from "./ViewMenu";

interface MenuBarProps extends React.HTMLAttributes<HTMLDivElement> {
  activeMenu: MenuType | null;
  onMenuClick: (menu: MenuType) => void;
  branchInfo?: string;
  userInfo?: string;
  shiftInfo?: string;
  onNewWorkspace?: () => void;
  onPinActiveTab?: () => void;
  onDuplicateTab?: () => void;
  onSplitView?: () => void;
  onCloseTab?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onCut?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onFind?: () => void;
  onReplace?: () => void;
  onToggleSidebar?: () => void;
  onToggleStatusBar?: () => void;
  onToggleToolbar?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  density?: DensityMode;
  onSetDensity?: (mode: DensityMode) => void;
}

const MenuBar = React.forwardRef<HTMLDivElement, MenuBarProps>(
  (
    {
      className,
      activeMenu,
      onMenuClick,
      branchInfo = "Main Branch",
      userInfo = "User",
      shiftInfo,
      onNewWorkspace,
      onPinActiveTab,
      onDuplicateTab,
      onSplitView,
      onCloseTab,
      onUndo,
      onRedo,
      onCut,
      onCopy,
      onPaste,
      onFind,
      onReplace,
      onToggleSidebar,
      onToggleStatusBar,
      onToggleToolbar,
      onZoomIn,
      onZoomOut,
      onResetZoom,
      density,
      onSetDensity,
      ...props
    },
    ref,
  ) => {
    const menuItems: MenuType[] = [
      "file",
      "edit",
      "view",
      "workspace",
      "tools",
      "help",
    ];

    const menuRefs = React.useRef<Record<MenuType, HTMLButtonElement | null>>(
      {} as Record<MenuType, HTMLButtonElement | null>,
    );

    const getMenuOffset = (menu: MenuType): number => {
      const menuElement = menuRefs.current[menu];
      if (!menuElement) return 0;
      return menuElement.offsetLeft;
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-[26px] flex-none items-center border-b px-1",
          className,
        )}
        style={{
          background: "#f8f8f8",
          borderBottomColor: "#e0e0e0",
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
          zIndex: 10,
          gap: 1,
        }}
        {...props}
      >
        {/* Menu items */}
        {menuItems.map((menu) => (
          <MenuBarItem
            key={menu}
            ref={(el) => {
              menuRefs.current[menu] = el;
            }}
            label={menu.charAt(0).toUpperCase() + menu.slice(1)}
            active={activeMenu === menu}
            isFileMenu={menu === "file"}
            anyMenuActive={activeMenu !== null}
            onClick={() => onMenuClick(menu)}
          />
        ))}

        <div className="flex-1" />

        {/* Context info */}
        <div
          className="flex items-center gap-1.5 pr-2"
          style={{
            color: "#919191",
            fontSize: 11,
          }}
        >
          <span>{branchInfo}</span>
          <span className="h-3 w-px" style={{ background: "#e0e0e0" }} />
          <span>{userInfo}</span>
          {shiftInfo && (
            <>
              <span className="h-3 w-px" style={{ background: "#e0e0e0" }} />
              <Clock className="h-[11px] w-[11px]" />
              <span>{shiftInfo}</span>
            </>
          )}
        </div>

        {/* File Menu Dropdown */}
        {activeMenu === "file" && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: getMenuOffset("file"),
              zIndex: 20,
            }}
          >
            <FileMenu
              onClose={() => onMenuClick("file")}
              onNewWorkspace={onNewWorkspace}
              onPinActiveTab={onPinActiveTab}
              onDuplicateTab={onDuplicateTab}
              onSplitView={onSplitView}
              onCloseTab={onCloseTab}
            />
          </div>
        )}

        {/* Edit Menu Dropdown */}
        {activeMenu === "edit" && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: getMenuOffset("edit"),
              zIndex: 20,
            }}
          >
            <EditMenu
              onClose={() => onMenuClick("edit")}
              onUndo={onUndo}
              onRedo={onRedo}
              onCut={onCut}
              onCopy={onCopy}
              onPaste={onPaste}
              onFind={onFind}
              onReplace={onReplace}
            />
          </div>
        )}

        {/* View Menu Dropdown */}
        {activeMenu === "view" && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: getMenuOffset("view"),
              zIndex: 20,
            }}
          >
            <ViewMenu
              onClose={() => onMenuClick("view")}
              onToggleSidebar={onToggleSidebar}
              onToggleStatusBar={onToggleStatusBar}
              onToggleToolbar={onToggleToolbar}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onResetZoom={onResetZoom}
              density={density}
              onSetDensity={onSetDensity}
            />
          </div>
        )}
      </div>
    );
  },
);
MenuBar.displayName = "MenuBar";

// Menu bar item component
interface MenuBarItemProps {
  label: string;
  active: boolean;
  isFileMenu?: boolean;
  anyMenuActive?: boolean;
  onClick: () => void;
}

const MenuBarItem = React.forwardRef<HTMLButtonElement, MenuBarItemProps>(
  (
    { label, active, isFileMenu = false, anyMenuActive = false, onClick },
    ref,
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    // File menu uses blue background when active, other menus use gray
    const activeBackground = isFileMenu ? "#0078d4" : "#f0f0f0";
    const activeColor = isFileMenu ? "white" : "#1a1a1a";

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick();
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      // If any menu is active, open this menu on hover
      if (anyMenuActive) {
        onClick();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        style={{
          height: 26,
          padding: "0 10px",
          border: "none",
          cursor: "pointer",
          fontSize: 12,
          borderRadius: 3,
          background: active
            ? activeBackground
            : isHovered
              ? "#f0f0f0"
              : "transparent",
          color: active ? activeColor : "#1a1a1a",
          transition: "background .1s",
        }}
      >
        {label}
      </button>
    );
  },
);
MenuBarItem.displayName = "MenuBarItem";

export { MenuBar, MenuBarItem };
