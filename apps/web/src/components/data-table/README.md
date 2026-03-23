# DataTable Component Library

Reusable, type-safe data table components built on TanStack Table.

## Architecture

```
data-table/
├── hooks/
│   └── useDataTable.ts          # Core table logic
├── context/
│   └── DataTableContext.tsx     # Context provider for composition
├── __tests__/                   # Unit tests
└── index.ts                     # Public API
```

### Design Principles

1. **Separation of Concerns**: Logic (hook) separate from state management (context)
2. **Composition over Configuration**: Build complex tables from simple components
3. **Type Safety**: Full TypeScript generics support
4. **Flexibility**: Use hook directly or via context based on needs

## Usage Patterns

### Pattern 1: Direct Hook Usage (Simple Tables)

Best for: Single-file components, simple tables without subcomponents.

```typescript
import { useDataTable } from "@/components/data-table";

function SimpleTable() {
  const table = useDataTable({
    columns: productColumns,
    data: products,
  });

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Pattern 2: Context Provider (Composable Tables)

Best for: Complex tables with separate toolbar, filters, pagination components.

```typescript
import {
  DataTableProvider,
  useDataTableContext,
} from "@/components/data-table";

// Main component
function InventoryWorkspace() {
  return (
    <DataTableProvider columns={productColumns} data={products}>
      <div className="space-y-4">
        <DataTableToolbar />
        <DataTable />
        <DataTablePagination />
      </div>
    </DataTableProvider>
  );
}

// Toolbar component (separate file)
function DataTableToolbar() {
  const { table } = useDataTableContext<Product, unknown>();

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Search products..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn("name")?.setFilterValue(e.target.value)
        }
      />
      <Button onClick={() => table.resetColumnFilters()}>Clear</Button>
    </div>
  );
}

// Table component (separate file)
function DataTable() {
  const { table } = useDataTableContext<Product, unknown>();

  return (
    <table>
      {/* Render table using table instance */}
    </table>
  );
}

// Pagination component (separate file)
function DataTablePagination() {
  const { table } = useDataTableContext<Product, unknown>();

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      <span>
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </span>
      <Button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
    </div>
  );
}
```

## API Reference

### `useDataTable<TData, TValue>(options)`

Core hook that creates a TanStack Table instance.

**Parameters**:

- `options.columns`: Column definitions
- `options.data`: Data array

**Returns**: TanStack Table instance

### `DataTableProvider<TData, TValue>`

Context provider for composable table components.

**Props**:

- `columns`: Column definitions
- `data`: Data array
- `children`: Child components

### `useDataTableContext<TData, TValue>()`

Hook to access table context in child components.

**Returns**:

- `table`: Table instance
- `columns`: Original columns
- `data`: Original data

**Throws**: Error if used outside `DataTableProvider`

## Type Safety

All components maintain full type safety through TypeScript generics:

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

// Type inference works automatically
<DataTableProvider<Product, unknown>
  columns={productColumns}
  data={products}
>
  {/* Child components inherit types */}
</DataTableProvider>

// Or explicitly in hooks
const { table } = useDataTableContext<Product, unknown>();
```

## Extension Points

### Adding Custom State

Extend the context to include additional state:

```typescript
// In DataTableContext.tsx
interface DataTableContextValue<TData, TValue> {
  table: Table<TData>;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Add custom state
  selectedRows: TData[];
  setSelectedRows: (rows: TData[]) => void;
}
```

### Custom Hooks

Create specialized hooks that consume the context:

```typescript
function useDataTableSelection<TData>() {
  const { table } = useDataTableContext<TData, unknown>();
  return {
    selectedRows: table.getSelectedRowModel().rows,
    selectAll: () => table.toggleAllRowsSelected(true),
    clearSelection: () => table.resetRowSelection(),
  };
}
```

## Testing

Both patterns are easily testable:

```typescript
// Test hook directly
const { result } = renderHook(() =>
  useDataTable({ columns: mockColumns, data: mockData })
);

// Test with context
render(
  <DataTableProvider columns={mockColumns} data={mockData}>
    <TestComponent />
  </DataTableProvider>
);
```

## Migration Guide

### From Direct Hook to Context

1. Wrap your component with `DataTableProvider`
2. Replace `useDataTable` with `useDataTableContext` in child components
3. Extract subcomponents as needed

```typescript
// Before
function MyTable() {
  const table = useDataTable({ columns, data });
  return <div>{/* table UI */}</div>;
}

// After
function MyTable() {
  return (
    <DataTableProvider columns={columns} data={data}>
      <MyTableContent />
    </DataTableProvider>
  );
}

function MyTableContent() {
  const { table } = useDataTableContext();
  return <div>{/* table UI */}</div>;
}
```

## Performance Considerations

- Context value is memoized to prevent unnecessary re-renders
- Consider splitting context if state updates frequently
- Use React.memo for expensive child components
- TanStack Table handles virtualization internally

## Future Enhancements

Potential additions without breaking changes:

- Selection state management
- Bulk action support
- Export functionality
- Column visibility persistence
- Filter presets
- Custom sorting strategies
