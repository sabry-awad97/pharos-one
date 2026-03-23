# DataTable Architecture

## Overview

The DataTable component library provides a reusable, type-safe table implementation built on TanStack Table with React Context for state management.

## Architectural Decisions

### Decision 1: Thin Context Wrapper Pattern

**Approach**: Wrap existing `useDataTable` hook in a React Context provider without adding additional abstraction layers.

**Confidence**: 85%

**Rationale**:

- Leverages existing, tested `useDataTable` logic
- Minimal complexity - easy to understand and maintain
- Provides composition benefits without over-engineering
- Allows gradual migration from direct hook usage

**Assumptions**:

- Most features need basic table state sharing (sorting, pagination, selection)
- Complex state management (bulk actions, cross-page selection) can be added later
- TanStack Table provides sufficient built-in functionality

**Would change if**:

- Multiple features require complex shared state beyond table instance
- Need for global table state across multiple table instances
- Performance issues with context re-renders (would split contexts)

**Alternative** (if <80%): Headless UI pattern with complete separation of logic and rendering, but this adds unnecessary complexity for current needs.

### Decision 2: Single Generic Type Parameter

**Approach**: Use only `TData` generic, not `TData, TValue` pair.

**Confidence**: 90%

**Rationale**:

- `useDataTable` hook only uses `TData` generic
- `TValue` is column-specific, not table-level concern
- Simpler API reduces cognitive load
- Matches actual usage patterns in codebase

**Assumptions**:

- Column value types are inferred from column definitions
- No need for table-level value type constraints

**Would change if**: Need to enforce specific value types across all columns (unlikely scenario).

### Decision 3: Expose Full Hook Return Value

**Approach**: Context provides entire `useDataTable` return value plus original columns/data.

**Confidence**: 95%

**Rationale**:

- Maximum flexibility for consumers
- No need to predict which state will be needed
- Maintains backward compatibility with direct hook usage
- Enables advanced use cases (custom selection, keyboard navigation)

**Assumptions**:

- Consumers may need any part of table state
- Performance impact of larger context value is negligible
- Memoization prevents unnecessary re-renders

**Would change if**: Performance profiling shows context re-renders are a bottleneck (would split into multiple contexts).

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         Consumer Features               │
│  (InventoryWorkspace, OrdersTable, etc) │
└─────────────────┬───────────────────────┘
                  │
                  │ uses
                  ▼
┌─────────────────────────────────────────┐
│      DataTable Component Library        │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  DataTableProvider (Context)       │ │
│  │  - Wraps useDataTable              │ │
│  │  - Provides state to children      │ │
│  └────────────┬───────────────────────┘ │
│               │                          │
│               │ uses                     │
│               ▼                          │
│  ┌────────────────────────────────────┐ │
│  │  useDataTable (Hook)               │ │
│  │  - Table instance creation         │ │
│  │  - State management                │ │
│  │  - Selection logic                 │ │
│  │  - Pagination persistence          │ │
│  └────────────┬───────────────────────┘ │
│               │                          │
└───────────────┼──────────────────────────┘
                │
                │ uses
                ▼
┌─────────────────────────────────────────┐
│      TanStack Table (External)          │
│  - Core table logic                     │
│  - Sorting, filtering, pagination       │
└─────────────────────────────────────────┘
```

## Component Structure

```
data-table/
├── hooks/
│   └── useDataTable.ts          # Core table logic
│       - Table instance creation
│       - State management (sorting, pagination, selection)
│       - Windows-style multi-select
│       - LocalStorage persistence
│
├── context/
│   └── DataTableContext.tsx     # Context provider
│       - Wraps useDataTable hook
│       - Provides state to descendants
│       - Type-safe generic interface
│
├── examples/
│   └── BasicExample.tsx         # Usage demonstration
│
├── __tests__/                   # Unit tests
│   ├── useDataTable.test.tsx
│   └── useDataTable-pagination.test.tsx
│
├── index.ts                     # Public API
├── README.md                    # Usage documentation
└── ARCHITECTURE.md              # This file
```

## Data Flow

### Pattern 1: Direct Hook Usage

```
Component
    │
    ├─> useDataTable({ columns, data })
    │       │
    │       └─> TanStack useReactTable()
    │
    └─> Render table with table instance
```

### Pattern 2: Context Provider Usage

```
DataTableProvider
    │
    ├─> useDataTable({ columns, data })
    │       │
    │       └─> TanStack useReactTable()
    │
    └─> Context.Provider
            │
            ├─> Toolbar (useDataTableContext)
            ├─> Table (useDataTableContext)
            └─> Pagination (useDataTableContext)
