/**
 * Product API
 * Type-safe wrapper for product Tauri commands
 *
 * IMPORTANT: Only includes operations that exist in Rust backend
 * See: apps/web/src-tauri/crates/tauri-commands/src/inventory/operations.rs
 */

import { invoke } from "@tauri-apps/api/core";
import type { Product } from "@pharos-one/schema";

// Response types matching Rust InventoryResponse enum
type ProductResponse = { Products: Product[] } | { Product: Product | null };

function assertProducts(
  response: ProductResponse,
): asserts response is { Products: Product[] } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "Products" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

function assertProduct(
  response: ProductResponse,
): asserts response is { Product: Product | null } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "Product" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

export const productApi = {
  /**
   * Get all products
   * Rust operation: GetAllProducts
   */
  getAll: async (): Promise<Product[]> => {
    const response = await invoke<ProductResponse>("inventory", {
      operation: { type: "GetAllProducts" },
    });

    assertProducts(response);
    return response.Products;
  },

  /**
   * Get product by ID
   * Rust operation: GetProductById
   */
  getById: async (id: string): Promise<Product | null> => {
    const response = await invoke<ProductResponse>("inventory", {
      operation: { type: "GetProductById", payload: id },
    });

    assertProduct(response);
    return response.Product;
  },

  /**
   * Get product by SKU
   * Rust operation: GetProductBySku
   */
  getBySku: async (sku: string): Promise<Product | null> => {
    const response = await invoke<ProductResponse>("inventory", {
      operation: { type: "GetProductBySku", payload: sku },
    });

    assertProduct(response);
    return response.Product;
  },

  /**
   * Get product by barcode
   * Rust operation: GetProductByBarcode
   */
  getByBarcode: async (barcode: string): Promise<Product | null> => {
    const response = await invoke<ProductResponse>("inventory", {
      operation: { type: "GetProductByBarcode", payload: barcode },
    });

    assertProduct(response);
    return response.Product;
  },

  /**
   * Get active products
   * Rust operation: GetActiveProducts
   */
  getActive: async (): Promise<Product[]> => {
    const response = await invoke<ProductResponse>("inventory", {
      operation: { type: "GetActiveProducts" },
    });

    assertProducts(response);
    return response.Products;
  },
};
