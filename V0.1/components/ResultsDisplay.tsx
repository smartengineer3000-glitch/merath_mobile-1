/**
 * @file ResultsDisplay.tsx
 * @description عرض النتائج والتوزيع مع مشاركة متقدمة ورسوم متحركة
 * Results Display Component with Comprehensive Sharing and Animations
 *
 * FIXES:
 * - M6 (🟡): Share preview before sharing
 * - L2 (🔵): Results counting animation
 * HIGH PRIORITY FIXES:
 * - Issue 4: Table responsiveness (card layout <360px)
 * - Issue 5: Percentage rounding (largest remainder method)
 */

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Share,
  Platform,
  Clipboard,
  Modal,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "../lib/icons";
import { PressableScale } from "./ui/PressableScale";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import ViewShot from "react-native-view-shot";
import {
  useResults,
  useCalculator,
  type ComparisonResult,
} from "../lib/inheritance/hooks";
import { useAppTheme } from "../lib/context/ThemeProvider";
import type {
  CalculationResult,
  CalculationStep,
} from "../lib/inheritance/types";
import type { Theme } from "../lib/design/theme";
import { PDFExporter } from "../lib/export/PDFExporter";
import { ErrorLogger } from "../lib/errors/ErrorHandler";
import {
  formatCurrency,
  formatPercentage,
  calculatePercentagesLargestRemainder,
} from "../lib/utils/formatters";

export interface ResultsDisplayProps {
  result?: CalculationResult | null;
  onClose?: () => void;
}

type ShareFormat = "pdf" | "text" | "image" | "clipboard";
type ShareStatus = "idle" | "generating" | "sharing" | "success" | "error";

// ===== FIX L2: Animated number component =====
const AnimatedNumber = ({
  value,
  duration = 1000,
  format = true,
}: {
  value: number;
  duration?: number;
  format?: boolean;
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<Animated.Value>(new Animated.Value(0));
  const previousValueRef = useRef(0);
  const displayValueRef = useRef(0);

  useEffect(() => {
    if (value === displayValueRef.current) return;

    const animation = animationRef.current;

    animation.stopAnimation();
    animation.setValue(0);

    const startValue = previousValueRef.current;

    Animated.timing(animation, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        previousValueRef.current = value;
        displayValueRef.current = value;
        setDisplayValue(value);
      }
    });

    const listener = animation.addListener(({ value: progress }) => {
      const newValue = startValue + (value - startValue) * progress;
      displayValueRef.current = newValue;
      setDisplayValue(newValue);
    });

    return () => {
      animation.removeListener(listener);
    };
  }, [value, duration]);

  const formattedValue = format
    ? displayValue
        .toFixed(2)
        .replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)] || d)
    : Math.round(displayValue)
        .toString()
        .replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)] || d);

  return <Text>{formattedValue}</Text>;
};

