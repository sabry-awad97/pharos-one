# Hook Wrapper

Abstraction layer for maintaining backward-compatible APIs during TanStack DB migration.

## Overview

The hook wrapper allows gradual migration from TanStack Query to TanStack DB without breaking existing components. It provides a thin wrapper that maintains the same API shape.

## Problem

When migrating from TanStack Query to TanStack DB:

```typescript
// Before (TanStack Query)
const { data, isLoading, error } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
});

// After (TanStack DB)
const { data, isLoading, error } = useLiveQuery(productsCollection.query());
```

Components expect the same API shape, but the underlying implementation changes.

## Solution

Use `wrapLiveQuery` to maintain backward compatibility:

```typescript
// Wrapped hook maintains same API
export function useProducts() {
  const liveResult = useLiveQuery(productsCollection.query());
  return wrapLiveQuery(liveResult);
}

// Components work unchanged
const { data, isLoading, error } = useProducts();
```

## Usage

### Basic Wrapper

```typescript
import { wrapLiveQuery } from "./hook-wrapper";
import { useLiveQuery } from "@tanstack/react-db";

export function useProducts() {
  const liveResult = useLiveQuery(productsCollection.query());
  return wrapLiveQuery(liveResult);
}
```

### With Parameters

```typescript
import { wrapLiveQuery } from "./hook-wrapper";
import { useLiveQuery } from "@tanstack/react-db";

export function useProduct(id: number) {
  const liveResult = useLiveQuery(
    productsCollection.query().where("id", "==", id),
  );
  return wrapLiveQuery(liveResult);
}
```

### Create Hook Wrapper Factory

```typescript
import { createHookWrapper } from "./hook-wrapper";
import { useLiveQuery } from "@tanstack/react-db";

// Create wrapped hook
const useProducts = createHookWrapper(() => {
  return useLiveQuery(productsCollection.query());
});

// Use like normal hook
const { data, isLoading, error } = useProducts();
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

This matches the TanStack Query API shape exactly.

### `wrapLiveQuery<TData>(liveQueryResult: QueryResult<TData>): QueryResult<TData>`

Wraps a TanStack DB `useLiveQuery` result to match TanStack Query API.

**Parameters:**

- `liveQueryResult` - Result from `useLiveQuery`

**Returns:**

- `QueryResult<TData>` - Wrapped result with same API shape

**Example:**

```typescript
const liveResult = useLiveQuery(collection.query());
const wrapped = wrapLiveQuery(liveResult);

// Use like TanStack Query result
if (wrapped.isLoading) return <Spinner />;
if (wrapped.error) return <Error error={wrapped.error} />;
return <List data={wrapped.data} />;
```

### `createHookWrapper<TData, TArgs>(useLiveQueryHook: (...args: TArgs) => QueryResult<TData>)`

Creates a wrapped hook function that maintains TanStack Query API.

**Parameters:**

- `useLiveQueryHook` - Hook function that returns `QueryResult`

**Returns:**

- Wrapped hook function with same signature

**Example:**

```typescript
const useProducts = createHookWrapper(() => {
  return useLiveQuery(productsCollection.query());
});

const useProduct = createHookWrapper((id: number) => {
  return useLiveQuery(productsCollection.query().where("id", "==", id));
});
```

## Migration Strategy

### Phase 1: Add Wrapper (No Breaking Changes)

```typescript
// Before
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}

// After (with wrapper)
export function useProducts() {
  const liveResult = useLiveQuery(productsCollection.query());
  return wrapLiveQuery(liveResult);
}

// Components unchanged ✓
```

### Phase 2: Migrate Components (Gradual)

```typescript
// Old components still work
const { data, isLoading, error } = useProducts();

