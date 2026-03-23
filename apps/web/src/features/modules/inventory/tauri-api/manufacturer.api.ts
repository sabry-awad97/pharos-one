/**
 * Manufacturer API
 * Type-safe wrapper for manufacturer Tauri commands
 */

import { invoke } from "@tauri-apps/api/core";
import type {
  Manufacturer,
  CreateManufacturer,
  UpdateManufacturer,
  InventoryResponse,
  Id,
} from "@pharos-one/schema/inventory";

function assertManufacturers(
  response: InventoryResponse,
): asserts response is { Manufacturers: Manufacturer[] } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "Manufacturers" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

function assertManufacturer(
  response: InventoryResponse,
): asserts response is { Manufacturer: Manufacturer | null } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "Manufacturer" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

function assertManufacturerCreated(
  response: InventoryResponse,
): asserts response is { ManufacturerCreated: Manufacturer } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "ManufacturerCreated" in response
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

export const manufacturerApi = {
  /**
   * Get all manufacturers
   */
  getAll: async (): Promise<Manufacturer[]> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "GetAllManufacturers" },
    });

    assertManufacturers(response);
    return response.Manufacturers;
  },

  /**
   * Get manufacturer by ID
   */
  getById: async (id: string): Promise<Manufacturer | null> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "GetManufacturerById", payload: id },
    });

    assertManufacturer(response);
    return response.Manufacturer;
  },

  /**
   * Get active manufacturers
   */
  getActive: async (): Promise<Manufacturer[]> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "GetActiveManufacturers" },
    });

    assertManufacturers(response);
    return response.Manufacturers;
  },

  /**
   * Create new manufacturer
   */
  create: async (data: CreateManufacturer): Promise<Manufacturer> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "CreateManufacturer", payload: data },
    });

    assertManufacturerCreated(response);
    return response.ManufacturerCreated;
  },

  /**
   * Update manufacturer
   */
  update: async (
    id: string,
    data: UpdateManufacturer,
  ): Promise<Manufacturer> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "UpdateManufacturer", payload: { id, dto: data } },
    });

    assertManufacturerCreated(response);
    return response.ManufacturerCreated;
  },

  /**
   * Delete manufacturer
   */
  delete: async (id: string): Promise<Id> => {
    const response = await invoke<InventoryResponse>("inventory", {
      operation: { type: "DeleteManufacturer", payload: id },
    });

    assertDeleted(response);
    return response.Deleted;
  },
};
