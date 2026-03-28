/**
 * Tab routing behavior tests
 *
 * Verifies that tab clicks always navigate to the canonical leaf route,
 * preventing stale content when switching tabs after repeated clicks.
 */

import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import type { JSX } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useTabsStore } from "@/features/workspace/stores/tabs-store";
import { Package, Users } from "lucide-react";

// Capture navigate calls
const navigateMock = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: (path: string) => (options: { component: any }) => ({
    ...options,
    path,
  }),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  useNavigate: () => navigateMock,
  useMatches: () => [],
}));

const { Route } = await import("../routes/_app/home/route");
const HomeComponent = (Route as any).component as () => JSX.Element;

const seedTabs = () =>
  useTabsStore.setState({
    state: {
      tabs: [
        {
          id: "inventory-tab",
          label: "Inventory",
          icon: Package,
          module: "inventory",
        },
        {
          id: "staff-tab",
          label: "Staff",
          icon: Users,
          module: "staff",
        },
      ],
      activeTabId: "inventory-tab",
      splitView: { enabled: false, leftModuleId: null, rightModuleId: null },
    },
    activeTabLabel: "Inventory",
  });

const clearTabs = () =>
  useTabsStore.setState({
    state: {
      tabs: [],
      activeTabId: null,
      splitView: { enabled: false, leftModuleId: null, rightModuleId: null },
    },
    activeTabLabel: undefined,
  });

describe("Tab routing - leaf route navigation", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    seedTabs();
  });
  afterEach(clearTabs);

  it("should navigate to the leaf route when clicking the inventory tab", async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomeComponent />);

    const inventoryTab = screen.getByRole("tab", { name: /inventory/i });
    await user.click(inventoryTab);

    // Must navigate directly to leaf route, NOT the index that redirects
    expect(navigateMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: "/home/inventory/all" }),
    );
    expect(navigateMock).not.toHaveBeenCalledWith(
      expect.objectContaining({ to: "/home/inventory" }),
    );
  });

  it("should navigate to the leaf route when clicking the staff tab", async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomeComponent />);

    const staffTab = screen.getByRole("tab", { name: /staff/i });
    await user.click(staffTab);

    expect(navigateMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: "/home/staff/overview" }),
    );
    expect(navigateMock).not.toHaveBeenCalledWith(
      expect.objectContaining({ to: "/home/staff" }),
    );
  });

  it("should navigate to the correct leaf route after clicking inventory multiple times then clicking staff", async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomeComponent />);

    const inventoryTab = screen.getByRole("tab", { name: /inventory/i });
    const staffTab = screen.getByRole("tab", { name: /staff/i });

    // Click inventory multiple times
    await user.click(inventoryTab);
    await user.click(inventoryTab);
    await user.click(inventoryTab);

    navigateMock.mockClear();

    // Now click staff
    await user.click(staffTab);

    // Should navigate to staff leaf route, not inventory
    expect(navigateMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: "/home/staff/overview" }),
    );
    expect(navigateMock).not.toHaveBeenCalledWith(
      expect.objectContaining({ to: "/home/inventory" }),
    );
    expect(navigateMock).not.toHaveBeenCalledWith(
      expect.objectContaining({ to: "/home/inventory/all" }),
    );
  });

  it("should set the correct active tab in the store when clicking a tab", async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomeComponent />);

    const staffTab = screen.getByRole("tab", { name: /staff/i });
    await user.click(staffTab);

    const { state } = useTabsStore.getState();
    expect(state.activeTabId).toBe("staff-tab");
  });
});
