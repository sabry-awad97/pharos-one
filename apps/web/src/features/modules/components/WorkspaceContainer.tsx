/**
 * WorkspaceContainer component
 * Loads and renders modules from the registry based on active tab
 */

import { getModule } from "../registry";

export interface WorkspaceContainerProps {
  /** The module ID to render */
  moduleId: string | null;
  /** Whether this is in split view (hides annotation callouts) */
  split?: boolean;
  /** Optional custom label to override module's default label */
  label?: string;
}

/**
 * Container that loads modules from registry and renders them
 * Uses flex-based height management for proper scrolling
 */
export function WorkspaceContainer({
  moduleId,
  split = false,
  label,
}: WorkspaceContainerProps) {
  // No module selected
  if (!moduleId) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          background: "#f3f3f3",
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#1a1a1a",
              marginBottom: 8,
            }}
          >
            Welcome to PharmOS
          </h1>
          <p style={{ color: "#919191" }}>Select a tab to get started</p>
        </div>
      </div>
    );
  }

  // Look up module in registry
  const module = getModule(moduleId);

  // Module not found
  if (!module) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          background: "#f3f3f3",
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#a4262c",
              marginBottom: 8,
            }}
          >
            Module Not Found
          </h1>
          <p style={{ color: "#919191" }}>
            The module "{moduleId}" is not registered
          </p>
        </div>
      </div>
    );
  }

  // Render module component
  const ModuleComponent = module.component;
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#f3f3f3",
      }}
    >
      {/* Module toolbar (if provided) */}
      {module.toolbar && (
        <div
          style={{
            flexShrink: 0,
            borderBottom: "1px solid #e0e0e0",
            background: "#ffffff",
          }}
        >
          <module.toolbar />
        </div>
      )}

      {/* Module workspace - pass split prop and optional label */}
      <ModuleComponent split={split} {...(label ? { label } : {})} />
    </div>
  );
}
