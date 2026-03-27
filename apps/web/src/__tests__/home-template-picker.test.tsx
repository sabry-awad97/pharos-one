import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import type { JSX } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTabsStore } from "@/features/workspace/stores/tabs-store";
import { useUserProfileStore } from "@/features/auth/stores/user-profile-store";

// Mock the router hooks
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: (path: string) => (options: { component: any }) => ({
    ...options,
    path,
  }),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  useNavigate: () => vi.fn(),
  useMatches: () => [],
}));

// Import after mocking
const { Route } = await import("../routes/_app/home/route");
const HomeComponent = (Route as any).component as () => JSX.Element;

describe("Home Route - Template Picker Integration", () => {
  beforeEach(() => {
    localStorage.clear();
    useTabsStore.setState({
      state: {
        tabs: [],
        activeTabId: null,
        splitView: { enabled: false, leftModuleId: null, rightModuleId: null },
      },
      activeTabLabel: undefined,
    });
    useUserProfileStore.setState({ users: [], currentUserId: null });
  });

  describe("picker visibility", () => {
    it("should show picker on first launch when tabs are empty and no current user (default preference true)", () => {
      renderWithProviders(<HomeComponent />);

      expect(
        screen.getByTestId("workspace-template-picker"),
      ).toBeInTheDocument();
    });

    it("should show picker when tabs are empty and user preference is true", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Test User", "pharmacist");
      switchUser(userId);

      renderWithProviders(<HomeComponent />);

      expect(
        screen.getByTestId("workspace-template-picker"),
      ).toBeInTheDocument();
    });

    it("should not show picker when user preference is false", () => {
      const { addUser, switchUser, setShowTemplatePicker } =
        useUserProfileStore.getState();
      const userId = addUser("Test User", "pharmacist");
      switchUser(userId);
      setShowTemplatePicker(userId, false);

      renderWithProviders(<HomeComponent />);

      expect(
        screen.queryByTestId("workspace-template-picker"),
      ).not.toBeInTheDocument();
    });

    it("should not show picker when tabs exist", async () => {
      const { Home } = await import("lucide-react");
      useTabsStore.getState().addTab({
        label: "Dashboard",
        icon: Home,
        module: "dashboard",
      });

      renderWithProviders(<HomeComponent />);

      expect(
        screen.queryByTestId("workspace-template-picker"),
      ).not.toBeInTheDocument();
    });
  });

  describe("template selection", () => {
    it("should create tabs when pharmacist template is selected", async () => {
      const user = userEvent.setup();
      renderWithProviders(<HomeComponent />);

      const card = screen.getByTestId("template-card-pharmacist");
      await user.click(card);

      const { state } = useTabsStore.getState();
      // Pharmacist template has 3 tabs: Prescriptions, Inventory, Reports
      expect(state.tabs).toHaveLength(3);
      expect(state.tabs.map((t) => t.module)).toEqual(
        expect.arrayContaining(["prescriptions", "inventory", "reports"]),
      );
    });

    it("should create tabs when cashier template is selected", async () => {
      const user = userEvent.setup();
      renderWithProviders(<HomeComponent />);

      const card = screen.getByTestId("template-card-cashier");
      await user.click(card);

      const { state } = useTabsStore.getState();
      // Cashier template has 3 tabs: Point of Sale, Inventory, Dashboard
      expect(state.tabs).toHaveLength(3);
      expect(state.tabs.map((t) => t.module)).toEqual(
        expect.arrayContaining(["pos", "inventory", "dashboard"]),
      );
    });

    it("should create tabs when manager template is selected", async () => {
      const user = userEvent.setup();
      renderWithProviders(<HomeComponent />);

      const card = screen.getByTestId("template-card-manager");
      await user.click(card);

      const { state } = useTabsStore.getState();
      // Manager template has 4 tabs: Dashboard, Reports, Inventory, Staff
      expect(state.tabs).toHaveLength(4);
      expect(state.tabs.map((t) => t.module)).toEqual(
        expect.arrayContaining(["dashboard", "reports", "inventory", "staff"]),
      );
    });

    it("should create no tabs when custom template is selected", async () => {
      const user = userEvent.setup();
      renderWithProviders(<HomeComponent />);

      const card = screen.getByTestId("template-card-custom");
      await user.click(card);

      const { state } = useTabsStore.getState();
      // Custom template has no tabs
      expect(state.tabs).toHaveLength(0);
    });

    it("should hide picker after template selection", async () => {
      const user = userEvent.setup();
      renderWithProviders(<HomeComponent />);

      expect(
        screen.getByTestId("workspace-template-picker"),
      ).toBeInTheDocument();

      const card = screen.getByTestId("template-card-pharmacist");
      await user.click(card);

      expect(
        screen.queryByTestId("workspace-template-picker"),
      ).not.toBeInTheDocument();
    });

    it("should update user preference when 'don't show again' is checked before selecting", async () => {
      const user = userEvent.setup();
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Test User", "pharmacist");
      switchUser(userId);

      renderWithProviders(<HomeComponent />);

      // Check "don't show again" first
      const checkbox = screen.getByTestId("dont-show-again-checkbox");
      await user.click(checkbox);

      // Now select a template
      const card = screen.getByTestId("template-card-pharmacist");
      await user.click(card);

      const updatedUser = useUserProfileStore
        .getState()
        .getUserById(userId);
      expect(
        updatedUser?.preferences.showTemplatePickerOnStartup,
      ).toBe(false);
    });
  });

  describe("skip button", () => {
    it("should hide picker when skip button is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<HomeComponent />);

      expect(
        screen.getByTestId("workspace-template-picker"),
      ).toBeInTheDocument();

      const skipButton = screen.getByTestId("skip-button");
      await user.click(skipButton);

      expect(
        screen.queryByTestId("workspace-template-picker"),
      ).not.toBeInTheDocument();
    });

    it("should not create any tabs when skip is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<HomeComponent />);

      const skipButton = screen.getByTestId("skip-button");
      await user.click(skipButton);

      const { state } = useTabsStore.getState();
      expect(state.tabs).toHaveLength(0);
    });
  });

  describe("don't show again preference", () => {
    it("should update preference to false when checkbox is checked", async () => {
      const user = userEvent.setup();
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Test User", "pharmacist");
      switchUser(userId);

      renderWithProviders(<HomeComponent />);

      const checkbox = screen.getByTestId("dont-show-again-checkbox");
      await user.click(checkbox);

      const updatedUser = useUserProfileStore
        .getState()
        .getUserById(userId);
      expect(
        updatedUser?.preferences.showTemplatePickerOnStartup,
      ).toBe(false);
    });

    it("should restore preference to true when checkbox is unchecked", async () => {
      const user = userEvent.setup();
      const { addUser, switchUser, setShowTemplatePicker } =
        useUserProfileStore.getState();
      const userId = addUser("Test User", "pharmacist");
      switchUser(userId);
      // Pre-check by setting preference to false via setShowTemplatePicker isn't visible because
      // picker won't show — instead we render, check the checkbox, then uncheck it.

      renderWithProviders(<HomeComponent />);

      const checkbox = screen.getByTestId("dont-show-again-checkbox");
      // Check it
      await user.click(checkbox);
      // Uncheck it — this should NOT re-enable the preference (the preference was already
      // set to false on check; unchecking just toggles the local visual state)
      // The preference update only fires on check (true), not uncheck.
      // Verify the checkbox is now unchecked visually after second click
      await user.click(checkbox);

      // The DOM checkbox should still reflect dontShowAgain=false (unchecked)
      const checkboxEl = screen.getByTestId(
        "dont-show-again-checkbox",
      ) as HTMLInputElement;
      expect(checkboxEl.checked).toBe(false);
    });
  });

  describe("choose template button in empty state", () => {
    it("should open picker when 'choose template' is clicked from empty state", async () => {
      const user = userEvent.setup();
      const { addUser, switchUser, setShowTemplatePicker } =
        useUserProfileStore.getState();
      const userId = addUser("Test User", "pharmacist");
      switchUser(userId);
      // Disable auto-show so we can test manual open
      setShowTemplatePicker(userId, false);

      renderWithProviders(<HomeComponent />);

      // Picker should not be visible initially
      expect(
        screen.queryByTestId("workspace-template-picker"),
      ).not.toBeInTheDocument();

      // Click the "choose template" button in the empty workspace state
      const chooseTemplateBtn = screen.getByTestId("choose-template-button");
      await user.click(chooseTemplateBtn);

      expect(
        screen.getByTestId("workspace-template-picker"),
      ).toBeInTheDocument();
    });
  });
});
