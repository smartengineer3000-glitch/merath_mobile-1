/**
 * Real-World Islamic Inheritance Test Scenarios
 * 40 cases: 10 simple, 10 moderate, 10 complex, 10 special
 * Based on Quran (An-Nisa 4:11-12) and Sunnah references
 *
 * All estate values use 120,000 for easy manual verification.
 * Tolerance: amounts within 1.0 of expected (rounding).
 */

import { describe, it, expect } from "vitest";
import { EnhancedInheritanceCalculationEngine } from "../lib/inheritance/enhanced-engine-complete";
import type {
  EstateData,
  HeirsData,
  MadhhabType,
} from "../lib/inheritance/types";

const E: EstateData = { total: 120000, funeral: 0, debts: 0, will: 0 };

function calc(madhab: MadhhabType, heirs: HeirsData) {
  const engine = new EnhancedInheritanceCalculationEngine(madhab, E, heirs);
  return engine.calculate();
}

function getShare(result: ReturnType<typeof calc>, key: string) {
  return result.shares.find((s) => s.key === key);
}

function expectShare(
  result: ReturnType<typeof calc>,
  key: string,
  expectedAmount: number,
  _tolerance = 1.0,
) {
  const share = getShare(result, key);
  expect(share, `Expected heir "${key}" to exist`).toBeDefined();
  expect(share!.amount).toBeCloseTo(expectedAmount, 0);
}

function expectTotal(result: ReturnType<typeof calc>) {
  const total = result.shares.reduce((sum, s) => sum + s.amount, 0);
  expect(total).toBeCloseTo(result.netEstate ?? 0, 0);
}

