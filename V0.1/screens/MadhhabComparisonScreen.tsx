import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useAppTheme } from "../lib/context/ThemeProvider";
import { useCalculationScenario } from "../lib/context/CalculationContext";
import { useCalculator } from "../lib/hooks/useCalculator";
import { Card } from "../components/ui/Card";
import type { Theme } from "../lib/design/theme";
import type {
  MadhhabType,
  CalculationResult,
  HeirShare,
} from "../lib/inheritance/types";
import type { TabParamList } from "../navigation/types";
import { formatCurrency, formatPercentage } from "../lib/utils/formatters";

const ALL_MADHABS: MadhhabType[] = ["hanafi", "shafii", "maliki", "hanbali"];

interface ComparisonEntry {
  madhab: MadhhabType;
  result: CalculationResult;
}

type ComparisonView = "all" | "differences" | "explanation";

export default function MadhhabComparisonScreen() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const { width } = Dimensions.get("window");
  const isNarrowScreen = width < 600;
  const { latestScenario } = useCalculationScenario();
  const { calculateWithEstate } = useCalculator();
  const [comparisonResults, setComparisonResults] = useState<ComparisonEntry[]>(
    [],
  );
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonView, setComparisonView] = useState<ComparisonView>("all");

  const handleCompare = useCallback(async () => {
    if (!latestScenario) {
      Alert.alert(
        t("common.error"),
        "يرجى إجراء حساب ميراث أولاً ثم العودة إلى المقارنة.",
      );
      return;
    }

    try {
      setIsComparing(true);
      const comparisons: ComparisonEntry[] = [];
      for (const m of ALL_MADHABS) {
        const result = await calculateWithEstate(
          m,
          latestScenario.estate,
          latestScenario.heirs,
        );
        if (result.success) {
          comparisons.push({ madhab: m, result });
        }
      }
      setComparisonResults(comparisons);
    } catch (error) {
      Alert.alert(t("common.error"), t("comparison.failed"));
    } finally {
      setIsComparing(false);
    }
  }, [calculateWithEstate, latestScenario, t]);

  const heirKeys = Array.from(
    new Set(
      comparisonResults.flatMap((comp) =>
        comp.result.shares.map((share) => share.key).filter(Boolean),
      ),
    ),
  );

  const findShare = (result: CalculationResult, key: HeirShare["key"]) =>
    result.shares.find((share) => share.key === key);

  const hasDifference = useCallback(
    (key: HeirShare["key"]) => {
      if (comparisonResults.length < 2) return false;
      const amounts = comparisonResults.map(
        (comp) => findShare(comp.result, key)?.amount ?? 0,
      );
      return amounts.some((amount) => Math.abs(amount - amounts[0]) > 0.01);
    },
    [comparisonResults],
  );

  const visibleHeirKeys =
    comparisonView === "differences"
      ? heirKeys.filter(hasDifference)
      : heirKeys;

  const formatShare = (share?: HeirShare, totalEstate?: number) => {
    if (!share) return "محجوب";
    const percentage = totalEstate ? (share.amount / totalEstate) * 100 : 0;
    return `${formatCurrency(share.amount)} (${formatPercentage(percentage)})`;
  };

  const handleNavigateToCalculator = useCallback(() => {
    navigation.navigate("Calculator");
  }, [navigation]);

  const styles = createStyles(theme, isNarrowScreen);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("comparison.title")}</Text>
        <Text style={styles.subtitle}>{t("comparison.subtitle")}</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>{t("comparison.compare")}</Text>
        <Text style={styles.cardSubtitle}>
          {latestScenario
            ? `سيتم مقارنة آخر مسألة: ${formatCurrency(latestScenario.estate.total)} ر.س و ${Object.values(latestScenario.heirs).reduce<number>((sum, value) => sum + (value ?? 0), 0)} وارث.`
            : "أجرِ حساباً من تبويب الحاسبة أولاً، ثم ارجع هنا لمقارنة نفس المسألة بين المذاهب."}
        </Text>
        <TouchableOpacity
          style={[
            styles.compareButton,
            isComparing && styles.compareButtonDisabled,
          ]}
          onPress={handleCompare}
          disabled={isComparing || !latestScenario}
        >
          <MaterialCommunityIcons
            name="compare"
            size={24}
            color={theme.colors.background.light}
          />
          <Text style={styles.compareButtonText}>
            {isComparing
              ? t("comparison.comparing")
              : t("comparison.compareAcross")}
          </Text>
        </TouchableOpacity>
      </Card>

      {!latestScenario && (
        <Card style={styles.emptyCard}>
          <MaterialCommunityIcons
            name="calculator-variant"
            size={48}
            color={theme.colors.primary.main}
          />
          <Text style={styles.emptyTitle}>لا توجد مسألة للمقارنة</Text>
          <Text style={styles.emptyText}>
            ابدأ بإجراء حساب ميراث لمقارنة النتائج بين المذاهب الأربعة.
          </Text>

          <View style={styles.guideContainer}>
            <Text style={styles.guideTitle}>خطوة بخطوة:</Text>
            <View style={styles.stepList}>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  انتقل إلى تبويب &quot;الحاسبة&quot;
                </Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>أدخل بيانات التركة والورثة</Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  اختر المذهب واضغط &quot;حساب&quot;
                </Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <Text style={styles.stepText}>ارجع هنا لمقارنة المذاهب</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.goToCalculatorButton}
            onPress={handleNavigateToCalculator}
          >
            <MaterialCommunityIcons
              name="calculator"
              size={20}
              color={theme.colors.background.light}
            />
            <Text style={styles.goToCalculatorButtonText}>
              اذهب إلى الحاسبة
            </Text>
          </TouchableOpacity>
        </Card>
      )}

      {comparisonResults.length > 0 && (
        <Card style={styles.resultsCard}>
          <Text style={styles.resultsTitle}>{t("comparison.results")}</Text>

          <View style={styles.segmentedControl}>
            {(
              [
                ["all", "الكل"],
                ["differences", "الفروقات فقط"],
                ["explanation", "الملخص"],
              ] as const
            ).map(([value, label]) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.segmentButton,
                  comparisonView === value && styles.segmentButtonActive,
                ]}
                onPress={() => setComparisonView(value)}
                accessibilityRole="button"
                accessibilityState={{ selected: comparisonView === value }}
              >
                <Text
                  style={[
                    styles.segmentButtonText,
                    comparisonView === value && styles.segmentButtonTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {comparisonView === "explanation" ? (
            <View style={styles.explanationList}>
              {visibleHeirKeys.filter(hasDifference).length > 0 ? (
                visibleHeirKeys.filter(hasDifference).map((key) => {
                  const firstShare = comparisonResults
                    .map((comp) => findShare(comp.result, key))
                    .find(Boolean);
                  return (
                    <View key={key} style={styles.differenceCard}>
                      <Text style={styles.differenceTitle}>
                        {firstShare?.name || key}
                      </Text>
                      <Text style={styles.differenceText}>
                        يوجد اختلاف في نصيب هذا الوارث بين المذاهب. راجع المبالغ
                        المظللة واختر المذهب المعتمد لديك أو استشر متخصصاً عند
                        وجود فرق جوهري.
                      </Text>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.noDifferenceText}>
                  لا توجد فروقات ظاهرة بين نتائج المذاهب لهذه المسألة.
                </Text>
              )}
            </View>
          ) : isNarrowScreen ? (
            // Card layout for narrow screens
            <View style={styles.madhabCardsContainer}>
              {comparisonResults.map((comp) => {
                const totalEstate = comp.result.shares.reduce(
                  (sum, s) => sum + s.amount,
                  0,
                );
                return (
                  <View key={comp.madhab} style={styles.madhabCard}>
                    <View style={styles.madhabCardHeader}>
                      <Text style={styles.madhabCardTitle}>
                        {comp.madhab.toUpperCase()}
                      </Text>
                      <MaterialCommunityIcons
                        name="scale-balance"
                        size={20}
                        color={theme.colors.primary.main}
                      />
                    </View>
                    <View style={styles.madhabCardContent}>
                      {comp.result.shares
                        .filter(
                          (share) =>
                            comparisonView !== "differences" ||
                            hasDifference(share.key),
                        )
                        .map((share, idx) => (
                          <View
                            key={idx}
                            style={[
                              styles.madhabShareRow,
                              hasDifference(share.key) &&
                                styles.changedShareRow,
                            ]}
                          >
                            <Text style={styles.madhabShareName}>
                              {share.name}
                            </Text>
                            <Text style={styles.madhabShareAmount}>
                              {formatShare(share, totalEstate)}
                            </Text>
                          </View>
                        ))}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            // Table layout for larger screens with scroll hints
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableHeader, styles.heirColumn]}>
                      الوارث
                    </Text>
                    {comparisonResults.map((comp) => (
                      <Text key={comp.madhab} style={styles.tableHeader}>
                        {comp.madhab.toUpperCase()}
                      </Text>
                    ))}
                  </View>

                  {visibleHeirKeys.map((key) => {
                    const firstShare = comparisonResults
                      .map((comp) => findShare(comp.result, key))
                      .find(Boolean);
                    const totalEstate = firstShare
                      ? comparisonResults[0].result.shares.reduce(
                          (sum, s) => sum + s.amount,
                          0,
                        )
                      : 0;

                    return (
                      <View
                        key={key}
                        style={[
                          styles.tableRow,
                          hasDifference(key) && styles.changedTableRow,
                        ]}
                      >
                        <Text style={[styles.tableCell, styles.heirColumn]}>
                          {firstShare?.name || key}
                        </Text>
                        {comparisonResults.map((comp) => {
                          const share = findShare(comp.result, key);
                          return (
                            <Text
                              key={`${comp.madhab}-${key}`}
                              style={[
                                styles.tableCell,
                                !share && styles.blockedCell,
                              ]}
                            >
                              {formatShare(share, totalEstate)}
                            </Text>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
              </ScrollView>

              {/* Scroll hint indicator */}
              <View style={styles.scrollHint}>
                <MaterialCommunityIcons
                  name="gesture-swipe-horizontal"
                  size={16}
                  color={theme.colors.neutral.main}
                />
                <Text style={styles.scrollHintText}>اسحب لرؤية المزيد</Text>
              </View>
            </>
          )}

          <View style={styles.summaryGrid}>
            {comparisonResults.map((comp) => (
              <View key={comp.madhab} style={styles.summaryCard}>
                <Text style={styles.madhabName}>
                  {comp.madhab.toUpperCase()}
                </Text>
                <Text style={styles.shareAmount}>
                  {comp.result.shares.length} وارث مستحق
                </Text>
                <Text style={styles.shareName}>
                  الثقة: {formatPercentage(comp.result.confidence)}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      )}
    </ScrollView>
  );
}

const createStyles = (theme: Theme, isNarrowScreen: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.lightVariant,
      padding: theme.spacing.lg,
    },
    header: {
      marginBottom: theme.spacing.xl,
    },
    title: {
      ...theme.typography.display.medium,
      color: theme.colors.primary.main,
    },
    subtitle: {
      ...theme.typography.body.large,
      color: theme.colors.neutral.main,
      marginTop: theme.spacing.sm,
    },
    card: {
      marginBottom: theme.spacing.lg,
    },
    cardTitle: {
      ...theme.typography.headline.large,
      color: theme.colors.neutral.dark300,
      marginBottom: theme.spacing.sm,
    },
    cardSubtitle: {
      ...theme.typography.body.medium,
      color: theme.colors.neutral.main,
      marginBottom: theme.spacing.lg,
      lineHeight: 22,
    },
    compareButton: {
      backgroundColor: theme.colors.primary.main,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.sm,
    },
    compareButtonDisabled: {
      opacity: 0.6,
    },
    compareButtonText: {
      color: theme.colors.background.light,
      ...theme.typography.title.large,
      marginLeft: theme.spacing.sm,
    },
    emptyCard: {
      alignItems: "center",
      marginBottom: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    emptyTitle: {
      ...theme.typography.headline.medium,
      color: theme.colors.neutral.dark300,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      textAlign: "center",
    },
    emptyText: {
      ...theme.typography.body.medium,
      color: theme.colors.neutral.main,
      lineHeight: 22,
      textAlign: "center",
      marginBottom: theme.spacing.lg,
    },
    guideContainer: {
      alignSelf: "stretch",
      backgroundColor: theme.colors.primary.light,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    guideTitle: {
      ...theme.typography.title.large,
      color: theme.colors.primary.dark,
      marginBottom: theme.spacing.md,
      textAlign: "center",
    },
    stepList: {
      gap: theme.spacing.sm,
    },
    step: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    stepNumber: {
      width: 28,
      height: 28,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary.main,
      alignItems: "center",
      justifyContent: "center",
    },
    stepNumberText: {
      ...theme.typography.label.large,
      fontWeight: "bold",
      color: theme.colors.background.light,
    },
    stepText: {
      ...theme.typography.body.medium,
      color: theme.colors.neutral.dark200,
      flex: 1,
    },
    goToCalculatorButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.primary.main,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      minWidth: 200,
    },
    goToCalculatorButtonText: {
      ...theme.typography.title.large,
      color: theme.colors.background.light,
    },
    resultsCard: {
      marginBottom: theme.spacing.lg,
    },
    resultsTitle: {
      ...theme.typography.headline.large,
      color: theme.colors.neutral.dark300,
      marginBottom: theme.spacing.lg,
    },
    segmentedControl: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.neutral.light100,
      borderRadius: theme.borderRadius.full,
      padding: theme.spacing.xs,
      marginBottom: theme.spacing.lg,
    },
    segmentButton: {
      flex: 1,
      minHeight: 44,
      borderRadius: theme.borderRadius.full,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.sm,
    },
    segmentButtonActive: {
      backgroundColor: theme.colors.primary.main,
    },
    segmentButtonText: {
      ...theme.typography.label.medium,
      color: theme.colors.neutral.dark200,
    },
    segmentButtonTextActive: {
      color: theme.colors.background.light,
    },
    explanationList: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    differenceCard: {
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.warning.main,
      backgroundColor: theme.colors.warning.light,
      padding: theme.spacing.md,
    },
    differenceTitle: {
      ...theme.typography.title.medium,
      color: theme.colors.neutral.dark300,
      marginBottom: theme.spacing.xs,
    },
    differenceText: {
      ...theme.typography.body.small,
      color: theme.colors.neutral.dark200,
    },
    noDifferenceText: {
      ...theme.typography.body.medium,
      color: theme.colors.success.dark,
      textAlign: "center",
      padding: theme.spacing.lg,
    },
    table: {
      borderWidth: 1,
      borderColor: theme.colors.neutral.light300,
      borderRadius: theme.borderRadius.sm,
      overflow: "hidden",
      marginBottom: theme.spacing.lg,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.neutral.light300,
    },
    changedTableRow: {
      backgroundColor: theme.colors.warning.light,
    },
    tableHeader: {
      width: 150,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.primary.main,
      color: theme.colors.background.light,
      fontWeight: "bold",
      textAlign: "center",
    },
    tableCell: {
      width: 150,
      padding: theme.spacing.sm,
      color: theme.colors.neutral.dark300,
      backgroundColor: theme.colors.background.light,
      textAlign: "center",
    },
    heirColumn: {
      width: 130,
      textAlign: "right",
      fontWeight: "bold",
    },
    blockedCell: {
      color: theme.colors.neutral.main,
      backgroundColor: theme.colors.neutral.light100,
    },
    scrollHint: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.neutral.light50,
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.sm,
    },
    scrollHintText: {
      ...theme.typography.body.small,
      color: theme.colors.neutral.main,
    },
    madhabCardsContainer: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    madhabCard: {
      backgroundColor: theme.colors.background.light,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
      overflow: "hidden",
      ...theme.shadows.sm,
    },
    madhabCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing.md,
      backgroundColor: theme.colors.primary.light,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.primary.light100,
    },
    madhabCardTitle: {
      ...theme.typography.title.large,
      color: theme.colors.primary.dark,
    },
    madhabCardContent: {
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    madhabShareRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: theme.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.neutral.light100,
    },
    changedShareRow: {
      backgroundColor: theme.colors.warning.light,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.sm,
    },
    madhabShareName: {
      ...theme.typography.body.medium,
      color: theme.colors.neutral.dark200,
      flex: 1,
    },
    madhabShareAmount: {
      ...theme.typography.body.medium,
      fontWeight: "600",
      color: theme.colors.primary.main,
    },
    summaryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
    },
    summaryCard: {
      width: "48%",
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.light,
      borderRadius: theme.borderRadius.sm,
      ...theme.shadows.xs,
    },
    madhabName: {
      ...theme.typography.headline.small,
      color: theme.colors.primary.main,
      marginBottom: theme.spacing.sm,
    },
    shareName: {
      ...theme.typography.body.medium,
      color: theme.colors.neutral.dark300,
    },
    shareAmount: {
      ...theme.typography.body.medium,
      fontWeight: "600",
      color: theme.colors.primary.main,
    },
  });
