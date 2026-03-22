/**
 * Drug data hooks using TanStack Query
 */

import { useQuery } from "@tanstack/react-query";
import { fetchDrugs, fetchDrugById } from "../services/drug.service";

/**
 * Hook to fetch all drugs in inventory
 *
 * @example
 * const { data: drugs, isLoading, error } = useDrugs();
 */
export function useDrugs() {
  return useQuery({
    queryKey: ["inventory", "drugs"],
    queryFn: fetchDrugs,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch a single drug by ID
 *
 * @example
 * const { data: drug, isLoading } = useDrug(5);
 */
export function useDrug(id: number) {
  return useQuery({
    queryKey: ["inventory", "drug", id],
    queryFn: () => fetchDrugById(id),
    enabled: !!id, // Only fetch if ID is provided
    staleTime: 1000 * 60 * 5,
  });
}