// ============================================================
// SIMPLE CASES — Same results across all 4 madhhabs
// ============================================================
describe("Simple Cases — Basic Fard & Asaba (Quran 4:11-12)", () => {
  const madhabs: MadhhabType[] = ["shafii", "hanafi", "maliki", "hanbali"];

  // S1: Wife only — 1/4 fard + radd (Hanafi/Maliki) or just 1/4 (Shafii/Hanbali)
  // Quran 4:12: "فَلَهُنَّ رُبُعُ مَا تَرَكَ"
  // Hanafi/Hanbali: spouse radd when sole heir → wife gets full estate
  // Shafii/Maliki: no spouse radd → wife keeps 1/4 only
  madhabs.forEach((m) => {
    it(`S1 [${m}]: Wife only — ${["hanafi", "hanbali"].includes(m) ? "1/4 + radd = 120,000" : "1/4 = 30,000"}`, () => {
      const r = calc(m, { wife: 1 });
      expect(r.success).toBe(true);
      if (["hanafi", "hanbali"].includes(m)) {
        expectShare(r, "wife", 120000);
        expect(r.raddApplied).toBe(true);
      } else {
        expectShare(r, "wife", 30000);
      }
    });
  });

  // S2: Husband only — 1/2 fard + radd (Hanafi/Hanbali) or just 1/2 (Shafii/Maliki)
  // Quran 4:12: "لِلزَّوْجِ نِصْفُ مَا تَرَكَ"
  madhabs.forEach((m) => {
    it(`S2 [${m}]: Husband only — ${["hanafi", "hanbali"].includes(m) ? "1/2 + radd = 120,000" : "1/2 = 60,000"}`, () => {
      const r = calc(m, { husband: 1 });
      expect(r.success).toBe(true);
      if (["hanafi", "hanbali"].includes(m)) {
        expectShare(r, "husband", 120000);
        expect(r.raddApplied).toBe(true);
      } else {
        expectShare(r, "husband", 60000);
      }
    });
  });

  // S3: Son only — takes all (asaba)
  madhabs.forEach((m) => {
    it(`S3 [${m}]: Son only — 120,000 (asaba)`, () => {
      const r = calc(m, { son: 1 });
      expect(r.success).toBe(true);
      expectShare(r, "son", 120000);
    });
  });

  // S4: Daughter only — 1/2 fard + remainder as radd = full estate
  // Quran 4:11: "فَإِن كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ"
  // When sole heir, daughter gets fard (1/2) + remainder via radd (1/2) = full estate
  madhabs.forEach((m) => {
    it(`S4 [${m}]: Daughter only — fard + radd = 120,000`, () => {
      const r = calc(m, { daughter: 1 });
      expect(r.success).toBe(true);
      expectShare(r, "daughter", 120000);
    });
  });

  // S5: Mother + father (no descendants) — Mother 1/3, Father asaba
  // Quran 4:11: "لِلْأُمَّ ثُلُثَ مَا تَرَكَ"
  madhabs.forEach((m) => {
    it(`S5 [${m}]: Mother + father — Mother 40,000, Father 80,000`, () => {
      const r = calc(m, { mother: 1, father: 1 });
      expect(r.success).toBe(true);
      expectShare(r, "mother", 40000);
      expectShare(r, "father", 80000);
      expectTotal(r);
    });
  });

  // S6: Wife + son — Wife 1/8, Son takes rest
  // Quran 4:12: "فَلَهُنَّ الثُّمُنُ" (with descendants)
  madhabs.forEach((m) => {
    it(`S6 [${m}]: Wife + son — Wife 15,000, Son 105,000`, () => {
      const r = calc(m, { wife: 1, son: 1 });
      expect(r.success).toBe(true);
      expectShare(r, "wife", 15000);
      expectShare(r, "son", 105000);
      expectTotal(r);
    });
  });

  // S7: Husband + daughter — Husband 1/4, Daughter 1/2 + asaba
  // Quran 4:12: "فَلَهُ الرُّبُعُ" (with descendants)
  madhabs.forEach((m) => {
    it(`S7 [${m}]: Husband + daughter — Husband 30,000, Daughter 90,000`, () => {
      const r = calc(m, { husband: 1, daughter: 1 });
      expect(r.success).toBe(true);
      expectShare(r, "husband", 30000);
      expectShare(r, "daughter", 90000);
      expectTotal(r);
    });
  });

  // S8: Wife + husband + son — Wife 1/8, Husband 1/4, Son rest
  madhabs.forEach((m) => {
    it(`S8 [${m}]: Wife + husband + son — W 15,000, H 30,000, Son 75,000`, () => {
      const r = calc(m, { wife: 1, husband: 1, son: 1 });
      expect(r.success).toBe(true);
      expectShare(r, "wife", 15000);
      expectShare(r, "husband", 30000);
      expectShare(r, "son", 75000);
      expectTotal(r);
    });
  });

  // S9: Son + 2 daughters — Son 2x each daughter (asaba ratio)
  madhabs.forEach((m) => {
    it(`S9 [${m}]: Son + 2 daughters — Son 60,000, Daughters 30,000 each`, () => {
      const r = calc(m, { son: 1, daughter: 2 });
      expect(r.success).toBe(true);
      expectShare(r, "son", 60000);
      expectShare(r, "daughter", 60000); // 2 daughters × 30,000 each
      expectTotal(r);
    });
  });

  // S10: Wife + mother + father + son — All fard + asaba
  madhabs.forEach((m) => {
    it(`S10 [${m}]: Wife + mother + father + son — W 15k, M 20k, F 20k, Son 65k`, () => {
      const r = calc(m, { wife: 1, mother: 1, father: 1, son: 1 });
      expect(r.success).toBe(true);
      expectShare(r, "wife", 15000);
      expectShare(r, "mother", 20000);
      expectShare(r, "father", 20000);
      expectShare(r, "son", 65000);
      expectTotal(r);
    });
  });
});

