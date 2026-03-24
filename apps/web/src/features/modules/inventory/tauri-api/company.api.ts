/**
 * Company (Manufacturer) API
 * Type-safe wrapper for company Tauri commands
 *
 * IMPORTANT: Only includes operations that exist in Rust backend
 * See: apps/web/src-tauri/crates/tauri-commands/src/inventory/operations.rs
 */

import { invoke } from "@tauri-apps/api/core";
import type { Company } from "@pharos-one/schema";

// Response types matching Rust InventoryResponse enum
type CompanyResponse = { Companies: Company[] } | { Company: Company | null };

function assertCompanies(
  response: CompanyResponse,
): asserts response is { Companies: Company[] } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "Companies" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

function assertCompany(
  response: CompanyResponse,
): asserts response is { Company: Company | null } {
  if (
    !(
      typeof response === "object" &&
      response !== null &&
      "Company" in response
    )
  ) {
    throw new Error(`Unexpected response type: ${JSON.stringify(response)}`);
  }
}

export const companyApi = {
  /**
   * Get all companies
   * Rust operation: GetAllCompanies
   */
  getAll: async (): Promise<Company[]> => {
    const response = await invoke<CompanyResponse>("inventory", {
      operation: { type: "GetAllCompanies" },
    });

    assertCompanies(response);
    return response.Companies;
  },

  /**
   * Get company by ID
   * Rust operation: GetCompanyById
   */
  getById: async (id: string): Promise<Company | null> => {
    const response = await invoke<CompanyResponse>("inventory", {
      operation: { type: "GetCompanyById", payload: id },
    });

    assertCompany(response);
    return response.Company;
  },

  /**
   * Get active companies
   * Rust operation: GetActiveCompanies
   */
  getActive: async (): Promise<Company[]> => {
    const response = await invoke<CompanyResponse>("inventory", {
      operation: { type: "GetActiveCompanies" },
    });

    assertCompanies(response);
    return response.Companies;
  },
};

// Legacy alias for backward compatibility
export const manufacturerApi = companyApi;
