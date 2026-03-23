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
  });

  it("should display keyboard shortcut for Toggle Sidebar", () => {
    render(<ViewMenu onClose={() => {}} />);

    expect(screen.getByText("Ctrl+B")).toBeInTheDocument();
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
