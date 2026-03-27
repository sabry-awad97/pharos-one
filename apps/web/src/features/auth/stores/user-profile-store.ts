/**
 * User Profile Zustand store with Immer and localStorage persistence
 * Manages user profiles and current user state
 */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { z } from "zod";

/**
 * User role types
 */
export type UserRole = "pharmacist" | "cashier" | "manager" | "admin";

/**
 * User profile interface
 */
export interface UserProfile {
  id: string; // UUID
  name: string; // Display name
  role: UserRole;
}

/**
 * Zod schema for UserProfile validation
 */
const UserProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  role: z.enum(["pharmacist", "cashier", "manager", "admin"]),
});

/**
 * Zod schema for stored state (localStorage serialization)
 */
const StoredStateSchema = z.object({
  state: z.object({
    users: z.array(UserProfileSchema),
    currentUserId: z.string().uuid().nullable(),
  }),
  version: z.number().optional(),
});

/**
 * User profile store interface
 */
interface UserProfileStore {
  // State
  users: UserProfile[];
  currentUserId: string | null;

  // Actions
  addUser: (name: string, role: UserRole) => string;
  removeUser: (userId: string) => void;
  switchUser: (userId: string) => void;
  updateUser: (
    userId: string,
    updates: Partial<Omit<UserProfile, "id">>,
  ) => void;

  // Helpers
  getCurrentUser: () => UserProfile | null;
  getUserById: (userId: string) => UserProfile | undefined;
}

/**
 * Create user profile store with Zustand + Immer + persist middleware
 */
export const useUserProfileStore = create<UserProfileStore>()(
  persist(
    immer((set, get) => ({
      // Initial state
      users: [],
      currentUserId: null,

      // Add a new user with generated UUID
      addUser: (name: string, role: UserRole) => {
        const newUser: UserProfile = {
          id: crypto.randomUUID(),
          name,
          role,
        };

        set((state) => {
          state.users.push(newUser);
        });

        return newUser.id;
      },

      // Remove a user by ID
      removeUser: (userId: string) =>
        set((state) => {
          state.users = state.users.filter((user) => user.id !== userId);

          // Clear currentUserId if removing the current user
          if (state.currentUserId === userId) {
            state.currentUserId = null;
          }
        }),

      // Switch to a different user
      switchUser: (userId: string) => {
        const currentUserId = get().currentUserId;

        // Save outgoing user's state (if exists)
        if (currentUserId) {
          // Note: resetForUser will be added in Phase 2
          // For now, just log that we would save state
          console.log("Would save state for user:", currentUserId);
        }

        // Update current user
        set((state) => {
          state.currentUserId = userId;
        });

        // Load new user's state
        console.log("Would load state for user:", userId);
      },

      // Update user profile fields
      updateUser: (userId: string, updates: Partial<Omit<UserProfile, "id">>) =>
        set((state) => {
          const user = state.users.find((u) => u.id === userId);
          if (user) {
            if (updates.name !== undefined) {
              user.name = updates.name;
            }
            if (updates.role !== undefined) {
              user.role = updates.role;
            }
          }
        }),

      // Get the current user
      getCurrentUser: () => {
        const { users, currentUserId } = get();
        if (!currentUserId) return null;
        return users.find((u) => u.id === currentUserId) ?? null;
      },

      // Get a user by ID
      getUserById: (userId: string) => {
        return get().users.find((u) => u.id === userId);
      },
    })),
    {
      name: "pharmos-user-profiles",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;

          try {
            const parsed = JSON.parse(str);
            const validated = StoredStateSchema.parse(parsed);

            return {
              state: {
                users: validated.state.users,
                currentUserId: validated.state.currentUserId,
              },
              version: validated.version,
            };
          } catch (error) {
            console.warn(
              "Failed to parse user profiles from localStorage:",
              error,
            );
            return null;
          }
        },
        setItem: (name, newValue) => {
          const toStore = {
            state: {
              users: newValue.state.users,
              currentUserId: newValue.state.currentUserId,
            },
            version: newValue.version,
          };

          localStorage.setItem(name, JSON.stringify(toStore));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
