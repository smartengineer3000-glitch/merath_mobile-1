import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useAppTheme } from "../../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Card, SectionHeader, Badge } from "../../../components/ui";
import { DonutChart } from "../../../components/charts/DonutChart";
import {
  formatCurrency,
  formatPercentage,
} from "../../../lib/utils/formatters";
import type { CalculationResult } from "../../../lib/inheritance/types";
import { getHeirI18nKey } from "../../../lib/inheritance/utils";

const SCREEN_WIDTH = Dimensions.get("window").width;

const SHARE_TYPE_COLORS: Record<string, string> = {
  فرض: "#2e7d32",
  تعصيب: "#1565c0",
  رد: "#e65100",
  "ذو رحم": "#7b1fa2",
};

const SHARE_TYPE_I18N: Record<string, string> = {
  فرض: "results.typeFard",
  تعصيب: "results.typeAsaba",
};

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
              name: s.key
                ? t(`heirs.${getHeirI18nKey(s.key)}`)
                : s.name,
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tableScroll}
        >
          <View style={styles.tableContainer}>
            {/* Header */}
            <View
              style={[
                styles.headerRow,
                { backgroundColor: theme.colors.primary.main },
              ]}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.headerCell,
                  styles.colHeir,
                  { fontFamily: theme.fontFamily.english },
                ]}
              >
                {t("results.heir")}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.headerCell,
                  styles.colCount,
                  { fontFamily: theme.fontFamily.english },
                ]}
              >
                {t("results.count")}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.headerCell,
                  styles.colType,
                  { fontFamily: theme.fontFamily.english },
                ]}
              >
                {t("results.type")}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.headerCell,
                  styles.colFraction,
                  { fontFamily: theme.fontFamily.english },
                ]}
              >
                {t("results.fraction")}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.headerCell,
                  styles.colPercent,
                  { fontFamily: theme.fontFamily.english },
                ]}
              >
                {t("results.percentage")}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.headerCell,
                  styles.colAmount,
                  { fontFamily: theme.fontFamily.english },
                ]}
              >
                {t("results.amount")}
              </Text>
            </View>

            {/* Data Rows */}
            {result.shares.map((share, index) => {
              const percentage =
                total > 0 ? (share.amount / total) * 100 : 0;
              const fractionStr = share.fraction
                ? `${share.fraction.numerator}/${share.fraction.denominator}`
                : "-";
              const isEven = index % 2 === 0;
              const rowBg = isEven
                ? theme.colors.background.light
                : theme.colors.neutral.light50;
              const shareTypeColor =
                SHARE_TYPE_COLORS[share.type || ""] ||
                theme.colors.neutral.light400;
              const typeI18nKey = SHARE_TYPE_I18N[share.type || ""];
              const typeLabel = typeI18nKey
                ? t(typeI18nKey)
                : share.type || "-";

              const hasMultiple = (share.count ?? 0) > 1;
              const heirLabel = share.key
                ? t(`heirs.${getHeirI18nKey(share.key)}`)
                : share.name;

              return (
                <React.Fragment key={index}>
                  {/* Main share row */}
                  <View
                    style={[
                      styles.dataRow,
                      {
                        backgroundColor: rowBg,
                        borderBottomColor: theme.colors.neutral.light100,
                      },
                    ]}
                  >
                    {/* Heir name + reason */}
                    <View style={[styles.cellWrapper, styles.colHeir]}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.heirName,
                          {
                            color: theme.colors.neutral.dark200,
                            fontFamily: theme.fontFamily.english,
                          },
                        ]}
                      >
                        {heirLabel}
                        {hasMultiple ? ` (${share.count})` : ""}
                      </Text>
                      {share.reason && (
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={[
                            styles.heirReason,
                            {
                              color: theme.colors.neutral.light400,
                              fontFamily: theme.fontFamily.english,
                            },
                          ]}
                        >
                          {share.reason}
                        </Text>
                      )}
                    </View>

                    {/* Count */}
                    <View style={[styles.cellWrapper, styles.colCount]}>
                      <Text
                        style={[
                          styles.cellText,
                          {
                            color: theme.colors.neutral.dark200,
                            fontFamily: theme.fontFamily.english,
                          },
                        ]}
                      >
                        {share.count ?? 1}
                      </Text>
                    </View>

                    {/* Type badge */}
                    <View style={[styles.cellWrapper, styles.colType]}>
                      <View
                        style={[
                          styles.typeBadge,
                          { backgroundColor: shareTypeColor + "18" },
                        ]}
                      >
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.typeBadgeText,
                            { color: shareTypeColor },
                          ]}
                        >
                          {typeLabel}
                        </Text>
                      </View>
                    </View>

                    {/* Fraction */}
                    <View style={[styles.cellWrapper, styles.colFraction]}>
                      <Text
                        style={[
                          styles.cellText,
                          {
                            color: theme.colors.primary.main,
                            fontFamily: theme.fontFamily.english,
                            fontWeight: "600",
                          },
                        ]}
                      >
                        {fractionStr}
                      </Text>
                    </View>

                    {/* Percentage */}
                    <View style={[styles.cellWrapper, styles.colPercent]}>
                      <Text
                        style={[
                          styles.cellText,
                          {
                            color: theme.colors.neutral.dark200,
                            fontFamily: theme.fontFamily.english,
                          },
                        ]}
                      >
                        {formatPercentage(percentage)}
                      </Text>
                    </View>

                    {/* Amount */}
                    <View style={[styles.cellWrapper, styles.colAmount]}>
                      <Text
                        style={[
                          styles.cellText,
                          styles.amountText,
                          {
                            color: theme.colors.neutral.dark300,
                            fontFamily: theme.fontFamily.english,
                          },
                        ]}
                      >
                        {formatCurrency(share.amount)}
                      </Text>
                    </View>
                  </View>

                  {/* Per-person sub-row */}
                  {hasMultiple && share.shares && share.shares.length > 0 && (
                    <View
                      style={[
                        styles.perPersonRow,
                        {
                          backgroundColor:
                            theme.colors.neutral.light50 + "80",
                          borderBottomColor: theme.colors.neutral.light100,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.perPersonText,
                          {
                            color: theme.colors.neutral.light400,
                            fontFamily: theme.fontFamily.english,
                          },
                        ]}
                      >
                        {t("results.perPerson")}:{" "}
                        {formatCurrency(share.shares[0].amount)}
                      </Text>
                    </View>
                  )}
                </React.Fragment>
              );
            })}

            {/* Total row */}
            <View
              style={[
                styles.totalRow,
                { backgroundColor: theme.colors.primary.main + "12" },
              ]}
            >
              <Text
                style={[
                  styles.totalLabel,
                  {
                    color: theme.colors.primary.dark,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {t("results.totalRow")}
              </Text>
              <Text
                style={[
                  styles.totalPercent,
                  {
                    color: theme.colors.primary.dark,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                100%
              </Text>
              <Text
                style={[
                  styles.totalAmount,
                  {
                    color: theme.colors.primary.dark,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {formatCurrency(total)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </Card>

      {/* Blocked Heirs */}
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

  // Table
  tableScroll: { paddingBottom: 4 },
  tableContainer: {
    minWidth: SCREEN_WIDTH - 64,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  headerCell: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    paddingHorizontal: 2,
  },

  // Column widths (total ~520px, scrollable on narrow screens)
  colHeir: { width: 130, alignItems: "flex-start", textAlign: "left" as const },
  colCount: { width: 44 },
  colType: { width: 68 },
  colFraction: { width: 60 },
  colPercent: { width: 64 },
  colAmount: { width: 120, alignItems: "flex-end", textAlign: "right" as const },

  // Data rows
  dataRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
  },
  cellWrapper: {
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  cellText: {
    fontSize: 11,
    textAlign: "center",
  },
  amountText: {
    fontWeight: "700",
    fontSize: 12,
    textAlign: "right",
  },

  // Heir name cell
  heirName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "left",
  },
  heirReason: {
    fontSize: 9,
    textAlign: "left",
    marginTop: 1,
  },

  // Type badge
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "center",
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
  },

  // Per-person sub-row
  perPersonRow: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  perPersonText: {
    fontSize: 10,
    fontStyle: "italic",
  },

  // Total row
  totalRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  totalLabel: {
    flex: 1.5,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "left",
  },
  totalPercent: {
    width: 64,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  totalAmount: {
    width: 120,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
  },

  blockedHeir: { fontSize: 13, paddingVertical: 4, flexShrink: 1 },
});
