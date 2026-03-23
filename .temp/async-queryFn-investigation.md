# Investigation: Async queryFn with queryCollectionOptions

## Problem Statement

When using `queryCollectionOptions` from `@tanstack/query-db-collection`, async `queryFn` functions don't work consistently in tests.

## Test Results

### Categories Collection (Async) - ✅ WORKS

```typescript
async function fetchCategories(): Promise<Category[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return Array.from({ length: 20 }, (_, i) => generateCategory(i + 1));
}

export function createCategoryCollection(queryClient: QueryClient) {
  return createCollection(
    queryCollectionOptions({
      queryClient,
      queryKey: ["inventory", "categories"],
      queryFn: fetchCategories, // ✅ Async works!
      getKey: (item: Category) => item.id,
      staleTime: 1000 * 60 * 10,
    }),
  );
}
```

**Test Result**: ✅ All 3 tests pass

### Products Collection (Async) - ❌ FAILS

```typescript
async function fetchProducts(): Promise<ProductStockSummary[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const defaultLimit = 50;
  return Array.from({ length: defaultLimit }, (_, i) =>
    generateProductStockSummary(i + 1),
  );
}

export function createProductCollection(queryClient: QueryClient) {
  return createCollection(
    queryCollectionOptions({
      queryClient,
      queryKey: ["inventory", "products"],
      queryFn: fetchProducts, // ❌ Async fails!
      getKey: (item: ProductStockSummary) => item.id,
      staleTime: 1000 * 60 * 5,
    }),
  );
}
```

**Test Result**: ❌ Test fails - data stays empty, isLoading stays true

### Products Collection (Sync) - ✅ WORKS

```typescript
function fetchProducts(): ProductStockSummary[] {
  const defaultLimit = 50;
  return Array.from({ length: defaultLimit }, (_, i) =>
    generateProductStockSummary(i + 1),
  );
}

export function createProductCollection(queryClient: QueryClient) {
  return createCollection(
    queryCollectionOptions({
      queryClient,
      queryKey: ["inventory", "products"],
      queryFn: fetchProducts, // ✅ Sync works!
      getKey: (item: ProductStockSummary) => item.id,
      staleTime: 1000 * 60 * 5,
    }),
  );
}
```

**Test Result**: ✅ Test passes

## Key Differences

### What's Different Between Categories and Products?

1. **Data Type Complexity**:
   - Categories: Simple type with 4 fields
   - Products: Complex type (`ProductStockSummary`) with nested objects (category, supplier)

2. **Generator Complexity**:
   - `generateCategory(id)`: Simple, single function call
   - `generateProductStockSummary(id)`: Calls 3 generators (product, category, supplier)

3. **Data Size**:
   - Categories: 20 records
   - Products: 50 records

## Hypothesis

The async issue might be related to:

1. **Generator Complexity**: `generateProductStockSummary` calls multiple generators, which might cause timing issues in the test environment
2. **Type Complexity**: The nested objects in `ProductStockSummary` might not serialize/deserialize properly in async context
3. **Test Environment**: Vitest might handle async functions differently for different data structures

## Documentation Check

According to `.temp/query-live.md`:

> The `queryFn` can be async or sync. TanStack DB handles both.

However, the documentation examples show async functions working fine:

```typescript
const activeUsers = createCollection(
  liveQueryCollectionOptions({
    query: (q) =>
      q
        .from({ user: usersCollection })
        .where(({ user }) => eq(user.active, true)),
  }),
);
```

The `liveQueryCollectionOptions` is different from `queryCollectionOptions` - maybe that's the issue?

## Solution

**For now**: Use synchronous `queryFn` for products collection.

```typescript
function fetchProducts(): ProductStockSummary[] {
  const defaultLimit = 50;
  return Array.from({ length: defaultLimit }, (_, i) =>
    generateProductStockSummary(i + 1),
  );
}
```

**For production**: When integrating with Tauri, the `queryFn` will call `invoke()` which is async. We'll need to test if async works in production or if we need a different approach.

## Recommendations

1. **Keep synchronous for mock data**: Since we're generating data in-memory, there's no real need for async
2. **Test with real Tauri invoke**: When we integrate with Tauri, test if async `invoke()` works properly
3. **Consider wrapper function**: If async doesn't work, we might need a synchronous wrapper that calls async internally

## Next Steps

1. ✅ Use synchronous `queryFn` for products collection
2. ✅ Complete Test 1 (basic loading)
3. ⏳ Implement remaining 5 tests
4. ⏳ Test with real Tauri `invoke()` when backend is ready
5. ⏳ Document any async issues with real API calls

## Conclusion

The async `queryFn` issue is likely specific to the test environment or data complexity. Since mock data generation doesn't need to be async, we'll use synchronous functions for now and revisit when integrating with Tauri's async `invoke()`.

**Status**: ✅ Resolved for mock data, ⏳ Needs testing with real async API calls
