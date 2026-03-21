/**
 * Query keys for TanStack Query
 * Centralized to ensure consistency and type safety
 */

export const queryKeys = {
  inventory: {
    all: ["inventory"] as const,
    lists: () => [...queryKeys.inventory.all, "list"] as const,
    list: () => [...queryKeys.inventory.lists()] as const,
    details: () => [...queryKeys.inventory.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.inventory.details(), id] as const,
  },
  // Add more features as needed
  // prescriptions: { ... },
  // sales: { ... },
} as const;
