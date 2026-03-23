import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { DataTableEmptyState } from "../DataTableEmptyState";

describe("DataTableEmptyState", () => {
  describe("Default State", () => {
    it("should render default message when no filters", () => {
      render(<DataTableEmptyState />);

      expect(screen.getByText("No items to display")).toBeInTheDocument();
      expect(screen.getByText("Add items to get started")).toBeInTheDocument();
    });

    it("should render icon", () => {
      render(<DataTableEmptyState />);

      // Check for icon container using shadcn/ui Empty structure
      const iconContainer = screen.getByText(
        "No items to display",
      ).previousElementSibling;
      expect(iconContainer).toHaveClass("mb-2", "bg-muted");
      expect(iconContainer).toHaveAttribute("data-slot", "empty-icon");
    });

    it("should not show clear filters button when no filters", () => {
      render(<DataTableEmptyState />);

      expect(
        screen.queryByRole("button", { name: /clear all filters/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Filtered State", () => {
    it("should render filtered message when hasFilters is true", () => {
      render(<DataTableEmptyState hasFilters={true} />);

      expect(
        screen.getByText("No items match your filters"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Try adjusting your filters to see more results"),
      ).toBeInTheDocument();
    });

    it("should show clear filters button when hasFilters is true and callback provided", () => {
      const onClearFilters = vi.fn();
      render(
        <DataTableEmptyState
          hasFilters={true}
          onClearFilters={onClearFilters}
        />,
      );

      const clearButton = screen.getByRole("button", {
        name: /clear all filters/i,
      });
      expect(clearButton).toBeInTheDocument();
    });

    it("should call onClearFilters when button clicked", async () => {
      const user = userEvent.setup();
      const onClearFilters = vi.fn();
      render(
        <DataTableEmptyState
          hasFilters={true}
          onClearFilters={onClearFilters}
        />,
      );

      const clearButton = screen.getByRole("button", {
        name: /clear all filters/i,
      });
      await user.click(clearButton);

      expect(onClearFilters).toHaveBeenCalledTimes(1);
    });

    it("should not show clear filters button when hasFilters is true but no callback", () => {
      render(<DataTableEmptyState hasFilters={true} />);

      expect(
        screen.queryByRole("button", { name: /clear all filters/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Custom Props", () => {
    it("should render custom message", () => {
      render(<DataTableEmptyState message="Custom empty message" />);

      expect(screen.getByText("Custom empty message")).toBeInTheDocument();
    });

    it("should render custom icon", () => {
      render(
        <DataTableEmptyState
          icon={<div data-testid="custom-icon">Custom Icon</div>}
        />,
      );

      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
      expect(screen.getByText("Custom Icon")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper button accessibility", () => {
      const onClearFilters = vi.fn();
      render(
        <DataTableEmptyState
          hasFilters={true}
          onClearFilters={onClearFilters}
        />,
      );

      const clearButton = screen.getByRole("button", {
        name: /clear all filters/i,
      });
      expect(clearButton).toHaveAttribute("class");
      // shadcn/ui Button uses focus-visible:ring-2 instead of focus:ring-2
      expect(clearButton.className).toContain("focus-visible:ring-2");
    });
  });

  describe("Layout", () => {
    it("should have centered layout", () => {
      const { container } = render(<DataTableEmptyState />);

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
      );
      expect(mainDiv).toHaveAttribute("data-slot", "empty");
    });

    it("should have proper spacing", () => {
      const { container } = render(<DataTableEmptyState />);

      const mainDiv = container.firstChild as HTMLElement;
      // shadcn/ui Empty uses p-6 instead of py-12 px-4
      expect(mainDiv).toHaveClass("p-6");
    });
  });
});
