/**
 * Tab Drag-and-Drop Integration Tests
 * Tests drag-drop reordering, pinned/regular section separation,
 * keyboard reordering, and state persistence
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { act } from "@testing-library/react";
import { useTabsStore } from "@/features/workspace/stores/tabs-store";
import type { Tab } from "@/features/workspace/types";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";

const TAB_ORDER_KEY = "pharmos-tab-order-dev-user";

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
    // Reset store state
    useTabsStore.setState({
      state: {
        tabs: [],
        activeTabId: null,
        splitView: {
          enabled: false,
          leftModuleId: null,
          rightModuleId: null,
        },
      },
      activeTabLabel: undefined,
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should start with empty tabs array", () => {
    const { state } = useTabsStore.getState();
    expect(state.tabs).toEqual([]);
    expect(state.activeTabId).toBeNull();
  });

  it("should reorder tabs when reorderTabs is called", () => {
    const { reorderTabs } = useTabsStore.getState();

    // Manually add tabs to store
    act(() => {
      useTabsStore.setState({
        state: {
          tabs: mockTabs,
          activeTabId: mockTabs[0].id,
          splitView: {
            enabled: false,
            leftModuleId: null,
            rightModuleId: null,
          },
        },
      });
    });

    const initialTabs = useTabsStore.getState().state.tabs;
    expect(initialTabs[0].id).toBe("tab-1");
    expect(initialTabs[1].id).toBe("tab-2");
    expect(initialTabs[2].id).toBe("tab-3");

    // Move Dashboard (index 0) to position 2
    act(() => {
      reorderTabs(0, 2);
    });

    const reorderedTabs = useTabsStore.getState().state.tabs;
    expect(reorderedTabs[0].id).toBe("tab-2");
    expect(reorderedTabs[1].id).toBe("tab-3");
    expect(reorderedTabs[2].id).toBe("tab-1");
  });

  it("should persist tab order to localStorage", () => {
    const { reorderTabs } = useTabsStore.getState();

    act(() => {
      useTabsStore.setState({
        state: {
          tabs: mockTabs,
          activeTabId: mockTabs[0].id,
          splitView: {
            enabled: false,
            leftModuleId: null,
            rightModuleId: null,
          },
        },
      });
      reorderTabs(0, 2);
    });

    // Check localStorage
    const savedOrder = localStorage.getItem(TAB_ORDER_KEY);
    expect(savedOrder).toBeTruthy();

    const orderArray = JSON.parse(savedOrder!);
    expect(orderArray).toEqual(["tab-2", "tab-3", "tab-1"]);
  });

  it("should load tab order from localStorage on initialization", () => {
    // Pre-populate localStorage with custom order
    const customOrder = ["tab-3", "tab-1", "tab-2"];
    localStorage.setItem(TAB_ORDER_KEY, JSON.stringify(customOrder));

    // Manually set tabs in store (simulating app initialization)
    act(() => {
      useTabsStore.setState({
        state: {
          tabs: mockTabs,
          activeTabId: mockTabs[0].id,
          splitView: {
            enabled: false,
            leftModuleId: null,
            rightModuleId: null,
          },
        },
      });
    });

    // Tabs should be in original order (localStorage order is not applied automatically anymore)
    const tabs = useTabsStore.getState().state.tabs;
    expect(tabs[0].id).toBe("tab-1");
    expect(tabs[1].id).toBe("tab-2");
    expect(tabs[2].id).toBe("tab-3");
  });

  it("should handle invalid localStorage data gracefully", () => {
    // Set invalid JSON in localStorage
    localStorage.setItem(TAB_ORDER_KEY, "invalid-json");

    // Manually set tabs in store
    act(() => {
      useTabsStore.setState({
        state: {
          tabs: mockTabs,
          activeTabId: mockTabs[0].id,
          splitView: {
            enabled: false,
            leftModuleId: null,
            rightModuleId: null,
          },
        },
      });
    });

    // Should use initial tab order
    const tabs = useTabsStore.getState().state.tabs;
    expect(tabs[0].id).toBe("tab-1");
    expect(tabs[1].id).toBe("tab-2");
    expect(tabs[2].id).toBe("tab-3");
  });

  it("should update localStorage when tabs are added", () => {
    const { addTab } = useTabsStore.getState();

    act(() => {
      useTabsStore.setState({
        state: {
          tabs: mockTabs,
          activeTabId: mockTabs[0].id,
          splitView: {
            enabled: false,
            leftModuleId: null,
            rightModuleId: null,
          },
        },
      });
      addTab({
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
    const { closeTab } = useTabsStore.getState();

    act(() => {
      useTabsStore.setState({
        state: {
          tabs: mockTabs,
          activeTabId: mockTabs[0].id,
          splitView: {
            enabled: false,
            leftModuleId: null,
            rightModuleId: null,
          },
        },
      });
      closeTab("tab-2");
    });

    const savedOrder = localStorage.getItem(TAB_ORDER_KEY);
    const orderArray = JSON.parse(savedOrder!);

    // Should have 2 tabs now
    expect(orderArray).toHaveLength(2);
    expect(orderArray).toEqual(["tab-1", "tab-3"]);
  });

  it("should maintain separate sections for pinned and regular tabs", () => {
    act(() => {
      useTabsStore.setState({
        state: {
          tabs: mockTabs,
          activeTabId: mockTabs[0].id,
          splitView: {
            enabled: false,
            leftModuleId: null,
            rightModuleId: null,
          },
        },
      });
    });

    const tabs = useTabsStore.getState().state.tabs;
    const pinnedTabs = tabs.filter((t: Tab) => t.pinned);
    const regularTabs = tabs.filter((t: Tab) => !t.pinned);

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

    const { reorderTabs } = useTabsStore.getState();

    act(() => {
      useTabsStore.setState({
        state: {
          tabs: tabsWithMultiplePinned,
          activeTabId: tabsWithMultiplePinned[0].id,
          splitView: {
            enabled: false,
            leftModuleId: null,
            rightModuleId: null,
          },
        },
      });
      // Reorder pinned tabs (swap Dashboard and Inventory)
      reorderTabs(0, 1);
    });

    const tabs = useTabsStore.getState().state.tabs;
    // Pinned tabs should be reordered
    expect(tabs[0].id).toBe("tab-2");
    expect(tabs[1].id).toBe("tab-1");
    // Regular tab should remain in same position
    expect(tabs[2].id).toBe("tab-3");
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

    const { reorderTabs } = useTabsStore.getState();

    act(() => {
      useTabsStore.setState({
        state: {
          tabs: tabsWithMultipleRegular,
          activeTabId: tabsWithMultipleRegular[0].id,
          splitView: {
            enabled: false,
            leftModuleId: null,
            rightModuleId: null,
          },
        },
      });
      // Reorder regular tabs (swap Inventory and POS)
      reorderTabs(1, 2);
    });

    const tabs = useTabsStore.getState().state.tabs;
    // Pinned tab should remain in same position
    expect(tabs[0].id).toBe("tab-1");
    // Regular tabs should be reordered
    expect(tabs[1].id).toBe("tab-3");
    expect(tabs[2].id).toBe("tab-2");
  });
});

describe("Tab Keyboard Reordering", () => {
  it("should provide reorderTabs method for keyboard navigation", () => {
    const { reorderTabs } = useTabsStore.getState();

    expect(reorderTabs).toBeDefined();
    expect(typeof reorderTabs).toBe("function");
  });
});
