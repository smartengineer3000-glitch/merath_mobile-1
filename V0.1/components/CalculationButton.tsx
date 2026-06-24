/**
 * @file CalculationButton.tsx
 * @description زر تنفيذ الحساب
 * Calculation Button Component for Phase 5
 *
 * زر تشغيل حساب الميراث مع عرض حالة التحميل
 *
 * FIXES:
 * - H4 (🟠): Loading indicator during PDF generation
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import { useCalculator } from "../lib/inheritance/hooks";
import { MadhhabType, HeirsData, EstateData } from "../lib/inheritance/types";
import { PDFExporter } from "../lib/export/PDFExporter";
import { ErrorLogger } from "../lib/errors/ErrorHandler";
import { useAppTheme } from "../lib/context/ThemeProvider";
import type { Theme } from "../lib/design/theme";

export interface CalculationButtonProps {
  madhab: MadhhabType;
  heirs: HeirsData;
  estate: EstateData;
  onCalculationComplete?: (success: boolean, error?: string) => void;
  onPDFExport?: (success: boolean, error?: string) => void;
  disabled?: boolean;
  showPDFButton?: boolean;
}

// ===== FIX H4: Loading states for different operations =====
type LoadingState =
  | "idle"
  | "calculating"
  | "pdf_generating"
  | "pdf_sharing"
  | "error";

export function CalculationButton({
  madhab,
  heirs,
  estate,
  onCalculationComplete,
  onPDFExport,
  disabled = false,
  showPDFButton = true,
}: CalculationButtonProps) {
  const { theme } = useAppTheme();
  const { calculateWithMethod, result, error } = useCalculator();
  const [localError, setLocalError] = useState<string | null>(null);

  // ===== FIX H4: Enhanced loading state =====
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [pdfProgress, setPdfProgress] = useState(0);

  // ===== FIX H4: Animation for PDF progress =====
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // ===== FIX H4: Animate progress bar =====
  useEffect(() => {
    if (loadingState === "pdf_generating") {
      // Simulate progress (actual progress is hard to track)
      const interval = setInterval(() => {
        setPdfProgress((prev) => {
          const newProgress = prev + 0.1;
          if (newProgress >= 0.9) {
            clearInterval(interval);
            return 0.9; // Never reach 100% until complete
          }
          return newProgress;
        });
      }, 200);

      Animated.timing(progressAnim, {
        toValue: 0.9,
        duration: 2000,
        useNativeDriver: false,
      }).start();

      return () => clearInterval(interval);
    } else {
      setPdfProgress(0);
      progressAnim.setValue(0);
    }
  }, [loadingState, progressAnim]);

  // ===== FIX H4: Fade animation for loading states =====
  useEffect(() => {
    if (loadingState !== "idle") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.7,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      fadeAnim.setValue(1);
    }
  }, [loadingState, fadeAnim]);

  const handleCalculate = useCallback(async () => {
    try {
      setLocalError(null);
      setLoadingState("calculating");

      // التحقق من صحة البيانات
      if (!madhab) {
        const msg = "يجب اختيار المذهب الفقهي أولاً";
        setLocalError(msg);
        setLoadingState("error");
        Alert.alert("تحقق من البيانات", msg, [{ text: "حسناً" }]);
        onCalculationComplete?.(false, msg);
        return;
      }

      const heirsCount = Object.values(heirs || {}).reduce(
        (s: number, v) => s + (v || 0),
        0,
      );
      if (heirsCount === 0) {
        const msg = "يجب إضافة واحد على الأقل من الورثة";
        setLocalError(msg);
        setLoadingState("error");
        Alert.alert(
          "المزيد من المعلومات مطلوبة",
          msg + '\n\nتأكد من إضافة جميع الورثة في قسم "إضافة الوارثون"',
          [{ text: "حسناً" }],
        );
        onCalculationComplete?.(false, msg);
        return;
      }

      if (estate.total <= 0) {
        const msg = "قيمة التركة يجب أن تكون أكبر من صفر";
        setLocalError(msg);
        setLoadingState("error");
        Alert.alert(
          "بيانات غير صحيحة",
          msg + '\n\nأدخل المبلغ الإجمالي للتركة في قسم "بيانات التركة"',
          [{ text: "حسناً" }],
        );
        onCalculationComplete?.(false, msg);
        return;
      }

      // تنفيذ الحساب
      const result = await calculateWithMethod(madhab, heirs);
      if (result && result.success) {
        setLoadingState("idle");
        Alert.alert(
          "نجح الحساب",
          "تم حساب توزيع الميراث بنجاح. انظر النتائج أدناه.",
          [{ text: "حسناً" }],
        );
        onCalculationComplete?.(true);
      } else {
        const errorMsg = result?.error || "فشل الحساب";
        setLocalError(errorMsg);
        setLoadingState("error");
        Alert.alert("خطأ في الحساب", errorMsg, [{ text: "حسناً" }]);
        onCalculationComplete?.(false, errorMsg);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "حدث خطأ غير متوقع في الحساب";
      setLocalError(errorMessage);
      setLoadingState("error");
      Alert.alert("خطأ", errorMessage, [{ text: "حسناً" }]);
      onCalculationComplete?.(false, errorMessage);
    }
  }, [madhab, heirs, estate, calculateWithMethod, onCalculationComplete]);

  // ===== FIX H4: PDF Export handler with loading state =====
  const handlePDFExport = useCallback(async () => {
    if (!result || !result.success) {
      Alert.alert("تنبيه", "لا توجد نتائج للتصدير. قم بالحساب أولاً.");
      return;
    }

    try {
      setLoadingState("pdf_generating");
      setLocalError(null);

      const timestamp = new Date()
        .toLocaleDateString("ar-SA")
        .replace(/\//g, "-");
      const filename = `تقرير-التركة-${timestamp}`;

      // Start PDF generation
      setLoadingState("pdf_generating");

      await PDFExporter.generateAndShare(result, {
        filename,
        includeCalculationSteps: true,
        theme: "light",
      });

      setLoadingState("pdf_sharing");

      // Short delay to show sharing state
      setTimeout(() => {
        setLoadingState("idle");
        setPdfProgress(0);
      }, 1000);

      onPDFExport?.(true);

      ErrorLogger.logError(
        "PDF_EXPORT_SUCCESS",
        `PDF exported successfully for madhab: ${result.madhhabName}`,
        "تم تصدير التقرير بنجاح",
        "info",
        { madhab: result.madhhabName },
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "فشل في تصدير PDF";
      setLocalError(errorMessage);
      setLoadingState("error");

      ErrorLogger.logError(
        "PDF_EXPORT_ERROR",
        errorMessage,
        "حدث خطأ أثناء تصدير التقرير",
        "error",
        { madhab: result?.madhhabName },
      );

      Alert.alert("خطأ في التصدير", errorMessage, [
        { text: "حسناً", onPress: () => setLoadingState("idle") },
      ]);

      onPDFExport?.(false, errorMessage);
    }
  }, [result, onPDFExport]);

  const heirsCountForDisable = Object.values(heirs || {}).reduce(
    (s: number, v) => s + (v || 0),
    0,
  );
  const isDisabled =
    disabled ||
    heirsCountForDisable === 0 ||
    estate.total <= 0 ||
    loadingState !== "idle";
  const currentError = localError || error;
  const hasValidHeirs = heirsCountForDisable > 0;
  const hasValidEstate = estate.total > 0;
  const styles = createStyles(theme);

  // ===== FIX H4: Get loading message based on state =====
  const getLoadingMessage = () => {
    switch (loadingState) {
      case "calculating":
        return "جاري الحساب...";
      case "pdf_generating":
        return "جاري إنشاء PDF...";
      case "pdf_sharing":
        return "جاري فتح المشاركة...";
      default:
        return "جاري التحميل...";
    }
  };

  // ===== FIX H4: Get loading icon based on state =====
  const getLoadingIcon = () => {
    switch (loadingState) {
      case "calculating":
        return "🧮";
      case "pdf_generating":
        return "📄";
      case "pdf_sharing":
        return "📤";
      default:
        return "⏳";
    }
  };

  return (
    <View style={styles.container}>
      {/* تحذيرات الحقول المفقودة */}
      {!hasValidEstate && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ أدخل مبلغ التركة الإجمالي أولاً
          </Text>
        </View>
      )}
      {!hasValidHeirs && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>⚠️ أضف وارثاً واحداً على الأقل</Text>
        </View>
      )}

      {/* ===== FIX H4: Main calculation button with enhanced loading ===== */}
      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={handleCalculate}
        disabled={isDisabled}
      >
        {loadingState !== "idle" ? (
          <Animated.View
            style={[styles.loadingContainer, { opacity: fadeAnim }]}
          >
            <Text style={styles.loadingIcon}>{getLoadingIcon()}</Text>
            <ActivityIndicator
              size="small"
              color={theme.colors.background.light}
              style={styles.spinner}
            />
            <Text style={styles.buttonText}>{getLoadingMessage()}</Text>
          </Animated.View>
        ) : (
          <Text
            style={[styles.buttonText, isDisabled && styles.buttonTextDisabled]}
          >
            {isDisabled ? "يرجى ملء البيانات أولاً" : "حساب الميراث"}
          </Text>
        )}
      </TouchableOpacity>

      {/* ===== FIX H4: PDF Export button with progress bar ===== */}
      {showPDFButton && result && result.success && loadingState === "idle" && (
        <TouchableOpacity
          style={styles.pdfButton}
          onPress={handlePDFExport}
          activeOpacity={0.7}
        >
          <Text style={styles.pdfButtonIcon}>📄</Text>
          <Text style={styles.pdfButtonText}>تصدير PDF</Text>
        </TouchableOpacity>
      )}

      {/* ===== FIX H4: PDF Progress bar ===== */}
      {loadingState === "pdf_generating" && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>جاري إنشاء PDF...</Text>
            <Text style={styles.progressPercentage}>
              {Math.round(pdfProgress * 100)}%
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressHint}>قد يستغرق هذا بضع ثوانٍ</Text>
        </View>
      )}

      {/* ===== FIX H4: Sharing indicator ===== */}
      {loadingState === "pdf_sharing" && (
        <View style={styles.sharingContainer}>
          <ActivityIndicator size="small" color={theme.colors.info.main} />
          <Text style={styles.sharingText}>جاري فتح المشاركة...</Text>
        </View>
      )}

      {/* رسالة الخطأ */}
      {currentError && loadingState === "error" && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorText}>{currentError}</Text>
          <TouchableOpacity
            style={styles.errorDismiss}
            onPress={() => setLoadingState("idle")}
          >
            <Text style={styles.errorDismissText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* رسالة النجاح */}
      {result && result.success && loadingState === "idle" && (
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successText}>تم الحساب بنجاح</Text>
        </View>
      )}

      {/* معلومات الحساب */}
      {result && (
        <View style={styles.resultInfo}>
          <Text style={styles.resultInfoTitle}>معلومات الحساب:</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>الحالة:</Text>
            <Text
              style={[
                styles.resultValue,
                result.success ? styles.successValue : styles.errorValue,
              ]}
            >
              {result.success ? "نجح" : "فشل"}
            </Text>
          </View>
          {result.calculationTime && (
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>وقت الحساب:</Text>
              <Text style={styles.resultValue}>
                {result.calculationTime.toFixed(0)}ms
              </Text>
            </View>
          )}
          {result.error && (
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>الخطأ:</Text>
              <Text style={styles.resultValue}>{result.error}</Text>
            </View>
          )}
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>المذهب:</Text>
            <Text style={styles.resultValue}>{result.madhab}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    button: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.primary.main,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 48,
      shadowColor: theme.colors.primary.main,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    buttonDisabled: {
      backgroundColor: theme.colors.neutral.light300,
      shadowColor: "transparent",
      shadowOpacity: 0,
      elevation: 0,
      opacity: 1,
    },
    buttonText: {
      color: theme.colors.background.light,
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
    buttonTextDisabled: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.neutral.main,
    },
    pdfButton: {
      marginTop: 10,
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.success.main,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
      shadowColor: theme.colors.success.main,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    pdfButtonIcon: {
      fontSize: 16,
      color: theme.colors.background.light,
    },
    pdfButtonText: {
      color: theme.colors.background.light,
      fontSize: 14,
      fontWeight: "600",
    },
    progressContainer: {
      marginTop: 12,
      padding: 12,
      backgroundColor: theme.colors.info.light,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.info.main,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    progressTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.info.dark,
    },
    progressPercentage: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.info.main,
    },
    progressBarBackground: {
      height: 6,
      backgroundColor: theme.colors.info.light,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.info.main,
      borderRadius: 3,
    },
    progressHint: {
      fontSize: 10,
      color: theme.colors.neutral.main,
      textAlign: "center",
      marginTop: 6,
    },
    sharingContainer: {
      marginTop: 12,
      padding: 10,
      backgroundColor: theme.colors.info.light,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderWidth: 1,
      borderColor: theme.colors.info.main,
    },
    sharingText: {
      fontSize: 12,
      color: theme.colors.info.dark,
      fontWeight: "500",
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    loadingIcon: {
      fontSize: 16,
      color: theme.colors.background.light,
    },
    spinner: {
      marginHorizontal: 4,
    },
    warningBox: {
      backgroundColor: theme.colors.warning.light,
      borderLeftWidth: 2,
      borderLeftColor: theme.colors.warning.main,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      marginBottom: 12,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      shadowColor: theme.colors.warning.main,
      shadowOffset: { width: -2, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    warningText: {
      color: theme.colors.warning.dark,
      fontSize: 13,
      fontWeight: "500",
      textAlign: "right",
    },
    errorContainer: {
      marginTop: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.error.light,
      borderRadius: 8,
      borderLeftWidth: 2,
      borderLeftColor: theme.colors.error.dark,
      shadowColor: theme.colors.error.dark,
      shadowOffset: { width: -2, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    errorIcon: {
      fontSize: 16,
      marginRight: 8,
    },
    errorText: {
      fontSize: 13,
      color: theme.colors.error.dark,
      fontWeight: "500",
      textAlign: "right",
      flex: 1,
    },
    errorDismiss: {
      padding: 4,
      marginLeft: 8,
    },
    errorDismissText: {
      fontSize: 14,
      color: theme.colors.error.dark,
      fontWeight: "bold",
    },
    successContainer: {
      marginTop: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.success.light,
      borderRadius: 8,
      borderLeftWidth: 2,
      borderLeftColor: theme.colors.success.main,
      shadowColor: theme.colors.success.main,
      shadowOffset: { width: -2, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    successIcon: {
      fontSize: 16,
      color: theme.colors.success.dark,
      marginRight: 8,
    },
    successText: {
      fontSize: 13,
      color: theme.colors.success.dark,
      fontWeight: "600",
      textAlign: "right",
    },
    resultInfo: {
      marginTop: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.neutral.light100,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
    },
    resultInfoTitle: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.neutral.dark300,
      marginBottom: 8,
      textAlign: "right",
    },
    resultRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 6,
      paddingVertical: 4,
    },
    resultLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: theme.colors.neutral.main,
    },
    resultValue: {
      fontSize: 12,
      color: theme.colors.neutral.dark300,
      fontWeight: "600",
    },
    successValue: {
      color: theme.colors.success.dark,
    },
    errorValue: {
      color: theme.colors.error.dark,
    },
  });

export default CalculationButton;
