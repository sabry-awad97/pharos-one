/**
 * WorkspaceTemplatePicker component tests
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { WorkspaceTemplatePicker } from "../WorkspaceTemplatePicker";

describe("WorkspaceTemplatePicker", () => {
  const defaultProps = {
    open: true,
    onSelect: vi.fn(),
    onSkip: vi.fn(),
    dontShowAgain: false,
    onDontShowAgainChange: vi.fn(),
  };

  it("should not render when open is false", () => {
    render(<WorkspaceTemplatePicker {...defaultProps} open={false} />);

    expect(
      screen.queryByTestId("workspace-template-picker"),
    ).not.toBeInTheDocument();
  });

  it("should render when open is true", () => {
    render(<WorkspaceTemplatePicker {...defaultProps} />);

    expect(screen.getByTestId("workspace-template-picker")).toBeInTheDocument();
  });

  it("should render modal title and description", () => {
    render(<WorkspaceTemplatePicker {...defaultProps} />);

    expect(screen.getByText("Choose a workspace template")).toBeInTheDocument();
    expect(
      screen.getByText(/Select a template to quickly set up your workspace/),
    ).toBeInTheDocument();
  });

  describe("template cards", () => {
    it("should render 4 template cards", () => {
      render(<WorkspaceTemplatePicker {...defaultProps} />);

      expect(
        screen.getByTestId("template-card-pharmacist"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("template-card-cashier")).toBeInTheDocument();
      expect(screen.getByTestId("template-card-manager")).toBeInTheDocument();
      expect(screen.getByTestId("template-card-custom")).toBeInTheDocument();
    });

    it("should display template names", () => {
      render(<WorkspaceTemplatePicker {...defaultProps} />);

      expect(screen.getByText("Pharmacist")).toBeInTheDocument();
      expect(screen.getByText("Cashier")).toBeInTheDocument();
      expect(screen.getByText("Manager")).toBeInTheDocument();
      expect(screen.getByText("Custom")).toBeInTheDocument();
    });

    it("should display template descriptions", () => {
      render(<WorkspaceTemplatePicker {...defaultProps} />);

      expect(
        screen.getByText("Prescriptions, inventory, and reports"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("POS, inventory, and dashboard"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Dashboard, reports, inventory, and staff"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Start with an empty workspace"),
      ).toBeInTheDocument();
    });

    it("should display tab previews for templates with tabs", () => {
      render(<WorkspaceTemplatePicker {...defaultProps} />);

      // Check for unique tabs from each template
      expect(screen.getByText("Prescriptions")).toBeInTheDocument();
      expect(screen.getByText("Point of Sale")).toBeInTheDocument();
      expect(screen.getByText("Staff")).toBeInTheDocument();

      // Check that common tabs appear multiple times
      expect(screen.getAllByText("Inventory").length).toBeGreaterThan(1);
    });

    it("should display empty state for custom template", () => {
      render(<WorkspaceTemplatePicker {...defaultProps} />);

      expect(screen.getByText("Build your own workspace")).toBeInTheDocument();
    });
  });

  describe("template selection", () => {
    it("should call onSelect with pharmacist id when pharmacist card is clicked", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<WorkspaceTemplatePicker {...defaultProps} onSelect={onSelect} />);

      const card = screen.getByTestId("template-card-pharmacist");
      await user.click(card);

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith("pharmacist");
    });

    it("should call onSelect with cashier id when cashier card is clicked", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<WorkspaceTemplatePicker {...defaultProps} onSelect={onSelect} />);

      const card = screen.getByTestId("template-card-cashier");
      await user.click(card);

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith("cashier");
    });

    it("should call onSelect with manager id when manager card is clicked", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<WorkspaceTemplatePicker {...defaultProps} onSelect={onSelect} />);

      const card = screen.getByTestId("template-card-manager");
      await user.click(card);

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith("manager");
    });

    it("should call onSelect with custom id when custom card is clicked", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<WorkspaceTemplatePicker {...defaultProps} onSelect={onSelect} />);

      const card = screen.getByTestId("template-card-custom");
      await user.click(card);

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith("custom");
    });
  });

  describe("skip button", () => {
    it("should render skip button", () => {
      render(<WorkspaceTemplatePicker {...defaultProps} />);

      expect(screen.getByTestId("skip-button")).toBeInTheDocument();
      expect(screen.getByTestId("skip-button")).toHaveTextContent("Skip");
    });

    it("should call onSkip when skip button is clicked", async () => {
      const user = userEvent.setup();
      const onSkip = vi.fn();

      render(<WorkspaceTemplatePicker {...defaultProps} onSkip={onSkip} />);

      const button = screen.getByTestId("skip-button");
      await user.click(button);

      expect(onSkip).toHaveBeenCalledTimes(1);
    });

    it("should call onSkip when clicking overlay background", async () => {
      const user = userEvent.setup();
      const onSkip = vi.fn();

      render(<WorkspaceTemplatePicker {...defaultProps} onSkip={onSkip} />);

      const overlay = screen.getByTestId("workspace-template-picker");
      await user.click(overlay);

      expect(onSkip).toHaveBeenCalledTimes(1);
    });
  });

  describe("don't show again checkbox", () => {
    it("should render checkbox", () => {
      render(<WorkspaceTemplatePicker {...defaultProps} />);

      expect(
        screen.getByTestId("dont-show-again-checkbox"),
      ).toBeInTheDocument();
      expect(screen.getByText("Don't show this again")).toBeInTheDocument();
    });

    it("should be unchecked when dontShowAgain is false", () => {
      render(
        <WorkspaceTemplatePicker {...defaultProps} dontShowAgain={false} />,
      );

      const checkbox = screen.getByTestId(
        "dont-show-again-checkbox",
      ) as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
    });

    it("should be checked when dontShowAgain is true", () => {
      render(
        <WorkspaceTemplatePicker {...defaultProps} dontShowAgain={true} />,
      );

      const checkbox = screen.getByTestId(
        "dont-show-again-checkbox",
      ) as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it("should call onDontShowAgainChange with true when checked", async () => {
      const user = userEvent.setup();
      const onDontShowAgainChange = vi.fn();

      render(
        <WorkspaceTemplatePicker
          {...defaultProps}
          dontShowAgain={false}
          onDontShowAgainChange={onDontShowAgainChange}
        />,
      );

      const checkbox = screen.getByTestId("dont-show-again-checkbox");
      await user.click(checkbox);

      expect(onDontShowAgainChange).toHaveBeenCalledTimes(1);
      expect(onDontShowAgainChange).toHaveBeenCalledWith(true);
    });

    it("should call onDontShowAgainChange with false when unchecked", async () => {
      const user = userEvent.setup();
      const onDontShowAgainChange = vi.fn();

      render(
        <WorkspaceTemplatePicker
          {...defaultProps}
          dontShowAgain={true}
          onDontShowAgainChange={onDontShowAgainChange}
        />,
      );

      const checkbox = screen.getByTestId("dont-show-again-checkbox");
      await user.click(checkbox);

      expect(onDontShowAgainChange).toHaveBeenCalledTimes(1);
      expect(onDontShowAgainChange).toHaveBeenCalledWith(false);
    });
  });

  describe("modal behavior", () => {
    it("should not close when clicking inside modal content", async () => {
      const user = userEvent.setup();
      const onSkip = vi.fn();

      render(<WorkspaceTemplatePicker {...defaultProps} onSkip={onSkip} />);

      const modalContent = screen.getByText("Choose a workspace template");
      await user.click(modalContent);

      expect(onSkip).not.toHaveBeenCalled();
    });
  });
});
