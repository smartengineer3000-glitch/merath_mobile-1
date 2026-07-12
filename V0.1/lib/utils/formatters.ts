/**
 * Centralized Number Formatting Utilities
 * Provides consistent number formatting across the application
 * Uses ar-SA locale for Arabic numeral formatting
 */

/**
 * Format a number as currency with Arabic numerals
 * @param value - The number to format
 * @param options - Intl.NumberFormat options
 * @returns Formatted currency string (e.g., "١٠٠٠٠٠ ر.س")
 */
export function formatCurrency(
  value: number,
  options: Intl.NumberFormatOptions = {},
): string {
  const num = Math.max(0, value || 0);
  return new Intl.NumberFormat("ar-SA", {
    maximumFractionDigits: 0,
    ...options,
  }).format(num);
}

/**
 * Format a number with Arabic numerals
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string with Arabic numerals
 */
export function formatNumber(value: number, decimals: number = 2): string {
  const num = value || 0;
  return new Intl.NumberFormat("ar-SA", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format a percentage with Arabic numerals
 * @param value - The percentage value (0-100)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string (e.g., "٢٥٫٠٠٪")
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${formatNumber(value, decimals)}٪`;
}
