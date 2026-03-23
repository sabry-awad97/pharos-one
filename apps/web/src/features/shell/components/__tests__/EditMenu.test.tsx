import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { EditMenu } from "../EditMenu";

describe("EditMenu", () => {
  it("should render all menu items", () => {
    render(<EditMenu onClose={() => {}} />);

    expect(screen.getByText("Undo")).toBeInTheDocument();
    expect(screen.getByText("Redo")).toBeInTheDocument();
    expect(screen.getByText("Cut")).toBeInTheDocument();
    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(screen.getByText("Paste")).toBeInTheDocument();
    expect(screen.getByText("Find")).toBeInTheDocument();
    expect(screen.getByText("Replace")).toBeInTheDocument();
  });

  it("should display keyboard shortcuts", () => {
    render(<EditMenu onClose={() => {}} />);

    expect(screen.getByText("Ctrl+Z")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+Y")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+X")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+C")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+V")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+F")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+H")).toBeInTheDocument();
  });

  it("should call onUndo and onClose when Undo is clicked", async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    const onClose = vi.fn();

    render(<EditMenu onClose={onClose} onUndo={onUndo} />);

    await user.click(screen.getByText("Undo"));

    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onCopy and onClose when Copy is clicked", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    const onClose = vi.fn();

    render(<EditMenu onClose={onClose} onCopy={onCopy} />);

    await user.click(screen.getByText("Copy"));

    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onFind and onClose when Find is clicked", async () => {
    const user = userEvent.setup();
    const onFind = vi.fn();
    const onClose = vi.fn();

    render(<EditMenu onClose={onClose} onFind={onFind} />);

    await user.click(screen.getByText("Find"));

    expect(onFind).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onReplace and onClose when Replace is clicked", async () => {
    const user = userEvent.setup();
    const onReplace = vi.fn();
    const onClose = vi.fn();

    render(<EditMenu onClose={onClose} onReplace={onReplace} />);

    await user.click(screen.getByText("Replace"));

    expect(onReplace).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
