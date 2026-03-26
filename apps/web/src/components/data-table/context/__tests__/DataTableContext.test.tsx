/**
 * DataTableContext Tests
 * Tests verify behavior through public interface
 *
 * TESTING APPROACH: Integration-style
 * - Uses real useDataTable hook (no mocking internal collaborators)
 * - Tests through public API (Provider + hook)
 * - Verifies observable behavior, not implementation
 * - Tests survive refactoring of internal structure
 */

import { describe, test, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { DataTableProvider, useDataTableContext } from "../DataTableContext";
import type { ColumnDef } from "@tanstack/react-table";

// Test data type
interface TestProduct {
  id: number;
  name: string;
  price: number;
}

// Test data
const testProducts: TestProduct[] = [
  { id: 1, name: "Product A", price: 10 },
  { id: 2, name: "Product B", price: 20 },
];

// Test columns
const testColumns: ColumnDef<TestProduct>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "price", header: "Price" },
];

describe("DataTableContext", () => {
  describe("DataTableProvider", () => {
    // TRACER BULLET: First test to prove the path works
    test("makes table state available to children", () => {
      // Consumer component that uses the context
      function TestConsumer() {
        const { table, data } = useDataTableContext<TestProduct>();
        return (
          <div>
            <span data-testid="row-count">
              {table.getRowModel().rows.length}
            </span>
            <span data-testid="data-length">{data.length}</span>
          </div>
        );
      }

      renderWithProviders(
        <DataTableProvider columns={testColumns} data={testProducts}>
          <TestConsumer />
        </DataTableProvider>,
      );

      // Verify behavior: context provides table state
      expect(screen.getByTestId("row-count")).toHaveTextContent("2");
      expect(screen.getByTestId("data-length")).toHaveTextContent("2");
    });
  });

  describe("useDataTableContext", () => {
    test("throws error when used outside provider", () => {
      function TestConsumer() {
        useDataTableContext();
        return <div>Should not render</div>;
      }

      // Suppress console.error for this test
      const originalError = console.error;
      console.error = () => {};

      expect(() => {
        renderWithProviders(<TestConsumer />);
      }).toThrow("useDataTableContext must be used within a DataTableProvider");

      console.error = originalError;
    });

    test("provides access to all table state", () => {
      function TestConsumer() {
        const context = useDataTableContext<TestProduct>();

        // Verify all expected properties are available
        const hasTable = context.table !== undefined;
        const hasColumns = context.columns !== undefined;
        const hasData = context.data !== undefined;
        const hasSorting = context.sorting !== undefined;
        const hasRowSelection = context.rowSelection !== undefined;
        const hasSelectedRowIds = context.selectedRowIds !== undefined;
        const hasHandleRowClick = typeof context.handleRowClick === "function";

        return (
          <div>
            <span data-testid="has-table">{String(hasTable)}</span>
            <span data-testid="has-columns">{String(hasColumns)}</span>
            <span data-testid="has-data">{String(hasData)}</span>
            <span data-testid="has-sorting">{String(hasSorting)}</span>
            <span data-testid="has-row-selection">
              {String(hasRowSelection)}
            </span>
            <span data-testid="has-selected-ids">
              {String(hasSelectedRowIds)}
            </span>
            <span data-testid="has-click-handler">
              {String(hasHandleRowClick)}
            </span>
          </div>
        );
      }

      renderWithProviders(
        <DataTableProvider columns={testColumns} data={testProducts}>
          <TestConsumer />
        </DataTableProvider>,
      );

      // Verify behavior: all state is accessible
      expect(screen.getByTestId("has-table")).toHaveTextContent("true");
      expect(screen.getByTestId("has-columns")).toHaveTextContent("true");
      expect(screen.getByTestId("has-data")).toHaveTextContent("true");
      expect(screen.getByTestId("has-sorting")).toHaveTextContent("true");
      expect(screen.getByTestId("has-row-selection")).toHaveTextContent("true");
      expect(screen.getByTestId("has-selected-ids")).toHaveTextContent("true");
      expect(screen.getByTestId("has-click-handler")).toHaveTextContent("true");
    });

    test("passes through options to useDataTable", () => {
      const customGetRowId = (row: TestProduct) => row.id * 10;
      let doubleClickedId: number | null = null;
      const onRowDoubleClick = (id: number) => {
        doubleClickedId = id;
      };

      function TestConsumer() {
        const { handleRowDoubleClick } = useDataTableContext<TestProduct>();

        return (
          <button
            data-testid="trigger-double-click"
            onClick={() => handleRowDoubleClick(1)}
          >
            Trigger
          </button>
        );
      }

      renderWithProviders(
        <DataTableProvider
          columns={testColumns}
          data={testProducts}
          getRowId={customGetRowId}
          onRowDoubleClick={onRowDoubleClick}
          persistenceKey="test-table"
        >
          <TestConsumer />
        </DataTableProvider>,
      );

      // Verify behavior: options are passed through
      const button = screen.getByTestId("trigger-double-click");
      button.click();

      expect(doubleClickedId).toBe(1);
    });
  });
});
