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

/**
 * Largest Remainder Method for percentage distribution
 * Ensures percentages sum to exactly 100% by allocating remainder
 * @param shares - Array of share amounts
 * @returns Array of percentages that sum to exactly 100%
 */
export function calculatePercentagesLargestRemainder(
  shares: number[],
): number[] {
  if (shares.length === 0) return [];

  const total = shares.reduce((sum, share) => sum + share, 0);
  if (total === 0) return shares.map(() => 0);

  // Calculate raw percentages
  const rawPercentages = shares.map((share) => (share / total) * 100);

  // Get integer parts and fractional parts
  const integerParts = rawPercentages.map((p) => Math.floor(p));
  const fractionalParts = rawPercentages.map((p, i) => p - integerParts[i]);

  // Calculate remaining percentage to distribute
  const currentSum = integerParts.reduce((sum, int) => sum + int, 0);
  const remainder = 100 - currentSum;

  // Distribute remainder to shares with largest fractional parts
  const sortedIndices = fractionalParts
    .map((frac, index) => ({ frac, index }))
    .sort((a, b) => b.frac - a.frac);

  const result = [...integerParts];
  for (let i = 0; i < remainder && i < sortedIndices.length; i++) {
    result[sortedIndices[i].index] += 1;
  }

  return result;
}

/**
 * Validate that percentages sum to 100%
 * @param percentages - Array of percentage values
 * @returns true if sum equals 100 (with small tolerance)
 */
export function validatePercentageSum(percentages: number[]): boolean {
  const sum = percentages.reduce((total, p) => total + p, 0);
  return Math.abs(sum - 100) < 0.01; // Small tolerance for floating point
}

/**
 * Format a share amount with percentage
 * @param amount - The share amount
 * @param percentage - The share percentage
 * @returns Formatted string (e.g., "١٠٠٠٠ ر.س (٢٥٫٠٠٪)")
 */
export function formatShareWithPercentage(
  amount: number,
  percentage: number,
): string {
  return `${formatCurrency(amount)} (${formatPercentage(percentage)})`;
}

/**
 * Convert Western numerals to Arabic numerals
 * @param text - Text containing Western numerals
 * @returns Text with Arabic numerals
 */
export function toArabicNumerals(text: string): string {
  return text.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)] || d);
}

/**
 * Convert Arabic numerals to Western numerals
 * @param text - Text containing Arabic numerals
 * @returns Text with Western numerals
 */
export function fromArabicNumerals(text: string): string {
  return text.replace(/[٠-٩]/g, (d) => {
    const map: Record<string, string> = {
      "٠": "0",
      "١": "1",
      "٢": "2",
      "٣": "3",
      "٤": "4",
      "٥": "5",
      "٦": "6",
      "٧": "7",
      "٨": "8",
      "٩": "9",
    };
    return map[d] || d;
  });
}
