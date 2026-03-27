# Purchase Management Workspace - Completion PRD

⚠️ **Development Document. Source of truth: GitHub issue (to be created)**

## Quick Links

- **GitHub Issue**: (pending creation)
- **Milestone**: v2.0
- **Module**: `module:purchase`
- **Labels**: `type:epic`, `priority:high`, `layer:full-stack`
- **Related**: Purchase Management UI Mockup (apps/web/src/mockups/pharmacy-purchase/PurchaseManagement.tsx)

---

## 🎯 Overview

Complete the Purchase Management Workspace by implementing state management, API integration, and interactive functionality for the existing comprehensive UI (5,338 lines, 95% UI complete).

**Current State**:

- ✅ Complete Windows 11 Fluent Design UI (100%)
- ✅ All modals, forms, and layouts implemented
- ✅ Comprehensive mock data and type definitions
- ✅ Three-panel layout (Supplier Nav | Order List | Detail Panel)
- ❌ No state management or API integration
- ❌ No form validation or error handling
- ❌ No real-time calculations or updates

**Target State**:

- Fully functional purchase order management system
- Real-time inventory impact calculations
- Automated payment tracking and reconciliation
- Supplier performance analytics
- Complete CRUD operations with optimistic updates

**Business Value**:

- Streamline purchase order workflow (reduce order creation time by 60%)
- Improve inventory accuracy through automated receiving
- Reduce payment errors through structured tracking
- Enable data-driven supplier negotiations
- Support regulatory compliance (audit trails, batch tracking)

**Design Philosophy**:

- Maintain existing Windows 11 Fluent Design aesthetics
- Progressive enhancement (basic functionality first, advanced features later)
- Optimistic UI updates with rollback on error
- Mobile-responsive for tablet receiving workflows

---

## 🎭 User Stories

### Core Purchase Order Management (Stories 1-10)

1. As a purchasing clerk, I want to create purchase orders with real-time inventory preview, so that I order appropriate quantities
2. As a purchasing clerk, I want to save draft orders and resume editing later, so that I don't lose work if interrupted
3. As a pharmacy manager, I want to submit orders for approval with one click, so that orders are processed quickly
4. As a purchasing clerk, I want to duplicate previous orders with updated quantities, so that I can quickly reorder common items
5. As a receiving clerk, I want to mark orders as received and automatically update inventory, so that stock levels are accurate
6. As a receiving clerk, I want to report quantity discrepancies during receiving, so that supplier issues are documented
7. As an accountant, I want to record payments with multiple methods, so that I track cash flow accurately
8. As an accountant, I want to record partial payments, so that I know outstanding balances
9. As a pharmacy manager, I want to cancel orders with documented reasons, so that I maintain audit trails
10. As a purchasing clerk, I want to search orders by PO number, supplier, or product, so that I find orders quickly

### Supplier Management (Stories 11-15)

11. As a purchasing clerk, I want to see supplier-specific pricing auto-fill when creating orders, so that I don't enter prices manually
12. As a pharmacy manager, I want to track supplier performance (on-time delivery, quality), so that I make informed supplier decisions
13. As a purchasing clerk, I want to see recent order history per supplier, so that I reference past purchases
14. As a pharmacy manager, I want to filter orders by supplier, so that I review supplier-specific activity
15. As a purchasing clerk, I want to see supplier contact info inline, so that I can quickly resolve order issues

### Inventory Integration (Stories 16-20)

16. As a receiving clerk, I want inventory to update automatically when I receive orders, so that stock levels are real-time
17. As a purchasing clerk, I want to see current stock + pending orders when creating orders, so that I avoid over-ordering
18. As a pharmacy manager, I want to see projected stock after order placement, so that I verify order quantities
19. As a receiving clerk, I want to track batch numbers and expiry dates during receiving, so that I maintain regulatory compliance
20. As a pharmacy manager, I want to see which items have pending orders from multiple suppliers, so that I avoid duplicate orders

### Financial Tracking (Stories 21-25)

21. As an accountant, I want to see total payables by supplier, so that I prioritize payments
22. As an accountant, I want to reconcile invoices against purchase orders, so that I catch billing discrepancies
23. As a pharmacy owner, I want to see payment history per supplier, so that I verify payment terms compliance
24. As an accountant, I want to track payment methods (Bank Transfer, Cash, Check, Credit Card), so that I reconcile accounts
25. As a pharmacy manager, I want to see overdue payments highlighted, so that I maintain supplier relationships

### Analytics & Reporting (Stories 26-30)

