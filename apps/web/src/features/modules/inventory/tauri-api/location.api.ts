/**
 * Location API
 * Type-safe wrapper for location Tauri commands
 *
 * IMPORTANT: Only includes operations that exist in Rust backend
 * See: apps/web/src-tauri/crates/tauri-commands/src/inventory/operations.rs
 */

import { invoke } from "@tauri-apps/api/core";
import type { Location } from "@pharos-one/schema";

// Response types matching Rust InventoryResponse enum
type LocationResponse =
  | { Locations: Location[] }
  | { Location: Location | null };

function assertLocations(
  response: LocationResponse,
): asserts response is { Locations: Location[] } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "Locations" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

function assertLocation(
  response: LocationResponse,
): asserts response is { Location: Location | null } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "Location" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

export const locationApi = {
  /**
   * Get all locations
   * Rust operation: GetAllLocations
   */
  getAll: async (): Promise<Location[]> => {
    const response = await invoke<LocationResponse>("inventory", {
      operation: { type: "GetAllLocations" },
    });

    assertLocations(response);
    return response.Locations;
  },

  /**
   * Get location by ID
   * Rust operation: GetLocationById
   */
  getById: async (id: string): Promise<Location | null> => {
    const response = await invoke<LocationResponse>("inventory", {
      operation: { type: "GetLocationById", payload: id },
    });

    assertLocation(response);
    return response.Location;
  },

  /**
   * Get locations by branch
   * Rust operation: GetLocationsByBranch
   */
  getByBranch: async (branchId: string): Promise<Location[]> => {
    const response = await invoke<LocationResponse>("inventory", {
      operation: { type: "GetLocationsByBranch", payload: branchId },
    });

    assertLocations(response);
    return response.Locations;
  },
};
