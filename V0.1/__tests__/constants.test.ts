import { describe, it, expect } from "vitest";
import {
  HEIRS,
  HEIR_GROUPS,
  getHeirByType,
  getHeirsByGroup,
} from "../constants/heirData";

describe("HEIRS array", () => {
  it("contains 19 heir configurations", () => {
    expect(HEIRS.length).toBe(19);
  });

  it("each heir has a unique key", () => {
    const keys = HEIRS.map((h) => h.key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it("each heir has required fields", () => {
    for (const heir of HEIRS) {
      expect(heir.key).toBeTruthy();
      expect(heir.icon).toBeTruthy();
      expect(heir.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(["male", "female"]).toContain(heir.gender);
      expect(HEIR_GROUPS[heir.group]).toBeTruthy();
      expect(heir.labelKey).toMatch(/^heirs\./);
    }
  });

  it("covers all 5 groups", () => {
    const groups = new Set(HEIRS.map((h) => h.group));
    expect(groups).toEqual(
      new Set(["spouses", "descendants", "ascendants", "siblings", "extended"]),
    );
  });

  it("has both spouses (husband and wife)", () => {
    const spouses = getHeirsByGroup("spouses");
    expect(spouses.length).toBe(2);
    const keys = spouses.map((s) => s.key);
    expect(keys).toContain("husband");
    expect(keys).toContain("wife");
  });

  it("has 4 descendants", () => {
    const descendants = getHeirsByGroup("descendants");
    expect(descendants.length).toBe(4);
  });

  it("has 4 ascendants", () => {
    const ascendants = getHeirsByGroup("ascendants");
    expect(ascendants.length).toBe(4);
  });

  it("has 6 siblings", () => {
    const siblings = getHeirsByGroup("siblings");
    expect(siblings.length).toBe(6);
  });

  it("has 3 extended family members", () => {
    const extended = getHeirsByGroup("extended");
    expect(extended.length).toBe(3);
  });
});

describe("HEIR_GROUPS", () => {
  it("has 5 groups", () => {
    expect(Object.keys(HEIR_GROUPS).length).toBe(5);
  });

  it("each group has icon and labelKey", () => {
    for (const [group, config] of Object.entries(HEIR_GROUPS)) {
      expect(config.icon, `${group} should have icon`).toBeTruthy();
      expect(config.labelKey, `${group} should have labelKey`).toMatch(
        /^heirs\.group\./,
      );
    }
  });
});

describe("getHeirByType", () => {
  it("returns husband config for 'husband'", () => {
    const husband = getHeirByType("husband");
    expect(husband).toBeDefined();
    expect(husband?.key).toBe("husband");
    expect(husband?.group).toBe("spouses");
    expect(husband?.gender).toBe("male");
  });

  it("returns daughter config for 'daughter'", () => {
    const daughter = getHeirByType("daughter");
    expect(daughter).toBeDefined();
    expect(daughter?.gender).toBe("female");
    expect(daughter?.group).toBe("descendants");
  });

  it("returns undefined for unknown key", () => {
    const unknown = getHeirByType("nonexistent_heir");
    expect(unknown).toBeUndefined();
  });

  it("returns correct heir for each group", () => {
    expect(getHeirByType("father")?.group).toBe("ascendants");
    expect(getHeirByType("full_brother")?.group).toBe("siblings");
    expect(getHeirByType("full_nephew")?.group).toBe("extended");
  });
});

describe("getHeirsByGroup", () => {
  it("returns empty array for unknown group", () => {
    const result = getHeirsByGroup("unknown" as any);
    expect(result).toEqual([]);
  });

  it("returns correct count for each group", () => {
    expect(getHeirsByGroup("spouses").length).toBe(2);
    expect(getHeirsByGroup("descendants").length).toBe(4);
    expect(getHeirsByGroup("ascendants").length).toBe(4);
    expect(getHeirsByGroup("siblings").length).toBe(6);
    expect(getHeirsByGroup("extended").length).toBe(3);
  });
});