26. As a pharmacy owner, I want to see monthly purchase trends, so that I optimize inventory investment
27. As a pharmacy manager, I want to identify price increases from suppliers, so that I negotiate or switch suppliers
28. As a purchasing clerk, I want to see purchase order cycle time (order → receive → pay), so that I improve efficiency
29. As a pharmacy manager, I want to export purchase data to Excel, so that I create custom reports
30. As a pharmacy owner, I want to see category breakdown of purchases, so that I understand spending patterns

### Advanced Features (Stories 31-35)

31. As a purchasing clerk, I want to filter orders by status, date range, and amount, so that I find specific orders
32. As a pharmacy manager, I want to sort orders by any column, so that I analyze data flexibly
33. As a receiving clerk, I want keyboard shortcuts for common actions, so that I work faster
34. As a pharmacy manager, I want to bulk approve multiple draft orders, so that I process orders efficiently
35. As an accountant, I want to print purchase orders and invoices, so that I maintain paper records

---

## 📐 Architecture Overview

### System Context

```
┌─────────────────────────────────────────────────────────────┐
│           Purchase Management Workspace (UI)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Supplier   │  │  Order List  │  │    Order     │     │
│  │  Navigator   │  │   (Master)   │  │   Details    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    State Management Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Purchase   │  │   Supplier   │  │  Inventory   │     │
│  │    Store     │  │    Store     │  │    Store     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (React Query)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Purchase   │  │   Supplier   │  │  Inventory   │     │
│  │     API      │  │     API      │  │     API      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Purchase   │  │   Supplier   │  │  Inventory   │     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   purchase   │  │   supplier   │  │  inventory   │     │
│  │   _orders    │  │   _products  │  │    _items    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Layers Involved

**UI/Component** (apps/web/src/features/purchase-management/):

- Refactor existing mockup into production components
- Extract modals into separate files
- Create custom hooks for business logic
- Implement form validation with react-hook-form
- Add error boundaries and loading states

**State Management** (Zustand or React Query):

- Purchase order store (CRUD operations, filtering, sorting)
- Supplier store (catalog, pricing, performance)
- UI state (selected order, modal visibility, filters)
- Optimistic updates with rollback

**API Layer** (React Query hooks):

- usePurchaseOrders (list, create, update, delete)
- useSuppliers (list, products, pricing)
- useInventory (stock levels, pending orders)
- usePayments (record, history)
- Automatic refetching and cache invalidation

**Backend Services** (apps/api/src/routes/purchase/):

- Purchase order CRUD endpoints
- Receiving workflow (update inventory)
- Payment recording
- Analytics aggregation
- Supplier product catalog

**Database Schema** (packages/schema/src/purchase/):

- purchase_orders table
- purchase_order_items table
- supplier_products table (pricing)
- purchase_payments table
- purchase_order_history table (audit trail)

### Key Design Decisions

#### Decision 1: State Management - Zustand vs React Query

**Approach**: Use React Query for server state, Zustand for UI state only

**Confidence Level**: 90%

**Key Assumptions**:

- React Query handles all API data (orders, suppliers, inventory)
- Zustand manages UI state (selected order, modal visibility, filters)
- React Query provides automatic caching, refetching, and optimistic updates
- Zustand provides simple, non-boilerplate state management for UI

**Would Change If**: Complex client-side calculations needed → add Zustand for derived state

**Implementation**:

```typescript
// React Query for server state
const { data: orders, isLoading } = usePurchaseOrders({
  status: "pending",
  supplierId: selectedSupplier,
});

// Zustand for UI state
const usePurchaseUI = create((set) => ({
  selectedOrderId: null,
  isReceivingModalOpen: false,
  filters: { status: "all", dateRange: null },
  setSelectedOrder: (id) => set({ selectedOrderId: id }),
  openReceivingModal: () => set({ isReceivingModalOpen: true }),
}));
```

#### Decision 2: Form Validation - react-hook-form + zod

**Approach**: Use react-hook-form for form state, zod for schema validation

**Confidence Level**: 95%

**Key Assumptions**:

- Zod schemas already defined for types (reuse for validation)
- react-hook-form provides excellent performance and DX
- Validation runs on blur and submit
- Error messages display inline below fields

**Would Change If**: Complex multi-step forms needed → add form wizard library

**Implementation**:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const orderSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  expectedDelivery: z.date().min(new Date(), "Date must be in future"),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unitCost: z.number().min(0, "Cost must be positive"),
      }),
    )
    .min(1, "At least one item required"),
});

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(orderSchema),
});
```

