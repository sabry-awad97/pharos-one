import * as React from "react";
import { useSidebarStateStore } from "../stores/sidebar-state-store";

/**
 * SidebarContainer - Reusable sidebar component with resize and collapse functionality
 *
 * Provides a consistent layout structure for workspace-specific sidebars with:
 * - Drag-to-resize functionality (160px - 400px range)
 * - Double-click handle to toggle collapse/expand
 * - Width tooltip during resize
 * - Smooth animations using CSS variables
 * - Per-workspace state persistence via Zustand store
 *
 * @example
 * ```tsx
 * <SidebarContainer workspaceId="inventory" defaultWidth={220}>
 *   <SidebarNav>
 *     <SidebarNavItem>Item 1</SidebarNavItem>
 *   </SidebarNav>
 *   <SidebarStats stats={...} />
 * </SidebarContainer>
 * ```
 */

// ============================================================================
// Context for internal state sharing (compound component pattern)
// ============================================================================

interface SidebarContextValue {
  /** Whether the sidebar is expanded */
  expanded: boolean;
  /** Current sidebar width in pixels */
  width: number;
  /** Workspace ID for state scoping */
  workspaceId: string;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

/**
 * Hook to access sidebar context from child components
 * @internal
 */
function useSidebarContext() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "Sidebar compound components must be used within SidebarContainer",
    );
  }
  return context;
}

// ============================================================================
// Types
// ============================================================================

/**
 * Props for SidebarContainer component
 */
