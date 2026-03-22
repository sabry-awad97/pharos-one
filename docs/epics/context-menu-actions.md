# Context Menu Actions Epic

> **Epic Planning Document**  
> This is a planning artifact. Source of truth: GitHub issues.  
> See [docs/epics/README.md](./README.md) for workflow.

## Overview

This document outlines the roadmap for expanding the inventory table context menu with additional actions. The approach prioritizes refactoring the action system first to make adding new actions scalable and maintainable.

**Related GitHub Issues:**

- Parent Epic: _To be created using `.github/ISSUE_TEMPLATE/epic.md`_
- Implementation issues: _To be created via `/prd-to-issues` skill_

## Current State

**Implemented Actions:**

- Edit Product (⌘E)
- View Batches (⌘B)
- View History (⌘H)
- Adjust Stock (⌘S)
- Mark as Expiring (context-aware, expiring items only)

**Current Architecture:**

- Actions are inline in `InventoryWorkspace.tsx`
- Action handlers use `console.log` placeholders
- Context-aware filtering uses inline conditionals
- No action registry or extensibility system

**Technical Debt:**

- Adding new actions requires modifying the component directly
- No reusability across other tables
- No centralized action management
- Difficult to test actions in isolation

---

## Phase 0: Refactoring (Foundation)

**Goal:** Create an extensible action system that makes adding new actions trivial.

### 0.1 Define Action System Types

**File:** `apps/web/src/features/modules/inventory/types/actions.ts`

```typescript
import type { LucideIcon } from "lucide-react";
import type { ProductStockSummary } from "../schema";

export interface InventoryAction {
  id: string;
  label: string;
  group: "edit" | "view" | "stock" | "compliance" | "export" | "workflow";
  shortcut?: string;
  icon?: LucideIcon;
  isVisible: (row: ProductStockSummary) => boolean;
  isDisabled?: (row: ProductStockSummary) => boolean;
  handler: (row: ProductStockSummary) => void | Promise<void>;
  requiresConfirmation?: boolean;
  confirmMessage?: (row: ProductStockSummary) => string;
}

export interface ActionGroup {
  id: string;
  label: string;
  order: number;
}
```

**Acceptance Criteria:**

- [ ] Types defined with full JSDoc comments
- [ ] Exported from `types/actions.ts`
- [ ] No compilation errors

---

### 0.2 Create Action Registry

**File:** `apps/web/src/features/modules/inventory/config/inventory-actions.ts`

```typescript
import { Edit, Eye, Package, Clock } from "lucide-react";
import type { InventoryAction } from "../types/actions";

export const inventoryActions: InventoryAction[] = [
  {
    id: "edit-product",
    label: "Edit Product",
    group: "edit",
    shortcut: "⌘E",
    icon: Edit,
    isVisible: () => true,
    handler: (row) => {
      console.log("Edit Product:", row);
      // TODO: Open edit dialog
    },
  },
  {
    id: "view-batches",
    label: "View Batches",
    group: "view",
    shortcut: "⌘B",
    icon: Package,
    isVisible: () => true,
    handler: (row) => {
      console.log("View Batches:", row);
      // TODO: Open batches panel
    },
  },
  {
    id: "view-history",
    label: "View History",
    group: "view",
    shortcut: "⌘H",
    icon: Clock,
    isVisible: () => true,
    handler: (row) => {
      console.log("View History:", row);
      // TODO: Open history timeline
    },
  },
  {
    id: "adjust-stock",
    label: "Adjust Stock",
    group: "stock",
    shortcut: "⌘S",
    icon: Package,
    isVisible: () => true,
    handler: (row) => {
      console.log("Adjust Stock:", row);
      // TODO: Open stock adjustment dialog
    },
  },
  {
    id: "mark-expiring",
    label: "Mark as Expiring",
    group: "stock",
    isVisible: (row) => row.stockStatus === "expiring",
    handler: (row) => {
      console.log("Mark as Expiring:", row);
      // TODO: Update stock status
    },
  },
];

export const actionGroups: Record<string, { label: string; order: number }> = {
  edit: { label: "Edit", order: 1 },
  view: { label: "View", order: 2 },
  stock: { label: "Actions", order: 3 },
  compliance: { label: "Compliance", order: 4 },
  export: { label: "Export", order: 5 },
  workflow: { label: "Workflow", order: 6 },
};
```

**Acceptance Criteria:**

- [ ] All current actions migrated to registry
- [ ] Action groups defined with ordering
- [ ] Handlers maintain current behavior (console.log)
- [ ] No breaking changes to existing functionality

---

### 0.3 Create Reusable Context Menu Component