```

## Extension Points

### 1. Custom State in Context

Add new state to context without breaking existing consumers:

```typescript
interface DataTableContextValue<TData> extends UseDataTableReturn<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  // New extension point
  customState?: any;
}
```

### 2. Custom Hooks

Create specialized hooks that consume context:

```typescript
function useDataTableSelection<TData>() {
  const { table, selectedRowIds } = useDataTableContext<TData>();
  return {
    selectedRows: Array.from(selectedRowIds),
    selectAll: () => {
      /* ... */
    },
    clearSelection: () => {
      /* ... */
    },
  };
}
```

### 3. Subcomponent Composition

Build complex tables from simple components:

```typescript
<DataTableProvider columns={columns} data={data}>
  <DataTableToolbar />
  <DataTableFilters />
  <DataTable />
  <DataTableBulkActions />
  <DataTablePagination />
</DataTableProvider>
```

## Coupling Points

### Internal Dependencies

1. **useDataTable → TanStack Table**: Direct dependency on `@tanstack/react-table`
   - Risk: Breaking changes in TanStack Table
   - Mitigation: Pin major version, test upgrades thoroughly

2. **DataTableContext → useDataTable**: Tight coupling by design
   - Risk: Changes to hook signature require context updates
   - Mitigation: Both are in same module, changes are coordinated

### External Dependencies

1. **Consumer Features → DataTableProvider**: Loose coupling via props
   - Risk: Breaking changes to provider props
   - Mitigation: Semantic versioning, deprecation warnings

2. **Consumer Features → useDataTableContext**: Loose coupling via hook
   - Risk: Changes to context value shape
   - Mitigation: TypeScript ensures compile-time safety

## Performance Considerations

### Context Re-renders

**Current Approach**: Single context with memoized value

**Optimization Opportunities** (if needed):

1. Split into multiple contexts (table, selection, pagination)
2. Use context selectors (via library like `use-context-selector`)
3. Memoize expensive child components

**Monitoring**: Watch for unnecessary re-renders in React DevTools

### State Updates

**Current Approach**: TanStack Table handles internal optimizations

**Best Practices**:

- Use `React.memo` for expensive table cells
- Virtualize large datasets (TanStack Table Virtual)
- Debounce filter inputs

## Testing Strategy

### Unit Tests

- Hook behavior (sorting, pagination, selection)
- Context provider/consumer integration
- Type safety verification

### Integration Tests

- Full table rendering with context
- User interactions (click, keyboard)
- State persistence

### Consumer Tests

- Features using DataTable work correctly
- Migration from direct hook to context

## Migration Path

### From Direct Hook to Context

1. **Wrap with Provider**:

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
   ```

2. **Update Consumers**:

   ```typescript
   function MyTableContent() {
     const { table } = useDataTableContext();
     return <div>{/* table UI */}</div>;
   }
   ```

3. **Extract Subcomponents** (optional):
   - Move toolbar to separate component
   - Move pagination to separate component
   - Share state via context

## Future Enhancements

### Potential Additions (without breaking changes)

1. **Selection State Management**:
   - Cross-page selection
   - Bulk action support
   - Selection persistence

2. **Filter Presets**:
   - Save/load filter configurations
   - Share filters between users

3. **Column Visibility**:
   - Persist column visibility
   - Column reordering

4. **Export Functionality**:
   - CSV export
   - Excel export
   - PDF export

5. **Advanced Sorting**:
   - Multi-column sort
   - Custom sort functions
   - Sort persistence

### Breaking Changes (if needed)

Would require major version bump:

- Changing context value shape
- Removing exposed state
- Changing hook signature

## Verification Checklist

✅ **Separation of Concerns**:

- Hook handles logic
- Context handles state distribution
- Components handle rendering

✅ **Open/Closed Principle**:

- Can add new state without modifying existing code
- Can create custom hooks without changing context

✅ **No Hidden Coupling**:

- All dependencies explicit via imports
- Type system enforces contracts

✅ **Scalability**:

- Context memoization prevents unnecessary re-renders
- Can split contexts if performance issues arise

✅ **SOLID Principles**:

- Single Responsibility: Each module has one job
- Dependency Inversion: Consumers depend on abstractions (context)
- Interface Segregation: Consumers use only what they need

## Lessons Learned

1. **Start Simple**: Thin wrapper over existing hook was sufficient
2. **Type Safety Matters**: Generic types caught issues early
3. **Memoization is Key**: Prevents context re-render issues
4. **Documentation is Critical**: Clear examples reduce confusion
5. **Test Early**: Unit tests caught type mismatches before integration

## References

- [TanStack Table Documentation](https://tanstack.com/table/latest)
- [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)
- [TypeScript Generics Guide](https://www.typescriptlang.org/docs/handbook/2/generics.html)
