/**
 * Inventory hooks using TanStack Query
 * Reusable hooks for inventory operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inventoryApi } from "@/lib/api/inventory.api";
import { queryKeys } from "@/lib/query-keys";
import type { Medicine } from "@pharos-one/schema/inventory";

/**
 * Get all medicines
 */
export function useInventory() {
  return useQuery({
    queryKey: queryKeys.inventory.list(),
    queryFn: inventoryApi.getAll,
  });
}

/**
 * Get medicine by ID
 */
export function useMedicine(id: string) {
  return useQuery({
    queryKey: queryKeys.inventory.detail(id),
    queryFn: () => inventoryApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Create new medicine
 */
export function useCreateMedicine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.create,
    onSuccess: (newMedicine) => {
      // Invalidate and refetch inventory list
      queryClient.invalidateQueries({
        queryKey: queryKeys.inventory.lists(),
      });

      // Optimistically update the cache
      queryClient.setQueryData<Medicine[]>(
        queryKeys.inventory.list(),
        (old) => {
          if (!old) return [newMedicine];
          return [...old, newMedicine];
        },
      );
    },
  });
}

/**
 * Update stock quantity
 */
export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.updateStock,
    onSuccess: (updatedMedicine) => {
      // Invalidate list
      queryClient.invalidateQueries({
        queryKey: queryKeys.inventory.lists(),
      });

      // Update specific medicine in cache
      queryClient.setQueryData(
        queryKeys.inventory.detail(updatedMedicine.id),
        updatedMedicine,
      );

      // Optimistically update in list
      queryClient.setQueryData<Medicine[]>(
        queryKeys.inventory.list(),
        (old) => {
          if (!old) return [updatedMedicine];
          return old.map((medicine) =>
            medicine.id === updatedMedicine.id ? updatedMedicine : medicine,
          );
        },
      );
    },
  });
}