export interface SidebarContainerProps {
  /** Unique workspace identifier for state scoping */
  workspaceId: string;
  /** Default width in pixels (default: 200) */
  defaultWidth?: number;
  /** Minimum width in pixels (default: 160) */
  minWidth?: number;
  /** Maximum width in pixels (default: 400) */
  maxWidth?: number;
  /** Child components to render inside sidebar */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Imperative handle for SidebarContainer
 * Allows parent components to control sidebar programmatically
 */
export interface SidebarContainerRef {
  /** Toggle sidebar expanded/collapsed state */
  toggle: () => void;
  /** Set expanded state explicitly */
  setExpanded: (expanded: boolean) => void;
  /** Get current expanded state */
  isExpanded: () => boolean;
  /** Reset width to default */
  resetWidth: () => void;
}

// ============================================================================
// Main Container Component
// ============================================================================

/**
 * SidebarContainer - Main container component
 * Manages resize, collapse/expand, and provides context to child components
 */
const SidebarContainer = React.forwardRef<
  SidebarContainerRef,
  SidebarContainerProps
>(
  (
    {
      workspaceId,
      defaultWidth = 200,
      minWidth = 160,
      maxWidth = 400,
      children,
      className = "",
    },
    ref,
  ) => {
    // Use Zustand store directly for workspace-scoped sidebar state
    const workspaceState = useSidebarStateStore((state) =>
      state.getWorkspaceState(workspaceId),
    );
    const toggle = useSidebarStateStore((state) => state.toggle);
    const setExpanded = useSidebarStateStore((state) => state.setExpanded);
    const setSidebarWidth = useSidebarStateStore(
      (state) => state.setSidebarWidth,
    );
    const resetWidthStore = useSidebarStateStore((state) => state.resetWidth);

    const expanded = workspaceState.expanded;
    const sidebarWidth = workspaceState.width;

    // Initialize width from store or use default
    const [width, setWidthState] = React.useState<number>(() => {
      // If store has a stored width, use it; otherwise use defaultWidth
      if (sidebarWidth >= minWidth && sidebarWidth <= maxWidth) {
        return sidebarWidth;
      }
      return defaultWidth;
    });

    // Sync width with store when it changes
    React.useEffect(() => {
      if (sidebarWidth >= minWidth && sidebarWidth <= maxWidth) {
        setWidthState(sidebarWidth);
      }
    }, [sidebarWidth, minWidth, maxWidth]);

    // Persist width changes to store
    const setWidth = React.useCallback(
      (newWidth: number) => {
        const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        setWidthState(clampedWidth);
        setSidebarWidth(workspaceId, clampedWidth);
      },
      [minWidth, maxWidth, setSidebarWidth, workspaceId],
    );

    // State: resize interaction
    const [hoveredHandle, setHoveredHandle] = React.useState(false);
    const [isResizing, setIsResizing] = React.useState(false);
    const [resizeTooltipWidth, setResizeTooltipWidth] = React.useState<
      number | null
    >(null);

    // Reset width to default
    const resetWidth = React.useCallback(() => {
      setWidthState(defaultWidth);
      setSidebarWidth(workspaceId, defaultWidth);
    }, [defaultWidth, setSidebarWidth, workspaceId]);

    // Toggle expanded/collapsed
    const handleToggle = React.useCallback(() => {
      toggle(workspaceId);
    }, [toggle, workspaceId]);

    // Set expanded state
    const handleSetExpanded = React.useCallback(
      (value: boolean) => {
        setExpanded(workspaceId, value);
      },
      [setExpanded, workspaceId],
    );

    // Imperative handle for parent control
    React.useImperativeHandle(
      ref,
      () => ({
        toggle: handleToggle,
        setExpanded: handleSetExpanded,
        isExpanded: () => expanded,
        resetWidth,
      }),
      [handleToggle, handleSetExpanded, expanded, resetWidth],
    );

    // Drag handle resize logic
    const handleMouseDown = React.useCallback(
      (e: React.MouseEvent) => {
        if (!expanded) return; // Disable resize when collapsed

        e.preventDefault();
        setIsResizing(true);
        setResizeTooltipWidth(width);

        const startX = e.clientX;
        const startWidth = width;

        const handleMouseMove = (e: MouseEvent) => {
          const delta = e.clientX - startX;
          const newWidth = Math.max(
            minWidth,
            Math.min(maxWidth, startWidth + delta),
          );
          setWidth(newWidth);
          setResizeTooltipWidth(newWidth);
        };

        const cleanup = () => {
          setIsResizing(false);
          setResizeTooltipWidth(null);
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", cleanup);
          window.removeEventListener("blur", cleanup);
          document.removeEventListener("visibilitychange", cleanup);
        };

        // Attach to window for global event handling
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", cleanup);
        window.addEventListener("blur", cleanup); // Stop dragging if window loses focus
        document.addEventListener("visibilitychange", cleanup); // Stop if tab becomes hidden
      },
      [expanded, width, minWidth, maxWidth],
    );

    // Double-click handle to toggle collapse/expand
    const handleDoubleClick = React.useCallback(() => {
      handleToggle();
    }, [handleToggle]);

    // Context value for child components
    const contextValue = React.useMemo(
      () => ({
        expanded,
        width,
        workspaceId,
      }),
      [expanded, width, workspaceId],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          data-testid="sidebar-container"
          className={className}
          style={{
            background: "var(--color-background)",
            borderRight: "1px solid var(--color-border)",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            width: expanded ? width : 48,
            transition: isResizing
              ? "none"
              : "width var(--duration-fast) var(--ease-standard)",
            position: "relative",
            zIndex: 5,
          }}
        >
          {children}

          {/* Drag handle for resizing */}
          <div
            data-testid="sidebar-drag-handle"
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={() => setHoveredHandle(true)}
            onMouseLeave={() => setHoveredHandle(false)}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 2,
              height: "100%",
              cursor: expanded ? "ew-resize" : "default",
              background:
                hoveredHandle || isResizing ? "#91c9f7" : "transparent",
              transition: "background var(--duration-instant)",
              zIndex: 15,
            }}
          />

          {/* Resize width tooltip */}
          {resizeTooltipWidth !== null && (
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: resizeTooltipWidth + 16,
                transform: "translateY(-50%)",
                pointerEvents: "none",
                zIndex: 50,
              }}
            >
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.85)",
                  color: "#ffffff",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                  letterSpacing: "0.5px",
                  boxShadow:
                    "0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                {Math.round(resizeTooltipWidth)}px
              </div>
              {/* Arrow pointing to rail */}
              <div
                style={{
                  position: "absolute",
                  left: "-6px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 0,
                  height: 0,
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  borderRight: "6px solid rgba(0, 0, 0, 0.85)",
                }}
              />
            </div>
          )}
        </div>
      </SidebarContext.Provider>
    );
  },
);
SidebarContainer.displayName = "SidebarContainer";

// ============================================================================
// Compound Components
// ============================================================================

/**
 * SidebarContent - Scrollable content area
 * Use for navigation items or other scrollable content
 */
export interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ children, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        data-testid="sidebar-content"
        className={`custom-scrollbar ${className}`}
        style={{
          flex: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        {children}
      </div>
    );
  },
);
SidebarContent.displayName = "SidebarContent";

/**
 * SidebarFooter - Fixed footer area
 * Use for stats, actions, or other fixed content at bottom
 */
export interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ children, className = "" }, ref) => {
    const { expanded } = useSidebarContext();

    if (!expanded) return null;

    return (
      <div
        ref={ref}
        data-testid="sidebar-footer"
        className={className}
        style={{
          flexShrink: 0,
          borderTop: "1px solid var(--color-border)",
        }}
      >
        {children}
      </div>
    );
  },
);
SidebarFooter.displayName = "SidebarFooter";

// ============================================================================
// Exports
// ============================================================================

export { SidebarContainer, SidebarContent, SidebarFooter, useSidebarContext };
