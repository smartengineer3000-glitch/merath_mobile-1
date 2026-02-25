/**
 * @file lib/performance/bundle-analyzer.ts
 * @description Utilities for analyzing and optimizing bundle size
 */

export const bundleOptimizationTips = {
  hermes: {
    description: 'Hermes JavaScript Engine',
    benefit: 'Reduces APK size by ~30% and improves startup time',
    status: '✅ ENABLED in app.config.ts',
    impact: 'High Priority',
  },

  proguard: {
    description: 'ProGuard Code Obfuscation',
    benefit: 'Obfuscates code and removes unused code, reducing APK by ~15-20%',
    status: '✅ ENABLED in app.config.ts',
    impact: 'High Priority',
  },

  bundleSize: {
    description: 'Bundle Size Reduction',
    tips: [
      'Remove unused dependencies - audit with: npm audit',
      'Tree-shake unused exports - TypeScript compiler settings',
      'Lazy load screens and components',
      'Split large components into smaller ones',
      'Use dynamic imports for features',
    ],
  },

  imageOptimization: {
    description: 'Image Optimization',
    tips: [
      'Convert PNG to WebP format where supported',
      'Compress images using tools like ImageMagick',
      'Use expo-image for better performance',
      'Implement responsive images for different screens',
    ],
  },

  dependencies: {
    description: 'Dependency Management',
    tips: [
      'Review all dependencies regularly',
      'Replace heavy packages with lighter alternatives',
      'Keep dependencies updated for security and performance',
      'Use npm-check-updates: ncu --upgrade',
    ],
  },

  networkOptimization: {
    description: 'Network Optimization',
    tips: [
      'Minimize API calls',
      'Use caching strategies',
      'Compress API responses',
      'Implement request debouncing',
    ],
  },

  memoryOptimization: {
    description: 'Memory Optimization',
    tips: [
      'Avoid memory leaks - unsubscribe from observables',
      'Limit cache sizes',
      'Release resources in cleanup functions',
      'Monitor memory usage in DevTools',
    ],
  },
};

// Target APK sizes
export const apkTargets = {
  min: {
    name: 'Minimal',
    size: 50,
    description: 'Stripped down version with essential features only',
  },
  optimal: {
    name: 'Optimal',
    size: 85,
    description: 'All features with good compression',
  },
  full: {
    name: 'Full',
    size: 120,
    description: 'All features, all languages, all assets',
  },
};

/**
 * Analyze bundle size optimization strategies
 */
export function analyzeBundleOptimization(currentSizeInMB: number): {
  currentSize: number;
  targetSize: number;
  reductionNeeded: number;
  percentReduction: number;
  recommendations: string[];
} {
  const targetSize = apkTargets.optimal.size;
  const reductionNeeded = currentSizeInMB - targetSize;
  const percentReduction = (reductionNeeded / currentSizeInMB) * 100;

  const recommendations: string[] = [];

  if (currentSizeInMB > 150) {
    recommendations.push(
      '⚠️ APK is significantly larger than recommended. Implement all optimizations.'
    );
    recommendations.push('Enable Hermes engine (already enabled)');
    recommendations.push('Enable ProGuard/R8 (already enabled)');
  }

  if (currentSizeInMB > 100) {
    recommendations.push('Review and remove unused dependencies');
    recommendations.push('Implement code splitting for screens');
    recommendations.push('Optimize and compress images');
  }

  if (percentReduction > 0) {
    recommendations.push(
      `Target: ${targetSize}MB (reduce by ${reductionNeeded.toFixed(1)}MB or ${percentReduction.toFixed(1)}%)`
    );
  } else {
    recommendations.push('✅ Within target size!');
  }

  return {
    currentSize: currentSizeInMB,
    targetSize,
    reductionNeeded: Math.max(0, reductionNeeded),
    percentReduction: Math.max(0, percentReduction),
    recommendations,
  };
}

/**
 * Get optimization checklist
 */
export function getOptimizationChecklist() {
  return [
    { item: 'Enable Hermes engine', done: true, estimatedSavings: '30%' },
    { item: 'Enable ProGuard/R8', done: true, estimatedSavings: '15-20%' },
    { item: 'Remove unused dependencies', done: false, estimatedSavings: '5-10%' },
    { item: 'Implement lazy loading', done: false, estimatedSavings: '3-5%' },
    { item: 'Optimize images', done: false, estimatedSavings: '10-15%' },
    { item: 'Code splitting', done: false, estimatedSavings: '5%' },
    { item: 'Tree-shake unused exports', done: false, estimatedSavings: '2-5%' },
  ];
}

export default {
  bundleOptimizationTips,
  apkTargets,
  analyzeBundleOptimization,
  getOptimizationChecklist,
};
