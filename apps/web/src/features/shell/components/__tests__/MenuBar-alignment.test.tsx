/**
 * MenuBar alignment tests
 * Verifies that menu dropdowns align with their menu items
 */

import { render, screen } from "@testing-library/react";
import { MenuBar } from "../MenuBar";
import { describe, it, expect, vi } from "vitest";

describe("MenuBar dropdown alignment", () => {
  it("aligns File menu dropdown with File menu item", () => {
    const onMenuClick = vi.fn();

    const { container } = render(
      <MenuBar activeMenu="file" onMenuClick={onMenuClick} />,
    );

    // Get File menu item position
    const fileButton = screen.getByRole("button", { name: /file/i });
    const fileButtonRect = fileButton.getBoundingClientRect();

    // Get File menu dropdown wrapper position
    const fileDropdown = container.querySelector(
      '[style*="position: absolute"]',
    );
    expect(fileDropdown).toBeTruthy();

    const dropdownRect = fileDropdown!.getBoundingClientRect();

    // Verify alignment: dropdown left edge matches button left edge
    expect(dropdownRect.left).toBe(fileButtonRect.left);
  });

  it("aligns Edit menu dropdown with Edit menu item", () => {
    const onMenuClick = vi.fn();

    const { container } = render(
      <MenuBar activeMenu="edit" onMenuClick={onMenuClick} />,
    );

    // Get Edit menu item position
    const editButton = screen.getByRole("button", { name: /edit/i });
    const editButtonRect = editButton.getBoundingClientRect();

    // Get Edit menu dropdown wrapper position
    const editDropdown = container.querySelector(
      '[style*="position: absolute"]',
    );
    expect(editDropdown).toBeTruthy();

    const dropdownRect = editDropdown!.getBoundingClientRect();

    // Verify alignment: dropdown left edge matches button left edge
    expect(dropdownRect.left).toBe(editButtonRect.left);
  });

  it("aligns View menu dropdown with View menu item", () => {
    const onMenuClick = vi.fn();

    const { container } = render(
      <MenuBar activeMenu="view" onMenuClick={onMenuClick} />,
    );

    // Get View menu item position
    const viewButton = screen.getByRole("button", { name: /view/i });
    const viewButtonRect = viewButton.getBoundingClientRect();

    // Get View menu dropdown wrapper position
    const viewDropdown = container.querySelector(
      '[style*="position: absolute"]',
    );
    expect(viewDropdown).toBeTruthy();

    const dropdownRect = viewDropdown!.getBoundingClientRect();

    // Verify alignment: dropdown left edge matches button left edge
    expect(dropdownRect.left).toBe(viewButtonRect.left);
  });
});
