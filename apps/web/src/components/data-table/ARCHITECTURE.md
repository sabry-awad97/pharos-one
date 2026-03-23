# DataTable Component Library - Architecture

## Overview

The DataTable component library provides reusable, composable components for building data tables with TanStack Table. The architecture follows the **Deep Module** principle: small interface with lots of implementation hidden behind it.

## Design Philosophy

### Minimal Interface, Maximum Flexibility

The DataTable component is designed as a **minimal abstraction** over TanStack Table:

- **Small interface**: Few props, simple API
- **Deep implementation**: Complex table logic hidden inside
- **Feature-specific customization**: Features control their own rendering through render props

This approach avoids the pitfall of creating a "shallow module" (large interface, little implementation) that would be hard to maintain and inflexible for unique feature needs.

## Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  DataTableProvider                      │
│  (Context wrapper around useDataTable hook)             │
│  - Provides table instance and state to children        │
│  - Enables composition of table subcomponents           │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  DataTable   │  │ DataTable    │  │   Custom     │
│              │  │ Pagination   │  │  Components  │
│ - Renders    │  │              │  │              │
│   table      │  │ - Page size  │  │ - Toolbars   │
│   structure  │  │ - Navigation │  │ - Filters    │
│ - Delegates  │  │ - Go to page │  │ - Actions    │
│   row/header │  │ - Item count │  │              │
│   rendering  │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Core Components

### 1. useDataTable Hook

**Purpose**: Core table logic and state management

**Responsibilities**:

- TanStack Table instance creation
- Sorting, filtering, pagination state
- Row selection (Windows-style multi-select)
- Row focus management
- Page size persistence to localStorage

**Interface**:

```typescript
useDataTable({
  columns: ColumnDef<TData>[],
  data: TData[],
  persistenceKey?: string,
  getRowId?: (row: TData) => number,
  onRowDoubleClick?: (rowId: number) => void
})
```

### 2. DataTableProvider

**Purpose**: Context provider for composition

**Responsibilities**:

- Wraps useDataTable hook
- Provides table state to child components
- Enables composition without prop drilling

**Interface**:

```typescript
<DataTableProvider
  columns={columns}
  data={data}
  persistenceKey="storage-key"
  getRowId={(row) => row.id}
  onRowDoubleClick={(id) => handleOpen(id)}
>
  {children}
</DataTableProvider>
```

### 3. DataTable Component

**Purpose**: Generic table renderer

**Responsibilities**:

- Renders table structure (table, thead, tbody)
- Delegates row rendering to parent via renderRow prop
- Delegates header rendering to parent via renderHeaderCell prop
- Minimal interface for maximum flexibility

**Interface**:

```typescript
<DataTable<TData>
  renderRow={(row, index) => <CustomRow row={row} />}
  renderHeaderCell={(header) => <CustomHeader header={header} />}
  className="custom-table"
  style={{ boxShadow: "..." }}
  containerClassName="overflow-auto"
/>
```

**Design Decision**:

- Accepts render props instead of trying to handle all styling internally
- Features control their own row/header rendering
- Avoids premature abstraction

### 4. DataTablePagination Component

**Purpose**: Reusable pagination controls

**Responsibilities**:

- Page size selector
- Previous/Next navigation
- Page number buttons
- Go to page input
- Items count display

**Interface**:

```typescript
<DataTablePagination
  showPageSize={true}
  showGoToPage={true}
  showItemsCount={true}
  pageSizeOptions={[...]}
/>
```

## Usage Patterns

### Pattern 1: Simple Table (Default Rendering)

```typescript
<DataTableProvider columns={columns} data={data}>
  <DataTable />
  <DataTablePagination />
</DataTableProvider>
```

### Pattern 2: Feature-Specific Table (Custom Rendering)

```typescript
<DataTableProvider columns={columns} data={data}>
  <DataTable<ProductStockSummary>
    renderHeaderCell={(header) => (
      <th
        className="custom-header"
        onClick={header.column.getToggleSortingHandler()}
      >
        {/* Custom header rendering */}
      </th>
    )}
    renderRow={(row, idx) => (
      <TableRowContextMenu row={row.original}>
        <tr
          className="custom-row"
          onClick={() => handleClick(row.original.id)}
        >
          {/* Custom row rendering */}
        </tr>
      </TableRowContextMenu>
    )}
  />
  <DataTablePagination />
</DataTableProvider>
```

## Architectural Decisions

