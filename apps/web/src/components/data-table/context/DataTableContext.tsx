/**
 * DataTable Context
 * Provides table instance and state to child components
 *
 * ARCHITECTURE: Thin context wrapper around useDataTable hook
 * - Avoids prop drilling for table state
 * - Maintains type safety with generics
 * - Enables composition of table subcomponents
 * - Minimal abstraction over TanStack Table
 *
 * USAGE:
 * ```typescript
 * <DataTableProvider columns={columns} data={data}>
 *   <DataTableToolbar />
 *   <DataTable />
 *   <DataTablePagination />
 * </DataTableProvider>
 * ```
 */

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useDataTable } from "../hooks/useDataTable";

/**
 * Return type of useDataTable hook
 */
type UseDataTableReturn<TData, TId = number> = ReturnType<
  typeof useDataTable<TData, TId>
>;

/**
 * Context value containing table instance and all state
 */
interface DataTableContextValue<TData, TId = number> extends UseDataTableReturn<
  TData,
  TId
> {
  /**
   * Original columns definition
   */
  columns: ColumnDef<TData>[];

  /**
   * Original data array
   */
  data: TData[];
}

/**
 * React Context for DataTable state
 * Undefined when outside provider
 */
const DataTableContext = React.createContext<
  DataTableContextValue<any, any> | undefined
>(undefined);

/**
 * Props for DataTableProvider
 */
export interface DataTableProviderProps<TData, TId = number> {
  /**
   * Column definitions for the table
   */
  columns: ColumnDef<TData>[];

  /**
   * Data array to display
   */
  data: TData[];

  /**
   * Optional persistence key for localStorage
   */
  persistenceKey?: string;

  /**
   * Optional function to get row ID
   */
  getRowId?: (row: TData) => TId;

  /**
   * Optional callback for row double-click
   */
  onRowDoubleClick?: (rowId: TId) => void;

  /**
   * Child components that will consume table context
   */
  children: React.ReactNode;
}

/**
 * Provider component that creates and shares table instance
 *
 * Features:
 * - Type-safe generic interface
 * - Integrates with existing useDataTable hook
 * - Memoized context value to prevent unnecessary re-renders
 * - Provides table instance and all state to descendants
 *
 * @example
 * ```typescript
 * <DataTableProvider columns={columns} data={products}>
 *   <DataTableToolbar />
 *   <DataTable />
 *   <DataTablePagination />
 * </DataTableProvider>
 * ```
 */
export function DataTableProvider<TData, TId = number>({
  children,
  columns,
  data,
  persistenceKey,
  getRowId,
  onRowDoubleClick,
}: DataTableProviderProps<TData, TId>) {
  // Create table instance using existing hook
  const tableState = useDataTable<TData, TId>({
    columns,
    data,
    persistenceKey,
    getRowId,
    onRowDoubleClick,
  });

  // Create context value with table state and original props
  const value = {
    ...tableState,
    columns,
    data,
  };

  return (
    <DataTableContext.Provider value={value}>
      {children}
    </DataTableContext.Provider>
  );
}

/**
 * Hook to access DataTable context
 *
 * Features:
 * - Type-safe access to table instance and state
 * - Runtime validation of provider presence
 * - Preserves generic types from provider
 *
 * @throws Error if used outside DataTableProvider
 *
 * @example
 * ```typescript
 * function DataTableToolbar() {
 *   const { table, selectedRowIds } = useDataTableContext();
 *   // Access table instance and selection state
 * }
 * ```
 */
export function useDataTableContext<
  TData = unknown,
  TId = number,
>(): DataTableContextValue<TData, TId> {
  const context = React.useContext(DataTableContext);

  if (context === undefined) {
    throw new Error(
      "useDataTableContext must be used within a DataTableProvider",
    );
  }

  return context as DataTableContextValue<TData, TId>;
}
