# Inventory Date Range Filtering - DEVELOPMENT NOTES

⚠️ **Temporary file. Source of truth: GitHub issue (to be created)**

## Quick Links

- **GitHub Issue**: (pending creation)
- **Milestone**: v1.0
- **Module**: `module:inventory`
- **Labels**: `type:epic`, `priority:high`, `layer:ui`, `afk`

---

## 🎯 Overview

Add comprehensive date range filtering to the inventory workspace, enabling users to filter products by multiple date fields (expiry, received, transaction dates) with inventory-specific presets and comparison capabilities for period-over-period analysis. The UI will follow the Windows Fluent Design aesthetic with professional Microsoft blue accents in compact mode, matching the existing toolbar style.

**Business Value**: Users can quickly identify expiring products, analyze inventory trends, and make data-driven decisions about stock management.

**Design Philosophy**: Windows-inspired professional theme with compact, efficient layouts. All components use theme variables from `globals.css` (Microsoft blue primary: `oklch(0.55 0.15 252.37)`, Segoe UI font, professional elevation).

---

## 🎭 User Stories

1. As a pharmacy manager, I want to filter products by expiry date range, so that I can identify items expiring soon and take action
2. As an inventory analyst, I want to filter by received date range, so that I can analyze inventory age and turnover
3. As a stock controller, I want to use quick presets like "Expiring in 7 days", so that I can quickly access common date ranges without manual selection
4. As a pharmacy manager, I want to compare inventory levels across time periods, so that I can identify trends and seasonal patterns
5. As an inventory analyst, I want to switch between different date fields (expiry, received, transaction), so that I can analyze different aspects of inventory
6. As a user, I want the date filter to work alongside status and category filters, so that I can create complex queries
7. As a user, I want to see the selected date range in the toolbar, so that I know what filters are active
8. As a user, I want inventory-specific presets like "Expiring in 30 days", so that the tool matches my domain language
9. As a pharmacy manager, I want to compare current expiring stock vs previous period, so that I can identify if expiry issues are increasing
10. As an inventory analyst, I want to filter by transaction date range, so that I can audit stock movements in a specific period
11. As a user, I want the date picker to match the compact toolbar aesthetic, so that the UI remains professional and consistent
12. As a user, I want to clear date filters easily, so that I can reset my view quickly
13. As a pharmacy manager, I want to see how many products match my date filter, so that I understand the scope of results
14. As an inventory analyst, I want to export filtered data with date ranges applied, so that I can create reports
15. As a user, I want the date filter state to persist across page refreshes, so that I don't lose my analysis context

---

## 📐 Architecture Overview

### Layers Involved

**Schema/Database**: No changes - using existing date fields (`nearestExpiry`, `receivedDate`, transaction `timestamp`)

**Domain/Service**: Designed for future server-side filtering - date filter state can be easily serialized and passed as query params

**UI/Component**:

- Refactor `DateRangePicker` to accept custom presets via props
- Create `DataTableDateRangeFilter` wrapper component
- Add date field selector dropdown
- Integrate into `InventoryToolbar`
- Add virtual date columns to table definition

**Integration**:

- DateRangePicker ↔ DataTableContext (via wrapper)
- Date filter ↔ TanStack Table filter system
- Date filter ↔ existing faceted filters (independent operation)

### Key Design Decisions

#### Decision 1: DateRangePicker Refactoring

**Approach**: Extract hardcoded `PRESETS` constant into a prop, allowing consumers to pass custom presets while maintaining backward compatibility.

**Confidence Level**: 95%

**Key Assumptions**:

- DateRangePicker is only used in a few places currently
- Custom presets follow the same interface: `{ label: string, getValue: () => [Date, Date] }`
- Default presets remain available when no custom presets provided

**Would Change If**: DateRangePicker is used in many places with different preset requirements - would need more sophisticated preset composition

**Implementation**:

```typescript
// Before (hardcoded)
const PRESETS = [
  { label: "Today", getValue: () => [...] },
  // ...
];

// After (prop-based with defaults)
interface DateRangePickerProps {
  presets?: Array<{ label: string; getValue: () => [Date, Date] }>;
  // ... other props
}

// Use default presets if none provided
const presetsToUse = presets ?? DEFAULT_PRESETS;
```

**Inventory-Specific Presets**:

- "Expiring in 7 days" - Next 7 days from today
- "Expiring in 30 days" - Next 30 days from today
- "Expiring in 90 days" - Next 90 days from today
- "Received this week" - Current week
- "Received this month" - Current month
- "Received this quarter" - Current quarter
- "All time" - No date restriction

