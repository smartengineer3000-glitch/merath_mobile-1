const { getDefaultConfig } = require("expo/metro-config");
const { mergeConfig } = require("@react-native/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const expoConfig = getDefaultConfig(__dirname);

// Performance optimizations
expoConfig.maxWorkers = 4;

// Enable trailing comma stripping and other optimizations
expoConfig.transformer = {
  ...expoConfig.transformer,
  minifierPath: "metro-minify-terser",
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
  },
};

// Merge with React Native's default config
const config = mergeConfig(expoConfig, {
  // Add any React Native specific overrides here
  reporter: {
    ...expoConfig.reporter,
    update: () => {
      // Suppress noisy logs
    },
  },
});

module.exports = config;
