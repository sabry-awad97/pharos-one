/**
 * Unit API
 * Type-safe wrapper for unit Tauri commands
 *
 * IMPORTANT: Only includes operations that exist in Rust backend
 * See: apps/web/src-tauri/crates/tauri-commands/src/inventory/operations.rs
 */

import { invoke } from "@tauri-apps/api/core";
import type { Unit } from "@pharos-one/schema";

// Response types matching Rust InventoryResponse enum
type UnitResponse = { Units: Unit[] } | { Unit: Unit | null };

function assertUnits(
  response: UnitResponse,
): asserts response is { Units: Unit[] } {
  if (
    !(typeof response === "object" && response !== null && "Units" in response)
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

function assertUnit(
  response: UnitResponse,
): asserts response is { Unit: Unit | null } {
  if (
    !(typeof response === "object" && response !== null && "Unit" in response)
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

export const unitApi = {
  /**
   * Get all units
   * Rust operation: GetAllUnits
   */
  getAll: async (): Promise<Unit[]> => {
    const response = await invoke<UnitResponse>("inventory", {
      operation: { type: "GetAllUnits" },
    });

    assertUnits(response);
    return response.Units;
  },

  /**
   * Get unit by ID
   * Rust operation: GetUnitById
   */
  getById: async (id: string): Promise<Unit | null> => {
    const response = await invoke<UnitResponse>("inventory", {
      operation: { type: "GetUnitById", payload: id },
    });

    assertUnit(response);
    return response.Unit;
  },
};
