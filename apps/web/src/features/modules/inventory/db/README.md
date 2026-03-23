# Collection Factory

Factory pattern for creating TanStack DB collections with flexible loading strategies.

## Overview

The collection factory supports two loading modes:

- **Eager**: Pre-load all data into memory (good for small datasets)
- **On-demand**: Generate data lazily as requested (good for large datasets)

## Usage

### Create Eager Collection

```typescript
import { createCollection, CollectionMode } from "./collection-factory";

const categories = createCollection({
  name: "categories",
  mode: CollectionMode.EAGER,
  initialData: [
    {
      id: 1,
      name: "Category 1",
      description: "First category",
      parentCategoryId: null,
    },
    {
      id: 2,
      name: "Category 2",
      description: "Second category",
      parentCategoryId: null,
    },
  ],
});

// All data loaded immediately
console.log(categories.getData().length); // 2
```

### Create On-Demand Collection

```typescript
import { createCollection, CollectionMode } from "./collection-factory";
import { generateProduct } from "../utils/generators";

const products = createCollection({
  name: "products",
  mode: CollectionMode.ON_DEMAND,
  generator: (id) => generateProduct(id),
});

// No data loaded initially
console.log(products.getData().length); // 0

// Generate on first access
const product1 = products.getById(1);
console.log(products.getData().length); // 1

// Cached on subsequent access
const product1Again = products.getById(1); // Same object
```

### Create Collections from Dataset

```typescript
import {
  createCollectionsFromDataset,
  CollectionMode,
} from "./collection-factory";
import { generateTestDataset, DatasetSize } from "../test/test-utils";

// Generate test dataset
const dataset = generateTestDataset(DatasetSize.SMALL);

// Create all collections at once
const collections = createCollectionsFromDataset(dataset, CollectionMode.EAGER);

// Access individual collections
const categories = collections.get("categories");
const suppliers = collections.get("suppliers");
const products = collections.get("products");
const batches = collections.get("batches");
```

## Collection Interface

```typescript
interface Collection<TData> {
  /** Collection name */
  name: string;

  /** Loading mode */
  mode: CollectionMode;

  /** Get all data (eager) or cached data (on-demand) */
  getData: () => TData[];

  /** Get item by ID (generates if needed in on-demand mode) */
  getById: (id: number) => TData | undefined;

  /** Add item to collection */
  add: (item: TData) => void;

  /** Clear all data */
  clear: () => void;
}
```

## Examples

### Example 1: Small Dataset (Eager Mode)

```typescript
import { createCollection, CollectionMode } from "./collection-factory";

// Pre-load small dataset
const categories = createCollection({
  name: "categories",
  mode: CollectionMode.EAGER,
  initialData: Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Category ${i + 1}`,
    description: null,
    parentCategoryId: null,
  })),
});

// Fast queries - all data in memory
const cat1 = categories.getById(1);
const cat50 = categories.getById(50);
const all = categories.getData(); // 100 items
```

### Example 2: Large Dataset (On-Demand Mode)

```typescript
import { createCollection, CollectionMode } from "./collection-factory";
import { generateProduct } from "../utils/generators";

// Lazy loading for 1M products
const products = createCollection({
  name: "products",
  mode: CollectionMode.ON_DEMAND,
  generator: (id) => generateProduct(id),
});

// Only generate what you need
const product1 = products.getById(1);
const product1000 = products.getById(1000);

// Only 2 items cached
console.log(products.getData().length); // 2
```

### Example 3: Mixed Strategy

```typescript
import { createCollection, CollectionMode } from "./collection-factory";
import { generateCategory, generateProduct } from "../utils/generators";

// Small reference data - eager
const categories = createCollection({
  name: "categories",
  mode: CollectionMode.EAGER,
  initialData: Array.from({ length: 20 }, (_, i) => generateCategory(i + 1)),
});

// Large transactional data - on-demand
const products = createCollection({
  name: "products",
  mode: CollectionMode.ON_DEMAND,
  generator: (id) => generateProduct(id),
});

// Efficient memory usage
console.log(categories.getData().length); // 20 (all loaded)
console.log(products.getData().length); // 0 (none loaded yet)
```

### Example 4: Adding Data Dynamically

```typescript
import { createCollection, CollectionMode } from "./collection-factory";

const products = createCollection({
  name: "products",
  mode: CollectionMode.EAGER,
  initialData: [],
});

// Add items dynamically
products.add({
  id: 1,
  name: "New Product",
  sku: "SKU-001",
  // ... other fields
});

products.add({
  id: 2,
  name: "Another Product",
  sku: "SKU-002",
  // ... other fields
});

console.log(products.getData().length); // 2
```

## Performance Characteristics

### Eager Mode

| Operation | Time Complexity | Notes                  |
| --------- | --------------- | ---------------------- |
| Create    | O(n)            | Loads all data upfront |
| getById   | O(1)            | Map lookup             |
| getData   | O(n)            | Returns all data       |
| add       | O(1)            | Map insertion          |

**Best for:**

- Small datasets (<10K records)
- Reference data (categories, suppliers)
- Data that's frequently accessed

### On-Demand Mode

| Operation | Time Complexity | Notes                     |
| --------- | --------------- | ------------------------- |
| Create    | O(1)            | No data loaded            |
| getById   | O(1)            | Generate + cache on miss  |
| getData   | O(k)            | Returns cached items only |
| add       | O(1)            | Map insertion             |

**Best for:**

- Large datasets (>100K records)
- Transactional data (products, batches)
- Data that's accessed sparsely

## Memory Usage

### Eager Mode

```typescript
// 10K records ≈ 5 MB
const small = createCollection({
  name: "products",
  mode: CollectionMode.EAGER,
  initialData: Array.from({ length: 10_000 }, (_, i) => generateProduct(i + 1)),
});

// 100K records ≈ 50 MB
const medium = createCollection({
  name: "products",
  mode: CollectionMode.EAGER,
  initialData: Array.from({ length: 100_000 }, (_, i) =>
    generateProduct(i + 1),
  ),
});
```

### On-Demand Mode

```typescript
// Starts at 0 MB
const products = createCollection({
  name: "products",
  mode: CollectionMode.ON_DEMAND,
  generator: (id) => generateProduct(id),
});

// Grows as items are accessed
products.getById(1); // +0.0005 MB
products.getById(2); // +0.0005 MB
// ... only cached items use memory
```

## Testing

Run collection factory tests:

```bash
npm test -- collection-factory.test
```

Expected output:

```
✓ creates eager mode collection
✓ creates on-demand mode collection
✓ eager mode collection returns all data immediately
✓ on-demand mode collection generates data when requested
```

## Design Decisions

### Why Two Modes?

Different data access patterns require different strategies:

- **Eager**: Fast queries, higher memory (good for small, frequently-accessed data)
- **On-demand**: Lower memory, lazy generation (good for large, sparsely-accessed data)

### Why Map-Based Storage?

Using `Map<number, TData>` provides:

- O(1) lookups by ID
- Efficient memory usage
- Easy cache management

### Why Generator Functions?

Generator functions enable:

- Deterministic data generation
- Lazy evaluation
- Minimal memory overhead

## See Also

- [Mock Generators](../utils/README.md) - Data generation functions
- [Test Utilities](../test/README.md) - Large dataset generation
- [Hook Wrapper](../hooks/utils/README.md) - Backward-compatible hooks
