import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MenuBar } from "../MenuBar";

describe("MenuBar hover behavior", () => {
  it("should open Edit menu when hovering over Edit while File menu is open", async () => {
    const user = userEvent.setup();
    const onMenuClick = vi.fn();

    render(<MenuBar activeMenu="file" onMenuClick={onMenuClick} />);

    // Hover over Edit menu item
    const editButton = screen.getByRole("button", { name: /edit/i });
    await user.hover(editButton);

    // Should call onMenuClick with "edit"
    expect(onMenuClick).toHaveBeenCalledWith("edit");
  });

  it("should not open menu on hover when no menu is active", async () => {
    const user = userEvent.setup();
    const onMenuClick = vi.fn();

    render(<MenuBar activeMenu={null} onMenuClick={onMenuClick} />);

    // Hover over Edit menu item
    const editButton = screen.getByRole("button", { name: /edit/i });
    await user.hover(editButton);

    // Should NOT call onMenuClick
    expect(onMenuClick).not.toHaveBeenCalled();
  });

  it("should switch between multiple menus on hover", async () => {
    const user = userEvent.setup();
    const onMenuClick = vi.fn();

    render(<MenuBar activeMenu="file" onMenuClick={onMenuClick} />);

    // Hover over Edit
    const editButton = screen.getByRole("button", { name: /edit/i });
    await user.hover(editButton);
    expect(onMenuClick).toHaveBeenCalledWith("edit");

    // Hover over View
    const viewButton = screen.getByRole("button", { name: /view/i });
    await user.hover(viewButton);
    expect(onMenuClick).toHaveBeenCalledWith("view");

    // Hover over Tools
    const toolsButton = screen.getByRole("button", { name: /tools/i });
    await user.hover(toolsButton);
    expect(onMenuClick).toHaveBeenCalledWith("tools");
  });
});
