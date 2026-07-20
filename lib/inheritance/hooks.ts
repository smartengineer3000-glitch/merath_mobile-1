/**
 * Custom React Hooks for Islamic Inheritance Calculator
 * يحتوي على 5 hooks رئيسية لإدارة حالة الحسابات والنتائج والتسجيل
 * @author Merath App
 * @version 1.0.0
 *
 * FIXES:
 * - C2 (🔴): Async state inconsistency - consistent Promise returns, race condition protection
 * - H7 (🟠): Calculation timeout - prevents UI hanging on complex calculations
 */

import { useState, useCallback, useEffect, useRef } from "react";
import i18next from "i18next";
import { EnhancedInheritanceCalculationEngine as InheritanceCalculationEngine } from "./enhanced-engine-complete";
import { createAuditLog } from "./audit-log";
import type { AuditLogEntry } from "./audit-log";
import { CalculationCache } from "../performance/optimization";
import { debounce } from "../utils/debounce";
import type {
  EstateData,
  CalculationResult,
  MadhhabType,
  HeirsData,
  HeirShare,
} from "./types";

// ============================================================================
// Comparison Types (defined early for use in hooks)
// ============================================================================

export interface ComparisonResult {
  madhab: MadhhabType;
  madhhabName: string;
  totalAmount: number;
  shares: HeirShare[];
  differences: {
    heirName: string;
    amountDiff: number;
    percentageDiff: number;
    explanation: string;
  }[];
  summary: {
    isIdentical: boolean;
    majorDifferences: number;
    minorDifferences: number;
    recommendation?: string;
  };
}

// ============================================================================
// FIX H7: Timeout configuration
// ============================================================================
const CALCULATION_TIMEOUT_MS = 10000; // 10 seconds max calculation time
const DEBOUNCE_DELAY_MS = 300; // Debounce delay for rapid changes

// ============================================================================
// 1. useCalculator Hook - إدارة حالة الحسابات الأساسية (محسّن)
// ============================================================================

