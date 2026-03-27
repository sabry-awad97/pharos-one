/**
 * EmptyWorkspaceState component
 * Displays when no tabs are open, providing CTAs to create new tabs
 */

import { LayoutDashboard, Layers } from "lucide-react";

export interface EmptyWorkspaceStateProps {
  /** Handler for opening dashboard tab */
  onOpenDashboard: () => void;
  /** Handler for choosing template (placeholder) */
  onChooseTemplate?: () => void;
}

/**
 * Empty workspace state component
 * Shows centered message with illustration and action buttons
 */
export function EmptyWorkspaceState({
  onOpenDashboard,
  onChooseTemplate,
}: EmptyWorkspaceStateProps) {
  return (
    <div
      data-testid="empty-workspace-state"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        background: "#f3f3f3",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        padding: "40px",
      }}
    >
      {/* Illustration */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "#e8e8e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <Layers
          style={{
            width: 56,
            height: 56,
            color: "#a0a0a0",
          }}
        />
      </div>

      {/* Message */}
      <h2
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "#1a1a1a",
          marginBottom: 8,
          letterSpacing: "-0.01em",
        }}
      >
        No tabs open
      </h2>

      <p
        style={{
          fontSize: 13,
          color: "#616161",
          marginBottom: 32,
          textAlign: "center",
          maxWidth: 400,
          lineHeight: 1.5,
        }}
      >
        Get started by opening a workspace or choosing from a template
      </p>

      {/* CTAs */}
      <div
        style={{
          display: "flex",
          gap: 12,
        }}
      >
        <button
          onClick={onOpenDashboard}
          data-testid="open-dashboard-button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: 600,
            color: "#ffffff",
            background: "#0078d4",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            transition: "background 0.15s",
            fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#106ebe";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#0078d4";
          }}
        >
          <LayoutDashboard style={{ width: 16, height: 16 }} />
          Open Dashboard
        </button>

        <button
          onClick={() => {
            if (onChooseTemplate) {
              onChooseTemplate();
            } else {
              console.log("Template picker coming in Phase 4");
            }
          }}
          data-testid="choose-template-button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: 600,
            color: "#616161",
            background: "#ffffff",
            border: "1px solid #d1d1d1",
            borderRadius: 4,
            cursor: "pointer",
            transition: "background 0.15s, border-color 0.15s",
            fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#f8f8f8";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "#b8b8b8";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "#d1d1d1";
          }}
        >
          <Layers style={{ width: 16, height: 16 }} />
          Choose Template
        </button>
      </div>
    </div>
  );
}
