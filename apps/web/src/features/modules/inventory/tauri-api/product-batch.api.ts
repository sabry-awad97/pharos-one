/**
 * Product Batch API
 * Type-safe wrapper for product batch Tauri commands
 *
 * IMPORTANT: Only includes operations that exist in Rust backend
 * See: apps/web/src-tauri/crates/tauri-commands/src/inventory/operations.rs
 */

import { invoke } from "@tauri-apps/api/core";
import type { ProductBatch } from "@pharos-one/schema";

// Response types matching Rust InventoryResponse enum
type ProductBatchResponse =
  | { ProductBatches: ProductBatch[] }
  | { ProductBatch: ProductBatch | null };

function assertProductBatches(
  response: ProductBatchResponse,
): asserts response is { ProductBatches: ProductBatch[] } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "ProductBatches" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

function assertProductBatch(
  response: ProductBatchResponse,
): asserts response is { ProductBatch: ProductBatch | null } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "ProductBatch" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

export const productBatchApi = {
  /**
   * Get all product batches
   * Rust operation: GetAllProductBatches
   */
  getAll: async (): Promise<ProductBatch[]> => {
    const response = await invoke<ProductBatchResponse>("inventory", {
      operation: { type: "GetAllProductBatches" },
    });

    assertProductBatches(response);
    return response.ProductBatches;
  },

  /**
   * Get product batch by ID
   * Rust operation: GetProductBatchById
   */
  getById: async (id: string): Promise<ProductBatch | null> => {
    const response = await invoke<ProductBatchResponse>("inventory", {
      operation: { type: "GetProductBatchById", payload: id },
    });

    assertProductBatch(response);
    return response.ProductBatch;
  },

  /**
   * Get product batches by product
   * Rust operation: GetProductBatchesByProduct
   */
  getByProduct: async (productId: string): Promise<ProductBatch[]> => {
    const response = await invoke<ProductBatchResponse>("inventory", {
      operation: { type: "GetProductBatchesByProduct", payload: productId },
    });

    assertProductBatches(response);
    return response.ProductBatches;
  },
};
