// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Performance optimizations
config.maxWorkers = 4; // Limit worker threads for stability
config.reporter = {
  ...config.reporter,
  update: () => {
    // Suppress noisy logs
  },
};

// Enable trailing comma stripping and other optimizations
config.transformer = {
  ...config.transformer,
  minifierPath: 'metro-minify-terser', // Use Terser for smaller bundles
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
  },
};

module.exports = config;
