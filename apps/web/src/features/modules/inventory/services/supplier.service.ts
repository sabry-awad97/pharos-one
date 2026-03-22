/**
 * Supplier data service (INTERNAL)
 * Handles supplier-related data fetching
 *
 * @internal - Do not import directly, use hooks from main index
 */

import { supplierSchema, suppliersArraySchema, type Supplier } from "../schema";

// Mock suppliers - will be replaced with API calls
const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: "MedSupply Co",
    contactPerson: "John Smith",
    email: "john@medsupply.com",
    phone: "+1-555-0101",
    address: null,
    isActive: true,
  },
  {
    id: 2,
    name: "PharmGen",
    contactPerson: "Sarah Johnson",
    email: "sarah@pharmgen.com",
    phone: "+1-555-0102",
    address: null,
    isActive: true,
  },
  {
    id: 3,
    name: "GeneriCo",
    contactPerson: "Mike Davis",
    email: "mike@generico.com",
    phone: "+1-555-0103",
    address: null,
    isActive: true,
  },
  {
    id: 4,
    name: "CardioPharm",
    contactPerson: "Emily Brown",
    email: "emily@cardiopharm.com",
    phone: "+1-555-0104",
    address: null,
    isActive: true,
  },
  {
    id: 5,
    name: "AllergyRx",
    contactPerson: "David Wilson",
    email: "david@allergyrx.com",
    phone: "+1-555-0105",
    address: null,
    isActive: true,
  },
];

/**
 * Fetch all suppliers
 * TODO: Replace with actual API call
 *
 * @throws {Error} If data validation fails
 */
export async function fetchSuppliers(): Promise<Supplier[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const result = suppliersArraySchema.safeParse(MOCK_SUPPLIERS);

  if (!result.success) {
    console.error("Supplier data validation failed:", result.error);
    throw new Error("Invalid supplier data format");
  }

  return result.data;
}

/**
 * Fetch single supplier by ID
 * TODO: Replace with actual API call
 *
 * @throws {Error} If data validation fails
 */
export async function fetchSupplierById(id: number): Promise<Supplier | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const supplier = MOCK_SUPPLIERS.find((s) => s.id === id);

  if (!supplier) {
    return null;
  }

  const result = supplierSchema.safeParse(supplier);

  if (!result.success) {
    console.error("Supplier data validation failed:", result.error);
    throw new Error("Invalid supplier data format");
  }

  return result.data;
}
