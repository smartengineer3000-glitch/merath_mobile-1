/**
 * @file ResultsScreen.tsx
 * @description عرض النتائج الكاملة مع المشاركة والمقارنة
 * Results Screen - Bottom Tab for accessing calculation results
 *
 * FIXES:
 * - CRITICAL: Results now accessible from bottom tabs (not modal-locked in Calculator)
 * - HIGH: Results persist across tab navigation
 * - HIGH: Navigation flow: Calculator → Calculate → Results Tab → View/Share/Compare
 */

import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "../lib/context/ThemeProvider";
import { useResults } from "../lib/hooks/useResults";
import { useCalculationScenario } from "../lib/context/CalculationContext";
import { ResultsDisplay } from "../components/ResultsDisplay";
import { Card } from "../components/ui/Card";
import type { Theme } from "../lib/design/theme";
import type { TabParamList } from "../navigation/types";

/**
 * ResultsScreen - Dedicated tab for viewing calculation results
 *
 * Key features:
 * - Shows current/latest calculation result
 * - Persists across tab navigation via CalculationContext
 * - Allows viewing result history from previous calculations
 * - Integrated share and export functionality
 * - Accessible from any tab after first calculation
 */
export default function ResultsScreen() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const { result, previousResults } = useResults();
  const { latestScenario } = useCalculationScenario();
  const styles = createStyles(theme);

  // Guide users if no results available
  useEffect(() => {
    if (!result && !previousResults?.length && !latestScenario) {
      // Silently show empty state - user will see it on screen
    }
  }, [result, previousResults, latestScenario]);

  // Empty state when no results
  if (!result && !previousResults?.length) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <MaterialCommunityIcons
              name="chart-donut"
              size={52}
              color={theme.colors.primary.main}
            />
          </View>
          <Text style={styles.emptyTitle}>{t("results.noResults")}</Text>
          <Text style={styles.emptyMessage}>
            ابدأ حساباً جديداً لإظهار ملخص التركة، بطاقات الورثة، والملاحظات
            الشرعية في مكان واحد واضح.
          </Text>

          <TouchableOpacity
            style={styles.primaryEmptyAction}
            onPress={() => navigation.navigate("Calculator")}
            accessibilityRole="button"
            accessibilityLabel="Start inheritance calculation"
          >
            <MaterialCommunityIcons
              name="calculator"
              size={20}
              color={theme.colors.background.light}
            />
            <Text style={styles.primaryEmptyActionText}>ابدأ الحساب</Text>
          </TouchableOpacity>

          <Card style={styles.helpCard}>
            <Text style={styles.helpTitle}>ما الذي سيظهر بعد الحساب؟</Text>
            <View style={styles.helpSteps}>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>ملخص صافي التركة والمذهب</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>بطاقات توزيع الورثة</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepText}>خيارات المشاركة والتصدير</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    );
  }

  // Show results if available
  return (
    <View style={styles.container}>
      {result ? (
        <ResultsDisplay result={result} onClose={undefined} />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>{t("common.loading")}</Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.lightVariant,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
      paddingTop: theme.spacing.xxxl,
    },
    emptyIconContainer: {
      width: 104,
      height: 104,
      borderRadius: theme.borderRadius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary.light,
      borderWidth: 1,
      borderColor: theme.colors.primary.lighter,
      marginBottom: theme.spacing.lg,
    },
    emptyTitle: {
      ...theme.typography.headline.medium,
      color: theme.colors.neutral.dark300,
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    emptyMessage: {
      ...theme.typography.body.medium,
      color: theme.colors.neutral.main,
      textAlign: "center",
      marginBottom: theme.spacing.lg,
      lineHeight: 24,
      maxWidth: 360,
    },
    primaryEmptyAction: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
      minHeight: 48,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary.main,
      paddingHorizontal: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    primaryEmptyActionText: {
      ...theme.typography.label.large,
      color: theme.colors.background.light,
      fontFamily: "Inter-Bold",
    },
    helpCard: {
      marginBottom: theme.spacing.lg,
    },
    helpTitle: {
      ...theme.typography.headline.small,
      color: theme.colors.neutral.dark300,
      marginBottom: theme.spacing.md,
    },
    helpSteps: {
      gap: theme.spacing.sm,
    },
    step: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },
    stepNumber: {
      ...theme.typography.title.medium,
      color: theme.colors.primary.main,
      minWidth: 32,
      textAlign: "center",
      paddingVertical: 2,
    },
    stepText: {
      ...theme.typography.body.small,
      color: theme.colors.neutral.dark200,
      flex: 1,
      paddingTop: 4,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      ...theme.typography.body.medium,
      color: theme.colors.neutral.main,
      marginTop: theme.spacing.md,
    },
  });