// ============================================================
// MODERATE CASES — Multiple heirs, some with awl/radd
// ============================================================
describe("Moderate Cases — Multiple Heirs & Rule Interactions", () => {
  // M1: Husband + 2 daughters + mother — AWL case
  // Fard: H=1/4, D=2/3, M=1/6 → total=13/12 > 1 → AWL
  it("M1: Husband + 2 daughters + mother — AWL (13/12 > 1)", () => {
    const r = calc("shafii", { husband: 1, daughter: 2, mother: 1 });
    expect(r.success).toBe(true);
    expect(r.awlApplied).toBe(true);
    // After AWL: each fraction / total_fard × estate
    // H: 3/13 × 120000 ≈ 27,692.31
    // D: 8/13 × 120000 ≈ 73,846.15
    // M: 2/13 × 120000 ≈ 18,461.54
    expectShare(r, "husband", 27692);
    expectShare(r, "daughter", 73846);
    expectShare(r, "mother", 18462);
    expectTotal(r);
  });

  // M2: Wife + mother + 2 full brothers — Brothers take remainder
  it("M2: Wife + mother + 2 full brothers — H 30k, M 20k, Brothers 70k", () => {
    const r = calc("shafii", { wife: 1, mother: 1, full_brother: 2 });
    expect(r.success).toBe(true);
    expectShare(r, "wife", 30000);
    expectShare(r, "mother", 20000); // 1/6 (2+ siblings)
    expectShare(r, "full_brother", 70000); // asaba
    expectTotal(r);
  });

  // M3: Husband + mother + full_brother + full_sister — Brother+split remainder 2:1
  it("M3: Husband + mother + full_brother + full_sister", () => {
    const r = calc("shafii", {
      husband: 1,
      mother: 1,
      full_brother: 1,
      full_sister: 1,
    });
    expect(r.success).toBe(true);
    expectShare(r, "husband", 60000); // 1/2
    expectShare(r, "mother", 20000); // 1/6 (siblings present)
    // Remainder = 40,000 → brother 2/3, sister 1/3
    expectShare(r, "full_brother", 26667);
    expectShare(r, "full_sister", 13333);
    expectTotal(r);
  });

  // M4: Wife + father + mother (Umariyyah case) — W 1/4, M 1/4 (1/3 of remainder), Father asaba
  it("M4: Wife + father + mother — W 30k, M 30k, F 60k", () => {
    const r = calc("shafii", { wife: 1, father: 1, mother: 1 });
    expect(r.success).toBe(true);
    expectShare(r, "wife", 30000); // 1/4
    expectShare(r, "mother", 30000); // 1/3 × (1 - 1/4) = 1/4 (Umariyyah)
    expectShare(r, "father", 60000); // asaba
    expectTotal(r);
  });

  // M5: 4 wives + son — Each wife 1/8/4 = 3,750
  it("M5: 4 wives + son — Each wife 3,750, Son 105,000", () => {
    const r = calc("shafii", { wife: 4, son: 1 });
    expect(r.success).toBe(true);
    const wifeShare = getShare(r, "wife");
    expect(wifeShare).toBeDefined();
    expect(wifeShare!.amount).toBeCloseTo(15000, 0); // 1/8 total
    expect(wifeShare!.count).toBe(4);
    expectShare(r, "son", 105000);
    expectTotal(r);
  });

  // M6: Husband + mother + maternal siblings — AWL case
  // H=1/2, M=1/3 (no paternal siblings), MS=1/3 → total=7/6 → AWL
  it("M6: Husband + mother + 2 maternal siblings — AWL (7/6 > 1)", () => {
    const r = calc("shafii", {
      husband: 1,
      mother: 1,
      maternal_brother: 1,
      maternal_sister: 1,
    });
    expect(r.success).toBe(true);
    expect(r.awlApplied).toBe(true);
    // After AWL: each fraction / (7/6) × estate
    // H: 3/7 × 120000 ≈ 51429, M: 2/7 × 120000 ≈ 34286, MS: 2/7 × 120000 ≈ 34286
    expectShare(r, "husband", 51429);
    expectShare(r, "mother", 34286);
    expectTotal(r);
  });

  // M7: Wife + father + 2 full_brothers — Father blocks brothers (asaba hierarchy)
  it("M7: Wife + father + 2 full_brothers — W 30k, F 90k (blocks brothers)", () => {
    const r = calc("shafii", { wife: 1, father: 1, full_brother: 2 });
    expect(r.success).toBe(true);
    expectShare(r, "wife", 30000); // 1/4
    expectShare(r, "father", 90000); // asaba — father blocks brothers
    const brothers = getShare(r, "full_brother");
    expect(brothers).toBeUndefined(); // Blocked by father
    expectTotal(r);
  });

  // M8: Husband + 2 daughters + mother + father — Father gets remainder
  it("M8: Husband + 2 daughters + mother + father", () => {
    const r = calc("shafii", { husband: 1, daughter: 2, mother: 1, father: 1 });
    expect(r.success).toBe(true);
    // H: 1/4, D: 2/3, M: 1/6 → AWL
    expect(r.awlApplied).toBe(true);
    expectTotal(r);
  });

  // M9: Wife + grandfather + full_brother + full_sister (Maliki musharak)
  // In Maliki, grandfather shares with siblings via optimal choice
  it("M9: Wife + grandfather + full_brother + full_sister [maliki]", () => {
    const r = calc("maliki", {
      wife: 1,
      grandfather: 1,
      full_brother: 1,
      full_sister: 1,
    });
    expect(r.success).toBe(true);
    expectShare(r, "wife", 30000); // 1/4 (no descendants)
    // Grandfather: best of muqasamah (3/4×2/5=0.3), third (0.333), sixth (0.167) → third wins
    expectShare(r, "grandfather", 40000); // 1/3 of estate
    // Brothers/sisters get remainder after grandfather as asaba
    expectShare(r, "full_brother", 33333); // 2/3 of (3/4 - 1/3) = 2/3 × 5/12
    expectShare(r, "full_sister", 16667); // 1/3 of (3/4 - 1/3)
    expectTotal(r);
  });

  // M10: Wife + 3 daughters + mother — Radd case (Shafii)
  it("M10: Wife + 3 daughters + mother [shafii] — Radd to blood relatives", () => {
    const r = calc("shafii", { wife: 1, daughter: 3, mother: 1 });
    expect(r.success).toBe(true);
    // W: 1/8 = 15,000, M: 1/6 = 20,000, D: 2/3 = 80,000
    // Total fard: 115,000. Remainder: 5,000
    // Radd goes to mother + daughters (blood relatives, not wife in Shafii)
    // M eligible: 1/6, D eligible: 2/3 → total eligible = 5/6
    // M radd: (1/6)/(5/6) × 5,000 = 1,000 → M total = 21,000
    // D radd: (2/3)/(5/6) × 5,000 = 4,000 → D total = 84,000 (28,000 each)
    expect(r.raddApplied).toBe(true);
    expectShare(r, "wife", 15000); // No radd for wife in Shafii
    expectShare(r, "mother", 21000);
    expectShare(r, "daughter", 84000); // 3 daughters × 28,000
    expectTotal(r);
  });
});