#### Decision 2: DataTableDateRangeFilter Wrapper

**Approach**: Create a thin wrapper component that bridges DateRangePicker and DataTableContext, with abstraction layer for easy server-side migration.

**Confidence Level**: 90%

**Key Assumptions**:

- Wrapper manages date field selection (dropdown)
- Wrapper provides `onFilterChange` callback for external consumers
- Wrapper translates DateRangePicker's `onUpdate` to both table's `setFilterValue` AND callback
- Wrapper handles multiple virtual columns (one per date field)
- Comparison mode data is stored but not used for filtering (display only)
- Filter state is serializable (ISO date strings, field ID)

**Server-Side Migration Path**:

```typescript
// Current (client-side)
<DataTableDateRangeFilter
  dateFields={fields}
  onFilterChange={(state) => {
    // Apply to table filter
    table.setFilterValue(state.fieldId, state.range);
  }}
/>

// Future (server-side)
<DataTableDateRangeFilter
  dateFields={fields}
  onFilterChange={(state) => {
    // Serialize and fetch from server
    refetch({
      dateField: state.fieldId,
      dateFrom: state.range.from.toISOString(),
      dateTo: state.range.to.toISOString(),
    });
  }}
/>
```

**Would Change If**: Real-time filtering is required - would need debouncing and loading states

**Interface**:

```typescript
interface DateFilterState {
  fieldId: string;
  range: { from: Date; to: Date };
  compareRange?: { from: Date; to: Date };
  isComparing: boolean;
}

interface DataTableDateRangeFilterProps<TData> {
  dateFields: Array<{
    id: string;
    label: string;
    accessorFn: (row: TData) => string | null;
  }>;
  presets?: Array<{ label: string; getValue: () => [Date, Date] }>;
  showCompare?: boolean;
  onFilterChange?: (state: DateFilterState | null) => void; // For server-side
  initialState?: DateFilterState; // For controlled mode
}
```

**Deep Module Design**:

- Small interface: Just dateFields config and optional presets
- Deep implementation: Handles field selection, date parsing, filter application, comparison state, trigger button styling
- Testable: All behavior verifiable through public interface (select field, pick dates, verify filtered results)

#### Decision 3: Virtual Date Columns

**Approach**: Add virtual columns to table definition with custom `accessorFn` and `filterFn` for each date field.

**Confidence Level**: 85%

**Key Assumptions**:

- Date strings in data are ISO format (YYYY-MM-DD) or null
- Date comparison is inclusive (start <= date <= end)
- Null dates are excluded from results when filter active
- Virtual columns don't render (used only for filtering)

**Would Change If**: Date formats are inconsistent - would need normalization layer

**Implementation Pattern**:

```typescript
{
  id: "filter:nearestExpiry",
  accessorFn: (row) => row.nearestExpiry,
  filterFn: (row, id, value: { from: Date; to: Date }) => {
    const dateStr = row.getValue(id) as string | null;
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return date >= value.from && date <= value.to;
  },
  enableColumnFilter: true,
  // No header - virtual column
}
```

#### Decision 4: Toolbar Integration - Windows Fluent Design

**Approach**: Place DataTableDateRangeFilter as standalone button next to Filter button, strictly following Windows Fluent Design compact mode.

**Confidence Level**: 95%

**Key Assumptions**:

- Toolbar has space for another button
- Date filter is independent of faceted filters (separate popovers)
- Trigger button shows selected date range when active
- Badge shows active state using Microsoft blue primary color
- All styling uses theme variables from `globals.css`
- Compact mode: 11px-12px fonts, tight spacing, small heights

**Would Change If**: Toolbar becomes too crowded - might need to combine into unified filter panel

**Windows Fluent Design Styling** (MANDATORY):

```typescript
// Trigger button - MUST match Filter button exactly
<button className="flex items-center gap-1 h-[26px] px-2 rounded border border-transparent text-muted-foreground hover:bg-muted hover:border-border transition-colors text-[11px]">
  <CalendarIcon className="w-3.5 h-3.5" />
  <span>Date</span>
  {isActive && (
    <Badge className="ml-0.5 h-4 min-w-4 px-1 text-[10px] font-semibold bg-primary text-primary-foreground">
      Active
    </Badge>
  )}
</button>

// Popover content - compact mode
<PopoverContent className="w-auto p-0 border-border shadow-lg">
  {/* Use DateRangePicker with size="sm" for compact mode */}
  <DateRangePicker size="sm" />
</PopoverContent>

// Field selector dropdown - compact
<Select>
  <SelectTrigger className="h-7 text-[11px]">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem className="text-[11px]">Expiry Date</SelectItem>
  </SelectContent>
</Select>
```

