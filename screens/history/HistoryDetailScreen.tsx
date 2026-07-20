import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import {
  Card,
  SectionHeader,
  Badge,
} from "../../components/ui";
import { formatCurrency, formatPercentage } from "../../lib/utils/formatters";
import type { CalculationResult } from "../../lib/inheritance/types";
import { getHeirI18nKey } from "../../lib/inheritance/utils";

export default function HistoryDetailScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const result: CalculationResult = route.params?.result;

  if (!result) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background.light },
        ]}
      >
        <AnimatedHeader
          title={t("history.detail")}
          leftIcon="arrow-back"
          onLeftPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const total = result.shares.reduce((sum, s) => sum + s.amount, 0);
  const confidenceColor =
    result.confidence > 95
      ? theme.colors.success.main
      : result.confidence > 80
        ? theme.colors.warning.main
        : theme.colors.error.main;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.light },
      ]}
    >
      <AnimatedHeader
        title={result.madhhabName}
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary */}
        <Card variant="elevated" style={styles.card}>
          <View style={styles.summaryRow}>
            <View>
              <Text
                style={[
                  styles.summaryLabel,
                  {
                    color: theme.colors.neutral.light400,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {t("results.totalDistribution")}
              </Text>
              <Text
                style={[
                  styles.summaryAmount,
                  {
                    color: theme.colors.neutral.dark300,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {formatCurrency(total)}
              </Text>
            </View>
            <View style={[styles.confidence, { borderColor: confidenceColor }]}>
              <Text
                style={[
                  styles.confidenceText,
                  {
                    color: confidenceColor,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {Math.round(result.confidence)}%
              </Text>
            </View>
          </View>
          <View style={styles.badges}>
            <Badge
              label={result.madhhabName}
              color={theme.colors.primary.main}
              size="sm"
            />
            {result.awlApplied && (
              <Badge
                label={t("results.awlApplied")}
                color={theme.colors.warning.main}
                size="sm"
              />
            )}
            {result.raddApplied && (
              <Badge
                label={t("results.raddApplied")}
                color={theme.colors.info.main}
                size="sm"
              />
            )}
          </View>
        </Card>

        {/* Distribution */}
        <Card variant="elevated" style={styles.card}>
          <SectionHeader title={t("results.title")} />
          {result.shares.map((share, i) => {
            const pct = total > 0 ? (share.amount / total) * 100 : 0;
            return (
              <View
                key={i}
                style={[
                  styles.shareRow,
                  { borderBottomColor: theme.colors.neutral.light100 },
                ]}
              >
                <View style={styles.shareInfo}>
                  <Text
                    style={[
                      styles.shareName,
                      {
                        color: theme.colors.neutral.dark200,
                        fontFamily: theme.fontFamily.english,
                      },
                    ]}
                  >
                    {share.key ? t(`heirs.${getHeirI18nKey(share.key)}`) : share.name}
                  </Text>
                  <Text
                    style={[
                      styles.sharePct,
                      {
                        color: theme.colors.primary.main,
                        fontFamily: theme.fontFamily.english,
                      },
                    ]}
                  >
                    {formatPercentage(pct)}
                    {share.fraction
                      ? ` (${share.fraction.numerator}/${share.fraction.denominator})`
                      : ""}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.shareAmount,
                    {
                      color: theme.colors.neutral.dark300,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
                >
                  {formatCurrency(share.amount)}
                </Text>
              </View>
            );
          })}
        </Card>

        {/* Steps */}
        {result.steps.length > 0 && (
          <Card variant="elevated" style={styles.card}>
            <SectionHeader title={t("results.calculationSteps")} />
            {result.steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View
                  style={[
                    styles.stepNum,
                    { backgroundColor: theme.colors.primary.main },
                  ]}
                >
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepTitle,
                      {
                        color: theme.colors.neutral.dark200,
                        fontFamily: theme.fontFamily.english,
                      },
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text
                    style={[
                      styles.stepDesc,
                      {
                        color: theme.colors.neutral.light400,
                        fontFamily: theme.fontFamily.english,
                      },
                    ]}
                  >
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  card: { marginBottom: 16 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: 12, marginBottom: 4 },
  summaryAmount: { fontSize: 24, fontWeight: "800" },
  confidence: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  confidenceText: { fontSize: 13, fontWeight: "700" },
  badges: { flexDirection: "row", gap: 6, marginTop: 12, flexWrap: "wrap" },
  shareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  shareInfo: { flex: 1 },
  shareName: { fontSize: 13, fontWeight: "600", marginBottom: 2 },
  sharePct: { fontSize: 11, fontWeight: "500" },
  shareAmount: { fontSize: 14, fontWeight: "700" },
  stepRow: { flexDirection: "row", paddingVertical: 8, gap: 10 },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 12, fontWeight: "600", marginBottom: 2 },
  stepDesc: { fontSize: 11, lineHeight: 16 },
});