### Decision 1: Minimal DataTable Component

**Approach**: Extract only table rendering logic, delegate row/header rendering to parent

**Rationale**:

- Features have unique styling needs (selection, focus, hover states)
- Column definitions are inherently feature-specific
- Avoids creating a shallow module (large interface, little implementation)
- Maximum flexibility for unique feature needs

**Alternatives Considered**:

1. Full-featured DataTable with render props for everything → Too complex, large interface
2. Compound component pattern (DataTable.Root, DataTable.Row, etc.) → Overkill for current needs

**Confidence**: 85%

**Would change if**: Multiple features need identical row rendering (then consider extracting common patterns)

### Decision 2: Render Props Over Configuration

**Approach**: Accept renderRow and renderHeaderCell props instead of configuration objects

**Rationale**:

- More flexible than configuration
- Features can use any React patterns (hooks, context, etc.)
- Type-safe with TypeScript generics
- Easier to understand (just JSX, not config objects)

**Trade-offs**:

- Slightly more code in features
- But much more flexible and maintainable

### Decision 3: Context Provider Pattern

**Approach**: Wrap useDataTable hook in context provider

**Rationale**:

- Enables composition of table subcomponents
- Avoids prop drilling
- Maintains type safety with generics
- Minimal abstraction over existing hook

**Trade-offs**:

- Adds one level of nesting
- But enables clean composition

## Extension Points

### Adding New Table Features

1. **New subcomponent** (e.g., DataTableToolbar):
   - Create component that consumes DataTableContext
   - Export from index.ts
   - Use alongside DataTable and DataTablePagination

2. **New render prop** (e.g., renderFooter):
   - Add prop to DataTable component
   - Render in appropriate location
   - Document in ARCHITECTURE.md

3. **New table state** (e.g., column visibility):
   - Add to useDataTable hook
   - Expose through DataTableContext
   - Update type definitions

## Testing Strategy

### Component Tests

- **DataTable**: Test basic rendering, custom renderRow, custom renderHeaderCell, props
- **DataTablePagination**: Test page size, navigation, go to page, items count, accessibility
- **DataTableContext**: Test provider/consumer pattern, state management

### Integration Tests

- **InventoryWorkspace**: Test table with feature-specific rendering, selection, focus, pagination

### Test Philosophy

- Test behavior through public interfaces, not implementation
- Use real implementations, not mocks (except system boundaries)
- Tests should survive refactoring

## Performance Considerations

### Memoization

- Column definitions should be memoized with useMemo
- Render props should be stable (useCallback if needed)
- TanStack Table handles internal memoization

### Virtualization

- Not implemented yet
- Consider react-virtual if tables exceed 1000 rows
- Would be added as optional prop to DataTable

## Future Enhancements

### Potential Additions

1. **Column visibility toggle**: Add to DataTablePagination or new DataTableToolbar
2. **Export to CSV**: Add to DataTablePagination or new DataTableToolbar
3. **Virtualization**: Add optional prop to DataTable for large datasets
4. **Column resizing**: Add to DataTable with renderHeaderCell support
5. **Inline editing**: Add through custom cell renderers in column definitions

### When to Add Features

- Only add when multiple features need the same functionality
- Prefer feature-specific implementations first
- Extract common patterns only after seeing duplication
- Maintain small interface principle

## Migration Guide

### From Inline Table to DataTable

1. Wrap existing code in DataTableProvider
2. Replace `<table>` with `<DataTable>`
3. Move header rendering to renderHeaderCell prop
4. Move row rendering to renderRow prop
5. Keep feature-specific logic (selection, focus, etc.) in feature layer

### Example

**Before**:

```typescript
<table>
  <thead>
    {table.getHeaderGroups().map(headerGroup => (
      <tr>{/* headers */}</tr>
    ))}
  </thead>
  <tbody>
    {table.getRowModel().rows.map(row => (
      <tr>{/* cells */}</tr>
    ))}
  </tbody>
</table>
```

**After**:

```typescript
<DataTable<TData>
  renderHeaderCell={(header) => <th>{/* custom header */}</th>}
  renderRow={(row, idx) => <tr>{/* custom row */}</tr>}
/>
```

## References

- [TanStack Table Documentation](https://tanstack.com/table/latest)
- [Deep Modules (A Philosophy of Software Design)](https://web.stanford.edu/~ouster/cgi-bin/book.php)
- [Composition vs Configuration](https://kentcdodds.com/blog/composition-vs-configuration)