**Theme Variables to Use**:

- Primary (Microsoft blue): `var(--primary)` = `oklch(0.55 0.15 252.37)`
- Primary foreground: `var(--primary-foreground)`
- Muted: `var(--muted)`
- Muted foreground: `var(--muted-foreground)`
- Border: `var(--border)`
- Font: Segoe UI (from `--font-sans`)

**Compact Mode Specifications**:

- Button height: `h-[26px]`
- Font sizes: `text-[11px]` for buttons, `text-[10px]` for badges
- Icon size: `w-3.5 h-3.5`
- Padding: `px-2` for buttons
- Badge height: `h-4`
- Dropdown height: `h-7`

#### Decision 5: State Persistence

**Approach**: Store date filter state in localStorage alongside page size, using same persistence key pattern.

**Confidence Level**: 80%

**Key Assumptions**:

- Date ranges are serialized as ISO strings
- Selected date field is stored as string ID
- Comparison state is stored separately
- State is restored on mount

**Would Change If**: Multiple users share same browser - would need user-specific storage or server-side preferences

**Alternative**: Don't persist date filters (treat as session-only). This is simpler but less convenient for users who frequently use the same date ranges.

---

## ✅ Acceptance Criteria

### Core Functionality

- [ ] User can select date range using DateRangePicker
- [ ] User can switch between date fields (Expiry, Received, Transaction)
- [ ] User can use inventory-specific presets
- [ ] User can enable comparison mode to see period-over-period data
- [ ] Date filter works alongside status and category filters
- [ ] Filtered results update immediately when date range changes

### UI/UX

- [ ] Date filter button matches Windows Fluent Design compact mode (h-[26px], text-[11px])
- [ ] All styling uses theme variables from globals.css (no hardcoded colors)
- [ ] Microsoft blue primary color used for active states
- [ ] Selected date range displays in trigger button
- [ ] Active state shows badge indicator with primary color
- [ ] Popover aligns properly with toolbar
- [ ] Date field selector uses compact styling (h-7, text-[11px])
- [ ] DateRangePicker uses size="sm" for compact mode
- [ ] Segoe UI font family applied throughout

### Data Handling

- [ ] Null dates are handled gracefully (excluded from results)
- [ ] Date parsing handles ISO format strings
- [ ] Date comparison is inclusive (start <= date <= end)
- [ ] Comparison data is calculated but not used for filtering
- [ ] Filter state is serializable for server-side migration
- [ ] `onFilterChange` callback provides clean state object

### Performance

- [ ] Filtering 1000+ products is instant (<100ms)
- [ ] No unnecessary re-renders when date changes
- [ ] State persistence doesn't block UI

### Testing

- [ ] All components have integration-style tests
- [ ] Tests verify behavior through public interface
- [ ] Tests cover date field switching
- [ ] Tests cover preset selection
- [ ] Tests cover comparison mode
- [ ] Tests cover interaction with other filters

---

## 🗺️ Implementation Phases

### Phase 0: Foundation - DateRangePicker Refactoring

**Goal**: Make DateRangePicker accept custom presets

- [ ] Extract `PRESETS` constant to `DEFAULT_PRESETS`
- [ ] Add `presets` prop to DateRangePickerProps interface
- [ ] Update component to use `presets ?? DEFAULT_PRESETS`
- [ ] Add tests for custom presets
- [ ] Verify existing usages still work

**Estimated Effort**: 2-3 hours

### Phase 1: Core Date Filtering

**Goal**: Basic date range filtering working for one date field with server-side ready architecture

- [ ] Create `DataTableDateRangeFilter` component with `onFilterChange` callback
- [ ] Add virtual `nearestExpiry` column to InventoryWorkspace
- [ ] Implement date filterFn with inclusive range logic
- [ ] Add trigger button to toolbar with Windows Fluent Design compact styling
- [ ] Ensure filter state is serializable (ISO strings)
- [ ] Write integration tests for basic filtering

**Estimated Effort**: 4-6 hours

### Phase 2: Multi-Field Support

**Goal**: User can switch between different date fields

