import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  useUserProfileStore,
  type UserProfile,
  type UserRole,
} from "../user-profile-store";

describe("User Profile Store", () => {
  beforeEach(() => {
    // Clear localStorage and reset store before each test
    localStorage.clear();
    useUserProfileStore.setState({ users: [], currentUserId: null });
  });

  describe("Initial State", () => {
    it("should have empty users array initially", () => {
      const state = useUserProfileStore.getState();
      expect(state.users).toEqual([]);
    });

    it("should have null currentUserId initially", () => {
      const state = useUserProfileStore.getState();
      expect(state.currentUserId).toBeNull();
    });
  });

  describe("addUser", () => {
    it("should add a new user with generated UUID", () => {
      const { addUser } = useUserProfileStore.getState();

      const userId = addUser("John Doe", "pharmacist");

      const state = useUserProfileStore.getState();
      expect(state.users).toHaveLength(1);
      expect(state.users[0].id).toBe(userId);
      expect(state.users[0].name).toBe("John Doe");
      expect(state.users[0].role).toBe("pharmacist");
    });

    it("should generate valid UUID for user ID", () => {
      const { addUser } = useUserProfileStore.getState();

      const userId = addUser("Jane Smith", "cashier");

      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(userId).toMatch(uuidRegex);
    });

    it("should add multiple users with unique IDs", () => {
      const { addUser } = useUserProfileStore.getState();

      const userId1 = addUser("User 1", "pharmacist");
      const userId2 = addUser("User 2", "manager");
      const userId3 = addUser("User 3", "admin");

      const state = useUserProfileStore.getState();
      expect(state.users).toHaveLength(3);
      expect(userId1).not.toBe(userId2);
      expect(userId2).not.toBe(userId3);
      expect(userId1).not.toBe(userId3);
    });

    it("should support all user roles", () => {
      const { addUser } = useUserProfileStore.getState();

      addUser("Pharmacist User", "pharmacist");
      addUser("Cashier User", "cashier");
      addUser("Manager User", "manager");
      addUser("Admin User", "admin");

      const state = useUserProfileStore.getState();
      expect(state.users).toHaveLength(4);
      expect(state.users[0].role).toBe("pharmacist");
      expect(state.users[1].role).toBe("cashier");
      expect(state.users[2].role).toBe("manager");
      expect(state.users[3].role).toBe("admin");
    });
  });

  describe("removeUser", () => {
    it("should remove a user by ID", () => {
      const { addUser, removeUser } = useUserProfileStore.getState();

      const userId = addUser("John Doe", "pharmacist");
      expect(useUserProfileStore.getState().users).toHaveLength(1);

      removeUser(userId);
      expect(useUserProfileStore.getState().users).toHaveLength(0);
    });

    it("should clear currentUserId when removing current user", () => {
      const { addUser, removeUser, switchUser } =
        useUserProfileStore.getState();

      const userId = addUser("John Doe", "pharmacist");
      switchUser(userId);

      expect(useUserProfileStore.getState().currentUserId).toBe(userId);

      removeUser(userId);

      const state = useUserProfileStore.getState();
      expect(state.currentUserId).toBeNull();
      expect(state.users).toHaveLength(0);
    });

    it("should not clear currentUserId when removing different user", () => {
      const { addUser, removeUser, switchUser } =
        useUserProfileStore.getState();

      const userId1 = addUser("User 1", "pharmacist");
      const userId2 = addUser("User 2", "cashier");
      switchUser(userId1);

      expect(useUserProfileStore.getState().currentUserId).toBe(userId1);

      removeUser(userId2);

      const state = useUserProfileStore.getState();
      expect(state.currentUserId).toBe(userId1);
      expect(state.users).toHaveLength(1);
    });

    it("should handle removing non-existent user gracefully", () => {
      const { addUser, removeUser } = useUserProfileStore.getState();

      addUser("User 1", "pharmacist");
      const initialLength = useUserProfileStore.getState().users.length;

      removeUser("non-existent-id");

      expect(useUserProfileStore.getState().users).toHaveLength(initialLength);
    });
  });

  describe("switchUser", () => {
    it("should update currentUserId", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();

      const userId = addUser("John Doe", "pharmacist");
      switchUser(userId);

      expect(useUserProfileStore.getState().currentUserId).toBe(userId);
    });

    it("should log placeholder messages for state coordination", () => {
      const consoleSpy = vi.spyOn(console, "log");
      const { addUser, switchUser } = useUserProfileStore.getState();

      const userId1 = addUser("User 1", "pharmacist");
      const userId2 = addUser("User 2", "cashier");

      switchUser(userId1);
      consoleSpy.mockClear();

      switchUser(userId2);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Would save state for user:",
        userId1,
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Would load state for user:",
        userId2,
      );

      consoleSpy.mockRestore();
    });

    it("should not log save message when no current user", () => {
      const consoleSpy = vi.spyOn(console, "log");
      const { addUser, switchUser } = useUserProfileStore.getState();

      const userId = addUser("User 1", "pharmacist");

      switchUser(userId);

      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("Would save state"),
        expect.anything(),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Would load state for user:",
        userId,
      );

      consoleSpy.mockRestore();
    });
  });

  describe("updateUser", () => {
    it("should update user name", () => {
      const { addUser, updateUser } = useUserProfileStore.getState();

      const userId = addUser("John Doe", "pharmacist");
      updateUser(userId, { name: "Jane Doe" });

      const state = useUserProfileStore.getState();
      const user = state.users.find((u) => u.id === userId);
      expect(user?.name).toBe("Jane Doe");
      expect(user?.role).toBe("pharmacist");
    });

    it("should update user role", () => {
      const { addUser, updateUser } = useUserProfileStore.getState();

      const userId = addUser("John Doe", "pharmacist");
      updateUser(userId, { role: "manager" });

      const state = useUserProfileStore.getState();
      const user = state.users.find((u) => u.id === userId);
      expect(user?.name).toBe("John Doe");
      expect(user?.role).toBe("manager");
    });

    it("should update both name and role", () => {
      const { addUser, updateUser } = useUserProfileStore.getState();

      const userId = addUser("John Doe", "pharmacist");
      updateUser(userId, { name: "Jane Smith", role: "admin" });

      const state = useUserProfileStore.getState();
      const user = state.users.find((u) => u.id === userId);
      expect(user?.name).toBe("Jane Smith");
      expect(user?.role).toBe("admin");
    });

    it("should handle updating non-existent user gracefully", () => {
      const { addUser, updateUser } = useUserProfileStore.getState();

      addUser("User 1", "pharmacist");
      const initialState = useUserProfileStore.getState().users;

      updateUser("non-existent-id", { name: "New Name" });

      expect(useUserProfileStore.getState().users).toEqual(initialState);
    });
  });

  describe("Helper Functions", () => {
    it("getCurrentUser should return current user", () => {
      const { addUser, switchUser, getCurrentUser } =
        useUserProfileStore.getState();

      const userId = addUser("John Doe", "pharmacist");
      switchUser(userId);

      const currentUser = getCurrentUser();
      expect(currentUser).not.toBeNull();
      expect(currentUser?.id).toBe(userId);
      expect(currentUser?.name).toBe("John Doe");
      expect(currentUser?.role).toBe("pharmacist");
    });

    it("getCurrentUser should return null when no current user", () => {
      const { getCurrentUser } = useUserProfileStore.getState();

      const currentUser = getCurrentUser();
      expect(currentUser).toBeNull();
    });

    it("getCurrentUser should return null when currentUserId is invalid", () => {
      const { addUser, getCurrentUser } = useUserProfileStore.getState();

      addUser("User 1", "pharmacist");
      useUserProfileStore.setState({ currentUserId: "invalid-id" });

      const currentUser = getCurrentUser();
      expect(currentUser).toBeNull();
    });

    it("getUserById should return user by ID", () => {
      const { addUser, getUserById } = useUserProfileStore.getState();

      const userId = addUser("John Doe", "pharmacist");

      const user = getUserById(userId);
      expect(user).toBeDefined();
      expect(user?.id).toBe(userId);
      expect(user?.name).toBe("John Doe");
    });

    it("getUserById should return undefined for non-existent user", () => {
      const { getUserById } = useUserProfileStore.getState();

      const user = getUserById("non-existent-id");
      expect(user).toBeUndefined();
    });
  });

  describe("Persistence", () => {
    it("should persist users to localStorage", () => {
      const { addUser } = useUserProfileStore.getState();

      const userId = addUser("John Doe", "pharmacist");

      const stored = localStorage.getItem("pharmos-user-profiles");
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.users).toHaveLength(1);
      expect(parsed.state.users[0].id).toBe(userId);
      expect(parsed.state.users[0].name).toBe("John Doe");
      expect(parsed.state.users[0].role).toBe("pharmacist");
    });

    it("should persist currentUserId to localStorage", () => {
      const { addUser, switchUser } = useUserProfileStore.getState();

      const userId = addUser("John Doe", "pharmacist");
      switchUser(userId);

      const stored = localStorage.getItem("pharmos-user-profiles");
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.currentUserId).toBe(userId);
    });

    it("should rehydrate state from localStorage", () => {
      // Set up initial state
      const { addUser, switchUser } = useUserProfileStore.getState();
      const userId1 = addUser("User 1", "pharmacist");
      const userId2 = addUser("User 2", "cashier");
      switchUser(userId1);

      // Simulate page reload by rehydrating
      useUserProfileStore.persist.rehydrate();

      // Verify state is restored
      const state = useUserProfileStore.getState();
      expect(state.users).toHaveLength(2);
      expect(state.users[0].name).toBe("User 1");
      expect(state.users[1].name).toBe("User 2");
      expect(state.currentUserId).toBe(userId1);
    });

    it("should validate data with Zod schema on rehydration", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Manually set invalid data in localStorage
      const invalidData = {
        state: {
          users: [
            {
              id: "not-a-uuid", // Invalid UUID
              name: "John Doe",
              role: "pharmacist",
            },
          ],
          currentUserId: null,
        },
        version: 0,
      };
      localStorage.setItem(
        "pharmos-user-profiles",
        JSON.stringify(invalidData),
      );

      // Rehydrate should fail validation and return null
      useUserProfileStore.persist.rehydrate();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to parse user profiles from localStorage:",
        expect.anything(),
      );

      consoleSpy.mockRestore();
    });

    it("should handle invalid JSON in localStorage gracefully", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Set invalid JSON
      localStorage.setItem("pharmos-user-profiles", "invalid json");

      // Rehydrate should handle error gracefully
      useUserProfileStore.persist.rehydrate();

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should handle missing localStorage data gracefully", () => {
      // Ensure localStorage is empty
      localStorage.clear();

      // Rehydrate should not throw
      expect(() => {
        useUserProfileStore.persist.rehydrate();
      }).not.toThrow();

      const state = useUserProfileStore.getState();
      expect(state.users).toEqual([]);
      expect(state.currentUserId).toBeNull();
    });

    it("should persist complete user workflow", () => {
      const { addUser, switchUser, updateUser, removeUser } =
        useUserProfileStore.getState();

      // Add users
      const userId1 = addUser("User 1", "pharmacist");
      const userId2 = addUser("User 2", "cashier");
      const userId3 = addUser("User 3", "manager");

      // Switch user
      switchUser(userId1);

      // Update user
      updateUser(userId2, { name: "Updated User 2", role: "admin" });

      // Remove user
      removeUser(userId3);

      // Rehydrate
      useUserProfileStore.persist.rehydrate();

      // Verify all changes persisted
      const state = useUserProfileStore.getState();
      expect(state.users).toHaveLength(2);
      expect(state.users.find((u) => u.id === userId1)?.name).toBe("User 1");
      expect(state.users.find((u) => u.id === userId2)?.name).toBe(
        "Updated User 2",
      );
      expect(state.users.find((u) => u.id === userId2)?.role).toBe("admin");
      expect(state.users.find((u) => u.id === userId3)).toBeUndefined();
      expect(state.currentUserId).toBe(userId1);
    });
  });
});
