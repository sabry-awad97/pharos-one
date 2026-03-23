/**
 * Test utilities for generating large datasets
 * Used for performance testing and TanStack DB migration validation
 */

import {
  generateCategory,
  generateSupplier,
  generateProduct,
  generateBatch,
} from "../utils/generators";
import type { Category, Supplier, Product, Batch } from "../schema";

/**
 * Standard dataset sizes for testing
 */
export enum DatasetSize {
  SMALL = 10_000, // 10K records
  MEDIUM = 100_000, // 100K records
  LARGE = 1_000_000, // 1M records
}

/**
 * Test dataset containing all entity types
 */
export interface TestDataset {
  categories: Category[];
  suppliers: Supplier[];
  products: Product[];
  batches: Batch[];
}

/**
 * Generate a complete test dataset of specified size
 * @param size - Number of records to generate for each entity type
 * @returns Complete dataset with all entity types
 */
export function generateTestDataset(size: DatasetSize): TestDataset {
  const count = size as number;

  // Generate all entities
  const categories = Array.from({ length: count }, (_, i) =>
    generateCategory(i + 1),
  );

  const suppliers = Array.from({ length: count }, (_, i) =>
    generateSupplier(i + 1),
  );

  const products = Array.from({ length: count }, (_, i) =>
    generateProduct(i + 1),
  );

  const batches = Array.from({ length: count }, (_, i) =>
    generateBatch(i + 1, (i % count) + 1),
  );

  return {
    categories,
    suppliers,
    products,
    batches,
  };
}

/**
 * Measure memory usage of a dataset
 * @param dataset - Dataset to measure
 * @returns Approximate memory usage in MB
 */
export function measureDatasetMemory(dataset: TestDataset): number {
  // Rough estimate: JSON.stringify size / 1MB
  const json = JSON.stringify(dataset);
  return json.length / (1024 * 1024);
}

/**
 * Validate dataset integrity
 * @param dataset - Dataset to validate
 * @returns True if all records are valid
 */
export function validateDataset(dataset: TestDataset): boolean {
  // Check all arrays have same length
  const { categories, suppliers, products, batches } = dataset;
  const length = categories.length;

  if (
    suppliers.length !== length ||
    products.length !== length ||
    batches.length !== length
  ) {
    return false;
  }

  // Check all IDs are sequential
  for (let i = 0; i < length; i++) {
    const expectedId = i + 1;
    if (
      categories[i].id !== expectedId ||
      suppliers[i].id !== expectedId ||
      products[i].id !== expectedId ||
      batches[i].id !== expectedId
    ) {
      return false;
    }
  }

  return true;
}
