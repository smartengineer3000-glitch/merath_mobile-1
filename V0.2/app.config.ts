import type { ExpoConfig } from "expo/config";

const bundleId = "com.merath.app";
const appScheme = "merath";

const env = {
  appName: "حاسبة المواريث الشرعية (تطبيق جوال)",
  appSlug: "mertahmobile",
  logoUrl: "",
  scheme: appScheme,
  androidPackage: bundleId,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,

  description: "تطبيق شامل لحساب المواريث الشرعية بدعم المذاهب الفقهية الأربعة",
  platforms: ["android", "web"],

  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#FFFFFF",
  },

  // Modern design theme
  // Note: theme is not a valid ExpoConfig property, moved to custom config

  updates: {
    enabled: false,
    fallbackToCacheTimeout: 0,
    checkAutomatically: "ON_ERROR_RECOVERY",
  },

  extra: {
    eas: {
      projectId: "6e303c44-d7c9-403a-a835-80eff6a802ff",
    },
    appMetadata: {
      version: "1.0.0",
      buildNumber: 1,
      releaseDate: new Date().toISOString(),
      phase: 6,
      status: "production",
    },
  },

  android: {
    icon: "./assets/icon.png",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    permissions: [],
    blockedPermissions: [
      "WRITE_EXTERNAL_STORAGE",
      "READ_EXTERNAL_STORAGE",
      "RECORD_AUDIO",
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
    versionCode: process.env.EAS_BUILD_NUMBER
      ? parseInt(process.env.EAS_BUILD_NUMBER, 10)
      : 1,
  },
  plugins: [
    // expo-router plugin removed - using traditional navigation instead
  ],
  experiments: {
    typedRoutes: false,
    reactCompiler: false,
  },
};

export default config;