#### Decision 3: Optimistic Updates Strategy

**Approach**: Optimistic UI updates with automatic rollback on error

**Confidence Level**: 85%

**Key Assumptions**:

- Most operations succeed (network is reliable)
- Users expect immediate feedback
- Rollback on error is acceptable UX
- Toast notifications inform users of success/failure

**Would Change If**: High error rate → use pessimistic updates with loading states

**Implementation**:

```typescript
const { mutate: createOrder } = useMutation({
  mutationFn: createPurchaseOrder,
  onMutate: async (newOrder) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["orders"] });

    // Snapshot previous value
    const previousOrders = queryClient.getQueryData(["orders"]);

    // Optimistically update
    queryClient.setQueryData(["orders"], (old) => [...old, newOrder]);

    return { previousOrders };
  },
  onError: (err, newOrder, context) => {
    // Rollback on error
    queryClient.setQueryData(["orders"], context.previousOrders);
    toast.error("Failed to create order");
  },
  onSuccess: () => {
    toast.success("Order created successfully");
  },
  onSettled: () => {
    // Refetch to ensure consistency
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  },
});
```

#### Decision 4: Inventory Update Mechanism

**Approach**: Transactional inventory updates during receiving with audit trail

**Confidence Level**: 90%

**Key Assumptions**:

- Receiving triggers immediate inventory increment
- Transaction ensures atomicity (order status + inventory update)
- Audit trail records who received, when, and any discrepancies
- Discrepancies create supplier notes for follow-up

**Would Change If**: Inventory managed in separate system → use event-driven integration

**Database Transaction**:

```sql
BEGIN;

-- Update order status
UPDATE purchase_orders
SET status = 'received', received_at = NOW(), received_by = $1
WHERE id = $2;

-- Update inventory for each line item
UPDATE inventory_items
SET quantity = quantity + $3,
    last_updated = NOW()
WHERE product_id = $4;

-- Create audit trail
INSERT INTO purchase_order_history (order_id, event_type, user_id, notes)
VALUES ($2, 'RECEIVED', $1, $5);

-- If discrepancy, create supplier note
INSERT INTO supplier_notes (supplier_id, order_id, note_type, content)
VALUES ($6, $2, 'DISCREPANCY', $7);

COMMIT;
```

#### Decision 5: Real-Time Calculations

**Approach**: Client-side calculations with server-side validation

**Confidence Level**: 85%

**Key Assumptions**:

- Tax rate is configurable (default 12%)
- Discount can be percentage or fixed amount
- Calculations run on every line item change
- Server validates totals before saving

**Would Change If**: Complex tax rules (multi-jurisdiction) → move to server-side

**Calculation Logic**:

```typescript
function calculateOrderTotals(
  items: LineItem[],
  taxRate: number,
  discount: number,
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.qty * item.unitCost,
    0,
  );
  const discountAmount = discount; // Assume fixed amount for now
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * taxRate;
  const total = taxableAmount + tax;

  return { subtotal, discount: discountAmount, tax, total };
}

// Real-time calculation hook
function useOrderCalculations(items: LineItem[]) {
  const TAX_RATE = 0.12;
  const [discount, setDiscount] = useState(0);

  const totals = useMemo(
    () => calculateOrderTotals(items, TAX_RATE, discount),
    [items, discount],
  );

  return { ...totals, setDiscount };
}
```

#### Decision 6: Filtering & Sorting Implementation

**Approach**: Client-side filtering/sorting with server-side pagination

**Confidence Level**: 80%

**Key Assumptions**:

- Most users view <100 orders at a time
- Client-side filtering is fast enough
- Server-side pagination for large datasets
- Filters persist in URL query params

**Would Change If**: Large datasets (>1000 orders) → move filtering to server

**Implementation**:

```typescript
function usePurchaseOrders(filters: OrderFilters) {
  const { data, isLoading } = useQuery({
    queryKey: ["orders", filters],
    queryFn: () => fetchOrders(filters),
    keepPreviousData: true, // Smooth pagination
  });

  // Client-side filtering
  const filteredOrders = useMemo(() => {
    if (!data) return [];

    return data.filter((order) => {
      if (filters.status !== "all" && order.status !== filters.status)
        return false;
      if (filters.supplierId && order.supplierId !== filters.supplierId)
        return false;
      if (filters.dateRange) {
        const orderDate = new Date(order.date);
        if (
          orderDate < filters.dateRange.start ||
          orderDate > filters.dateRange.end
        )
          return false;
      }
      return true;
    });
  }, [data, filters]);

  // Client-side sorting
  const sortedOrders = useMemo(() => {
    if (!filters.sortBy) return filteredOrders;

    return [...filteredOrders].sort((a, b) => {
      const aVal = a[filters.sortBy];
      const bVal = b[filters.sortBy];
      return filters.sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [filteredOrders, filters.sortBy, filters.sortDir]);

  return { orders: sortedOrders, isLoading };
}
```

