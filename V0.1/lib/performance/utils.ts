/**
 * @file lib/performance/index.ts
 * @description Performance monitoring and optimization utilities
 */

// Performance metrics tracking
const metrics: Map<string, number[]> = new Map();

export const performanceUtils = {
  /**
   * Measure the duration of an async function
   */
  measureAsync: async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      recordMetric(label, duration);
      logIfSlow(label, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      recordMetric(label, duration);
      console.error(`${label} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  },

  /**
   * Measure the duration of a sync function
   */
  measureSync: <T>(label: string, fn: () => T): T => {
    const start = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - start;
      recordMetric(label, duration);
      logIfSlow(label, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      recordMetric(label, duration);
      console.error(`${label} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  },

  /**
   * Get performance statistics for a metric
   */
  getMetrics: (label?: string) => {
    if (!label) {
      const stats: Record<string, any> = {};
      metrics.forEach((values, key) => {
        stats[key] = getStats(values);
      });
      return stats;
    }

    const values = metrics.get(label);
    return values ? getStats(values) : null;
  },

  /**
   * Clear metrics
   */
  clearMetrics: (label?: string) => {
    if (label) {
      metrics.delete(label);
    } else {
      metrics.clear();
    }
  },

  /**
   * Log all metrics to console for debugging
   */
  logMetrics: () => {
    if (__DEV__) {
      console.log("=== Performance Metrics ===");
      metrics.forEach((values, label) => {
        const stats = getStats(values);
        console.log(`${label}:`, {
          count: stats.count,
          avg: `${stats.average.toFixed(2)}ms`,
          min: `${stats.min.toFixed(2)}ms`,
          max: `${stats.max.toFixed(2)}ms`,
        });
      });
    }
  },
};

function recordMetric(label: string, duration: number) {
  if (!metrics.has(label)) {
    metrics.set(label, []);
  }
  metrics.get(label)!.push(duration);
}

function logIfSlow(label: string, duration: number, threshold = 100) {
  if (duration > threshold) {
    console.warn(
      `⚠️ Performance Warning: ${label} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`,
    );
  }
}

interface PerformanceStats {
  count: number;
  average: number;
  min: number;
  max: number;
  total: number;
}

function getStats(values: number[]): PerformanceStats {
  if (values.length === 0) {
    return { count: 0, average: 0, min: 0, max: 0, total: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const total = sorted.reduce((a, b) => a + b, 0);
  const average = total / sorted.length;

  return {
    count: sorted.length,
    average,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    total,
  };
}

// Disable console logs in production
if (__DEV__ === false) {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  // Keep console.error for critical issues
}

export default performanceUtils;
