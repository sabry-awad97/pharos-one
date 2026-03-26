import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/test-utils";
import { DataTableProvider } from "../../context/DataTableContext";
import { DataTable } from "../DataTable";
import type { ColumnDef } from "@tanstack/react-table";

// Simple test data
interface TestItem {
  id: number;
  name: string;
  value: number;
}

const testData: TestItem[] = [
  { id: 1, name: "Item 1", value: 100 },
  { id: 2, name: "Item 2", value: 200 },
  { id: 3, name: "Item 3", value: 300 },
];

const testColumns: ColumnDef<TestItem>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
];

describe("DataTable", () => {
  describe("Basic Rendering", () => {
    it("should render table with headers from column definitions", () => {
      renderWithProviders(
        <DataTableProvider
          columns={testColumns}
          data={testData}
          getRowId={(row) => row.id}
        >
          <DataTable />
        </DataTableProvider>,
      );

      // Verify table exists
      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();

      // Verify headers are rendered
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Value")).toBeInTheDocument();
    });

    it("should render data rows with default rendering", () => {
      renderWithProviders(
        <DataTableProvider
          columns={testColumns}
          data={testData}
          getRowId={(row) => row.id}
        >
          <DataTable />
        </DataTableProvider>,
      );

      // Verify data is rendered
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("200")).toBeInTheDocument();
      expect(screen.getByText("300")).toBeInTheDocument();
    });
  });

  describe("Custom Row Rendering", () => {
    it("should use custom renderRow when provided", () => {
      renderWithProviders(
        <DataTableProvider
          columns={testColumns}
          data={testData}
          getRowId={(row) => row.id}
        >
          <DataTable<TestItem>
            renderRow={(row, idx) => (
              <tr key={row.id} data-testid={`custom-row-${row.original.id}`}>
                <td>Custom: {row.original.name}</td>
                <td>
                  Value: {row.original.value} (Row {idx})
                </td>
              </tr>
            )}
          />
        </DataTableProvider>,
      );

      // Verify custom rendering is used
      expect(screen.getByText("Custom: Item 1")).toBeInTheDocument();
      expect(screen.getByText("Value: 100 (Row 0)")).toBeInTheDocument();
      expect(screen.getByTestId("custom-row-1")).toBeInTheDocument();
    });
  });

  describe("Props", () => {
    it("should apply custom className to table", () => {
      renderWithProviders(
        <DataTableProvider
          columns={testColumns}
          data={testData}
          getRowId={(row) => row.id}
        >
          <DataTable className="custom-table-class" />
        </DataTableProvider>,
      );

      const table = screen.getByRole("table");
      expect(table).toHaveClass("custom-table-class");
    });

    it("should apply custom style to table", () => {
      renderWithProviders(
        <DataTableProvider
          columns={testColumns}
          data={testData}
          getRowId={(row) => row.id}
        >
          <DataTable style={{ backgroundColor: "red" }} />
        </DataTableProvider>,
      );

      const table = screen.getByRole("table");
      expect(table).toHaveStyle({ backgroundColor: "red" });
    });
  });

  describe("Edge Cases", () => {
    it("should render empty table when data is empty", () => {
      renderWithProviders(
        <DataTableProvider
          columns={testColumns}
          data={[]}
          getRowId={(row) => row.id}
        >
          <DataTable />
        </DataTableProvider>,
      );

      // Table and headers should still render
      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Value")).toBeInTheDocument();

      // But no data rows
      expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    });
  });
});