// ===== FIX M6: Share preview modal =====
const SharePreviewModal = ({
  visible,
  onClose,
  onConfirm,
  result,
  format,
  previewHTML,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  result: CalculationResult;
  format: ShareFormat;
  previewHTML: string;
}) => {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { width } = Dimensions.get("window");
  const isNarrowScreen = width < 360;

  const getFormatIcon = () => {
    switch (format) {
      case "pdf":
        return "file-pdf-box";
      case "image":
        return "image";
      case "text":
        return "text";
      case "clipboard":
        return "content-copy";
      default:
        return "share";
    }
  };

  const getFormatName = () => {
    switch (format) {
      case "pdf":
        return t("results.shareFormat.pdf");
      case "image":
        return t("results.shareFormat.image");
      case "text":
        return t("results.shareFormat.text");
      case "clipboard":
        return t("results.shareFormat.clipboard");
      default:
        return t("calculator.share");
    }
  };

  const styles = createStyles(theme, isNarrowScreen);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.previewOverlay}>
        <View
          style={[
            styles.previewContent,
            { backgroundColor: theme.colors.background.light },
          ]}
        >
          <View style={styles.previewHeader}>
            <View style={styles.previewHeaderLeft}>
              <MaterialCommunityIcons
                name={getFormatIcon()}
                size={24}
                color={theme.colors.primary.main}
              />
              <Text style={styles.previewTitle}>
                {t("results.previewTitle", { format: getFormatName() })}
              </Text>
            </View>
            <PressableScale onPress={onClose} haptic="light" scaleTo={0.88}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.neutral.main}
              />
            </PressableScale>
          </View>

          <ScrollView style={styles.previewScroll}>
            {format === "pdf" ? (
              <View style={styles.previewHTML}>
                <Text style={styles.previewHTMLText}>
                  {previewHTML.substring(0, 500)}...
                </Text>
              </View>
            ) : format === "image" ? (
              <View style={styles.previewImagePlaceholder}>
                <MaterialCommunityIcons
                  name="image"
                  size={48}
                  color={theme.colors.neutral.light300}
                />
                <Text style={styles.previewImageText}>
                  {t("results.previewImage")}
                </Text>
              </View>
            ) : (
              <View style={styles.previewText}>
                <Text style={styles.previewTextContent}>{previewHTML}</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.previewActions}>
            <PressableScale
              style={[styles.previewButton, styles.previewCancelButton]}
              onPress={onClose}
              haptic="light"
              scaleTo={0.95}
            >
              <Text style={styles.previewCancelText}>{t("common.cancel")}</Text>
            </PressableScale>
            <PressableScale
              style={[
                styles.previewButton,
                styles.previewConfirmButton,
                { backgroundColor: theme.colors.primary.main },
              ]}
              onPress={onConfirm}
              haptic="medium"
              scaleTo={0.95}
            >
              <Text style={styles.previewConfirmText}>
                {t("calculator.share")}
              </Text>
            </PressableScale>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export function ResultsDisplay({ result, onClose }: ResultsDisplayProps) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { width } = Dimensions.get("window");
  const isNarrowScreen = width < 360;
  const styles = createStyles(theme, isNarrowScreen);
  const viewShotRef = useRef<ViewShot>(null);
  const hooksResults = useResults();
  const calculator = useCalculator();
  const results = useMemo(
    () => hooksResults?.previousResults || [],
    [hooksResults],
  );
  const [showComparison, setShowComparison] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState<number | null>(null);

  // Share states
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareFormat, setShareFormat] = useState<ShareFormat>("pdf");

  // ===== FIX M6: Preview state =====
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewHTML, setPreviewHTML] = useState("");

  // Export states
  const [, setExportLoading] = useState(false);
  const [madhabComparisonResults, setMadhabComparisonResults] = useState<
    ComparisonResult[]
  >([]);
  const [, setComparisonLoading] = useState(false);

  // ===== FIX L2: Animation values for counting =====
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [totalAmount, setTotalAmount] = useState(0);

  // Get comparison data from the enhanced hook
  const { comparisonResults, generateComparisonReport } = hooksResults;

  const activeComparisons =
    madhabComparisonResults.length > 0
      ? madhabComparisonResults
      : comparisonResults;
  const currentResult = result || calculator.result || results[0];
  const previousResults = results.slice(1, 4);

  // ===== FIX L2: Animate entrance =====
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // ===== FIX L2: Calculate total for animation =====
  useEffect(() => {
    if (currentResult?.success) {
      const total = currentResult.shares.reduce((sum, s) => sum + s.amount, 0);
      setTotalAmount(total);
    }
  }, [currentResult]);

  // ===== FIX Issue 5: Calculate percentages using largest remainder method =====
  const calculatedPercentages = useMemo(() => {
    if (!currentResult?.success || !currentResult.shares?.length) return [];

    const amounts = currentResult.shares.map((share) => share.amount);
    const percentages = calculatePercentagesLargestRemainder(amounts);

    return percentages;
  }, [currentResult]);

  const stats_data = useMemo(() => {
    return {
      totalResults: results ? results.length : 0,
      currentResult: 1,
      madhabs: {},
    };
  }, [results]);

  // Generate shareable text
  const generateShareText = useCallback(
    (result: CalculationResult, includeDetails: boolean = true): string => {
      const total = result.shares.reduce((sum, s) => sum + s.amount, 0);
      const date = new Date().toLocaleDateString("ar-SA");

      let text = `📊 *نتائج توزيع الميراث*\n`;
      text += `📅 التاريخ: ${date}\n`;
      text += `⚖️ المذهب: ${result.madhhabName}\n`;
      text += `💰 إجمالي التركة: ${total.toFixed(2)} ر.س\n`;
      text += `📈 مستوى الثقة: ${result.confidence}%\n\n`;

      if (includeDetails) {
        text += `*تفاصيل التوزيع:*\n`;
        text += `━━━━━━━━━━━━━━━━\n`;

        result.shares.forEach((share) => {
          const percentage = ((share.amount / total) * 100).toFixed(1);
          text += `${share.name}: ${share.amount.toFixed(2)} ر.س (${percentage}%)\n`;
        });

        text += `━━━━━━━━━━━━━━━━\n`;

        // Add special cases if any
        if (result.awlApplied || result.raddApplied) {
          text += `\n*حالات خاصة:*\n`;
          if (result.awlApplied) text += `• تم تطبيق العول\n`;
          if (result.raddApplied) text += `• تم تطبيق الرد\n`;
        }

        if (result.blockedHeirs && result.blockedHeirs.length > 0) {
          text += `\n*المحجوبون:*\n`;
          result.blockedHeirs.forEach((heir) => {
            text += `• ${heir}\n`;
          });
        }
      }

      text += `\nتم بواسطة تطبيق حاسبة المواريث الشرعية`;
      return text;
    },
    [],
  );

  // Generate HTML for rich sharing
  const generateShareHTML = useCallback((result: CalculationResult): string => {
    const total = result.shares.reduce((sum, s) => sum + s.amount, 0);
    const date = new Date().toLocaleDateString("ar-SA");

    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #2e7d32 0%, #4f9eff 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .card {
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2e7d32;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #2e7d32;
            font-size: 24px;
            margin: 0;
          }
          .header h2 {
            color: #666;
            font-size: 14px;
            margin: 5px 0 0;
            font-weight: normal;
          }
          .badge {
            background: #2e7d32;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            display: inline-block;
            margin-bottom: 10px;
          }
          .info-grid {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            padding: 15px;
            background: #f7f9fc;
            border-radius: 15px;
          }
          .info-item {
            text-align: center;
          }
          .info-label {
            color: #666;
            font-size: 12px;
            margin-bottom: 5px;
          }
          .info-value {
            color: #333;
            font-size: 18px;
            font-weight: bold;
          }
          .table {
            margin: 20px 0;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
          }
          .table-header {
            background: #2e7d32;
            color: white;
            padding: 12px;
            display: flex;
            font-weight: bold;
          }
          .table-row {
            display: flex;
            padding: 12px;
            border-bottom: 1px solid #e0e0e0;
          }
          .table-row:last-child {
            border-bottom: none;
          }
          .table-cell {
            flex: 1;
            text-align: center;
          }
          .special-cases {
            background: #fff3e0;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="badge">${result.madhhabName}</span>
            <h1>نتائج توزيع الميراث</h1>
            <h2>${date}</h2>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">إجمالي التركة</div>
              <div class="info-value">${total.toFixed(2)} ر.س</div>
            </div>
            <div class="info-item">
              <div class="info-label">مستوى الثقة</div>
              <div class="info-value">${result.confidence}%</div>
            </div>
            <div class="info-item">
              <div class="info-label">عدد الورثة</div>
              <div class="info-value">${result.shares.length}</div>
            </div>
          </div>
          
          <div class="table">
            <div class="table-header">
              <div class="table-cell">الوارث</div>
              <div class="table-cell">المبلغ</div>
              <div class="table-cell">النسبة</div>
            </div>
            ${result.shares
              .map(
                (share) => `
              <div class="table-row">
                <div class="table-cell">${share.name}</div>
                <div class="table-cell">${share.amount.toFixed(2)} ر.س</div>
                <div class="table-cell">${((share.amount / total) * 100).toFixed(1)}%</div>
              </div>
            `,
              )
              .join("")}
          </div>
          
          ${
            result.awlApplied ||
            result.raddApplied ||
            (result.blockedHeirs && result.blockedHeirs.length > 0)
              ? `
            <div class="special-cases">
              <h3 style="margin:0 0 10px; color:#f57c00;">حالات خاصة</h3>
              ${result.awlApplied ? "<p>✓ تم تطبيق العول</p>" : ""}
              ${result.raddApplied ? "<p>✓ تم تطبيق الرد</p>" : ""}
              ${
                result.blockedHeirs && result.blockedHeirs.length > 0
                  ? `
                <p style="margin-top:10px;"><strong>المحجوبون:</strong></p>
                ${result.blockedHeirs.map((heir) => `<p>• ${heir}</p>`).join("")}
              `
                  : ""
              }
            </div>
          `
              : ""
          }
          
          <div class="footer">
            تم بواسطة تطبيق حاسبة المواريث الشرعية
          </div>
        </div>
      </body>
      </html>
    `;
  }, []);

  // Share to clipboard
  const shareToClipboard = useCallback(async (text: string) => {
    try {
      await Clipboard.setString(text);
      Alert.alert("تم", "تم نسخ النتائج إلى الحافظة");
    } catch {
      throw new Error("فشل في النسخ إلى الحافظة");
    }
  }, []);

  // Share via native share dialog
  const shareViaNative = useCallback(
    async (content: string, type: "text" | "html") => {
      try {
        if (type === "html") {
          const fileName = `merath-${Date.now()}.html`;

          if (Platform.OS === "web") {
            const blob = new Blob([content], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            await Share.share({
              title: "نتائج الميراث",
              url: url,
            });
            return;
          }

          const documentDir = (
            FileSystem as unknown as { documentDirectory: string | null }
          ).documentDirectory;
          if (!documentDir) {
            throw new Error("لا يمكن الوصول إلى نظام الملفات");
          }

          const filePath = `${documentDir}${fileName}`;

          await FileSystem.writeAsStringAsync(filePath, content, {
            encoding: "utf8",
          });

          const isAvailable = await Sharing.isAvailableAsync();
          if (!isAvailable) {
            throw new Error("المشاركة غير متوفرة على هذا الجهاز");
          }

          await Sharing.shareAsync(filePath, {
            mimeType: "text/html",
            dialogTitle: "مشاركة نتائج الميراث",
          });
        } else {
          await Share.share({
            message: content,
            title: "نتائج توزيع الميراث",
          });
        }
      } catch (error) {
        console.error("Share error:", error);
        throw new Error("فشل في المشاركة");
      }
    },
    [],
  );

  // Capture view as image
  const captureAsImage = useCallback(async (): Promise<string> => {
    if (!viewShotRef.current) {
      throw new Error("ViewShot ref not available");
    }

    try {
      const captureMethod = (
        viewShotRef.current as unknown as { capture?: () => Promise<string> }
      ).capture;
      if (!captureMethod) {
        throw new Error("Capture method not available");
      }

      const uri = await captureMethod();
      return uri as string;
    } catch (error) {
      console.error("Capture error:", error);
      throw new Error("فشل في التقاط الصورة");
    }
  }, []);

  // Share as image
  const shareAsImage = useCallback(async () => {
    try {
      const uri = await captureAsImage();

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error("المشاركة غير متوفرة على هذا الجهاز");
      }

      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "مشاركة صورة النتائج",
      });
    } catch (error) {
      console.error("Image share error:", error);
      throw new Error("فشل في مشاركة الصورة");
    }
  }, [captureAsImage]);

  // ===== FIX M6: Show preview before sharing =====
  const showPreview = useCallback(
    (format: ShareFormat) => {
      if (!currentResult || !currentResult.success) {
        Alert.alert("خطأ", "لا توجد نتائج صحيحة للمشاركة");
        return;
      }

      let previewContent = "";
      switch (format) {
        case "text":
        case "clipboard":
          previewContent = generateShareText(currentResult, true);
          break;
        case "pdf":
        case "image":
          previewContent = generateShareHTML(currentResult);
          break;
      }

      setPreviewHTML(previewContent);
      setShareFormat(format);
      setPreviewVisible(true);
    },
    [currentResult, generateShareText, generateShareHTML],
  );

  // ===== FIX M6: Execute share after preview =====
  const executeShare = useCallback(async () => {
    setPreviewVisible(false);
    setShareModalVisible(false);

    setShareFormat(shareFormat);
    setShareStatus("generating");
    setShareError(null);

    try {
      switch (shareFormat) {
        case "text": {
          const text = generateShareText(currentResult!, true);
          await shareViaNative(text, "text");
          break;
        }
        case "clipboard": {
          const text = generateShareText(currentResult!, true);
          await shareToClipboard(text);
          break;
        }
        case "image": {
          await shareAsImage();
          break;
        }
        case "pdf": {
          setExportLoading(true);
          const timestamp = new Date().toLocaleDateString("ar-SA");
          const filename = `تقرير-التركة-${timestamp}`;

          await PDFExporter.generateAndShare(currentResult!, {
            filename,
            includeCalculationSteps: true,
            theme: "light",
          });

          ErrorLogger.logError(
            "PDF_EXPORT_SUCCESS",
            `PDF exported successfully for madhab: ${currentResult!.madhhabName}`,
            "تم تصدير التقرير بنجاح",
            "info",
            { madhab: currentResult!.madhhabName },
          );
          break;
        }
      }

      setShareStatus("success");
      setTimeout(() => {
        setShareStatus("idle");
      }, 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "فشل في المشاركة";
      setShareError(errorMessage);
      setShareStatus("error");

      ErrorLogger.logError(
        "SHARE_ERROR",
        errorMessage,
        "حدث خطأ أثناء المشاركة",
        "error",
        { format: shareFormat },
      );
    } finally {
      setExportLoading(false);
    }
  }, [
    shareFormat,
    currentResult,
    generateShareText,
    shareViaNative,
    shareToClipboard,
    shareAsImage,
  ]);

  // Handle PDF Export
  const handleExportComparison = useCallback(() => {
    if (!activeComparisons || activeComparisons.length === 0) {
      Alert.alert("تنبيه", "لا توجد نتائج مقارنة للتصدير");
      return;
    }

    generateComparisonReport(activeComparisons);
    Alert.alert("تم", "تقرير المقارنة جاهز للتصدير");
  }, [activeComparisons, generateComparisonReport]);

  if (!currentResult || !currentResult.success) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>{t("results.noResults")}</Text>
          <Text style={styles.emptyStateText}>
            {t("results.performCalculation")}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.9 }}>
      <Animated.ScrollView
        style={[styles.container, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ transform: [{ translateY: slideAnim }] }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.madhhabBadge}>
            <Text style={styles.madhhabBadgeText}>
              {currentResult.madhhabName}
            </Text>
          </View>
          <Text style={styles.title}>{t("results.title")}</Text>
          {currentResult.calculationTime && (
            <Text style={styles.calculationTime}>
              {t("results.calculationTime")}: {currentResult.calculationTime}ms
            </Text>
          )}

          {/* Share Button */}
          <PressableScale
            style={styles.headerShareButton}
            onPress={() => setShareModalVisible(true)}
            haptic="light"
            scaleTo={0.95}
            accessibilityLabel={t("calculator.share")}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons
              name="share"
              size={20}
              color={theme.colors.background.light}
            />
            <Text style={styles.headerShareText}>{t("calculator.share")}</Text>
          </PressableScale>
        </View>

        {/* Special Cases */}
        {currentResult.specialCases && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("results.specialCases")}</Text>
            <View style={styles.specialCases}>
              {currentResult.awlApplied && (
                <View style={styles.specialCaseItem}>
                  <Text style={styles.specialCaseLabel}>
                    {t("results.awl")}:
                  </Text>
                  <Text style={styles.specialCaseValue}>
                    {t("results.applied")}
                  </Text>
                </View>
              )}
              {currentResult.raddApplied && (
                <View style={styles.specialCaseItem}>
                  <Text style={styles.specialCaseLabel}>
                    {t("results.radd")}:
                  </Text>
                  <Text style={styles.specialCaseValue}>
                    {t("results.applied")}
                  </Text>
                </View>
              )}
              {currentResult.blockedHeirs &&
                currentResult.blockedHeirs.length > 0 && (
                  <View style={styles.hijabContainer}>
                    <Text style={styles.hijabLabel}>
                      {t("results.blockedHeirs")}:
                    </Text>
                    {currentResult.blockedHeirs.map(
                      (heir: string, idx: number) => (
                        <Text key={idx} style={styles.hijabType}>
                          • {heir}
                        </Text>
                      ),
                    )}
                  </View>
                )}
            </View>
          </View>
        )}

        {/* Distribution Table - Responsive Layout */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("results.distributionTable")}
          </Text>

          {isNarrowScreen ? (
            // Card layout for narrow screens
            <View style={styles.cardsContainer}>
              {currentResult.shares &&
                currentResult.shares.map(
                  (
                    share: CalculationResult["shares"][number],
                    index: number,
                  ) => {
                    const percentage = calculatedPercentages[index] || 0;

                    return (
                      <View key={index} style={styles.shareCard}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.cardHeirName}>{share.name}</Text>
                          <Text style={styles.cardPercentage}>
                            {formatPercentage(percentage)}
                          </Text>
                        </View>
                        <View style={styles.cardAmountRow}>
                          <Text style={styles.cardAmount}>
                            {formatCurrency(share.amount)} ر.س
                          </Text>
                        </View>
                      </View>
                    );
                  },
                )}
            </View>
          ) : (
            // Table layout for larger screens
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>
                  {t("results.amount")}
                </Text>
                <Text style={styles.tableHeaderCell}>
                  {t("results.fraction")}
                </Text>
                <Text style={styles.tableHeaderCell}>{t("results.heir")}</Text>
              </View>

              {/* Table Rows with Animated Numbers */}
              {currentResult.shares &&
                currentResult.shares.map(
                  (
                    share: CalculationResult["shares"][number],
                    index: number,
                  ) => {
                    const percentage = calculatedPercentages[index] || 0;

                    return (
                      <View
                        key={index}
                        style={[
                          styles.tableRow,
                          index % 2 === 0 && styles.tableRowAlternate,
                        ]}
                      >
                        <Text style={styles.tableCell}>
                          <AnimatedNumber value={share.amount} /> ر.س
                        </Text>
                        <Text style={styles.tableCell}>
                          <AnimatedNumber value={percentage} format={false} />%
                        </Text>
                        <Text style={styles.tableCell}>{share.name}</Text>
                      </View>
                    );
                  },
                )}

              {/* Total percentage footer */}
              <View style={styles.tableFooter}>
                <Text style={styles.tableFooterText}>
                  {t("results.total")}:{" "}
                  {formatPercentage(
                    calculatedPercentages.reduce((a, b) => a + b, 0),
                  )}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Financial Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("results.financialSummary")}
          </Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t("estate.netEstate")}:</Text>
              <Text style={styles.summaryValue}>
                <AnimatedNumber value={totalAmount} /> ر.س
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {t("results.trustLevel")}:
              </Text>
              <Text
                style={[
                  styles.summaryValue,
                  {
                    color:
                      currentResult.confidence > 90
                        ? theme.colors.success.main
                        : theme.colors.warning.main,
                  },
                ]}
              >
                <AnimatedNumber
                  value={currentResult.confidence}
                  format={false}
                />
                %
              </Text>
            </View>
          </View>
        </View>

        {/* Calculation Steps */}
        {currentResult.steps && currentResult.steps.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("results.calculationSteps")}
            </Text>
            <ScrollView style={styles.stepsContainer} scrollEnabled={true}>
              {currentResult.steps.map(
                (step: CalculationStep, index: number) => (
                  <View key={index} style={styles.step}>
                    <View style={styles.stepHeader}>
                      <Text style={styles.stepNumber}>{step.stepNumber}</Text>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                    </View>
                    <Text style={styles.stepDescription}>
                      {step.description}
                    </Text>
                  </View>
                ),
              )}
            </ScrollView>
          </View>
        )}

        {/* Previous Results */}
        {previousResults && previousResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("results.previousResults")}
            </Text>
            <ScrollView style={styles.historyContainer} scrollEnabled={true}>
              {previousResults.map(
                (prevResult: CalculationResult, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.historyItem,
                      selectedResultId === index && styles.historyItemSelected,
                    ]}
                    onPress={() => setSelectedResultId(index)}
                  >
                    <Text style={styles.historyItemMadhab}>
                      {prevResult.madhhabName}
                    </Text>
                    <Text style={styles.historyItemAmount}>
                      {prevResult.shares
                        .reduce(
                          (
                            sum: number,
                            s: CalculationResult["shares"][number],
                          ) => sum + s.amount,
                          0,
                        )
                        .toFixed(0)}{" "}
                      ر.س
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </ScrollView>
          </View>
        )}

        {/* Comparison Button */}
        {previousResults && previousResults.length > 0 && (
          <TouchableOpacity
            style={styles.comparisonButton}
            onPress={() => setShowComparison(!showComparison)}
            accessibilityLabel={showComparison ? t("results.hideComparison") : t("results.showComparison")}
            accessibilityRole="button"
          >
            <Text style={styles.comparisonButtonText}>
              {showComparison
                ? t("results.hideComparison")
                : t("results.showComparison")}
            </Text>
          </TouchableOpacity>
        )}

        {/* Compare Across Madhabs Button */}
        {currentResult && (
          <TouchableOpacity
            style={[
              styles.comparisonButton,
              { backgroundColor: theme.colors.secondary.main },
            ]}
            onPress={async () => {
              setComparisonLoading(true);
              try {
                const comparisons = await calculator.compareAcrossMadhabs();
                setMadhabComparisonResults(comparisons);
                setShowComparison(true);
              } catch (error) {
                console.error("Failed to compare across madhabs:", error);
                Alert.alert(
                  "خطأ",
                  "فشل في مقارنة المذاهب. يرجى المحاولة لاحقاً.",
                );
              } finally {
                setComparisonLoading(false);
              }
            }}
            accessibilityLabel="مقارنة المذاهب الأربعة"
            accessibilityRole="button"
          >
            <Text style={styles.comparisonButtonText}>
              مقارنة المذاهب الأربعة
            </Text>
          </TouchableOpacity>
        )}

        {/* Statistics */}
        {showComparison && stats_data && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("results.statistics")}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text style={styles.statValue}>{stats_data.totalResults}</Text>
                <Text style={styles.statLabel}>
                  {t("results.totalCalculations")}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statValue}>{stats_data.currentResult}</Text>
                <Text style={styles.statLabel}>
                  {t("results.currentResult")}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Comparison Results */}
        {showComparison &&
          activeComparisons &&
          activeComparisons.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="compare"
                  size={24}
                  color={theme.colors.primary.main}
                />
                <Text style={styles.sectionTitle}>
                  {t("results.comparison")}
                </Text>
              </View>

              {activeComparisons.map((comparison, idx) => (
                <View key={idx} style={styles.comparisonCard}>
                  <Text style={styles.comparisonTitle}>
                    {t("results.compareWith", {
                      madhab: comparison.madhhabName,
                    })}
                  </Text>

                  <View style={styles.comparisonSummary}>
                    <Text
                      style={[
                        styles.comparisonStatus,
                        comparison.summary.isIdentical &&
                          styles.comparisonIdentical,
                        !comparison.summary.isIdentical &&
                          comparison.summary.majorDifferences === 0 &&
                          styles.comparisonMinor,
                        comparison.summary.majorDifferences > 0 &&
                          styles.comparisonMajor,
                      ]}
                    >
                      {comparison.summary.isIdentical
                        ? "✓ متطابق"
                        : comparison.summary.majorDifferences > 0
                          ? "⚠️ اختلافات جوهرية"
                          : "⚠️ اختلافات طفيفة"}
                    </Text>

                    {comparison.summary.recommendation && (
                      <Text style={styles.comparisonRecommendation}>
                        💡 {comparison.summary.recommendation}
                      </Text>
                    )}
                  </View>

                  {comparison.differences.length > 0 ? (
                    <View style={styles.differencesList}>
                      {comparison.differences.map((diff, diffIdx) => (
                        <View key={diffIdx} style={styles.differenceItem}>
                          <Text style={styles.differenceHeir}>
                            {diff.heirName}
                          </Text>
                          <Text
                            style={[
                              styles.differenceAmount,
                              diff.amountDiff > 0
                                ? styles.differencePositive
                                : styles.differenceNegative,
                            ]}
                          >
                            {diff.amountDiff > 0 ? "+" : ""}
                            {diff.amountDiff.toFixed(2)} ر.س
                          </Text>
                          <Text style={styles.differenceExplanation}>
                            {diff.explanation}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noDifferences}>
                      لا توجد اختلافات في توزيع الورثة
                    </Text>
                  )}
                </View>
              ))}

              {/* Export Comparison Button */}
              <PressableScale
                style={styles.exportComparisonButton}
                onPress={handleExportComparison}
                haptic="light"
                scaleTo={0.95}
              >
                <MaterialCommunityIcons
                  name="file-pdf-box"
                  size={20}
                  color={theme.colors.background.light}
                />
                <Text style={styles.exportComparisonText}>
                  تصدير تقرير المقارنة
                </Text>
              </PressableScale>
            </View>
          )}

        {/* Close Button */}
        {onClose && (
          <PressableScale style={styles.closeButton} onPress={onClose} haptic="light" scaleTo={0.95}>
            <Text style={styles.closeButtonText}>إغلاق</Text>
          </PressableScale>
        )}

        <View style={{ height: 20 }} />
      </Animated.ScrollView>

      {/* Share Modal */}
      <Modal
        visible={shareModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>مشاركة النتائج</Text>
              <PressableScale
                onPress={() => setShareModalVisible(false)}
                haptic="light"
                scaleTo={0.88}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={theme.colors.neutral.main}
                />
              </PressableScale>
            </View>

            {shareError && (
              <View style={styles.modalError}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={20}
                  color={theme.colors.error.dark}
                />
                <Text style={styles.modalErrorText}>{shareError}</Text>
              </View>
            )}

            <View style={styles.shareOptions}>
              <PressableScale
                style={[
                  styles.shareOption,
                  shareStatus !== "idle" && styles.shareOptionDisabled,
                ]}
                onPress={() => showPreview("pdf")}
                disabled={shareStatus !== "idle"}
                haptic="light"
                scaleTo={0.97}
                accessibilityLabel="PDF - تقرير كامل ومنسق"
                accessibilityRole="button"
              >
                <View
                  style={[
                    styles.shareIcon,
                    { backgroundColor: theme.colors.error.dark },
                  ]}
                >
                  {shareFormat === "pdf" && shareStatus === "generating" ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.background.light}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="file-pdf-box"
                      size={24}
                      color={theme.colors.background.light}
                    />
                  )}
                </View>
                <Text style={styles.shareOptionText}>PDF</Text>
                <Text style={styles.shareOptionDesc}>تقرير كامل ومنسق</Text>
              </PressableScale>

              <PressableScale
                style={[
                  styles.shareOption,
                  shareStatus !== "idle" && styles.shareOptionDisabled,
                ]}
                onPress={() => showPreview("image")}
                disabled={shareStatus !== "idle"}
                haptic="light"
                scaleTo={0.97}
                accessibilityLabel="صورة - كصورة للنتائج"
                accessibilityRole="button"
              >
                <View
                  style={[
                    styles.shareIcon,
                    { backgroundColor: theme.colors.info.main },
                  ]}
                >
                  {shareFormat === "image" && shareStatus === "generating" ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.background.light}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="image"
                      size={24}
                      color={theme.colors.background.light}
                    />
                  )}
                </View>
                <Text style={styles.shareOptionText}>صورة</Text>
                <Text style={styles.shareOptionDesc}>كصورة للنتائج</Text>
              </PressableScale>

              <PressableScale
                style={[
                  styles.shareOption,
                  shareStatus !== "idle" && styles.shareOptionDisabled,
                ]}
                onPress={() => showPreview("text")}
                disabled={shareStatus !== "idle"}
                haptic="light"
                scaleTo={0.97}
                accessibilityLabel="نص - مشاركة كنص"
                accessibilityRole="button"
              >
                <View
                  style={[
                    styles.shareIcon,
                    { backgroundColor: theme.colors.success.main },
                  ]}
                >
                  {shareFormat === "text" && shareStatus === "generating" ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.background.light}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="text"
                      size={24}
                      color={theme.colors.background.light}
                    />
                  )}
                </View>
                <Text style={styles.shareOptionText}>نص</Text>
                <Text style={styles.shareOptionDesc}>مشاركة كنص</Text>
              </PressableScale>

              <PressableScale
                style={[
                  styles.shareOption,
                  shareStatus !== "idle" && styles.shareOptionDisabled,
                ]}
                onPress={() => showPreview("clipboard")}
                disabled={shareStatus !== "idle"}
                haptic="light"
                scaleTo={0.97}
                accessibilityLabel="نسخ - نسخ إلى الحافظة"
                accessibilityRole="button"
              >
                <View
                  style={[
                    styles.shareIcon,
                    { backgroundColor: theme.colors.warning.main },
                  ]}
                >
                  {shareFormat === "clipboard" &&
                  shareStatus === "generating" ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.background.light}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="content-copy"
                      size={24}
                      color={theme.colors.background.light}
                    />
                  )}
                </View>
                <Text style={styles.shareOptionText}>نسخ</Text>
                <Text style={styles.shareOptionDesc}>نسخ إلى الحافظة</Text>
              </PressableScale>
            </View>

            {shareStatus === "success" && (
              <View style={styles.modalSuccess}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={theme.colors.success.main}
                />
                <Text style={styles.modalSuccessText}>تمت المشاركة بنجاح</Text>
              </View>
            )}

            <PressableScale
              style={styles.modalCancelButton}
              onPress={() => setShareModalVisible(false)}
              haptic="light"
              scaleTo={0.96}
            >
              <Text style={styles.modalCancelButtonText}>إلغاء</Text>
            </PressableScale>
          </View>
        </View>
      </Modal>

      {/* ===== FIX M6: Share Preview Modal ===== */}
      <SharePreviewModal
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        onConfirm={executeShare}
        result={currentResult}
        format={shareFormat}
        previewHTML={previewHTML}
      />
    </ViewShot>
  );
}

const createStyles = (theme: Theme, isNarrowScreen: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.lightVariant,
    },
    header: {
      backgroundColor: theme.colors.background.light,
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 20,
      borderRadius: 20,
      marginHorizontal: 12,
      marginBottom: 16,
      ...theme.shadows.sm,
      position: "relative",
    },
    madhhabBadge: {
      backgroundColor: theme.colors.info.light,
      borderRadius: 16,
      paddingHorizontal: 10,
      paddingVertical: 6,
      alignSelf: "flex-end",
      marginBottom: 10,
    },
    madhhabBadgeText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.info.main,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.neutral.black,
      textAlign: "center",
      marginBottom: 6,
    },
    calculationTime: {
      fontSize: 12,
      color: theme.colors.neutral.main,
      textAlign: "center",
    },
    headerShareButton: {
      position: "absolute",
      top: 16,
      right: 16,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.info.main,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      gap: 6,
      shadowColor: theme.colors.info.main,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 3,
    },
    headerShareText: {
      color: theme.colors.background.light,
      fontSize: 13,
      fontWeight: "700",
    },
    section: {
      marginHorizontal: 12,
      marginBottom: 14,
      backgroundColor: theme.colors.background.light,
      borderRadius: 16,
      padding: 16,
      borderWidth: 0,
      ...theme.shadows.sm,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.neutral.black,
      marginBottom: 12,
      letterSpacing: 0.2,
      textAlign: "right",
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      gap: 10,
    },
    emptyState: {
      paddingVertical: 40,
      alignItems: "center",
    },
    emptyStateTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.neutral.dark300,
      marginBottom: 6,
    },
    emptyStateText: {
      fontSize: 12,
      color: theme.colors.neutral.light400,
    },
    specialCases: {
      backgroundColor: theme.colors.warning.light,
      borderRadius: 4,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.colors.warning.main,
    },
    specialCaseItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 4,
    },
    specialCaseLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.neutral.dark300,
    },
    specialCaseValue: {
      fontSize: 12,
      color: theme.colors.warning.main,
      fontWeight: "600",
    },
    hijabContainer: {
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.warning.light,
    },
    hijabLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: theme.colors.neutral.dark300,
      marginBottom: 4,
    },
    hijabType: {
      fontSize: 11,
      color: theme.colors.neutral.main,
      marginVertical: 2,
    },
    table: {
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
      borderRadius: 12,
      overflow: "hidden",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: theme.colors.info.main,
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    tableHeaderCell: {
      flex: 1,
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.background.light,
      textAlign: "center",
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.neutral.light200,
      backgroundColor: theme.colors.neutral.light50,
    },
    tableRowAlternate: {
      backgroundColor: theme.colors.background.light,
    },
    tableCell: {
      flex: 1,
      fontSize: 12,
      color: theme.colors.neutral.black,
      textAlign: "center",
    },
    tableFooter: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderTopWidth: 2,
      borderTopColor: theme.colors.primary.main,
      backgroundColor: theme.colors.primary.light,
    },
    tableFooterText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.primary.dark,
    },
    cardsContainer: {
      gap: theme.spacing.sm,
    },
    shareCard: {
      backgroundColor: theme.colors.background.light,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
      ...theme.shadows.sm,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.neutral.light100,
    },
    cardHeirName: {
      ...theme.typography.headline.small,
      color: theme.colors.neutral.dark300,
      flex: 1,
    },
    cardPercentage: {
      ...theme.typography.title.medium,
      color: theme.colors.primary.main,
      fontWeight: "700",
    },
    cardAmountRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    cardAmount: {
      ...theme.typography.title.large,
      color: theme.colors.neutral.dark300,
      fontWeight: "600",
    },
    summaryContainer: {
      backgroundColor: theme.colors.success.light,
      borderRadius: 4,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.colors.success.main,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 6,
    },
    summaryLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: theme.colors.neutral.dark300,
    },
    summaryValue: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.primary.main,
    },
    stepsContainer: {
      maxHeight: 200,
    },
    step: {
      backgroundColor: theme.colors.neutral.light100,
      borderRadius: 4,
      padding: 10,
      marginBottom: 8,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.info.main,
    },
    stepHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    stepNumber: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.info.main,
      marginRight: 8,
    },
    stepTitle: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.neutral.dark300,
      flex: 1,
    },
    stepDescription: {
      fontSize: 11,
      color: theme.colors.neutral.main,
      textAlign: "right",
    },
    historyContainer: {
      maxHeight: 150,
    },
    historyItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: theme.colors.neutral.light50,
      borderRadius: 4,
      paddingVertical: 10,
      paddingHorizontal: 10,
      marginBottom: 6,
      borderWidth: 2,
      borderColor: "transparent",
    },
    historyItemSelected: {
      backgroundColor: theme.colors.info.light,
      borderColor: theme.colors.info.main,
    },
    historyItemMadhab: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.info.main,
    },
    historyItemAmount: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.neutral.dark300,
    },
    comparisonButton: {
      marginHorizontal: 12,
      marginBottom: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.info.light,
      borderRadius: 12,
      borderWidth: 0,
      shadowColor: theme.colors.info.main,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
      alignItems: "center",
    },
    comparisonButtonText: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.info.main,
      textAlign: "center",
    },
    statsContainer: {
      backgroundColor: theme.colors.secondary.light,
      borderRadius: 12,
      padding: 14,
      borderWidth: 0,
      shadowColor: theme.colors.secondary.main,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      elevation: 2,
    },
    statRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 6,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: theme.colors.neutral.dark300,
    },
    statValue: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.secondary.dark,
    },
    comparisonCard: {
      backgroundColor: theme.colors.neutral.light50,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
    },
    comparisonTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.info.main,
      marginBottom: 8,
      textAlign: "right",
    },
    comparisonSummary: {
      backgroundColor: theme.colors.background.light,
      borderRadius: 6,
      padding: 10,
      marginBottom: 10,
    },
    comparisonStatus: {
      fontSize: 13,
      fontWeight: "600",
      marginBottom: 6,
      textAlign: "right",
    },
    comparisonIdentical: {
      color: theme.colors.success.main,
    },
    comparisonMinor: {
      color: theme.colors.warning.main,
    },
    comparisonMajor: {
      color: theme.colors.error.dark,
    },
    comparisonRecommendation: {
      fontSize: 12,
      color: theme.colors.neutral.main,
      fontStyle: "italic",
      textAlign: "right",
    },
    differencesList: {
      marginTop: 8,
    },
    differenceItem: {
      backgroundColor: theme.colors.background.light,
      borderRadius: 6,
      padding: 8,
      marginBottom: 6,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.info.main,
    },
    differenceHeir: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.neutral.dark300,
      marginBottom: 4,
      textAlign: "right",
    },
    differenceAmount: {
      fontSize: 12,
      fontWeight: "700",
      marginBottom: 2,
      textAlign: "right",
    },
    differencePositive: {
      color: theme.colors.success.main,
    },
    differenceNegative: {
      color: theme.colors.error.dark,
    },
    differenceExplanation: {
      fontSize: 11,
      color: theme.colors.neutral.main,
      fontStyle: "italic",
      textAlign: "right",
    },
    noDifferences: {
      fontSize: 12,
      color: theme.colors.success.main,
      textAlign: "center",
      paddingVertical: 8,
    },
    exportComparisonButton: {
      backgroundColor: theme.colors.info.main,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginTop: 12,
    },
    exportComparisonText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.background.light,
    },
    closeButton: {
      marginHorizontal: 12,
      marginTop: 14,
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.error.dark,
      borderRadius: 14,
      alignItems: "center",
    },
    closeButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.background.light,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.background.light,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      minHeight: 300,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.neutral.light200,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.neutral.dark300,
    },
    modalError: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.error.light,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      gap: 8,
    },
    modalErrorText: {
      fontSize: 13,
      color: theme.colors.error.dark,
      flex: 1,
    },
    shareOptions: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    shareOption: {
      width: "48%",
      backgroundColor: theme.colors.background.light,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      alignItems: "center",
      borderWidth: 0,
      ...theme.shadows.sm,
    },
    shareOptionDisabled: {
      opacity: 0.45,
    },
    shareIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    shareOptionText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.neutral.black,
      marginBottom: 4,
    },
    shareOptionDesc: {
      fontSize: 11,
      color: theme.colors.neutral.main,
      textAlign: "center",
      lineHeight: 16,
    },
    modalSuccess: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.success.light,
      padding: 14,
      borderRadius: 14,
      marginBottom: 16,
      gap: 8,
    },
    modalSuccessText: {
      fontSize: 13,
      color: theme.colors.primary.main,
      flex: 1,
    },
    modalCancelButton: {
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
      backgroundColor: theme.colors.neutral.light50,
    },
    modalCancelButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.neutral.dark200,
    },
    previewOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    previewContent: {
      width: "100%",
      maxWidth: 400,
      maxHeight: "80%",
      borderRadius: 20,
      overflow: "hidden",
    },
    previewHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.neutral.light200,
    },
    previewHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    previewTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.neutral.dark300,
    },
    previewScroll: {
      maxHeight: 300,
    },
    previewHTML: {
      padding: 16,
      backgroundColor: theme.colors.neutral.light100,
      margin: 16,
      borderRadius: 8,
    },
    previewHTMLText: {
      fontSize: 11,
      color: theme.colors.neutral.main,
      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    },
    previewImagePlaceholder: {
      height: 200,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.neutral.light100,
      margin: 16,
      borderRadius: 8,
      gap: 12,
    },
    previewImageText: {
      fontSize: 14,
      color: theme.colors.neutral.light400,
    },
    previewText: {
      padding: 16,
      backgroundColor: theme.colors.neutral.light100,
      margin: 16,
      borderRadius: 8,
    },
    previewTextContent: {
      fontSize: 12,
      color: theme.colors.neutral.dark300,
      lineHeight: 18,
      textAlign: "right",
    },
    previewActions: {
      flexDirection: "row",
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.neutral.light200,
      gap: 12,
    },
    previewButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
    },
    previewCancelButton: {
      backgroundColor: theme.colors.neutral.light100,
    },
    previewConfirmButton: {},
    previewCancelText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.neutral.main,
    },
    previewConfirmText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.background.light,
    },
  });

export default ResultsDisplay;
