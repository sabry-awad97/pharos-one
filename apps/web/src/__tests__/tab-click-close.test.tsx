import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TabItem } from "@/features/workspace/components/TabItem";
import { Package } from "lucide-react";

describe("Tab Click and Close Behavior", () => {
  it("should call onTabClick when clicking the tab", async () => {
    const user = userEvent.setup();
    const onTabClick = vi.fn();
    const onTabClose = vi.fn();

    render(
      <TabItem
        tab={{
          id: "1",
          label: "Test Tab",
          icon: Package,
          module: "test",
          unsaved: false,
          pinned: false,
        }}
        active={false}
        onClick={onTabClick}
        onClose={onTabClose}
      />,
    );

    const tab = screen.getByRole("tab");
    await user.click(tab);

    expect(onTabClick).toHaveBeenCalledTimes(1);
    expect(onTabClose).not.toHaveBeenCalled();
  });

  it("should call onTabClose when clicking the close button", async () => {
    const user = userEvent.setup();
    const onTabClick = vi.fn();
    const onTabClose = vi.fn();

    render(
      <TabItem
        tab={{
          id: "1",
          label: "Test Tab",
          icon: Package,
          module: "test",
          unsaved: false,
          pinned: false,
        }}
        active={true}
        onClick={onTabClick}
        onClose={onTabClose}
      />,
    );

    // Close button should be visible when active
    const closeButton = screen.getByRole("button", { name: "" });
    await user.click(closeButton);

    expect(onTabClose).toHaveBeenCalledTimes(1);
    expect(onTabClick).not.toHaveBeenCalled();
  });

  it("should not call onTabClick when clicking close button", async () => {
    const user = userEvent.setup();
    const onTabClick = vi.fn();
    const onTabClose = vi.fn();

    render(
      <TabItem
        tab={{
          id: "1",
          label: "Test Tab",
          icon: Package,
          module: "test",
          unsaved: false,
          pinned: false,
        }}
        active={true}
        onClick={onTabClick}
        onClose={onTabClose}
      />,
    );

    const closeButton = screen.getByRole("button", { name: "" });
    await user.click(closeButton);

    // Close button click should NOT trigger tab click
    expect(onTabClose).toHaveBeenCalledTimes(1);
    expect(onTabClick).not.toHaveBeenCalled();
  });
});
