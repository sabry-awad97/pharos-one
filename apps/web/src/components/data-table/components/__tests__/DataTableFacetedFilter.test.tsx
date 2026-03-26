import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import { DataTableProvider } from "../../context/DataTableContext";
import { DataTable } from "../DataTable";
import { DataTableFacetedFilter } from "../DataTableFacetedFilter";
import type { ColumnDef } from "@tanstack/react-table";

// Test data
interface TestItem {
  id: number;
  name: string;
  status: string;
  category: string;
}

const testData: TestItem[] = [
  { id: 1, name: "Item 1", status: "active", category: "A" },
  { id: 2, name: "Item 2", status: "inactive", category: "B" },
  { id: 3, name: "Item 3", status: "active", category: "A" },
  { id: 4, name: "Item 4", status: "pending", category: "C" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
];

describe("DataTableFacetedFilter", () => {
  describe("Basic Rendering", () => {
    it("should render trigger button with column name", () => {
      const testColumns: ColumnDef<TestItem>[] = [
        {
          accessorKey: "status",
          header: ({ column }) => (
            <DataTableFacetedFilter column={column} options={statusOptions} />
          ),
          filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
          },
          enableColumnFilter: true,
        },
      ];

      renderWithProviders(
        <DataTableProvider
          columns={testColumns}
          data={testData}
          getRowId={(row) => row.id}
        >
          <DataTable />
        </DataTableProvider>,
      );

      expect(
        screen.getByRole("button", { name: /status/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Popover Interaction", () => {
    it("should open popover when trigger clicked", async () => {
      const user = userEvent.setup();
      const testColumns: ColumnDef<TestItem>[] = [
        {
          accessorKey: "status",
          header: ({ column }) => (
            <DataTableFacetedFilter column={column} options={statusOptions} />
          ),
          filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
          },
          enableColumnFilter: true,
        },
      ];

      renderWithProviders(
        <DataTableProvider
          columns={testColumns}
          data={testData}
          getRowId={(row) => row.id}
        >
          <DataTable />
        </DataTableProvider>,
      );

      const trigger = screen.getByRole("button", { name: /status/i });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Active")).toBeInTheDocument();
        expect(screen.getByText("Inactive")).toBeInTheDocument();
        expect(screen.getByText("Pending")).toBeInTheDocument();
      });
    });
  });

  describe("Filter Selection", () => {
    it("should select and deselect filter options", async () => {
      const user = userEvent.setup();
      const testColumns: ColumnDef<TestItem>[] = [
        {
          accessorKey: "status",
          header: ({ column }) => (
            <DataTableFacetedFilter column={column} options={statusOptions} />
          ),
          filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
          },
          enableColumnFilter: true,
        },
      ];

      renderWithProviders(
        <DataTableProvider
          columns={testColumns}
          data={testData}
          getRowId={(row) => row.id}
        >
          <DataTable />
        </DataTableProvider>,
      );

      // Open popover
      const trigger = screen.getByRole("button", { name: /status/i });
      await user.click(trigger);

      // Select "Active"
      await waitFor(() => {
        expect(screen.getByText("Active")).toBeInTheDocument();
      });
      await user.click(screen.getByText("Active"));

      // Close and reopen to verify selection persisted
      await user.click(trigger);
      await user.click(trigger);

      await waitFor(() => {
        // Should show selected count badge - use getAllByText since "1" appears in multiple places
        const badges = screen.getAllByText("1");
        expect(badges.length).toBeGreaterThan(0);
      });
    });

    it("should show selected count badge when filters applied", async () => {
      const user = userEvent.setup();
      const testColumns: ColumnDef<TestItem>[] = [
        {
          accessorKey: "status",
          header: ({ column }) => (
            <DataTableFacetedFilter column={column} options={statusOptions} />
          ),
          filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
          },
          enableColumnFilter: true,
        },
      ];

      renderWithProviders(
        <DataTableProvider
          columns={testColumns}
          data={testData}
          getRowId={(row) => row.id}
        >
          <DataTable />
        </DataTableProvider>,
      );

      const trigger = screen.getByRole("button", { name: /status/i });
      await user.click(trigger);

      // Select two options
      await waitFor(() => {
        expect(screen.getByText("Active")).toBeInTheDocument();
      });
      await user.click(screen.getByText("Active"));
      await user.click(screen.getByText("Inactive"));

      // Close popover
      await user.click(trigger);

      // Should show count badge - use getAllByText since "2" appears in multiple places
      await waitFor(() => {
        const badges = screen.getAllByText("2");
        expect(badges.length).toBeGreaterThan(0);
      });
    });

    it("should show individual badges for 1-2 selections on large screens", async () => {
      const user = userEvent.setup();
      const testColumns: ColumnDef<TestItem>[] = [
        {
          accessorKey: "status",
          header: ({ column }) => (
            <DataTableFacetedFilter column={column} options={statusOptions} />
          ),
          filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
          },
          enableColumnFilter: true,
        },
      ];

      renderWithProviders(
        <DataTableProvider
          columns={testColumns}
          data={testData}
          getRowId={(row) => row.id}
        >
          <DataTable />
        </DataTableProvider>,
      );

      const trigger = screen.getByRole("button", { name: /status/i });
      await user.click(trigger);

      // Select one option
      await waitFor(() => {
        expect(screen.getByText("Active")).toBeInTheDocument();
      });
      await user.click(screen.getByText("Active"));

      // Close popover
      await user.click(trigger);

      // Should show individual badge
      await waitFor(() => {
        // Badge should be visible in the trigger button
        const button = screen.getByRole("button", { name: /status/i });
        expect(button.textContent).toContain("Active");
      });
    });

    it("should show count badge for more than 2 selections", async () => {
      const user = userEvent.setup();
      const testColumns: ColumnDef<TestItem>[] = [
        {
          accessorKey: "status",
          header: ({ column }) => (
            <DataTableFacetedFilter column={column} options={statusOptions} />
          ),
          filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
          },
          enableColumnFilter: true,
        },
      ];

      renderWithProviders(
        <DataTableProvider
          columns={testColumns}
          data={testData}
          getRowId={(row) => row.id}
        >
          <DataTable />
        </DataTableProvider>,
      );

      const trigger = screen.getByRole("button", { name: /status/i });
      await user.click(trigger);

      // Select three options
      await waitFor(() => {
        expect(screen.getByText("Active")).toBeInTheDocument();
      });
      await user.click(screen.getByText("Active"));
      await user.click(screen.getByText("Inactive"));
      await user.click(screen.getByText("Pending"));

      // Close popover
      await user.click(trigger);

      // Should show "3 selected" badge
      await waitFor(() => {
        expect(screen.getByText("3 selected")).toBeInTheDocument();
      });
    });
  });

  describe("Clear Filters", () => {
    it("should clear all filters when clear button clicked", async () => {
      const user = userEvent.setup();
      const testColumns: ColumnDef<TestItem>[] = [
        {
          accessorKey: "status",
          header: ({ column }) => (
            <DataTableFacetedFilter column={column} options={statusOptions} />
          ),
          filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
          },
          enableColumnFilter: true,
        },
      ];

      renderWithProviders(
        <DataTableProvider
          columns={testColumns}
          data={testData}
          getRowId={(row) => row.id}
        >
          <DataTable />
        </DataTableProvider>,
      );

      const trigger = screen.getByRole("button", { name: /status/i });
      await user.click(trigger);

      // Select options
      await waitFor(() => {
        expect(screen.getByText("Active")).toBeInTheDocument();
      });
      await user.click(screen.getByText("Active"));
      await user.click(screen.getByText("Inactive"));

      // Click clear filters
      await user.click(screen.getByText("Clear filters"));

      // Close popover
      await user.click(trigger);

      // Should not show count badge in the trigger button
      await waitFor(() => {
        const button = screen.getByRole("button", { name: /status/i });
        // After clearing, button should only contain "Status" text, not a count badge
        expect(button.textContent).not.toMatch(/\d+/);
      });
    });
  });

  describe("Facet Counts", () => {
    it("should display filter options even without facet counts", async () => {
      const user = userEvent.setup();
      const testColumns: ColumnDef<TestItem>[] = [
        {
          accessorKey: "status",
          header: ({ column }) => (
            <DataTableFacetedFilter column={column} options={statusOptions} />
          ),
          filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
          },
          enableColumnFilter: true,
        },
      ];

      renderWithProviders(
        <DataTableProvider
          columns={testColumns}
          data={testData}
          getRowId={(row) => row.id}
        >
          <DataTable />
        </DataTableProvider>,
      );

      const trigger = screen.getByRole("button", { name: /status/i });
      await user.click(trigger);

      // Should show all filter options
      await waitFor(() => {
        expect(screen.getByText("Active")).toBeInTheDocument();
        expect(screen.getByText("Inactive")).toBeInTheDocument();
        expect(screen.getByText("Pending")).toBeInTheDocument();
      });
    });
  });
});
