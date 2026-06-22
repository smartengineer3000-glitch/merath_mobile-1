import { describe, expect, it } from "vitest";
import {
  normalizeEstateInput,
  normalizeHeirsInput,
  validateEngineInput,
} from "../lib/inheritance/engine-input";

describe("engine input helpers", () => {
  it("normalizes estate aliases and prevents negative values", () => {
    const estate = normalizeEstateInput({
      total: -100,
      funeralCosts: 20,
      debts: -5,
      willAmount: 30,
    });

    expect(estate).toEqual({ total: 0, funeral: 20, debts: 0, will: 30 });
  });

  it("clamps singleton and spouse heir counts", () => {
    const heirs = normalizeHeirsInput({
      husband: 2,
      wife: 9,
      father: 3,
      mother: 2,
      son: 4,
    });

    expect(heirs.husband).toBe(1);
    expect(heirs.wife).toBe(4);
    expect(heirs.father).toBe(1);
    expect(heirs.mother).toBe(1);
    expect(heirs.son).toBe(4);
  });

  it("validates the minimum calculation requirements", () => {
    expect(
      validateEngineInput(
        { total: 0, funeral: 0, debts: 0, will: 0 },
        { son: 1 },
      ),
    ).toMatchObject({
      valid: false,
    });
    expect(
      validateEngineInput({ total: 1000, funeral: 0, debts: 0, will: 0 }, {}),
    ).toMatchObject({
      valid: false,
    });
    expect(
      validateEngineInput(
        { total: 1000, funeral: 0, debts: 0, will: 0 },
        { daughter: 1 },
      ),
    ).toEqual({
      valid: true,
    });
  });
});
