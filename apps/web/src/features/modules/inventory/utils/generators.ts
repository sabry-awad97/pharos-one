/**
 * Mock data generators for TanStack DB migration
 * Performance target: <10ms per record for 1M records
 *
 * Uses simple templates with counters for maximum performance
 * (avoiding Faker.js for speed)
 */

import type { Category } from "../schema";

/**
 * Generate a single category with deterministic data
 * @param id - Category ID (1-indexed)
 * @returns Category object matching categorySchema
 */
export function generateCategory(id: number): Category {
  // Simple template-based generation for performance
  const categories = [
    "Antibiotic",
    "Analgesic",
    "Antidiabetic",
    "GI",
    "Statin",
    "ACE Inhibitor",
    "Antihistamine",
    "NSAID",
    "ARB",
    "SSRI",
  ];

  const descriptions = [
    "Antibacterial medications",
    "Pain relief medications",
    "Diabetes management",
    "Gastrointestinal medications",
    "Cholesterol management",
    "Blood pressure management",
    "Allergy relief",
    "Anti-inflammatory",
    "Angiotensin receptor blocker",
    "Selective serotonin reuptake inhibitor",
  ];

  // Use modulo to cycle through templates
  const index = (id - 1) % categories.length;

  return {
    id,
    name: categories[index],
    description: descriptions[index],
    parentCategoryId: null,
  };
}

import type { Supplier, Product, Batch } from "../schema";

/**
 * Generate a single supplier with deterministic data
 * @param id - Supplier ID (1-indexed)
 * @returns Supplier object matching supplierSchema
 */
export function generateSupplier(id: number): Supplier {
  const names = [
    "MedSupply Co",
    "PharmGen",
    "GeneriCo",
    "CardioPharm",
    "AllergyRx",
    "NeuroPharma",
    "EndoMed",
    "UroMed",
  ];

  const contacts = [
    "John Smith",
    "Sarah Johnson",
    "Mike Davis",
    "Emily Brown",
    "Tom Wilson",
    "Lisa Chen",
    "Robert Lee",
    "David Park",
  ];

  const index = (id - 1) % names.length;

  return {
    id,
    name: names[index],
    contactPerson: contacts[index],
    email: `contact${id}@${names[index].toLowerCase().replace(/\s+/g, "")}.com`,
    phone: `+1-555-${String(id).padStart(4, "0")}`,
    address: null,
    isActive: true,
  };
}

/**
 * Generate a single product with deterministic data
 * @param id - Product ID (1-indexed)
 * @returns Product object matching productSchema
 */
export function generateProduct(id: number): Product {
  const names = [
    "Amoxicillin 500mg",
    "Paracetamol 650mg",
    "Metformin 500mg",
    "Omeprazole 20mg",
    "Atorvastatin 10mg",
    "Lisinopril 5mg",
    "Cetirizine 10mg",
    "Azithromycin 250mg",
    "Ibuprofen 400mg",
    "Losartan 50mg",
  ];

  const generics = [
    "Amoxicillin",
    "Acetaminophen",
    "Metformin HCl",
    "Omeprazole",
    "Atorvastatin Calcium",
    "Lisinopril",
    "Cetirizine HCl",
    "Azithromycin",
    "Ibuprofen",
    "Losartan Potassium",
  ];

  const manufacturers = [
    "PharmaCorp",
    "GenMed",
    "DiabetesCare",
    "GastroMed",
    "CardioPharm",
  ];

  const index = (id - 1) % names.length;
  const categoryId = ((id - 1) % 20) + 1;
  const supplierId = ((id - 1) % 8) + 1;

  return {
    id,
    name: names[index],
    sku: `SKU-${String(id).padStart(5, "0")}`,
    genericName: generics[index],
    manufacturer: manufacturers[id % manufacturers.length],
    categoryId,
    defaultSupplierId: supplierId,
    basePrice: 5 + (id % 50),
    reorderLevel: 30 + (id % 70),
    requiresPrescription: id % 3 === 0,
    controlledSubstance: id % 20 === 0,
    description: `Description for ${names[index]}`,
    isActive: true,
  };
}

/**
 * Generate a single batch with deterministic data
 * @param id - Batch ID (1-indexed)
 * @param productId - Product ID this batch belongs to
 * @returns Batch object matching batchSchema
 */
export function generateBatch(id: number, productId: number): Batch {
  const now = new Date();
  const receivedDate = new Date(
    now.getTime() - (id % 365) * 24 * 60 * 60 * 1000,
  );
  const expiryDate = new Date(
    now.getTime() + (365 + (id % 730)) * 24 * 60 * 60 * 1000,
  );

  const supplierId = ((id - 1) % 8) + 1;
  const quantityReceived = 100 + (id % 400);
  const quantityRemaining = Math.floor(
    quantityReceived * (0.5 + (id % 50) / 100),
  );

  return {
    id,
    productId,
    batchNumber: `BATCH-${String(id).padStart(6, "0")}`,
    expiryDate: expiryDate.toISOString().split("T")[0],
    supplierId,
    purchaseOrderId: id % 10 === 0 ? id : null,
    receivedDate: receivedDate.toISOString().split("T")[0],
    costPerUnit: 3 + (id % 30),
    quantityReceived,
    quantityRemaining,
    locationId: ((id - 1) % 5) + 1,
    status: "available",
    notes: null,
    createdAt: receivedDate.toISOString(),
    updatedAt: now.toISOString(),
  };
}

import type { StockTransaction } from "../schema";

/**
 * Generate a single stock transaction with deterministic data
 * @param id - Transaction ID (1-indexed)
 * @param batchId - Batch ID this transaction belongs to
 * @param baseDate - Base date for transaction (defaults to now)
 * @returns StockTransaction object matching stockTransactionSchema
 */
export function generateStockTransaction(
  id: number,
  batchId: number,
  baseDate: Date = new Date(),
): StockTransaction {
  const types = [
    "purchase",
    "sale",
    "adjustment",
    "transfer",
    "return",
    "damage",
    "expiry",
  ] as const;

  const reasons = [
    "Initial stock",
    "Customer purchase",
    "Inventory correction",
    "Location transfer",
    "Customer return",
    "Damaged goods",
    "Expired product",
  ];

  const index = (id - 1) % types.length;

  // Generate timestamp within a range (last 365 days)
  const daysAgo = id % 365;
  const timestamp = new Date(
    baseDate.getTime() - daysAgo * 24 * 60 * 60 * 1000,
  );

  // Quantity: positive for purchases/returns, negative for sales/damage/expiry
  const type = types[index];
  let quantity: number;
  if (type === "purchase" || type === "return") {
    quantity = 10 + (id % 90); // Positive
  } else if (type === "sale") {
    quantity = -(1 + (id % 20)); // Negative
  } else {
    quantity = -(1 + (id % 10)); // Negative for damage/expiry/adjustment
  }

  return {
    id,
    batchId,
    type,
    quantity,
    orderId: type === "sale" ? id : null,
    userId: ((id - 1) % 10) + 1,
    reason: reasons[index],
    timestamp: timestamp.toISOString(),
  };
}
