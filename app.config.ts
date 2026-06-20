import type { ExpoConfig } from "expo/config";

const bundleId = "com.merath.app";
const appScheme = "merath";

const env = {
  appName: 'حاسبة المواريث الشرعية (تطبيق جوال)',
  appSlug: 'mertahmobile',           // ✅ Updated to match new slug
  logoUrl: '',
  scheme: appScheme,
  androidPackage: bundleId,
};

const config: ExpoConfig = {
  // === NEW: Add owner field ===
  owner: "merath_mobile",             // ✅ Added owner from project details

  name: env.appName,
  slug: env.appSlug,                  // Now uses 'mertah_mobile'
  version: "1.1.3",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  
  description: 'تطبيق شامل لحساب المواريث الشرعية بدعم المذاهب الفقهية الأربعة',
  platforms: ["android"],

  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#FFFFFF"
  },

  updates: {
    enabled: false,
    fallbackToCacheTimeout: 0,
    checkAutomatically: "ON_ERROR_RECOVERY"
  },

  extra: {
    eas: {
      projectId: "6e303c44-d7c9-403a-a835-80eff6a802ff"
    },
    appMetadata: {
      version: "1.1.3",
      buildNumber: 1,
      releaseDate: new Date().toISOString(),
      phase: 6,
      status: "production",
    }
  },

  android: {
    icon: "./assets/icon.png",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF"
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,
    permissions: [],
    blockedPermissions: [
      "WRITE_EXTERNAL_STORAGE",
      "READ_EXTERNAL_STORAGE",
      "RECORD_AUDIO"
    ],
    jsEngine: "hermes",
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: env.scheme,
            host: "*",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
    versionCode: process.env.EAS_BUILD_NUMBER ? parseInt(process.env.EAS_BUILD_NUMBER, 10) : 1,
  },
  web: {
    output: "single",
    favicon: "./assets/favicon.png",
  },
  plugins: [],
  experiments: {
    typedRoutes: true,
    reactCompiler: false,
  },
};

export default config;