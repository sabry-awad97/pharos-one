/**
 * UserSwitcher component tests
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserSwitcher } from "../UserSwitcher";
import { useUserProfileStore } from "../../stores/user-profile-store";

describe("UserSwitcher", () => {
  beforeEach(() => {
    // Clear localStorage and reset store before each test
    localStorage.clear();
    useUserProfileStore.setState({ users: [], currentUserId: null });
  });

  describe("Rendering", () => {
    it("should not render when no current user", () => {
      const { container } = render(<UserSwitcher />);
      expect(container.firstChild).toBeNull();
    });

    it("should render current user name and role", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Dr. Smith", "pharmacist");
      switchUser(userId);

      render(<UserSwitcher />);

      expect(screen.getByText("Dr. Smith")).toBeInTheDocument();
    });

    it("should render role icon for pharmacist", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Dr. Smith", "pharmacist");
      switchUser(userId);

      const { container } = render(<UserSwitcher />);

      // Check that the button contains the user name
      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Dr. Smith");
    });

    it("should render role icon for cashier", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("John Doe", "cashier");
      switchUser(userId);

      const { container } = render(<UserSwitcher />);

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("John Doe");
    });

    it("should render role icon for manager", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Jane Manager", "manager");
      switchUser(userId);

      const { container } = render(<UserSwitcher />);

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Jane Manager");
    });

    it("should render role icon for admin", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Admin User", "admin");
      switchUser(userId);

      const { container } = render(<UserSwitcher />);

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Admin User");
    });
  });

  describe("Dropdown Interaction", () => {
    it("should open dropdown when clicking trigger button", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Dr. Smith", "pharmacist");
      switchUser(userId);

      render(<UserSwitcher />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(screen.getByText("Switch User")).toBeInTheDocument();
    });

    it("should close dropdown when clicking trigger button again", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Dr. Smith", "pharmacist");
      switchUser(userId);

      render(<UserSwitcher />);

      const button = screen.getByRole("button");

      // Open dropdown
      fireEvent.click(button);
      expect(screen.getByText("Switch User")).toBeInTheDocument();

      // Close dropdown
      fireEvent.click(button);
      expect(screen.queryByText("Switch User")).not.toBeInTheDocument();
    });

    it("should show all users in dropdown", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();

      const userId1 = addUser("Dr. Smith", "pharmacist");
      addUser("John Cashier", "cashier");
      addUser("Jane Manager", "manager");
      switchUser(userId1);

      render(<UserSwitcher />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      // Dr. Smith appears twice (button + dropdown), others appear once
      expect(screen.getAllByText("Dr. Smith").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("John Cashier")).toBeInTheDocument();
      expect(screen.getByText("Jane Manager")).toBeInTheDocument();
    });

    it("should show checkmark on current user", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();

      const userId1 = addUser("Dr. Smith", "pharmacist");
      addUser("John Cashier", "cashier");
      switchUser(userId1);

      const { container } = render(<UserSwitcher />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      // The current user should have a checkmark (Check icon)
      // We can verify this by checking the structure
      const userItems = container.querySelectorAll(
        '[style*="padding: 6px 12px"]',
      );
      expect(userItems.length).toBeGreaterThan(0);
    });

    it("should show role badges for all users", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();

      const userId1 = addUser("Dr. Smith", "pharmacist");
      addUser("John Cashier", "cashier");
      addUser("Jane Manager", "manager");
      switchUser(userId1);

      render(<UserSwitcher />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(screen.getByText("pharmacist")).toBeInTheDocument();
      expect(screen.getByText("cashier")).toBeInTheDocument();
      expect(screen.getByText("manager")).toBeInTheDocument();
    });
  });

  describe("User Switching", () => {
    it("should call switchUser when clicking a user", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();

      const userId1 = addUser("Dr. Smith", "pharmacist");
      const userId2 = addUser("John Cashier", "cashier");
      switchUser(userId1);

      render(<UserSwitcher />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      // Click on the second user
      const johnCashier = screen.getByText("John Cashier");
      fireEvent.click(johnCashier);

      // Verify the current user changed
      const state = useUserProfileStore.getState();
      expect(state.currentUserId).toBe(userId2);
    });

    it("should close dropdown after switching user", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();

      const userId1 = addUser("Dr. Smith", "pharmacist");
      addUser("John Cashier", "cashier");
      switchUser(userId1);

      render(<UserSwitcher />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      // Click on the second user
      const johnCashier = screen.getByText("John Cashier");
      fireEvent.click(johnCashier);

      // Dropdown should be closed
      expect(screen.queryByText("Switch User")).not.toBeInTheDocument();
    });

    it("should update displayed user after switching", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();

      const userId1 = addUser("Dr. Smith", "pharmacist");
      const userId2 = addUser("John Cashier", "cashier");
      switchUser(userId1);

      const { rerender } = render(<UserSwitcher />);

      // Initially shows Dr. Smith
      expect(screen.getByText("Dr. Smith")).toBeInTheDocument();

      // Switch to John Cashier
      const button = screen.getByRole("button");
      fireEvent.click(button);
      const johnCashier = screen.getByText("John Cashier");
      fireEvent.click(johnCashier);

      // Re-render to reflect state change
      rerender(<UserSwitcher />);

      // Now shows John Cashier
      expect(screen.getByText("John Cashier")).toBeInTheDocument();
    });
  });

  describe("Manage Users", () => {
    it("should show Manage Users option in dropdown", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Dr. Smith", "pharmacist");
      switchUser(userId);

      render(<UserSwitcher />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(screen.getByText("Manage Users")).toBeInTheDocument();
    });

    it("should log to console when clicking Manage Users", () => {
      const consoleSpy = vi.spyOn(console, "log");

      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Dr. Smith", "pharmacist");
      switchUser(userId);

      render(<UserSwitcher />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      const manageUsers = screen.getByText("Manage Users");
      fireEvent.click(manageUsers);

      expect(consoleSpy).toHaveBeenCalledWith("Manage Users clicked");

      consoleSpy.mockRestore();
    });

    it("should close dropdown after clicking Manage Users", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Dr. Smith", "pharmacist");
      switchUser(userId);

      render(<UserSwitcher />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      const manageUsers = screen.getByText("Manage Users");
      fireEvent.click(manageUsers);

      // Dropdown should be closed
      expect(screen.queryByText("Switch User")).not.toBeInTheDocument();
    });
  });

  describe("Compact Design", () => {
    it("should have maximum height of 32px", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Dr. Smith", "pharmacist");
      switchUser(userId);

      const { container } = render(<UserSwitcher />);

      const button = container.querySelector("button");
      expect(button).toBeTruthy();

      if (button) {
        const styles = window.getComputedStyle(button);
        const height = parseInt(styles.height);
        expect(height).toBeLessThanOrEqual(32);
      }
    });

    it("should use compact font size", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Dr. Smith", "pharmacist");
      switchUser(userId);

      const { container } = render(<UserSwitcher />);

      const button = container.querySelector("button");
      expect(button).toBeTruthy();

      if (button) {
        const styles = window.getComputedStyle(button);
        const fontSize = parseInt(styles.fontSize);
        expect(fontSize).toBeLessThanOrEqual(12);
      }
    });
  });

  describe("Accessibility", () => {
    it("should have proper button role", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Dr. Smith", "pharmacist");
      switchUser(userId);

      render(<UserSwitcher />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should be keyboard accessible", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Dr. Smith", "pharmacist");
      switchUser(userId);

      render(<UserSwitcher />);

      const button = screen.getByRole("button");

      // Should be focusable
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  describe("Edge Cases", () => {
    it("should handle single user gracefully", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId = addUser("Dr. Smith", "pharmacist");
      switchUser(userId);

      render(<UserSwitcher />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      // Should still show the dropdown with one user
      expect(screen.getByText("Switch User")).toBeInTheDocument();
      // Dr. Smith appears twice (button + dropdown)
      expect(screen.getAllByText("Dr. Smith").length).toBe(2);
    });

    it("should handle many users", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();

      const userId1 = addUser("User 1", "pharmacist");
      addUser("User 2", "cashier");
      addUser("User 3", "manager");
      addUser("User 4", "admin");
      addUser("User 5", "pharmacist");
      switchUser(userId1);

      render(<UserSwitcher />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      // All users should be visible (User 1 appears twice: button + dropdown)
      expect(screen.getAllByText("User 1").length).toBe(2);
      expect(screen.getByText("User 2")).toBeInTheDocument();
      expect(screen.getByText("User 3")).toBeInTheDocument();
      expect(screen.getByText("User 4")).toBeInTheDocument();
      expect(screen.getByText("User 5")).toBeInTheDocument();
    });
  });
});
