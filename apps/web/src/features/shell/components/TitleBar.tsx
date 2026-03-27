import * as React from "react";
import {
  Save,
  RotateCcw,
  RefreshCw,
  Minus,
  Square,
  X,
  Pill,
} from "lucide-react";
import type { QuickAction } from "../types";

interface TitleBarProps extends React.HTMLAttributes<HTMLDivElement> {
  appName?: string;
  quickActions?: QuickAction[];
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
}

const TitleBar = React.forwardRef<HTMLDivElement, TitleBarProps>(
  (
    {
      className,
      appName = "PharmOS",
      quickActions,
      onMinimize,
      onMaximize,
      onClose,
      children,
      ...props
    },
    ref,
  ) => {
    const defaultQuickActions: QuickAction[] = [
      {
        icon: Save,
        label: "Save",
        tooltip: "Save (Ctrl+S)",
        onClick: () => console.log("Save"),
      },
      {
        icon: RotateCcw,
        label: "Undo",
        tooltip: "Undo",
        onClick: () => console.log("Undo"),
      },
      {
        icon: RefreshCw,
        label: "Refresh",
        tooltip: "Refresh",
        onClick: () => console.log("Refresh"),
      },
    ];

    const actions = quickActions ?? defaultQuickActions;

    return (
      <div
        ref={ref}
        style={{
          height: 32,
          background: "#f0f0f0",
          borderBottom: "1px solid #d1d1d1",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        }}
        {...props}
      >
        {/* App branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0 12px",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 3,
              background: "#0078d4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pill className="w-[10px] h-[10px] text-white" />
          </div>
          <span style={{ fontSize: 12, color: "#333" }}>{appName}</span>
        </div>

        {/* Optional children (e.g., UserSwitcher) */}
        {children && <div style={{ marginLeft: 8 }}>{children}</div>}

        {/* Quick action buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginLeft: 8,
          }}
        >
          {actions.map((action, index) => (
            <QuickActionButton
              key={index}
              icon={action.icon}
              tooltip={action.tooltip ?? action.label}
              onClick={action.onClick}
            />
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Window controls */}
        <WindowControl
          icon={Minus}
          onClick={onMinimize ?? (() => console.log("Minimize"))}
        />
        <WindowControl
          icon={Square}
          onClick={onMaximize ?? (() => console.log("Maximize"))}
        />
        <WindowControl
          icon={X}
          onClick={onClose ?? (() => console.log("Close"))}
          variant="close"
        />
      </div>
    );
  },
);
TitleBar.displayName = "TitleBar";

// Quick action button component
interface QuickActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  onClick: () => void;
}

const QuickActionButton = React.forwardRef<
  HTMLButtonElement,
  QuickActionButtonProps
>(({ icon: Icon, tooltip, onClick }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      ref={ref}
      type="button"
      title={tooltip}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        borderRadius: 3,
        background: isHovered ? "#e5e5e5" : "transparent",
        cursor: "pointer",
        color: "#555",
      }}
    >
      <Icon className="w-[11px] h-[11px]" />
    </button>
  );
});
QuickActionButton.displayName = "QuickActionButton";

// Window control button component
interface WindowControlProps {
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: "default" | "close";
}

const WindowControl = React.forwardRef<HTMLButtonElement, WindowControlProps>(
  ({ icon: Icon, onClick, variant = "default" }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: 46,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          background: isHovered
            ? variant === "close"
              ? "#c42b1c"
              : "#e5e5e5"
            : "transparent",
          cursor: "pointer",
          color: isHovered && variant === "close" ? "white" : "#333",
          transition: "background .1s",
        }}
      >
        <Icon className="w-[10px] h-[10px]" />
      </button>
    );
  },
);
WindowControl.displayName = "WindowControl";

export { TitleBar, QuickActionButton, WindowControl };
