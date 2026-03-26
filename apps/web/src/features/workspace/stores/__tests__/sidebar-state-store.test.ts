import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  useSidebarStateStore,
  DEFAULT_WIDTH,
  MIN_WIDTH,
  MAX_WIDTH,
} from "../sidebar-state-store";

describe("Sidebar State Store", () => {
  beforeEach(() => {
    // Clear localStorage and reset store before each test
    localStorage.clear();
    useSidebarStateStore.setState({ workspaces: {} });
  });

  describe("Initial State", () => {
    it("should have empty workspaces initially", () => {
      const state = useSidebarStateStore.getState();
      expect(state.workspaces).toEqual({});
    });

    it("should return default state for non-existent workspace", () => {
      const state = useSidebarStateStore.getState();
      const workspaceState = state.getWorkspaceState("test");
      expect(workspaceState.expanded).toBe(true);
      expect(workspaceState.expandedModules).toBeInstanceOf(Set);
      expect(workspaceState.expandedModules.size).toBe(0);
      expect(workspaceState.pinnedItems).toBeInstanceOf(Set);
      expect(workspaceState.pinnedItems.size).toBe(0);
      expect(workspaceState.hiddenItems).toBeInstanceOf(Set);
      expect(workspaceState.hiddenItems.size).toBe(0);
      expect(workspaceState.width).toBe(DEFAULT_WIDTH);
    });
  });

  describe("Toggle Expanded", () => {
    it("should toggle sidebar expanded state", () => {
      const { toggle, getWorkspaceState } = useSidebarStateStore.getState();

      // Initially expanded
      expect(getWorkspaceState("test").expanded).toBe(true);

      // Toggle to collapsed
      toggle("test");
      expect(getWorkspaceState("test").expanded).toBe(false);

      // Toggle back to expanded
      toggle("test");
      expect(getWorkspaceState("test").expanded).toBe(true);
    });

    it("should create workspace if it doesn't exist when toggling", () => {
      const { toggle, workspaces } = useSidebarStateStore.getState();

      expect(workspaces["new-workspace"]).toBeUndefined();

      toggle("new-workspace");

      const state = useSidebarStateStore.getState();
      expect(state.workspaces["new-workspace"]).toBeDefined();
      expect(state.workspaces["new-workspace"].expanded).toBe(false);
    });
  });

  describe("Set Expanded", () => {
    it("should set sidebar expanded state to true", () => {
      const { setExpanded, getWorkspaceState } =
        useSidebarStateStore.getState();

      setExpanded("test", false);
      expect(getWorkspaceState("test").expanded).toBe(false);

      setExpanded("test", true);
      expect(getWorkspaceState("test").expanded).toBe(true);
    });
  });

  describe("Toggle Module", () => {
    it("should expand a module", () => {
      const { toggleModule, getWorkspaceState } =
        useSidebarStateStore.getState();

      toggleModule("test", "dashboard");

      const state = getWorkspaceState("test");
      expect(state.expandedModules.has("dashboard")).toBe(true);
    });

    it("should collapse an expanded module", () => {
      const { toggleModule, getWorkspaceState } =
        useSidebarStateStore.getState();

      // Expand
      toggleModule("test", "dashboard");
      expect(getWorkspaceState("test").expandedModules.has("dashboard")).toBe(
        true,
      );

      // Collapse
      toggleModule("test", "dashboard");
      expect(getWorkspaceState("test").expandedModules.has("dashboard")).toBe(
        false,
      );
    });

    it("should handle multiple modules independently", () => {
      const { toggleModule, getWorkspaceState } =
        useSidebarStateStore.getState();

      toggleModule("test", "dashboard");
      toggleModule("test", "inventory");

      const state = getWorkspaceState("test");
      expect(state.expandedModules.has("dashboard")).toBe(true);
      expect(state.expandedModules.has("inventory")).toBe(true);

      // Collapse only dashboard
      toggleModule("test", "dashboard");
      const updatedState = getWorkspaceState("test");
      expect(updatedState.expandedModules.has("dashboard")).toBe(false);
      expect(updatedState.expandedModules.has("inventory")).toBe(true);
    });

    it("should use Set for expandedModules for O(1) operations", () => {
      const { toggleModule, getWorkspaceState } =
        useSidebarStateStore.getState();

      toggleModule("test", "module1");
      const state = getWorkspaceState("test");

      // Verify it's a Set
      expect(state.expandedModules).toBeInstanceOf(Set);
      expect(typeof state.expandedModules.has).toBe("function");
      expect(typeof state.expandedModules.add).toBe("function");
      expect(typeof state.expandedModules.delete).toBe("function");
    });
  });

  describe("Toggle Pin", () => {
    it("should pin an item", () => {
      const { togglePin, getWorkspaceState } = useSidebarStateStore.getState();

      togglePin("test", "inventory");

      const state = getWorkspaceState("test");
      expect(state.pinnedItems.has("inventory")).toBe(true);
    });

    it("should unpin a pinned item", () => {
      const { togglePin, getWorkspaceState } = useSidebarStateStore.getState();

      // Pin
      togglePin("test", "inventory");
      expect(getWorkspaceState("test").pinnedItems.has("inventory")).toBe(true);

      // Unpin
      togglePin("test", "inventory");
      expect(getWorkspaceState("test").pinnedItems.has("inventory")).toBe(
        false,
      );
    });

    it("should use Set for pinnedItems for O(1) operations", () => {
      const { togglePin, getWorkspaceState } = useSidebarStateStore.getState();

      togglePin("test", "item1");
      const state = getWorkspaceState("test");

      expect(state.pinnedItems).toBeInstanceOf(Set);
    });
  });

  describe("Toggle Hide", () => {
    it("should hide an item", () => {
      const { toggleHide, getWorkspaceState } = useSidebarStateStore.getState();

      toggleHide("test", "reports");

      const state = getWorkspaceState("test");
      expect(state.hiddenItems.has("reports")).toBe(true);
    });

    it("should unhide a hidden item", () => {
      const { toggleHide, getWorkspaceState } = useSidebarStateStore.getState();

      // Hide
      toggleHide("test", "reports");
      expect(getWorkspaceState("test").hiddenItems.has("reports")).toBe(true);

      // Unhide
      toggleHide("test", "reports");
      expect(getWorkspaceState("test").hiddenItems.has("reports")).toBe(false);
    });

    it("should use Set for hiddenItems for O(1) operations", () => {
      const { toggleHide, getWorkspaceState } = useSidebarStateStore.getState();

      toggleHide("test", "item1");
      const state = getWorkspaceState("test");

      expect(state.hiddenItems).toBeInstanceOf(Set);
    });
  });

  describe("Sidebar Width", () => {
    it("should set sidebar width", () => {
      const { setSidebarWidth, getWorkspaceState } =
        useSidebarStateStore.getState();

      setSidebarWidth("test", 250);

      expect(getWorkspaceState("test").width).toBe(250);
    });

    it("should clamp width to MIN_WIDTH", () => {
      const { setSidebarWidth, getWorkspaceState } =
        useSidebarStateStore.getState();

      setSidebarWidth("test", 10); // Below MIN_WIDTH

      expect(getWorkspaceState("test").width).toBe(MIN_WIDTH);
    });

    it("should clamp width to MAX_WIDTH", () => {
      const { setSidebarWidth, getWorkspaceState } =
        useSidebarStateStore.getState();

      setSidebarWidth("test", 500); // Above MAX_WIDTH

      expect(getWorkspaceState("test").width).toBe(MAX_WIDTH);
    });

    it("should reset width to default", () => {
      const { setSidebarWidth, resetWidth, getWorkspaceState } =
        useSidebarStateStore.getState();

      setSidebarWidth("test", 250);
      expect(getWorkspaceState("test").width).toBe(250);

      resetWidth("test");
      expect(getWorkspaceState("test").width).toBe(DEFAULT_WIDTH);
    });
  });

  describe("Workspace Scoping", () => {
    it("should maintain separate state for different workspaces", () => {
      const { toggleModule, togglePin, setSidebarWidth, getWorkspaceState } =
        useSidebarStateStore.getState();

      // Workspace 1
      toggleModule("workspace1", "dashboard");
      togglePin("workspace1", "inventory");
      setSidebarWidth("workspace1", 200);

      // Workspace 2
      toggleModule("workspace2", "reports");
      setSidebarWidth("workspace2", 250);

      // Verify workspace 1
      const ws1 = getWorkspaceState("workspace1");
      expect(ws1.expandedModules.has("dashboard")).toBe(true);
      expect(ws1.expandedModules.has("reports")).toBe(false);
      expect(ws1.pinnedItems.has("inventory")).toBe(true);
      expect(ws1.width).toBe(200);

      // Verify workspace 2
      const ws2 = getWorkspaceState("workspace2");
      expect(ws2.expandedModules.has("reports")).toBe(true);
      expect(ws2.expandedModules.has("dashboard")).toBe(false);
      expect(ws2.pinnedItems.has("inventory")).toBe(false);
      expect(ws2.width).toBe(250);
    });
  });

  describe("Helper Functions", () => {
    it("should check if workspace exists", () => {
      const { toggle, hasWorkspace } = useSidebarStateStore.getState();

      expect(hasWorkspace("test")).toBe(false);

      toggle("test");

      expect(hasWorkspace("test")).toBe(true);
    });
  });

  describe("Persistence", () => {
    it("should persist state to localStorage", () => {
      const { toggleModule, togglePin, setSidebarWidth } =
        useSidebarStateStore.getState();

      toggleModule("test", "dashboard");
      togglePin("test", "inventory");
      setSidebarWidth("test", 220);

      // Check localStorage
      const stored = localStorage.getItem("pharmos-sidebar-state");
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.workspaces.test).toBeDefined();
      // Sets are stored as arrays in localStorage
      expect(Array.isArray(parsed.state.workspaces.test.expandedModules)).toBe(
        true,
      );
      expect(parsed.state.workspaces.test.expandedModules).toContain(
        "dashboard",
      );
      expect(parsed.state.workspaces.test.pinnedItems).toContain("inventory");
      expect(parsed.state.workspaces.test.width).toBe(220);
    });

    it("should rehydrate state from localStorage with Sets", () => {
      // Set up initial state
      const { toggleModule, togglePin } = useSidebarStateStore.getState();
      toggleModule("test", "dashboard");
      toggleModule("test", "inventory");
      togglePin("test", "pos");

      // Simulate page reload by rehydrating
      useSidebarStateStore.persist.rehydrate();

      // Verify state is restored with Sets
      const state = useSidebarStateStore.getState();
      const workspaceState = state.workspaces["test"];

      expect(workspaceState).toBeDefined();
      expect(workspaceState.expandedModules).toBeInstanceOf(Set);
      expect(workspaceState.expandedModules.has("dashboard")).toBe(true);
      expect(workspaceState.expandedModules.has("inventory")).toBe(true);
      expect(workspaceState.pinnedItems).toBeInstanceOf(Set);
      expect(workspaceState.pinnedItems.has("pos")).toBe(true);
    });

    it("should convert arrays to Sets when loading from localStorage", () => {
      // Manually set localStorage with arrays (simulating old data format)
      const mockData = {
        state: {
          workspaces: {
            test: {
              expanded: true,
              expandedModules: ["dashboard", "inventory"],
              pinnedItems: ["pos"],
              hiddenItems: [],
              width: 200,
            },
          },
        },
        version: 0,
      };
      localStorage.setItem("pharmos-sidebar-state", JSON.stringify(mockData));

      // Rehydrate
      useSidebarStateStore.persist.rehydrate();

      // Verify Sets are created
      const state = useSidebarStateStore.getState();
      const workspaceState = state.workspaces["test"];

      expect(workspaceState.expandedModules).toBeInstanceOf(Set);
      expect(workspaceState.expandedModules.has("dashboard")).toBe(true);
      expect(workspaceState.expandedModules.has("inventory")).toBe(true);
      expect(workspaceState.pinnedItems).toBeInstanceOf(Set);
      expect(workspaceState.pinnedItems.has("pos")).toBe(true);
    });
  });
});
