/**
 * Tests for test utilities
 * Validates ability to generate large datasets for testing
 */

import { describe, it, expect } from "vitest";
import { generateTestDataset, DatasetSize } from "../test-utils";

describe("Test Utilities", () => {
  describe("generateTestDataset", () => {
    it("generates 10K dataset", () => {
      const dataset = generateTestDataset(DatasetSize.SMALL);

      expect(dataset.categories.length).toBe(10_000);
      expect(dataset.suppliers.length).toBe(10_000);
      expect(dataset.products.length).toBe(10_000);
      expect(dataset.batches.length).toBe(10_000);
    });

    it("generates 100K dataset", () => {
      const dataset = generateTestDataset(DatasetSize.MEDIUM);

      expect(dataset.categories.length).toBe(100_000);
      expect(dataset.suppliers.length).toBe(100_000);
      expect(dataset.products.length).toBe(100_000);
      expect(dataset.batches.length).toBe(100_000);
    });

    it("generates 1M dataset", () => {
      const dataset = generateTestDataset(DatasetSize.LARGE);

      expect(dataset.categories.length).toBe(1_000_000);
      expect(dataset.suppliers.length).toBe(1_000_000);
      expect(dataset.products.length).toBe(1_000_000);
      expect(dataset.batches.length).toBe(1_000_000);
    });

    it("generates 1M dataset in under 10 seconds", () => {
      const start = performance.now();
      const dataset = generateTestDataset(DatasetSize.LARGE);
      const duration = performance.now() - start;

      // Should generate 1M records in under 10 seconds
      expect(duration).toBeLessThan(10_000);
      expect(dataset.products.length).toBe(1_000_000);
    });
  });
});
