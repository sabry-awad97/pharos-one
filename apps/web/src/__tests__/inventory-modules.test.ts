import { describe, it, expect, beforeEach } from "vitest";
import { getModule } from "@/features/modules/registry";

describe("Inventory Module Registration", () => {
  it("should register inventory-all module", async () => {
    // Import the inventory module to trigger registration
    await import("@/features/modules/inventory");

    const module = getModule("inventory-all");

    expect(module).toBeDefined();
    expect(module?.id).toBe("inventory-all");
    expect(module?.label).toBe("Inventory - All Products");
  });

  it("should register inventory-low-stock module", async () => {
    await import("@/features/modules/inventory");

    const module = getModule("inventory-low-stock");

    expect(module).toBeDefined();
    expect(module?.id).toBe("inventory-low-stock");
    expect(module?.label).toBe("Inventory - Low Stock Alerts");
  });

  it("should register inventory-expiring module", async () => {
    await import("@/features/modules/inventory");

    const module = getModule("inventory-expiring");

    expect(module).toBeDefined();
    expect(module?.id).toBe("inventory-expiring");
    expect(module?.label).toBe("Inventory - Expiring Soon");
  });

  it("should register inventory-categories module", async () => {
    await import("@/features/modules/inventory");

    const module = getModule("inventory-categories");

    expect(module).toBeDefined();
    expect(module?.id).toBe("inventory-categories");
    expect(module?.label).toBe("Inventory - Categories");
  });
});
