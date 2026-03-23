/**
 * Category API
 * Type-safe wrapper for category Tauri commands
 */

import { invoke } from "@tauri-apps/api/core";
import type {
  Category,
  CreateCategory,
  UpdateCategory,
  InventoryResponse,
  Id,
} from "@pharos-one/schema/inventory";

function assertCategories(
  response: InventoryResponse,
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
  response: InventoryResponse,
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

function assertCategoryCreated(
  response: InventoryResponse,
): asserts response is { CategoryCreated: Category } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "CategoryCreated" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

function assertDeleted(
  response: InventoryResponse,
): asserts response is { Deleted: Id } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "Deleted" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

export const categoryApi = {
  /**
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "GetAllCategories" },
    });

    assertCategories(response);
    return response.Categories;
  },

  /**
   * Get category by ID
   */
  getById: async (id: string): Promise<Category | null> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "GetCategoryById", payload: id },
    });

    assertCategory(response);
    return response.Category;
  },

  /**
   * Get root categories (no parent)
   */
  getRoots: async (): Promise<Category[]> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "GetRootCategories" },
    });

    assertCategories(response);
    return response.Categories;
  },

  /**
   * Create new category
   */
  create: async (data: CreateCategory): Promise<Category> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "CreateCategory", payload: data },
    });

    assertCategoryCreated(response);
    return response.CategoryCreated;
  },

  /**
   * Update category
   */
  update: async (id: string, data: UpdateCategory): Promise<Category> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "UpdateCategory", payload: { id, dto: data } },
    });

    assertCategoryCreated(response);
    return response.CategoryCreated;
  },

  /**
   * Delete category
   */
  delete: async (id: string): Promise<Id> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "DeleteCategory", payload: id },
    });

    assertDeleted(response);
    return response.Deleted;
  },
};
