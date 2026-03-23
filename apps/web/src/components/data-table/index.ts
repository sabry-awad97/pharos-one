/**
 * DataTable Component Library
 * Reusable, composable data table components
 *
 * ARCHITECTURE: Component + Context pattern
 * - useDataTable: Core table logic hook
 * - DataTableProvider: Context provider for composition
 * - useDataTableContext: Hook to access table state
 * - DataTablePagination: Reusable pagination component
 *
 * USAGE PATTERNS:
 *
 * 1. Direct Hook Usage (Simple):
 * ```typescript
 * const table = useDataTable({ columns, data });
 * // Use table instance directly
 * ```
 *
 * 2. Context Provider (Composition):
 * ```typescript
 * <DataTableProvider columns={columns} data={data}>
 *   <DataTableToolbar />
 *   <DataTable />
 *   <DataTablePagination />
 * </DataTableProvider>
 * ```
 */

export { useDataTable } from "./hooks/useDataTable";
export {
  DataTableProvider,
  useDataTableContext,
  type DataTableProviderProps,
} from "./context/DataTableContext";
export {
  DataTablePagination,
  type DataTablePaginationProps,
} from "./components/DataTablePagination";
export { DataTable, type DataTableProps } from "./components/DataTable";
export {
  DataTableColumnHeader,
  type DataTableColumnHeaderProps,
} from "./components/DataTableColumnHeader";
export {
  DataTableFacetedFilter,
  type DataTableFacetedFilterProps,
} from "./components/DataTableFacetedFilter";
export {
  DataTableFilters,
  type DataTableFiltersProps,
  type FilterOption,
  type ColumnFilter,
} from "./components/DataTableFilters";
export {
  DataTableEmptyState,
  type DataTableEmptyStateProps,
} from "./components/DataTableEmptyState";
