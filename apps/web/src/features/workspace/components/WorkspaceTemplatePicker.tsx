/**
 * WorkspaceTemplatePicker component
 * Modal for selecting a workspace template
 */

import * as React from "react";
import { WORKSPACE_TEMPLATES } from "../constants/workspace-templates";
import type { WorkspaceTemplate } from "../constants/workspace-templates";

export interface WorkspaceTemplatePickerProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when a template is selected */
  onSelect: (templateId: string) => void;
  /** Callback when skip button is clicked */
  onSkip: () => void;
  /** Whether "don't show again" is checked */
  dontShowAgain: boolean;
  /** Callback when "don't show again" checkbox changes */
  onDontShowAgainChange: (checked: boolean) => void;
}

/**
 * Workspace template picker modal
 * Shows a 2x2 grid of template cards for quick workspace setup
 */
export const WorkspaceTemplatePicker = React.forwardRef<
  HTMLDivElement,
  WorkspaceTemplatePickerProps
>(({ open, onSelect, onSkip, dontShowAgain, onDontShowAgainChange }, ref) => {
  if (!open) {
    return null;
  }

  return (
    <div
      ref={ref}
      data-testid="workspace-template-picker"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
      onClick={onSkip}
    >
      {/* Modal content */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: 8,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          width: "90%",
          maxWidth: 720,
          padding: 32,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#1a1a1a",
              marginBottom: 8,
              letterSpacing: "-0.02em",
            }}
          >
            Choose a workspace template
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#616161",
              lineHeight: 1.5,
            }}
          >
            Select a template to quickly set up your workspace with commonly
            used tabs
          </p>
        </div>

        {/* Template grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {WORKSPACE_TEMPLATES.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={() => onSelect(template.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 16,
            borderTop: "1px solid #ebebeb",
          }}
        >
          {/* Don't show again checkbox */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontSize: 13,
              color: "#616161",
            }}
          >
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => onDontShowAgainChange(e.target.checked)}
              data-testid="dont-show-again-checkbox"
              style={{
                width: 16,
                height: 16,
                cursor: "pointer",
              }}
            />
            Don't show this again
          </label>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={onSkip}
              data-testid="skip-button"
              style={{
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
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#f8f8f8";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "#b8b8b8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#ffffff";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "#d1d1d1";
              }}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
WorkspaceTemplatePicker.displayName = "WorkspaceTemplatePicker";

/**
 * Template card component
 */
interface TemplateCardProps {
  template: WorkspaceTemplate;
  onSelect: () => void;
}

const TemplateCard = React.forwardRef<HTMLDivElement, TemplateCardProps>(
  ({ template, onSelect }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const Icon = template.icon;

    return (
      <div
        ref={ref}
        onClick={onSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid={`template-card-${template.id}`}
        style={{
          padding: 20,
          border: "1px solid #d1d1d1",
          borderRadius: 6,
          cursor: "pointer",
          background: isHovered ? "#f8f8f8" : "#ffffff",
          transition: "background 0.15s, border-color 0.15s, transform 0.15s",
          transform: isHovered ? "translateY(-2px)" : "translateY(0)",
          boxShadow: isHovered
            ? "0 4px 12px rgba(0, 0, 0, 0.1)"
            : "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            background: "#e6f2fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Icon
            style={{
              width: 24,
              height: 24,
              color: "#0078d4",
            }}
          />
        </div>

        {/* Name */}
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#1a1a1a",
            marginBottom: 8,
            letterSpacing: "-0.01em",
          }}
        >
          {template.label}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: 12,
            color: "#616161",
            marginBottom: 12,
            lineHeight: 1.5,
          }}
        >
          {template.description}
        </p>

        {/* Tab preview */}
        {template.tabs.length > 0 && (
          <div
            style={{
              paddingTop: 12,
              borderTop: "1px solid #ebebeb",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#919191",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Includes
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {template.tabs.map((tab, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: 11,
                    color: "#616161",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: "#b8b8b8",
                      flexShrink: 0,
                    }}
                  />
                  {tab.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Empty state for custom template */}
        {template.tabs.length === 0 && (
          <div
            style={{
              paddingTop: 12,
              borderTop: "1px solid #ebebeb",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#919191",
                fontStyle: "italic",
              }}
            >
              Build your own workspace
            </div>
          </div>
        )}
      </div>
    );
  },
);
TemplateCard.displayName = "TemplateCard";
