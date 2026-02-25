import type { ExpoConfig } from "expo/config";

const bundleId = "space.manus.merath_mobile.t20260101172935";
const appScheme = "merath";

const env = {
  appName: 'حاسبة المواريث الشرعية (تطبيق جوال)',
  appSlug: 'mertahmobile',
  logoUrl: '',
  scheme: appScheme,
  androidPackage: bundleId,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: 'mertahmobile',
  version: "1.0.0",
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
    backgroundColor: "#ffffff"
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
      version: "1.0.0",
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
    // Enable Hermes engine for faster JS execution and smaller APK
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
    versionCode: 2,  // Increment for each build
  },
  web: {
    output: "static",
    favicon: "./assets/favicon.png",
  },
  plugins: [
    // expo-router plugin removed - using traditional navigation instead
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: false,
  },
};

export default config;
