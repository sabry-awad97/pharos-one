/**
 * Category data hooks using TanStack DB
 * Migrated from TanStack Query to TanStack DB with eager mode
 */

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLiveQuery, eq } from "@tanstack/react-db";
import { createCategoryCollection } from "../collections/category.collection";
import { wrapLiveQuery } from "./utils/hook-wrapper";
import type { QueryResult } from "./utils/hook-wrapper";
import type { Category } from "../schema";

/**
 * Hook to fetch all categories with live updates
 *
 * Uses TanStack DB eager mode for instant access to ~20 categories.
 * The hook API remains backward-compatible with TanStack Query.
 *
 * @example
 * const { data: categories, isLoading } = useCategories();
 */
export function useCategories(): QueryResult<Category[]> {
  const queryClient = useQueryClient();

  // Create collection with QueryClient (memoized)
  const categoryCollection = useMemo(
    () => createCategoryCollection(queryClient),
    [queryClient],
  );

  const liveResult = useLiveQuery((q) =>
    q.from({ category: categoryCollection }),
  );

  return wrapLiveQuery(liveResult);
}

/**
 * Hook to fetch a single category by ID with live updates
 *
 * @example
 * const { data: category, isLoading } = useCategory(2);
 */
export function useCategory(id: number): QueryResult<Category | undefined> {
  const queryClient = useQueryClient();

  // Create collection with QueryClient (memoized)
  const categoryCollection = useMemo(
    () => createCategoryCollection(queryClient),
    [queryClient],
  );

  const liveResult = useLiveQuery(
    (q) => {
      if (!id) return undefined;

      return q
        .from({ category: categoryCollection })
        .where(({ category }) => eq(category.id, id))
        .findOne();
    },
    [id, categoryCollection],
  );

  return wrapLiveQuery(liveResult);
}
