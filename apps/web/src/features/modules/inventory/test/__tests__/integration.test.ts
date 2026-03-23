/**
 * Integration tests for TanStack DB migration infrastructure
 * Validates performance and memory usage with large datasets
 */

import { describe, it, expect } from "vitest";
import { generateTestDataset, DatasetSize } from "../test-utils";
import {
  createCollection,
  createCollectionsFromDataset,
  CollectionMode,
} from "../../db/collection-factory";
import { generateProduct } from "../../utils/generators";

describe("Integration Tests", () => {
  describe("Performance", () => {
    it("generates 10K dataset in under 1 second", () => {
      const start = performance.now();
      const dataset = generateTestDataset(DatasetSize.SMALL);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(1000);
      expect(dataset.products.length).toBe(10_000);
    });

    it("generates 100K dataset in under 5 seconds", () => {
      const start = performance.now();
      const dataset = generateTestDataset(DatasetSize.MEDIUM);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(5000);
      expect(dataset.products.length).toBe(100_000);
    });

    it("creates eager collections from 10K dataset quickly", () => {
      const dataset = generateTestDataset(DatasetSize.SMALL);

      const start = performance.now();
      const collections = createCollectionsFromDataset(
        dataset,
        CollectionMode.EAGER,
      );
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(1000);
      expect(collections.size).toBe(4); // categories, suppliers, products, batches
    });

    it("on-demand collection generates items efficiently", () => {
      const collection = createCollection({
        name: "products-on-demand",
        mode: CollectionMode.ON_DEMAND,
        generator: (id) => generateProduct(id),
      });

      // Generate 1000 items
      const start = performance.now();
      for (let i = 1; i <= 1000; i++) {
        collection.getById(i);
      }
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100); // Should be very fast
      expect(collection.getData().length).toBe(1000);
    });
  });

  describe("Memory Usage", () => {
    it("eager mode loads all data into memory", () => {
      const dataset = generateTestDataset(DatasetSize.SMALL);
      const collections = createCollectionsFromDataset(
        dataset,
        CollectionMode.EAGER,
      );

      const productsCollection = collections.get("products");
      expect(productsCollection).toBeDefined();
      expect(productsCollection!.getData().length).toBe(10_000);
    });

    it("on-demand mode starts with empty cache", () => {
      const collection = createCollection({
        name: "products-lazy",
        mode: CollectionMode.ON_DEMAND,
        generator: (id) => generateProduct(id),
      });

      // Initially empty
      expect(collection.getData().length).toBe(0);

      // Generate some items
      collection.getById(1);
      collection.getById(2);
      collection.getById(3);

      // Only cached items
      expect(collection.getData().length).toBe(3);
    });
  });

  describe("Data Integrity", () => {
    it("eager collection returns consistent data", () => {
      const dataset = generateTestDataset(DatasetSize.SMALL);
      const collections = createCollectionsFromDataset(
        dataset,
        CollectionMode.EAGER,
      );

      const productsCollection = collections.get("products");
      const product1 = productsCollection!.getById(1);
      const product2 = productsCollection!.getById(1); // Same ID

      expect(product1).toEqual(product2); // Should be same object
    });

    it("on-demand collection generates consistent data", () => {
      const collection = createCollection({
        name: "products-consistent",
        mode: CollectionMode.ON_DEMAND,
        generator: (id) => generateProduct(id),
      });

      const product1 = collection.getById(1);
      const product2 = collection.getById(1); // Same ID

      expect(product1).toEqual(product2); // Should be same object
      expect(product1?.id).toBe(1);
    });

    it("collections maintain referential integrity", () => {
      const dataset = generateTestDataset(DatasetSize.SMALL);
      const collections = createCollectionsFromDataset(
        dataset,
        CollectionMode.EAGER,
      );

      const productsCollection = collections.get("products");
      const batchesCollection = collections.get("batches");

      const product = productsCollection!.getById(1);
      const batch = batchesCollection!.getById(1);

      expect(product).toBeDefined();
      expect(batch).toBeDefined();
      expect((batch as any).productId).toBe(product!.id);
    });
  });
});
