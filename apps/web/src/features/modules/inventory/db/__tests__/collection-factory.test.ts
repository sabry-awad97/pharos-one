/**
 * Tests for collection factory pattern
 * Validates creation of TanStack DB collections in eager and on-demand modes
 */

import { describe, it, expect } from "vitest";
import {
  createCollection,
  CollectionMode,
  type CollectionConfig,
} from "../collection-factory";

describe("Collection Factory", () => {
  describe("createCollection", () => {
    it("creates eager mode collection", () => {
      const config: CollectionConfig<{ id: number; name: string }> = {
        name: "test-eager",
        mode: CollectionMode.EAGER,
        initialData: [
          { id: 1, name: "Item 1" },
          { id: 2, name: "Item 2" },
        ],
      };

      const collection = createCollection(config);

      expect(collection).toBeDefined();
      expect(collection.name).toBe("test-eager");
      expect(collection.mode).toBe(CollectionMode.EAGER);
      expect(collection.getData()).toHaveLength(2);
    });

    it("creates on-demand mode collection", () => {
      const config: CollectionConfig<{ id: number; name: string }> = {
        name: "test-on-demand",
        mode: CollectionMode.ON_DEMAND,
        generator: (id: number) => ({ id, name: `Item ${id}` }),
      };

      const collection = createCollection(config);

      expect(collection).toBeDefined();
      expect(collection.name).toBe("test-on-demand");
      expect(collection.mode).toBe(CollectionMode.ON_DEMAND);
      expect(collection.getData()).toHaveLength(0); // No data until requested
    });

    it("eager mode collection returns all data immediately", () => {
      const data = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
      }));

      const config: CollectionConfig<{ id: number; name: string }> = {
        name: "test-eager-100",
        mode: CollectionMode.EAGER,
        initialData: data,
      };

      const collection = createCollection(config);
      const result = collection.getData();

      expect(result).toHaveLength(100);
      expect(result[0]).toEqual({ id: 1, name: "Item 1" });
      expect(result[99]).toEqual({ id: 100, name: "Item 100" });
    });

    it("on-demand mode collection generates data when requested", () => {
      const config: CollectionConfig<{ id: number; name: string }> = {
        name: "test-on-demand-gen",
        mode: CollectionMode.ON_DEMAND,
        generator: (id: number) => ({ id, name: `Generated ${id}` }),
      };

      const collection = createCollection(config);

      // Request specific items
      const item1 = collection.getById(1);
      const item2 = collection.getById(2);

      expect(item1).toEqual({ id: 1, name: "Generated 1" });
      expect(item2).toEqual({ id: 2, name: "Generated 2" });
    });
  });
});
