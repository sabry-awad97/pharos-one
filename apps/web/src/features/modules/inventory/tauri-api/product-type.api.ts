/**
 * Product Type API
 * Type-safe wrapper for product type Tauri commands
 */

import { invoke } from "@tauri-apps/api/core";
import type {
  ProductType,
  CreateProductType,
  UpdateProductType,
  InventoryResponse,
  Id,
} from "@pharos-one/schema/inventory";

function assertProductTypes(
  response: InventoryResponse,
): asserts response is { ProductTypes: ProductType[] } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "ProductTypes" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

function assertProductType(
  response: InventoryResponse,
): asserts response is { ProductType: ProductType | null } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "ProductType" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

function assertProductTypeCreated(
  response: InventoryResponse,
): asserts response is { ProductTypeCreated: ProductType } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "ProductTypeCreated" in response
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

export const productTypeApi = {
  /**
   * Get all product types
   */
  getAll: async (): Promise<ProductType[]> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "GetAllProductTypes" },
    });

    assertProductTypes(response);
    return response.ProductTypes;
  },

  /**
   * Get product type by ID
   */
  getById: async (id: string): Promise<ProductType | null> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "GetProductTypeById", payload: id },
    });

    assertProductType(response);
    return response.ProductType;
  },

  /**
   * Get active product types
   */
  getActive: async (): Promise<ProductType[]> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "GetActiveProductTypes" },
    });

    assertProductTypes(response);
    return response.ProductTypes;
  },

  /**
   * Create new product type
   */
  create: async (data: CreateProductType): Promise<ProductType> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "CreateProductType", payload: data },
    });

    assertProductTypeCreated(response);
    return response.ProductTypeCreated;
  },

  /**
   * Update product type
   */
  update: async (id: string, data: UpdateProductType): Promise<ProductType> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "UpdateProductType", payload: { id, dto: data } },
    });

    assertProductTypeCreated(response);
    return response.ProductTypeCreated;
  },

  /**
   * Delete product type
   */
  delete: async (id: string): Promise<Id> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "DeleteProductType", payload: id },
    });

    assertDeleted(response);
    return response.Deleted;
  },
};