// New components can use TanStack DB directly
const liveResult = useLiveQuery(productsCollection.query());
```

### Phase 3: Remove Wrapper (Optional)

Once all components are migrated, you can optionally remove the wrapper:

```typescript
// Direct TanStack DB usage
export function useProducts() {
  return useLiveQuery(productsCollection.query());
}
```

## Examples

### Example 1: Simple List Hook

```typescript
import { wrapLiveQuery } from "./hook-wrapper";
import { useLiveQuery } from "@tanstack/react-db";

export function useCategories() {
  const liveResult = useLiveQuery(categoriesCollection.query());
  return wrapLiveQuery(liveResult);
}

// Component
function CategoriesList() {
  const { data, isLoading, error } = useCategories();

  if (isLoading) return <Spinner />;
  if (error) return <Error error={error} />;

  return (
    <ul>
      {data?.map((cat) => (
        <li key={cat.id}>{cat.name}</li>
      ))}
    </ul>
  );
}
```

### Example 2: Filtered Hook

```typescript
import { wrapLiveQuery } from "./hook-wrapper";
import { useLiveQuery } from "@tanstack/react-db";

export function useActiveProducts() {
  const liveResult = useLiveQuery(
    productsCollection.query().where("isActive", "==", true)
  );
  return wrapLiveQuery(liveResult);
}

// Component
function ActiveProductsList() {
  const { data, isLoading } = useActiveProducts();

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h2>Active Products ({data?.length})</h2>
      {/* ... */}
    </div>
  );
}
```

### Example 3: Parameterized Hook

```typescript
import { wrapLiveQuery } from "./hook-wrapper";
import { useLiveQuery } from "@tanstack/react-db";

export function useProductsByCategory(categoryId: number) {
  const liveResult = useLiveQuery(
    productsCollection.query().where("categoryId", "==", categoryId)
  );
  return wrapLiveQuery(liveResult);
}

// Component
function CategoryProducts({ categoryId }: { categoryId: number }) {
  const { data, isLoading } = useProductsByCategory(categoryId);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h3>Products in Category {categoryId}</h3>
      {data?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Example 4: Multiple Hooks

```typescript
import { wrapLiveQuery } from "./hook-wrapper";
import { useLiveQuery } from "@tanstack/react-db";

export function useProducts() {
  const liveResult = useLiveQuery(productsCollection.query());
  return wrapLiveQuery(liveResult);
}

export function useCategories() {
  const liveResult = useLiveQuery(categoriesCollection.query());
  return wrapLiveQuery(liveResult);
}

export function useSuppliers() {
  const liveResult = useLiveQuery(suppliersCollection.query());
  return wrapLiveQuery(liveResult);
}

// Component using multiple hooks
function InventoryDashboard() {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: suppliers, isLoading: suppliersLoading } = useSuppliers();

  if (productsLoading || categoriesLoading || suppliersLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <h1>Inventory Dashboard</h1>
      <Stats
        products={products?.length}
        categories={categories?.length}
        suppliers={suppliers?.length}
      />
    </div>
  );
}
```

## Testing

Run hook wrapper tests:

```bash
npm test -- hook-wrapper.test
```

Expected output:

```
✓ returns same shape as TanStack Query
✓ handles loading state
✓ handles error state
```

## Design Decisions

### Why Thin Wrapper?

The wrapper is intentionally thin (just passes through properties) because:

- Minimal overhead
- Easy to understand
- Easy to remove later
- No hidden behavior

### Why Not Transform?

We don't transform the data because:

- TanStack DB and TanStack Query have compatible APIs
- Transformation adds complexity
- Transformation adds overhead
- Direct pass-through is simpler

### Why Separate Function?

We provide both `wrapLiveQuery` and `createHookWrapper` because:

- `wrapLiveQuery`: Explicit, clear, easy to understand
- `createHookWrapper`: Convenient for creating multiple hooks

## See Also

- [Mock Generators](../../utils/README.md) - Data generation
- [Collection Factory](../../db/README.md) - TanStack DB collections
- [Test Utilities](../../test/README.md) - Large dataset testing
