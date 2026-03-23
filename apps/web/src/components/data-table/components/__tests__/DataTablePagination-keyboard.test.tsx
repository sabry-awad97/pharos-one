/**
 * DataTablePagination Keyboard Navigation Tests
 * Tests keyboard navigation and accessibility features for pagination
 */

import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { DataTableProvider } from "../../context/DataTableContext";
import { DataTablePagination } from "../DataTablePagination";
import type { ColumnDef } from "@tanstack/react-table";

// Mock data for testing
interface TestData {
  id: number;
  name: string;
  value: number;
}

const mockData: TestData[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  value: (i + 1) * 10,
}));

const mockColumns: ColumnDef<TestData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
];

describe("DataTablePagination - Keyboard Navigation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderComponent = (data = mockData) => {
    const user = userEvent.setup();
    const result = render(
      <DataTableProvider
        columns={mockColumns}
        data={data}
        getRowId={(row) => row.id}
      >
        <DataTablePagination />
      </DataTableProvider>,
    );
    return { ...result, user };
  };

  describe("Arrow Key Navigation", () => {
    it("should navigate to next page when ArrowRight is pressed", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const previousButton = within(nav).getByRole("button", {
        name: /previous/i,
      });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      // Focus a pagination button
      nextButton.focus();

      // Press ArrowRight
      await user.keyboard("{ArrowRight}");

      // Should be on page 2 (Previous button enabled)
      await waitFor(() => {
        expect(previousButton).not.toBeDisabled();
      });
    });

    it("should navigate to previous page when ArrowLeft is pressed", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });
      const previousButton = within(nav).getByRole("button", {
        name: /previous/i,
      });

      // Navigate to page 2 first
      await user.click(nextButton);

      await waitFor(() => {
        expect(previousButton).not.toBeDisabled();
      });

      // Focus a pagination button
      previousButton.focus();

      // Press ArrowLeft
      await user.keyboard("{ArrowLeft}");

      // Should be back on page 1
      await waitFor(() => {
        expect(previousButton).toBeDisabled();
      });
    });

    it("should not navigate past first page with ArrowLeft", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const previousButton = within(nav).getByRole("button", {
        name: /previous/i,
      });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      // Focus a pagination button
      nextButton.focus();

      // Press ArrowLeft multiple times
      await user.keyboard("{ArrowLeft}");
      await user.keyboard("{ArrowLeft}");

      // Should still be on page 1
      expect(previousButton).toBeDisabled();
    });

    it("should not navigate past last page with ArrowRight", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      // Navigate to last page (100 items / 25 per page = 4 pages)
      await user.click(nextButton);
      await user.click(nextButton);
      await user.click(nextButton);

      await waitFor(() => {
        expect(nextButton).toBeDisabled();
      });

      // Focus a pagination button
      const previousButton = within(nav).getByRole("button", {
        name: /previous/i,
      });
      previousButton.focus();

      // Press ArrowRight
      await user.keyboard("{ArrowRight}");

      // Should still be on last page
      expect(nextButton).toBeDisabled();
    });
  });

  describe("Home and End Key Navigation", () => {
    it("should jump to first page when Home key is pressed", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });
      const previousButton = within(nav).getByRole("button", {
        name: /previous/i,
      });

      // Navigate to page 3
      await user.click(nextButton);
      await user.click(nextButton);

      await waitFor(() => {
        expect(previousButton).not.toBeDisabled();
      });

      // Focus a pagination button
      previousButton.focus();

      // Press Home
      await user.keyboard("{Home}");

      // Should be on page 1
      await waitFor(() => {
        expect(previousButton).toBeDisabled();
      });
    });

    it("should jump to last page when End key is pressed", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      // Focus a pagination button
      nextButton.focus();

      // Press End
      await user.keyboard("{End}");

      // Should be on last page (Next button disabled)
      await waitFor(() => {
        expect(nextButton).toBeDisabled();
      });
    });
  });

  describe("Enter Key Activation", () => {
    it("should activate focused pagination button with Enter key", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });
      const previousButton = within(nav).getByRole("button", {
        name: /previous/i,
      });

      // Tab to Next button and press Enter
      await user.tab();
      await user.tab();
      await user.tab();
      await user.tab(); // Should be on Next button

      await user.keyboard("{Enter}");

      // Should be on page 2
      await waitFor(() => {
        expect(previousButton).not.toBeDisabled();
      });
    });
  });

  describe("Tab Key Navigation", () => {
    it("should cycle through pagination controls in logical order", async () => {
      const { user } = renderComponent();

      const pageSizeSelect = screen.getByRole("combobox");
      const goToPageInput = screen.getByRole("textbox", {
        name: /go to page/i,
      });
      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const page1Button = within(nav).getByRole("button", {
        name: /go to page 1/i,
      });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      // Tab through controls
      await user.tab(); // Page size select
      expect(pageSizeSelect).toHaveFocus();

      await user.tab(); // Go to page input
      expect(goToPageInput).toHaveFocus();

      // Previous button is disabled on page 1, so it's skipped
      await user.tab(); // Page 1 button
      expect(page1Button).toHaveFocus();

      // Tab through remaining page number buttons (2, 3, 4)
      await user.tab(); // Page 2
      await user.tab(); // Page 3
      await user.tab(); // Page 4

      await user.tab(); // Next button
      expect(nextButton).toHaveFocus();
    });
  });

  describe("Focus Indicators", () => {
    it("should show visible focus indicator on Previous button", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      // Navigate to page 2 first so Previous button is enabled
      await user.click(nextButton);

      await waitFor(() => {
        const previousButton = within(nav).getByRole("button", {
          name: /previous/i,
        });
        expect(previousButton).not.toBeDisabled();
      });

      const previousButton = within(nav).getByRole("button", {
        name: /previous/i,
      });

      // Tab to Previous button (skip page size, go to page, then Previous)
      await user.tab();
      await user.tab();
      await user.tab();
      await user.tab();

      expect(previousButton).toHaveFocus();
      expect(previousButton).toHaveClass("focus:ring-2");
    });

    it("should show visible focus indicator on Next button", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      // Tab to Next button (skip page size, go to page, and 4 page buttons)
      await user.tab();
      await user.tab();
      await user.tab(); // Page 1
      await user.tab(); // Page 2
      await user.tab(); // Page 3
      await user.tab(); // Page 4
      await user.tab(); // Next button

      expect(nextButton).toHaveFocus();
      expect(nextButton).toHaveClass("focus:ring-2");
    });

    it("should show visible focus indicator on page number buttons", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });

      // Tab to first page button (skip page size and go to page)
      await user.tab();
      await user.tab();
      await user.tab();

      const pageButton = within(nav).getByRole("button", {
        name: /go to page 1/i,
      });

      expect(pageButton).toHaveFocus();
      expect(pageButton).toHaveClass("focus:ring-2");
    });
  });

  describe("ARIA Labels", () => {
    it("should have descriptive ARIA label on pagination navigation", () => {
      renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      expect(nav).toHaveAttribute("aria-label", "pagination");
    });

    it("should have ARIA labels describing page state on page buttons", () => {
      renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });

      // Check page 1 button
      const page1Button = within(nav).getByRole("button", {
        name: /go to page 1/i,
      });
      expect(page1Button).toHaveAttribute("aria-label", "Go to page 1");

      // Check page 2 button
      const page2Button = within(nav).getByRole("button", {
        name: /go to page 2/i,
      });
      expect(page2Button).toHaveAttribute("aria-label", "Go to page 2");
    });

    it("should have aria-current on active page button", () => {
      renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const page1Button = within(nav).getByRole("button", {
        name: /go to page 1/i,
      });

      expect(page1Button).toHaveAttribute("aria-current", "page");
    });

    it("should update aria-current when page changes", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      // Navigate to page 2
      await user.click(nextButton);

      await waitFor(() => {
        const page2Button = within(nav).getByRole("button", {
          name: /go to page 2/i,
        });
        expect(page2Button).toHaveAttribute("aria-current", "page");
      });

      // Page 1 should not have aria-current
      const page1Button = within(nav).getByRole("button", {
        name: /go to page 1/i,
      });
      expect(page1Button).not.toHaveAttribute("aria-current");
    });
  });

  describe("Screen Reader Announcements", () => {
    it("should have ARIA live region for page change announcements", () => {
      renderComponent();

      // Look for aria-live region
      const liveRegion = screen.getByRole("status");
      expect(liveRegion).toHaveAttribute("aria-live", "polite");
    });

    it("should announce page changes to screen readers", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });
      const liveRegion = screen.getByRole("status");

      // Navigate to page 2
      await user.click(nextButton);

      // Check that live region announces the change
      await waitFor(() => {
        expect(liveRegion).toHaveTextContent(/page 2/i);
      });
    });
  });
});
