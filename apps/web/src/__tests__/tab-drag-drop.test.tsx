/**
 * Tab Drag-and-Drop Integration Tests
 * Tests drag-drop reordering, pinned/regular section separation,
 * keyboard reordering, and state persistence
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTabs } from "../features/workspace/hooks/use-tabs";
import type { Tab } from "../features/workspace/types";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";

const TAB_ORDER_KEY = "pharmos-tab-order";

describe("Tab Drag-and-Drop Reordering", () => {
  const mockTabs: Tab[] = [
    {
      id: "tab-1",
      label: "Dashboard",
      icon: LayoutDashboard,
      module: "dashboard",
      pinned: false,
    },
    {
      id: "tab-2",
      label: "Inventory",
      icon: Package,
      module: "inventory",
      pinned: true,
    },
    {
      id: "tab-3",
      label: "POS",
      icon: ShoppingCart,
      module: "pos",
      pinned: false,
    },
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should reorder tabs when reorderTabs is called", () => {
    const { result } = renderHook(() => useTabs(mockTabs));

    // Initial order: Dashboard, Inventory, POS
    expect(result.current.state.tabs[0].id).toBe("tab-1");
    expect(result.current.state.tabs[1].id).toBe("tab-2");
    expect(result.current.state.tabs[2].id).toBe("tab-3");

    // Move Dashboard (index 0) to position 2
    act(() => {
      result.current.reorderTabs(0, 2);
    });

    // New order: Inventory, POS, Dashboard
    expect(result.current.state.tabs[0].id).toBe("tab-2");
    expect(result.current.state.tabs[1].id).toBe("tab-3");
    expect(result.current.state.tabs[2].id).toBe("tab-1");
  });

  it("should persist tab order to localStorage", () => {
    const { result } = renderHook(() => useTabs(mockTabs));

    act(() => {
      result.current.reorderTabs(0, 2);
    });

    // Check localStorage
    const savedOrder = localStorage.getItem(TAB_ORDER_KEY);
    expect(savedOrder).toBeTruthy();

    const orderArray = JSON.parse(savedOrder!);
    expect(orderArray).toEqual(["tab-2", "tab-3", "tab-1"]);
  });

  it("should load tab order from localStorage on mount", () => {
    // Pre-populate localStorage with custom order
    const customOrder = ["tab-3", "tab-1", "tab-2"];
    localStorage.setItem(TAB_ORDER_KEY, JSON.stringify(customOrder));

    const { result } = renderHook(() => useTabs(mockTabs));

    // Wait for useEffect to run
    act(() => {
      // Trigger re-render
    });

    // Tabs should be reordered based on localStorage
    expect(result.current.state.tabs[0].id).toBe("tab-3");
    expect(result.current.state.tabs[1].id).toBe("tab-1");
    expect(result.current.state.tabs[2].id).toBe("tab-2");
  });

  it("should handle invalid localStorage data gracefully", () => {
    // Set invalid JSON in localStorage
    localStorage.setItem(TAB_ORDER_KEY, "invalid-json");

    const { result } = renderHook(() => useTabs(mockTabs));

    // Should use initial tab order
    expect(result.current.state.tabs[0].id).toBe("tab-1");
    expect(result.current.state.tabs[1].id).toBe("tab-2");
    expect(result.current.state.tabs[2].id).toBe("tab-3");
  });

  it("should update localStorage when tabs are added", () => {
    const { result } = renderHook(() => useTabs(mockTabs));

    act(() => {
      result.current.addTab({
        label: "Reports",
        icon: LayoutDashboard,
        module: "reports",
      });
    });

    const savedOrder = localStorage.getItem(TAB_ORDER_KEY);
    const orderArray = JSON.parse(savedOrder!);

    // Should have 4 tabs now
    expect(orderArray).toHaveLength(4);
    expect(orderArray[3]).toBeTruthy(); // New tab ID
  });

  it("should update localStorage when tabs are closed", () => {
    const { result } = renderHook(() => useTabs(mockTabs));

    act(() => {
      result.current.closeTab("tab-2");
    });

    const savedOrder = localStorage.getItem(TAB_ORDER_KEY);
    const orderArray = JSON.parse(savedOrder!);

    // Should have 2 tabs now
    expect(orderArray).toHaveLength(2);
    expect(orderArray).toEqual(["tab-1", "tab-3"]);
  });

  it("should maintain separate sections for pinned and regular tabs", () => {
    const { result } = renderHook(() => useTabs(mockTabs));

    const pinnedTabs = result.current.state.tabs.filter((t) => t.pinned);
    const regularTabs = result.current.state.tabs.filter((t) => !t.pinned);

    expect(pinnedTabs).toHaveLength(1);
    expect(pinnedTabs[0].id).toBe("tab-2");

    expect(regularTabs).toHaveLength(2);
    expect(regularTabs[0].id).toBe("tab-1");
    expect(regularTabs[1].id).toBe("tab-3");
  });

  it("should reorder within pinned section independently", () => {
    const tabsWithMultiplePinned: Tab[] = [
      {
        id: "tab-1",
        label: "Dashboard",
        icon: LayoutDashboard,
        module: "dashboard",
        pinned: true,
      },
      {
        id: "tab-2",
        label: "Inventory",
        icon: Package,
        module: "inventory",
        pinned: true,
      },
      {
        id: "tab-3",
        label: "POS",
        icon: ShoppingCart,
        module: "pos",
        pinned: false,
      },
    ];

    const { result } = renderHook(() => useTabs(tabsWithMultiplePinned));

    // Reorder pinned tabs (swap Dashboard and Inventory)
    act(() => {
      result.current.reorderTabs(0, 1);
    });

    // Pinned tabs should be reordered
    expect(result.current.state.tabs[0].id).toBe("tab-2");
    expect(result.current.state.tabs[1].id).toBe("tab-1");
    // Regular tab should remain in same position
    expect(result.current.state.tabs[2].id).toBe("tab-3");
  });

  it("should reorder within regular section independently", () => {
    const tabsWithMultipleRegular: Tab[] = [
      {
        id: "tab-1",
        label: "Dashboard",
        icon: LayoutDashboard,
        module: "dashboard",
        pinned: true,
      },
      {
        id: "tab-2",
        label: "Inventory",
        icon: Package,
        module: "inventory",
        pinned: false,
      },
      {
        id: "tab-3",
        label: "POS",
        icon: ShoppingCart,
        module: "pos",
        pinned: false,
      },
    ];

    const { result } = renderHook(() => useTabs(tabsWithMultipleRegular));

    // Reorder regular tabs (swap Inventory and POS)
    act(() => {
      result.current.reorderTabs(1, 2);
    });

    // Pinned tab should remain in same position
    expect(result.current.state.tabs[0].id).toBe("tab-1");
    // Regular tabs should be reordered
    expect(result.current.state.tabs[1].id).toBe("tab-3");
    expect(result.current.state.tabs[2].id).toBe("tab-2");
  });
});

describe("Tab Keyboard Reordering", () => {
  it("should provide reorderTabs method for keyboard navigation", () => {
    const mockTabs: Tab[] = [
      {
        id: "tab-1",
        label: "Dashboard",
        icon: LayoutDashboard,
        module: "dashboard",
      },
      {
        id: "tab-2",
        label: "Inventory",
        icon: Package,
        module: "inventory",
      },
    ];

    const { result } = renderHook(() => useTabs(mockTabs));

    expect(result.current.reorderTabs).toBeDefined();
    expect(typeof result.current.reorderTabs).toBe("function");
  });
});
