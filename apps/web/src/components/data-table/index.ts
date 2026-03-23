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