- [ ] Add date field selector dropdown with compact Windows styling (h-7, text-[11px])
- [ ] Add virtual columns for `receivedDate` and transaction `timestamp`
- [ ] Implement field switching logic
- [ ] Update `onFilterChange` callback to include field ID
- [ ] Update tests to cover field switching
- [ ] Add field label to trigger button display

**Estimated Effort**: 3-4 hours

### Phase 3: Inventory Presets

**Goal**: Inventory-specific presets available

- [ ] Define inventory preset functions (Expiring in 7/30/90 days, etc.)
- [ ] Pass custom presets to DateRangePicker
- [ ] Test preset calculations
- [ ] Verify presets work with comparison mode

**Estimated Effort**: 2-3 hours

### Phase 4: State Persistence

**Goal**: Date filter state persists across refreshes

- [ ] Add date filter state to localStorage
- [ ] Serialize/deserialize date ranges as ISO strings
- [ ] Restore state on mount
- [ ] Test persistence behavior

**Estimated Effort**: 2-3 hours

### Phase 5: Polish & Integration

**Goal**: Production-ready with full test coverage

- [ ] Add loading states if needed
- [ ] Improve accessibility (ARIA labels, keyboard navigation)
- [ ] Add comprehensive integration tests
- [ ] Test with large datasets (1000+ products)
- [ ] Update documentation

**Estimated Effort**: 3-4 hours

**Total Estimated Effort**: 16-23 hours

---

## 📊 Success Metrics

### User Behavior

- 70%+ of users use date filtering within first week
- Average 3+ date filter interactions per session
- Preset usage > 60% (vs manual date selection)

### Performance

- Date filtering completes in <100ms for 1000 products
- No performance degradation with multiple filters active
- State persistence doesn't impact page load time

### Quality

- Zero bugs reported in first 2 weeks
- 90%+ test coverage for new components
- All tests pass consistently

---

## 🧪 Testing Decisions

### Testing Philosophy

Only test external behavior through public interfaces. Tests should verify WHAT the system does, not HOW it does it.

### Modules to Test

**DataTableDateRangeFilter** - Core wrapper component

- Why: Complex integration point between DateRangePicker and table filtering
- Approach: Integration tests that render full table with filter, verify filtered results
- Pattern: Similar to DataTableFacetedFilter tests

**DateRangePicker (custom presets)** - Refactored component

- Why: New prop changes behavior, need to verify backward compatibility
- Approach: Test with custom presets, verify default presets still work
- Pattern: Existing component tests (if any) + new preset tests

**InventoryWorkspace (date filtering integration)** - Feature integration

- Why: Verify date filtering works with existing filters and table features
- Approach: End-to-end tests that select dates, verify filtered products
- Pattern: Similar to existing inventory workspace tests

### Prior Art

✓ **GOOD Pattern**: DataTableFacetedFilter tests

- Tests through public interface (click trigger, select options, verify results)
- Uses real DataTableProvider and DataTable components
- Verifies behavior, not implementation
- One logical assertion per test
- Would survive refactoring

✓ **GOOD Pattern**: Integration-style tests

```typescript
test("selecting date range filters products by expiry", async () => {
  render(<InventoryWorkspace />);

  // Open date filter
  await user.click(screen.getByRole("button", { name: /date/i }));

  // Select "Expiring in 7 days" preset
  await user.click(screen.getByText("Expiring in 7 days"));
  await user.click(screen.getByText("Apply"));

  // Verify only products expiring in next 7 days are shown
  const rows = screen.getAllByRole("row");
  expect(rows).toHaveLength(expectedCount + 1); // +1 for header
});
```

✗ **BAD Pattern**: Testing implementation details

```typescript
// DON'T DO THIS
test("date filter calls setFilterValue with correct params", () => {
  const mockSetFilter = vi.fn();
  // ... mock internal collaborator
  expect(mockSetFilter).toHaveBeenCalledWith(...);
});
```

✗ **BAD Pattern**: Testing private methods

```typescript
// DON'T DO THIS
test("parseDateString converts ISO to Date", () => {
  const result = component.parseDateString("2024-01-01");
  expect(result).toBeInstanceOf(Date);
});
```

### Test Coverage Goals

- DataTableDateRangeFilter: 15-20 tests
  - Basic rendering (trigger button, field selector)
  - Date selection and filtering
  - Field switching
  - Preset selection
  - Comparison mode
  - Integration with table filters
- DateRangePicker (custom presets): 5-8 tests
  - Custom presets render
  - Custom presets apply correctly
  - Default presets still work
  - Preset selection updates range

