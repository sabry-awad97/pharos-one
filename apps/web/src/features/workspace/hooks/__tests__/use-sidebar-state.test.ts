/**
 * Unit tests for useSidebarState hook
 * Tests workspace-scoped state persistence and backward compatibility
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useSidebarState } from "../use-sidebar-state";

describe("useSidebarState", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("Backward Compatibility", () => {
    it("should use 'global' workspace by default when no workspaceId provided", () => {
      const { result } = renderHook(() => useSidebarState());

      act(() => {
        result.current.setExpanded(false);
      });

      // Should persist to global key
      expect(localStorage.getItem("pharmos-sidebar-global-expanded")).toBe(
        "false",
      );
    });

    it("should maintain existing API without workspaceId parameter", () => {
      const { result } = renderHook(() => useSidebarState());

      // All existing properties should be available
      expect(result.current).toHaveProperty("expanded");
      expect(result.current).toHaveProperty("toggle");
      expect(result.current).toHaveProperty("setExpanded");
      expect(result.current).toHaveProperty("expandedModules");
      expect(result.current).toHaveProperty("toggleModule");
      expect(result.current).toHaveProperty("pinnedItems");
      expect(result.current).toHaveProperty("togglePin");
      expect(result.current).toHaveProperty("hiddenItems");
      expect(result.current).toHaveProperty("toggleHide");
      expect(result.current).toHaveProperty("sidebarWidth");
      expect(result.current).toHaveProperty("setSidebarWidth");
      expect(result.current).toHaveProperty("resetWidth");
    });

    it("should default to expanded=true when no stored state exists", () => {
      const { result } = renderHook(() => useSidebarState());
      expect(result.current.expanded).toBe(true);
    });

    it("should default to width=180 when no stored state exists", () => {
      const { result } = renderHook(() => useSidebarState());
      expect(result.current.sidebarWidth).toBe(180);
    });
  });

  describe("Workspace-Scoped State", () => {
    it("should persist state per workspace with correct key format", () => {
      const { result } = renderHook(() => useSidebarState("inventory"));

      act(() => {
        result.current.setExpanded(false);
        result.current.setSidebarWidth(250);
      });

      expect(localStorage.getItem("pharmos-sidebar-inventory-expanded")).toBe(
        "false",
      );
      expect(localStorage.getItem("pharmos-sidebar-inventory-width")).toBe(
        "250",
      );
    });

    it("should isolate state between different workspaces", () => {
      const { result: inventory } = renderHook(() =>
        useSidebarState("inventory"),
      );
      const { result: pos } = renderHook(() => useSidebarState("pos"));

      // Set different widths for each workspace
      act(() => {
        inventory.current.setSidebarWidth(250);
        pos.current.setSidebarWidth(180);
      });

      expect(inventory.current.sidebarWidth).toBe(250);
      expect(pos.current.sidebarWidth).toBe(180);

      // Verify localStorage has separate keys
      expect(localStorage.getItem("pharmos-sidebar-inventory-width")).toBe(
        "250",
      );
      expect(localStorage.getItem("pharmos-sidebar-pos-width")).toBe("180");
    });

    it("should isolate expanded state between workspaces", () => {
      const { result: inventory } = renderHook(() =>
        useSidebarState("inventory"),
      );
      const { result: pos } = renderHook(() => useSidebarState("pos"));

      act(() => {
        inventory.current.setExpanded(false);
        pos.current.setExpanded(true);
      });

      expect(inventory.current.expanded).toBe(false);
      expect(pos.current.expanded).toBe(true);
    });

    it("should isolate expandedModules between workspaces", () => {
      const { result: inventory } = renderHook(() =>
        useSidebarState("inventory"),
      );
      const { result: pos } = renderHook(() => useSidebarState("pos"));

      act(() => {
        inventory.current.toggleModule("module-1");
        pos.current.toggleModule("module-2");
      });

      expect(inventory.current.expandedModules.has("module-1")).toBe(true);
      expect(inventory.current.expandedModules.has("module-2")).toBe(false);
      expect(pos.current.expandedModules.has("module-1")).toBe(false);
      expect(pos.current.expandedModules.has("module-2")).toBe(true);
    });

    it("should isolate pinnedItems between workspaces", () => {
      const { result: inventory } = renderHook(() =>
        useSidebarState("inventory"),
      );
      const { result: pos } = renderHook(() => useSidebarState("pos"));

      act(() => {
        inventory.current.togglePin("item-1");
        pos.current.togglePin("item-2");
      });

      expect(inventory.current.pinnedItems.has("item-1")).toBe(true);
      expect(inventory.current.pinnedItems.has("item-2")).toBe(false);
      expect(pos.current.pinnedItems.has("item-1")).toBe(false);
      expect(pos.current.pinnedItems.has("item-2")).toBe(true);
    });

    it("should isolate hiddenItems between workspaces", () => {
      const { result: inventory } = renderHook(() =>
        useSidebarState("inventory"),
      );
      const { result: pos } = renderHook(() => useSidebarState("pos"));

      act(() => {
        inventory.current.toggleHide("item-1");
        pos.current.toggleHide("item-2");
      });

      expect(inventory.current.hiddenItems.has("item-1")).toBe(true);
      expect(inventory.current.hiddenItems.has("item-2")).toBe(false);
      expect(pos.current.hiddenItems.has("item-1")).toBe(false);
      expect(pos.current.hiddenItems.has("item-2")).toBe(true);
    });
  });

  describe("State Persistence", () => {
    it("should persist expanded state to localStorage", () => {
      const { result } = renderHook(() => useSidebarState("inventory"));

      act(() => {
        result.current.toggle();
      });

      expect(localStorage.getItem("pharmos-sidebar-inventory-expanded")).toBe(
        "false",
      );
    });

    it("should restore expanded state from localStorage", () => {
      localStorage.setItem("pharmos-sidebar-inventory-expanded", "false");

      const { result } = renderHook(() => useSidebarState("inventory"));

      expect(result.current.expanded).toBe(false);
    });

    it("should persist sidebar width to localStorage", () => {
      const { result } = renderHook(() => useSidebarState("inventory"));

      act(() => {
        result.current.setSidebarWidth(220);
      });

      expect(localStorage.getItem("pharmos-sidebar-inventory-width")).toBe(
        "220",
      );
    });

    it("should restore sidebar width from localStorage", () => {
      localStorage.setItem("pharmos-sidebar-inventory-width", "220");

      const { result } = renderHook(() => useSidebarState("inventory"));

      expect(result.current.sidebarWidth).toBe(220);
    });

    it("should persist expandedModules as array to localStorage", () => {
      const { result } = renderHook(() => useSidebarState("inventory"));

      act(() => {
        result.current.toggleModule("module-1");
        result.current.toggleModule("module-2");
      });

      const stored = localStorage.getItem(
        "pharmos-sidebar-inventory-expanded-modules",
      );
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed).toEqual(expect.arrayContaining(["module-1", "module-2"]));
    });

    it("should restore expandedModules from localStorage array", () => {
      localStorage.setItem(
        "pharmos-sidebar-inventory-expanded-modules",
        JSON.stringify(["module-1", "module-2"]),
      );

      const { result } = renderHook(() => useSidebarState("inventory"));

      expect(result.current.expandedModules.has("module-1")).toBe(true);
      expect(result.current.expandedModules.has("module-2")).toBe(true);
    });

    it("should persist pinnedItems as array to localStorage", () => {
      const { result } = renderHook(() => useSidebarState("inventory"));

      act(() => {
        result.current.togglePin("item-1");
        result.current.togglePin("item-2");
      });

      const stored = localStorage.getItem(
        "pharmos-sidebar-inventory-pinned-items",
      );
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed).toEqual(expect.arrayContaining(["item-1", "item-2"]));
    });

    it("should restore pinnedItems from localStorage array", () => {
      localStorage.setItem(
        "pharmos-sidebar-inventory-pinned-items",
        JSON.stringify(["item-1", "item-2"]),
      );

      const { result } = renderHook(() => useSidebarState("inventory"));

      expect(result.current.pinnedItems.has("item-1")).toBe(true);
      expect(result.current.pinnedItems.has("item-2")).toBe(true);
    });

    it("should persist hiddenItems as array to localStorage", () => {
      const { result } = renderHook(() => useSidebarState("inventory"));

      act(() => {
        result.current.toggleHide("item-1");
        result.current.toggleHide("item-2");
      });

      const stored = localStorage.getItem(
        "pharmos-sidebar-inventory-hidden-items",
      );
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed).toEqual(expect.arrayContaining(["item-1", "item-2"]));
    });

    it("should restore hiddenItems from localStorage array", () => {
      localStorage.setItem(
        "pharmos-sidebar-inventory-hidden-items",
        JSON.stringify(["item-1", "item-2"]),
      );

      const { result } = renderHook(() => useSidebarState("inventory"));

      expect(result.current.hiddenItems.has("item-1")).toBe(true);
      expect(result.current.hiddenItems.has("item-2")).toBe(true);
    });
  });

  describe("Set Serialization/Deserialization", () => {
    it("should convert Set to array for localStorage storage", () => {
      const { result } = renderHook(() => useSidebarState("inventory"));

      act(() => {
        result.current.toggleModule("module-1");
      });

      const stored = localStorage.getItem(
        "pharmos-sidebar-inventory-expanded-modules",
      );
      expect(stored).toBe('["module-1"]');
    });

    it("should convert array from localStorage to Set", () => {
      localStorage.setItem(
        "pharmos-sidebar-inventory-expanded-modules",
        '["module-1","module-2"]',
      );

      const { result } = renderHook(() => useSidebarState("inventory"));

      expect(result.current.expandedModules).toBeInstanceOf(Set);
      expect(result.current.expandedModules.size).toBe(2);
    });

    it("should handle empty Set serialization", () => {
      const { result } = renderHook(() => useSidebarState("inventory"));

      // Initially empty
      const stored = localStorage.getItem(
        "pharmos-sidebar-inventory-expanded-modules",
      );
      expect(stored).toBe("[]");
    });

    it("should handle empty array deserialization", () => {
      localStorage.setItem("pharmos-sidebar-inventory-expanded-modules", "[]");

      const { result } = renderHook(() => useSidebarState("inventory"));

      expect(result.current.expandedModules.size).toBe(0);
    });
  });

  describe("Default Values", () => {
    it("should return default values when no stored state exists", () => {
      const { result } = renderHook(() => useSidebarState("new-workspace"));

      expect(result.current.expanded).toBe(true);
      expect(result.current.sidebarWidth).toBe(180);
      expect(result.current.expandedModules.size).toBe(0);
      expect(result.current.pinnedItems.size).toBe(0);
      expect(result.current.hiddenItems.size).toBe(0);
    });

    it("should validate and reject invalid width from localStorage", () => {
      localStorage.setItem("pharmos-sidebar-inventory-width", "invalid");

      const { result } = renderHook(() => useSidebarState("inventory"));

      expect(result.current.sidebarWidth).toBe(180); // Default
    });

    it("should clamp width below minimum to MIN_WIDTH", () => {
      localStorage.setItem("pharmos-sidebar-inventory-width", "10");

      const { result } = renderHook(() => useSidebarState("inventory"));

      expect(result.current.sidebarWidth).toBe(180); // Default, not 10
    });

    it("should clamp width above maximum to MAX_WIDTH", () => {
      localStorage.setItem("pharmos-sidebar-inventory-width", "500");

      const { result } = renderHook(() => useSidebarState("inventory"));

      expect(result.current.sidebarWidth).toBe(180); // Default, not 500
    });
  });

  describe("Hook Methods", () => {
    it("should toggle expanded state", () => {
      const { result } = renderHook(() => useSidebarState("inventory"));

      expect(result.current.expanded).toBe(true);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.expanded).toBe(false);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.expanded).toBe(true);
    });

    it("should set expanded state explicitly", () => {
      const { result } = renderHook(() => useSidebarState("inventory"));

      act(() => {
        result.current.setExpanded(false);
      });

      expect(result.current.expanded).toBe(false);

      act(() => {
        result.current.setExpanded(true);
      });

      expect(result.current.expanded).toBe(true);
    });

    it("should toggle module expansion", () => {
      const { result } = renderHook(() => useSidebarState("inventory"));

      act(() => {
        result.current.toggleModule("module-1");
      });

      expect(result.current.expandedModules.has("module-1")).toBe(true);

      act(() => {
        result.current.toggleModule("module-1");
      });

      expect(result.current.expandedModules.has("module-1")).toBe(false);
    });

    it("should toggle item pin state", () => {
      const { result } = renderHook(() => useSidebarState("inventory"));

      act(() => {
        result.current.togglePin("item-1");
      });

      expect(result.current.pinnedItems.has("item-1")).toBe(true);

      act(() => {
        result.current.togglePin("item-1");
      });

      expect(result.current.pinnedItems.has("item-1")).toBe(false);
    });

    it("should toggle item hide state", () => {
      const { result } = renderHook(() => useSidebarState("inventory"));

      act(() => {
        result.current.toggleHide("item-1");
      });

      expect(result.current.hiddenItems.has("item-1")).toBe(true);

      act(() => {
        result.current.toggleHide("item-1");
      });

      expect(result.current.hiddenItems.has("item-1")).toBe(false);
    });

    it("should set sidebar width with clamping", () => {
      const { result } = renderHook(() => useSidebarState("inventory"));

      act(() => {
        result.current.setSidebarWidth(220);
      });

      expect(result.current.sidebarWidth).toBe(220);

      // Test clamping to MIN_WIDTH (48)
      act(() => {
        result.current.setSidebarWidth(10);
      });

      expect(result.current.sidebarWidth).toBe(48);

      // Test clamping to MAX_WIDTH (280)
      act(() => {
        result.current.setSidebarWidth(500);
      });

      expect(result.current.sidebarWidth).toBe(280);
    });

    it("should reset width to default", () => {
      const { result } = renderHook(() => useSidebarState("inventory"));

      act(() => {
        result.current.setSidebarWidth(250);
      });

      expect(result.current.sidebarWidth).toBe(250);

      act(() => {
        result.current.resetWidth();
      });

      expect(result.current.sidebarWidth).toBe(180);
    });
  });

  describe("Error Handling", () => {
    it("should handle localStorage read errors gracefully", () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      // Mock localStorage.getItem to throw
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = vi.fn(() => {
        throw new Error("localStorage disabled");
      });

      const { result } = renderHook(() => useSidebarState("inventory"));

      // Should use default values
      expect(result.current.expanded).toBe(true);
      expect(result.current.sidebarWidth).toBe(180);

      // Should log warnings
      expect(consoleWarnSpy).toHaveBeenCalled();

      // Restore
      Storage.prototype.getItem = originalGetItem;
      consoleWarnSpy.mockRestore();
    });

    it("should handle localStorage write errors gracefully", () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      // Mock localStorage.setItem to throw
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error("localStorage full");
      });

      const { result } = renderHook(() => useSidebarState("inventory"));

      act(() => {
        result.current.setExpanded(false);
      });

      // Should log warning
      expect(consoleWarnSpy).toHaveBeenCalled();

      // Restore
      Storage.prototype.setItem = originalSetItem;
      consoleWarnSpy.mockRestore();
    });

    it("should handle malformed JSON in localStorage", () => {
      localStorage.setItem(
        "pharmos-sidebar-inventory-expanded-modules",
        "invalid-json",
      );

      const { result } = renderHook(() => useSidebarState("inventory"));

      // Should use default empty Set
      expect(result.current.expandedModules.size).toBe(0);
    });
  });
});
