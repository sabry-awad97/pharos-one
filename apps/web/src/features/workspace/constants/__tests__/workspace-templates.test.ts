/**
 * Workspace templates constants tests
 */

import { describe, it, expect } from "vitest";
import { WORKSPACE_TEMPLATES } from "../workspace-templates";
import type { WorkspaceTemplate } from "../workspace-templates";

describe("WORKSPACE_TEMPLATES", () => {
  it("should have 4 templates", () => {
    expect(WORKSPACE_TEMPLATES).toHaveLength(4);
  });

  it("should have templates with unique IDs", () => {
    const ids = WORKSPACE_TEMPLATES.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  describe("template structure", () => {
    it.each(WORKSPACE_TEMPLATES)(
      "template '$label' should have all required fields",
      (template: WorkspaceTemplate) => {
        expect(template).toHaveProperty("id");
        expect(template).toHaveProperty("label");
        expect(template).toHaveProperty("icon");
        expect(template).toHaveProperty("description");
        expect(template).toHaveProperty("tabs");

        expect(typeof template.id).toBe("string");
        expect(typeof template.label).toBe("string");
        expect(template.icon).toBeDefined();
        expect(typeof template.description).toBe("string");
        expect(Array.isArray(template.tabs)).toBe(true);
      },
    );
  });

  describe("Pharmacist template", () => {
    const pharmacist = WORKSPACE_TEMPLATES.find((t) => t.id === "pharmacist");

    it("should exist", () => {
      expect(pharmacist).toBeDefined();
    });

    it("should have correct structure", () => {
      expect(pharmacist?.label).toBe("Pharmacist");
      expect(pharmacist?.description).toBe(
        "Prescriptions, inventory, and reports",
      );
    });

    it("should have 3 tabs", () => {
      expect(pharmacist?.tabs).toHaveLength(3);
    });

    it("should have Prescriptions tab pinned", () => {
      const prescriptionsTab = pharmacist?.tabs.find(
        (t) => t.module === "prescriptions",
      );
      expect(prescriptionsTab?.pinned).toBe(true);
    });

    it("should have correct tab modules", () => {
      const modules = pharmacist?.tabs.map((t) => t.module);
      expect(modules).toEqual(["prescriptions", "inventory", "reports"]);
    });
  });

  describe("Cashier template", () => {
    const cashier = WORKSPACE_TEMPLATES.find((t) => t.id === "cashier");

    it("should exist", () => {
      expect(cashier).toBeDefined();
    });

    it("should have correct structure", () => {
      expect(cashier?.label).toBe("Cashier");
      expect(cashier?.description).toBe("POS, inventory, and dashboard");
    });

    it("should have 3 tabs", () => {
      expect(cashier?.tabs).toHaveLength(3);
    });

    it("should have POS tab pinned", () => {
      const posTab = cashier?.tabs.find((t) => t.module === "pos");
      expect(posTab?.pinned).toBe(true);
    });

    it("should have correct tab modules", () => {
      const modules = cashier?.tabs.map((t) => t.module);
      expect(modules).toEqual(["pos", "inventory", "dashboard"]);
    });
  });

  describe("Manager template", () => {
    const manager = WORKSPACE_TEMPLATES.find((t) => t.id === "manager");

    it("should exist", () => {
      expect(manager).toBeDefined();
    });

    it("should have correct structure", () => {
      expect(manager?.label).toBe("Manager");
      expect(manager?.description).toBe(
        "Dashboard, reports, inventory, and staff",
      );
    });

    it("should have 4 tabs", () => {
      expect(manager?.tabs).toHaveLength(4);
    });

    it("should have Dashboard tab pinned", () => {
      const dashboardTab = manager?.tabs.find((t) => t.module === "dashboard");
      expect(dashboardTab?.pinned).toBe(true);
    });

    it("should have correct tab modules", () => {
      const modules = manager?.tabs.map((t) => t.module);
      expect(modules).toEqual(["dashboard", "reports", "inventory", "staff"]);
    });
  });

  describe("Custom template", () => {
    const custom = WORKSPACE_TEMPLATES.find((t) => t.id === "custom");

    it("should exist", () => {
      expect(custom).toBeDefined();
    });

    it("should have correct structure", () => {
      expect(custom?.label).toBe("Custom");
      expect(custom?.description).toBe("Start with an empty workspace");
    });

    it("should have no tabs", () => {
      expect(custom?.tabs).toHaveLength(0);
    });
  });

  describe("tab structure", () => {
    it("all tabs should have required fields", () => {
      WORKSPACE_TEMPLATES.forEach((template) => {
        template.tabs.forEach((tab) => {
          expect(tab).toHaveProperty("label");
          expect(tab).toHaveProperty("icon");
          expect(tab).toHaveProperty("module");

          expect(typeof tab.label).toBe("string");
          expect(tab.icon).toBeDefined();
          expect(typeof tab.module).toBe("string");

          if (tab.pinned !== undefined) {
            expect(typeof tab.pinned).toBe("boolean");
          }
        });
      });
    });
  });
});
