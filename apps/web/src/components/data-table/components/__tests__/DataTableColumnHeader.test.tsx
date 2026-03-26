import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import { DataTableProvider } from "../../context/DataTableContext";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { DataTable } from "../DataTable";
import type { ColumnDef } from "@tanstack/react-table";

// Simple test data
interface TestItem {
  id: number;
  name: string;
  age: number;
}

const testData: TestItem[] = [
  { id: 1, name: "Item 1", age: 25 },
  { id: 2, name: "Item 2", age: 30 },
];

describe("DataTableColumnHeader", () => {
  describe("Basic Rendering", () => {
    it("should render title text", () => {
      const testColumns: ColumnDef<TestItem>[] = [
        {
          accessorKey: "name",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
          ),
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

      expect(screen.getByText("Name")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const testColumns: ColumnDef<TestItem>[] = [
        {
          accessorKey: "name",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title="Name"
              className="custom-class"
            />
          ),
        },
      ];

      const { container } = renderWithProviders(
        <DataTableProvider
          columns={testColumns}
          data={testData}
          getRowId={(row) => row.id}
        >
          <DataTable />
        </DataTableProvider>,
      );

      const headerDiv = container.querySelector(".custom-class");
      expect(headerDiv).toBeInTheDocument();
    });
  });

  describe("Sorting Behavior", () => {
    it("should show ascending sort indicator when sorted asc", async () => {
      const user = userEvent.setup();
      const testColumns: ColumnDef<TestItem>[] = [
        {
          accessorKey: "name",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
          ),
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

      const header = screen.getByText("Name");
      await user.click(header);

      expect(screen.getByText("↑")).toBeInTheDocument();
    });

    it("should show descending sort indicator when sorted desc", async () => {
      const user = userEvent.setup();
      const testColumns: ColumnDef<TestItem>[] = [
        {
          accessorKey: "name",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
          ),
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

      const header = screen.getByText("Name");
      // Click twice to get descending sort
      await user.click(header);
      await user.click(header);

      expect(screen.getByText("↓")).toBeInTheDocument();
    });

    it("should toggle sorting when clicked", async () => {
      const user = userEvent.setup();
      const testColumns: ColumnDef<TestItem>[] = [
        {
          accessorKey: "name",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
          ),
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

      const header = screen.getByText("Name");

      // Initially no sort indicator
      expect(screen.queryByText("↑")).not.toBeInTheDocument();
      expect(screen.queryByText("↓")).not.toBeInTheDocument();

      // Click to sort ascending
      await user.click(header);
      expect(screen.getByText("↑")).toBeInTheDocument();

      // Click to sort descending
      await user.click(header);
      expect(screen.getByText("↓")).toBeInTheDocument();

      // Click to clear sort
      await user.click(header);
      expect(screen.queryByText("↑")).not.toBeInTheDocument();
      expect(screen.queryByText("↓")).not.toBeInTheDocument();
    });
  });
});
