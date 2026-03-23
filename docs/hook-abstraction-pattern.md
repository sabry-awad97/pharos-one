# Hook Abstraction Pattern Guide

## Overview

The hook abstraction pattern wraps TanStack DB's `useLiveQuery` to maintain backward compatibility with TanStack Query's API. This enables gradual migration without breaking existing components.

**Key Insight**: Components don't need to know whether data comes from TanStack Query or TanStack DB.

## Table of Contents

- [Why Wrap useLiveQuery?](#why-wrap-uselivequery)
- [How the Wrapper Works](#how-the-wrapper-works)
- [API Compatibility](#api-compatibility)
- [Adding New Features to Hooks](#adding-new-features-to-hooks)
- [Testing Hook Abstractions](#testing-hook-abstractions)
- [When to Remove the Wrapper](#when-to-remove-the-wrapper)

## Why Wrap useLiveQuery?

### The Problem

TanStack Query and TanStack DB return different result shapes:

```typescript
// TanStack Query result
const queryResult = useQuery({ ... });
// Returns: { data, isLoading, error, isError, isSuccess, status }

// TanStack DB result
const liveResult = useLiveQuery((q) => ...);
// Returns: { data, isLoading, isError, error? }
// Missing: isSuccess, status
```

Components expect the TanStack Query shape. Changing the API would break all components.

### The Solution

Wrap `useLiveQuery` results to match TanStack Query's API:

```typescript
import { wrapLiveQuery } from "./utils/hook-wrapper";

export function useCategories() {
  const { categories } = useCollections();

  const liveResult = useLiveQuery(
    (q) => q.from({ category: categories }),
    [categories],
  );

  return wrapLiveQuery(liveResult); // ← Transforms to TanStack Query shape
}

// Components work unchanged ✓
const { data, isLoading, error, isSuccess, status } = useCategories();
```

## How the Wrapper Works

### Implementation

```typescript
// File: hooks/utils/hook-wrapper.ts

/**
 * Standard query result shape (TanStack Query compatible)
 */
export interface QueryResult<TData> {
  data: TData | undefined;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
  status: "pending" | "error" | "success";
}

/**
 * Wrap a TanStack DB useLiveQuery result to match TanStack Query API
 */
export function wrapLiveQuery<TData>(
  liveQueryResult: LiveQueryResult<TData>,
): QueryResult<TData> {
  const hasData = liveQueryResult.data !== undefined;
  const hasError = liveQueryResult.isError && liveQueryResult.error !== null;
  const isLoading = liveQueryResult.isLoading;

  // Determine status based on state
  let status: "pending" | "error" | "success";
  if (isLoading) {
    status = "pending";
  } else if (hasError) {
    status = "error";
  } else {
    status = "success";
  }

  return {
    data: liveQueryResult.data,
    isLoading,
    error: liveQueryResult.error ?? null, // Ensure null instead of undefined
    isError: hasError,
    isSuccess: status === "success",
    status,
  };
}
```

### Transformation Logic

The wrapper adds missing properties:

1. **isSuccess**: Derived from `!isLoading && !isError`
2. **status**: Derived from loading/error state
3. **error**: Ensures `null` instead of `undefined` (project convention)

### Why This Works

- ✅ **Minimal overhead**: Simple property mapping
- ✅ **No data transformation**: Direct pass-through of data
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Easy to understand**: Clear transformation logic
- ✅ **Easy to remove**: Can be removed later if desired

## API Compatibility

### TanStack Query API (Before)

```typescript
const {
  data,           // TData | undefined
  isLoading,      // boolean
  error,          // Error | null
  isError,        // boolean
  isSuccess,      // boolean
  status,         // "pending" | "error" | "success"
} = useQuery({ ... });
```

### TanStack DB API (After Wrapping)

```typescript
const {
  data, // TData | undefined - ✓ Same
  isLoading, // boolean - ✓ Same
  error, // Error | null - ✓ Same
  isError, // boolean - ✓ Same
  isSuccess, // boolean - ✓ Added by wrapper
  status, // "pending" | "error" | "success" - ✓ Added by wrapper
} = useCategories(); // Uses wrapLiveQuery internally
```

### Component Usage (Unchanged)

```typescript
function CategoryList() {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) return <Spinner />;
  if (error) return <Error error={error} />;

  return (
    <ul>
      {categories?.map((category) => (
        <li key={category.id}>{category.name}</li>
      ))}
    </ul>
  );
}
```

## Adding New Features to Hooks

### Pattern 1: Simple List Hook

```typescript
import { useLiveQuery } from "@tanstack/react-db";
import { useCollections } from "./use-collections";
import { wrapLiveQuery } from "./utils/hook-wrapper";
import type { QueryResult } from "./utils/hook-wrapper";
import type { Category } from "../schema";

/**
 * Hook to fetch all categories
 *
 * @example
 * const { data: categories, isLoading } = useCategories();
 */
export function useCategories(): QueryResult<Category[]> {
  const { categories } = useCollections();

  const result = useLiveQuery(
    (q) => q.from({ category: categories }),
    [categories],
  );

  return wrapLiveQuery(result);
}
```

### Pattern 2: Single Item Hook

```typescript
import { eq } from "@tanstack/react-db";

/**
 * Hook to fetch a single category by ID
 *
 * @example
 * const { data: category } = useCategory(1);
 */
export function useCategory(
  id: number | undefined,
): QueryResult<Category | undefined> {
  const { categories } = useCollections();

  const result = useLiveQuery(
    (q) => {
      if (!id) return undefined;

      return q
        .from({ category: categories })
        .where(({ category }) => eq(category.id, id))
        .findOne();
    },
    [id, categories],
  );

  return wrapLiveQuery(result);
}
```

### Pattern 3: Filtered List Hook

```typescript
/**
 * Hook to fetch batches for a specific product
 *
 * @example
 * const { data: batches } = useBatches(productId);
 */
export function useBatches(
  productId: number | undefined,
): QueryResult<Batch[]> {
  const { batches } = useCollections();

  const result = useLiveQuery(
    (q) => {
      if (!productId) return undefined;

      return q
        .from({ batch: batches })
        .where(({ batch }) => eq(batch.productId, productId));
    },
    [productId, batches],
  );

  return wrapLiveQuery(result);
}
```

### Pattern 4: Hook with Joins

```typescript
import { eq } from "@tanstack/react-db";

export function useProducts(): QueryResult<ProductWithRelations[]> {
  const { products, categories, suppliers } = useCollections();

  const result = useLiveQuery(
    (q) =>
      q
        .from({ product: products })
        .leftJoin({ category: categories }, ({ product, category }) =>
          eq(product.categoryId, category.id),
        )
        .leftJoin({ supplier: suppliers }, ({ product, supplier }) =>
          eq(product.defaultSupplierId, supplier.id),
        )
        .select(({ product, category, supplier }) => ({
          ...product,
          category: category
            ? {
                id: category.id,
                name: category.name,
                description: category.description,
              }
            : undefined,
          defaultSupplier: supplier
            ? {
                id: supplier.id,
                name: supplier.name,
                email: supplier.email,
              }
            : undefined,
        })),
    [products, categories, suppliers],
  );

  return wrapLiveQuery(result);
}
```

### Pattern 5: Hook with Complex Filters

```typescript
import { gte, lte, and } from "@tanstack/react-db";

export interface TransactionFilters {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export function useTransactions(
  filters?: TransactionFilters,
): QueryResult<StockTransaction[]> {
  const { transactions } = useCollections();

  const result = useLiveQuery(
    (q) => {
      let query = q.from({ transaction: transactions });

      if (filters?.startDate || filters?.endDate) {
        query = query.where(({ transaction }) => {
          const conditions = [];

          if (filters.startDate) {
            const startDateTime = `${filters.startDate}T00:00:00.000Z`;
            conditions.push(gte(transaction.timestamp, startDateTime));
          }

          if (filters.endDate) {
            const endDateTime = `${filters.endDate}T23:59:59.999Z`;
            conditions.push(lte(transaction.timestamp, endDateTime));
          }

          if (conditions.length === 1) return conditions[0];
          if (conditions.length === 2) return and(conditions[0], conditions[1]);
          return true;
        });
      }

      return query;
    },
    [filters?.startDate, filters?.endDate, transactions],
  );

  return wrapLiveQuery(result);
}
```

## Testing Hook Abstractions

### Basic Hook Test

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCategories } from "../use-categories";

describe("useCategories", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  it("returns TanStack Query-compatible API", async () => {
    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.status).toBe("pending");

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    // After loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeNull();
  });

  it("loads categories", async () => {
    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
      expect(result.current.data!.length).toBeGreaterThan(0);
    });

    expect(result.current.data![0]).toHaveProperty("id");
    expect(result.current.data![0]).toHaveProperty("name");
  });
});
```

### Testing Filtered Hooks

```typescript
it("filters batches by product ID", async () => {
  const productId = 1;
  const { result } = renderHook(() => useBatches(productId), {
    wrapper: createWrapper(),
  });

  await waitFor(() => {
    expect(result.current.data).toBeDefined();
    expect(result.current.data!.length).toBeGreaterThan(0);
  });

  // Verify all batches belong to the product
  result.current.data!.forEach((batch) => {
    expect(batch.productId).toBe(productId);
  });
});
```

### Testing Error States

```typescript
it("handles errors correctly", async () => {
  // Mock error in collection
  const { result } = renderHook(() => useCategories(), {
    wrapper: createWrapper(),
  });

  // Simulate error (implementation depends on your setup)
  // ...

  await waitFor(() => {
    expect(result.current.isError).toBe(true);
  });

  expect(result.current.error).not.toBeNull();
  expect(result.current.status).toBe("error");
  expect(result.current.isSuccess).toBe(false);
});
```

## When to Remove the Wrapper

### Keep the Wrapper If:

- ✅ Components expect TanStack Query API
- ✅ You want gradual migration
- ✅ You might rollback to TanStack Query
- ✅ Team is more familiar with TanStack Query API

### Remove the Wrapper If:

- ✅ All components migrated to TanStack DB
- ✅ Team comfortable with TanStack DB API
- ✅ Want to use TanStack DB-specific features
- ✅ Want to reduce abstraction layers

### How to Remove

1. **Update hook to return raw `useLiveQuery` result:**

```typescript
// Before (with wrapper)
export function useCategories(): QueryResult<Category[]> {
  const { categories } = useCollections();
  const result = useLiveQuery(
    (q) => q.from({ category: categories }),
    [categories],
  );
  return wrapLiveQuery(result);
}

// After (without wrapper)
export function useCategories() {
  const { categories } = useCollections();
  return useLiveQuery((q) => q.from({ category: categories }), [categories]);
}
```

2. **Update components to use TanStack DB API:**

```typescript
// Before (TanStack Query API)
const { data, isLoading, error, isSuccess, status } = useCategories();

// After (TanStack DB API)
const { data, isLoading, error, isError } = useCategories();
// Note: isSuccess and status no longer available
```

3. **Update tests:**

```typescript
// Before
expect(result.current.isSuccess).toBe(true);
expect(result.current.status).toBe("success");

// After
expect(result.current.isError).toBe(false);
expect(result.current.data).toBeDefined();
```

## Design Decisions

### Why Thin Wrapper?

The wrapper is intentionally thin because:

- ✅ **Minimal overhead**: Simple property mapping
- ✅ **Easy to understand**: Clear transformation logic
- ✅ **Easy to remove**: No hidden behavior
- ✅ **No data transformation**: Direct pass-through
- ✅ **Type-safe**: Full TypeScript support

### Why Not Transform Data?

We don't transform the data because:

- ✅ TanStack DB joins handle relations
- ✅ Transformation adds complexity
- ✅ Transformation adds overhead
- ✅ Direct pass-through is simpler
- ✅ Easier to debug

### Why useCollections?

Centralized collection access because:

- ✅ Eliminates repetitive code
- ✅ Ensures collections are properly memoized
- ✅ Single source of truth
- ✅ Type-safe access
- ✅ Easier to test

## Best Practices

### DO:

✅ Use `wrapLiveQuery` for all hooks during migration
✅ Include JSDoc with `@example` for all hooks
✅ Use `useCollections` instead of creating collections directly
✅ Include all dependencies in `useLiveQuery` array
✅ Handle nullable data from joins with `?.`
✅ Use TanStack DB operators (not JavaScript filter)

### DON'T:

❌ Create collections in hooks (use `useCollections`)
❌ Forget dependencies in `useLiveQuery` array
❌ Use JavaScript filter instead of TanStack DB operators
❌ Assume joined data exists (use optional chaining)
❌ Transform data in the wrapper (keep it thin)
❌ Skip tests for new hooks

## Real-World Examples

See these files for complete, working examples:

- **Simple list**: `apps/web/src/features/modules/inventory/hooks/use-categories.ts`
- **Filtered list**: `apps/web/src/features/modules/inventory/hooks/use-batches.ts`
- **With joins**: `apps/web/src/features/modules/inventory/hooks/use-products.ts`
- **Date filtering**: `apps/web/src/features/modules/inventory/hooks/use-transactions.ts`
- **Hook wrapper**: `apps/web/src/features/modules/inventory/hooks/utils/hook-wrapper.ts`
- **Centralized access**: `apps/web/src/features/modules/inventory/hooks/use-collections.ts`

## See Also

- [TanStack DB Migration Guide](./tanstack-db-migration.md)
- [On-Demand Mode Usage Guide](./on-demand-mode.md)
- [Example Queries](./example-queries.md)
- [Coding Guidelines - TanStack DB Section](./CODING_GUIDELINES.md#tanstack-db-patterns)
