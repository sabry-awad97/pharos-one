/**
 * EmptyWorkspaceState component tests
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { EmptyWorkspaceState } from "../EmptyWorkspaceState";

describe("EmptyWorkspaceState", () => {
  it("should render empty state message", () => {
    const onOpenDashboard = vi.fn();

    render(<EmptyWorkspaceState onOpenDashboard={onOpenDashboard} />);

    expect(screen.getByText("No tabs open")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Get started by opening a workspace or choosing from a template",
      ),
    ).toBeInTheDocument();
  });

  it("should render Open Dashboard button", () => {
    const onOpenDashboard = vi.fn();

    render(<EmptyWorkspaceState onOpenDashboard={onOpenDashboard} />);

    const button = screen.getByTestId("open-dashboard-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Open Dashboard");
  });

  it("should render Choose Template button", () => {
    const onOpenDashboard = vi.fn();

    render(<EmptyWorkspaceState onOpenDashboard={onOpenDashboard} />);

    const button = screen.getByTestId("choose-template-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Choose Template");
  });

  it("should call onOpenDashboard when Open Dashboard button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenDashboard = vi.fn();

    render(<EmptyWorkspaceState onOpenDashboard={onOpenDashboard} />);

    const button = screen.getByTestId("open-dashboard-button");
    await user.click(button);

    expect(onOpenDashboard).toHaveBeenCalledTimes(1);
  });

  it("should log to console when Choose Template button is clicked (default behavior)", async () => {
    const user = userEvent.setup();
    const onOpenDashboard = vi.fn();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<EmptyWorkspaceState onOpenDashboard={onOpenDashboard} />);

    const button = screen.getByTestId("choose-template-button");
    await user.click(button);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Template picker coming in Phase 4",
    );

    consoleSpy.mockRestore();
  });

  it("should call onChooseTemplate when provided", async () => {
    const user = userEvent.setup();
    const onOpenDashboard = vi.fn();
    const onChooseTemplate = vi.fn();

    render(
      <EmptyWorkspaceState
        onOpenDashboard={onOpenDashboard}
        onChooseTemplate={onChooseTemplate}
      />,
    );

    const button = screen.getByTestId("choose-template-button");
    await user.click(button);

    expect(onChooseTemplate).toHaveBeenCalledTimes(1);
  });
});
