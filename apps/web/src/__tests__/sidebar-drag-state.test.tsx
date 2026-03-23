import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Sidebar } from "@/features/shell/components/Sidebar";

describe("Sidebar Drag State Management", () => {
  it("should stop dragging when window loses focus (blur event)", () => {
    const onModuleClick = vi.fn();
    render(<Sidebar activeModule="dashboard" onModuleClick={onModuleClick} />);

    const sidebar = screen.getByTestId("sidebar");
    const dragHandle = screen.getByTestId("sidebar-drag-handle");

    // Start dragging
    act(() => {
      dragHandle.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
          clientX: 240,
        }),
      );
    });

    const initialWidth = sidebar.style.width;

    // Simulate mouse move (should resize)
    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: 300,
        }),
      );
    });

    // Verify sidebar width changed
    const widthAfterMove = sidebar.style.width;
    expect(widthAfterMove).not.toBe(initialWidth);

    // Simulate window losing focus (the critical fix)
    act(() => {
      window.dispatchEvent(new Event("blur"));
    });

    // Try to move mouse again - should NOT resize anymore
    const widthBeforeSecondMove = sidebar.style.width;
    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: 400,
        }),
      );
    });

    // Width should remain the same (drag stopped)
    expect(sidebar.style.width).toBe(widthBeforeSecondMove);
  });

  it("should stop dragging when tab becomes hidden (visibilitychange)", () => {
    const onModuleClick = vi.fn();
    render(<Sidebar activeModule="dashboard" onModuleClick={onModuleClick} />);

    const sidebar = screen.getByTestId("sidebar");
    const dragHandle = screen.getByTestId("sidebar-drag-handle");

    // Start dragging
    act(() => {
      dragHandle.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
          clientX: 240,
        }),
      );
    });

    // Move mouse
    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: 300,
        }),
      );
    });

    // Simulate tab becoming hidden
    act(() => {
      Object.defineProperty(document, "hidden", {
        writable: true,
        configurable: true,
        value: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    // Try to move mouse again - should NOT resize
    const widthBeforeSecondMove = sidebar.style.width;
    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: 400,
        }),
      );
    });

    expect(sidebar.style.width).toBe(widthBeforeSecondMove);

    // Cleanup
    Object.defineProperty(document, "hidden", {
      writable: true,
      configurable: true,
      value: false,
    });
  });

  it("should stop dragging on mouseup event", () => {
    const onModuleClick = vi.fn();
    render(<Sidebar activeModule="dashboard" onModuleClick={onModuleClick} />);

    const sidebar = screen.getByTestId("sidebar");
    const dragHandle = screen.getByTestId("sidebar-drag-handle");

    // Start dragging
    act(() => {
      dragHandle.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
          clientX: 240,
        }),
      );
    });

    // Move mouse
    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: 300,
        }),
      );
    });

    // Release mouse
    act(() => {
      window.dispatchEvent(
        new MouseEvent("mouseup", {
          bubbles: true,
        }),
      );
    });

    // Try to move mouse again - should NOT resize
    const widthAfterMouseUp = sidebar.style.width;
    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: 400,
        }),
      );
    });

    expect(sidebar.style.width).toBe(widthAfterMouseUp);
  });

  it("should enforce minimum width of 160px during drag", () => {
    const onModuleClick = vi.fn();
    render(<Sidebar activeModule="dashboard" onModuleClick={onModuleClick} />);

    const sidebar = screen.getByTestId("sidebar");
    const dragHandle = screen.getByTestId("sidebar-drag-handle");

    // Start dragging from position 240
    act(() => {
      dragHandle.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
          clientX: 240,
        }),
      );
    });

    // Try to drag far to the left (should be constrained to 160px)
    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: 50, // Very small width
        }),
      );
    });

    // Parse the width value
    const width = parseInt(sidebar.style.width);
    expect(width).toBeGreaterThanOrEqual(160);

    // Cleanup
    act(() => {
      window.dispatchEvent(new MouseEvent("mouseup"));
    });
  });

  it("should not resize when collapsed", () => {
    const onModuleClick = vi.fn();
    render(<Sidebar activeModule="dashboard" onModuleClick={onModuleClick} />);

    const sidebar = screen.getByTestId("sidebar");
    const dragHandle = screen.getByTestId("sidebar-drag-handle");

    // Collapse sidebar by double-clicking the rail
    act(() => {
      dragHandle.dispatchEvent(
        new MouseEvent("dblclick", {
          bubbles: true,
        }),
      );
    });

    // Verify collapsed (should be 48px)
    expect(sidebar.style.width).toBe("48px");

    // Try to drag (should not work when collapsed)
    act(() => {
      dragHandle.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
          clientX: 48,
        }),
      );
    });

    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: 200,
        }),
      );
    });

    // Width should still be 48px (collapsed)
    expect(sidebar.style.width).toBe("48px");

    // Cleanup
    act(() => {
      window.dispatchEvent(new MouseEvent("mouseup"));
    });
  });
});