- InventoryWorkspace integration: 8-12 tests
  - Date filter + status filter
  - Date filter + category filter
  - All filters combined
  - Field switching with active filters
  - State persistence

**Total**: 28-40 tests

---

## 🚫 Out of Scope

### Explicitly NOT Included

- Server-side date filtering (all filtering is client-side)
- Date filtering for other modules (Dashboard, Customers, POS)
- Advanced date math (fiscal years, custom periods)
- Date range validation (preventing invalid ranges)
- Timezone handling (assumes all dates in local timezone)
- Date format customization (uses default locale formatting)
- Keyboard shortcuts for date selection
- Date filter in mobile view (desktop only for now)
- Export with date ranges (uses existing export functionality)
- Date-based sorting (separate feature)
- Historical data comparison beyond comparison mode
- Predictive date suggestions based on usage patterns

### Future Enhancements (Not in This Epic)

- Server-side filtering for large datasets (architecture ready via `onFilterChange`)
- Date filtering in other modules
- Advanced analytics with date ranges
- Custom date format preferences
- Mobile-optimized date picker
- Keyboard shortcuts
- Date-based alerts and notifications
- Real-time filtering with debouncing
- Loading states for server-side filtering

---

## 📝 Further Notes

### Assumptions

- Products data is already loaded (no lazy loading)
- Date strings in data are ISO format or null
- Users understand date range concepts
- Comparison mode is for display/analysis, not filtering
- Toolbar has space for additional button
- localStorage is available and reliable

### Constraints

- MUST use Windows Fluent Design compact mode styling
- MUST use theme variables from globals.css (no hardcoded colors)
- MUST use Microsoft blue primary color (oklch(0.55 0.15 252.37))
- MUST use Segoe UI font family
- MUST maintain compact sizing (h-[26px] buttons, text-[11px] fonts)
- Must work with existing filter system
- Must not impact table performance
- Must follow TDD workflow
- Must use existing DateRangePicker component
- Must be designed for easy server-side migration

### Risks & Mitigations

**Risk**: DateRangePicker refactoring breaks existing usages

- Mitigation: Maintain backward compatibility with default presets
- Mitigation: Test all existing usages after refactoring

**Risk**: Date parsing fails for inconsistent formats

- Mitigation: Add robust date parsing with fallbacks
- Mitigation: Log warnings for invalid dates

**Risk**: Performance degrades with large datasets

- Mitigation: Profile filtering with 1000+ products
- Mitigation: Optimize filterFn if needed

**Risk**: State persistence causes bugs across sessions

- Mitigation: Version localStorage schema
- Mitigation: Handle missing/corrupt data gracefully

**Risk**: Comparison mode confuses users

- Mitigation: Clear labeling and visual distinction
- Mitigation: Optional feature (can be disabled)

### Technical Debt

- DateRangePicker has hardcoded presets (addressed in Phase 0)
- No date validation in DateRangePicker (acceptable for now)
- No timezone handling (acceptable for single-location pharmacy)
- Client-side filtering only (server-side ready but not implemented)

### Dependencies

- Existing DateRangePicker component
- DataTableContext and filter system
- TanStack Table filtering
- localStorage API
- react-day-picker library

### Related Work

- DataTableFilters component (similar pattern)
- DataTableFacetedFilter component (similar testing approach)
- InventoryWorkspace toolbar (integration point)

---

## 🔗 Related Issues

- (To be created) - Refactor DateRangePicker for custom presets
- (To be created) - Create DataTableDateRangeFilter component
- (To be created) - Add date filtering to InventoryWorkspace
- (To be created) - Add inventory-specific date presets
- (To be created) - Implement date filter state persistence

---

## ✅ Verification Checklist

- [x] Problem statement reflects user perspective
- [x] User stories comprehensive and specific (15 stories)
- [x] Implementation decisions include confidence levels
- [x] Assumptions and alternatives documented
- [x] Scope clearly bounded (out of scope section)
- [x] Testing requirements specific and actionable
- [x] Good/bad patterns identified from codebase
- [x] Architecture decisions documented
- [x] Deep module design (small interface, deep implementation)
- [x] Follows UNDERSTAND → ANALYZE → STRATEGIZE → EXECUTE

---

**Priority**: High
**Estimated Timeline**: 2-3 days (16-23 hours)
**Complexity**: Medium
**Classification**: `afk` (can be implemented without human interaction after approval)

---

_DELETE THIS FILE after development is complete. Source of truth will be GitHub issue._
