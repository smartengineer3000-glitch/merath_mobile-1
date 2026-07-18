import { describe, it, expect } from "vitest";
import en from "../lib/i18n/locales/en.json";
import ar from "../lib/i18n/locales/ar.json";
import ur from "../lib/i18n/locales/ur.json";
import tr from "../lib/i18n/locales/tr.json";
import fr from "../lib/i18n/locales/fr.json";
import de from "../lib/i18n/locales/de.json";

const locales = { en, ar, ur, tr, fr, de };

function flattenKeys(obj: Record<string, any>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      keys.push(...flattenKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

describe("i18n locale key parity", () => {
  const enKeys = flattenKeys(en).sort();

  it("English has translation keys", () => {
    expect(enKeys.length).toBeGreaterThan(100);
  });

  for (const [lang, localeData] of Object.entries(locales)) {
    if (lang === "en") continue;

    it(`${lang} has the same keys as English`, () => {
      const langKeys = flattenKeys(localeData).sort();
      const missingInLang = enKeys.filter((k) => !langKeys.includes(k));
      const extraInLang = langKeys.filter((k) => !enKeys.includes(k));

      expect(missingInLang).toEqual([]);
      expect(extraInLang).toEqual([]);
    });
  }
});

describe("i18n locale content quality", () => {
  it("all string values are non-empty", () => {
    for (const [lang, localeData] of Object.entries(locales)) {
      const keys = flattenKeys(localeData);
      for (const key of keys) {
        const parts = key.split(".");
        let value: any = localeData;
        for (const part of parts) {
          value = value?.[part];
        }
        if (typeof value === "string") {
          expect(
            value.length > 0,
            `${lang}.${key} should be a non-empty string`,
          ).toBe(true);
        }
      }
    }
  });

  it("all locales have the same top-level sections", () => {
    const enSections = Object.keys(en).sort();
    for (const [lang, localeData] of Object.entries(locales)) {
      const langSections = Object.keys(localeData).sort();
      expect(langSections).toEqual(enSections);
    }
  });

  it("all locales have navigation section with same keys", () => {
    const enNavKeys = Object.keys(en.navigation).sort();
    for (const [lang, localeData] of Object.entries(locales)) {
      const navKeys = Object.keys(
        (localeData as any).navigation,
      ).sort();
      expect(navKeys).toEqual(enNavKeys);
    }
  });

  it("all locales have results section with same keys", () => {
    const enResultsKeys = Object.keys(en.results).sort();
    for (const [lang, localeData] of Object.entries(locales)) {
      const resultsKeys = Object.keys(
        (localeData as any).results,
      ).sort();
      expect(resultsKeys).toEqual(enResultsKeys);
    }
  });

  it("all madhab names are unique per locale", () => {
    for (const [lang, localeData] of Object.entries(locales)) {
      const madhabObj = (localeData as any).madhab;
      const names = [madhabObj.hanafi, madhabObj.maliki, madhabObj.shafii, madhabObj.hanbali];
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(4);
    }
  });
});

describe("i18n supported languages", () => {
  it("supports exactly 6 languages", () => {
    expect(Object.keys(locales).length).toBe(6);
  });

  it("has en, ar, ur, tr, fr, de", () => {
    expect(Object.keys(locales).sort()).toEqual([
      "ar",
      "de",
      "en",
      "fr",
      "tr",
      "ur",
    ]);
  });

  it("English is the fallback language (has the most keys)", () => {
    const enKeyCount = flattenKeys(en).length;
    for (const [lang, localeData] of Object.entries(locales)) {
      if (lang === "en") continue;
      expect(flattenKeys(localeData).length).toBe(enKeyCount);
    }
  });
});
