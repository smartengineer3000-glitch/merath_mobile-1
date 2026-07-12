import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  CalculationCache,
  PerformanceMonitor,
  debounce,
  throttle,
  memoize,
} from "../lib/performance/optimization";

beforeEach(() => {
  CalculationCache.clear();
});

describe("CalculationCache", () => {
  const estate = { total: 100000, funeral: 5000, debts: 10000, will: 0 };
  const heirs = { wife: 1, son: 2 };
  const mockResult = {
    allocations: [],
    netEstate: 85000,
    status: "success" as const,
    steps: [],
    timestamp: new Date(),
    totalDistributed: 85000,
    confidence: 0.95,
    success: true,
    madhab: "hanafi" as const,
    madhhabName: "Hanafi",
    shares: [],
    calculationTime: 50,
  };

  it("returns null for cache miss", () => {
    const result = CalculationCache.getCalculation("hanafi", estate, heirs);
    expect(result).toBeNull();
  });

  it("stores and retrieves cached result", () => {
    CalculationCache.cacheCalculation("hanafi", estate, heirs, mockResult, 50);
    const cached = CalculationCache.getCalculation("hanafi", estate, heirs);
    expect(cached).toEqual(mockResult);
  });

  it("returns null for different madhab", () => {
    CalculationCache.cacheCalculation("hanafi", estate, heirs, mockResult, 50);
    const cached = CalculationCache.getCalculation("maliki", estate, heirs);
    expect(cached).toBeNull();
  });

  it("returns null for different estate", () => {
    CalculationCache.cacheCalculation("hanafi", estate, heirs, mockResult, 50);
    const differentEstate = { total: 200000, funeral: 0, debts: 0, will: 0 };
    const cached = CalculationCache.getCalculation(
      "hanafi",
      differentEstate,
      heirs,
    );
    expect(cached).toBeNull();
  });

  it("enforces max cache size of 100", () => {
    for (let i = 0; i < 105; i++) {
      const e = { total: i * 1000, funeral: 0, debts: 0, will: 0 };
      CalculationCache.cacheCalculation("hanafi", e, heirs, mockResult, 10);
    }
    const stats = CalculationCache.getStats();
    expect(stats.cacheSize).toBeLessThanOrEqual(100);
  });

  it("clears cache and metrics", () => {
    CalculationCache.cacheCalculation("hanafi", estate, heirs, mockResult, 50);
    CalculationCache.clear();
    const stats = CalculationCache.getStats();
    expect(stats.totalCalculations).toBe(0);
    expect(stats.cacheSize).toBe(0);
  });

  it("tracks cache hit/miss statistics", () => {
    CalculationCache.cacheCalculation("hanafi", estate, heirs, mockResult, 50);
    CalculationCache.getCalculation("hanafi", estate, heirs); // hit
    CalculationCache.getCalculation("maliki", estate, heirs); // miss
    const stats = CalculationCache.getStats();
    expect(stats.totalCalculations).toBeGreaterThan(0);
  });

  it("exports metrics as valid JSON", () => {
    CalculationCache.cacheCalculation("hanafi", estate, heirs, mockResult, 50);
    const json = CalculationCache.exportMetrics();
    const parsed = JSON.parse(json);
    expect(parsed.stats).toBeDefined();
    expect(parsed.metrics).toBeDefined();
    expect(parsed.timestamp).toBeDefined();
  });
});

describe("PerformanceMonitor", () => {
  it("measures async function duration", async () => {
    const fn = async () => {
      await new Promise((r) => setTimeout(r, 10));
      return 42;
    };
    const { result, duration } = await PerformanceMonitor.measure("test", fn);
    expect(result).toBe(42);
    expect(duration).toBeGreaterThanOrEqual(0);
  });

  it("measures sync function duration", () => {
    const fn = () => 42;
    const { result, duration } = PerformanceMonitor.measureSync("test", fn);
    expect(result).toBe(42);
    expect(duration).toBeGreaterThanOrEqual(0);
  });

  it("propagates errors from async functions", async () => {
    const fn = async () => {
      throw new Error("test error");
    };
    await expect(
      PerformanceMonitor.measure("test", fn),
    ).rejects.toThrow("test error");
  });

  it("propagates errors from sync functions", () => {
    const fn = () => {
      throw new Error("test error");
    };
    expect(() => PerformanceMonitor.measureSync("test", fn)).toThrow(
      "test error",
    );
  });

  it("returns duration 0 when disabled", async () => {
    PerformanceMonitor.disable();
    const fn = async () => 42;
    const { result, duration } = await PerformanceMonitor.measure("test", fn);
    expect(result).toBe(42);
    expect(duration).toBe(0);
    PerformanceMonitor.enable();
  });
});

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("delays function execution", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("resets delay on subsequent calls", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    vi.advanceTimersByTime(50);
    debounced(); // reset
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("passes arguments to the debounced function", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced("arg1", "arg2");
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith("arg1", "arg2");
  });
});

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("executes function immediately on first call", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("throttles subsequent calls within limit", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled(); // should be ignored
    throttled(); // should be ignored
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("allows calls after throttle period expires", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    vi.advanceTimersByTime(100);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe("memoize", () => {
  it("caches and returns same result for same args", () => {
    let callCount = 0;
    const fn = (x: number) => {
      callCount++;
      return x * 2;
    };
    const memoized = memoize(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);
    expect(callCount).toBe(1); // only called once
  });

  it("returns different results for different args", () => {
    const fn = (x: number) => x * 2;
    const memoized = memoize(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(10)).toBe(20);
  });

  it("handles multiple arguments", () => {
    const fn = (a: number, b: number) => a + b;
    const memoized = memoize(fn);

    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(2, 1)).toBe(3);
  });

  it("does not exceed cache size of 1000", () => {
    const fn = (x: number) => x;
    const memoized = memoize(fn);

    for (let i = 0; i < 1100; i++) {
      memoized(i);
    }
    // should not throw or leak memory
    expect(memoized(0)).toBe(0);
  });
});
