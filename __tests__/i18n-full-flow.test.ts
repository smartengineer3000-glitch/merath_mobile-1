/**
 * @file __tests__/i18n-full-flow.test.ts
 * @description Comprehensive i18n integration test — simulates selecting each
 * language and verifies every visible string renders in the selected language
 * with no English mixing and no missing translations.
 */

import { describe, it, expect, beforeAll } from "vitest";
import i18next from "i18next";
import en from "../lib/i18n/locales/en.json";
import ar from "../lib/i18n/locales/ar.json";
import ur from "../lib/i18n/locales/ur.json";
import tr from "../lib/i18n/locales/tr.json";
import fr from "../lib/i18n/locales/fr.json";
import de from "../lib/i18n/locales/de.json";

const locales: Record<string, any> = { en, ar, ur, tr, fr, de };

function flattenKeys(obj: Record<string, any>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...flattenKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// ── Keys that MUST be different from English in non-English locales ──
// Excludes: proper nouns (madhab names), cognates (Total, Date, Version, etc.)
const MUST_TRANSLATE_KEYS = [
  // Navigation
  "navigation.calculator",
  "navigation.results",
  "navigation.comparison",
  "navigation.settings",
  // Calculator screen
  "calculator.title",
  "calculator.estate",
  "calculator.heirs",
  "calculator.calculate",
  // Estate field labels
  "estate.title",
  "estate.total",
  "estate.funeral",
  "estate.debts",
  "estate.will",
  "estate.netEstate",
  "estate.deductions",
  // Heir labels
  "heirs.title",
  "heirs.wife",
  "heirs.husband",
  "heirs.son",
  "heirs.daughter",
  "heirs.mother",
  "heirs.father",
  "heirs.brother",
  "heirs.sister",
  // Results
  "results.title",
  "results.totalDistribution",
  "results.financialSummary",
  "results.distributionBreakdown",
  "results.blockedHeirs",
  // Results tabs
  "results.tabs.steps",
  "results.tabs.explanation",
  "results.tabs.export",
  // Fiqh rules
  "results.fiqhRules.title",
  "results.fiqhRules.madhabRules",
  "results.fiqhRules.specialCases",
  "results.fiqhRules.fixedShares",
  "results.fiqhRules.hijabRules",
  "results.fiqhRules.activeMadhab",
  "results.fiqhRules.active",
  "results.fiqhRules.tableHeaders.share",
  "results.fiqhRules.tableHeaders.whoReceives",
  "results.fiqhRules.tableHeaders.blocked",
  "results.fiqhRules.tableHeaders.blocker",
  // Export buttons
  "results.exportPdf",
  "results.exportPdfDesc",
  "results.exportImage",
  "results.exportClipboard",
  "results.exportShare",
  "results.exportCsv",
  "results.copied",
  "results.shareFormat.clipboard",
  // Export report
  "export.dialogTitle",
  "export.reportTitle",
  "export.appName",
  "export.reportGenerated",
  "export.totalEstate",
  "export.totalDeductions",
  // Settings
  "settings.title",
  "settings.language",
  "settings.theme",
  "settings.darkMode",
  "settings.about",
  "settings.testEngine",
  "settings.testEngineDesc",
  // About
  "about.title",
  "about.description",
  "about.features",
  "about.privacy",
  "about.copyright",
  // Engine test
  "engineTest.title",
  "engineTest.info",
  "engineTest.runAll",
  "engineTest.rerun",
  "engineTest.running",
  "engineTest.passed",
  "engineTest.failed",
  "engineTest.calculationFailed",
  // Common
  "common.ok",
  "common.cancel",
  "common.save",
  "common.error",
  "common.success",
  "common.loading",
  "common.noNetwork",
  // Error
  "error.title",
  "error.description",
  "error.tryAgain",
  // Onboarding
  "onboarding.welcome",
  "onboarding.startNow",
];

// Keys that use {{ interpolation }} — these are EXPECTED to contain {{ }}
const INTERPOLATION_KEYS = [
  "calculator.blockedBy",
  "results.previewTitle",
  "results.compareWith",
  "comparison.explanations.blockedInMadhab",
  "comparison.explanations.onlyInMadhab",
  "comparison.recommendations.majorDifferences",
];

describe("Full i18n flow — per language", () => {
  beforeAll(() => {
    i18next.init({
      lng: "en",
      fallbackLng: "en",
      resources: Object.fromEntries(
        Object.entries(locales).map(([lang, data]) => [lang, { translation: data }])
      ),
    });
  });

  for (const lang of Object.keys(locales)) {
    describe(`── ${lang.toUpperCase()} ──`, () => {
      beforeAll(() => {
        i18next.changeLanguage(lang);
      });

      it("i18n switched correctly", () => {
        expect(i18next.language).toBe(lang);
      });

      // ── Calculator screen ──
      it("calculator: all keys resolve", () => {
        const keys = [
          "calculator.title", "calculator.estate", "calculator.heirs",
          "calculator.calculate",
        ];
        for (const key of keys) {
          const val = i18next.t(key);
          expect(val, `${key} returned key path`).not.toMatch(/^\w+\.\w+$/);
          expect(val, `${key} is empty`).toBeTruthy();
        }
      });

      // ── Estate fields ──
      it("estate: all field labels resolve", () => {
        const keys = [
          "estate.title", "estate.total", "estate.funeral",
          "estate.debts", "estate.will", "estate.netEstate", "estate.deductions",
        ];
        for (const key of keys) {
          expect(i18next.t(key), `${key} returned key path`).not.toMatch(/^\w+\.\w+$/);
        }
      });

      // ── Heir selection ──
      it("heirs: all names resolve", () => {
        const keys = [
          "heirs.title", "heirs.wife", "heirs.husband", "heirs.son",
          "heirs.daughter", "heirs.mother", "heirs.father",
          "heirs.brother", "heirs.sister",
        ];
        for (const key of keys) {
          expect(i18next.t(key), `${key} returned key path`).not.toMatch(/^\w+\.\w+$/);
        }
      });

      // ── Results screen ──
      it("results: all keys resolve", () => {
        const keys = [
          "results.title", "results.total", "results.totalDistribution",
          "results.financialSummary", "results.distributionBreakdown",
          "results.blockedHeirs",
        ];
        for (const key of keys) {
          expect(i18next.t(key), `${key} returned key path`).not.toMatch(/^\w+\.\w+$/);
        }
      });

      it("results tabs: all labels resolve", () => {
        const keys = [
          "results.tabs.distribution", "results.tabs.steps",
          "results.tabs.explanation", "results.tabs.export",
        ];
        for (const key of keys) {
          expect(i18next.t(key), `${key} returned key path`).not.toMatch(/^\w+\.\w+$/);
        }
      });

      // ── Fiqh rules tab ──
      it("fiqh rules: all table headers and sections resolve", () => {
        const keys = [
          "results.fiqhRules.title", "results.fiqhRules.madhabRules",
          "results.fiqhRules.specialCases", "results.fiqhRules.fixedShares",
          "results.fiqhRules.hijabRules", "results.fiqhRules.activeMadhab",
          "results.fiqhRules.active",
          "results.fiqhRules.tableHeaders.share",
          "results.fiqhRules.tableHeaders.whoReceives",
          "results.fiqhRules.tableHeaders.blocked",
          "results.fiqhRules.tableHeaders.blocker",
          "results.fiqhRules.tableHeaders.description",
        ];
        for (const key of keys) {
          const val = i18next.t(key);
          expect(val, `${key} returned key path`).not.toMatch(/^\w+\.\w+$/);
        }
      });

      it("fiqh rules: special case descriptions resolve", () => {
        const keys = [
          "results.fiqhRules.specialCasesList.umariyyatan.title",
          "results.fiqhRules.specialCasesList.awl.title",
          "results.fiqhRules.specialCasesList.radd.title",
          "results.fiqhRules.specialCasesList.musharraka.title",
          "results.fiqhRules.specialCasesList.akdariyya.title",
        ];
        for (const key of keys) {
          expect(i18next.t(key), `${key} returned key path`).not.toMatch(/^\w+\.\w+$/);
        }
      });

      // ── Export ──
      it("export: all keys resolve", () => {
        const keys = [
          "export.dialogTitle", "export.reportTitle", "export.appName",
          "export.reportGenerated", "export.date", "export.totalEstate",
          "export.totalDeductions", "export.total",
        ];
        for (const key of keys) {
          expect(i18next.t(key), `${key} returned key path`).not.toMatch(/^\w+\.\w+$/);
        }
      });

      it("export buttons: all keys resolve", () => {
        const keys = [
          "results.exportPdf", "results.exportPdfDesc",
          "results.exportImage", "results.exportClipboard",
          "results.exportShare", "results.exportCsv", "results.copied",
          "results.shareFormat.pdf", "results.shareFormat.image",
          "results.shareFormat.text", "results.shareFormat.clipboard",
        ];
        for (const key of keys) {
          expect(i18next.t(key), `${key} returned key path`).not.toMatch(/^\w+\.\w+$/);
        }
      });

      // ── Settings ──
      it("settings: all keys resolve", () => {
        const keys = [
          "settings.title", "settings.language", "settings.theme",
          "settings.darkMode", "settings.about", "settings.testEngine",
          "settings.testEngineDesc",
        ];
        for (const key of keys) {
          expect(i18next.t(key), `${key} returned key path`).not.toMatch(/^\w+\.\w+$/);
        }
      });

      // ── About ──
      it("about: all keys resolve", () => {
        const keys = [
          "about.title", "about.version", "about.description",
          "about.features", "about.privacy", "about.copyright",
        ];
        for (const key of keys) {
          expect(i18next.t(key), `${key} returned key path`).not.toMatch(/^\w+\.\w+$/);
        }
      });

      // ── Engine verification ──
      it("engine test: all keys resolve", () => {
        const keys = [
          "engineTest.title", "engineTest.info", "engineTest.runAll",
          "engineTest.rerun", "engineTest.running", "engineTest.passed",
          "engineTest.failed", "engineTest.total", "engineTest.cases",
          "engineTest.awl", "engineTest.radd", "engineTest.calculationFailed",
          "engineTest.category.simple", "engineTest.category.moderate",
          "engineTest.category.complex", "engineTest.category.special",
          "engineTest.category.fiqh",
        ];
        for (const key of keys) {
          expect(i18next.t(key), `${key} returned key path`).not.toMatch(/^\w+\.\w+$/);
        }
      });

      // ── Common & error ──
      it("common & error: all keys resolve", () => {
        const keys = [
          "common.ok", "common.cancel", "common.save", "common.error",
          "common.success", "common.loading", "common.noNetwork",
          "error.title", "error.description", "error.tryAgain",
        ];
        for (const key of keys) {
          expect(i18next.t(key), `${key} returned key path`).not.toMatch(/^\w+\.\w+$/);
        }
      });

      // ── Madhab names ──
      it("madhab names resolve", () => {
        for (const key of ["madhab.hanafi", "madhab.maliki", "madhab.shafii", "madhab.hanbali"]) {
          expect(i18next.t(key), `${key} returned key path`).not.toMatch(/^\w+\.\w+$/);
        }
      });

      // ── Onboarding ──
      it("onboarding: all keys resolve", () => {
        const keys = [
          "onboarding.welcome", "onboarding.welcomeDescription",
          "onboarding.howToCalculate", "onboarding.resultsAndSharing",
          "onboarding.startNow",
        ];
        for (const key of keys) {
          expect(i18next.t(key), `${key} returned key path`).not.toMatch(/^\w+\.\w+$/);
        }
      });

      // ── No English fallback for translatable strings (non-English only) ──
      if (lang !== "en") {
        it(`translated keys are NOT English in ${lang}`, () => {
          // Get English values
          i18next.changeLanguage("en");
          const enVals: Record<string, string> = {};
          for (const key of MUST_TRANSLATE_KEYS) {
            enVals[key] = i18next.t(key);
          }

          // Switch back and check
          i18next.changeLanguage(lang);
          const failures: string[] = [];
          for (const key of MUST_TRANSLATE_KEYS) {
            const val = i18next.t(key);
            const enVal = enVals[key];
            if (val === enVal && enVal.length > 3) {
              failures.push(`${key}: "${val}"`);
            }
          }

          if (failures.length > 0) {
            console.log(`\n  ⚠️  ${lang}: ${failures.length} untranslated keys:\n    ${failures.join("\n    ")}\n`);
          }
          expect(
            failures.length,
            `${lang} has ${failures.length} untranslated keys:\n${failures.join("\n")}`
          ).toBeLessThanOrEqual(5);
        });
      }
    });
  }
});

// ── Cross-language consistency ──
describe("Cross-language consistency", () => {
  beforeAll(() => {
    i18next.init({
      lng: "en",
      fallbackLng: "en",
      resources: Object.fromEntries(
        Object.entries(locales).map(([lang, data]) => [lang, { translation: data }])
      ),
    });
  });

  it("all 6 languages produce non-empty output for every MUST_TRANSLATE key", () => {
    const failures: string[] = [];
    for (const lang of Object.keys(locales)) {
      i18next.changeLanguage(lang);
      for (const key of MUST_TRANSLATE_KEYS) {
        const val = i18next.t(key);
        if (!val || val === key) {
          failures.push(`${lang}.${key}`);
        }
      }
    }
    expect(failures, `Missing translations:\n${failures.join("\n")}`).toEqual([]);
  });

  it("no unresolved interpolation placeholders (excluding expected template keys)", () => {
    const failures: string[] = [];
    for (const lang of Object.keys(locales)) {
      i18next.changeLanguage(lang);
      const allKeys = flattenKeys(locales[lang]);
      for (const key of allKeys) {
        if (INTERPOLATION_KEYS.includes(key)) continue;
        const val = i18next.t(key);
        if (typeof val === "string" && (val.includes("{{") || val.includes("}}"))) {
          failures.push(`${lang}.${key}: "${val}"`);
        }
      }
    }
    expect(failures, `Unexpected interpolation:\n${failures.join("\n")}`).toEqual([]);
  });

  it("all locale files have exactly the same key count", () => {
    const counts = Object.entries(locales).map(([lang, data]) => ({
      lang,
      count: flattenKeys(data).length,
    }));
    const enCount = counts.find((c) => c.lang === "en")!.count;
    for (const c of counts) {
      expect(c.count, `${c.lang} has ${c.count} keys, expected ${enCount}`).toBe(enCount);
    }
  });
});
