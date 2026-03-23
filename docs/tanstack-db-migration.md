# TanStack DB Migration Guide

## Overview

This guide documents the step-by-step process for migrating modules from TanStack Query to TanStack DB in the Pharos One inventory system. The migration enables reactive, client-side queries with automatic updates while maintaining backward compatibility.

**Status**: ✅ All inventory hooks migrated (24 tests passing, zero type errors)

## Table of Contents

- [Why Migrate to TanStack DB?](#why-migrate-to-tanstack-db)
- [Migration Strategy](#migration-strategy)
- [Step-by-Step Migration Process](#step-by-step-migration-process)
- [Decision Tree: Eager vs On-Demand Mode](#decision-tree-eager-vs-on-demand-mode)
- [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)
- [Testing Your Migration](#testing-your-migration)
- [Rollback Strategy](#rollback-strategy)

## Why Migrate to TanStack DB?

### Benefits

1. **Reactive Queries**: Automatic UI updates when data changes
2. **Client-Side Joins**: Combine data from multiple collections without backend changes
3. **Differential Dataflow**: Sub-millisecond query performance after initial load
4. **Predicate Push-Down**: Automatic filtering at the data source (on-demand mode)
5. **Scalability**: Handle 1M+ records with on-demand mode
6. **Type Safety**: Full TypeScript support with inferred types

### When to Migrate

✅ **Good candidates for migration:**

- Modules with frequently changing data
- Modules that need client-side filtering/sorting
- Modules with complex relationships (joins)
- Modules that need real-time updates

❌ **Not good candidates:**

- Simple, one-time data fetches
- External API calls (use TanStack Query)
- File uploads/downloads
- Authentication flows

## Migration Strategy

### Three-Phase Approach

```
Phase 1: Add Collections (No Breaking Changes)
├── Create collection definitions
├── Add useCollections hook
└── Keep existing TanStack Query hooks

Phase 2: Migrate Hooks (Gradual)
├── Wrap useLiveQuery with wrapLiveQuery
├── Maintain TanStack Query API shape
└── Components work unchanged

Phase 3: Optimize (Optional)
├── Remove wrapper if desired
├── Use TanStack DB API directly
└── Add advanced features (optimistic updates, etc.)
```

### Backward Compatibility

The migration maintains backward compatibility using the `wrapLiveQuery` wrapper:

```typescript
// Before (TanStack Query)
export function useProducts() {
  return useQuery({
    queryKey: ["inventory", "products"],
    queryFn: fetchProducts,
  });
}

// After (TanStack DB with wrapper)
export function useProducts() {
  const { products } = useCollections();
  const liveResult = useLiveQuery((q) => q.from({ product: products }));
  return wrapLiveQuery(liveResult); // ← Maintains TanStack Query API
}

// Components unchanged ✓
const { data, isLoading, error } = useProducts();
```

## Step-by-Step Migration Process

### Step 1: Create Collection Definition

Create a new file in `collections/` directory:

```typescript
// File: collections/category.collection.ts
import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import type { QueryClient } from "@tanstack/react-query";
import type { Category } from "../schema";

/**
 * Fetch all categories (mock data generator)
 * In production, this would call the Tauri API
 */
async function fetchCategories(): Promise<Category[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  // TODO: Replace with Tauri invoke
  // return await invoke("get_categories");

  return Array.from({ length: 20 }, (_, i) => generateCategory(i + 1));
}

/**
 * Create category collection with provided QueryClient
 * Small dataset (~20 categories) loaded upfront for instant access
 */
export function createCategoryCollection(queryClient: QueryClient) {
  return createCollection(
    queryCollectionOptions({
      queryClient,
      queryKey: ["inventory", "categories"],
      queryFn: fetchCategories,
      getKey: (item: Category) => item.id, // ← REQUIRED!
      staleTime: 1000 * 60 * 10, // 10 minutes (rarely changes)
    }),
  );
}
```

**Key Points:**

- ✅ Async `queryFn` (ready for Tauri)
- ✅ Explicit `getKey` function (required!)
- ✅ Appropriate `staleTime` (10min for static, 5min for dynamic)
- ✅ Type-safe with explicit types

### Step 2: Add to useCollections Hook

Update `hooks/use-collections.ts`:

```typescript
import { createCategoryCollection } from "../collections/category.collection";

export function useCollections() {
  const queryClient = useQueryClient();

  return useMemo(
    () => ({
      categories: createCategoryCollection(queryClient),
      // ... other collections
    }),
    [queryClient],
  );
}
```

### Step 3: Migrate Hook to TanStack DB

Update the hook file:

```typescript
// File: hooks/use-categories.ts
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
    [categories], // ← Include collection in dependencies!
  );

  return wrapLiveQuery(result);
}
```

### Step 4: Add Single Item Hook (Optional)

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
      if (!id) return undefined; // Disable query when ID is missing

      return q
        .from({ category: categories })
        .where(({ category }) => eq(category.id, id))
        .findOne();
    },
    [id, categories], // ← Include all dependencies!
  );

  return wrapLiveQuery(result);
}
```

### Step 5: Write Tests

```typescript
// File: hooks/__tests__/use-categories-db.test.tsx
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCategories, useCategory } from "../use-categories";

describe("useCategories (TanStack DB)", () => {
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

  it("loads all categories", async () => {
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

  it("loads single category by ID", async () => {
    const categoryId = 1;
    const { result } = renderHook(() => useCategory(categoryId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data!.id).toBe(categoryId);
  });
});
```

### Step 6: Run Tests

```bash
npm run test:run -- src/features/modules/inventory/hooks/__tests__/use-categories-db.test.tsx
```

Expected output:

```
✓ loads all categories
✓ loads single category by ID
```

## Decision Tree: Eager vs On-Demand Mode

### Use Eager Mode (Default) When:

- ✅ Dataset has <10K records
- ✅ Data is mostly static (changes rarely)
- ✅ Need all data loaded upfront
- ✅ Simple reference tables (categories, suppliers, etc.)

**Example: Categories**

```typescript
export function createCategoryCollection(queryClient: QueryClient) {
  return createCollection(
    queryCollectionOptions({
      queryClient,
      queryKey: ["inventory", "categories"],
      queryFn: fetchCategories,
      getKey: (item: Category) => item.id,
      // No syncMode specified = eager (default)
      staleTime: 1000 * 60 * 10, // 10 minutes
    }),
  );
}
```

### Use On-Demand Mode When:

- ✅ Dataset has >50K records
- ✅ Users search/filter data
- ✅ Most data won't be accessed
- ✅ Need sub-millisecond query performance
- ✅ Want automatic predicate push-down

**Example: Products (1M+ records)**

```typescript
export function createProductCollection(queryClient: QueryClient) {
  return createCollection(
    queryCollectionOptions({
      queryClient,
      queryKey: ["inventory", "products"],
      queryFn: fetchProducts,
      getKey: (item: Product) => item.id,
      syncMode: "on-demand", // ← CRITICAL for large datasets
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
  );
}
```

### Decision Matrix

| Dataset Size | Change Frequency | Access Pattern | Recommended Mode   |
| ------------ | ---------------- | -------------- | ------------------ |
| <1K records  | Rarely           | Load all       | Eager              |
| 1K-10K       | Occasionally     | Load all       | Eager              |
| 10K-50K      | Frequently       | Filtered       | Eager or On-Demand |
| 50K-100K     | Frequently       | Filtered       | On-Demand          |
| 100K+        | Any              | Filtered       | On-Demand          |
| 1M+          | Any              | Filtered       | On-Demand          |

## Common Pitfalls and Solutions

### Pitfall 1: Forgetting getKey

```typescript
// ❌ WRONG: Missing getKey
const collection = createCollection(
  queryCollectionOptions({
    queryKey: ["inventory", "products"],
    queryFn: fetchProducts,
    // Missing getKey!
  }),
);

// ✅ CORRECT: Include getKey
const collection = createCollection(
  queryCollectionOptions({
    queryKey: ["inventory", "products"],
    queryFn: fetchProducts,
    getKey: (item) => item.id, // Required!
  }),
);
```

### Pitfall 2: Creating Collections in Hooks

```typescript
// ❌ WRONG: Creating collection in hook
export function useProducts() {
  const queryClient = useQueryClient();
  const products = createProductCollection(queryClient); // Creates new instance!

  return useLiveQuery((q) => q.from({ product: products }), [products]);
}

// ✅ CORRECT: Use centralized collections
export function useProducts() {
  const { products } = useCollections(); // Reuses same instance

  return useLiveQuery((q) => q.from({ product: products }), [products]);
}
```

### Pitfall 3: Missing Dependencies

```typescript
// ❌ WRONG: Missing dependencies
export function useProduct(id: number) {
  const { products } = useCollections();

  return useLiveQuery(
    (q) =>
      q.from({ product: products }).where(({ product }) => eq(product.id, id)),
    [], // WRONG: Missing id and products!
  );
}

// ✅ CORRECT: Include all dependencies
export function useProduct(id: number) {
  const { products } = useCollections();

  return useLiveQuery(
    (q) =>
      q.from({ product: products }).where(({ product }) => eq(product.id, id)),
    [id, products], // CORRECT!
  );
}
```

### Pitfall 4: Using JavaScript Filter Instead of Operators

```typescript
// ❌ WRONG: JavaScript filtering
export function useActiveProducts() {
  const { products } = useCollections();
  const result = useLiveQuery((q) => q.from({ product: products }), [products]);

  // WRONG: Filtering after query
  return {
    ...result,
    data: result.data?.filter((p) => p.isActive),
  };
}

// ✅ CORRECT: Use TanStack DB operators
export function useActiveProducts() {
  const { products } = useCollections();

  return useLiveQuery(
    (q) =>
      q
        .from({ product: products })
        .where(({ product }) => eq(product.isActive, true)),
    [products],
  );
}
```

### Pitfall 5: Not Handling Nullable Joins

```typescript
// ❌ WRONG: Assuming joined data exists
const result = useLiveQuery((q) =>
  q
    .from({ product: products })
    .leftJoin({ category: categories }, ...)
    .select(({ product, category }) => ({
      name: product.name,
      categoryName: category.name, // ERROR: category might be undefined
    })),
  [products, categories],
);

// ✅ CORRECT: Handle nullable data
const result = useLiveQuery((q) =>
  q
    .from({ product: products })
    .leftJoin({ category: categories }, ...)
    .select(({ product, category }) => ({
      name: product.name,
      categoryName: category?.name, // CORRECT: optional chaining
    })),
  [products, categories],
);
```

## Testing Your Migration

### Test Checklist

Before considering a migration complete:

- [ ] Collection created with `queryCollectionOptions`
- [ ] Collection has explicit `getKey` function
- [ ] Hook uses `useCollections` (not creating collection directly)
- [ ] Hook wrapped with `wrapLiveQuery`
- [ ] Hook has JSDoc with `@example`
- [ ] Filters use TanStack DB operators (not JavaScript)
- [ ] All dependencies included in `useLiveQuery` array
- [ ] Joins handle nullable data with `?.`
- [ ] Tests passing
- [ ] Zero type errors
- [ ] Components work without changes

### Running Tests

```bash
# Run all inventory hook tests
npm run test:run -- src/features/modules/inventory/hooks/__tests__/

# Run specific test file
npm run test:run -- src/features/modules/inventory/hooks/__tests__/use-categories-db.test.tsx

# Run with coverage
npm run test:coverage -- src/features/modules/inventory/hooks/
```

## Rollback Strategy

If you need to rollback a migration:

### Step 1: Keep Old Hook Implementation

```typescript
// File: hooks/use-categories.ts

// New implementation (TanStack DB)
export function useCategories(): QueryResult<Category[]> {
  const { categories } = useCollections();
  const result = useLiveQuery(
    (q) => q.from({ category: categories }),
    [categories],
  );
  return wrapLiveQuery(result);
}

// Old implementation (TanStack Query) - commented out
// export function useCategories() {
//   return useQuery({
//     queryKey: ["inventory", "categories"],
//     queryFn: fetchCategories,
//   });
// }
```

### Step 2: Swap Implementations

If issues arise, simply uncomment the old implementation and comment out the new one.

### Step 3: Remove Collection (Optional)

If rolling back permanently, remove the collection definition and update `useCollections`.

## Next Steps

After completing the migration:

1. **Read the Hook Abstraction Pattern Guide** - Understand how the wrapper works
2. **Read the On-Demand Mode Guide** - Learn when and how to use on-demand mode
3. **Review Example Queries** - See common use cases and patterns
4. **Optimize Performance** - Use benchmarks to validate performance targets

## See Also

- [Hook Abstraction Pattern Guide](./hook-abstraction-pattern.md)
- [On-Demand Mode Usage Guide](./on-demand-mode.md)
- [Example Queries](./example-queries.md)
- [TanStack DB Verified Patterns](./.kiro/steering/tanstack-db-verified-patterns.md)
- [Coding Guidelines - TanStack DB Section](./CODING_GUIDELINES.md#tanstack-db-patterns)
