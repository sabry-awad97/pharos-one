/**
 * Inventory API functions
 * Wraps Tauri commands with type-safe interfaces
 */

import { invoke } from "@tauri-apps/api/core";
import {
  type InventoryOperation,
  type InventoryResponse,
  type Medicine,
  parseInventoryResponse,
} from "@pharos-one/schema/inventory";

export const inventoryApi = {
  /**
   * Get all medicines
   */
  getAll: async (): Promise<Medicine[]> => {
    const operation: InventoryOperation = { type: "GetAll" };
    console.log("Invoking inventory API:", operation);
    const rawResponse = await invoke("inventory", { operation });
    console.log("Raw inventory API response:", rawResponse);

    const response = parseInventoryResponse(rawResponse);
    console.log("Parsed inventory API response:", response);

    if (response.type === "Medicines") {
      return response.data;
    }

    throw new Error("Unexpected response type");
  },

  /**
   * Get medicine by ID
   */
  getById: async (id: string): Promise<Medicine | null> => {
    const operation: InventoryOperation = {
      type: "GetById",
      data: { id },
    };
    console.log("Invoking inventory API:", operation);
    const rawResponse = await invoke("inventory", { operation });
    console.log("Raw inventory API response:", rawResponse);

    const response = parseInventoryResponse(rawResponse);
    console.log("Parsed inventory API response:", response);

    if (response.type === "Medicine") {
      return response.data;
    }

    throw new Error("Unexpected response type");
  },

  /**
   * Create new medicine
   */
  create: async (data: {
    name: string;
    generic_name: string;
    unit_price: number;
    quantity: number;
  }): Promise<Medicine> => {
    const operation: InventoryOperation = {
      type: "Create",
      data,
    };
    console.log("Invoking inventory API:", operation);
    const rawResponse = await invoke("inventory", { operation });
    console.log("Raw inventory API response:", rawResponse);

    const response = parseInventoryResponse(rawResponse);
    console.log("Parsed inventory API response:", response);

    if (response.type === "Medicine" && response.data) {
      return response.data;
    }

    throw new Error("Failed to create medicine");
  },

  /**
   * Update stock quantity
   */
  updateStock: async (data: {
    id: string;
    quantity_change: number;
  }): Promise<Medicine> => {
    const operation: InventoryOperation = {
      type: "UpdateStock",
      data,
    };
    console.log("Invoking inventory API:", operation);
    const rawResponse = await invoke("inventory", { operation });
    console.log("Raw inventory API response:", rawResponse);

    const response = parseInventoryResponse(rawResponse);
    console.log("Parsed inventory API response:", response);

    if (response.type === "Medicine" && response.data) {
      return response.data;
    }

    throw new Error("Failed to update stock");
  },
};
