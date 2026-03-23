/**
 * Supplier data hooks using TanStack DB
 * Migrated from TanStack Query to TanStack DB with eager mode
 */

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLiveQuery, eq } from "@tanstack/react-db";
import { createSupplierCollection } from "../collections/supplier.collection";
import { wrapLiveQuery } from "./utils/hook-wrapper";
import type { QueryResult } from "./utils/hook-wrapper";
import type { Supplier } from "../schema";

/**
 * Hook to fetch all suppliers with live updates
 *
 * Uses TanStack DB eager mode for instant access to ~10 suppliers.
 * The hook API remains backward-compatible with TanStack Query.
 *
 * @example
 * const { data: suppliers, isLoading } = useSuppliers();
 */
export function useSuppliers(): QueryResult<Supplier[]> {
  const queryClient = useQueryClient();

  // Create collection with QueryClient (memoized)
  const supplierCollection = useMemo(
    () => createSupplierCollection(queryClient),
    [queryClient],
  );

  const liveResult = useLiveQuery((q) =>
    q.from({ supplier: supplierCollection }),
  );

  return wrapLiveQuery(liveResult);
}

/**
 * Hook to fetch a single supplier by ID with live updates
 *
 * @example
 * const { data: supplier, isLoading } = useSupplier(3);
 */
export function useSupplier(id: number): QueryResult<Supplier | undefined> {
  const queryClient = useQueryClient();

  // Create collection with QueryClient (memoized)
  const supplierCollection = useMemo(
    () => createSupplierCollection(queryClient),
    [queryClient],
  );

  const liveResult = useLiveQuery(
    (q) => {
      if (!id) return undefined;

      return q
        .from({ supplier: supplierCollection })
        .where(({ supplier }) => eq(supplier.id, id))
        .findOne();
    },
    [id, supplierCollection],
  );

  return wrapLiveQuery(liveResult);
}
