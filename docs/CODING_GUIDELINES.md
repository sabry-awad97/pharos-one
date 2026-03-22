# Coding Guidelines

This document outlines the coding standards and best practices for the PharOS project.

## Table of Contents

- [TypeScript Conventions](#typescript-conventions)
- [Theme and Styling](#theme-and-styling)
- [Schema and Data Modeling](#schema-and-data-modeling)
- [Component Patterns](#component-patterns)
- [State Management](#state-management)
- [Testing Standards](#testing-standards)
- [Performance Best Practices](#performance-best-practices)
- [Accessibility Requirements](#accessibility-requirements)

---

## TypeScript Conventions

### Avoid `any` Type

**Rule**: Never use the `any` type. Always provide explicit types.

```typescript
// ❌ BAD
function processData(data: any) {
  return data.value;
}

// ✅ GOOD
interface DataInput {
  value: string;
}

function processData(data: DataInput) {
  return data.value;
}

// ✅ GOOD - Use unknown for truly unknown types
function processData(data: unknown) {
  if (typeof data === "object" && data !== null && "value" in data) {
    return (data as { value: string }).value;
  }
  throw new Error("Invalid data");
}
```

### Use `null` Instead of `undefined`

**Rule**: Always use `null` for nullable values, not `undefined`. Use `| null` instead of optional properties.

```typescript
// ❌ BAD - Using undefined and optional
interface User {
  name: string;
  email?: string;
  avatar?: string;
}

// ✅ GOOD - Using null and explicit nullable
interface User {
  name: string;
  email: string | null;
  avatar: string | null;
}

// ❌ BAD - Function returning undefined
function findUser(id: number): User | undefined {
  return users.find((u) => u.id === id);
}

// ✅ GOOD - Function returning null
function findUser(id: number): User | null {
  return users.find((u) => u.id === id) ?? null;
}
```

**Rationale**:

- `null` is explicit and intentional
- `undefined` often indicates missing/uninitialized values
- Consistent use of `null` makes code more predictable
- JSON serialization handles `null` better than `undefined`

### Type Inference

Leverage TypeScript's type inference where possible, but be explicit when it improves clarity.

```typescript
// ✅ GOOD - Inference is clear
const count = 5;
const items = ["a", "b", "c"];

// ✅ GOOD - Explicit when needed
const userId: number = getUserId();
const config: AppConfig = loadConfig();
```

---

## Theme and Styling

### Use OKLCH Color Variables

**Rule**: Always use OKLCH color variables with CSS custom properties. Never hardcode colors.

```typescript
// ❌ BAD - Hardcoded colors
<div style={{ background: '#0078d4' }}>

// ❌ BAD - RGB/HSL colors
<div style={{ background: 'rgb(0, 120, 212)' }}>

// ✅ GOOD - OKLCH with CSS variables
<div style={{ background: 'var(--primary)' }}>

// ✅ GOOD - OKLCH with opacity
<div style={{ background: 'oklch(from var(--primary) l c h / 0.1)' }}>
```

### Standard Opacity Values

Use these standard opacity values for consistency:

```typescript
// Hover states
background: "oklch(from var(--primary) l c h / 0.07)";

// Selected states
background: "oklch(from var(--primary) l c h / 0.05)";

// Focused states
background: "oklch(from var(--primary) l c h / 0.03)";

// Disabled states
opacity: "0.5";

// Borders with transparency
borderColor: "oklch(from var(--border) l c h / 0.8)";
```

### Tailwind CSS Classes

Prefer Tailwind utility classes over inline styles when possible:

```typescript
// ✅ GOOD - Tailwind classes
<div className="bg-primary/10 hover:bg-primary/20 transition-colors">

// ✅ GOOD - Tailwind with theme colors
<div className="text-foreground bg-card border border-border">

// ⚠️ ACCEPTABLE - Inline styles for dynamic values
<div style={{
  background: focused
    ? 'oklch(from var(--primary) l c h / 0.07)'
    : 'var(--card)'
}}>
```

### Theme Color Variables

Available CSS variables:

```css
/* Base colors */
--background
--foreground
--card
--card-foreground
--popover
--popover-foreground
--primary
--primary-foreground
--secondary
--secondary-foreground
--muted
--muted-foreground
--accent
--accent-foreground
--destructive
--destructive-foreground
--border
--input
--ring
```

---

## Schema and Data Modeling

### Use Zod for Schema Validation

**Rule**: Define all data schemas using Zod. Use `nullable()` instead of `optional()`.

```typescript
import { z } from "zod";

// ❌ BAD - Using optional
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().optional(),
  avatar: z.string().optional(),
});

// ✅ GOOD - Using nullable
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().nullable(),
  avatar: z.string().nullable(),
});

// ✅ GOOD - Infer TypeScript type from schema
type User = z.infer<typeof userSchema>;
// Result: { id: number; name: string; email: string | null; avatar: string | null }
```

### Database Schema Conventions

```typescript
// ✅ GOOD - Consistent nullable pattern
const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  sku: z.string(),
  description: z.string().nullable(), // Can be null
  categoryId: z.number(),
  supplierId: z.number().nullable(), // Optional foreign key
  deletedAt: z.string().nullable(), // Soft delete timestamp
});
```

### Default Values

Provide default values at the application layer, not in schemas:

```typescript
// ❌ BAD - Default in schema
const configSchema = z.object({
  pageSize: z.number().default(10),
});

// ✅ GOOD - Default in application code
const configSchema = z.object({
  pageSize: z.number().nullable(),
});

function getPageSize(config: Config): number {
  return config.pageSize ?? 10; // Default at usage site
}
```

---

## Component Patterns

### Component Architecture

**Rule**: Use the Provider pattern for complex components with shared state. Follow shadcn/ui composable patterns.

```typescript
// ✅ GOOD - Provider pattern for complex components
import { createContext, useContext } from "react";

interface AccordionContextValue {
  value: string | null;
  onValueChange: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordion must be used within AccordionProvider");
  }
  return context;
}

// Root component with provider
export function Accordion({
  value,
  onValueChange,
  children
}: AccordionProps) {
  return (
    <AccordionContext.Provider value={{ value, onValueChange }}>
      <div className="space-y-2">{children}</div>
    </AccordionContext.Provider>
  );
}

// Child components consume context
export function AccordionItem({ value, children }: AccordionItemProps) {
  const { value: activeValue, onValueChange } = useAccordion();
  const isOpen = activeValue === value;

  return (
    <div data-state={isOpen ? "open" : "closed"}>
      {children}
    </div>
  );
}

// Usage - Composable API
<Accordion value={openItem} onValueChange={setOpenItem}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Item 1</AccordionTrigger>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Item 2</AccordionTrigger>
    <AccordionContent>Content 2</AccordionContent>
  </AccordionItem>
</Accordion>
```

**When to use Provider pattern**:

- Component has multiple child components that need shared state
- Component has complex internal state management
- You want a composable, flexible API
- Examples: Accordion, Tabs, Dialog, Dropdown Menu

**When NOT to use Provider pattern**:

- Simple components with no shared state
- Single-purpose components
- Examples: Button, Badge, Avatar

### Class Variance Authority (CVA)

**Rule**: Use CVA for components with multiple variants. This improves maintainability and type safety.

```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@pharos-one/ui/lib/utils";

// ✅ GOOD - Define variants with CVA
const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Export variant props type
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// Component implementation
export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

// Usage - Type-safe variants
<Button variant="outline" size="sm">Click me</Button>
<Button variant="destructive" size="lg">Delete</Button>
```

**Benefits of CVA**:

- Type-safe variant props
- Centralized style management
- Easy to add new variants
- Automatic TypeScript inference
- Consistent API across components

### Windows Desktop App Design Principles

**Rule**: Design for desktop with compact layouts, efficient use of space, and native-like interactions.

#### Compact Spacing

```typescript
// ✅ GOOD - Compact spacing for desktop
<div className="p-3">              {/* 12px padding */}
  <div className="space-y-2">      {/* 8px gap */}
    <div className="h-8">          {/* 32px height */}
      <button className="h-7 px-2"> {/* 28px height, 8px padding */}
```

**Standard spacing scale for desktop**:

- Extra tight: `gap-1` (4px) - Between related icons
- Tight: `gap-2` (8px) - Between form elements
- Normal: `gap-3` (12px) - Between sections
- Loose: `gap-4` (16px) - Between major sections

#### Compact Component Sizes

```typescript
// ✅ GOOD - Desktop-optimized sizes
const compactButtonVariants = cva(
  "inline-flex items-center justify-center rounded transition-colors",
  {
    variants: {
      size: {
        xs: "h-6 px-2 text-[10px]", // 24px - Toolbar buttons
        sm: "h-7 px-2 text-[11px]", // 28px - Secondary actions
        default: "h-8 px-3 text-xs", // 32px - Primary actions
        lg: "h-9 px-4 text-sm", // 36px - Emphasized actions
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

// ❌ BAD - Mobile-first sizes (too large for desktop)
const mobileButtonVariants = cva("...", {
  variants: {
    size: {
      default: "h-10 px-4", // 40px - Too large for desktop
      lg: "h-12 px-6", // 48px - Way too large
    },
  },
});
```

#### Font Sizes for Desktop

```typescript
// ✅ GOOD - Compact font hierarchy
text-[10px]  // 10px - Labels, captions, metadata
text-[11px]  // 11px - Secondary text, table cells
text-xs      // 12px - Body text, form inputs
text-sm      // 14px - Emphasized text, headings
text-base    // 16px - Large headings only

// ❌ BAD - Mobile-first (too large)
text-base    // 16px - Don't use for body text
text-lg      // 18px - Too large for desktop
```

#### Dense Tables

```typescript
// ✅ GOOD - Compact table for desktop
<table className="w-full border-collapse">
  <thead>
    <tr className="border-b border-border">
      <th className="py-[7px] px-3 text-[10px] font-semibold uppercase">
        Product
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-border">
      <td className="py-1.5 px-3 text-xs">
        Amoxicillin 500mg
      </td>
    </tr>
  </tbody>
</table>

// Spacing breakdown:
// - Header padding: 7px vertical (14px total)
// - Cell padding: 6px vertical (12px total)
// - Horizontal padding: 12px
// - Font sizes: 10px headers, 12px cells
```

#### Toolbar and Header Heights

```typescript
// ✅ GOOD - Standard heights for desktop
const DESKTOP_HEIGHTS = {
  titleBar: "h-8",        // 32px - Window title bar
  menuBar: "h-7",         // 28px - Menu bar
  toolbar: "h-9",         // 36px - Toolbar with buttons
  statusBar: "h-6",       // 24px - Status bar at bottom
  tabBar: "h-8",          // 32px - Tab navigation
  tableHeader: "h-9",     // 36px - Table header row
};

// Example toolbar
<div className="h-9 px-3 flex items-center gap-2 border-b border-border">
  <Button size="sm" variant="ghost">
    <Save className="w-3.5 h-3.5" />
  </Button>
  <Button size="sm" variant="ghost">
    <Undo className="w-3.5 h-3.5" />
  </Button>
</div>
```

#### Icon Sizes

```typescript
// ✅ GOOD - Compact icon sizes
<Icon className="w-3 h-3" />      // 12px - Inline with text
<Icon className="w-3.5 h-3.5" />  // 14px - Small buttons
<Icon className="w-4 h-4" />      // 16px - Default buttons
<Icon className="w-5 h-5" />      // 20px - Large buttons
<Icon className="w-6 h-6" />      // 24px - Headers only

// ❌ BAD - Too large for desktop
<Icon className="w-8 h-8" />      // 32px - Too large
```

#### Windows-Style Interactions

```typescript
// ✅ GOOD - Subtle hover states (Windows style)
<button className="hover:bg-accent/50 transition-colors duration-150">

// ✅ GOOD - Focus indicators (Windows style)
<button className="focus-visible:ring-1 focus-visible:ring-primary">

// ✅ GOOD - Selection states (Windows style)
<tr
  className="hover:bg-primary/3"
  data-selected={selected}
  style={{
    background: selected
      ? 'oklch(from var(--primary) l c h / 0.05)'
      : 'transparent'
  }}
>

// ❌ BAD - Too prominent (mobile style)
<button className="hover:bg-primary/20">  // Too strong
<button className="focus-visible:ring-4"> // Too thick
```

#### Responsive Breakpoints (Desktop-First)

```typescript
// ✅ GOOD - Desktop-first approach
<div className="grid grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
  {/* 4 columns on large desktop, 3 on desktop, 2 on tablet */}
</div>

// Breakpoints:
// - Default: Large desktop (1920px+)
// - lg: Desktop (1280px+)
// - md: Small desktop / Tablet (768px+)
// - sm: Mobile (640px+) - fallback only
```

### Component Structure

Follow this order for component code:

```typescript
// 1. Imports
import { useState, useCallback } from "react";
import { Button } from "@pharos-one/ui/components/button";

// 2. Types/Interfaces
interface ProductCardProps {
  product: Product;
  onSelect: (id: number) => void;
}

// 3. Constants
const DEFAULT_PAGE_SIZE = 10;

// 4. Helper functions (outside component)
function formatPrice(price: number): string {
  return `₹${price.toFixed(2)}`;
}

// 5. Component
export function ProductCard({ product, onSelect }: ProductCardProps) {
  // 5a. Hooks
  const [isExpanded, setIsExpanded] = useState(false);

  // 5b. Callbacks
  const handleClick = useCallback(() => {
    onSelect(product.id);
  }, [product.id, onSelect]);

  // 5c. Render
  return (
    <div className="p-4 border border-border rounded-lg">
      {/* Component JSX */}
    </div>
  );
}
```

### Props Destructuring

Always destructure props in the function signature:

```typescript
// ❌ BAD
function Button(props: ButtonProps) {
  return <button onClick={props.onClick}>{props.children}</button>;
}

// ✅ GOOD
function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

### Complete Component Example

Here's a complete example combining all patterns:

```typescript
// components/data-table-pagination.tsx
import { createContext, useContext } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@pharos-one/ui/lib/utils";
import type { Table } from "@tanstack/react-table";

// 1. CVA Variants
const paginationVariants = cva(
  "inline-flex items-center justify-center rounded transition-colors focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-accent/50",
        outline: "border border-input hover:bg-accent/50",
        ghost: "hover:bg-accent/50",
      },
      size: {
        sm: "h-7 w-7 text-[11px]",
        default: "h-8 w-8 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// 2. Context for Provider Pattern
interface PaginationContextValue {
  table: Table<unknown>;
}

const PaginationContext = createContext<PaginationContextValue | null>(null);

function usePagination() {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error("Pagination components must be used within DataTablePagination");
  }
  return context;
}

// 3. Root Component with Provider
interface DataTablePaginationProps {
  table: Table<unknown>;
  children: React.ReactNode;
}

export function DataTablePagination({
  table,
  children
}: DataTablePaginationProps) {
  return (
    <PaginationContext.Provider value={{ table }}>
      <div className="flex items-center justify-between px-3 py-3 border-t border-border">
        {children}
      </div>
    </PaginationContext.Provider>
  );
}

// 4. Child Components
interface PaginationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof paginationVariants> {}

export function PaginationPrevious({
  className,
  variant,
  size,
  ...props
}: PaginationButtonProps) {
  const { table } = usePagination();

  return (
    <button
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
      className={cn(paginationVariants({ variant, size, className }))}
      aria-label="Go to previous page"
      {...props}
    >
      <ChevronLeft className="w-3.5 h-3.5" />
    </button>
  );
}

export function PaginationNext({
  className,
  variant,
  size,
  ...props
}: PaginationButtonProps) {
  const { table } = usePagination();

  return (
    <button
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
      className={cn(paginationVariants({ variant, size, className }))}
      aria-label="Go to next page"
      {...props}
    >
      <ChevronRight className="w-3.5 h-3.5" />
    </button>
  );
}

export function PaginationInfo() {
  const { table } = usePagination();
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = table.getFilteredRowModel().rows.length;

  if (totalItems === 0) return <span className="text-xs text-muted-foreground">No items</span>;

  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalItems);

  return (
    <span className="text-xs text-muted-foreground">
      Showing {start}–{end} of {totalItems}
    </span>
  );
}

// 5. Usage - Composable, type-safe, compact
<DataTablePagination table={table}>
  <div className="flex items-center gap-2">
    <PaginationPrevious size="sm" />
    <PaginationNext size="sm" />
  </div>
  <PaginationInfo />
</DataTablePagination>
```

**Why this pattern works**:

- ✅ Provider pattern for shared state (table instance)
- ✅ CVA for type-safe, maintainable variants
- ✅ Composable API (mix and match components)
- ✅ Compact desktop design (small sizes, tight spacing)
- ✅ Theme-consistent (uses CSS variables)
- ✅ Accessible (ARIA labels, keyboard support)
- ✅ Type-safe (TypeScript + CVA inference)

### Event Handlers

Use descriptive handler names with `handle` prefix:

```typescript
// ✅ GOOD
const handleClick = () => {
  /* ... */
};
const handleSubmit = () => {
  /* ... */
};
const handlePageChange = (page: number) => {
  /* ... */
};

// ❌ BAD
const onClick = () => {
  /* ... */
};
const submit = () => {
  /* ... */
};
const pageChange = (page: number) => {
  /* ... */
};
```

---

## State Management

### useState Initialization

Be explicit about initial state types:

```typescript
// ✅ GOOD - Type is inferred correctly
const [count, setCount] = useState(0);
const [name, setName] = useState("");

// ✅ GOOD - Explicit type for nullable state
const [user, setUser] = useState<User | null>(null);

// ✅ GOOD - Lazy initialization for expensive operations
const [data, setData] = useState<Data>(() => {
  return expensiveComputation();
});
```

### State Updates

Use functional updates when new state depends on previous state:

```typescript
// ❌ BAD
setCount(count + 1);

// ✅ GOOD
setCount((prev) => prev + 1);

// ✅ GOOD - Complex state updates
setUser((prev) => ({
  ...prev,
  name: newName,
}));
```

### TanStack Table State

Follow TanStack Table patterns for table state:

```typescript
const [sorting, setSorting] = useState<SortingState>([]);
const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 10,
});

const table = useReactTable({
  data,
  columns,
  state: {
    sorting,
    pagination,
  },
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});
```

---

## Testing Standards

### Test File Naming

```
src/components/Button.tsx
src/__tests__/button.test.tsx

src/features/inventory/InventoryWorkspace.tsx
src/features/inventory/__tests__/inventory-workspace.test.tsx
```

### Test Structure

```typescript
describe("ComponentName", () => {
  it("renders with default props", () => {
    // Arrange
    const props = { /* ... */ };

    // Act
    render(<Component {...props} />);

    // Assert
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("handles user interaction", async () => {
    const handleClick = vi.fn();
    render(<Component onClick={handleClick} />);

    await userEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Test Behavior, Not Implementation

```typescript
// ❌ BAD - Testing implementation details
it("calls useState with initial value", () => {
  const spy = vi.spyOn(React, 'useState');
  render(<Component />);
  expect(spy).toHaveBeenCalledWith(0);
});

// ✅ GOOD - Testing observable behavior
it("displays initial count of 0", () => {
  render(<Component />);
  expect(screen.getByText("Count: 0")).toBeInTheDocument();
});
```

---

## Performance Best Practices

### Memoization

Use `useMemo` and `useCallback` appropriately:

```typescript
// ✅ GOOD - Memoize expensive calculations
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.name.localeCompare(b.name));
}, [data]);

// ✅ GOOD - Memoize callbacks passed to child components
const handleClick = useCallback(
  (id: number) => {
    onSelect(id);
  },
  [onSelect],
);

// ❌ BAD - Unnecessary memoization
const sum = useMemo(() => a + b, [a, b]); // Too simple
```

### Component Memoization

Use `React.memo()` for expensive components:

```typescript
// ✅ GOOD - Memoize expensive list items
export const ProductCard = React.memo(function ProductCard({
  product,
  onSelect
}: ProductCardProps) {
  return <div>{/* ... */}</div>;
});

// ✅ GOOD - Custom comparison function
export const ProductCard = React.memo(
  function ProductCard(props) {
    return <div>{/* ... */}</div>;
  },
  (prevProps, nextProps) => {
    return prevProps.product.id === nextProps.product.id;
  }
);
```

### Avoid Inline Functions in JSX

```typescript
// ❌ BAD - Creates new function on every render
<button onClick={() => handleClick(id)}>

// ✅ GOOD - Use useCallback
const handleButtonClick = useCallback(() => {
  handleClick(id);
}, [id, handleClick]);

<button onClick={handleButtonClick}>
```

---

## Accessibility Requirements

### ARIA Labels

Always provide ARIA labels for interactive elements:

```typescript
// ✅ GOOD
<button aria-label="Close dialog" onClick={onClose}>
  <X className="w-4 h-4" />
</button>

<nav aria-label="Pagination navigation">
  {/* pagination controls */}
</nav>
```

### Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```typescript
// ✅ GOOD - Keyboard support
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
```

### Focus Management

```typescript
// ✅ GOOD - Visible focus indicators
<button className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">

// ✅ GOOD - Focus management after actions
useEffect(() => {
  if (isOpen) {
    dialogRef.current?.focus();
  }
}, [isOpen]);
```

### Screen Reader Support

```typescript
// ✅ GOOD - ARIA live regions for dynamic content
<div role="status" aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// ✅ GOOD - Hidden text for screen readers
<span className="sr-only">Loading...</span>
```

---

## File Organization

```
src/
├── components/          # Shared UI components
├── features/           # Feature modules
│   └── inventory/
│       ├── components/ # Feature-specific components
│       ├── hooks/      # Feature-specific hooks
│       ├── services/   # API/data services
│       ├── schema.ts   # Zod schemas
│       └── index.ts    # Public exports
├── lib/               # Utility functions
├── hooks/             # Shared hooks
└── __tests__/         # Test files
```

---

## Import Order

```typescript
// 1. React and external libraries
import { useState, useCallback } from "react";
import { z } from "zod";

// 2. Internal packages
import { Button } from "@pharos-one/ui/components/button";
import { cn } from "@pharos-one/ui/lib/utils";

// 3. Relative imports - types first
import type { Product } from "./schema";
import { useProducts } from "./hooks/use-products";
import { ProductCard } from "./components/ProductCard";

// 4. Styles (if any)
import "./styles.css";
```

---

## Naming Conventions

### Files

- Components: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- Hooks: `kebab-case.ts` (e.g., `use-products.ts`)
- Utils: `kebab-case.ts` (e.g., `format-date.ts`)
- Tests: `kebab-case.test.tsx` (e.g., `product-card.test.tsx`)

### Variables

- Constants: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_PAGE_SIZE`)
- Variables: `camelCase` (e.g., `pageSize`, `isLoading`)
- Components: `PascalCase` (e.g., `ProductCard`)
- Types/Interfaces: `PascalCase` (e.g., `ProductCardProps`)

---

## Common Patterns

### Loading States

```typescript
if (isLoading) {
  return <LoadingSkeleton />;
}

if (error) {
  return <ErrorMessage error={error} />;
}

return <Content data={data} />;
```

### Empty States

```typescript
if (items.length === 0) {
  return (
    <EmptyState
      title="No items found"
      description="Try adjusting your filters"
      action={<Button onClick={clearFilters}>Clear filters</Button>}
    />
  );
}
```

### Conditional Rendering

```typescript
// ✅ GOOD - Use && for simple conditions
{isVisible && <Component />}

// ✅ GOOD - Use ternary for if/else
{isLoading ? <Spinner /> : <Content />}

// ✅ GOOD - Use early returns for complex conditions
if (!user) return null;
if (!hasPermission) return <AccessDenied />;
return <Dashboard />;
```

---

## Questions?

If you're unsure about a pattern or convention, check existing code in the codebase for examples, or ask the team for clarification.

---

## Quick Reference

### Desktop Design Checklist

When creating a new component, ensure:

- [ ] Uses Provider pattern if complex (multiple child components with shared state)
- [ ] Uses CVA for variants (if component has multiple styles)
- [ ] Follows compact spacing (p-3, gap-2, h-8)
- [ ] Uses small font sizes (text-[10px], text-[11px], text-xs)
- [ ] Icons are appropriately sized (w-3.5 h-3.5 for buttons)
- [ ] Hover states are subtle (hover:bg-accent/50)
- [ ] Focus rings are thin (ring-1, not ring-2 or ring-4)
- [ ] Uses OKLCH color variables (oklch(from var(--primary) l c h / 0.07))
- [ ] No `any` types used
- [ ] Uses `null` instead of `undefined` for nullable values
- [ ] Includes ARIA labels for accessibility
- [ ] Has keyboard navigation support
- [ ] Follows naming conventions (PascalCase for components, camelCase for functions)

### Standard Component Template

```typescript
// 1. Imports
import { createContext, useContext } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@pharos-one/ui/lib/utils";

// 2. CVA Variants (if needed)
const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        secondary: "secondary-classes",
      },
      size: {
        sm: "h-7 px-2 text-[11px]",
        default: "h-8 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// 3. Context (if complex component)
interface ComponentContextValue {
  // shared state
}

const ComponentContext = createContext<ComponentContextValue | null>(null);

function useComponent() {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error("useComponent must be used within ComponentProvider");
  }
  return context;
}

// 4. Types
interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // additional props
}

// 5. Component
export function Component({
  variant,
  size,
  className,
  ...props
}: ComponentProps) {
  return (
    <div
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

### Common Patterns Quick Reference

```typescript
// Nullable types
type User = {
  name: string;
  email: string | null;  // ✅ Use null
  avatar: string | null; // ✅ Not undefined
};

// OKLCH colors
background: 'oklch(from var(--primary) l c h / 0.07)'  // Hover
background: 'oklch(from var(--primary) l c h / 0.05)'  // Selected
background: 'oklch(from var(--primary) l c h / 0.03)'  // Focused

// Desktop spacing
<div className="p-3 gap-2">        // Compact padding and gap
<button className="h-8 px-3">      // Compact button
<input className="h-8 text-xs">    // Compact input

// Desktop fonts
className="text-[10px]"  // Labels, metadata
className="text-[11px]"  // Secondary text
className="text-xs"      // Body text (12px)
className="text-sm"      // Headings (14px)

// Desktop icons
<Icon className="w-3.5 h-3.5" />  // Buttons
<Icon className="w-4 h-4" />      // Default
<Icon className="w-5 h-5" />      // Large

// Memoization
const value = useMemo(() => expensive(), [deps]);
const callback = useCallback(() => {}, [deps]);
const Component = React.memo(ComponentImpl);

// Zod schemas
const schema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().nullable(),  // ✅ Use nullable
});
```
