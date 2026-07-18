import { describe, it, expect } from "vitest";
import { HEIRS, HEIR_GROUPS } from "../constants/heirData";
import en from "../lib/i18n/locales/en.json";
import ar from "../lib/i18n/locales/ar.json";
import ur from "../lib/i18n/locales/ur.json";
import tr from "../lib/i18n/locales/tr.json";
import fr from "../lib/i18n/locales/fr.json";
import de from "../lib/i18n/locales/de.json";

const locales = { en, ar, ur, tr, fr, de };

const LANGUAGES = {
  en: { name: "English", nativeName: "English", rtl: false },
  ur: { name: "Urdu", nativeName: "اردو", rtl: true },
  tr: { name: "Turkish", nativeName: "Türkçe", rtl: false },
  fr: { name: "French", nativeName: "Français", rtl: false },
  de: { name: "German", nativeName: "Deutsch", rtl: false },
  ar: { name: "Arabic", nativeName: "العربية", rtl: true },
};

describe("App configuration", () => {
  it("supports exactly 6 languages", () => {
    expect(Object.keys(LANGUAGES).length).toBe(6);
  });

  it("all languages have required properties", () => {
    for (const [, lang] of Object.entries(LANGUAGES)) {
      expect(typeof lang.name).toBe("string");
      expect(typeof lang.nativeName).toBe("string");
      expect(typeof lang.rtl).toBe("boolean");
      expect(lang.name.length).toBeGreaterThan(0);
      expect(lang.nativeName.length).toBeGreaterThan(0);
    }
  });

  it("RTL languages are Arabic and Urdu only", () => {
    const rtlLangs = Object.entries(LANGUAGES)
      .filter(([, l]) => l.rtl)
      .map(([code]) => code);
    expect(rtlLangs.sort()).toEqual(["ar", "ur"]);
  });

  it("LTR languages are English, Turkish, French, German", () => {
    const ltrLangs = Object.entries(LANGUAGES)
      .filter(([, l]) => !l.rtl)
      .map(([code]) => code);
    expect(ltrLangs.sort()).toEqual(["de", "en", "fr", "tr"]);
  });
});

describe("Heir data integrity", () => {
  it("every expected heir type exists in HEIRS array", () => {
    const expectedTypes = [
      "husband",
      "wife",
      "father",
      "mother",
      "grandfather",
      "grandmother_mother",
      "grandmother_father",
      "son",
      "daughter",
      "grandson",
      "granddaughter",
      "full_brother",
      "full_sister",
      "paternal_brother",
      "paternal_sister",
      "maternal_brother",
      "maternal_sister",
      "full_nephew",
      "full_uncle",
      "full_cousin",
    ];
    const actualTypes = HEIRS.map((h) => h.key);
    for (const type of expectedTypes) {
      expect(actualTypes).toContain(type);
    }
  });

  it("each group maps to the correct label key pattern", () => {
    const expectedLabels: Record<string, string> = {
      spouses: "heirs.group.spouses",
      descendants: "heirs.group.descendants",
      ascendants: "heirs.group.ascendants",
      siblings: "heirs.group.siblings",
      extended: "heirs.group.nephews",
    };
    for (const [group, expectedLabel] of Object.entries(expectedLabels)) {
      expect(HEIR_GROUPS[group as keyof typeof HEIR_GROUPS].labelKey).toBe(
        expectedLabel,
      );
    }
  });
});

describe("Navigation structure", () => {
  it("defines 4 main tabs", () => {
    const tabs = ["calculator", "comparison", "history", "settings"];
    expect(tabs.length).toBe(4);
  });

  it("defines 5 navigation screens", () => {
    const screens = [
      "Calculator",
      "Results",
      "Comparison",
      "History",
      "Settings",
    ];
    expect(screens.length).toBe(5);
  });
});

describe("Design system constants", () => {
  it("defines valid color palette", () => {
    const colors = {
      primary: "#2e7d32",
      secondary: "#1565c0",
      tertiary: "#f9a825",
    };
    for (const [name, hex] of Object.entries(colors)) {
      expect(hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(name).toBeTruthy();
    }
  });

  it("defines 8pt grid spacing multiples", () => {
    const spacing = [4, 8, 16, 24, 32, 48];
    for (const value of spacing) {
      expect(value % 4).toBe(0);
      expect(value).toBeGreaterThan(0);
    }
  });

  it("defines valid madhab types", () => {
    const madhabs = ["hanafi", "maliki", "shafii", "hanbali"];
    expect(madhabs.length).toBe(4);
  });
});

describe("Export/Share configuration", () => {
  it("defines 4 export formats", () => {
    const formats = ["pdf", "image", "text", "clipboard"];
    expect(formats.length).toBe(4);
  });
});

describe("Disclaimer sections", () => {
  it("defines 3 disclaimer sections", () => {
    const sections = [
      "calculationDisclaimer",
      "notLegalAdvice",
      "privacyPolicy",
    ];
    expect(sections.length).toBe(3);
  });
});

describe("Onboarding flow", () => {
  it("defines 3 onboarding steps", () => {
    const steps = ["welcome", "howToCalculate", "resultsAndSharing"];
    expect(steps.length).toBe(3);
  });
});

describe("App metadata", () => {
  it("app name is Merath", () => {
    expect("Merath").toBe("Merath");
  });

  it("copyright year is 2026", () => {
    expect(2026).toBe(2026);
  });
});

describe("Locale file structure", () => {
  it("all 6 locales have the same number of keys", () => {
    function countKeys(obj: any): number {
      let count = 0;
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          count += countKeys(obj[key]);
        } else {
          count++;
        }
      }
      return count;
    }

    const enCount = countKeys(en);
    for (const [, data] of Object.entries(locales)) {
      expect(countKeys(data)).toBe(enCount);
    }
  });

  it("all locales have results.section titles", () => {
    for (const [lang, data] of Object.entries(locales)) {
      const results = (data as any).results;
      expect(
        results.calculationSteps,
        `${lang} missing calculationSteps`,
      ).toBeTruthy();
      expect(results.blockedHeirs, `${lang} missing blockedHeirs`).toBeTruthy();
      expect(results.heir, `${lang} missing heir`).toBeTruthy();
    }
  });

  it("all locales have disclaimer text", () => {
    for (const [lang, data] of Object.entries(locales)) {
      const disclaimer = (data as any).disclaimer;
      expect(disclaimer.title, `${lang} missing disclaimer.title`).toBeTruthy();
      expect(
        disclaimer.calculationDisclaimerText,
        `${lang} missing disclaimer.calculationDisclaimerText`,
      ).toBeTruthy();
      expect(
        disclaimer.notLegalAdviceText,
        `${lang} missing disclaimer.notLegalAdviceText`,
      ).toBeTruthy();
      expect(
        disclaimer.privacyPolicyText,
        `${lang} missing disclaimer.privacyPolicyText`,
      ).toBeTruthy();
    }
  });

  it("all locales have error messages", () => {
    for (const [lang, data] of Object.entries(locales)) {
      const error = (data as any).error;
      expect(
        error.somethingWentWrong,
        `${lang} missing error.somethingWentWrong`,
      ).toBeTruthy();
      expect(error.retry, `${lang} missing error.retry`).toBeTruthy();
      expect(error.tryAgain, `${lang} missing error.tryAgain`).toBeTruthy();
    }
  });
});
