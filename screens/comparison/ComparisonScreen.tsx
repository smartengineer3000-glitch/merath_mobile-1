import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useCalculator } from "../../lib/hooks/useCalculator";
import { useCalculationStore } from "../../lib/context/CalculationContext";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import {
  Card,
  SectionHeader,
  Button,
  Badge,
  EmptyState,
} from "../../components/ui";
import { formatCurrency } from "../../lib/utils/formatters";
import type {
  CalculationResult,
  MadhhabType,
} from "../../lib/inheritance/types";

export default function ComparisonScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { latestScenario } = useCalculationStore();
  const { calculateWithEstate } = useCalculator();

  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<
    CalculationResult[]
  >([]);

  const handleCompare = useCallback(async () => {
    if (!latestScenario) return;

    setIsComparing(true);
    try {
      const madhabs: MadhhabType[] = ["hanafi", "maliki", "shafii", "hanbali"];
      const results: CalculationResult[] = [];

      for (const madhab of madhabs) {
        try {
          const result = await calculateWithEstate(
            madhab,
            latestScenario.estate,
            latestScenario.heirs,
          );
          if (result && result.success) {
            results.push(result);
          }
        } catch (err) {
          console.error(`Comparison failed for ${madhab}:`, err);
        }
      }

      setComparisonResults(results);
      if (results.length > 0) {
        navigation.navigate("ComparisonResults", { results });
      }
    } finally {
      setIsComparing(false);
    }
  }, [latestScenario, calculateWithEstate, navigation]);

  const hasData = latestScenario !== null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.light },
      ]}
    >
      <AnimatedHeader
        title={t("comparison.title")}
        subtitle={t("comparison.subtitle")}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!hasData ? (
          <Card variant="elevated" style={styles.card}>
            <EmptyState
              icon="git-compare"
              title={t("comparison.noDataToCompare")}
              message={t("comparison.noComparison")}
            />
          </Card>
        ) : (
          <>
            <Card variant="elevated" style={styles.card}>
              <SectionHeader title={t("comparison.currentScenario")} />
              <Text
                style={[
                  styles.infoText,
                  {
                    color: theme.colors.neutral.dark200,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {t("comparison.estateLabel")}{" "}
                {formatCurrency(latestScenario.estate.total)}
              </Text>
              <Text
                style={[
                  styles.infoText,
                  {
                    color: theme.colors.neutral.light400,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {t("comparison.heirsLabel")}{" "}
                {Object.entries(latestScenario.heirs)
                  .filter(([_, c]) => c && c > 0)
                  .map(([k, v]) => `${k}(${v})`)
                  .join(", ")}
              </Text>
              <Badge
                label={latestScenario.madhab}
                color={theme.colors.primary.main}
                size="sm"
              />
            </Card>

            <Card variant="elevated" style={styles.card}>
              <SectionHeader title={t("comparison.compareAcrossAllMadhabs")} />
              <Text
                style={[
                  styles.compareDesc,
                  {
                    color: theme.colors.neutral.light400,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {t("comparison.compareDescription")}
              </Text>
              <Button
                title={
                  isComparing
                    ? t("comparison.comparing")
                    : t("comparison.compareAcross")
                }
                onPress={handleCompare}
                variant="primary"
                fullWidth
                loading={isComparing}
              />
            </Card>

            {comparisonResults.length > 0 && (
              <Card variant="elevated" style={styles.card}>
                <SectionHeader
                  title={t("comparison.recentComparisonResults")}
                />
                {comparisonResults.map((r, i) => (
                  <View
                    key={i}
                    style={[
                      styles.resultRow,
                      { borderBottomColor: theme.colors.neutral.light100 },
                    ]}
                  >
                    <Badge
                      label={r.madhhabName}
                      color={theme.colors.primary.main}
                      size="sm"
                    />
                    <Text
                      style={[
                        styles.resultAmount,
                        {
                          color: theme.colors.neutral.dark300,
                          fontFamily: theme.fontFamily.english,
                        },
                      ]}
                    >
                      {formatCurrency(
                        r.shares.reduce((sum, s) => sum + s.amount, 0),
                      )}
                    </Text>
                  </View>
                ))}
              </Card>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  card: { marginBottom: 16 },
  infoText: { fontSize: 13, marginBottom: 6 },
  compareDesc: { fontSize: 12, marginBottom: 16, lineHeight: 18 },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  resultAmount: { fontSize: 14, fontWeight: "700" },
});
