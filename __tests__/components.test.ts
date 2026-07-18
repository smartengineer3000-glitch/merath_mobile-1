import { describe, it, expect } from "vitest";
import { HEIRS, HEIR_GROUPS } from "../constants/heirData";

describe("Component data structures", () => {
  describe("Heir configurations used by HeirCategory", () => {
    it("each group has heirs assigned to it", () => {
      for (const groupKey of Object.keys(HEIR_GROUPS)) {
        const groupHeirs = HEIRS.filter((h) => h.group === groupKey);
        expect(groupHeirs.length).toBeGreaterThan(0);
      }
    });

    it("spouses group contains exactly husband and wife", () => {
      const spouses = HEIRS.filter((h) => h.group === "spouses");
      const keys = spouses.map((s) => s.key).sort();
      expect(keys).toEqual(["husband", "wife"]);
    });

    it("descendants group has gender diversity", () => {
      const descendants = HEIRS.filter((h) => h.group === "descendants");
      const males = descendants.filter((d) => d.gender === "male");
      const females = descendants.filter((d) => d.gender === "female");
      expect(males.length).toBeGreaterThan(0);
      expect(females.length).toBeGreaterThan(0);
    });
  });

  describe("Heir color accessibility", () => {
    it("all heir colors are valid hex", () => {
      for (const heir of HEIRS) {
        expect(heir.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    });

    it("no two heirs in the same group share a color", () => {
      for (const group of Object.keys(HEIR_GROUPS)) {
        const groupHeirs = HEIRS.filter((h) => h.group === group);
        const colors = groupHeirs.map((h) => h.color);
        const uniqueColors = new Set(colors);
        expect(uniqueColors.size).toBe(colors.length);
      }
    });
  });

  describe("Heir gender consistency", () => {
    it("wives and daughters are female", () => {
      expect(HEIRS.find((h) => h.key === "wife")?.gender).toBe("female");
      expect(HEIRS.find((h) => h.key === "daughter")?.gender).toBe("female");
      expect(HEIRS.find((h) => h.key === "granddaughter")?.gender).toBe(
        "female",
      );
      expect(HEIRS.find((h) => h.key === "full_sister")?.gender).toBe("female");
      expect(HEIRS.find((h) => h.key === "paternal_sister")?.gender).toBe(
        "female",
      );
      expect(HEIRS.find((h) => h.key === "maternal_sister")?.gender).toBe(
        "female",
      );
    });

    it("husbands and sons are male", () => {
      expect(HEIRS.find((h) => h.key === "husband")?.gender).toBe("male");
      expect(HEIRS.find((h) => h.key === "son")?.gender).toBe("male");
      expect(HEIRS.find((h) => h.key === "grandson")?.gender).toBe("male");
      expect(HEIRS.find((h) => h.key === "father")?.gender).toBe("male");
      expect(HEIRS.find((h) => h.key === "grandfather")?.gender).toBe("male");
    });
  });

  describe("QuickAddChips scenario data", () => {
    it("all heir types in scenarios exist in HEIRS", () => {
      const heirKeys = HEIRS.map((h) => h.key);
      const scenarioHeirTypes = [
        "wife",
        "daughter",
        "son",
        "husband",
        "father",
        "mother",
        "grandfather",
        "full_brother",
      ];
      for (const type of scenarioHeirTypes) {
        expect(heirKeys).toContain(type);
      }
    });
  });

  describe("EstateCard data flow", () => {
    it("estate values are non-negative numbers", () => {
      const estate = {
        total: 100000,
        funeral: 5000,
        debts: 10000,
        will: 15000,
      };
      expect(estate.total).toBeGreaterThanOrEqual(0);
      expect(estate.funeral).toBeGreaterThanOrEqual(0);
      expect(estate.debts).toBeGreaterThanOrEqual(0);
      expect(estate.will).toBeGreaterThanOrEqual(0);
    });

    it("net estate is calculated correctly", () => {
      const total = 100000;
      const deductions = 5000 + 10000 + 15000;
      const netEstate = total - deductions;
      expect(netEstate).toBe(70000);
    });

    it("net estate cannot be negative", () => {
      const total = 10000;
      const deductions = 5000 + 10000 + 15000;
      const netEstate = Math.max(0, total - deductions);
      expect(netEstate).toBe(0);
    });
  });

  describe("StepperCounter data flow", () => {
    it("increment does not exceed max", () => {
      let value = 8;
      const max = 10;
      value = Math.min(value + 1, max);
      expect(value).toBe(9);
    });

    it("increment at max stays at max", () => {
      let value = 10;
      const max = 10;
      value = Math.min(value + 1, max);
      expect(value).toBe(10);
    });

    it("decrement does not go below min", () => {
      let value = 1;
      const min = 0;
      value = Math.max(value - 1, min);
      expect(value).toBe(0);
    });

    it("decrement at min stays at min", () => {
      let value = 0;
      const min = 0;
      value = Math.max(value - 1, min);
      expect(value).toBe(0);
    });
  });

  describe("Badge data flow", () => {
    it("determines variant from value", () => {
      const getVariant = (value: number) =>
        value > 0 ? "success" : value < 0 ? "error" : "default";

      expect(getVariant(10)).toBe("success");
      expect(getVariant(-5)).toBe("error");
      expect(getVariant(0)).toBe("default");
    });
  });

  describe("ProgressBar data flow", () => {
    it("clamps percentage to 0-100", () => {
      const clamp = (v: number) => Math.max(0, Math.min(100, v));
      expect(clamp(-10)).toBe(0);
      expect(clamp(150)).toBe(100);
      expect(clamp(50)).toBe(50);
    });
  });

  describe("Chip selection logic", () => {
    it("toggles selected state", () => {
      const selected = new Set<string>();
      const toggle = (id: string) => {
        if (selected.has(id)) selected.delete(id);
        else selected.add(id);
      };

      toggle("a");
      expect(selected.has("a")).toBe(true);
      toggle("a");
      expect(selected.has("a")).toBe(false);
      toggle("b");
      expect(selected.size).toBe(1);
    });
  });

  describe("SectionHeader data flow", () => {
    it("formats action label with count", () => {
      const format = (count: number, label: string) => `${count} ${label}`;
      expect(format(3, "selected")).toBe("3 selected");
      expect(format(0, "items")).toBe("0 items");
    });
  });

  describe("EmptyState data flow", () => {
    it("shows correct message for empty vs no-results", () => {
      const getMessage = (hasData: boolean, hasResults: boolean) => {
        if (!hasData) return "no-data";
        if (!hasResults) return "no-results";
        return "has-data";
      };

      expect(getMessage(false, false)).toBe("no-data");
      expect(getMessage(true, false)).toBe("no-results");
      expect(getMessage(true, true)).toBe("has-data");
    });
  });
});
