import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useAppTheme } from "../../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Card, SectionHeader, Badge } from "../../../components/ui";
import { DonutChart } from "../../../components/charts/DonutChart";
import {
  formatCurrency,
  formatPercentage,
} from "../../../lib/utils/formatters";
import type { CalculationResult } from "../../../lib/inheritance/types";

interface DistributionTabProps {
  result: CalculationResult;
}

export function DistributionTab({ result }: DistributionTabProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const total = result.shares.reduce((sum, s) => sum + s.amount, 0);

  const confidenceColor =
    result.confidence > 95
      ? theme.colors.success.main
      : result.confidence > 80
        ? theme.colors.warning.main
        : theme.colors.error.main;

  return (
    <ScrollView
      contentContainerStyle={styles.tabContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Summary */}
      <Card variant="elevated" style={styles.heroCard}>
        <View style={styles.heroRow}>
          <View style={styles.heroLeft}>
            <Text
              style={[
                styles.heroLabel,
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
                styles.heroAmount,
                {
                  color: theme.colors.neutral.dark300,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {formatCurrency(total)}
            </Text>
          </View>
          <View style={styles.confidenceGroup}>
            <View
              style={[
                styles.confidenceCircle,
                { borderColor: confidenceColor },
              ]}
            >
              <Text
                style={[
                  styles.confidenceValue,
                  {
                    color: confidenceColor,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {Math.round(result.confidence)}%
              </Text>
            </View>
            <Text
              style={[
                styles.confidenceLabel,
                {
                  color: theme.colors.neutral.light400,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {t("results.trustLevel")}
            </Text>
          </View>
        </View>

        <View style={styles.heroBadges}>
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

      {/* Donut Chart */}
      <Card variant="elevated" style={styles.chartCard}>
        <SectionHeader title={t("results.visualDistribution")} />
        <DonutChart
          segments={result.shares
            .filter((s) => s.amount > 0)
            .map((s) => ({
              name: s.name,
              value: s.amount,
              fraction: s.fraction
                ? `${s.fraction.numerator}/${s.fraction.denominator}`
                : undefined,
            }))}
          size={200}
          strokeWidth={32}
          centerValue={formatCurrency(total)}
          centerLabel={t("results.totalDistribution")}
          fontFamily={theme.fontFamily.english}
        />
      </Card>

      {/* Distribution Table */}
      <Card variant="elevated" style={styles.distributionCard}>
        <SectionHeader title={t("results.distributionBreakdown")} />

        <View
          style={[
            styles.headerRow,
            { backgroundColor: theme.colors.primary.main },
          ]}
        >
          <Text
            style={[
              styles.headerCell,
              styles.headerCellName,
              { fontFamily: theme.fontFamily.english },
            ]}
          >
            {t("results.heir")}
          </Text>
          <Text
            style={[
              styles.headerCell,
              { fontFamily: theme.fontFamily.english },
            ]}
          >
            {t("results.fraction")}
          </Text>
          <Text
            style={[
              styles.headerCell,
              { fontFamily: theme.fontFamily.english },
            ]}
          >
            %
          </Text>
          <Text
            style={[
              styles.headerCell,
              { fontFamily: theme.fontFamily.english },
            ]}
          >
            {t("results.amount")}
          </Text>
        </View>

        {result.shares.map((share, index) => {
          const percentage = total > 0 ? (share.amount / total) * 100 : 0;
          const fractionStr = share.fraction
            ? `${share.fraction.numerator}/${share.fraction.denominator}`
            : "-";

          return (
            <View
              key={index}
              style={[
                styles.dataRow,
                {
                  backgroundColor:
                    index % 2 === 0
                      ? theme.colors.background.light
                      : theme.colors.neutral.light50,
                  borderBottomColor: theme.colors.neutral.light100,
                },
              ]}
            >
              <Text
                style={[
                  styles.dataCell,
                  styles.dataCellName,
                  {
                    color: theme.colors.primary.main,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
                numberOfLines={1}
              >
                {share.name}
              </Text>
              <Text
                style={[
                  styles.dataCell,
                  {
                    color: theme.colors.neutral.dark200,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {fractionStr}
              </Text>
              <Text
                style={[
                  styles.dataCell,
                  {
                    color: theme.colors.neutral.dark200,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {formatPercentage(percentage)}
              </Text>
              <Text
                style={[
                  styles.dataCell,
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

      {result.blockedHeirs && result.blockedHeirs.length > 0 && (
        <Card variant="outlined" style={{ marginTop: 12 }}>
          <SectionHeader title={t("results.blockedHeirs")} />
          {result.blockedHeirs.map((heir, i) => (
            <Text
              key={i}
              style={[
                styles.blockedHeir,
                {
                  color: theme.colors.neutral.light400,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {heir}
            </Text>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabContent: { padding: 16, paddingBottom: 32 },
  heroCard: { marginBottom: 16 },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLeft: {},
  heroLabel: { fontSize: 12, fontWeight: "500", marginBottom: 4 },
  heroAmount: { fontSize: 28, fontWeight: "800" },
  confidenceGroup: { alignItems: "center" },
  confidenceCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  confidenceValue: { fontSize: 14, fontWeight: "700" },
  confidenceLabel: { fontSize: 10, fontWeight: "500", marginTop: 4 },
  distributionCard: { marginBottom: 16 },
  chartCard: { marginBottom: 16, alignItems: "center" },
  heroBadges: { flexDirection: "row", gap: 8, marginTop: 12, flexWrap: "wrap" },
  headerRow: {
    flexDirection: "row",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  headerCell: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
  headerCellName: { flex: 1.8, textAlign: "left" },
  dataRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  dataCell: { flex: 1, fontSize: 12, textAlign: "center" },
  dataCellName: {
    flex: 1.8,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "left",
  },
  blockedHeir: { fontSize: 13, paddingVertical: 4 },
});