#### Decision 7: Error Handling Strategy

**Approach**: Layered error handling with user-friendly messages

**Confidence Level**: 90%

**Key Assumptions**:

- Network errors are transient (show retry button)
- Validation errors show inline on fields
- Server errors show toast notifications
- Critical errors caught by error boundaries

**Would Change If**: Offline support needed → add service worker and queue

**Error Handling Layers**:

```typescript
// 1. Form validation errors (inline)
{errors.quantity && <span className="error">{errors.quantity.message}</span>}

// 2. API errors (toast)
onError: (error) => {
  if (error.response?.status === 400) {
    toast.error(error.response.data.message);
  } else if (error.response?.status === 500) {
    toast.error('Server error. Please try again.');
  } else {
    toast.error('Network error. Check your connection.');
  }
}

// 3. Error boundaries (fallback UI)
<ErrorBoundary fallback={<ErrorFallback />}>
  <PurchaseManagement />
</ErrorBoundary>
```

---

## ✅ Acceptance Criteria

### Phase 1: Core CRUD Operations

- [ ] Create purchase order with line items saves to database
- [ ] Draft orders can be saved and resumed later
- [ ] Submit order changes status from draft to pending
- [ ] Receive order updates inventory and order status
- [ ] Record payment updates payment status and balance
- [ ] Cancel order with reason creates audit trail
- [ ] Duplicate order creates new draft with same items
- [ ] Delete draft order removes from database

### Phase 2: Real-Time Calculations

- [ ] Line item changes recalculate subtotal immediately
- [ ] Tax calculates automatically based on subtotal
- [ ] Discount applies correctly (fixed amount)
- [ ] Total updates in real-time as items change
- [ ] Inventory preview shows current + pending + this order
- [ ] Projected stock calculates correctly
- [ ] Payment balance calculates from total - paid

### Phase 3: Filtering & Sorting

- [ ] Status tabs filter orders correctly
- [ ] Supplier filter shows only selected supplier's orders
- [ ] Date range picker filters by order date
- [ ] Search finds orders by PO number, supplier, or product
- [ ] Column sorting works for all sortable columns
- [ ] Sort direction toggles on repeated clicks
- [ ] Filters persist in URL query params

### Phase 4: Validation & Error Handling

- [ ] Required fields show validation errors
- [ ] Quantity must be positive integer
- [ ] Expected delivery must be future date
- [ ] At least one line item required
- [ ] Duplicate PO numbers prevented
- [ ] Network errors show retry button
- [ ] Server errors show user-friendly messages
- [ ] Form errors clear when corrected

### Phase 5: Optimistic Updates

- [ ] Create order shows immediately in list
- [ ] Update order reflects changes instantly
- [ ] Delete order removes from list immediately
- [ ] Rollback on error restores previous state
- [ ] Success toast shows after server confirms
- [ ] Error toast shows if operation fails
- [ ] Loading states show during operations

### Phase 6: Modals & Interactions

- [ ] Receiving modal opens with order details
- [ ] Quantity adjustment updates received quantity
- [ ] Discrepancy detection shows warning banner
- [ ] Confirm receipt closes modal and updates order
- [ ] Payment modal opens with outstanding balance
- [ ] Payment amount defaults to full balance
- [ ] Payment method selector works
- [ ] Record payment closes modal and updates order

### Phase 7: Analytics & Reporting

- [ ] Monthly spend chart displays correctly
- [ ] Category breakdown shows accurate percentages
- [ ] Supplier volume chart ranks correctly
- [ ] Quick stats cards calculate totals
- [ ] Export to Excel downloads CSV file
- [ ] Print order generates printable view

---

## 🗺️ Implementation Phases

### Phase 0: Foundation & Refactoring (Week 1)

- [ ] #TBD - Extract mockup into production component structure
- [ ] #TBD - Create database schema (purchase_orders, purchase_order_items, etc.)
- [ ] #TBD - Set up API routes (GET, POST, PUT, DELETE)
- [ ] #TBD - Create React Query hooks (usePurchaseOrders, useSuppliers)
- [ ] #TBD - Set up Zustand store for UI state
- [ ] #TBD - Add error boundaries and loading states

