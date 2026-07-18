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
import { EnhancedInheritanceCalculationEngine as InheritanceCalculationEngine } from "./enhanced-engine-complete";
import { AuditLog, createAuditLog, type AuditLogEntry } from "./audit-log";
import {
  CalculationCache,
  PerformanceMonitor,
} from "../performance/optimization";
import type {
  EstateData,
  CalculationResult,
  MadhhabType,
  HeirType,
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
  const debouncedCalculate = useCallback(
    debounce(
      async (
        madhab: MadhhabType,
        heirs: HeirsData,
        resolve: (value: any) => void,
      ) => {
        try {
          const engine = new InheritanceCalculationEngine(
            madhab,
            estateData,
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
    [estateData],
  );

  // ===== FIX C2 & H7: Complete rewrite of calculateWithMethod =====
  const calculateWithMethod = useCallback(
    async (
      madhab: MadhhabType,
      heirs: HeirsData,
    ): Promise<CalculationResult | null> => {
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
        if (estateData.total <= 0) {
          throw new Error("التركة يجب أن تكون أكبر من صفر");
        }

        // Validate heirs
        const heirCount = Object.values(heirs).reduce(
          (sum, val) => (sum || 0) + (val || 0),
          0,
        );
        if (heirCount === 0) {
          throw new Error("يجب تحديد ورثة واحد على الأقل");
        }

        setLastHeirsData(heirs);

        // ===== FIX C2: Check cache first (synchronous) =====
        const cachedResult = CalculationCache.getCalculation(
          madhab,
          estateData,
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
            reject(new Error("انتهت مهلة الحساب. يرجى المحاولة مرة أخرى."));
          }, CALCULATION_TIMEOUT_MS);
        });
        // ===== FIX C2: Create calculation promise with debouncing =====
        const calculationPromise = new Promise<CalculationResult>((resolve) => {
          debouncedCalculate(madhab, heirs, resolve);
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
          estateData,
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
          err instanceof Error ? err.message : "حدث خطأ غير معروف في الحساب";

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
              ? `محجوب في المذهب ${other.madhhabName}`
              : !baselineShare && otherShare
                ? `يرث في المذهب ${other.madhhabName} فقط`
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
        recommendation = "النتائج متطابقة في كلا المذهبين";
      } else if (majorDifferences > 0) {
        recommendation = `يوجد اختلافات جوهرية في ${majorDifferences} من الورثة. يوصى باستشارة متخصص.`;
      } else if (minorDifferences > 0) {
        recommendation = "اختلافات طفيفة بين المذهبين - يمكن اختيار أي منهما";
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
    const results: CalculationResult[] = [];
    const primaryMadhab = result.madhab;

    for (const madhab of madhabs) {
      try {
        const engine = new InheritanceCalculationEngine(
          madhab,
          estateData,
          lastHeirsData,
        );
        const calcResult = await engine.calculate();
        if (calcResult.success) {
          results.push(calcResult);
        }
      } catch (error) {
        console.error(`Failed to calculate for ${madhab}:`, error);
      }
    }

    const comparisons: ComparisonResult[] = [];
    const primaryResult = results.find((r) => r.madhab === primaryMadhab);
    if (!primaryResult) return [];

    for (const calcResult of results) {
      if (calcResult.madhab === primaryMadhab) continue;
      comparisons.push(compareCalculationResults(primaryResult, calcResult));
    }

    return comparisons;
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
        console.error("خطأ في تحميل سجل التسجيل:", err);
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
          "حساب عادي",
        );
        setEntries((prev) => [entry, ...prev] as AuditLogEntry[]); // Add to front for reverse chronological
        return entry;
      } catch (err) {
        console.error("خطأ في تسجيل العملية:", err);
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
        console.error("خطأ في حذف الإدخال:", err);
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
        console.error("خطأ في البحث:", err);
        return [];
      }
    },
    [auditLog],
  );

  const getStats = useCallback(() => {
    try {
      return auditLog.getStats();
    } catch (err) {
      console.error("خطأ في الحصول على الإحصائيات:", err);
      return null;
    }
  }, [auditLog]);

  const clearAll = useCallback(() => {
    try {
      auditLog.clearAll();
      setEntries([]);
      return true;
    } catch (err) {
      console.error("خطأ في مسح السجل:", err);
      return false;
    }
  }, [auditLog]);

  const exportAsJSON = useCallback(() => {
    try {
      return auditLog.exportAsJSON();
    } catch (err) {
      console.error("خطأ في التصدير:", err);
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
        console.error("خطأ في الاستيراد:", err);
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
// 3. useResults Hook - إدارة حالة النتائج والتخزين المؤقت مع مقارنة متقدمة
// ============================================================================

export function useResults() {
  const [currentResult, setCurrentResult] = useState<CalculationResult | null>(
    null,
  );
  const [previousResults, setPreviousResults] = useState<CalculationResult[]>(
    [],
  );
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<
    ComparisonResult[]
  >([]);

  const saveResult = useCallback((result: CalculationResult) => {
    setCurrentResult(result);
    setPreviousResults((prev) => {
      const updated = [result, ...prev];
      return updated.slice(0, 10); // Keep last 10 results
    });
  }, []);

  const clearResults = useCallback(() => {
    setCurrentResult(null);
    setPreviousResults([]);
    setComparisonMode(false);
    setComparisonResults([]);
  }, []);

  /**
   * Advanced comparison between multiple madhhab results
   */
  const compareMadhhabs = useCallback(
    (results: CalculationResult[]): ComparisonResult[] => {
      if (results.length < 2) return [];

      const comparisons: ComparisonResult[] = [];

      // Use the first result as baseline, or find a common baseline
      const baseline = results[0];

      for (let i = 1; i < results.length; i++) {
        const other = results[i];

        // Calculate differences for each heir
        const differences = [];

        // Get all unique heir keys from both results
        const allHeirs = new Set([
          ...baseline.shares.map((s) => s.key).filter(Boolean),
          ...other.shares.map((s) => s.key).filter(Boolean),
        ]);

        let totalBaseline = 0;
        let totalOther = 0;

        for (const heirKey of allHeirs) {
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

          // Only include if there's a significant difference (> 0.01)
          if (Math.abs(amountDiff) > 0.01) {
            let explanation = "";

            // Generate explanation based on madhab differences
            if (baselineShare && !otherShare) {
              explanation = `محجوب في المذهب ${other.madhhabName}`;
            } else if (!baselineShare && otherShare) {
              explanation = `يرث في المذهب ${other.madhhabName} فقط`;
            } else {
              explanation = generateDifferenceExplanation(
                heirKey as string,
                baseline.madhab,
                other.madhab,
                amountDiff,
              );
            }

            differences.push({
              heirName:
                baselineShare?.name || otherShare?.name || (heirKey as string),
              amountDiff,
              percentageDiff,
              explanation,
            });
          }
        }

        // Determine if results are identical (within tolerance)
        const isIdentical =
          differences.length === 0 &&
          Math.abs(totalBaseline - totalOther) < 0.01;

        // Categorize differences
        const majorDifferences = differences.filter(
          (d) =>
            Math.abs(d.percentageDiff) > 10 || Math.abs(d.amountDiff) > 1000,
        ).length;

        const minorDifferences = differences.length - majorDifferences;

        // Generate recommendation
        let recommendation = "";
        if (isIdentical) {
          recommendation = "النتائج متطابقة في كلا المذهبين";
        } else if (majorDifferences > 0) {
          recommendation = `يوجد اختلافات جوهرية في ${majorDifferences} من الورثة. يوصى باستشارة متخصص.`;
        } else if (minorDifferences > 0) {
          recommendation = "اختلافات طفيفة بين المذهبين - يمكن اختيار أي منهما";
        }

        // Push the comparison result
        comparisons.push({
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
        });
      }

      setComparisonResults(comparisons);
      return comparisons;
    },
    [],
  );

  /**
   * Compare current result with previous results
   */
  const compareWithPrevious = useCallback(
    (result: CalculationResult): ComparisonResult[] => {
      const allResults = [result, ...previousResults.slice(0, 3)]; // Compare with up to 3 previous
      return compareMadhhabs(allResults);
    },
    [previousResults, compareMadhhabs],
  );

  /**
   * Compare specific results by index in previousResults
   */
  const compareSpecific = useCallback(
    (indices: number[]): ComparisonResult[] => {
      const results = indices
        .map((index) => previousResults[index])
        .filter((r) => r !== undefined) as CalculationResult[];

      return compareMadhhabs(results);
    },
    [previousResults, compareMadhhabs],
  );

  /**
   * Generate HTML report for comparison
   */
  const generateComparisonReport = useCallback(
    (comparisons: ComparisonResult[]): string => {
      if (comparisons.length === 0) return "";

      const baseline = currentResult;
      if (!baseline) return "";

      let html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; }
          h1 { color: #2e7d32; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background-color: #2e7d32; color: white; padding: 10px; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          .identical { color: #4caf50; font-weight: bold; }
          .different { color: #ff9800; font-weight: bold; }
          .major-diff { color: #d32f2f; font-weight: bold; }
          .summary { background-color: #f5f5f5; padding: 15px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>مقارنة نتائج المذاهب الفقهية</h1>
        <p>تاريخ التقرير: ${new Date().toLocaleDateString("en-US")}</p>
        
        <h2>المذهب الأساسي: ${baseline.madhhabName}</h2>
        <p>إجمالي التركة: ${baseline.shares.reduce((s, sh) => s + sh.amount, 0).toFixed(2)} ر.س</p>
    `;

      comparisons.forEach((comp) => {
        html += `
        <h3>المقارنة مع: ${comp.madhhabName}</h3>
        <div class="summary">
          <p>إجمالي التركة: ${comp.totalAmount.toFixed(2)} ر.س</p>
          <p>حالة المقارنة: ${
            comp.summary.isIdentical
              ? '<span class="identical">✓ متطابقة</span>'
              : '<span class="different">⚠️ مختلفة</span>'
          }</p>
          ${comp.summary.recommendation ? `<p>توصية: ${comp.summary.recommendation}</p>` : ""}
        </div>
      `;

        if (comp.differences.length > 0) {
          html += `
          <h4>الاختلافات:</h4>
          <table>
            <tr>
              <th>الوارث</th>
              <th>الفرق (ر.س)</th>
              <th>الفرق (%)</th>
              <th>التفسير</th>
            </tr>
        `;

          comp.differences.forEach((diff) => {
            const diffClass =
              Math.abs(diff.percentageDiff) > 10 ? "major-diff" : "different";
            html += `
            <tr>
              <td>${diff.heirName}</td>
              <td class="${diffClass}">${diff.amountDiff > 0 ? "+" : ""}${diff.amountDiff.toFixed(2)}</td>
              <td class="${diffClass}">${diff.percentageDiff > 0 ? "+" : ""}${diff.percentageDiff.toFixed(1)}%</td>
              <td>${diff.explanation}</td>
            </tr>
          `;
          });

          html += `</table>`;
        } else {
          html += `<p class="identical">✓ لا توجد اختلافات في توزيع الورثة</p>`;
        }
      });

      html += `
        <div class="summary">
          <p><strong>ملخص عام:</strong></p>
          <p>تمت مقارنة ${comparisons.length + 1} مذاهب</p>
          <p>${comparisons.filter((c) => c.summary.isIdentical).length} مذاهب متطابقة مع الأساسي</p>
          <p>${comparisons.filter((c) => !c.summary.isIdentical && c.summary.majorDifferences === 0).length} مذاهب باختلافات طفيفة</p>
          <p>${comparisons.filter((c) => c.summary.majorDifferences > 0).length} مذاهب باختلافات جوهرية</p>
        </div>
      </body>
      </html>
    `;

      return html;
    },
    [currentResult],
  );

  /**
   * Get comparison statistics
   */
  const getComparisonStats = useCallback((): ComparisonStats => {
    if (previousResults.length === 0) {
      return {
        totalComparisons: 0,
        mostCommonMadhab: null,
        averageDifferences: 0,
        madhabAgreement: {
          shafii: 0,
          hanafi: 0,
          maliki: 0,
          hanbali: 0,
        },
      };
    }

    const madhabCount: Record<MadhhabType, number> = {
      shafii: 0,
      hanafi: 0,
      maliki: 0,
      hanbali: 0,
    };

    previousResults.forEach((r) => {
      madhabCount[r.madhab] = (madhabCount[r.madhab] || 0) + 1;
    });

    const mostCommonMadhab =
      (Object.entries(madhabCount).sort(
        ([, a], [, b]) => b - a,
      )[0]?.[0] as MadhhabType) || null;

    // Calculate average differences between consecutive results
    let totalDifferences = 0;
    let comparisonCount = 0;

    for (let i = 0; i < previousResults.length - 1; i++) {
      const comparisons = compareMadhhabs([
        previousResults[i],
        previousResults[i + 1],
      ]);
      if (comparisons.length > 0) {
        totalDifferences += comparisons[0].differences.length;
        comparisonCount++;
      }
    }

    const averageDifferences =
      comparisonCount > 0 ? totalDifferences / comparisonCount : 0;

    return {
      totalComparisons: previousResults.length,
      mostCommonMadhab,
      averageDifferences,
      madhabAgreement: madhabCount,
    };
  }, [previousResults, compareMadhhabs]);

  const getResultsStats = useCallback(() => {
    return {
      totalResults: previousResults.length,
      currentResult,
      previousResults,
      comparisonMode,
      comparisonResults,
      comparisons:
        currentResult && previousResults.length > 1
          ? compareWithPrevious(currentResult)
          : [],
      stats: getComparisonStats(),
    };
  }, [
    currentResult,
    previousResults,
    comparisonMode,
    comparisonResults,
    compareWithPrevious,
    getComparisonStats,
  ]);

  const getAverageResult = useCallback(() => {
    if (previousResults.length === 0) return null;

    const totalAmount = previousResults.reduce(
      (sum, r) => sum + r.shares.reduce((s, share) => s + share.amount, 0),
      0,
    );
    const avgAmount = totalAmount / previousResults.length;

    return {
      count: previousResults.length,
      averageAmount: avgAmount,
      mostUsedMadhab: getComparisonStats().mostCommonMadhab,
    };
  }, [previousResults, getComparisonStats]);

  return {
    currentResult,
    previousResults,
    comparisonMode,
    comparisonResults,
    saveResult,
    clearResults,
    compareMadhhabs,
    compareWithPrevious,
    compareSpecific,
    generateComparisonReport,
    getComparisonStats,
    getResultsStats,
    getAverageResult,
    setComparisonMode,
    setComparisonResults,
  };
}

// ============================================================================
// Helper Types for Comparison Feature
// ============================================================================

export interface ComparisonStats {
  totalComparisons: number;
  mostCommonMadhab: MadhhabType | null;
  averageDifferences: number;
  madhabAgreement: Record<MadhhabType, number>;
}

// Helper function to generate explanations for differences
function generateDifferenceExplanation(
  heirKey: string,
  madhab1: MadhhabType,
  madhab2: MadhhabType,
  amountDiff: number,
): string {
  const explanations: Record<string, string> = {
    grandfather: "الجد مع الإخوة - يختلف بين المذاهب",
    mother: "الأم مع الأب والزوج - العمرية",
    granddaughter: "بنت الابن مع البنات",
    full_sister: "الأخت الشقيقة مع الإخوة",
    paternal_sister: "الأخت لأب مع الأخوات",
  };

  return explanations[heirKey] || "اختلاف في قواعد المذهب";
}

// ============================================================================
// 4. useMadhab Hook - إدارة اختيار المذهب
// ============================================================================

export function useMadhab(defaultMadhab: MadhhabType = "shafii") {
  const [madhab, setMadhab] = useState<MadhhabType>(defaultMadhab);
  const [madhabs] = useState<MadhhabType[]>([
    "shafii",
    "hanafi",
    "maliki",
    "hanbali",
  ]);

  const changeMadhab = useCallback(
    (newMadhab: MadhhabType) => {
      if (madhabs.includes(newMadhab)) {
        setMadhab(newMadhab);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("selectedMadhab", newMadhab);
          } catch (err) {
            console.warn("لا يمكن حفظ المذهب في التخزين المحلي:", err);
          }
        }
        return true;
      }
      return false;
    },
    [madhabs],
  );

  const loadSavedMadhab = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("selectedMadhab") as MadhhabType;
        if (saved && madhabs.includes(saved)) {
          setMadhab(saved);
          return saved;
        }
      } catch (err) {
        console.warn("لا يمكن تحميل المذهب المحفوظ:", err);
      }
    }
    return madhab;
  }, [madhabs, madhab]);

  const getMadhhabInfo = useCallback(() => {
    const info: Record<MadhhabType, string> = {
      shafii: "الشافعي",
      hanafi: "الحنفي",
      maliki: "المالكي",
      hanbali: "الحنبلي",
    };
    return info[madhab];
  }, [madhab]);

  const getMadhhabsList = useCallback(() => {
    const list: Record<MadhhabType, string> = {
      shafii: "المذهب الشافعي",
      hanafi: "المذهب الحنفي",
      maliki: "المذهب المالكي",
      hanbali: "المذهب الحنبلي",
    };
    return Object.entries(list).map(([value, label]) => ({
      value: value as MadhhabType,
      label,
    }));
  }, []);

  return {
    madhab,
    madhabs,
    changeMadhab,
    loadSavedMadhab,
    getMadhhabInfo,
    getMadhhabsList,
  };
}

// ============================================================================
// 5. useHeirs Hook - إدارة الورثة ديناميكياً مع منع التكرار
// ============================================================================

export function useHeirs(initialHeirs: HeirsData = {}) {
  const [heirs, setHeirs] = useState<
    Array<{ id: string; key: HeirType; count: number }>
  >(
    Object.entries(initialHeirs).map(([key, count]) => ({
      id: `heir-${key}`,
      key: key as HeirType,
      count: count || 0,
    })),
  );
  const [error, setError] = useState<string | null>(null);

  const addHeir = useCallback(
    (heir: {
      type: string;
      gender: "male" | "female";
      count: number;
      relation?: string;
    }) => {
      try {
        if (!heir.type || heir.type.trim() === "") {
          throw new Error("نوع الوارث مطلوب");
        }

        if (heir.count < 1) {
          throw new Error("عدد الورثة يجب أن يكون 1 على الأقل");
        }

        // FIX: Check for duplicate heir type
        const isDuplicate = heirs.some((h) => h.key === heir.type);
        if (isDuplicate) {
          throw new Error("هذا الوارث موجود بالفعل");
        }

        setHeirs((prev) => [
          ...prev,
          {
            id: `heir-${Date.now()}`,
            key: heir.type as HeirType,
            count: heir.count,
          },
        ]);
        setError(null);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "خطأ غير معروف";
        setError(msg);
        return false;
      }
    },
    [heirs],
  );

  const updateHeir = useCallback((id: string, updates: { count?: number }) => {
    try {
      setHeirs((prev) =>
        prev.map((h) => (h.id === id ? { ...h, ...updates } : h)),
      );
      setError(null);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "خطأ غير معروف";
      setError(msg);
      return false;
    }
  }, []);

  const removeHeir = useCallback(
    (id: string) => {
      try {
        const newHeirs = heirs.filter((h) => h.id !== id);
        if (newHeirs.length === 0) {
          throw new Error("يجب الاحتفاظ بوارث واحد على الأقل");
        }
        setHeirs(newHeirs);
        setError(null);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "خطأ غير معروف";
        setError(msg);
        return false;
      }
    },
    [heirs],
  );

  const clearHeirs = useCallback(() => {
    setHeirs([]);
    setError(null);
  }, []);

  const validateHeirs = useCallback(() => {
    if (heirs.length === 0) {
      setError("يجب تحديد ورثة واحد على الأقل");
      return false;
    }

    const totalCount = heirs.reduce((sum, h) => sum + h.count, 0);
    if (totalCount === 0) {
      setError("يجب أن يكون هناك ورثة واحد على الأقل");
      return false;
    }

    setError(null);
    return true;
  }, [heirs]);

  const getHeirsStats = useCallback(() => {
    const stats = {
      totalCount: heirs.reduce((sum, h) => sum + h.count, 0),
      totalTypes: heirs.length,
      byGender: {
        male: 0,
        female: 0,
      },
      byType: {} as Record<HeirType, number>,
    };

    heirs.forEach((heir) => {
      stats.byType[heir.key] = (stats.byType[heir.key] || 0) + 1;
    });

    return stats;
  }, [heirs]);

  return {
    heirs,
    error,
    addHeir,
    updateHeir,
    removeHeir,
    clearHeirs,
    validateHeirs,
    getHeirsStats,
  };
}

// ============================================================================
// Debounce utility function (moved here for completeness)
// ============================================================================
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export default {
  useCalculator,
  useAuditLog,
  useResults,
  useMadhab,
  useHeirs,
};
