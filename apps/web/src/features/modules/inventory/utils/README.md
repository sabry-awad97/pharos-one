# Mock Data Generators

High-performance mock data generators for TanStack DB migration testing.

## Overview

These generators create realistic data matching Zod schemas with minimal overhead. Performance target: **<10ms per 1000 records**.

## Usage

### Basic Generation

```typescript
import {
  generateCategory,
  generateSupplier,
  generateProduct,
  generateBatch,
} from "./generators";

// Generate single records
const category = generateCategory(1);
const supplier = generateSupplier(1);
const product = generateProduct(1);
const batch = generateBatch(1, 1); // batchId, productId
```

### Bulk Generation

```typescript
// Generate 1000 categories
const categories = Array.from({ length: 1000 }, (_, i) =>
  generateCategory(i + 1),
);

// Generate 10K products
const products = Array.from({ length: 10_000 }, (_, i) =>
  generateProduct(i + 1),
);
```

### Performance Characteristics

- **Single record**: <0.01ms
- **1,000 records**: <10ms
- **10,000 records**: <100ms
- **100,000 records**: <1s
- **1,000,000 records**: <10s

## Generator Functions

### `generateCategory(id: number): Category`

Generates a category with deterministic data.

```typescript
const category = generateCategory(1);
// {
//   id: 1,
//   name: "Antibiotic",
//   description: "Antibacterial medications",
//   parentCategoryId: null
// }
```

### `generateSupplier(id: number): Supplier`

Generates a supplier with contact information.

```typescript
const supplier = generateSupplier(1);
// {
//   id: 1,
//   name: "MedSupply Co",
//   contactPerson: "John Smith",
//   email: "contact1@medsupplyco.com",
//   phone: "+1-555-0001",
//   address: null,
//   isActive: true
// }
```

### `generateProduct(id: number): Product`

Generates a product with pricing and inventory settings.

```typescript
const product = generateProduct(1);
// {
//   id: 1,
//   name: "Amoxicillin 500mg",
//   sku: "SKU-00001",
//   genericName: "Amoxicillin",
//   manufacturer: "PharmaCorp",
//   categoryId: 1,
//   defaultSupplierId: 1,
//   basePrice: 5,
//   reorderLevel: 30,
//   requiresPrescription: false,
//   controlledSubstance: false,
//   description: "Description for Amoxicillin 500mg",
//   isActive: true
// }
```

### `generateBatch(id: number, productId: number): Batch`

Generates a batch with expiry and quantity tracking.

```typescript
const batch = generateBatch(1, 1);
// {
//   id: 1,
//   productId: 1,
//   batchNumber: "BATCH-000001",
//   expiryDate: "2026-01-15",
//   supplierId: 1,
//   purchaseOrderId: null,
//   receivedDate: "2025-01-15",
//   costPerUnit: 3,
//   quantityReceived: 100,
//   quantityRemaining: 50,
//   locationId: 1,
//   status: "available",
//   notes: null,
//   createdAt: "2025-01-15T00:00:00.000Z",
//   updatedAt: "2025-01-15T12:00:00.000Z"
// }
```

## Design Decisions

### Why Simple Templates?

We use simple template-based generation instead of Faker.js for maximum performance:

- **Faker.js**: ~1-5ms per record (too slow for 1M records)
- **Templates**: <0.01ms per record (fast enough for 1M records)

### Deterministic Data

All generators produce deterministic data based on ID:

- Same ID always produces same data
- Enables reproducible tests
- Simplifies debugging

### Cyclic Templates

Templates cycle using modulo operator:

```typescript
const index = (id - 1) % templates.length;
```

This ensures variety without complexity.

## Testing

Run generator tests:

```bash
npm test -- generators.test
```

Expected output:

```
✓ creates valid category matching schema
✓ creates 1000 records under 10ms
✓ creates valid supplier matching schema
✓ creates 1000 suppliers under 10ms
✓ creates valid product matching schema
✓ creates 1000 products under 10ms
✓ creates valid batch matching schema
✓ creates 1000 batches under 10ms
```

## See Also

- [Test Utilities](../test/README.md) - Large dataset generation
- [Collection Factory](../db/README.md) - TanStack DB collections
- [Hook Wrapper](../hooks/utils/README.md) - Backward-compatible hooks
