/**
 * Tests for mock data generators
 * Following TDD approach - tests written first, implementation follows
 */

import { describe, it, expect } from "vitest";
import {
  generateCategory,
  generateSupplier,
  generateProduct,
  generateBatch,
} from "../generators";
import {
  categorySchema,
  supplierSchema,
  productSchema,
  batchSchema,
} from "../../schema";

describe("Mock Data Generators", () => {
  describe("generateCategory", () => {
    // Test 1 (Tracer Bullet): Generator creates single valid category
    it("creates valid category matching schema", () => {
      const category = generateCategory(1);

      // Should not throw validation error
      expect(() => categorySchema.parse(category)).not.toThrow();

      // Should have correct ID
      expect(category.id).toBe(1);

      // Should have required fields
      expect(category.name).toBeDefined();
      expect(typeof category.name).toBe("string");
      expect(category.name.length).toBeGreaterThan(0);
    });

    // Test 2: Generator creates 1000 records under 10ms
    it("creates 1000 records under 10ms", () => {
      const start = performance.now();
      const categories = Array.from({ length: 1000 }, (_, i) =>
        generateCategory(i + 1),
      );
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(10);
      expect(categories).toHaveLength(1000);

      // Verify all are valid
      categories.forEach((cat) => {
        expect(() => categorySchema.parse(cat)).not.toThrow();
      });
    });
  });

  describe("generateSupplier", () => {
    it("creates valid supplier matching schema", () => {
      const supplier = generateSupplier(1);

      expect(() => supplierSchema.parse(supplier)).not.toThrow();
      expect(supplier.id).toBe(1);
      expect(supplier.name).toBeDefined();
      expect(supplier.isActive).toBe(true);
    });

    it("creates 1000 suppliers under 10ms", () => {
      const start = performance.now();
      const suppliers = Array.from({ length: 1000 }, (_, i) =>
        generateSupplier(i + 1),
      );
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(10);
      expect(suppliers).toHaveLength(1000);
    });
  });

  describe("generateProduct", () => {
    it("creates valid product matching schema", () => {
      const product = generateProduct(1);

      expect(() => productSchema.parse(product)).not.toThrow();
      expect(product.id).toBe(1);
      expect(product.sku).toBeDefined();
      expect(product.basePrice).toBeGreaterThan(0);
    });

    it("creates 1000 products under 10ms", () => {
      const start = performance.now();
      const products = Array.from({ length: 1000 }, (_, i) =>
        generateProduct(i + 1),
      );
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(10);
      expect(products).toHaveLength(1000);
    });
  });

  describe("generateBatch", () => {
    it("creates valid batch matching schema", () => {
      const batch = generateBatch(1, 1); // batchId, productId

      expect(() => batchSchema.parse(batch)).not.toThrow();
      expect(batch.id).toBe(1);
      expect(batch.productId).toBe(1);
      expect(batch.status).toBe("available");
    });

    it("creates 1000 batches under 10ms", () => {
      const start = performance.now();
      const batches = Array.from({ length: 1000 }, (_, i) =>
        generateBatch(i + 1, (i % 100) + 1),
      );
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(10);
      expect(batches).toHaveLength(1000);
    });
  });
});
