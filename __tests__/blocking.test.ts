import { describe, it, expect } from "vitest";
import { getBlockedHeirs } from "../lib/inheritance/hijab-system";

describe("getBlockedHeirs", () => {
  it("returns empty when no heirs selected", () => {
    expect(Object.keys(getBlockedHeirs("shafii", {}))).toHaveLength(0);
  });

  it("son blocks full brothers in Shafii", () => {
    const b = getBlockedHeirs("shafii", { son: 1 });
    expect(b["full_brother"]).toBeDefined();
    expect(b["full_brother"]!.blocker).toBe("son");
    expect(b["full_sister"]).toBeDefined();
  });

  it("father blocks grandfather", () => {
    const b = getBlockedHeirs("shafii", { father: 1 });
    expect(b["grandfather"]).toBeDefined();
    expect(b["grandfather"]!.blocker).toBe("father");
  });

  it("grandfather shares with siblings in Shafii (musharak, not hijab)", () => {
    const b = getBlockedHeirs("shafii", { grandfather: 1 });
    expect(b["full_brother"]).toBeUndefined();
  });

  it("grandfather does NOT block siblings in Hanbali", () => {
    const b = getBlockedHeirs("hanbali", { grandfather: 1 });
    expect(b["full_brother"]).toBeUndefined();
  });

  it("grandfather does NOT block siblings in Maliki", () => {
    const b = getBlockedHeirs("maliki", { grandfather: 1 });
    expect(b["full_brother"]).toBeUndefined();
  });

  it("2 daughters block granddaughters", () => {
    const b = getBlockedHeirs("shafii", { daughter: 2 });
    expect(b["granddaughter"]).toBeDefined();
  });

  it("2 daughters + grandson do NOT block granddaughters", () => {
    const b = getBlockedHeirs("shafii", { daughter: 2, grandson: 1 });
    expect(b["granddaughter"]).toBeUndefined();
  });

  it("mother blocks grandmother", () => {
    const b = getBlockedHeirs("shafii", { mother: 1 });
    expect(b["grandmother"]).toBeDefined();
    expect(b["grandmother"]!.blocker).toBe("mother");
  });

  it("no son → brothers NOT blocked", () => {
    const b = getBlockedHeirs("hanafi", { full_brother: 1 });
    expect(b["full_brother"]).toBeUndefined();
  });

  // ===== NEW TESTS: Expanded blocking rules =====

  describe("Son blocks extended family", () => {
    it("son blocks maternal brother (all madhabs)", () => {
      for (const madhab of ["shafii", "hanafi", "maliki", "hanbali"] as const) {
        const b = getBlockedHeirs(madhab, { son: 1 });
        expect(b["maternal_brother"]).toBeDefined();
        expect(b["maternal_brother"]!.blocker).toBe("son");
      }
    });

    it("son blocks maternal sister (all madhabs)", () => {
      for (const madhab of ["shafii", "hanafi", "maliki", "hanbali"] as const) {
        const b = getBlockedHeirs(madhab, { son: 1 });
        expect(b["maternal_sister"]).toBeDefined();
        expect(b["maternal_sister"]!.blocker).toBe("son");
      }
    });

    it("son blocks full uncle (all madhabs)", () => {
      for (const madhab of ["shafii", "hanafi", "maliki", "hanbali"] as const) {
        const b = getBlockedHeirs(madhab, { son: 1 });
        expect(b["full_uncle"]).toBeDefined();
        expect(b["full_uncle"]!.blocker).toBe("son");
      }
    });

    it("son blocks paternal uncle (all madhabs)", () => {
      for (const madhab of ["shafii", "hanafi", "maliki", "hanbali"] as const) {
        const b = getBlockedHeirs(madhab, { son: 1 });
        expect(b["paternal_uncle"]).toBeDefined();
        expect(b["paternal_uncle"]!.blocker).toBe("son");
      }
    });

    it("son blocks paternal aunt (all madhabs)", () => {
      for (const madhab of ["shafii", "hanafi", "maliki", "hanbali"] as const) {
        const b = getBlockedHeirs(madhab, { son: 1 });
        expect(b["paternal_aunt"]).toBeDefined();
        expect(b["paternal_aunt"]!.blocker).toBe("son");
      }
    });

    it("son blocks full nephew (all madhabs)", () => {
      for (const madhab of ["shafii", "hanafi", "maliki", "hanbali"] as const) {
        const b = getBlockedHeirs(madhab, { son: 1 });
        expect(b["full_nephew"]).toBeDefined();
        expect(b["full_nephew"]!.blocker).toBe("son");
      }
    });

    it("son blocks paternal nephew (all madhabs)", () => {
      for (const madhab of ["shafii", "hanafi", "maliki", "hanbali"] as const) {
        const b = getBlockedHeirs(madhab, { son: 1 });
        expect(b["paternal_nephew"]).toBeDefined();
        expect(b["paternal_nephew"]!.blocker).toBe("son");
      }
    });
  });

  describe("Grandson blocks siblings", () => {
    it("grandson blocks full brother when no son", () => {
      const b = getBlockedHeirs("shafii", { grandson: 1 });
      expect(b["full_brother"]).toBeDefined();
      expect(b["full_brother"]!.blocker).toBe("grandson");
    });

    it("grandson blocks full sister when no son", () => {
      const b = getBlockedHeirs("shafii", { grandson: 1 });
      expect(b["full_sister"]).toBeDefined();
      expect(b["full_sister"]!.blocker).toBe("grandson");
    });

    it("grandson does NOT block siblings when son exists", () => {
      const b = getBlockedHeirs("shafii", { son: 1, grandson: 1 });
      // Son already blocks siblings, but grandson doesn't add extra blocking
      expect(b["full_brother"]).toBeDefined();
      expect(b["full_brother"]!.blocker).toBe("son");
    });
  });

  describe("Full brother blocks paternal siblings", () => {
    it("full brother blocks paternal brother (all madhabs)", () => {
      for (const madhab of ["shafii", "hanafi", "maliki", "hanbali"] as const) {
        const b = getBlockedHeirs(madhab, { full_brother: 1 });
        expect(b["paternal_brother"]).toBeDefined();
        expect(b["paternal_brother"]!.blocker).toBe("full_brother");
      }
    });

    it("full brother blocks paternal sister (all madhabs)", () => {
      for (const madhab of ["shafii", "hanafi", "maliki", "hanbali"] as const) {
        const b = getBlockedHeirs(madhab, { full_brother: 1 });
        expect(b["paternal_sister"]).toBeDefined();
        expect(b["paternal_sister"]!.blocker).toBe("full_brother");
      }
    });
  });

  describe("Daughter blocks maternal sister", () => {
    it("daughter blocks maternal sister (all madhabs)", () => {
      for (const madhab of ["shafii", "hanafi", "maliki", "hanbali"] as const) {
        const b = getBlockedHeirs(madhab, { daughter: 1 });
        expect(b["maternal_sister"]).toBeDefined();
        expect(b["maternal_sister"]!.blocker).toBe("daughter");
      }
    });
  });

  describe("Granddaughters block paternal aunt", () => {
    it("2+ granddaughters block paternal aunt (all madhabs)", () => {
      for (const madhab of ["shafii", "hanafi", "maliki", "hanbali"] as const) {
        const b = getBlockedHeirs(madhab, { granddaughter: 2 });
        expect(b["paternal_aunt"]).toBeDefined();
        expect(b["paternal_aunt"]!.blocker).toBe("granddaughter");
      }
    });

    it("1 granddaughter does NOT block paternal aunt", () => {
      const b = getBlockedHeirs("shafii", { granddaughter: 1 });
      expect(b["paternal_aunt"]).toBeUndefined();
    });
  });

  describe("Grandmother priority", () => {
    it("Shafii: both grandmothers share equally (no blocking)", () => {
      const b = getBlockedHeirs("shafii", {
        grandmother_mother: 1,
        grandmother_father: 1,
      });
      expect(b["grandmother_mother"]).toBeUndefined();
      expect(b["grandmother_father"]).toBeUndefined();
    });

    it("Hanafi: both grandmothers share equally (no blocking)", () => {
      const b = getBlockedHeirs("hanafi", {
        grandmother_mother: 1,
        grandmother_father: 1,
      });
      expect(b["grandmother_mother"]).toBeUndefined();
      expect(b["grandmother_father"]).toBeUndefined();
    });

    it("Maliki: both grandmothers share equally (no blocking)", () => {
      const b = getBlockedHeirs("maliki", {
        grandmother_mother: 1,
        grandmother_father: 1,
      });
      expect(b["grandmother_mother"]).toBeUndefined();
      expect(b["grandmother_father"]).toBeUndefined();
    });

    it("Hanbali: both grandmothers share equally (no blocking)", () => {
      const b = getBlockedHeirs("hanbali", {
        grandmother_mother: 1,
        grandmother_father: 1,
      });
      expect(b["grandmother_mother"]).toBeUndefined();
      expect(b["grandmother_father"]).toBeUndefined();
    });
  });

  describe("Complex scenarios", () => {
    it("son blocks all extended family at once", () => {
      const b = getBlockedHeirs("shafii", { son: 1 });
      expect(b["full_brother"]).toBeDefined();
      expect(b["full_sister"]).toBeDefined();
      expect(b["paternal_brother"]).toBeDefined();
      expect(b["paternal_sister"]).toBeDefined();
      expect(b["maternal_brother"]).toBeDefined();
      expect(b["maternal_sister"]).toBeDefined();
      expect(b["full_uncle"]).toBeDefined();
      expect(b["paternal_uncle"]).toBeDefined();
      expect(b["paternal_aunt"]).toBeDefined();
      expect(b["full_nephew"]).toBeDefined();
      expect(b["paternal_nephew"]).toBeDefined();
    });

    it("multiple blockers don't overwrite existing blocking", () => {
      const b = getBlockedHeirs("shafii", {
        son: 1,
        daughter: 1,
        granddaughter: 2,
      });
      // maternal_sister blocked by both son and daughter
      expect(b["maternal_sister"]).toBeDefined();
      expect(b["maternal_sister"]!.blocker).toBe("son");
      // paternal_aunt blocked by both son and granddaughter
      expect(b["paternal_aunt"]).toBeDefined();
      expect(b["paternal_aunt"]!.blocker).toBe("son");
    });

    it("grandfather + siblings blocking in Hanafi", () => {
      const b = getBlockedHeirs("hanafi", {
        grandfather: 1,
        full_brother: 1,
      });
      expect(b["full_brother"]).toBeDefined();
      expect(b["full_brother"]!.blocker).toBe("grandfather");
    });

    it("Hanafi: grandfather does NOT block siblings in other madhabs", () => {
      for (const madhab of ["shafii", "maliki", "hanbali"] as const) {
        const b = getBlockedHeirs(madhab, {
          grandfather: 1,
          full_brother: 1,
        });
        expect(b["full_brother"]).toBeUndefined();
      }
    });
  });
});
