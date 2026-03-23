# Hook Utilities

Utility functions and abstractions for inventory hooks using TanStack DB.

## Overview

This directory contains:

1. **hook-wrapper.ts** - Backward-compatible API wrapper for TanStack Query → TanStack DB migration
2. **useCollections** - Centralized collection access (see parent directory)

## Hook Wrapper

The hook wrapper maintains backward-compatible APIs during TanStack DB migration without breaking existing components.

### Problem

When migrating from TanStack Query to TanStack DB:

```typescript
// Before (TanStack Query)
const { data, isLoading, error } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
});

// After (TanStack DB)
const liveResult = useLiveQuery((q) => q.from({ product: products }));
// Returns different shape - breaks components!
```

Components expect the same API shape, but TanStack DB's `useLiveQuery` returns a different structure.

### Solution

Use `wrapLiveQuery` to maintain backward compatibility:

```typescript
import { wrapLiveQuery } from "./utils/hook-wrapper";
import { useLiveQuery } from "@tanstack/react-db";
import { useCollections } from "./use-collections";

export function useProducts() {
  const { products } = useCollections();

  const liveResult = useLiveQuery((q) => q.from({ product: products }));

  return wrapLiveQuery(liveResult); // ← Maintains TanStack Query API
}

// Components work unchanged ✓
const { data, isLoading, error } = useProducts();
```

## Usage Patterns

### Pattern 1: Simple Query (Categories, Suppliers)

```typescript
import { useLiveQuery } from "@tanstack/react-db";
import { useCollections } from "./use-collections";
import { wrapLiveQuery } from "./utils/hook-wrapper";

export function useCategories() {
  const { categories } = useCollections();

  const liveResult = useLiveQuery((q) => q.from({ category: categories }));

  return wrapLiveQuery(liveResult);
}
```

### Pattern 2: Query with Joins (Products)

```typescript
import { useLiveQuery, eq } from "@tanstack/react-db";
import { useCollections } from "./use-collections";
import { wrapLiveQuery } from "./utils/hook-wrapper";

export function useProducts() {
  const { products, categories, suppliers } = useCollections();

  const liveResult = useLiveQuery((q) =>
    q
      .from({ product: products })
      .join(
        { category: categories },
        ({ product, category }) => eq(product.categoryId, category.id),
        "left",
      )
      .join(
        { supplier: suppliers },
        ({ product, supplier }) => eq(product.defaultSupplierId, supplier.id),
        "left",
      )
      .select(({ product, category, supplier }) => ({
        ...product,
        category: category ?? null,
        defaultSupplier: supplier ?? null,
      })),
  );

  return wrapLiveQuery(liveResult);
}
```

### Pattern 3: Filtered Query (Batches)

```typescript
import { useLiveQuery, eq } from "@tanstack/react-db";
import { useCollections } from "./use-collections";
import { wrapLiveQuery } from "./utils/hook-wrapper";

export function useBatches(productId: number) {
  const { batches, products } = useCollections();

  const liveResult = useLiveQuery(
    (q) =>
      q
        .from({ batch: batches })
        .where(({ batch }) => eq(batch.productId, productId))
        .join(
          { product: products },
          ({ batch, product }) => eq(batch.productId, product.id),
          "left",
        ),
    [productId, batches, products], // ← Dependencies for re-query
  );

  return wrapLiveQuery(liveResult);
}
```

### Pattern 4: Single Item Query

```typescript
import { useLiveQuery, eq } from "@tanstack/react-db";
import { useCollections } from "./use-collections";
import { wrapLiveQuery } from "./utils/hook-wrapper";

export function useProduct(id: number) {
  const { products, categories, suppliers } = useCollections();

  const liveResult = useLiveQuery(
    (q) => {
      if (!id) return undefined;

      return q
        .from({ product: products })
        .where(({ product }) => eq(product.id, id))
        .join(
          { category: categories },
          ({ product, category }) => eq(product.categoryId, category.id),
          "left",
        )
        .select(({ product, category }) => ({
          ...product,
          category: category ?? null,
        }))
        .findOne(); // ← Returns single item
    },
    [id, products, categories, suppliers],
  );

  return wrapLiveQuery(liveResult);
}
```

## API Reference

### `QueryResult<TData>` Interface

```typescript
interface QueryResult<TData> {
  data: TData | undefined;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
  status: "pending" | "error" | "success";
}
```

This matches the TanStack Query API shape exactly, ensuring zero breaking changes.

