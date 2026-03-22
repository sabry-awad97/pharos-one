/**
 * Product data service (INTERNAL)
 * Handles product catalog data fetching
 *
 * @internal - Do not import directly, use hooks from main index
 */

import {
  productStockSummarySchema,
  productStockSummariesArraySchema,
  type ProductStockSummary,
} from "../schema";

// Mock products with aggregated stock summary
const MOCK_PRODUCT_SUMMARIES: ProductStockSummary[] = [
  {
    id: 1,
    name: "Amoxicillin 500mg",
    sku: "AMX-500",
    genericName: "Amoxicillin",
    manufacturer: "PharmaCorp",
    categoryId: 1,
    defaultSupplierId: 1,
    basePrice: 12.5,
    reorderLevel: 50,
    requiresPrescription: true,
    controlledSubstance: false,
    description: "Antibiotic for bacterial infections",
    isActive: true,
    category: {
      id: 1,
      name: "Antibiotic",
      description: "Antibacterial medications",
      parentCategoryId: null,
    },
    defaultSupplier: {
      id: 1,
      name: "MedSupply Co",
      contactPerson: "John Smith",
      email: "john@medsupply.com",
      phone: "+1-555-0101",
      address: null,
      isActive: true,
    },
    totalQuantity: 240,
    availableQuantity: 240,
    reservedQuantity: 0,
    nearestExpiry: "2026-03-15",
    batchCount: 2,
    stockStatus: "ok",
  },
  {
    id: 2,
    name: "Paracetamol 650mg",
    sku: "PCT-650",
    genericName: "Acetaminophen",
    manufacturer: "GenMed",
    categoryId: 2,
    defaultSupplierId: 2,
    basePrice: 4.2,
    reorderLevel: 100,
    requiresPrescription: false,
    controlledSubstance: false,
    description: "Pain reliever and fever reducer",
    isActive: true,
    category: {
      id: 2,
      name: "Analgesic",
      description: "Pain relief medications",
      parentCategoryId: null,
    },
    defaultSupplier: {
      id: 2,
      name: "PharmGen",
      contactPerson: "Sarah Johnson",
      email: "sarah@pharmgen.com",
      phone: "+1-555-0102",
      address: null,
      isActive: true,
    },
    totalQuantity: 18,
    availableQuantity: 18,
    reservedQuantity: 0,
    nearestExpiry: "2025-09-20",
    batchCount: 1,
    stockStatus: "low",
  },
  {
    id: 3,
    name: "Metformin 500mg",
    sku: "MET-500",
    genericName: "Metformin HCl",
    manufacturer: "DiabetesCare",
    categoryId: 3,
    defaultSupplierId: 3,
    basePrice: 8.75,
    reorderLevel: 75,
    requiresPrescription: true,
    controlledSubstance: false,
    description: "Type 2 diabetes management",
    isActive: true,
    category: {
      id: 3,
      name: "Antidiabetic",
      description: "Diabetes management",
      parentCategoryId: null,
    },
    defaultSupplier: {
      id: 3,
      name: "GeneriCo",
      contactPerson: "Mike Davis",
      email: "mike@generico.com",
      phone: "+1-555-0103",
      address: null,
      isActive: true,
    },
    totalQuantity: 302,
    availableQuantity: 302,
    reservedQuantity: 0,
    nearestExpiry: "2026-08-10",
    batchCount: 3,
    stockStatus: "ok",
  },
  {
    id: 4,
    name: "Omeprazole 20mg",
    sku: "OMZ-020",
    genericName: "Omeprazole",
    manufacturer: "GastroMed",
    categoryId: 4,
    defaultSupplierId: 1,
    basePrice: 15.0,
    reorderLevel: 60,
    requiresPrescription: false,
    controlledSubstance: false,
    description: "Proton pump inhibitor for acid reflux",
    isActive: true,
    category: {
      id: 4,
      name: "GI",
      description: "Gastrointestinal medications",
      parentCategoryId: null,
    },
    defaultSupplier: {
      id: 1,
      name: "MedSupply Co",
      contactPerson: "John Smith",
      email: "john@medsupply.com",
      phone: "+1-555-0101",
      address: null,
      isActive: true,
    },
    totalQuantity: 85,
    availableQuantity: 85,
    reservedQuantity: 0,
    nearestExpiry: "2025-06-30",
    batchCount: 2,
    stockStatus: "expiring",
  },
  {
    id: 5,
    name: "Atorvastatin 10mg",
    sku: "ATV-010",
    genericName: "Atorvastatin Calcium",
    manufacturer: "CardioPharm",
    categoryId: 5,
    defaultSupplierId: 4,
    basePrice: 22.3,
    reorderLevel: 40,
    requiresPrescription: true,
    controlledSubstance: false,
    description: "Cholesterol-lowering statin",
    isActive: true,
    category: {
      id: 5,
      name: "Statin",
      description: "Cholesterol management",
      parentCategoryId: null,
    },
    defaultSupplier: {
      id: 4,
      name: "CardioPharm",
      contactPerson: "Emily Brown",
      email: "emily@cardiopharm.com",
      phone: "+1-555-0104",
      address: null,
      isActive: true,
    },
    totalQuantity: 0,
    availableQuantity: 0,
    reservedQuantity: 0,
    nearestExpiry: null,
    batchCount: 0,
    stockStatus: "out",
  },
];

/**
 * Fetch all products with aggregated stock summary
 * TODO: Replace with actual API call
 *
 * @throws {Error} If data validation fails
 */
export async function fetchProductSummaries(): Promise<ProductStockSummary[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Validate data with Zod schema
  const result = productStockSummariesArraySchema.safeParse(
    MOCK_PRODUCT_SUMMARIES,
  );

  if (!result.success) {
    console.error("Product summary validation failed:", result.error);
    throw new Error("Invalid product summary data format");
  }

  return result.data;
}

/**
 * Fetch single product summary by ID
 * TODO: Replace with actual API call
 *
 * @throws {Error} If data validation fails
 */
export async function fetchProductSummaryById(
  id: number,
): Promise<ProductStockSummary | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const product = MOCK_PRODUCT_SUMMARIES.find((p) => p.id === id);

  if (!product) {
    return null;
  }

  // Validate single product with Zod schema
  const result = productStockSummarySchema.safeParse(product);

  if (!result.success) {
    console.error("Product summary validation failed:", result.error);
    throw new Error("Invalid product summary data format");
  }

  return result.data;
}
