/**
 * Category data service (INTERNAL)
 * Handles category-related data fetching
 *
 * @internal - Do not import directly, use hooks from main index
 */

import {
  categorySchema,
  categoriesArraySchema,
  type Category,
} from "../schema";

// Mock categories - will be replaced with API calls
const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Antibiotic", description: "Antibacterial medications" },
  { id: 2, name: "Analgesic", description: "Pain relief medications" },
  { id: 3, name: "Antidiabetic", description: "Diabetes management" },
  { id: 4, name: "GI", description: "Gastrointestinal medications" },
  { id: 5, name: "Statin", description: "Cholesterol management" },
  { id: 6, name: "ACE Inhibitor", description: "Blood pressure management" },
  { id: 7, name: "Antihistamine", description: "Allergy medications" },
  { id: 8, name: "NSAID", description: "Non-steroidal anti-inflammatory" },
  { id: 9, name: "ARB", description: "Angiotensin receptor blockers" },
];

/**
 * Fetch all categories
 * TODO: Replace with actual API call
 *
 * @throws {Error} If data validation fails
 */
export async function fetchCategories(): Promise<Category[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const result = categoriesArraySchema.safeParse(MOCK_CATEGORIES);

  if (!result.success) {
    console.error("Category data validation failed:", result.error);
    throw new Error("Invalid category data format");
  }

  return result.data;
}

/**
 * Fetch single category by ID
 * TODO: Replace with actual API call
 *
 * @throws {Error} If data validation fails
 */
export async function fetchCategoryById(id: number): Promise<Category | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const category = MOCK_CATEGORIES.find((c) => c.id === id);

  if (!category) {
    return null;
  }

  const result = categorySchema.safeParse(category);

  if (!result.success) {
    console.error("Category data validation failed:", result.error);
    throw new Error("Invalid category data format");
  }

  return result.data;
}
