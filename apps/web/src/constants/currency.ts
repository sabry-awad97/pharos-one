/**
 * Currency Constants
 * Centralized currency symbols and formatting for the application
 */

/**
 * Currency symbol used throughout the application
 * @constant
 */
export const CURRENCY_SYMBOL = "E£" as const;

/**
 * Currency code (ISO 4217)
 * @constant
 */
export const CURRENCY_CODE = "EGP" as const;

/**
 * Currency name
 * @constant
 */
export const CURRENCY_NAME = "Egyptian Pound" as const;

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 *
 * @example
 * ```typescript
 * formatCurrency(12.5) // "E£12.50"
 * formatCurrency(100) // "E£100.00"
 * formatCurrency(9.999, 2) // "E£10.00"
 * ```
 */
export function formatCurrency(amount: number, decimals: number = 2): string {
  return `${CURRENCY_SYMBOL}${amount.toFixed(decimals)}`;
}
