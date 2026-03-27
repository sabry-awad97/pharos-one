import { describe, it, expect, beforeEach } from "vitest";
import { useTabsStore } from "../tabs-store";
import { Home, Package, ShoppingCart } from "lucide-react";

describe("Tabs Store", () => {
  beforeEach(() => {
    // Clear localStorage and reset store before each test
    localStorage.clear();
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

  describe("Initial State", () => {
    it("should have empty tabs initially", () => {
      const state = useTabsStore.getState();
      expect(state.state.tabs).toEqual([]);
      expect(state.state.activeTabId).toBeNull();
      expect(state.activeTabLabel).toBeUndefined();
    });
  });

  describe("User-Scoped localStorage Keys", () => {
    it("should create separate localStorage entries for different users", () => {
      const { addTab, resetForUser } = useTabsStore.getState();

      // Add tabs for dev-user (default)
      addTab({ label: "Dashboard", icon: Home, module: "dashboard" });
      addTab({ label: "Inventory", icon: Package, module: "inventory" });

      // Check localStorage has dev-user key
      const devUserKey = localStorage.getItem("pharmos-tab-order-dev-user");
      expect(devUserKey).toBeTruthy();
      const devUserTabs = JSON.parse(devUserKey!);
      expect(devUserTabs).toHaveLength(2);

      // Simulate different user by manually setting localStorage
      const user2Tabs = ["tab-user2-1", "tab-user2-2", "tab-user2-3"];
      localStorage.setItem(
        "pharmos-tab-order-user2",
        JSON.stringify(user2Tabs),
      );

      // Verify both keys exist and are separate
      const user2Key = localStorage.getItem("pharmos-tab-order-user2");
      expect(user2Key).toBeTruthy();
      expect(JSON.parse(user2Key!)).toEqual(user2Tabs);

      // Verify dev-user key is unchanged
      const devUserKeyAfter = localStorage.getItem(
        "pharmos-tab-order-dev-user",
      );
      expect(JSON.parse(devUserKeyAfter!)).toEqual(devUserTabs);
    });

    it("should use user-scoped key format", () => {
      const { addTab } = useTabsStore.getState();

      addTab({ label: "Dashboard", icon: Home, module: "dashboard" });

      // Check the key format
      const keys = Object.keys(localStorage);
      expect(keys).toContain("pharmos-tab-order-dev-user");
      expect(keys.some((k) => k.startsWith("pharmos-tab-order-"))).toBe(true);
    });

    it("should not contaminate state between users", () => {
      const { addTab } = useTabsStore.getState();

      // Add tabs for dev-user
      const tab1Id = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });
      const tab2Id = addTab({
        label: "Inventory",
        icon: Package,
        module: "inventory",
      });

      const devUserData = localStorage.getItem("pharmos-tab-order-dev-user");
      expect(devUserData).toBeTruthy();
      const devUserTabs = JSON.parse(devUserData!);
      expect(devUserTabs).toContain(tab1Id);
      expect(devUserTabs).toContain(tab2Id);

      // Set up different user data
      localStorage.setItem(
        "pharmos-tab-order-user2",
        JSON.stringify(["different-tab-1", "different-tab-2"]),
      );

      // Verify dev-user data is unchanged
      const devUserDataAfter = localStorage.getItem(
        "pharmos-tab-order-dev-user",
      );
      expect(JSON.parse(devUserDataAfter!)).toEqual(devUserTabs);

      // Verify user2 data is separate
      const user2Data = localStorage.getItem("pharmos-tab-order-user2");
      expect(JSON.parse(user2Data!)).toEqual([
        "different-tab-1",
        "different-tab-2",
      ]);
    });
  });

  describe("resetForUser Action", () => {
    it("should clear tabs and activeTabId", () => {
      const { addTab, resetForUser } = useTabsStore.getState();

      // Add some tabs
      addTab({ label: "Dashboard", icon: Home, module: "dashboard" });
      addTab({ label: "Inventory", icon: Package, module: "inventory" });

      const stateBefore = useTabsStore.getState();
      expect(stateBefore.state.tabs).toHaveLength(2);
      expect(stateBefore.state.activeTabId).toBeTruthy();

      // Reset for dev-user
      resetForUser("dev-user");

      const stateAfter = useTabsStore.getState();
      expect(stateAfter.state.tabs).toEqual([]);
      expect(stateAfter.state.activeTabId).toBeNull();
      expect(stateAfter.activeTabLabel).toBeUndefined();
    });

    it("should reset split view state", () => {
      const { toggleSplitView, setSplitModules, resetForUser } =
        useTabsStore.getState();

      // Enable split view
      toggleSplitView();
      setSplitModules("dashboard", "inventory");

      const stateBefore = useTabsStore.getState();
      expect(stateBefore.state.splitView.enabled).toBe(true);
      expect(stateBefore.state.splitView.leftModuleId).toBe("dashboard");
      expect(stateBefore.state.splitView.rightModuleId).toBe("inventory");

      // Reset
      resetForUser("dev-user");

      const stateAfter = useTabsStore.getState();
      expect(stateAfter.state.splitView.enabled).toBe(false);
      expect(stateAfter.state.splitView.leftModuleId).toBeNull();
      expect(stateAfter.state.splitView.rightModuleId).toBeNull();
    });

    it("should work with different userIds", () => {
      const { resetForUser } = useTabsStore.getState();

      // Set up localStorage for multiple users
      localStorage.setItem(
        "pharmos-tab-order-user1",
        JSON.stringify(["tab1", "tab2"]),
      );
      localStorage.setItem(
        "pharmos-tab-order-user2",
        JSON.stringify(["tab3", "tab4"]),
      );

      // Reset for user1
      resetForUser("user1");

      const state = useTabsStore.getState();
      expect(state.state.tabs).toEqual([]);
      expect(state.state.activeTabId).toBeNull();

      // Verify localStorage still has both user keys
      expect(localStorage.getItem("pharmos-tab-order-user1")).toBeTruthy();
      expect(localStorage.getItem("pharmos-tab-order-user2")).toBeTruthy();
    });
  });

  describe("Add Tab", () => {
    it("should add a tab and set it as active", () => {
      const { addTab } = useTabsStore.getState();

      const tabId = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });

      const state = useTabsStore.getState();
      expect(state.state.tabs).toHaveLength(1);
      expect(state.state.tabs[0].id).toBe(tabId);
      expect(state.state.tabs[0].label).toBe("Dashboard");
      expect(state.state.activeTabId).toBe(tabId);
      expect(state.activeTabLabel).toBe("Dashboard");
    });

    it("should save tab order to localStorage", () => {
      const { addTab } = useTabsStore.getState();

      const tab1Id = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });
      const tab2Id = addTab({
        label: "Inventory",
        icon: Package,
        module: "inventory",
      });

      const stored = localStorage.getItem("pharmos-tab-order-dev-user");
      expect(stored).toBeTruthy();
      const tabIds = JSON.parse(stored!);
      expect(tabIds).toEqual([tab1Id, tab2Id]);
    });

    it("should generate unique IDs for tabs", () => {
      const { addTab } = useTabsStore.getState();

      const tab1Id = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });
      const tab2Id = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });

      expect(tab1Id).not.toBe(tab2Id);
    });
  });

  describe("Close Tab", () => {
    it("should close a tab and update localStorage", () => {
      const { addTab, closeTab } = useTabsStore.getState();

      const tab1Id = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });
      const tab2Id = addTab({
        label: "Inventory",
        icon: Package,
        module: "inventory",
      });

      closeTab(tab1Id);

      const state = useTabsStore.getState();
      expect(state.state.tabs).toHaveLength(1);
      expect(state.state.tabs[0].id).toBe(tab2Id);

      const stored = localStorage.getItem("pharmos-tab-order-dev-user");
      const tabIds = JSON.parse(stored!);
      expect(tabIds).toEqual([tab2Id]);
    });

    it("should switch to last tab when closing active tab", () => {
      const { addTab, closeTab } = useTabsStore.getState();

      const tab1Id = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });
      const tab2Id = addTab({
        label: "Inventory",
        icon: Package,
        module: "inventory",
      });

      // tab2 is active, close it
      closeTab(tab2Id);

      const state = useTabsStore.getState();
      expect(state.state.activeTabId).toBe(tab1Id);
    });

    it("should set activeTabId to null when closing last tab", () => {
      const { addTab, closeTab } = useTabsStore.getState();

      const tabId = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });

      closeTab(tabId);

      const state = useTabsStore.getState();
      expect(state.state.tabs).toHaveLength(0);
      expect(state.state.activeTabId).toBeNull();
    });
  });

  describe("Set Active Tab", () => {
    it("should set the active tab", () => {
      const { addTab, setActiveTab } = useTabsStore.getState();

      const tab1Id = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });
      const tab2Id = addTab({
        label: "Inventory",
        icon: Package,
        module: "inventory",
      });

      setActiveTab(tab1Id);

      const state = useTabsStore.getState();
      expect(state.state.activeTabId).toBe(tab1Id);
      expect(state.activeTabLabel).toBe("Dashboard");
    });

    it("should not change active tab if id doesn't exist", () => {
      const { addTab, setActiveTab } = useTabsStore.getState();

      const tabId = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });

      setActiveTab("non-existent-id");

      const state = useTabsStore.getState();
      expect(state.state.activeTabId).toBe(tabId); // Should remain unchanged
    });
  });

  describe("Get Active Tab", () => {
    it("should return the active tab", () => {
      const { addTab, getActiveTab } = useTabsStore.getState();

      addTab({ label: "Dashboard", icon: Home, module: "dashboard" });
      const tab2Id = addTab({
        label: "Inventory",
        icon: Package,
        module: "inventory",
      });

      const activeTab = getActiveTab();
      expect(activeTab).toBeTruthy();
      expect(activeTab!.id).toBe(tab2Id);
      expect(activeTab!.label).toBe("Inventory");
    });

    it("should return null if no active tab", () => {
      const { getActiveTab } = useTabsStore.getState();

      const activeTab = getActiveTab();
      expect(activeTab).toBeNull();
    });
  });

  describe("Toggle Pin", () => {
    it("should pin a tab", () => {
      const { addTab, togglePin } = useTabsStore.getState();

      const tabId = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });

      togglePin(tabId);

      const state = useTabsStore.getState();
      expect(state.state.tabs[0].pinned).toBe(true);
    });

    it("should unpin a pinned tab", () => {
      const { addTab, togglePin } = useTabsStore.getState();

      const tabId = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
        pinned: true,
      });

      togglePin(tabId);

      const state = useTabsStore.getState();
      expect(state.state.tabs[0].pinned).toBe(false);
    });
  });

  describe("Duplicate Tab", () => {
    it("should duplicate a tab with (copy) suffix", () => {
      const { addTab, duplicateTab } = useTabsStore.getState();

      const originalId = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });

      const duplicateId = duplicateTab(originalId);

      const state = useTabsStore.getState();
      expect(state.state.tabs).toHaveLength(2);
      expect(duplicateId).toBeTruthy();
      expect(state.state.tabs[1].label).toBe("Dashboard (copy)");
      expect(state.state.tabs[1].unsaved).toBe(false);
      expect(state.state.tabs[1].pinned).toBe(false);
    });

    it("should save updated tab order to localStorage", () => {
      const { addTab, duplicateTab } = useTabsStore.getState();

      const originalId = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });
      const duplicateId = duplicateTab(originalId);

      const stored = localStorage.getItem("pharmos-tab-order-dev-user");
      const tabIds = JSON.parse(stored!);
      expect(tabIds).toEqual([originalId, duplicateId]);
    });

    it("should return null if source tab doesn't exist", () => {
      const { duplicateTab } = useTabsStore.getState();

      const result = duplicateTab("non-existent-id");
      expect(result).toBeNull();
    });
  });

  describe("Mark Unsaved", () => {
    it("should mark a tab as unsaved", () => {
      const { addTab, markUnsaved } = useTabsStore.getState();

      const tabId = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });

      markUnsaved(tabId, true);

      const state = useTabsStore.getState();
      expect(state.state.tabs[0].unsaved).toBe(true);
    });

    it("should mark a tab as saved", () => {
      const { addTab, markUnsaved } = useTabsStore.getState();

      const tabId = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
        unsaved: true,
      });

      markUnsaved(tabId, false);

      const state = useTabsStore.getState();
      expect(state.state.tabs[0].unsaved).toBe(false);
    });
  });

  describe("Split View", () => {
    it("should toggle split view", () => {
      const { toggleSplitView } = useTabsStore.getState();

      toggleSplitView();
      expect(useTabsStore.getState().state.splitView.enabled).toBe(true);

      toggleSplitView();
      expect(useTabsStore.getState().state.splitView.enabled).toBe(false);
    });

    it("should set split modules", () => {
      const { setSplitModules } = useTabsStore.getState();

      setSplitModules("dashboard", "inventory");

      const state = useTabsStore.getState();
      expect(state.state.splitView.leftModuleId).toBe("dashboard");
      expect(state.state.splitView.rightModuleId).toBe("inventory");
    });
  });

  describe("Reorder Tabs", () => {
    it("should reorder tabs", () => {
      const { addTab, reorderTabs } = useTabsStore.getState();

      const tab1Id = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });
      const tab2Id = addTab({
        label: "Inventory",
        icon: Package,
        module: "inventory",
      });
      const tab3Id = addTab({
        label: "POS",
        icon: ShoppingCart,
        module: "pos",
      });

      // Move tab at index 0 to index 2
      reorderTabs(0, 2);

      const state = useTabsStore.getState();
      expect(state.state.tabs[0].id).toBe(tab2Id);
      expect(state.state.tabs[1].id).toBe(tab3Id);
      expect(state.state.tabs[2].id).toBe(tab1Id);
    });

    it("should save reordered tabs to localStorage", () => {
      const { addTab, reorderTabs } = useTabsStore.getState();

      const tab1Id = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });
      const tab2Id = addTab({
        label: "Inventory",
        icon: Package,
        module: "inventory",
      });

      reorderTabs(0, 1);

      const stored = localStorage.getItem("pharmos-tab-order-dev-user");
      const tabIds = JSON.parse(stored!);
      expect(tabIds).toEqual([tab2Id, tab1Id]);
    });
  });

  describe("Existing Functionality", () => {
    it("should maintain all existing tab operations", () => {
      const {
        addTab,
        closeTab,
        setActiveTab,
        getActiveTab,
        togglePin,
        duplicateTab,
        markUnsaved,
      } = useTabsStore.getState();

      // Add tabs
      const tab1Id = addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });
      const tab2Id = addTab({
        label: "Inventory",
        icon: Package,
        module: "inventory",
      });

      // All operations should work
      setActiveTab(tab1Id);
      expect(getActiveTab()!.id).toBe(tab1Id);

      togglePin(tab1Id);
      expect(useTabsStore.getState().state.tabs[0].pinned).toBe(true);

      markUnsaved(tab1Id, true);
      expect(useTabsStore.getState().state.tabs[0].unsaved).toBe(true);

      const duplicateId = duplicateTab(tab1Id);
      expect(duplicateId).toBeTruthy();
      expect(useTabsStore.getState().state.tabs).toHaveLength(3);

      closeTab(tab2Id);
      expect(useTabsStore.getState().state.tabs).toHaveLength(2);
    });
  });
});