**File:** `apps/web/src/features/modules/inventory/components/TableRowContextMenu.tsx`

```typescript
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
} from "@pharos-one/ui/components/context-menu";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
  CommandSeparator,
  CommandShortcut,
} from "@pharos-one/ui/components/command";
import type { InventoryAction } from "../types/actions";
import type { ProductStockSummary } from "../schema";

interface TableRowContextMenuProps {
  row: ProductStockSummary;
  actions: InventoryAction[];
  actionGroups: Record<string, { label: string; order: number }>;
  children: React.ReactNode;
}

export function TableRowContextMenu({
  row,
  actions,
  actionGroups,
  children,
}: TableRowContextMenuProps) {
  // Filter visible actions
  const visibleActions = actions.filter((action) => action.isVisible(row));

  // Group actions by group
  const groupedActions = visibleActions.reduce((acc, action) => {
    if (!acc[action.group]) acc[action.group] = [];
    acc[action.group].push(action);
    return acc;
  }, {} as Record<string, InventoryAction[]>);

  // Sort groups by order
  const sortedGroups = Object.entries(groupedActions).sort(
    ([a], [b]) => actionGroups[a].order - actionGroups[b].order
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="p-0">
        <Command>
          <CommandInput placeholder="Search actions..." />
          <CommandList>
            <CommandEmpty>No actions found.</CommandEmpty>
            {sortedGroups.map(([groupId, groupActions], idx) => (
              <React.Fragment key={groupId}>
                {idx > 0 && <CommandSeparator />}
                <CommandGroup heading={actionGroups[groupId].label}>
                  {groupActions.map((action) => (
                    <CommandItem
                      key={action.id}
                      onSelect={() => action.handler(row)}
                      disabled={action.isDisabled?.(row)}
                    >
                      {action.icon && <action.icon className="mr-2" />}
                      {action.label}
                      {action.shortcut && (
                        <CommandShortcut>{action.shortcut}</CommandShortcut>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

**Acceptance Criteria:**

- [ ] Component accepts actions and groups as props
- [ ] Filters actions by visibility
- [ ] Groups and sorts actions correctly
- [ ] Renders icons and shortcuts
- [ ] Handles disabled state
- [ ] All existing tests pass

---

### 0.4 Update InventoryWorkspace to Use New Component

**File:** `apps/web/src/features/modules/inventory/InventoryWorkspace.tsx`

Replace inline context menu with:

```typescript
import { TableRowContextMenu } from "./components/TableRowContextMenu";
import { inventoryActions, actionGroups } from "./config/inventory-actions";

// In the table body:
{table.getRowModel().rows.map((row, idx) => {
  const selected = row.getIsSelected();
  return (
    <TableRowContextMenu
      key={row.id}
      row={row.original}
      actions={inventoryActions}
      actionGroups={actionGroups}
    >
      <tr
        className="transition-[background] duration-100"
        style={{
          // ... existing styles
        }}
      >
        {/* ... existing cells */}
      </tr>
    </TableRowContextMenu>
  );
})}
```

**Acceptance Criteria:**

- [ ] Component renders correctly
- [ ] All existing actions work
- [ ] Context menu opens on right-click
- [ ] Search filtering works
- [ ] Keyboard navigation works
- [ ] All 8 existing tests pass
- [ ] No visual regressions

---

### 0.5 Create Action Management Hook

**File:** `apps/web/src/features/modules/inventory/hooks/use-inventory-actions.ts`

```typescript
import { useMemo } from "react";
import { inventoryActions, actionGroups } from "../config/inventory-actions";
import type { InventoryAction } from "../types/actions";
import type { ProductStockSummary } from "../schema";