### `wrapLiveQuery<TData>(liveQueryResult): QueryResult<TData>`

Wraps a TanStack DB `useLiveQuery` result to match TanStack Query API.

**Parameters:**

- `liveQueryResult` - Result from `useLiveQuery`

**Returns:**

- `QueryResult<TData>` - Wrapped result with TanStack Query-compatible shape

**Example:**

```typescript
const liveResult = useLiveQuery((q) => q.from({ product: products }));
const wrapped = wrapLiveQuery(liveResult);

// Use like TanStack Query result
if (wrapped.isLoading) return <Spinner />;
if (wrapped.error) return <Error error={wrapped.error} />;
return <List data={wrapped.data} />;
```

### `createHookWrapper<TData, TArgs>(useLiveQueryHook)`

Creates a wrapped hook function that maintains TanStack Query API.

**Note:** This is rarely needed now that we use `useCollections` + `wrapLiveQuery` pattern.

**Parameters:**

- `useLiveQueryHook` - Hook function that returns live query result

**Returns:**

- Wrapped hook function with same signature

## useCollections Hook

The `useCollections` hook provides centralized access to all inventory collections:

```typescript
import { useCollections } from "./use-collections";

export function useProducts() {
  const { products, categories, suppliers } = useCollections();

  // Use collections in queries...
}
```

**Benefits:**

- ✅ Single source of truth for collections
- ✅ Memoized - collections don't recreate on every render
- ✅ Type-safe access to all collections
- ✅ Eliminates repetitive collection creation code

**Available Collections:**

- `products` - Product collection
- `categories` - Category collection
- `suppliers` - Supplier collection
- `batches` - Batch collection
- `transactions` - Transaction collection

## Migration Strategy

### Phase 1: Add Wrapper (No Breaking Changes) ✅ DONE

```typescript
// Before (TanStack Query)
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}

// After (TanStack DB with wrapper)
export function useProducts() {
  const { products } = useCollections();
  const liveResult = useLiveQuery((q) => q.from({ product: products }));
  return wrapLiveQuery(liveResult);
}

// Components unchanged ✓
```

### Phase 2: Migrate Components (Gradual) ← CURRENT

```typescript
// Old components still work
const { data, isLoading, error } = useProducts();

// New components can use TanStack DB directly if needed
const liveResult = useLiveQuery((q) => q.from({ product: products }));
```

### Phase 3: Remove Wrapper (Future - Optional)

Once all components are comfortable with TanStack DB, you can optionally remove the wrapper:

```typescript
// Direct TanStack DB usage
export function useProducts() {
  const { products } = useCollections();
  return useLiveQuery((q) => q.from({ product: products }));
}
```

## Current Implementation Status

### ✅ Migrated Hooks (Using Wrapper)

- `useProducts()` - Products with joins
- `useProduct(id)` - Single product with joins
- `useBatches(productId)` - Batches filtered by product
- `useBatch(id)` - Single batch with joins
- `useCategories()` - All categories
- `useCategory(id)` - Single category
- `useSuppliers()` - All suppliers
- `useSupplier(id)` - Single supplier

### ✅ All Tests Passing

- 4 test files, 13 tests total
- Products: 4 tests
- Batches: 3 tests
- Categories: 3 tests
- Suppliers: 3 tests

## Testing

Run hook tests:

```bash
npm run test:run -- src/features/modules/inventory/hooks/__tests__/
```

Expected output:

```
Test Files  4 passed (4)
     Tests  13 passed (13)
```

## Design Decisions

### Why Thin Wrapper?

The wrapper is intentionally thin because:

- ✅ Minimal overhead
- ✅ Easy to understand
- ✅ Easy to remove later
- ✅ No hidden behavior
- ✅ Direct pass-through of properties

### Why useCollections?

Centralized collection access because:

- ✅ Eliminates repetitive `useMemo` + `createCollection` code
- ✅ Ensures collections are properly memoized
- ✅ Single source of truth
- ✅ Type-safe access
- ✅ Easier to test

### Why Not Transform Data?

We don't transform the data because:

- ✅ TanStack DB joins handle relations
- ✅ Transformation adds complexity
- ✅ Transformation adds overhead
- ✅ Direct pass-through is simpler

## See Also

- [useCollections](../use-collections.ts) - Centralized collection access
- [Collections](../../collections/) - TanStack DB collection definitions
- [Mock Generators](../../utils/README.md) - Data generation for tests
- [Test Utilities](../../test/README.md) - Testing helpers
