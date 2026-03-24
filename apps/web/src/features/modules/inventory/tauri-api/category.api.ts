/**
 * Category API
 * Type-safe wrapper for category Tauri commands
 *
 * IMPORTANT: Only includes operations that exist in Rust backend
 * See: apps/web/src-tauri/crates/tauri-commands/src/inventory/operations.rs
 */

import { invoke } from "@tauri-apps/api/core";
import type { Category } from "@pharos-one/schema";

// Response types matching Rust InventoryResponse enum
type CategoryResponse =
  | { Categories: Category[] }
  | { Category: Category | null };

function assertCategories(
  response: CategoryResponse,
): asserts response is { Categories: Category[] } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "Categories" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

function assertCategory(
  response: CategoryResponse,
): asserts response is { Category: Category | null } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "Category" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

export const categoryApi = {
  /**
   * Get all categories
   * Rust operation: GetAllCategories
   */
  getAll: async (): Promise<Category[]> => {
    const response = await invoke<CategoryResponse>("inventory", {
      operation: { type: "GetAllCategories" },
    });

    assertCategories(response);
    return response.Categories;
  },

  /**
   * Get category by ID
   * Rust operation: GetCategoryById
   */
  getById: async (id: string): Promise<Category | null> => {
    const response = await invoke<CategoryResponse>("inventory", {
      operation: { type: "GetCategoryById", payload: id },
    });

    assertCategory(response);
    return response.Category;
  },

  /**
   * Get active categories
   * Rust operation: GetActiveCategories
   */
  getActive: async (): Promise<Category[]> => {
    const response = await invoke<CategoryResponse>("inventory", {
      operation: { type: "GetActiveCategories" },
    });

    assertCategories(response);
    return response.Categories;
  },
};
