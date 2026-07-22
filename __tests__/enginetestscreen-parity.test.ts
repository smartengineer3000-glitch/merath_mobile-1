/**
 * EngineTestScreen parity test — runs exactly the same 40 cases
 * with the same tolerance logic as the in-app test screen.
 */
import { describe, it, expect } from "vitest";
import { EnhancedInheritanceCalculationEngine } from "../lib/inheritance/enhanced-engine-complete";
import type {
  EstateData,
  HeirsData,
  MadhhabType,
} from "../lib/inheritance/types";

const E: EstateData = { total: 120000, funeral: 0, debts: 0, will: 0 };
const ALL_MADHHABS: MadhhabType[] = ["shafii", "hanafi", "maliki", "hanbali"];

function run(
  name: string,
  madhab: MadhhabType,
  heirs: HeirsData,
  expected: Record<string, number>,
  tolerance = 50,
) {
  const engine = new EnhancedInheritanceCalculationEngine(madhab, E, heirs);
  const result = engine.calculate();
  const computed: Record<string, number> = {};
  for (const s of result.shares) {
    if (s.key) computed[s.key] = Math.round(s.amount);
  }

  it(name, () => {
    expect(result.success).toBe(true);
    for (const [key, expectedVal] of Object.entries(expected)) {
      const computedVal = computed[key];
      expect(computedVal, `Missing heir: ${key}`).toBeDefined();
      expect(
        Math.abs(computedVal! - expectedVal),
        `${key}: expected ${expectedVal}, got ${computedVal} (tolerance ${tolerance})`,
      ).toBeLessThanOrEqual(tolerance);
    }
  });
}