### Phase 1: Core CRUD Operations (Week 2)

- [ ] #TBD - Implement create order with form validation
- [ ] #TBD - Implement save draft functionality
- [ ] #TBD - Implement submit order (draft → pending)
- [ ] #TBD - Implement update order (edit draft)
- [ ] #TBD - Implement delete order (drafts only)
- [ ] #TBD - Implement duplicate order
- [ ] #TBD - Add optimistic updates with rollback

### Phase 2: Receiving & Inventory (Week 3)

- [ ] #TBD - Implement receiving modal logic
- [ ] #TBD - Add quantity adjustment with validation
- [ ] #TBD - Implement discrepancy detection
- [ ] #TBD - Create inventory update transaction
- [ ] #TBD - Add batch number and expiry tracking
- [ ] #TBD - Create audit trail for receiving

### Phase 3: Payment Tracking (Week 4)

- [ ] #TBD - Implement payment modal logic
- [ ] #TBD - Add payment method selector
- [ ] #TBD - Implement record payment
- [ ] #TBD - Add partial payment support
- [ ] #TBD - Calculate outstanding balance
- [ ] #TBD - Display payment history

### Phase 4: Filtering & Sorting (Week 5)

- [ ] #TBD - Implement status tab filtering
- [ ] #TBD - Add supplier filter
- [ ] #TBD - Implement date range picker
- [ ] #TBD - Add search functionality
- [ ] #TBD - Implement column sorting
- [ ] #TBD - Persist filters in URL

### Phase 5: Analytics & Reporting (Week 6)

- [ ] #TBD - Implement monthly spend chart
- [ ] #TBD - Add category breakdown
- [ ] #TBD - Create supplier volume chart
- [ ] #TBD - Calculate quick stats
- [ ] #TBD - Implement export to Excel
- [ ] #TBD - Add print functionality

### Phase 6: Polish & Testing (Week 7-8)

- [ ] #TBD - Add keyboard shortcuts
- [ ] #TBD - Improve accessibility (ARIA labels, keyboard nav)
- [ ] #TBD - Add loading skeletons
- [ ] #TBD - Implement error retry logic
- [ ] #TBD - Write integration tests
- [ ] #TBD - Performance optimization
- [ ] #TBD - Mobile responsiveness

---

## 📊 Success Metrics

- Order creation time reduced from 5 minutes to 2 minutes (60% improvement)
- Inventory accuracy improved to 98%+ (from manual entry errors)
- Payment tracking errors reduced to <1%
- User satisfaction score >4.5/5
- Zero data loss incidents
- <2 second page load time
- <500ms for optimistic updates

---

## 🔗 Related Issues

- Purchase Management UI Mockup (apps/web/src/mockups/pharmacy-purchase/PurchaseManagement.tsx)
- Inventory Management System (dependency)
- Supplier Management Module (dependency)

---

## 📝 Notes

### Assumptions

- Inventory system exists and has API endpoints
- Supplier catalog is pre-populated
- Single currency (EGP) for MVP
- Tax rate is configurable but single-rate
- Payment terms are text fields (not enforced)
- No approval workflow for MVP (can add later)

### Constraints

- Must maintain Windows 11 Fluent Design aesthetics
- Must work on tablets for receiving workflow
- Must support offline draft creation (future)
- Must maintain audit trails for compliance
- Must handle concurrent edits gracefully

### Out of Scope (MVP)

- Multi-currency support
- Approval workflows (multi-level)
- Automated reordering based on stock levels
- Supplier portal integration
- Barcode scanning during receiving
- Return management (supplier returns)
- Contract management
- Quality control workflows
- Consignment inventory tracking
- Integration with accounting software (QuickBooks, Xero)

### Technical Debt to Address

- Large single file (5,338 lines) should be split into modules
- Mock data should move to separate file
- Consider code splitting for performance
- Add comprehensive error logging
- Implement proper TypeScript strict mode

### Future Enhancements (Post-MVP)

- Predictive reordering using ML
- Supplier performance scoring
- Price trend analysis
- Automated supplier comparison
- Mobile app for receiving
- Voice input for receiving
- Integration with supplier APIs
- Blockchain for supply chain tracking

---

**Estimated Timeline**: 8 weeks (2 months)
**Priority**: High
**Complexity**: Medium-High
**Risk Level**: Medium (UI complete, backend integration is main risk)
