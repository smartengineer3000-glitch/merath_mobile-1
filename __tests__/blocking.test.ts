import { describe, it, expect } from "vitest";
import { getBlockedHeirs } from "../lib/inheritance/hijab-system";

describe("getBlockedHeirs", () => {
  it("returns empty when no heirs selected", () => {
    expect(Object.keys(getBlockedHeirs("shafii", {}))).toHaveLength(0);
  });

  it("son blocks brothers in Shafii", () => {
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

  it("grandfather blocks siblings in Shafii", () => {
    const b = getBlockedHeirs("shafii", { grandfather: 1 });
    expect(b["full_brother"]).toBeDefined();
    expect(b["full_brother"]!.blocker).toBe("grandfather");
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
});