describe("EngineTestScreen parity (40 cases)", () => {
  // ── SIMPLE ──
  for (const m of ALL_MADHHABS) {
    const isRadd = m === "hanafi" || m === "hanbali";
    run(
      `S1 [${m}]: Wife only`,
      m,
      { wife: 1 },
      { wife: isRadd ? 120000 : 30000 },
    );
    run(
      `S2 [${m}]: Husband only`,
      m,
      { husband: 1 },
      { husband: isRadd ? 120000 : 60000 },
    );
    run(`S3 [${m}]: Son only`, m, { son: 1 }, { son: 120000 });
    run(`S4 [${m}]: Daughter only`, m, { daughter: 1 }, { daughter: isRadd ? 120000 : 60000 });
    run(
      `S5 [${m}]: Mother + father`,
      m,
      { mother: 1, father: 1 },
      { mother: 40000, father: 80000 },
    );
    run(
      `S6 [${m}]: Wife + son`,
      m,
      { wife: 1, son: 1 },
      { wife: 15000, son: 105000 },
    );
    run(
      `S7 [${m}]: Husband + daughter`,
      m,
      { husband: 1, daughter: 1 },
      { husband: 30000, daughter: isRadd ? 90000 : 60000 },
    );
    run(
      `S8 [${m}]: Wife + husband + son`,
      m,
      { wife: 1, husband: 1, son: 1 },
      { wife: 15000, husband: 30000, son: 75000 },
    );
    run(
      `S4 [${m}]: Daughter only`,
      m,
      { daughter: 1 },
      { daughter: isRadd ? 120000 : 60000 },
    );
    run(
      `S10 [${m}]: Wife + mother + father + son`,
      m,
      { wife: 1, mother: 1, father: 1, son: 1 },
      { wife: 15000, mother: 20000, father: 20000, son: 65000 },
    );
  }

  // ── MODERATE ──
  run(
    "M1: Husband + 2 daughters + mother (AWL)",
    "shafii",
    { husband: 1, daughter: 2, mother: 1 },
    { husband: 27692, daughter: 73846, mother: 18462 },
    100,
  );
  run(
    "M2: Wife + mother + 2 brothers",
    "shafii",
    { wife: 1, mother: 1, full_brother: 2 },
    { wife: 30000, mother: 20000, full_brother: 70000 },
  );
  run(
    "M3: Husband + mother + brother + sister",
    "shafii",
    { husband: 1, mother: 1, full_brother: 1, full_sister: 1 },
    { husband: 60000, mother: 20000, full_brother: 26667, full_sister: 13333 },
    100,
  );
  run(
    "M4: Wife + father + mother (Umariyyah)",
    "shafii",
    { wife: 1, father: 1, mother: 1 },
    { wife: 30000, mother: 30000, father: 60000 },
  );
  run(
    "M5: 4 wives + son",
    "shafii",
    { wife: 4, son: 1 },
    { wife: 15000, son: 105000 },
  );
  run(
    "M6: Husband + mother + 2 maternal siblings (AWL)",
    "shafii",
    { husband: 1, mother: 1, maternal_brother: 1, maternal_sister: 1 },
    { husband: 51429, mother: 34286 },
    100,
  );
  run(
    "M7: Wife + father + 2 brothers",
    "shafii",
    { wife: 1, father: 1, full_brother: 2 },
    { wife: 30000, father: 90000 },
  );
  run(
    "M8: Husband + 2 daughters + mother + father (AWL)",
    "shafii",
    { husband: 1, daughter: 2, mother: 1, father: 1 },
    { husband: 24000, mother: 16000, father: 16000, daughter: 64000 },
    100,
  );
  run(
    "M9: Wife + grandfather + brother + sister [maliki]",
    "maliki",
    { wife: 1, grandfather: 1, full_brother: 1, full_sister: 1 },
    {
      wife: 30000,
      grandfather: 40000,
      full_brother: 33333,
      full_sister: 16667,
    },
    100,
  );
  run(
    "M10: Wife + 3 daughters + mother (Shafii - no radd)",
    "shafii",
    { wife: 1, daughter: 3, mother: 1 },
    { wife: 15000, mother: 20000, daughter: 80000 },
  );

  // ── COMPLEX ──
  run(
    "C1 [shafii]: Umariyyah",
    "shafii",
    { wife: 1, mother: 1, father: 1 },
    { wife: 30000, mother: 30000, father: 60000 },
  );
  run(
    "C1 [maliki]: Umariyyah",
    "maliki",
    { wife: 1, mother: 1, father: 1 },
    { wife: 30000, mother: 20000, father: 70000 },
  );
  run("C2 [hanafi]: Wife radd", "hanafi", { wife: 1 }, { wife: 120000 });
  run("C2 [shafii]: Wife no radd", "shafii", { wife: 1 }, { wife: 30000 });
  run(
    "C3 [hanafi]: Husband radd",
    "hanafi",
    { husband: 1 },
    { husband: 120000 },
  );
  run(
    "C3 [shafii]: Husband no radd",
    "shafii",
    { husband: 1 },
    { husband: 60000 },
  );
  run(
    "C4a [shafii]: Mother + 1 brother",
    "shafii",
    { mother: 1, full_brother: 1 },
    { mother: 40000, full_brother: 80000 },
  );
  run(
    "C4b [shafii]: Mother + 2 brothers",
    "shafii",
    { mother: 1, full_brother: 2 },
    { mother: 20000, full_brother: 100000 },
  );
  run(
    "C5a [shafii]: 2 daughters no radd",
    "shafii",
    { daughter: 2 },
    { daughter: 80000 },
  );
  run(
    "C5b [shafii]: 3 daughters no radd",
    "shafii",
    { daughter: 3 },
    { daughter: 80000 },
  );
  run(
    "C6 [shafii]: Grandfather musharak (shares with brother)",
    "shafii",
    { grandfather: 1, full_brother: 1 },
    { grandfather: 60000 },
    100,
  );
  run(
    "C6 [maliki]: Grandfather musharak",
    "maliki",
    { grandfather: 1, full_brother: 1 },
    { grandfather: 60000 },
    100,
  );
  run(
    "C7: Awl complex",
    "shafii",
    { wife: 1, husband: 1, mother: 1, daughter: 2 },
    {},
    200,
  );
  run(
    "C8: Father blocks brother",
    "shafii",
    { husband: 1, father: 1, full_brother: 1 },
    { husband: 60000, father: 60000 },
  );
  run(
    "C9: Awl 2 wives + family",
    "shafii",
    { wife: 2, mother: 1, father: 1, daughter: 2 },
    {},
    200,
  );
  run(
    "C10 [maliki]: Grandfather + 3 brothers",
    "maliki",
    { grandfather: 1, full_brother: 3 },
    { grandfather: 40000, full_brother: 80000 },
  );

  // ── SPECIAL ──
  run(
    "SP1 [shafii]: Musharraka",
    "shafii",
    { husband: 1, mother: 1, maternal_brother: 2, full_sister: 1 },
    { husband: 60000, mother: 20000 },
  );
  run(
    "SP2 [shafii]: Akdariyya",
    "shafii",
    { husband: 1, mother: 1, grandfather: 1, full_sister: 1 },
    { husband: 40000, mother: 26667, grandfather: 35556, full_sister: 17778 },
    100,
  );
  run(
    "SP3: Dhawu al-Arham (daughter_son)",
    "shafii",
    { wife: 1, daughter_son: 1 },
    { wife: 30000, daughter_son: 90000 },
  );
  run(
    "SP4: Dhawu al-Arham (maternal_uncle)",
    "shafii",
    { wife: 1, maternal_uncle: 1 },
    { wife: 30000, maternal_uncle: 90000 },
  );
  run(
    "SP5: Dhawu al-Arham (full_nephew)",
    "shafii",
    { wife: 1, full_nephew: 1 },
    { wife: 30000, full_nephew: 90000 },
  );
  run(
    "SP6: Dhawu al-Arham (daughter_daughter)",
    "shafii",
    { wife: 1, daughter_daughter: 1 },
    { wife: 30000, daughter_daughter: 90000 },
  );
  run(
    "SP7: Grandmother priority (Shafii - no radd, both share equally)",
    "shafii",
    { wife: 1, grandmother_father: 1, grandmother_mother: 1 },
    { wife: 30000, grandmother_father: 10000, grandmother_mother: 10000 },
  );
  run(
    "SP8: Grandmother (Shafii - no radd)",
    "shafii",
    { wife: 1, grandmother: 1 },
    { wife: 30000, grandmother: 20000 },
  );
  run(
    "SP9 [hanafi]: Husband radd",
    "hanafi",
    { husband: 1 },
    { husband: 120000 },
  );
  run(
    "SP9 [shafii]: Husband no radd",
    "shafii",
    { husband: 1 },
    { husband: 60000 },
  );
  run(
    "SP10 [maliki]: Musharak",
    "maliki",
    { husband: 1, grandfather: 1, full_brother: 3 },
    { husband: 60000, grandfather: 40000, full_brother: 20000 },
  );

  // ── FIQH VALIDATION: Radd madhab differences ──
  run(
    "FQ1 [hanafi]: Daughter alone — radd fills",
    "hanafi",
    { daughter: 1 },
    { daughter: 120000 },
  );
  run(
    "FQ1 [shafii]: Daughter alone — no radd",
    "shafii",
    { daughter: 1 },
    { daughter: 60000 },
  );
  run(
    "FQ2 [hanafi]: Husband alone — radd fills",
    "hanafi",
    { husband: 1 },
    { husband: 120000 },
  );
  run(
    "FQ2 [shafii]: Husband alone — no radd",
    "shafii",
    { husband: 1 },
    { husband: 60000 },
  );
  run(
    "FQ3 [hanafi]: Wife + daughter — radd to daughter",
    "hanafi",
    { wife: 1, daughter: 1 },
    { wife: 15000, daughter: 105000 },
  );
  run(
    "FQ3 [shafii]: Wife + daughter — no radd",
    "shafii",
    { wife: 1, daughter: 1 },
    { wife: 15000, daughter: 60000 },
  );
  run(
    "FQ4 [hanafi]: Daughter + mother — radd to both",
    "hanafi",
    { daughter: 1, mother: 1 },
    { mother: 30000, daughter: 90000 },
    100,
  );
  run(
    "FQ4 [shafii]: Daughter + mother — no radd",
    "shafii",
    { daughter: 1, mother: 1 },
    { mother: 20000, daughter: 60000 },
  );
  run(
    "FQ5 [hanbali]: Wife alone — radd fills",
    "hanbali",
    { wife: 1 },
    { wife: 120000 },
  );
  run(
    "FQ5 [maliki]: Wife alone — no radd",
    "maliki",
    { wife: 1 },
    { wife: 30000 },
  );

  // ── FIQH VALIDATION: Grandfather musharak vs hijab ──
  run(
    "FQ6 [hanafi]: Grandfather + brother — hijab",
    "hanafi",
    { grandfather: 1, full_brother: 1 },
    { grandfather: 120000 },
  );
  run(
    "FQ6 [shafii]: Grandfather + brother — musharak",
    "shafii",
    { grandfather: 1, full_brother: 1 },
    { grandfather: 60000 },
    100,
  );
  run(
    "FQ6 [maliki]: Grandfather + brother — musharak",
    "maliki",
    { grandfather: 1, full_brother: 1 },
    { grandfather: 60000 },
    100,
  );
  run(
    "FQ6 [hanbali]: Grandfather + brother — musharak",
    "hanbali",
    { grandfather: 1, full_brother: 1 },
    { grandfather: 60000 },
    100,
  );
  run(
    "FQ7 [hanafi]: Grandfather + sister — hijab",
    "hanafi",
    { grandfather: 1, full_sister: 1 },
    { grandfather: 120000 },
  );
  run(
    "FQ7 [maliki]: Grandfather + sister — musharak",
    "maliki",
    { grandfather: 1, full_sister: 1 },
    { grandfather: 80000, full_sister: 40000 },
    100,
  );

  // ── FIQH VALIDATION: Blood relatives ──
  run(
    "FQ8: Wife + daughter_son — blood relative",
    "shafii",
    { wife: 1, daughter_son: 1 },
    { wife: 30000, daughter_son: 90000 },
  );
  run(
    "FQ9: Wife + maternal_uncle — radd fills wife (Hanafi)",
    "hanafi",
    { wife: 1, maternal_uncle: 1 },
    { wife: 120000 },
  );
  run(
    "FQ10: Wife + full_nephew — blood relative",
    "shafii",
    { wife: 1, full_nephew: 1 },
    { wife: 30000, full_nephew: 90000 },
  );
  run(
    "FQ11: Blood relative blocked by asaba",
    "shafii",
    { son: 1, daughter_son: 1 },
    { son: 120000 },
  );
  run(
    "FQ12: Blood relative blocked by class 1",
    "shafii",
    { daughter_son: 1, maternal_uncle: 1 },
    { daughter_son: 120000 },
  );

  // ── FIQH VALIDATION: Grandmother rules ──
  run(
    "FQ13: Mother blocks grandmother",
    "shafii",
    { mother: 1, grandmother: 1 },
    { mother: 40000 },
  );
  run(
    "FQ14: Grandmother gets 1/6 when no mother",
    "shafii",
    { grandmother: 1 },
    { grandmother: 20000 },
  );

  // ── FIQH VALIDATION: Complex real-world ──
  run(
    "FQ15: Wife + son + daughter + father + mother",
    "shafii",
    { wife: 1, son: 1, daughter: 1, father: 1, mother: 1 },
    { wife: 15000, mother: 20000, father: 20000, son: 43333, daughter: 21667 },
    200,
  );
  run(
    "FQ16: Husband + mother + brother + sister (Awl)",
    "shafii",
    { husband: 1, mother: 1, full_brother: 1, full_sister: 1 },
    { husband: 60000, mother: 20000, full_brother: 26667, full_sister: 13333 },
    100,
  );
  run(
    "FQ17: Husband + 2 daughters + mother (Awl)",
    "shafii",
    { husband: 1, daughter: 2, mother: 1 },
    { husband: 27692, daughter: 73846, mother: 18462 },
    100,
  );
  run(
    "FQ18: Grandson as asaba with daughters (Maliki)",
    "maliki",
    { daughter: 2, grandson: 1 },
    { daughter: 80000, grandson: 40000 },
    100,
  );

  // ── FIQH VALIDATION: Cross-madhab ──
  run(
    "FQ19: Husband + mother + maternal brother + full brother",
    "shafii",
    { husband: 1, mother: 1, maternal_brother: 2, full_brother: 1 },
    { husband: 60000, mother: 20000 },
  );
  run(
    "FQ20: Wife + father + mother (Hanafi Umariyyah)",
    "hanafi",
    { wife: 1, father: 1, mother: 1 },
    { wife: 30000, mother: 30000, father: 60000 },
  );
  run(
    "FQ21: Wife + father + mother (Maliki Umariyyah)",
    "maliki",
    { wife: 1, father: 1, mother: 1 },
    { wife: 30000, mother: 20000, father: 70000 },
  );
  run(
    "FQ22: Husband + mother + maternal brother (Hanafi radd to spouse)",
    "hanafi",
    { husband: 1, mother: 1, maternal_brother: 1 },
    { husband: 60000, mother: 40000, maternal_siblings: 20000 },
    100,
  );
});