// ============================================================
// COMPLEX CASES — Awl, Radd, Musharak, Umariyyah
// ============================================================
describe("Complex Cases — Awl, Radd, and Special Rules", () => {
  // C1: Umariyyah case — Wife + mother + father (no descendants)
  // Mother gets 1/3 of remainder after spouse (Shafii/Hanafi/Hanbali)
  // Maliki: mother always gets 1/6
  it("C1 [shafii]: Umariyyah — Wife + mother + father (no descendants)", () => {
    const r = calc("shafii", { wife: 1, mother: 1, father: 1 });
    expect(r.success).toBe(true);
    expectShare(r, "wife", 30000); // 1/4
    // Mother: 1/3 × (1 - 1/4) = 1/3 × 3/4 = 1/4 = 30,000
    expectShare(r, "mother", 30000);
    // Father: asaba = 120,000 - 30,000 - 30,000 = 60,000
    expectShare(r, "father", 60000);
    expectTotal(r);
  });

  it("C1 [maliki]: Umariyyah — Wife + mother + father [maliki]", () => {
    const r = calc("maliki", { wife: 1, mother: 1, father: 1 });
    expect(r.success).toBe(true);
    expectShare(r, "wife", 30000); // 1/4
    // Maliki: mother always gets 1/6 = 20,000
    expectShare(r, "mother", 20000);
    // Father: asaba = 70,000
    expectShare(r, "father", 70000);
    expectTotal(r);
  });

  // C2: Radd — Wife only in Hanafi (spouse radd allowed)
  it("C2 [hanafi]: Wife only — Radd gives full estate", () => {
    const r = calc("hanafi", { wife: 1 });
    expect(r.success).toBe(true);
    expect(r.raddApplied).toBe(true);
    expectShare(r, "wife", 120000); // 1/4 fard + 3/4 radd
  });

  it("C2 [shafii]: Wife only — No spouse radd", () => {
    const r = calc("shafii", { wife: 1 });
    expect(r.success).toBe(true);
    expectShare(r, "wife", 30000); // 1/4 only, no radd for spouse
  });

  // C3: Husband only — Hanafi radd vs Shafii
  it("C3 [hanafi]: Husband only — Radd gives full estate", () => {
    const r = calc("hanafi", { husband: 1 });
    expect(r.success).toBe(true);
    expect(r.raddApplied).toBe(true);
    expectShare(r, "husband", 120000);
  });

  it("C3 [shafii]: Husband only — No spouse radd", () => {
    const r = calc("shafii", { husband: 1 });
    expect(r.success).toBe(true);
    expectShare(r, "husband", 60000);
  });

  // C4: Mother's share with 1 sibling vs 2+ siblings
  // With 1 full brother: mother gets 1/3
  it("C4a [shafii]: Mother + 1 full_brother — Mother 1/3", () => {
    const r = calc("shafii", { mother: 1, full_brother: 1 });
    expect(r.success).toBe(true);
    expectShare(r, "mother", 40000); // 1/3 (only 1 sibling type)
    expectShare(r, "full_brother", 80000); // asaba
    expectTotal(r);
  });

  // With 2 full brothers: mother gets 1/6
  it("C4b [shafii]: Mother + 2 full_brothers — Mother 1/6", () => {
    const r = calc("shafii", { mother: 1, full_brother: 2 });
    expect(r.success).toBe(true);
    expectShare(r, "mother", 20000); // 1/6 (2+ siblings)
    expectShare(r, "full_brother", 100000); // asaba
    expectTotal(r);
  });

  // C5: 2 daughters get 2/3 + remainder as radd, 3+ daughters get 2/3 + remainder as radd
  it("C5a [shafii]: 2 daughters — fard + radd = full estate", () => {
    const r = calc("shafii", { daughter: 2 });
    expect(r.success).toBe(true);
    // 2 daughters: fard 2/3 + remainder 1/3 via radd = full estate
    expectShare(r, "daughter", 120000);
  });

  it("C5b [shafii]: 3 daughters — fard + radd = full estate", () => {
    const r = calc("shafii", { daughter: 3 });
    expect(r.success).toBe(true);
    // 3+ daughters: fard 2/3 (Quran 4:11) + remainder 1/3 via radd = full estate
    expectShare(r, "daughter", 120000);
  });

  // C6: Grandfather with siblings — Hijab (Shafii) vs Musharak (Maliki)
  it("C6 [shafii]: Grandfather + full_brother — Hijab (grandfather takes all)", () => {
    const r = calc("shafii", { grandfather: 1, full_brother: 1 });
    expect(r.success).toBe(true);
    expectShare(r, "grandfather", 120000); // Takes all, blocks brother
    const brother = getShare(r, "full_brother");
    expect(brother).toBeUndefined(); // Blocked
  });

  it("C6 [maliki]: Grandfather + full_brother — Musharak", () => {
    const r = calc("maliki", { grandfather: 1, full_brother: 1 });
    expect(r.success).toBe(true);
    // Maliki: grandfather shares with siblings via muqasama
    // Or takes 1/3 or 1/6, whichever is best
    const grandfather = getShare(r, "grandfather");
    expect(grandfather).toBeDefined();
    expect(grandfather!.amount).toBeGreaterThan(0);
    expectTotal(r);
  });

  // C7: Complex Awl — Wife + husband + mother + 2 daughters
  // W=1/8, H=1/4, M=1/6, D=2/3 → total = 3/24+6/24+4/24+16/24 = 29/24 → AWL
  it("C7: Wife + husband + mother + 2 daughters — AWL (29/24)", () => {
    const r = calc("shafii", { wife: 1, husband: 1, mother: 1, daughter: 2 });
    expect(r.success).toBe(true);
    expect(r.awlApplied).toBe(true);
    expectTotal(r);
    // Verify no share exceeds estate
    r.shares.forEach((s) => {
      expect(s.amount).toBeGreaterThan(0);
      expect(s.amount).toBeLessThanOrEqual(120000);
    });
  });

  // C8: Husband + father + full_brother — Father blocks brother (asaba hierarchy)
  it("C8: Husband + father + full_brother — Father blocks brother", () => {
    const r = calc("shafii", { husband: 1, father: 1, full_brother: 1 });
    expect(r.success).toBe(true);
    expectShare(r, "husband", 60000); // 1/2 (no descendants)
    // Father: 1/6 fard + asaba remainder
    // Wait, no descendants. Father gets asaba = 60,000
    expectShare(r, "father", 60000); // asaba (blocks brother)
    const brother = getShare(r, "full_brother");
    expect(brother).toBeUndefined(); // Blocked by father
    expectTotal(r);
  });

  // C9: Multiple wives + mother + father + 2 daughters — AWL
  it("C9: 2 wives + mother + father + 2 daughters — AWL", () => {
    const r = calc("shafii", { wife: 2, mother: 1, father: 1, daughter: 2 });
    expect(r.success).toBe(true);
    // 2 wives: 1/8 = 15,000 total
    // Mother: 1/6 = 20,000
    // Father: 1/6 = 20,000
    // 2 daughters: 2/3 = 80,000
    // Total: 135,000 > 120,000 → AWL
    expect(r.awlApplied).toBe(true);
    expectTotal(r);
  });

  // C10: Grandfather + 3 full brothers (Maliki) — Optimal choice
  it("C10 [maliki]: Grandfather + 3 full brothers — Optimal choice", () => {
    const r = calc("maliki", { grandfather: 1, full_brother: 3 });
    expect(r.success).toBe(true);
    // Grandfather: best of muqasamah (1/4), third (1/3), sixth (1/6) → third wins
    expectShare(r, "grandfather", 40000); // 1/3 of estate
    // Brothers get remainder (2/3) as asaba: 3 brothers, totalHeads=6
    expectShare(r, "full_brother", 80000); // 2/3 × 120,000
    expectTotal(r);
  });
});

