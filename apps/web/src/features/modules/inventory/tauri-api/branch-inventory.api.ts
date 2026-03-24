/**
 * Branch Inventory API
 * Type-safe wrapper for branch inventory Tauri commands
 *
 * IMPORTANT: Only includes operations that exist in Rust backend
 * See: apps/web/src-tauri/crates/tauri-commands/src/inventory/operations.rs
 */

import { invoke } from "@tauri-apps/api/core";
import type { BranchInventory } from "@pharos-one/schema";

// Response types matching Rust InventoryResponse enum
type BranchInventoryResponse =
  | { BranchInventory: BranchInventory[] }
  | { BranchInventoryItem: BranchInventory | null };

function assertBranchInventory(
  response: BranchInventoryResponse,
): asserts response is { BranchInventory: BranchInventory[] } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "BranchInventory" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

function assertBranchInventoryItem(
  response: BranchInventoryResponse,
): asserts response is { BranchInventoryItem: BranchInventory | null } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "BranchInventoryItem" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

export const branchInventoryApi = {
  /**
   * Get branch inventory by branch
   * Rust operation: GetBranchInventoryByBranch
   */
  getByBranch: async (branchId: string): Promise<BranchInventory[]> => {
    const response = await invoke<BranchInventoryResponse>("inventory", {
      operation: { type: "GetBranchInventoryByBranch", payload: branchId },
    });

    assertBranchInventory(response);
    return response.BranchInventory;
  },

  /**
   * Get branch inventory by product
   * Rust operation: GetBranchInventoryByProduct
   */
  getByProduct: async (productId: string): Promise<BranchInventory[]> => {
    const response = await invoke<BranchInventoryResponse>("inventory", {
      operation: { type: "GetBranchInventoryByProduct", payload: productId },
    });

    assertBranchInventory(response);
    return response.BranchInventory;
  },

  /**
   * Get low stock items for a branch
   * Rust operation: GetLowStockItems
   */
  getLowStock: async (branchId: string): Promise<BranchInventory[]> => {
    const response = await invoke<BranchInventoryResponse>("inventory", {
      operation: { type: "GetLowStockItems", payload: branchId },
    });

    assertBranchInventory(response);
    return response.BranchInventory;
  },
};
