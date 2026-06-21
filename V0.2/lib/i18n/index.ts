/**
 * @file lib/i18n/index.ts
 * @description Internationalization setup with i18next
 * Supports: English, Urdu, Turkish, French, German, Arabic
 */

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import * as en from "./locales/en.json";
import * as ur from "./locales/ur.json";
import * as tr from "./locales/tr.json";
import * as fr from "./locales/fr.json";
import * as de from "./locales/de.json";
import * as ar from "./locales/ar.json";

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
    escapeValue: false, // React already escapes values
  },

  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
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
