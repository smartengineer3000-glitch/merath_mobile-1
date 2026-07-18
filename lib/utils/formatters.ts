/**
 * Centralized Number Formatting Utilities
 * Provides consistent number formatting across the application
 * Uses en-US locale for English numeral formatting
 */

/**
 * Format a number as currency with English numerals
 * @param value - The number to format
 * @param options - Intl.NumberFormat options
 * @returns Formatted currency string (e.g., "1,000,000")
 */
export function formatCurrency(
  value: number,
  options: Intl.NumberFormatOptions = {},
): string {
  const num = Math.max(0, value || 0);
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    ...options,
  }).format(num);
}

/**
 * Format a number with English numerals
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string with English numerals
 */
export function formatNumber(value: number, decimals: number = 2): string {
  const num = value || 0;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format a percentage with English numerals
 * @param value - The percentage value (0-100)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string (e.g., "25.00%")
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${formatNumber(value, decimals)}٪`;
}
