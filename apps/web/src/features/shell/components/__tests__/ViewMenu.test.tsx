import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { ViewMenu } from "../ViewMenu";

// Mock useTheme hook
const mockSetTheme = vi.fn();
vi.mock("@/components/theme-provider", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: mockSetTheme,
  }),
}));

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

  describe("Theme Switcher", () => {
    beforeEach(() => {
      mockSetTheme.mockClear();
    });

    it("should render theme menu item", () => {
      render(<ViewMenu onClose={() => {}} />);

      expect(screen.getByText("Theme")).toBeInTheDocument();
    });

    it("should show theme submenu on hover with Light, Dark, and Auto options", async () => {
      const user = userEvent.setup();
      render(<ViewMenu onClose={() => {}} />);

      const themeMenuItem = screen.getByText("Theme").parentElement;
      if (themeMenuItem) {
        await user.hover(themeMenuItem);
      }

      expect(screen.getByText("Light")).toBeInTheDocument();
      expect(screen.getByText("Dark")).toBeInTheDocument();
      expect(screen.getByText("Auto (System)")).toBeInTheDocument();
    });

    it("should call setTheme and onClose when Light is clicked", async () => {
      const onClose = vi.fn();

      render(<ViewMenu onClose={onClose} />);

      const themeMenuItem = screen
        .getByText("Theme")
        .closest("div[style*='position: relative']");
      expect(themeMenuItem).toBeTruthy();

      // Trigger mouse enter to show submenu
      fireEvent.mouseEnter(themeMenuItem!);

      // Wait for submenu to appear
      await waitFor(() => {
        expect(screen.getByText("Light")).toBeInTheDocument();
      });

      // Click the Light option
      const lightOption = screen.getByText("Light");
      fireEvent.click(lightOption);

      expect(mockSetTheme).toHaveBeenCalledWith("light");
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should call setTheme and onClose when Dark is clicked", async () => {
      const onClose = vi.fn();

      render(<ViewMenu onClose={onClose} />);

      const themeMenuItem = screen
        .getByText("Theme")
        .closest("div[style*='position: relative']");
      expect(themeMenuItem).toBeTruthy();

      fireEvent.mouseEnter(themeMenuItem!);

      await waitFor(() => {
        expect(screen.getByText("Dark")).toBeInTheDocument();
      });

      const darkOption = screen.getByText("Dark");
      fireEvent.click(darkOption);

      expect(mockSetTheme).toHaveBeenCalledWith("dark");
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should call setTheme and onClose when Auto is clicked", async () => {
      const onClose = vi.fn();

      render(<ViewMenu onClose={onClose} />);

      const themeMenuItem = screen
        .getByText("Theme")
        .closest("div[style*='position: relative']");
      expect(themeMenuItem).toBeTruthy();

      fireEvent.mouseEnter(themeMenuItem!);

      await waitFor(() => {
        expect(screen.getByText("Auto (System)")).toBeInTheDocument();
      });

      const autoOption = screen.getByText("Auto (System)");
      fireEvent.click(autoOption);

      expect(mockSetTheme).toHaveBeenCalledWith("system");
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