export function useCalculator() {
  const [estateData, setEstateData] = useState<EstateData>({
    total: 0,
    funeral: 0,
    debts: 0,
    will: 0,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastHeirsData, setLastHeirsData] = useState<HeirsData | null>(null);

  // ===== FIX C2: Use refs to track mounted state and abort controller =====
  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const calculationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // ===== FIX H7: Track calculation start time for performance =====
  const calculationStartTimeRef = useRef<number>(0);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      // ===== FIX C2: Clean up any pending calculations =====
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }
    };
  }, []);

  const updateEstateData = useCallback((updates: Partial<EstateData>) => {
    setEstateData((prev) => ({
      ...prev,
      ...updates,
    }));
    setError(null);
  }, []);

  const resetCalculator = useCallback(() => {
    setEstateData({
      total: 0,
      funeral: 0,
      debts: 0,
      will: 0,
    });
    setResult(null);
    setError(null);
    setIsCalculating(false);

    // ===== FIX C2: Cancel any pending calculations =====
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (calculationTimeoutRef.current) {
      clearTimeout(calculationTimeoutRef.current);
    }
  }, []);

  // ===== FIX H7: Debounced calculation to prevent rapid successive calls =====
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCalculate = useCallback(
    debounce(
      async (
        madhab: MadhhabType,
        heirs: HeirsData,
        estateOverride: EstateData,
        resolve: (value: any) => void,
      ) => {
        try {
          const engine = new InheritanceCalculationEngine(
            madhab,
            estateOverride,
            heirs,
          );
          const calcResult = engine.calculate();
          resolve(calcResult);
        } catch (err) {
          resolve({
            success: false,
            error: err instanceof Error ? err.message : "Calculation failed",
            madhab,
            madhhabName: madhab,
            shares: [],
            confidence: 0,
            steps: [],
            calculationTime: 0,
          });
        }
      },
      DEBOUNCE_DELAY_MS,
    ),
    [],
  );

  // ===== FIX C2 & H7: Complete rewrite of calculateWithMethod =====
  const calculateWithMethod = useCallback(
    async (
      madhab: MadhhabType,
      heirs: HeirsData,
      estateOverride?: EstateData,
    ): Promise<CalculationResult | null> => {
      const effectiveEstate = estateOverride || estateData;
      // ===== FIX C2: Prevent multiple simultaneous calculations =====
      if (isCalculating) {
        return null;
      }

      // ===== FIX C2: Cancel any pending operations =====
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }

      // Create new abort controller for this calculation
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      setIsCalculating(true);
      setError(null);
      calculationStartTimeRef.current = performance.now();

      try {
        // Validate estate data
        if (effectiveEstate.total <= 0) {
          throw new Error(i18next.t("calculator.errors.estateMustBePositive"));
        }

        // Validate heirs
        const heirCount = Object.values(heirs).reduce(
          (sum, val) => (sum || 0) + (val || 0),
          0,
        );
        if (heirCount === 0) {
          throw new Error(i18next.t("calculator.errors.atLeastOneHeir"));
        }

        setLastHeirsData(heirs);

        // ===== FIX C2: Check cache first (synchronous) =====
        const cachedResult = CalculationCache.getCalculation(
          madhab,
          effectiveEstate,
          heirs,
        );
        if (cachedResult && !signal.aborted) {
          CalculationCache.recordHit(cachedResult.calculationTime || 0);

          if (isMounted.current && !signal.aborted) {
            setResult(cachedResult);
            setIsCalculating(false);
          }
          return cachedResult;
        }

        // ===== FIX H7: Set up timeout promise =====
        const timeoutPromise = new Promise<never>((_, reject) => {
          calculationTimeoutRef.current = setTimeout(() => {
            reject(
              new Error(i18next.t("calculator.errors.calculationTimeout")),
            );
          }, CALCULATION_TIMEOUT_MS);
        });
        // ===== FIX C2: Create calculation promise with debouncing =====
        const calculationPromise = new Promise<CalculationResult>((resolve) => {
          debouncedCalculate(madhab, heirs, effectiveEstate, resolve);
        });

        // ===== FIX H7: Race between calculation and timeout =====
        const calculationResult = (await Promise.race([
          calculationPromise,
          timeoutPromise,
        ])) as CalculationResult;

        // Clear timeout since calculation completed
        if (calculationTimeoutRef.current) {
          clearTimeout(calculationTimeoutRef.current);
          calculationTimeoutRef.current = null;
        }

        // Check if aborted or component unmounted
        if (signal.aborted || !isMounted.current) {
          return null;
        }

        const duration = performance.now() - calculationStartTimeRef.current;

        // Cache the result for future use
        CalculationCache.cacheCalculation(
          madhab,
          effectiveEstate,
          heirs,
          calculationResult,
          duration,
        );
        CalculationCache.recordMiss(duration);

        // ===== FIX C2: Log slow calculations for monitoring =====
        if (duration > 1000) {
          console.warn(
            `[Performance] Slow calculation (${duration.toFixed(0)}ms) for ${madhab} with ${heirCount} heirs`,
          );
        }

        if (isMounted.current && !signal.aborted) {
          setResult(calculationResult);
        }

        return calculationResult;
      } catch (err) {
        // Clear timeout on error
        if (calculationTimeoutRef.current) {
          clearTimeout(calculationTimeoutRef.current);
          calculationTimeoutRef.current = null;
        }

        // Don't set error if aborted
        if (signal.aborted) {
          return null;
        }

        const errorMessage =
          err instanceof Error
            ? err.message
            : i18next.t("calculator.errors.unknownError");

        if (isMounted.current && !signal.aborted) {
          setError(errorMessage);
          setResult(null);
        }

        return {
          success: false,
          madhab,
          madhhabName: madhab,
          shares: [],
          confidence: 0,
          steps: [],
          calculationTime: performance.now() - calculationStartTimeRef.current,
          error: errorMessage,
          specialCases: { awl: false, auled: 0, radd: false, hijabTypes: [] },
        };
      } finally {
        if (isMounted.current) {
          setIsCalculating(false);
        }
        abortControllerRef.current = null;
      }
    },
    [estateData, isCalculating, debouncedCalculate],
  );

  const getState = useCallback(
    () => ({
      estateData,
      result,
      isCalculating,
      error,
    }),
    [estateData, result, isCalculating, error],
  );

  const compareCalculationResults = useCallback(
    (
      baseline: CalculationResult,
      other: CalculationResult,
    ): ComparisonResult => {
      const differences: {
        heirName: string;
        amountDiff: number;
        percentageDiff: number;
        explanation: string;
      }[] = [];
      const allHeirs = new Set<string>(
        [
          ...baseline.shares.map((s) => s.key ?? ""),
          ...other.shares.map((s) => s.key ?? ""),
        ].filter(Boolean) as string[],
      );

      let totalBaseline = 0;
      let totalOther = 0;

      allHeirs.forEach((heirKey) => {
        const baselineShare = baseline.shares.find((s) => s.key === heirKey);
        const otherShare = other.shares.find((s) => s.key === heirKey);

        const baselineAmount = baselineShare?.amount || 0;
        const otherAmount = otherShare?.amount || 0;
        totalBaseline += baselineAmount;
        totalOther += otherAmount;

        const amountDiff = otherAmount - baselineAmount;
        const percentageDiff =
          baselineAmount > 0
            ? (amountDiff / baselineAmount) * 100
            : otherAmount > 0
              ? 100
              : 0;

        if (Math.abs(amountDiff) > 0.01) {
          const explanation =
            baselineShare && !otherShare
              ? i18next.t("comparison.explanations.blockedInMadhab", {
                  madhab: other.madhhabName,
                })
              : !baselineShare && otherShare
                ? i18next.t("comparison.explanations.onlyInMadhab", {
                    madhab: other.madhhabName,
                  })
                : generateDifferenceExplanation(
                    heirKey,
                    baseline.madhab,
                    other.madhab,
                    amountDiff,
                  );

          differences.push({
            heirName: baselineShare?.name || otherShare?.name || heirKey,
            amountDiff,
            percentageDiff,
            explanation,
          });
        }
      });

      const isIdentical =
        differences.length === 0 && Math.abs(totalBaseline - totalOther) < 0.01;

      const majorDifferences = differences.filter(
        (d) => Math.abs(d.percentageDiff) > 10 || Math.abs(d.amountDiff) > 1000,
      ).length;

      const minorDifferences = differences.length - majorDifferences;
      let recommendation = "";
      if (isIdentical) {
        recommendation = i18next.t("comparison.recommendations.identical");
      } else if (majorDifferences > 0) {
        recommendation = i18next.t(
          "comparison.recommendations.majorDifferences",
          { count: majorDifferences },
        );
      } else if (minorDifferences > 0) {
        recommendation = i18next.t(
          "comparison.recommendations.minorDifferences",
        );
      }

      return {
        madhab: other.madhab,
        madhhabName: other.madhhabName,
        totalAmount: totalOther,
        shares: other.shares,
        differences,
        summary: {
          isIdentical,
          majorDifferences,
          minorDifferences,
          recommendation,
        },
      };
    },
    [],
  );

  // ===== NEW: Compare current scenario across all madhabs =====
  const compareAcrossMadhabs = useCallback(async (): Promise<
    ComparisonResult[]
  > => {
    if (!result || !estateData || !lastHeirsData) return [];

    const madhabs: MadhhabType[] = ["shafii", "hanafi", "maliki", "hanbali"];
    const primaryMadhab = result.madhab;

    const calculations = await Promise.all(
      madhabs.map(async (madhab) => {
        try {
          const engine = new InheritanceCalculationEngine(
            madhab,
            estateData,
            lastHeirsData,
          );
          const calcResult = engine.calculate();
          return calcResult.success ? calcResult : null;
        } catch (error) {
          console.error(`Failed to calculate for ${madhab}:`, error);
          return null;
        }
      }),
    );

    const results = calculations.filter(
      (r): r is CalculationResult => r !== null,
    );
    const primaryResult = results.find((r) => r.madhab === primaryMadhab);
    if (!primaryResult) return [];

    return results
      .filter((r) => r.madhab !== primaryMadhab)
      .map((calcResult) =>
        compareCalculationResults(primaryResult, calcResult),
      );
  }, [result, estateData, lastHeirsData, compareCalculationResults]);
  return {
    estateData,
    result,
    isCalculating,
    error,
    updateEstateData,
    resetCalculator,
    calculateWithMethod,
    compareAcrossMadhabs,
    getState,
  };
}

