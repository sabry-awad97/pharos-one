# TanStack DB Example Queries

## Overview

This guide provides practical examples of common query patterns using TanStack DB in the Pharos One inventory system. All examples are from the actual implementation and are tested and working.

## Table of Contents

- [Basic Queries](#basic-queries)
- [Filtered Queries](#filtered-queries)
- [Joins and Relations](#joins-and-relations)
- [Date Range Filtering](#date-range-filtering)
- [Complex Filters](#complex-filters)
- [Aggregations](#aggregations)
- [Performance Optimization Tips](#performance-optimization-tips)

## Basic Queries

### Load All Records

```typescript
import { useLiveQuery } from "@tanstack/react-db";
import { useCollections } from "./use-collections";
import { wrapLiveQuery } from "./utils/hook-wrapper";

/**
 * Load all categories (small dataset)
 */
export function useCategories() {
  const { categories } = useCollections();

  const result = useLiveQuery(
    (q) => q.from({ category: categories }),
    [categories],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: categories, isLoading } = useCategories();
```

### Load Single Record by ID

```typescript
import { eq } from "@tanstack/react-db";

/**
 * Load a single category by ID
 */
export function useCategory(id: number | undefined) {
  const { categories } = useCollections();

  const result = useLiveQuery(
    (q) => {
      if (!id) return undefined; // Disable query when ID is missing

      return q
        .from({ category: categories })
        .where(({ category }) => eq(category.id, id))
        .findOne(); // Returns single item or undefined
    },
    [id, categories],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: category } = useCategory(1);
```

### Load with Ordering

```typescript
/**
 * Load categories ordered by name
 */
export function useCategoriesOrdered() {
  const { categories } = useCollections();

  const result = useLiveQuery(
    (q) =>
      q
        .from({ category: categories })
        .orderBy(({ category }) => category.name, "asc"),
    [categories],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: categories } = useCategoriesOrdered();
```

### Load with Limit

```typescript
/**
 * Load first 10 products
 */
export function useProductsLimited() {
  const { products } = useCollections();

  const result = useLiveQuery(
    (q) =>
      q
        .from({ product: products })
        .orderBy(({ product }) => product.name, "asc")
        .limit(10),
    [products],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: products } = useProductsLimited();
```

## Filtered Queries

### Filter by Single Field

```typescript
import { eq } from "@tanstack/react-db";

/**
 * Load products by category
 */
export function useProductsByCategory(categoryId: number | undefined) {
  const { products } = useCollections();

  const result = useLiveQuery(
    (q) => {
      if (!categoryId) return undefined;

      return q
        .from({ product: products })
        .where(({ product }) => eq(product.categoryId, categoryId));
    },
    [categoryId, products],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: products } = useProductsByCategory(1);
```

### Filter by Boolean

```typescript
/**
 * Load active products only
 */
export function useActiveProducts() {
  const { products } = useCollections();

  const result = useLiveQuery(
    (q) =>
      q
        .from({ product: products })
        .where(({ product }) => eq(product.isActive, true)),
    [products],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: activeProducts } = useActiveProducts();
```

### Filter by Text Search

```typescript
import { like } from "@tanstack/react-db";

/**
 * Search products by name
 */
export function useProductSearch(searchTerm: string | undefined) {
  const { products } = useCollections();

  const result = useLiveQuery(
    (q) => {
      if (!searchTerm || searchTerm.length < 2) return undefined;

      return q
        .from({ product: products })
        .where(({ product }) => like(product.name, `%${searchTerm}%`));
    },
    [searchTerm, products],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: results } = useProductSearch("amoxicillin");
```

### Filter by Numeric Range

```typescript
import { gte, lte, and } from "@tanstack/react-db";

/**
 * Load products within price range
 */
export function useProductsByPriceRange(
  minPrice: number | undefined,
  maxPrice: number | undefined,
) {
  const { products } = useCollections();

  const result = useLiveQuery(
    (q) => {
      let query = q.from({ product: products });

      if (minPrice !== undefined && maxPrice !== undefined) {
        query = query.where(({ product }) =>
          and(
            gte(product.basePrice, minPrice),
            lte(product.basePrice, maxPrice),
          ),
        );
      } else if (minPrice !== undefined) {
        query = query.where(({ product }) => gte(product.basePrice, minPrice));
      } else if (maxPrice !== undefined) {
        query = query.where(({ product }) => lte(product.basePrice, maxPrice));
      }

      return query;
    },
    [minPrice, maxPrice, products],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: products } = useProductsByPriceRange(10, 50);
```

### Filter by Array Membership

```typescript
import { inArray } from "@tanstack/react-db";

/**
 * Load products in multiple categories
 */
export function useProductsByCategories(categoryIds: number[]) {
  const { products } = useCollections();

  const result = useLiveQuery(
    (q) => {
      if (categoryIds.length === 0) return undefined;

      return q
        .from({ product: products })
        .where(({ product }) => inArray(product.categoryId, categoryIds));
    },
    [categoryIds, products],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: products } = useProductsByCategories([1, 2, 3]);
```

## Joins and Relations

### Left Join (Optional Relation)

```typescript
import { eq } from "@tanstack/react-db";

/**
 * Load products with category and supplier relations
 */
export function useProducts() {
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
          // Handle nullable joined data
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

// Usage
const { data: products } = useProducts();
// products[0].category?.name (optional chaining for nullable relation)
```

### Inner Join (Required Relation)

```typescript
/**
 * Load batches with their products (inner join)
 */
export function useBatchesWithProducts() {
  const { batches, products } = useCollections();

  const result = useLiveQuery(
    (q) =>
      q
        .from({ batch: batches })
        .innerJoin({ product: products }, ({ batch, product }) =>
          eq(batch.productId, product.id),
        )
        .select(({ batch, product }) => ({
          ...batch,
          product: {
            id: product.id,
            name: product.name,
            sku: product.sku,
          },
        })),
    [batches, products],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: batches } = useBatchesWithProducts();
// batches[0].product.name (guaranteed to exist with inner join)
```

### Multiple Joins

```typescript
/**
 * Load batches with product, category, and supplier
 */
export function useBatchesWithFullDetails() {
  const { batches, products, categories, suppliers } = useCollections();

  const result = useLiveQuery(
    (q) =>
      q
        .from({ batch: batches })
        .leftJoin({ product: products }, ({ batch, product }) =>
          eq(batch.productId, product.id),
        )
        .leftJoin({ category: categories }, ({ product, category }) =>
          eq(product?.categoryId, category.id),
        )
        .leftJoin({ supplier: suppliers }, ({ batch, supplier }) =>
          eq(batch.supplierId, supplier.id),
        )
        .select(({ batch, product, category, supplier }) => ({
          ...batch,
          product: product
            ? {
                id: product.id,
                name: product.name,
                sku: product.sku,
                category: category
                  ? { id: category.id, name: category.name }
                  : undefined,
              }
            : undefined,
          supplier: supplier
            ? {
                id: supplier.id,
                name: supplier.name,
              }
            : undefined,
        })),
    [batches, products, categories, suppliers],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: batches } = useBatchesWithFullDetails();
```

## Date Range Filtering

### Filter by Date Range

```typescript
import { gte, lte, and } from "@tanstack/react-db";

export interface TransactionFilters {
  startDate?: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format
}

/**
 * Load transactions within date range
 *
 * CRITICAL: Convert date-only strings to full ISO timestamps
 * ISO strings can be compared lexicographically
 */
export function useTransactions(filters?: TransactionFilters) {
  const { transactions } = useCollections();

  const result = useLiveQuery(
    (q) => {
      let query = q.from({ transaction: transactions });

      if (filters?.startDate || filters?.endDate) {
        query = query.where(({ transaction }) => {
          const conditions = [];

          if (filters.startDate) {
            // Convert date-only string to full ISO timestamp
            const startDateTime = `${filters.startDate}T00:00:00.000Z`;
            conditions.push(gte(transaction.timestamp, startDateTime));
          }

          if (filters.endDate) {
            // Include entire end date
            const endDateTime = `${filters.endDate}T23:59:59.999Z`;
            conditions.push(lte(transaction.timestamp, endDateTime));
          }

          // Combine conditions with AND
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

// Usage
const { data: transactions } = useTransactions({
  startDate: "2024-01-01",
  endDate: "2024-01-31",
});
```

### Filter by Relative Date

```typescript
/**
 * Load transactions from last 7 days
 */
export function useRecentTransactions() {
  const { transactions } = useCollections();

  const result = useLiveQuery(
    (q) => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const threshold = sevenDaysAgo.toISOString();

      return q
        .from({ transaction: transactions })
        .where(({ transaction }) => gte(transaction.timestamp, threshold))
        .orderBy(({ transaction }) => transaction.timestamp, "desc");
    },
    [transactions],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: recentTransactions } = useRecentTransactions();
```

## Complex Filters

### Multiple Conditions with AND

```typescript
import { eq, gt, and } from "@tanstack/react-db";

/**
 * Load active products with low stock
 */
export function useLowStockProducts() {
  const { products } = useCollections();

  const result = useLiveQuery(
    (q) =>
      q
        .from({ product: products })
        .where(({ product }) =>
          and(
            eq(product.isActive, true),
            gt(product.reorderLevel, product.totalQuantity),
          ),
        )
        .orderBy(({ product }) => product.totalQuantity, "asc"),
    [products],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: lowStockProducts } = useLowStockProducts();
```

### Multiple Conditions with OR

```typescript
import { eq, or } from "@tanstack/react-db";

/**
 * Load products with low or out of stock status
 */
export function useProductsNeedingAttention() {
  const { products } = useCollections();

  const result = useLiveQuery(
    (q) =>
      q
        .from({ product: products })
        .where(({ product }) =>
          or(eq(product.stockStatus, "low"), eq(product.stockStatus, "out")),
        ),
    [products],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: products } = useProductsNeedingAttention();
```

### Nested Conditions

```typescript
import { eq, gt, and, or } from "@tanstack/react-db";

/**
 * Load products that are either:
 * - Active with low stock, OR
 * - Inactive with any stock
 */
export function useProductsForReview() {
  const { products } = useCollections();

  const result = useLiveQuery(
    (q) =>
      q
        .from({ product: products })
        .where(({ product }) =>
          or(
            and(
              eq(product.isActive, true),
              gt(product.reorderLevel, product.totalQuantity),
            ),
            and(eq(product.isActive, false), gt(product.totalQuantity, 0)),
          ),
        ),
    [products],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: products } = useProductsForReview();
```

### Dynamic Filters

```typescript
export interface ProductFilters {
  categoryId?: number;
  search?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Load products with dynamic filters
 */
export function useProductsFiltered(filters: ProductFilters) {
  const { products } = useCollections();

  const result = useLiveQuery(
    (q) => {
      let query = q.from({ product: products });

      // Apply filters conditionally
      if (filters.categoryId !== undefined) {
        query = query.where(({ product }) =>
          eq(product.categoryId, filters.categoryId!),
        );
      }

      if (filters.search && filters.search.length >= 2) {
        query = query.where(({ product }) =>
          like(product.name, `%${filters.search}%`),
        );
      }

      if (filters.isActive !== undefined) {
        query = query.where(({ product }) =>
          eq(product.isActive, filters.isActive!),
        );
      }

      if (filters.minPrice !== undefined) {
        query = query.where(({ product }) =>
          gte(product.basePrice, filters.minPrice!),
        );
      }

      if (filters.maxPrice !== undefined) {
        query = query.where(({ product }) =>
          lte(product.basePrice, filters.maxPrice!),
        );
      }

      return query;
    },
    [
      filters.categoryId,
      filters.search,
      filters.isActive,
      filters.minPrice,
      filters.maxPrice,
      products,
    ],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: products } = useProductsFiltered({
  categoryId: 1,
  search: "amox",
  isActive: true,
  minPrice: 10,
  maxPrice: 50,
});
```

## Aggregations

### Count Records

```typescript
import { count } from "@tanstack/react-db";

/**
 * Count products by category
 */
export function useProductCountByCategory() {
  const { products } = useCollections();

  const result = useLiveQuery(
    (q) =>
      q
        .from({ product: products })
        .groupBy(({ product }) => product.categoryId)
        .select(({ product }) => ({
          categoryId: product.categoryId,
          count: count(product.id),
        })),
    [products],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: counts } = useProductCountByCategory();
// [{ categoryId: 1, count: 50 }, { categoryId: 2, count: 30 }, ...]
```

### Sum Values

```typescript
import { sum } from "@tanstack/react-db";

/**
 * Calculate total stock by category
 */
export function useTotalStockByCategory() {
  const { products } = useCollections();

  const result = useLiveQuery(
    (q) =>
      q
        .from({ product: products })
        .groupBy(({ product }) => product.categoryId)
        .select(({ product }) => ({
          categoryId: product.categoryId,
          totalStock: sum(product.totalQuantity),
        })),
    [products],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: totals } = useTotalStockByCategory();
```

### Average Values

```typescript
import { avg } from "@tanstack/react-db";

/**
 * Calculate average price by category
 */
export function useAveragePriceByCategory() {
  const { products } = useCollections();

  const result = useLiveQuery(
    (q) =>
      q
        .from({ product: products })
        .groupBy(({ product }) => product.categoryId)
        .select(({ product }) => ({
          categoryId: product.categoryId,
          avgPrice: avg(product.basePrice),
        })),
    [products],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: averages } = useAveragePriceByCategory();
```

### Multiple Aggregations

```typescript
import { count, sum, avg, min, max } from "@tanstack/react-db";

/**
 * Get comprehensive stats by category
 */
export function useProductStatsByCategory() {
  const { products } = useCollections();

  const result = useLiveQuery(
    (q) =>
      q
        .from({ product: products })
        .groupBy(({ product }) => product.categoryId)
        .select(({ product }) => ({
          categoryId: product.categoryId,
          productCount: count(product.id),
          totalStock: sum(product.totalQuantity),
          avgPrice: avg(product.basePrice),
          minPrice: min(product.basePrice),
          maxPrice: max(product.basePrice),
        })),
    [products],
  );

  return wrapLiveQuery(result);
}

// Usage
const { data: stats } = useProductStatsByCategory();
```

## Performance Optimization Tips

### Tip 1: Always Use Limits for Large Datasets

```typescript
// ❌ BAD: Unlimited query
const products = useLiveQuery((q) => q.from({ product: products }));

// ✅ GOOD: Limited query
const products = useLiveQuery(
  (q) => q.from({ product: products }).limit(50), // Caps memory usage
);
```

### Tip 2: Use Indexes for Filtered Columns

```sql
-- Add indexes for frequently filtered columns
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp);
```

### Tip 3: Select Only Needed Fields in Joins

```typescript
// ❌ BAD: Selecting all fields
.select(({ product, category }) => ({
  ...product,
  category: category ? { ...category } : undefined,
}))

// ✅ GOOD: Selecting only needed fields
.select(({ product, category }) => ({
  ...product,
  category: category
    ? {
        id: category.id,
        name: category.name,
      }
    : undefined,
}))
```

### Tip 4: Use On-Demand Mode for Large Datasets

```typescript
// For datasets >50K records
export function createProductCollection(queryClient: QueryClient) {
  return createCollection(
    queryCollectionOptions({
      // ...
      syncMode: "on-demand", // ← Enables predicate push-down
    }),
  );
}
```

### Tip 5: Memoize Filter Values

```typescript
// ❌ BAD: Creating new object on every render
const filters = { categoryId: 1, search: "amox" };
const { data } = useProductsFiltered(filters);

// ✅ GOOD: Memoized filter object
const filters = useMemo(
  () => ({ categoryId: 1, search: "amox" }),
  [], // Only create once
);
const { data } = useProductsFiltered(filters);
```

### Tip 6: Disable Queries When Not Needed

```typescript
// ✅ GOOD: Disable query when ID is missing
const result = useLiveQuery(
  (q) => {
    if (!id) return undefined; // Disables query

    return q
      .from({ product: products })
      .where(({ product }) => eq(product.id, id));
  },
  [id, products],
);
```

## Operator Reference

### Comparison Operators

```typescript
import { eq, gt, gte, lt, lte, like, ilike, inArray } from "@tanstack/react-db";

// Equality
eq(product.id, 1);
eq(product.isActive, true);

// Comparisons
gt(product.quantity, 0); // greater than
gte(product.quantity, 10); // greater than or equal
lt(product.price, 100); // less than
lte(product.price, 50); // less than or equal

// String matching
like(product.name, "Amox%"); // case-sensitive
ilike(product.name, "amox%"); // case-insensitive

// Array membership
inArray(product.categoryId, [1, 2, 3]);
```

### Logical Operators

```typescript
import { and, or, not } from "@tanstack/react-db";

// AND: All conditions must be true
and(eq(product.isActive, true), gt(product.quantity, 0));

// OR: At least one condition must be true
or(eq(product.status, "low"), eq(product.status, "out"));

// NOT: Negate a condition
not(eq(product.isActive, false));
```

### Aggregate Functions

```typescript
import { count, sum, avg, min, max } from "@tanstack/react-db";

count(product.id); // Count rows
sum(product.totalQuantity); // Sum values
avg(product.basePrice); // Average
min(product.reorderLevel); // Minimum
max(product.basePrice); // Maximum
```

## Real-World Examples

See these files for complete, working examples:

- **Simple queries**: `apps/web/src/features/modules/inventory/hooks/use-categories.ts`
- **Filtered queries**: `apps/web/src/features/modules/inventory/hooks/use-batches.ts`
- **Joins**: `apps/web/src/features/modules/inventory/hooks/use-products.ts`
- **Date filtering**: `apps/web/src/features/modules/inventory/hooks/use-transactions.ts`
- **Tests**: `apps/web/src/features/modules/inventory/hooks/__tests__/`

## See Also

- [TanStack DB Migration Guide](./tanstack-db-migration.md)
- [Hook Abstraction Pattern Guide](./hook-abstraction-pattern.md)
- [On-Demand Mode Usage Guide](./on-demand-mode.md)
- [Coding Guidelines - TanStack DB Section](./CODING_GUIDELINES.md#tanstack-db-patterns)
