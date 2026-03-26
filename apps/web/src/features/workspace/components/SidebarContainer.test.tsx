import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import {
  SidebarContainer,
  SidebarContent,
  SidebarFooter,
  type SidebarContainerRef,
} from "./SidebarContainer";
import * as React from "react";

describe("SidebarContainer", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock console.warn to avoid noise in test output
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  describe("Basic Rendering", () => {
    it("renders with default props", () => {
      render(
        <SidebarContainer workspaceId="test">
          <div>Content</div>
        </SidebarContainer>,
      );

      expect(screen.getByTestId("sidebar-container")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(
        <SidebarContainer workspaceId="test" className="custom-class">
          <div>Content</div>
        </SidebarContainer>,
      );

      const container = screen.getByTestId("sidebar-container");
      expect(container).toHaveClass("custom-class");
    });

    it("renders drag handle", () => {
      render(
        <SidebarContainer workspaceId="test">
          <div>Content</div>
        </SidebarContainer>,
      );

      expect(screen.getByTestId("sidebar-drag-handle")).toBeInTheDocument();
    });
  });

  describe("Width Management", () => {
    it("uses default width of 200px when expanded", () => {
      render(
        <SidebarContainer workspaceId="test">
          <div>Content</div>
        </SidebarContainer>,
      );

      const container = screen.getByTestId("sidebar-container");
      expect(container).toHaveStyle({ width: "200px" });
    });

    it("uses custom default width", () => {
      render(
        <SidebarContainer workspaceId="test" defaultWidth={250}>
          <div>Content</div>
        </SidebarContainer>,
      );

      const container = screen.getByTestId("sidebar-container");
      expect(container).toHaveStyle({ width: "250px" });
    });

    it("collapses to 48px when not expanded", () => {
      // Pre-set collapsed state in localStorage using hook's key format
      localStorage.setItem("pharmos-sidebar-test-expanded", "false");

      render(
        <SidebarContainer workspaceId="test">
          <div>Content</div>
        </SidebarContainer>,
      );

      const container = screen.getByTestId("sidebar-container");
      expect(container).toHaveStyle({ width: "48px" });
    });

    it("persists width to localStorage", async () => {
      const { rerender } = render(
        <SidebarContainer workspaceId="test" defaultWidth={220}>
          <div>Content</div>
        </SidebarContainer>,
      );

      await waitFor(() => {
        expect(localStorage.getItem("pharmos-sidebar-test-width")).toBe("220");
      });

      // Verify it loads from localStorage on remount
      rerender(
        <SidebarContainer workspaceId="test" defaultWidth={200}>
          <div>Content</div>
        </SidebarContainer>,
      );

      const container = screen.getByTestId("sidebar-container");
      expect(container).toHaveStyle({ width: "220px" });
    });

    it("scopes width to workspaceId", async () => {
      const { unmount } = render(
        <SidebarContainer workspaceId="workspace1" defaultWidth={200}>
          <div>Content 1</div>
        </SidebarContainer>,
      );

      await waitFor(() => {
        expect(localStorage.getItem("pharmos-sidebar-workspace1-width")).toBe(
          "200",
        );
      });

      unmount();

      render(
        <SidebarContainer workspaceId="workspace2" defaultWidth={250}>
          <div>Content 2</div>
        </SidebarContainer>,
      );

      await waitFor(() => {
        expect(localStorage.getItem("pharmos-sidebar-workspace2-width")).toBe(
          "250",
        );
      });
      expect(localStorage.getItem("pharmos-sidebar-workspace1-width")).toBe(
        "200",
      );
    });
  });

  describe("Resize Behavior", () => {
    it("allows resizing when expanded", () => {
      render(
        <SidebarContainer workspaceId="test" defaultWidth={200}>
          <div>Content</div>
        </SidebarContainer>,
      );

      const handle = screen.getByTestId("sidebar-drag-handle");
      const container = screen.getByTestId("sidebar-container");

      // Start drag
      fireEvent.mouseDown(handle, { clientX: 200 });

      // Move mouse to resize
      fireEvent.mouseMove(window, { clientX: 250 });

      // Width should increase by 50px
      expect(container).toHaveStyle({ width: "250px" });

      // End drag
      fireEvent.mouseUp(window);
    });

    it("enforces minimum width constraint", () => {
      render(
        <SidebarContainer workspaceId="test" defaultWidth={200} minWidth={160}>
          <div>Content</div>
        </SidebarContainer>,
      );

      const handle = screen.getByTestId("sidebar-drag-handle");
      const container = screen.getByTestId("sidebar-container");

      // Start drag
      fireEvent.mouseDown(handle, { clientX: 200 });

      // Try to resize below minimum
      fireEvent.mouseMove(window, { clientX: 0 });

      // Width should be clamped to minimum
      expect(container).toHaveStyle({ width: "160px" });

      fireEvent.mouseUp(window);
    });

    it("enforces maximum width constraint", () => {
      render(
        <SidebarContainer workspaceId="test" defaultWidth={200} maxWidth={400}>
          <div>Content</div>
        </SidebarContainer>,
      );

      const handle = screen.getByTestId("sidebar-drag-handle");
      const container = screen.getByTestId("sidebar-container");

      // Start drag
      fireEvent.mouseDown(handle, { clientX: 200 });

      // Try to resize above maximum
      fireEvent.mouseMove(window, { clientX: 1000 });

      // Width should be clamped to maximum
      expect(container).toHaveStyle({ width: "400px" });

      fireEvent.mouseUp(window);
    });

    it("does not allow resizing when collapsed", () => {
      localStorage.setItem("pharmos-sidebar-test-expanded", "false");

      render(
        <SidebarContainer workspaceId="test" defaultWidth={200}>
          <div>Content</div>
        </SidebarContainer>,
      );

      const handle = screen.getByTestId("sidebar-drag-handle");
      const container = screen.getByTestId("sidebar-container");

      // Start drag (should be ignored)
      fireEvent.mouseDown(handle, { clientX: 200 });
      fireEvent.mouseMove(window, { clientX: 250 });

      // Width should remain at collapsed size
      expect(container).toHaveStyle({ width: "48px" });

      fireEvent.mouseUp(window);
    });

    it("shows width tooltip during resize", () => {
      render(
        <SidebarContainer workspaceId="test" defaultWidth={200}>
          <div>Content</div>
        </SidebarContainer>,
      );

      const handle = screen.getByTestId("sidebar-drag-handle");

      // Start drag
      fireEvent.mouseDown(handle, { clientX: 200 });

      // Tooltip should appear with current width
      expect(screen.getByText("200px")).toBeInTheDocument();

      // Move mouse
      fireEvent.mouseMove(window, { clientX: 250 });

      // Tooltip should update
      expect(screen.getByText("250px")).toBeInTheDocument();

      // End drag
      fireEvent.mouseUp(window);

      // Tooltip should disappear
      expect(screen.queryByText("250px")).not.toBeInTheDocument();
    });

    it("cleans up event listeners on window blur", () => {
      render(
        <SidebarContainer workspaceId="test" defaultWidth={200}>
          <div>Content</div>
        </SidebarContainer>,
      );

      const handle = screen.getByTestId("sidebar-drag-handle");

      // Start drag
      fireEvent.mouseDown(handle, { clientX: 200 });

      // Tooltip should be visible
      expect(screen.getByText("200px")).toBeInTheDocument();

      // Trigger window blur
      fireEvent.blur(window);

      // Tooltip should disappear
      expect(screen.queryByText("200px")).not.toBeInTheDocument();
    });
  });

  describe("Collapse/Expand Toggle", () => {
    it("toggles on double-click of drag handle", () => {
      render(
        <SidebarContainer workspaceId="test" defaultWidth={200}>
          <div>Content</div>
        </SidebarContainer>,
      );

      const handle = screen.getByTestId("sidebar-drag-handle");
      const container = screen.getByTestId("sidebar-container");

      // Initially expanded
      expect(container).toHaveStyle({ width: "200px" });

      // Double-click to collapse
      fireEvent.doubleClick(handle);

      // Should collapse
      expect(container).toHaveStyle({ width: "48px" });

      // Double-click again to expand
      fireEvent.doubleClick(handle);

      // Should expand
      expect(container).toHaveStyle({ width: "200px" });
    });

    it("persists expanded state to localStorage", async () => {
      render(
        <SidebarContainer workspaceId="test">
          <div>Content</div>
        </SidebarContainer>,
      );

      const handle = screen.getByTestId("sidebar-drag-handle");

      // Initially expanded
      await waitFor(() => {
        expect(localStorage.getItem("pharmos-sidebar-test-expanded")).toBe(
          "true",
        );
      });

      // Toggle to collapsed
      fireEvent.doubleClick(handle);

      await waitFor(() => {
        expect(localStorage.getItem("pharmos-sidebar-test-expanded")).toBe(
          "false",
        );
      });
    });

    it("scopes expanded state to workspaceId", async () => {
      const { unmount } = render(
        <SidebarContainer workspaceId="workspace1">
          <div>Content 1</div>
        </SidebarContainer>,
      );

      const handle1 = screen.getByTestId("sidebar-drag-handle");
      fireEvent.doubleClick(handle1);

      await waitFor(() => {
        expect(
          localStorage.getItem("pharmos-sidebar-workspace1-expanded"),
        ).toBe("false");
      });

      unmount();

      render(
        <SidebarContainer workspaceId="workspace2">
          <div>Content 2</div>
        </SidebarContainer>,
      );

      await waitFor(() => {
        // workspace2 should still be expanded (default)
        expect(
          localStorage.getItem("pharmos-sidebar-workspace2-expanded"),
        ).toBe("true");
      });
    });
  });

  describe("Imperative Handle", () => {
    it("exposes toggle method", async () => {
      const ref = React.createRef<SidebarContainerRef>();

      render(
        <SidebarContainer workspaceId="test" ref={ref}>
          <div>Content</div>
        </SidebarContainer>,
      );

      const container = screen.getByTestId("sidebar-container");

      // Initially expanded
      expect(container).toHaveStyle({ width: "200px" });

      // Toggle via ref
      await act(async () => {
        ref.current?.toggle();
      });

      // Should collapse
      expect(container).toHaveStyle({ width: "48px" });
    });

    it("exposes setExpanded method", async () => {
      const ref = React.createRef<SidebarContainerRef>();

      render(
        <SidebarContainer workspaceId="test" ref={ref}>
          <div>Content</div>
        </SidebarContainer>,
      );

      const container = screen.getByTestId("sidebar-container");

      // Set to collapsed
      await act(async () => {
        ref.current?.setExpanded(false);
      });
      expect(container).toHaveStyle({ width: "48px" });

      // Set to expanded
      await act(async () => {
        ref.current?.setExpanded(true);
      });
      expect(container).toHaveStyle({ width: "200px" });
    });

    it("exposes isExpanded method", async () => {
      const ref = React.createRef<SidebarContainerRef>();

      render(
        <SidebarContainer workspaceId="test" ref={ref}>
          <div>Content</div>
        </SidebarContainer>,
      );

      // Initially expanded
      expect(ref.current?.isExpanded()).toBe(true);

      // Toggle
      await act(async () => {
        ref.current?.toggle();
      });
      expect(ref.current?.isExpanded()).toBe(false);
    });

    it("exposes resetWidth method", async () => {
      const ref = React.createRef<SidebarContainerRef>();

      render(
        <SidebarContainer workspaceId="test" defaultWidth={250} ref={ref}>
          <div>Content</div>
        </SidebarContainer>,
      );

      const container = screen.getByTestId("sidebar-container");
      const handle = screen.getByTestId("sidebar-drag-handle");

      // Resize to different width
      fireEvent.mouseDown(handle, { clientX: 250 });
      fireEvent.mouseMove(window, { clientX: 300 });
      fireEvent.mouseUp(window);

      expect(container).toHaveStyle({ width: "300px" });

      // Reset to default
      await act(async () => {
        ref.current?.resetWidth();
      });
      expect(container).toHaveStyle({ width: "250px" });
    });
  });

  describe("Compound Components", () => {
    it("renders SidebarContent", () => {
      render(
        <SidebarContainer workspaceId="test">
          <SidebarContent>
            <div>Navigation</div>
          </SidebarContent>
        </SidebarContainer>,
      );

      expect(screen.getByTestId("sidebar-content")).toBeInTheDocument();
      expect(screen.getByText("Navigation")).toBeInTheDocument();
    });

    it("renders SidebarFooter when expanded", () => {
      render(
        <SidebarContainer workspaceId="test">
          <SidebarFooter>
            <div>Footer</div>
          </SidebarFooter>
        </SidebarContainer>,
      );

      expect(screen.getByTestId("sidebar-footer")).toBeInTheDocument();
      expect(screen.getByText("Footer")).toBeInTheDocument();
    });

    it("hides SidebarFooter when collapsed", () => {
      localStorage.setItem("pharmos-sidebar-test-expanded", "false");

      render(
        <SidebarContainer workspaceId="test">
          <SidebarFooter>
            <div>Footer</div>
          </SidebarFooter>
        </SidebarContainer>,
      );

      expect(screen.queryByTestId("sidebar-footer")).not.toBeInTheDocument();
    });

    it("applies custom className to compound components", () => {
      render(
        <SidebarContainer workspaceId="test">
          <SidebarContent className="custom-content">
            <div>Content</div>
          </SidebarContent>
          <SidebarFooter className="custom-footer">
            <div>Footer</div>
          </SidebarFooter>
        </SidebarContainer>,
      );

      expect(screen.getByTestId("sidebar-content")).toHaveClass(
        "custom-content",
      );
      expect(screen.getByTestId("sidebar-footer")).toHaveClass("custom-footer");
    });
  });

  describe("Accessibility", () => {
    it("provides keyboard alternative to double-click (via imperative handle)", async () => {
      const ref = React.createRef<SidebarContainerRef>();

      render(
        <SidebarContainer workspaceId="test" ref={ref}>
          <div>Content</div>
        </SidebarContainer>,
      );

      const container = screen.getByTestId("sidebar-container");

      // Use imperative handle as keyboard alternative
      await act(async () => {
        ref.current?.toggle();
      });
      expect(container).toHaveStyle({ width: "48px" });

      await act(async () => {
        ref.current?.toggle();
      });
      expect(container).toHaveStyle({ width: "200px" });
    });
  });

  describe("Visual Feedback", () => {
    it("shows hover state on drag handle", () => {
      render(
        <SidebarContainer workspaceId="test">
          <div>Content</div>
        </SidebarContainer>,
      );

      const handle = screen.getByTestId("sidebar-drag-handle");

      // Initially transparent
      expect(handle).toHaveStyle({ background: "transparent" });

      // Hover
      fireEvent.mouseEnter(handle);
      expect(handle).toHaveStyle({ background: "#91c9f7" });

      // Leave
      fireEvent.mouseLeave(handle);
      expect(handle).toHaveStyle({ background: "transparent" });
    });

    it("shows active state during resize", () => {
      render(
        <SidebarContainer workspaceId="test">
          <div>Content</div>
        </SidebarContainer>,
      );

      const handle = screen.getByTestId("sidebar-drag-handle");

      // Start drag
      fireEvent.mouseDown(handle, { clientX: 200 });
      expect(handle).toHaveStyle({ background: "#91c9f7" });

      // End drag
      fireEvent.mouseUp(window);
      expect(handle).toHaveStyle({ background: "transparent" });
    });
  });

  describe("Error Handling", () => {
    it("handles localStorage errors gracefully", () => {
      // Mock localStorage to throw error
      const mockGetItem = vi
        .spyOn(Storage.prototype, "getItem")
        .mockImplementation(() => {
          throw new Error("localStorage disabled");
        });

      render(
        <SidebarContainer workspaceId="test">
          <div>Content</div>
        </SidebarContainer>,
      );

      // Should still render with defaults
      const container = screen.getByTestId("sidebar-container");
      expect(container).toHaveStyle({ width: "200px" });

      mockGetItem.mockRestore();
    });
  });
});
