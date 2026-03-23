import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { ViewMenu } from "../ViewMenu";

describe("ViewMenu", () => {
  it("should render all menu items", () => {
    render(<ViewMenu onClose={() => {}} />);

    expect(screen.getByText("Toggle Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Toggle Status Bar")).toBeInTheDocument();
    expect(screen.getByText("Toggle Toolbar")).toBeInTheDocument();
    expect(screen.getByText("Zoom In")).toBeInTheDocument();
    expect(screen.getByText("Zoom Out")).toBeInTheDocument();
    expect(screen.getByText("Reset Zoom")).toBeInTheDocument();
  });

  it("should display keyboard shortcuts for all menu items", () => {
    render(<ViewMenu onClose={() => {}} />);

    expect(screen.getByText("Ctrl+B")).toBeInTheDocument();
    expect(screen.getByText("Ctrl++")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+-")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+0")).toBeInTheDocument();
  });

  it("should call onToggleSidebar and onClose when Toggle Sidebar is clicked", async () => {
    const user = userEvent.setup();
    const onToggleSidebar = vi.fn();
    const onClose = vi.fn();

    render(<ViewMenu onClose={onClose} onToggleSidebar={onToggleSidebar} />);

    await user.click(screen.getByText("Toggle Sidebar"));

    expect(onToggleSidebar).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onToggleStatusBar and onClose when Toggle Status Bar is clicked", async () => {
    const user = userEvent.setup();
    const onToggleStatusBar = vi.fn();
    const onClose = vi.fn();

    render(
      <ViewMenu onClose={onClose} onToggleStatusBar={onToggleStatusBar} />,
    );

    await user.click(screen.getByText("Toggle Status Bar"));

    expect(onToggleStatusBar).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onToggleToolbar and onClose when Toggle Toolbar is clicked", async () => {
    const user = userEvent.setup();
    const onToggleToolbar = vi.fn();
    const onClose = vi.fn();

    render(<ViewMenu onClose={onClose} onToggleToolbar={onToggleToolbar} />);

    await user.click(screen.getByText("Toggle Toolbar"));

    expect(onToggleToolbar).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onZoomIn and onClose when Zoom In is clicked", async () => {
    const user = userEvent.setup();
    const onZoomIn = vi.fn();
    const onClose = vi.fn();

    render(<ViewMenu onClose={onClose} onZoomIn={onZoomIn} />);

    await user.click(screen.getByText("Zoom In"));

    expect(onZoomIn).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onZoomOut and onClose when Zoom Out is clicked", async () => {
    const user = userEvent.setup();
    const onZoomOut = vi.fn();
    const onClose = vi.fn();

    render(<ViewMenu onClose={onClose} onZoomOut={onZoomOut} />);

    await user.click(screen.getByText("Zoom Out"));

    expect(onZoomOut).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onResetZoom and onClose when Reset Zoom is clicked", async () => {
    const user = userEvent.setup();
    const onResetZoom = vi.fn();
    const onClose = vi.fn();

    render(<ViewMenu onClose={onClose} onResetZoom={onResetZoom} />);

    await user.click(screen.getByText("Reset Zoom"));

    expect(onResetZoom).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should match Windows Fluent Design aesthetic", () => {
    const { container } = render(<ViewMenu onClose={() => {}} />);

    const menuContainer = container.firstChild as HTMLElement;
    expect(menuContainer).toHaveStyle({
      background: "#ffffff",
      border: "1px solid #d1d1d1",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    });
  });
});
