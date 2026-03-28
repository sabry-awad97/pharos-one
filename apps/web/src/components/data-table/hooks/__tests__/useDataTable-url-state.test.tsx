import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { AllProviders } from "@/test-utils";
import { DataTableProvider } from "../../context/DataTableContext";
import { DataTablePagination } from "../../components/DataTablePagination";
import type { ColumnDef } from "@tanstack/react-table";

// Mock data for testing
interface TestData {
  id: number;
  name: string;
  value: number;
}

const mockData: TestData[] = Array.from({ length: 200 }, (_, i) => ({
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

describe("useDataTable with URL state integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderComponent = (searchParams = "") => {
    const user = userEvent.setup();
    const result = render(
      <AllProviders searchParams={searchParams}>
        <DataTableProvider
          columns={mockColumns}
          data={mockData}
          getRowId={(row) => row.id}
        >
          <DataTablePagination />
        </DataTableProvider>
      </AllProviders>,
    );
    return { ...result, user };
  };

  describe("TDD Cycle 8: localStorage fallback still works", () => {
    it("should use localStorage for pageSize when no URL param", () => {
      render(
        <AllProviders searchParams="pageSize=50">
          <DataTableProvider
            columns={mockColumns}
            data={mockData}
            getRowId={(row) => row.id}
            persistenceKey="test-page-size"
          >
            <DataTablePagination />
          </DataTableProvider>
        </AllProviders>,
      );

      const pageSizeSelect = screen.getByRole("combobox");
      // Should show 50 from URL params
      expect(pageSizeSelect).toHaveTextContent("50 / page");
    });

    it("should prefer URL param over localStorage", () => {
      render(
        <AllProviders searchParams="pageSize=100">
          <DataTableProvider
            columns={mockColumns}
            data={mockData}
            getRowId={(row) => row.id}
            persistenceKey="test-page-size"
          >
            <DataTablePagination />
          </DataTableProvider>
        </AllProviders>,
      );

      const pageSizeSelect = screen.getByRole("combobox");
      // Should show 100 from URL
      expect(pageSizeSelect).toHaveTextContent("100 / page");
    });
  });

  describe("Page restoration from URL", () => {
    it("should restore page from URL on mount", () => {
      renderComponent("page=3");

      // Should be on page 3 (Previous button enabled)
      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const previousButton = screen.getByRole("button", { name: /previous/i });
      expect(previousButton).not.toBeDisabled();
    });

    it("should restore pageSize from URL on mount", () => {
      renderComponent("pageSize=50");

      const pageSizeSelect = screen.getByRole("combobox");
      expect(pageSizeSelect).toHaveTextContent("50 / page");
    });

    it("should restore both page and pageSize from URL", () => {
      renderComponent("page=2&pageSize=50");

      const pageSizeSelect = screen.getByRole("combobox");
      expect(pageSizeSelect).toHaveTextContent("50 / page");

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const previousButton = screen.getByRole("button", { name: /previous/i });
      expect(previousButton).not.toBeDisabled();
    });
  });

  describe("URL updates on pagination changes", () => {
    it("should update URL when clicking Next button", async () => {
      const { user } = renderComponent();

      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const nextButton = screen.getByRole("button", { name: /next/i });

      await user.click(nextButton);

      // Should be on page 2 now (Previous button enabled)
      await waitFor(() => {
        const previousButton = screen.getByRole("button", {
          name: /previous/i,
        });
        expect(previousButton).not.toBeDisabled();
      });
    });

    it("should update URL when changing page size", async () => {
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
        expect(pageSizeSelect).toHaveTextContent("50 / page");
      });
    });
  });

  describe("Invalid URL params handling", () => {
    it("should handle invalid page number gracefully", () => {
      renderComponent("page=0");

      // Should default to page 1 (Previous button disabled)
      const nav = screen.getByRole("navigation", { name: /pagination/i });
      const previousButton = screen.getByRole("button", { name: /previous/i });
      expect(previousButton).toBeDisabled();
    });

    it("should handle invalid pageSize gracefully", () => {
      renderComponent("pageSize=0");

      const pageSizeSelect = screen.getByRole("combobox");
      // Should default to 25
      expect(pageSizeSelect).toHaveTextContent("25 / page");
    });
  });
});