export function useInventoryActions(row: ProductStockSummary) {
  const visibleActions = useMemo(
    () => inventoryActions.filter((action) => action.isVisible(row)),
    [row],
  );

  const executeAction = async (actionId: string) => {
    const action = inventoryActions.find((a) => a.id === actionId);
    if (!action) return;

    if (action.requiresConfirmation) {
      const message =
        typeof action.confirmMessage === "function"
          ? action.confirmMessage(row)
          : "Are you sure?";
      if (!confirm(message)) return;
    }

    await action.handler(row);
  };

  return {
    actions: visibleActions,
    actionGroups,
    executeAction,
  };
}
```

**Acceptance Criteria:**

- [ ] Hook filters actions by visibility
- [ ] Memoizes results for performance
- [ ] Handles confirmation dialogs
- [ ] Supports async handlers
- [ ] Can be used in other components

---

### 0.6 Update Tests for Refactored System

**File:** `apps/web/src/__tests__/inventory-context-menu.test.tsx`

Update tests to work with new component structure:

```typescript
// Mock the action registry
vi.mock("../features/modules/inventory/config/inventory-actions", () => ({
  inventoryActions: [
    {
      id: "edit-product",
      label: "Edit Product",
      group: "edit",
      shortcut: "⌘E",
      isVisible: () => true,
      handler: vi.fn((row) => console.log("Edit Product:", row)),
    },
    // ... other actions
  ],
  actionGroups: {
    edit: { label: "Edit", order: 1 },
    view: { label: "View", order: 2 },
    stock: { label: "Actions", order: 3 },
  },
}));
```

**Acceptance Criteria:**

- [ ] All 8 existing tests pass
- [ ] Tests use mocked action registry
- [ ] Tests verify action filtering
- [ ] Tests verify action execution
- [ ] No test flakiness

---

## Phase 1: Quick Wins (High Value, Low Complexity)

**Timeline:** After Phase 0 complete

### 1.1 Quick Reorder Action

**Priority:** HIGH  
**Complexity:** MEDIUM  
**Value:** HIGH

```typescript
{
  id: "quick-reorder",
  label: "Quick Reorder",
  group: "stock",
  shortcut: "⌘R",
  icon: ShoppingCart,
  isVisible: (row) => row.availableQuantity < row.reorderLevel,
  handler: async (row) => {
    // Open purchase order form with pre-filled data
    // - Product: row.id
    // - Supplier: row.defaultSupplier
    // - Quantity: row.reorderLevel * 2 (suggested)
  },
}
```

**Implementation Tasks:**

- [ ] Create `PurchaseOrderDialog` component
- [ ] Add form with product, supplier, quantity fields
- [ ] Pre-fill form with row data
- [ ] Submit creates purchase order
- [ ] Add test for visibility rule
- [ ] Add test for dialog opening

---

### 1.2 View Stock Movements Action

**Priority:** HIGH  
**Complexity:** MEDIUM  
**Value:** HIGH

```typescript
{
  id: "view-stock-movements",
  label: "View Stock Movements",
  group: "view",
  shortcut: "⌘M",
  icon: TrendingUp,
  isVisible: () => true,
  handler: async (row) => {
    // Open timeline panel showing all transactions
    // Query: stockTransactionSchema filtered by productId
    // Display: date, type, quantity, user, reason
  },
}
```

**Implementation Tasks:**

- [ ] Create `StockMovementsPanel` component
- [ ] Create `stock-transaction.service.ts` with query methods
- [ ] Create `use-stock-transactions.ts` hook
- [ ] Display timeline with transaction details
- [ ] Add filtering by transaction type
- [ ] Add test for panel rendering
- [ ] Add test for transaction display

---

### 1.3 Batch Details Action

**Priority:** HIGH  
**Complexity:** LOW  
**Value:** HIGH

```typescript
{
  id: "batch-details",
  label: "Batch Details",
  group: "view",
  shortcut: "⌘D",
  icon: Package,
  isVisible: (row) => row.batchCount > 0,
  handler: async (row) => {
    // Open expandable panel showing all batches
    // Query: batchWithRelationsSchema filtered by productId
    // Display: batch number, expiry, quantity, supplier, status
  },
}
```

**Implementation Tasks:**

- [ ] Create `BatchDetailsPanel` component
- [ ] Query batches from `batch.service.ts`
- [ ] Display batch table with sorting
- [ ] Highlight expiring batches
- [ ] Add test for panel rendering
- [ ] Add test for batch display

---

## Phase 2: Compliance & Safety (Critical for Pharmacy)

**Timeline:** After Phase 1 complete

### 2.1 Quarantine Batch Action

**Priority:** HIGH  
**Complexity:** MEDIUM  
**Value:** HIGH

```typescript
{
  id: "quarantine-batch",
  label: "Quarantine Batch",
  group: "compliance",
  icon: AlertTriangle,
  isVisible: (row) => row.stockStatus === "available",
  requiresConfirmation: true,
  confirmMessage: (row) =>
    `Quarantine all batches of ${row.name}? This will prevent dispensing.`,
  handler: async (row) => {
    // Update batch status to "quarantine"
    // Require reason input
    // Create audit log entry
  },
}
```

**Implementation Tasks:**

- [ ] Create `QuarantineDialog` component with reason input
- [ ] Update batch status in database
- [ ] Create audit log entry
- [ ] Add notification to staff
- [ ] Add test for confirmation dialog
- [ ] Add test for status update

---

### 2.2 Audit Trail Action

**Priority:** MEDIUM  
**Complexity:** MEDIUM  
**Value:** MEDIUM

```typescript
{
  id: "audit-trail",
  label: "Audit Trail",
  group: "compliance",
  icon: FileText,
  isVisible: () => true,
  handler: async (row) => {
    // Display full audit log
    // - All transactions with userId
    // - Status changes
    // - Price changes
    // - Batch updates
  },
}
```

**Implementation Tasks:**

- [ ] Create `AuditTrailPanel` component
- [ ] Query all relevant audit data
- [ ] Display timeline with user info
- [ ] Add filtering by action type
- [ ] Add export to PDF
- [ ] Add test for audit display

---

### 2.3 Generate Batch Report Action

**Priority:** MEDIUM  
**Complexity:** HIGH  
**Value:** MEDIUM

```typescript
{
  id: "generate-batch-report",
  label: "Generate Batch Report",
  group: "compliance",
  icon: FileDown,
  isVisible: (row) => row.batchCount > 0,
  handler: async (row) => {
    // Generate PDF report with:
    // - Product details
    // - All batch numbers and expiry dates
    // - Current quantities
    // - Supplier information
    // - Compliance signatures
  },
}
```

**Implementation Tasks:**

- [ ] Install PDF generation library (e.g., jsPDF)
- [ ] Create report template
- [ ] Query all batch data
- [ ] Generate and download PDF
- [ ] Add test for report generation

---

## Phase 3: Export & Reporting

**Timeline:** After Phase 2 complete

### 3.1 Export to Excel Action

**Priority:** MEDIUM  
**Complexity:** LOW  
**Value:** MEDIUM

```typescript
{
  id: "export-excel",
  label: "Export to Excel",
  group: "export",
  icon: Download,
  isVisible: () => true,
  handler: async (row) => {
    // Export product data with all batches and transactions
    // Use xlsx library
  },
}
```

---

### 3.2 Print Barcode Label Action

**Priority:** LOW  
**Complexity:** MEDIUM  
**Value:** LOW

```typescript
{
  id: "print-barcode",
  label: "Print Barcode Label",
  group: "export",
  icon: Printer,
  isVisible: () => true,
  handler: async (row) => {
    // Generate printable label with:
    // - Product name
    // - SKU barcode
    // - Price
    // - Expiry date (if applicable)
  },
}
```

---

## Phase 4: Advanced Features

**Timeline:** After Phase 3 complete (or as needed)

### 4.1 Forecast Demand Action

**Priority:** LOW  
**Complexity:** HIGH  
**Value:** MEDIUM

Requires ML/analytics infrastructure.

---

### 4.2 Optimize Pricing Action

**Priority:** LOW  
**Complexity:** HIGH  
**Value:** LOW

Requires pricing algorithm and market data.

---

### 4.3 Batch Operations

**Priority:** MEDIUM  
**Complexity:** HIGH  
**Value:** HIGH

Apply actions to multiple selected rows at once.

---

## Testing Strategy

### Unit Tests

- Action visibility rules
- Action handlers (mocked)
- Action filtering logic
- Hook behavior

### Integration Tests

- Context menu rendering
- Action execution flow
- Dialog interactions
- Data mutations

### E2E Tests (Optional)

- Full user workflows
- Multi-step actions
- Error handling

---

## Success Metrics

**Phase 0 (Refactoring):**

- [ ] All existing tests pass
- [ ] No visual regressions
- [ ] Adding new action takes < 10 lines of code
- [ ] Action system is documented

**Phase 1 (Quick Wins):**

- [ ] 3 new actions implemented
- [ ] User feedback collected
- [ ] Performance benchmarks met (< 100ms menu open)

**Phase 2 (Compliance):**

- [ ] Compliance requirements met
- [ ] Audit trail complete
- [ ] Pharmacy staff trained

**Phase 3+ (Advanced):**

- [ ] Feature adoption tracked
- [ ] ROI measured
- [ ] Continuous improvement based on usage data

---

## Notes

- **Keyboard Shortcuts:** Consider global shortcuts (Phase 0.7) after refactoring
- **Confirmation Dialogs:** Use shadcn/ui AlertDialog component
- **Icons:** Use lucide-react for consistency
- **Accessibility:** Ensure all actions are keyboard accessible
- **Performance:** Lazy load heavy components (PDF generation, charts)
- **Error Handling:** Add toast notifications for action failures
- **Undo/Redo:** Consider adding undo for destructive actions

---

## Related Files

- `apps/web/src/features/modules/inventory/InventoryWorkspace.tsx` - Main component
- `apps/web/src/features/modules/inventory/schema.ts` - Data types
- `apps/web/src/__tests__/inventory-context-menu.test.tsx` - Tests
