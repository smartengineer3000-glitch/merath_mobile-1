/**
 * @file lib/i18n/index.ts
 * @description Internationalization setup with i18next
 * Supports: English, Urdu, Turkish, French, German, Arabic
 */

import { I18nManager } from "react-native";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ur from "./locales/ur.json";
import tr from "./locales/tr.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import ar from "./locales/ar.json";

// Language resources
const resources = {
  en: { translation: en },
  ur: { translation: ur },
  tr: { translation: tr },
  fr: { translation: fr },
  de: { translation: de },
  ar: { translation: ar },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources,
  lng: "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18next;

export const languages = {
  en: { name: "English", nativeName: "English", rtl: false },
  ur: { name: "Urdu", nativeName: "اردو", rtl: true },
  tr: { name: "Turkish", nativeName: "Türkçe", rtl: false },
  fr: { name: "French", nativeName: "Français", rtl: false },
  de: { name: "German", nativeName: "Deutsch", rtl: false },
  ar: { name: "Arabic", nativeName: "العربية", rtl: true },
} as const;

export type Language = keyof typeof languages;

/**
 * Apply RTL layout based on language.
 * Must be called when language changes. Note: I18nManager changes require app reload.
 */
export function applyRTLOfLanguage(lang: Language): void {
  const isRTL = languages[lang].rtl;
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  }
}
