/**
 * Supplier data hooks using TanStack Query
 */

import { useQuery } from "@tanstack/react-query";
import {
  fetchSuppliers,
  fetchSupplierById,
} from "../services/supplier.service";

/**
 * Hook to fetch all suppliers
 *
 * @example
 * const { data: suppliers, isLoading } = useSuppliers();
 */
export function useSuppliers() {
  return useQuery({
    queryKey: ["inventory", "suppliers"],
    queryFn: fetchSuppliers,
    staleTime: 1000 * 60 * 10, // Suppliers change less frequently
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch a single supplier by ID
 *
 * @example
 * const { data: supplier, isLoading } = useSupplier(3);
 */
export function useSupplier(id: number) {
  return useQuery({
    queryKey: ["inventory", "supplier", id],
    queryFn: () => fetchSupplierById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}