// ============================================================================
// 2. useAuditLog Hook - الوصول لنظام التسجيل والبحث
// ============================================================================

export function useAuditLog() {
  const [auditLog] = useState(() => createAuditLog());
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ===== FIX C4: Use ref to prevent race conditions =====
  const loadInProgress = useRef(false);

  useEffect(() => {
    const loadEntries = async () => {
      if (loadInProgress.current) return;

      loadInProgress.current = true;
      try {
        const loadedEntries = await Promise.resolve(auditLog.getAllEntries());
        setEntries(loadedEntries);
      } catch (err) {
        console.error("Failed to load audit log entries:", err);
      } finally {
        setIsLoading(false);
        loadInProgress.current = false;
      }
    };

    loadEntries();
  }, [auditLog]);

  const logCalculation = useCallback(
    (
      madhab: MadhhabType,
      estate: EstateData,
      heirs: HeirsData,
      result: CalculationResult,
      duration?: number,
    ) => {
      try {
        const entry = auditLog.logCalculation(
          madhab,
          heirs,
          estate,
          result,
          duration || 0,
          i18next.t("audit.normalCalculation"),
        );
        setEntries((prev) => [entry, ...prev] as AuditLogEntry[]); // Add to front for reverse chronological
        return entry;
      } catch (err) {
        console.error("Failed to log calculation:", err);
        return null;
      }
    },
    [auditLog],
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      try {
        const success = auditLog.deleteEntry(id);
        if (await success) {
          setEntries((prev) => prev.filter((entry) => entry.id !== id));
        }
        return success;
      } catch (err) {
        console.error("Failed to delete entry:", err);
        return false;
      }
    },
    [auditLog],
  );

  const searchEntries = useCallback(
    (madhab?: MadhhabType, operation?: string, limit?: number) => {
      try {
        const results = auditLog.filter({
          madhab,
          operation: operation as AuditLogEntry["operation"],
          limit,
        });
        return results;
      } catch (err) {
        console.error("Failed to search entries:", err);
        return [];
      }
    },
    [auditLog],
  );

  const getStats = useCallback(() => {
    try {
      return auditLog.getStats();
    } catch (err) {
      console.error("Failed to get stats:", err);
      return null;
    }
  }, [auditLog]);

  const clearAll = useCallback(() => {
    try {
      auditLog.clearAll();
      setEntries([]);
      return true;
    } catch (err) {
      console.error("Failed to clear audit log:", err);
      return false;
    }
  }, [auditLog]);

  const exportAsJSON = useCallback(() => {
    try {
      return auditLog.exportAsJSON();
    } catch (err) {
      console.error("Failed to export audit log:", err);
      return null;
    }
  }, [auditLog]);

  const importFromJSON = useCallback(
    (jsonString: string) => {
      try {
        const imported = auditLog.importFromJSON(jsonString);
        setEntries(auditLog.getAllEntries());
        return imported;
      } catch (err) {
        console.error("Failed to import audit log:", err);
        return null;
      }
    },
    [auditLog],
  );

  return {
    entries,
    isLoading,
    logCalculation,
    deleteEntry,
    searchEntries,
    getStats,
    clearAll,
    exportAsJSON,
    importFromJSON,
    auditLog,
  };
}

// ============================================================================
// Helper function to generate explanations for differences
function generateDifferenceExplanation(
  heirKey: string,
  _madhab1: MadhhabType,
  _madhab2: MadhhabType,
  _amountDiff: number,
): string {
  const explanationKey = `comparison.explanations.${heirKey}`;
  const translated = i18next.t(explanationKey);
  // If no specific translation exists, return a generic one
  return translated !== explanationKey
    ? translated
    : i18next.t("comparison.explanations.defaultMadhabDifference");
}

// ============================================================================
// Export
// ============================================================================

export default {
  useCalculator,
  useAuditLog,
};
