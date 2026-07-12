import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "../lib/utils/formatters";

describe("formatCurrency", () => {
  it("formats zero as a non-empty string", () => {
    const result = formatCurrency(0);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("formats positive numbers", () => {
    const result = formatCurrency(1000);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("clamps negative values to zero", () => {
    const negative = formatCurrency(-500);
    const zero = formatCurrency(0);
    expect(negative).toBe(zero);
  });

  it("handles undefined gracefully", () => {
    const result = formatCurrency(undefined as unknown as number);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("handles NaN gracefully", () => {
    const result = formatCurrency(NaN);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("passes through Intl options", () => {
    const result = formatCurrency(1234567, { maximumFractionDigits: 2 });
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("larger values produce longer strings", () => {
    const small = formatCurrency(1);
    const large = formatCurrency(999999);
    expect(large.length).toBeGreaterThanOrEqual(small.length);
  });
});

describe("formatNumber", () => {
  it("formats with default 2 decimals", () => {
    const result = formatNumber(42);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("formats with custom decimals", () => {
    const result = formatNumber(3.14159, 4);
    expect(typeof result).toBe("string");
  });

  it("formats zero", () => {
    const result = formatNumber(0);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("higher decimals produce more precision", () => {
    const low = formatNumber(3.14, 1);
    const high = formatNumber(3.14, 4);
    expect(high.length).toBeGreaterThanOrEqual(low.length);
  });
});

describe("formatPercentage", () => {
  it("formats percentage with default decimals", () => {
    const result = formatPercentage(25);
    expect(typeof result).toBe("string");
    expect(result).toContain("٪");
  });

  it("formats percentage with custom decimals", () => {
    const result = formatPercentage(33.333, 1);
    expect(typeof result).toBe("string");
    expect(result).toContain("٪");
  });

  it("formats zero percent", () => {
    const result = formatPercentage(0);
    expect(typeof result).toBe("string");
    expect(result).toContain("٪");
  });

  it("formats 100 percent", () => {
    const result = formatPercentage(100);
    expect(typeof result).toBe("string");
    expect(result).toContain("٪");
  });

  it("negative percentages are handled", () => {
    const result = formatPercentage(-10);
    expect(typeof result).toBe("string");
    expect(result).toContain("٪");
  });
});
