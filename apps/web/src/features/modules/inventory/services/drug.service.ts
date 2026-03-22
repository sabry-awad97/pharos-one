/**
 * Drug data service (INTERNAL)
 * Handles drug-related data fetching
 *
 * @internal - Do not import directly, use hooks from main index
 */

import {
  drugWithRelationsSchema,
  drugsWithRelationsArraySchema,
  type DrugWithRelations,
} from "../schema";

// Mock data - will be replaced with API calls
const MOCK_DRUGS: DrugWithRelations[] = [
  {
    id: 1,
    name: "Amoxicillin 500mg",
    sku: "AMX-500",
    stock: 240,
    expiry: "2026-03",
    price: 12.5,
    categoryId: 1,
    supplierId: 1,
    status: "ok",
    category: {
      id: 1,
      name: "Antibiotic",
      description: "Antibacterial medications",
    },
    supplier: {
      id: 1,
      name: "MedSupply Co",
      contactPerson: "John Smith",
      email: "john@medsupply.com",
      phone: "+1-555-0101",
      isActive: true,
    },
  },
  {
    id: 2,
    name: "Paracetamol 650mg",
    sku: "PCT-650",
    stock: 18,
    expiry: "2025-09",
    price: 4.2,
    categoryId: 2,
    supplierId: 2,
    status: "low",
    category: {
      id: 2,
      name: "Analgesic",
      description: "Pain relief medications",
    },
    supplier: {
      id: 2,
      name: "PharmGen",
      contactPerson: "Sarah Johnson",
      email: "sarah@pharmgen.com",
      phone: "+1-555-0102",
      isActive: true,
    },
  },
  {
    id: 3,
    name: "Metformin 500mg",
    sku: "MET-500",
    stock: 302,
    expiry: "2026-08",
    price: 8.75,
    categoryId: 3,
    supplierId: 3,
    status: "ok",
    category: {
      id: 3,
      name: "Antidiabetic",
      description: "Diabetes management",
    },
    supplier: {
      id: 3,
      name: "GeneriCo",
      contactPerson: "Mike Davis",
      email: "mike@generico.com",
      phone: "+1-555-0103",
      isActive: true,
    },
  },
  {
    id: 4,
    name: "Omeprazole 20mg",
    sku: "OMZ-020",
    stock: 85,
    expiry: "2025-06",
    price: 15.0,
    categoryId: 4,
    supplierId: 1,
    status: "expiring",
    category: {
      id: 4,
      name: "GI",
      description: "Gastrointestinal medications",
    },
    supplier: {
      id: 1,
      name: "MedSupply Co",
      contactPerson: "John Smith",
      email: "john@medsupply.com",
      phone: "+1-555-0101",
      isActive: true,
    },
  },
  {
    id: 5,
    name: "Atorvastatin 10mg",
    sku: "ATV-010",
    stock: 0,
    expiry: "2026-11",
    price: 22.3,
    categoryId: 5,
    supplierId: 4,
    status: "out",
    category: { id: 5, name: "Statin", description: "Cholesterol management" },
    supplier: {
      id: 4,
      name: "CardioPharm",
      contactPerson: "Emily Brown",
      email: "emily@cardiopharm.com",
      phone: "+1-555-0104",
      isActive: true,
    },
  },
  {
    id: 6,
    name: "Lisinopril 5mg",
    sku: "LSN-005",
    stock: 145,
    expiry: "2027-01",
    price: 9.9,
    categoryId: 6,
    supplierId: 4,
    status: "ok",
    category: {
      id: 6,
      name: "ACE Inhibitor",
      description: "Blood pressure management",
    },
    supplier: {
      id: 4,
      name: "CardioPharm",
      contactPerson: "Emily Brown",
      email: "emily@cardiopharm.com",
      phone: "+1-555-0104",
      isActive: true,
    },
  },
  {
    id: 7,
    name: "Cetirizine 10mg",
    sku: "CTZ-010",
    stock: 12,
    expiry: "2025-08",
    price: 6.4,
    categoryId: 7,
    supplierId: 5,
    status: "low",
    category: {
      id: 7,
      name: "Antihistamine",
      description: "Allergy medications",
    },
    supplier: {
      id: 5,
      name: "AllergyRx",
      contactPerson: "David Wilson",
      email: "david@allergyrx.com",
      phone: "+1-555-0105",
      isActive: true,
    },
  },
  {
    id: 8,
    name: "Azithromycin 250mg",
    sku: "AZT-250",
    stock: 67,
    expiry: "2025-05",
    price: 18.6,
    categoryId: 1,
    supplierId: 2,
    status: "expiring",
    category: {
      id: 1,
      name: "Antibiotic",
      description: "Antibacterial medications",
    },
    supplier: {
      id: 2,
      name: "PharmGen",
      contactPerson: "Sarah Johnson",
      email: "sarah@pharmgen.com",
      phone: "+1-555-0102",
      isActive: true,
    },
  },
  {
    id: 9,
    name: "Ibuprofen 400mg",
    sku: "IBU-400",
    stock: 389,
    expiry: "2027-03",
    price: 5.1,
    categoryId: 8,
    supplierId: 3,
    status: "ok",
    category: {
      id: 8,
      name: "NSAID",
      description: "Non-steroidal anti-inflammatory",
    },
    supplier: {
      id: 3,
      name: "GeneriCo",
      contactPerson: "Mike Davis",
      email: "mike@generico.com",
      phone: "+1-555-0103",
      isActive: true,
    },
  },
  {
    id: 10,
    name: "Losartan 50mg",
    sku: "LST-050",
    stock: 203,
    expiry: "2026-06",
    price: 11.2,
    categoryId: 9,
    supplierId: 4,
    status: "ok",
    category: {
      id: 9,
      name: "ARB",
      description: "Angiotensin receptor blockers",
    },
    supplier: {
      id: 4,
      name: "CardioPharm",
      contactPerson: "Emily Brown",
      email: "emily@cardiopharm.com",
      phone: "+1-555-0104",
      isActive: true,
    },
  },
];

/**
 * Fetch all drugs from inventory with populated relations
 * TODO: Replace with actual API call
 *
 * @throws {Error} If data validation fails
 */
export async function fetchDrugs(): Promise<DrugWithRelations[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Validate data with Zod schema
  const result = drugsWithRelationsArraySchema.safeParse(MOCK_DRUGS);

  if (!result.success) {
    console.error("Drug data validation failed:", result.error);
    throw new Error("Invalid drug data format");
  }

  return result.data;
}

/**
 * Fetch single drug by ID with populated relations
 * TODO: Replace with actual API call
 *
 * @throws {Error} If data validation fails
 */
export async function fetchDrugById(
  id: number,
): Promise<DrugWithRelations | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const drug = MOCK_DRUGS.find((drug) => drug.id === id);

  if (!drug) {
    return null;
  }

  // Validate single drug with Zod schema
  const result = drugWithRelationsSchema.safeParse(drug);

  if (!result.success) {
    console.error("Drug data validation failed:", result.error);
    throw new Error("Invalid drug data format");
  }

  return result.data;
}
