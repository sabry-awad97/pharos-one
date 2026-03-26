import { screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
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

describe("DataTablePagination - Edge Cases", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderComponent = (data = mockData, isLoading = false) => {
    const user = userEvent.setup();
    const result = renderWithProviders(
      <DataTableProvider
        columns={mockColumns}
        data={data}
        getRowId={(row) => row.id}
      >
        <DataTablePagination isLoading={isLoading} />
      </DataTableProvider>,
    );
    return { ...result, user };
  };

  describe("Loading State", () => {
    it("should show loading skeleton when isLoading is true", () => {
      renderComponent(mockData, true);

      // Check for skeleton elements
      const skeletons = screen.getAllByTestId("pagination-skeleton");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("should not show pagination controls when loading", () => {
      renderComponent(mockData, true);

      // Navigation should not be visible
      expect(
        screen.queryByRole("navigation", { name: /pagination/i }),
      ).not.toBeInTheDocument();
    });

    it("should show pagination controls when loading completes", () => {
      const { rerender } = renderWithProviders(
        <DataTableProvider
          columns={mockColumns}
          data={mockData}
          getRowId={(row) => row.id}
        >
          <DataTablePagination isLoading={true} />
        </DataTableProvider>,
      );

      // Initially loading
      expect(
        screen.getAllByTestId("pagination-skeleton").length,
      ).toBeGreaterThan(0);

      // Rerender with loading false
      rerender(
        <DataTableProvider
          columns={mockColumns}
          data={mockData}
          getRowId={(row) => row.id}
        >
          <DataTablePagination isLoading={false} />
        </DataTableProvider>,
      );

      // Should show pagination
      expect(
        screen.getByRole("navigation", { name: /pagination/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("should not show pagination controls when data is empty", () => {
      renderComponent([]);

      expect(
        screen.queryByRole("navigation", { name: /pagination/i }),
      ).not.toBeInTheDocument();
    });

    it("should return null when data is empty", () => {
      const { container } = renderComponent([]);

      // Pagination component should not render anything (returns null)
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Single Page Hiding", () => {
    it("should hide pagination when only 1 page exists", () => {
      // 5 items with default page size of 25 = 1 page
      const singlePageData = mockData.slice(0, 5);
      renderComponent(singlePageData);

      // Pagination navigation should not be visible
      expect(
        screen.queryByRole("navigation", { name: /pagination/i }),
      ).not.toBeInTheDocument();
    });

    it("should show pagination when more than 1 page exists", () => {
      // 30 items with default page size of 25 = 2 pages
      const multiPageData = mockData.slice(0, 30);
      renderComponent(multiPageData);

      // Pagination navigation should be visible
      expect(
        screen.getByRole("navigation", { name: /pagination/i }),
      ).toBeInTheDocument();
    });

    it("should hide pagination after filtering to single page", async () => {
      const { user, rerender } = renderComponent(mockData);

      // Initially should show pagination (100 items = 4 pages)
      expect(
        screen.getByRole("navigation", { name: /pagination/i }),
      ).toBeInTheDocument();

      // Simulate filtering to 5 items (1 page)
      const filteredData = mockData.slice(0, 5);
      rerender(
        <DataTableProvider
          columns={mockColumns}
          data={filteredData}
          getRowId={(row) => row.id}
        >
          <DataTablePagination />
        </DataTableProvider>,
      );

      // Pagination should be hidden
      await waitFor(() => {
        expect(
          screen.queryByRole("navigation", { name: /pagination/i }),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Responsive Design", () => {
    it("should apply mobile layout classes on small screens", () => {
      // Mock window.matchMedia for mobile
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === "(max-width: 640px)",
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      renderComponent();

      const container = screen
        .getByRole("navigation", { name: /pagination/i })
        .closest("div");

      // Should have mobile-responsive classes
      expect(container).toHaveClass("flex-col");
      expect(container).toHaveClass("sm:flex-row");
    });

    it("should show fewer page numbers on mobile", () => {
      // Mock window.matchMedia for mobile
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === "(max-width: 640px)",
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const pageButtons = within(nav).getAllByRole("button", {
        name: /go to page \d+/i,
      });

      // Should show max 5 page numbers on mobile
      expect(pageButtons.length).toBeLessThanOrEqual(5);
    });
  });

  describe("Smooth Transitions", () => {
    it("should have transition classes on pagination container", () => {
      renderComponent();

      const container = screen
        .getByRole("navigation", { name: /pagination/i })
        .closest("div");

      // Should have transition duration class
      expect(container).toHaveClass("transition-opacity");
      expect(container).toHaveClass("duration-150");
    });

    it("should apply fade animation when changing pages", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      // Click next page
      await user.click(nextButton);

      // Container should maintain transition classes
      const container = nav.closest("div");
      expect(container).toHaveClass("transition-opacity");
    });
  });

  describe("Edge Case Handling", () => {
    it("should handle rapid page changes without errors", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      // Rapidly click next multiple times
      await user.click(nextButton);
      await user.click(nextButton);
      await user.click(nextButton);

      // Should not throw errors and should be on page 4
      await waitFor(() => {
        expect(nextButton).toBeDisabled();
      });
    });

    it("should handle page size change with single page result", async () => {
      const { user } = renderComponent();

      // Change page size to 100 (all items fit in 1 page)
      const pageSizeSelect = screen.getByRole("combobox");
      await user.click(pageSizeSelect);

      await waitFor(() => {
        const option100 = screen.getByRole("option", { name: "100 / page" });
        expect(option100).toBeInTheDocument();
      });

      const option100 = screen.getByRole("option", { name: "100 / page" });
      await user.click(option100);

      // Pagination should be hidden
      await waitFor(() => {
        expect(
          screen.queryByRole("navigation", { name: /pagination/i }),
        ).not.toBeInTheDocument();
      });
    });

    it("should maintain accessibility during transitions", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = within(nav).getByRole("button", { name: /next/i });

      await user.click(nextButton);

      // ARIA labels should still be present
      await waitFor(() => {
        expect(nav).toHaveAttribute("aria-label", "pagination");
      });
    });
  });
});
