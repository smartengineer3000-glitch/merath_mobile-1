/**
 * Safe decimal parser that handles:
 * - Commas as decimal separators (European format)
 * - Arabic numerals (٠١٢٣٤٥٦٧٨٩)
 * - Invalid characters
 * - Empty strings
 * - Multiple decimal points
 */
export function parseSafeDecimal(value: string): number {
  if (!value || typeof value !== "string") return 0;

  // Convert Arabic numerals to Western
  const arabicToWestern = value.replace(/[٠-٩]/g, (d) => {
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

  // Replace comma with period (European format)
  const withPeriod = arabicToWestern.replace(/,/g, ".");

  // Remove all non-numeric chars except period and minus
  const cleaned = withPeriod.replace(/[^0-9.-]/g, "");

  // Handle multiple decimal points - keep only first
  const parts = cleaned.split(".");
  const sanitized =
    parts.length > 1 ? parts[0] + "." + parts.slice(1).join("") : cleaned;

  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? 0 : parsed;
}

export function parseSafeInteger(value: string): number {
  if (!value || typeof value !== "string") return 0;

  const arabicToWestern = value.replace(/[٠-٩]/g, (d) => {
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

  const cleaned = arabicToWestern.replace(/[^0-9]/g, "");
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}
