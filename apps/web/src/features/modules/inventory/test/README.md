# Test Utilities

Utilities for generating and validating large datasets for TanStack DB migration testing.

## Overview

These utilities help test performance and memory usage with realistic datasets of varying sizes:

- **Small**: 10,000 records
- **Medium**: 100,000 records
- **Large**: 1,000,000 records

## Usage

### Generate Test Dataset

```typescript
import { generateTestDataset, DatasetSize } from "./test-utils";

// Generate 10K dataset
const smallDataset = generateTestDataset(DatasetSize.SMALL);

// Generate 100K dataset
const mediumDataset = generateTestDataset(DatasetSize.MEDIUM);

// Generate 1M dataset
const largeDataset = generateTestDataset(DatasetSize.LARGE);
```

### Dataset Structure

```typescript
interface TestDataset {
  categories: Category[];
  suppliers: Supplier[];
  products: Product[];
  batches: Batch[];
}
```

Each dataset contains equal numbers of all entity types.

### Measure Memory Usage

```typescript
import { measureDatasetMemory } from "./test-utils";

const dataset = generateTestDataset(DatasetSize.SMALL);
const memoryMB = measureDatasetMemory(dataset);

console.log(`Dataset uses ${memoryMB.toFixed(2)} MB`);
```

### Validate Dataset Integrity

```typescript
import { validateDataset } from "./test-utils";

const dataset = generateTestDataset(DatasetSize.SMALL);
const isValid = validateDataset(dataset);

if (!isValid) {
  throw new Error("Dataset integrity check failed");
}
```

## Performance Benchmarks

### Generation Time

| Dataset Size | Records | Time   | Records/sec |
| ------------ | ------- | ------ | ----------- |
| Small        | 10K     | <100ms | 100K/sec    |
| Medium       | 100K    | <1s    | 100K/sec    |
| Large        | 1M      | <10s   | 100K/sec    |

### Memory Usage (Approximate)

| Dataset Size | Records | Memory  |
| ------------ | ------- | ------- |
| Small        | 10K     | ~5 MB   |
| Medium       | 100K    | ~50 MB  |
| Large        | 1M      | ~500 MB |

## Example: Performance Test

```typescript
import { generateTestDataset, DatasetSize } from "./test-utils";
import {
  createCollectionsFromDataset,
  CollectionMode,
} from "../db/collection-factory";

// Generate 1M dataset
console.time("Generate 1M records");
const dataset = generateTestDataset(DatasetSize.LARGE);
console.timeEnd("Generate 1M records");
// Expected: ~7 seconds

// Create eager collections
console.time("Create eager collections");
const collections = createCollectionsFromDataset(dataset, CollectionMode.EAGER);
console.timeEnd("Create eager collections");
// Expected: <1 second

// Query performance
const productsCollection = collections.get("products");
console.time("Query 1000 products");
for (let i = 1; i <= 1000; i++) {
  productsCollection!.getById(i);
}
console.timeEnd("Query 1000 products");
// Expected: <10ms
```

## Example: Memory Test

```typescript
import {
  generateTestDataset,
  DatasetSize,
  measureDatasetMemory,
} from "./test-utils";

// Test memory usage across dataset sizes
const sizes = [DatasetSize.SMALL, DatasetSize.MEDIUM, DatasetSize.LARGE];

for (const size of sizes) {
  const dataset = generateTestDataset(size);
  const memoryMB = measureDatasetMemory(dataset);

  console.log(`${size}: ${memoryMB.toFixed(2)} MB`);
}
```

## Example: Integrity Test

```typescript
import {
  generateTestDataset,
  DatasetSize,
  validateDataset,
} from "./test-utils";

// Validate dataset integrity
const dataset = generateTestDataset(DatasetSize.SMALL);

if (!validateDataset(dataset)) {
  throw new Error("Dataset validation failed");
}

// Check referential integrity
const product = dataset.products[0];
const batch = dataset.batches.find((b) => b.productId === product.id);

console.log(`Product ${product.id} has batch ${batch?.id}`);
```

## Testing

Run test utility tests:

```bash
npm test -- test-utils.test
```

Expected output:

```
✓ generates 10K dataset
✓ generates 100K dataset
✓ generates 1M dataset
✓ generates 1M dataset in under 10 seconds
```

## API Reference

### `DatasetSize` Enum

```typescript
enum DatasetSize {
  SMALL = 10_000,
  MEDIUM = 100_000,
  LARGE = 1_000_000,
}
```

### `generateTestDataset(size: DatasetSize): TestDataset`

Generates a complete test dataset with all entity types.

**Parameters:**

- `size` - Dataset size (SMALL, MEDIUM, or LARGE)

**Returns:**

- `TestDataset` - Object containing arrays of all entity types

### `measureDatasetMemory(dataset: TestDataset): number`

Measures approximate memory usage of a dataset.

**Parameters:**

- `dataset` - Dataset to measure

**Returns:**

- `number` - Memory usage in megabytes (MB)

### `validateDataset(dataset: TestDataset): boolean`

Validates dataset integrity (equal lengths, sequential IDs).

**Parameters:**

- `dataset` - Dataset to validate

**Returns:**

- `boolean` - True if valid, false otherwise

## See Also

- [Mock Generators](../utils/README.md) - Individual record generators
- [Collection Factory](../db/README.md) - TanStack DB collections
- [Integration Tests](../test/__tests__/integration.test.ts) - Full integration examples
