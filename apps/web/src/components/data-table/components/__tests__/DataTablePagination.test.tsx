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

describe("DataTablePagination", () => {
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

  describe("Page Size Selector", () => {
    it("should display page size selector with default value of 25", async () => {
      renderComponent();

      const pageSizeSelect = screen.getByRole("combobox");
      expect(pageSizeSelect).toBeInTheDocument();
      expect(pageSizeSelect).toHaveTextContent("25 / page");
    });

    it("should display items per page label", () => {
      renderComponent();

      expect(screen.getByText("Items per page:")).toBeInTheDocument();
    });

    it("should change page size when selecting different option", async () => {
      const { user } = renderComponent();

      const pageSizeSelect = screen.getByRole("combobox");
      await user.click(pageSizeSelect);

      // Wait for dropdown to open and select 50
      await waitFor(() => {
        const option50 = screen.getByRole("option", { name: "50 / page" });
        expect(option50).toBeInTheDocument();
      });

      const option50 = screen.getByRole("option", { name: "50 / page" });
      await user.click(option50);

      // Verify page size changed
      await waitFor(() => {
        expect(pageSizeSelect).toHaveTextContent("50 / page");
      });
    });

    it("should reset to first page when changing page size", async () => {
      const { user } = renderComponent();

      // Navigate to page 2 first
      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", {
        name: /next/i,
      });
      await user.click(nextButton);

      // Change page size
      const pageSizeSelect = screen.getByRole("combobox");
      await user.click(pageSizeSelect);

      await waitFor(() => {
        const option50 = screen.getByRole("option", { name: "50 / page" });
        expect(option50).toBeInTheDocument();
      });

      const option50 = screen.getByRole("option", { name: "50 / page" });
      await user.click(option50);

      // Should be back on page 1 (Previous button disabled)
      await waitFor(() => {
        const previousButton = within(nav).getByRole("button", {
          name: /previous/i,
        });
        expect(previousButton).toBeDisabled();
      });
    });
  });

  describe("Navigation Controls", () => {
    it("should display Previous and Next buttons", () => {
      renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      expect(
        within(nav).getByRole("button", { name: /previous/i }),
      ).toBeInTheDocument();
      expect(
        within(nav).getByRole("button", { name: /next/i }),
      ).toBeInTheDocument();
    });

    it("should disable Previous button on first page", () => {
      renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const previousButton = within(nav).getByRole("button", {
        name: /previous/i,
      });

      expect(previousButton).toBeDisabled();
    });

    it("should enable Next button when more pages exist", () => {
      renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      expect(nextButton).not.toBeDisabled();
    });

    it("should navigate to next page when clicking Next button", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      await user.click(nextButton);

      // Previous button should now be enabled
      await waitFor(() => {
        const previousButton = within(nav).getByRole("button", {
          name: /previous/i,
        });
        expect(previousButton).not.toBeDisabled();
      });
    });

    it("should navigate to previous page when clicking Previous button", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });
      const previousButton = within(nav).getByRole("button", {
        name: /previous/i,
      });

      // Go to page 2
      await user.click(nextButton);

      await waitFor(() => {
        expect(previousButton).not.toBeDisabled();
      });

      // Go back to page 1
      await user.click(previousButton);

      await waitFor(() => {
        expect(previousButton).toBeDisabled();
      });
    });

    it("should disable Next button on last page", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      // Navigate to last page (100 items / 25 per page = 4 pages)
      await user.click(nextButton);
      await user.click(nextButton);
      await user.click(nextButton);

      // Next button should be disabled on page 4
      await waitFor(() => {
        expect(nextButton).toBeDisabled();
      });
    });
  });

  describe("Go to Page Input", () => {
    it("should display go to page input with label", () => {
      renderComponent();

      expect(screen.getByText("Go to page:")).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: /go to page/i }),
      ).toBeInTheDocument();
    });

    it("should have placeholder text", () => {
      renderComponent();

      const input = screen.getByRole("textbox", { name: /go to page/i });
      expect(input).toHaveAttribute("placeholder", "1");
    });

    it("should navigate to specified page on Enter key", async () => {
      const { user } = renderComponent();

      const input = screen.getByRole("textbox", { name: /go to page/i });

      await user.type(input, "3");
      await user.keyboard("{Enter}");

      // Input should be cleared
      await waitFor(() => {
        expect(input).toHaveValue("");
      });
    });

    it("should clear input after navigation", async () => {
      const { user } = renderComponent();

      const input = screen.getByRole("textbox", {
        name: /go to page/i,
      }) as HTMLInputElement;

      await user.type(input, "2");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(input.value).toBe("");
      });
    });

    it("should handle invalid page numbers gracefully", async () => {
      const { user } = renderComponent();

      const input = screen.getByRole("textbox", { name: /go to page/i });
      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const previousButton = within(nav).getByRole("button", {
        name: /previous/i,
      });

      // Try invalid page number
      await user.type(input, "0");
      await user.keyboard("{Enter}");

      // Should stay on page 1
      await waitFor(() => {
        expect(input).toHaveValue("");
        expect(previousButton).toBeDisabled();
      });
    });

    it("should navigate to last page when page number exceeds total", async () => {
      const { user } = renderComponent();

      const input = screen.getByRole("textbox", { name: /go to page/i });
      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      // Try page number beyond total (100 items / 25 per page = 4 pages)
      await user.type(input, "999");
      await user.keyboard("{Enter}");

      // Should be on last page (Next button disabled)
      await waitFor(() => {
        expect(input).toHaveValue("");
        expect(nextButton).toBeDisabled();
      });
    });

    it("should handle non-numeric input gracefully", async () => {
      const { user } = renderComponent();

      const input = screen.getByRole("textbox", { name: /go to page/i });
      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const previousButton = within(nav).getByRole("button", {
        name: /previous/i,
      });

      await user.type(input, "abc");
      await user.keyboard("{Enter}");

      // Should stay on page 1
      await waitFor(() => {
        expect(input).toHaveValue("");
        expect(previousButton).toBeDisabled();
      });
    });
  });

  describe("Items Count Display", () => {
    it("should display items count for first page", () => {
      renderComponent();

      expect(screen.getByText("Showing 1–25 of 100 items")).toBeInTheDocument();
    });

    it("should update items count when navigating pages", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      await user.click(nextButton);

      await waitFor(() => {
        expect(
          screen.getByText("Showing 26–50 of 100 items"),
        ).toBeInTheDocument();
      });
    });

    it("should display correct count on last page", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      // Navigate to last page
      await user.click(nextButton);
      await user.click(nextButton);
      await user.click(nextButton);

      await waitFor(() => {
        expect(
          screen.getByText("Showing 76–100 of 100 items"),
        ).toBeInTheDocument();
      });
    });

    it("should display 'No items' when data is empty", () => {
      render(
        <DataTableProvider
          columns={mockColumns}
          data={[]}
          getRowId={(row) => row.id}
        >
          <DataTablePagination />
        </DataTableProvider>,
      );

      expect(screen.getByText("No items")).toBeInTheDocument();
    });

    it("should update count when page size changes", async () => {
      const { user } = renderComponent();

      const pageSizeSelect = screen.getByRole("combobox");
      await user.click(pageSizeSelect);

      await waitFor(() => {
        const option50 = screen.getByRole("option", { name: "50 / page" });
        expect(option50).toBeInTheDocument();
      });

      const option50 = screen.getByRole("option", { name: "50 / page" });
      await user.click(option50);

      await waitFor(() => {
        expect(
          screen.getByText("Showing 1–50 of 100 items"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels on navigation", () => {
      renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      expect(nav).toHaveAttribute("aria-label", "pagination");
    });

    it("should have proper ARIA labels on buttons", () => {
      renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      expect(
        within(nav).getByRole("button", { name: /previous/i }),
      ).toHaveAttribute("aria-label", "Go to previous page");
      expect(
        within(nav).getByRole("button", { name: /next/i }),
      ).toHaveAttribute("aria-label", "Go to next page");
    });

    it("should have proper ARIA label on go to page input", () => {
      renderComponent();

      const input = screen.getByRole("textbox", { name: /go to page/i });
      expect(input).toHaveAttribute("aria-label", "Go to page number");
    });

    it("should have aria-live region for items count", () => {
      renderComponent();

      const itemsDisplay = screen.getByText(/Showing .* items/);
      expect(itemsDisplay).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Component Props", () => {
    it("should hide page size selector when showPageSize is false", () => {
      render(
        <DataTableProvider
          columns={mockColumns}
          data={mockData}
          getRowId={(row) => row.id}
        >
          <DataTablePagination showPageSize={false} />
        </DataTableProvider>,
      );

      expect(screen.queryByText("Items per page:")).not.toBeInTheDocument();
      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    });

    it("should hide go to page input when showGoToPage is false", () => {
      render(
        <DataTableProvider
          columns={mockColumns}
          data={mockData}
          getRowId={(row) => row.id}
        >
          <DataTablePagination showGoToPage={false} />
        </DataTableProvider>,
      );

      expect(screen.queryByText("Go to page:")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("textbox", { name: /go to page/i }),
      ).not.toBeInTheDocument();
    });

    it("should hide items count when showItemsCount is false", () => {
      render(
        <DataTableProvider
          columns={mockColumns}
          data={mockData}
          getRowId={(row) => row.id}
        >
          <DataTablePagination showItemsCount={false} />
        </DataTableProvider>,
      );

      expect(screen.queryByText(/Showing .* items/)).not.toBeInTheDocument();
    });

    it("should use custom page size options when provided", async () => {
      const customOptions = [
        { value: "10", label: "10 items" },
        { value: "20", label: "20 items" },
      ];

      const user = userEvent.setup();
      render(
        <DataTableProvider
          columns={mockColumns}
          data={mockData}
          getRowId={(row) => row.id}
        >
          <DataTablePagination pageSizeOptions={customOptions} />
        </DataTableProvider>,
      );

      const pageSizeSelect = screen.getByRole("combobox");
      await user.click(pageSizeSelect);

      await waitFor(() => {
        expect(
          screen.getByRole("option", { name: "10 items" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("option", { name: "20 items" }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Layout and Styling", () => {
    it("should render with proper layout structure", () => {
      renderComponent();

      const container = screen.getByRole("navigation", {
        name: /pagination/i,
      }).parentElement;

      expect(container).toHaveClass("flex-none");
      expect(container).toHaveClass("flex");
      expect(container).toHaveClass("items-center");
      expect(container).toHaveClass("justify-between");
    });

    it("should have border and padding", () => {
      renderComponent();

      const container = screen.getByRole("navigation", {
        name: /pagination/i,
      }).parentElement;

      expect(container).toHaveClass("border-t");
      expect(container).toHaveClass("px-3");
      expect(container).toHaveClass("py-3");
    });
  });
});