// ============================================================
// SPECIAL CASES — Musharraka, Akdariyya, Dhawu al-Arham
// ============================================================
describe("Special Cases — Musharraka, Akdariyya, Dhawu al-Arham", () => {
  // SP1: Musharraka (Shafii) — Husband + mother + 2 maternal brothers + full_sister
  it("SP1 [shafii]: Musharraka — Husband + mother + 2 maternal + full_sister", () => {
    const r = calc("shafii", {
      husband: 1,
      mother: 1,
      maternal_brother: 2,
      full_sister: 1,
    });
    expect(r.success).toBe(true);
    // Husband: 1/2 = 60,000
    // Mother: 1/6 = 20,000
    // Shared siblings (2 maternal + 1 full_sister = 3): 1/3 = 40,000
    expectShare(r, "husband", 60000);
    expectShare(r, "mother", 20000);
    expectTotal(r);
  });

  // SP2: Akdariyya (Shafii) — Husband + mother + grandfather + full_sister
  it("SP2 [shafii]: Akdariyya — Husband + mother + grandfather + full_sister", () => {
    const r = calc("shafii", {
      husband: 1,
      mother: 1,
      grandfather: 1,
      full_sister: 1,
    });
    expect(r.success).toBe(true);
    // Akdariyya: H=9/27, M=6/27, G=8/27, S=4/27
    expectShare(r, "husband", 40000); // 9/27 × 120,000
    expectShare(r, "mother", 26667); // 6/27 × 120,000
    expectShare(r, "grandfather", 35556); // 8/27 × 120,000
    expectShare(r, "full_sister", 17778); // 4/27 × 120,000
    expectTotal(r);
  });

  // SP3: Dhawu al-Arham — Wife + daughter_son
  it("SP3: Dhawu al-Arham — Wife + daughter_son", () => {
    const r = calc("shafii", { wife: 1, daughter_son: 1 });
    expect(r.success).toBe(true);
    // Wife: 1/4 = 30,000
    // daughter_son: blood relative gets remainder = 90,000
    expectShare(r, "wife", 30000);
    expectShare(r, "daughter_son", 90000);
    expectTotal(r);
  });

  // SP4: Dhawu al-Arham — Wife + maternal_uncle
  it("SP4: Dhawu al-Arham — Wife + maternal_uncle", () => {
    const r = calc("shafii", { wife: 1, maternal_uncle: 1 });
    expect(r.success).toBe(true);
    // Wife: 1/4 = 30,000
    // maternal_uncle: blood relative = 90,000
    expectShare(r, "wife", 30000);
    expectShare(r, "maternal_uncle", 90000);
    expectTotal(r);
  });

  // SP5: Dhawu al-Arham — Wife + full_nephew
  it("SP5: Dhawu al-Arham — Wife + full_nephew", () => {
    const r = calc("shafii", { wife: 1, full_nephew: 1 });
    expect(r.success).toBe(true);
    expectShare(r, "wife", 30000);
    expectShare(r, "full_nephew", 90000);
    expectTotal(r);
  });

  // SP6: Dhawu al-Arham — Wife + daughter_daughter
  it("SP6: Dhawu al-Arham — Wife + daughter_daughter", () => {
    const r = calc("shafii", { wife: 1, daughter_daughter: 1 });
    expect(r.success).toBe(true);
    expectShare(r, "wife", 30000);
    expectShare(r, "daughter_daughter", 90000);
    expectTotal(r);
  });

  // SP7: Grandmother priority — paternal vs maternal
  it("SP7: Grandmother priority — paternal gets 1/6 + radd over maternal", () => {
    const r = calc("shafii", {
      wife: 1,
      grandmother_father: 1,
      grandmother_mother: 1,
    });
    expect(r.success).toBe(true);
    expectShare(r, "wife", 30000); // 1/4
    // Paternal grandmother gets 1/6 fard + radd of remainder (sole fard blood relative)
    expectShare(r, "grandmother_father", 90000); // 1/6 + radd
    // Maternal grandmother gets nothing (blocked by paternal)
    const matGM = getShare(r, "grandmother_mother");
    expect(matGM).toBeUndefined();
    expectTotal(r);
  });

  // SP8: Grandmother when mother absent
  it("SP8: Grandmother 1/6 + radd when mother absent", () => {
    const r = calc("shafii", { wife: 1, grandmother: 1 });
    expect(r.success).toBe(true);
    expectShare(r, "wife", 30000); // 1/4
    // Grandmother gets 1/6 fard + radd of remainder (sole fard blood relative)
    expectShare(r, "grandmother", 90000); // 1/6 + radd
    expectTotal(r);
  });

  // SP9: Hanafi spouse radd vs Shafii
  it("SP9: Husband only — Hanafi radd vs Shafii", () => {
    const hanafi = calc("hanafi", { husband: 1 });
    const shafii = calc("shafii", { husband: 1 });
    expect(hanafi.raddApplied).toBe(true);
    expect(shafii.raddApplied).toBe(false);
    expectShare(hanafi, "husband", 120000);
    expectShare(shafii, "husband", 60000);
  });

  // SP10: Complex — Husband + grandfather + 3 full brothers (Maliki musharak)
  it("SP10 [maliki]: Husband + grandfather + 3 brothers — Musharak", () => {
    const r = calc("maliki", {
      husband: 1,
      grandfather: 1,
      full_brother: 3,
    });
    expect(r.success).toBe(true);
    expectShare(r, "husband", 60000); // 1/2 (no descendants)
    // Grandfather: best of muqasamah (1/2×2/8=1/8), third (1/3), sixth (1/6) → third wins
    expectShare(r, "grandfather", 40000); // 1/3 of estate
    // Brothers get remainder after grandfather: 1/2 - 1/3 = 1/6
    expectShare(r, "full_brother", 20000); // 1/6 × 120,000
    expectTotal(r);
  });
});
