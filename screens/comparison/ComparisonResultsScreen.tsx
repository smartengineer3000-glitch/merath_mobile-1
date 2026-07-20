import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import { Card, SectionHeader, Badge } from "../../components/ui";
import { formatCurrency } from "../../lib/utils/formatters";
import type { CalculationResult } from "../../lib/inheritance/types";
import { MADHAB_COLORS, getHeirI18nKey } from "../../lib/inheritance/utils";

const SCREEN_WIDTH = Dimensions.get("window").width;

const MADHAB_COLUMN_BG: Record<string, string> = {
  shafii: "#ecfdf5",
  hanafi: "#fef2f2",
  maliki: "#faf5ff",
  hanbali: "#eff6ff",
};

const MADHAB_COLUMN_BORDER: Record<string, string> = {
  shafii: "#a7f3d0",
  hanafi: "#fecaca",
  maliki: "#ddd6fe",
  hanbali: "#bfdbfe",
};

export default function ComparisonResultsScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const results: CalculationResult[] = route.params?.results || [];

  if (results.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background.light },
        ]}
      >
        <AnimatedHeader
          title={t("comparison.comparisonResults")}
          leftIcon="arrow-back"
          onLeftPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const allHeirs = getAllHeirs(results);
  const differences = computeDifferences(results, allHeirs);
  const hasDifferences = differences.length > 0;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.light },
      ]}
    >
      <AnimatedHeader
        title={t("comparison.comparisonResults")}
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview cards */}
        <View style={styles.overviewRow}>
          {results.map((r, i) => {
            const total = r.shares.reduce((sum, s) => sum + s.amount, 0);
            return (
              <Card key={i} variant="elevated" style={styles.overviewCard}>
                <View style={styles.overviewHeader}>
                  <View
                    style={[
                      styles.overviewDot,
                      {
                        backgroundColor:
                          MADHAB_COLORS[r.madhab] || theme.colors.primary.main,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.overviewMadhabName,
                      {
                        color: theme.colors.neutral.dark200,
                        fontFamily: theme.fontFamily.english,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {r.madhhabName}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.overviewAmount,
                    {
                      color: theme.colors.neutral.dark300,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {formatCurrency(total)}
                </Text>
                <Text
                  style={[
                    styles.overviewShares,
                    {
                      color: theme.colors.neutral.light400,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
                >
                  {r.shares.length} {t("results.shares")}
                </Text>
              </Card>
            );
          })}
        </View>

        {/* Comparison Table */}
        <Card variant="elevated" style={styles.card}>
          <SectionHeader title={t("comparison.shareComparison")} />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tableScroll}
          >
            <View style={styles.tableContainer}>
              {/* Header row */}
              <View style={styles.tableHeaderRow}>
                <View
                  style={[
                    styles.headerCell,
                    styles.colHeir,
                    { backgroundColor: theme.colors.primary.main },
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.headerText,
                      { fontFamily: theme.fontFamily.english },
                    ]}
                  >
                    {t("comparison.heir")}
                  </Text>
                </View>
                {results.map((r, i) => {
                  const bgColor =
                    MADHAB_COLUMN_BG[r.madhab] || theme.colors.neutral.light50;
                  const borderColor =
                    MADHAB_COLUMN_BORDER[r.madhab] || "#e5e7eb";
                  const textColor =
                    MADHAB_COLORS[r.madhab] || theme.colors.primary.main;
                  return (
                    <View
                      key={i}
                      style={[
                        styles.headerCell,
                        styles.colMadhab,
                        { backgroundColor: bgColor, borderColor },
                      ]}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.headerText,
                          {
                            color: textColor,
                            fontFamily: theme.fontFamily.english,
                          },
                        ]}
                      >
                        {r.madhhabName}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Sub-header row */}
              <View style={styles.subHeaderRow}>
                <View style={[styles.subHeaderCell, styles.colHeir]} />
                {results.map((r, i) => {
                  const bgColor =
                    MADHAB_COLUMN_BG[r.madhab] || theme.colors.neutral.light50;
                  return (
                    <View
                      key={i}
                      style={[
                        styles.subHeaderCell,
                        styles.colMadhab,
                        { backgroundColor: bgColor + "80" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subHeaderText,
                          { fontFamily: theme.fontFamily.english },
                        ]}
                      >
                        {t("results.fraction")} / {t("results.amount")}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Data rows */}
              {allHeirs.map((heirKey, rowIdx) => {
                const isEven = rowIdx % 2 === 0;
                return (
                  <View
                    key={heirKey}
                    style={[
                      styles.tableRow,
                      {
                        backgroundColor: isEven
                          ? theme.colors.background.light
                          : theme.colors.neutral.light50,
                        borderBottomColor: theme.colors.neutral.light100,
                      },
                    ]}
                  >
                    {/* Heir name */}
                    <View style={[styles.cellWrapper, styles.colHeir]}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.heirName,
                          {
                            color: theme.colors.primary.main,
                            fontFamily: theme.fontFamily.english,
                          },
                        ]}
                      >
                        {t(`heirs.${getHeirI18nKey(heirKey)}`)}
                      </Text>
                    </View>

                    {/* Madhab cells */}
                    {results.map((r, j) => {
                      const share = r.shares.find((s) => s.key === heirKey);
                      const bgColor =
                        MADHAB_COLUMN_BG[r.madhab] ||
                        theme.colors.neutral.light50;
                      const borderColor =
                        MADHAB_COLUMN_BORDER[r.madhab] || "#e5e7eb";

                      if (!share) {
                        return (
                          <View
                            key={j}
                            style={[
                              styles.cellWrapper,
                              styles.colMadhab,
                              styles.cellEmpty,
                              { backgroundColor: bgColor + "60", borderColor },
                            ]}
                          >
                            <Text
                              style={[
                                styles.cellDash,
                                { fontFamily: theme.fontFamily.english },
                              ]}
                            >
                              -
                            </Text>
                          </View>
                        );
                      }

                      const fractionStr = share.fraction
                        ? `${share.fraction.numerator}/${share.fraction.denominator}`
                        : "-";

                      return (
                        <View
                          key={j}
                          style={[
                            styles.cellWrapper,
                            styles.colMadhab,
                            { backgroundColor: bgColor + "40", borderColor },
                          ]}
                        >
                          <Text
                            style={[
                              styles.cellFraction,
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
                              styles.cellAmount,
                              {
                                color: theme.colors.neutral.dark300,
                                fontFamily: theme.fontFamily.english,
                              },
                            ]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                          >
                            {formatCurrency(share.amount)}
                          </Text>
                          <Text
                            style={[
                              styles.cellPercent,
                              {
                                color: theme.colors.neutral.light400,
                                fontFamily: theme.fontFamily.english,
                              },
                            ]}
                          >
                            {share.percentage != null
                              ? `${share.percentage.toFixed(1)}%`
                              : ""}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                );
              })}

              {/* Total row */}
              <View
                style={[
                  styles.totalRow,
                  { backgroundColor: theme.colors.primary.main + "12" },
                ]}
              >
                <View style={[styles.cellWrapper, styles.colHeir]}>
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
                </View>
                {results.map((r, i) => {
                  const total = r.shares.reduce((sum, s) => sum + s.amount, 0);
                  const bgColor =
                    MADHAB_COLUMN_BG[r.madhab] || theme.colors.neutral.light50;
                  return (
                    <View
                      key={i}
                      style={[
                        styles.cellWrapper,
                        styles.colMadhab,
                        styles.cellTotal,
                        { backgroundColor: bgColor + "60" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.totalAmount,
                          {
                            color: theme.colors.primary.dark,
                            fontFamily: theme.fontFamily.english,
                          },
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                      >
                        {formatCurrency(total)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </Card>

        {/* Differences section */}
        {hasDifferences && (
          <Card variant="elevated" style={styles.card}>
            <SectionHeader title={t("comparison.differences")} />
            {differences.map((diff, i) => (
              <View
                key={i}
                style={[
                  styles.diffRow,
                  {
                    backgroundColor: diff.isSignificant
                      ? theme.colors.warning.light + "30"
                      : theme.colors.neutral.light50,
                    borderLeftColor: diff.isSignificant
                      ? theme.colors.warning.main
                      : theme.colors.neutral.light200,
                  },
                ]}
              >
                <View style={styles.diffHeader}>
                  <Text
                    style={[
                      styles.diffHeirName,
                      {
                        color: theme.colors.neutral.dark200,
                        fontFamily: theme.fontFamily.english,
                      },
                    ]}
                  >
                    {t(`heirs.${getHeirI18nKey(diff.heirKey)}`)}
                  </Text>
                  {diff.isSignificant && (
                    <Badge
                      label={t("comparison.significant")}
                      color={theme.colors.warning.main}
                      size="sm"
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.diffDescription,
                    {
                      color: theme.colors.neutral.light400,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
                >
                  {diff.description}
                </Text>
              </View>
            ))}
          </Card>
        )}

        {!hasDifferences && results.length > 1 && (
          <Card variant="outlined" style={styles.card}>
            <View style={styles.identicalRow}>
              <Text
                style={[
                  styles.identicalText,
                  {
                    color: theme.colors.success.main,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {t("comparison.recommendations.identical")}
              </Text>
            </View>
          </Card>
        )}

        {/* Madhab notes */}
        {results.some((r) => r.madhhabNotes && r.madhhabNotes.length > 0) && (
          <Card variant="elevated" style={styles.card}>
            <SectionHeader title={t("results.fiqhNotes")} />
            {results.map(
              (r, i) =>
                r.madhhabNotes &&
                r.madhhabNotes.length > 0 &&
                r.madhhabNotes.map((note, j) => (
                  <View
                    key={`${i}-${j}`}
                    style={[
                      styles.noteRow,
                      {
                        backgroundColor:
                          (MADHAB_COLUMN_BG[r.madhab] || "#f8f8f8") + "60",
                        borderLeftColor:
                          MADHAB_COLORS[r.madhab] || theme.colors.primary.main,
                      },
                    ]}
                  >
                    <Badge
                      label={r.madhhabName}
                      color={
                        MADHAB_COLORS[r.madhab] || theme.colors.primary.main
                      }
                      size="sm"
                    />
                    <Text
                      style={[
                        styles.noteText,
                        {
                          color: theme.colors.neutral.dark200,
                          fontFamily: theme.fontFamily.english,
                        },
                      ]}
                    >
                      {note}
                    </Text>
                  </View>
                )),
            )}
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getAllHeirs(results: CalculationResult[]): string[] {
  const set = new Set<string>();
  results.forEach((r) =>
    r.shares.forEach((s) => {
      if (s.key) set.add(s.key);
    }),
  );
  return Array.from(set);
}

interface HeirDifference {
  heirKey: string;
  description: string;
  isSignificant: boolean;
  maxDiff: number;
}

function computeDifferences(
  results: CalculationResult[],
  allHeirs: string[],
): HeirDifference[] {
  if (results.length < 2) return [];

  const diffs: HeirDifference[] = [];

  for (const heirKey of allHeirs) {
    const amounts = results
      .map((r) => {
        const share = r.shares.find((s) => s.key === heirKey);
        return share?.amount ?? 0;
      })
      .filter((a) => a > 0);

    if (amounts.length < 2) continue;

    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    const diff = max - min;
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const pctDiff = avgAmount > 0 ? (diff / avgAmount) * 100 : 0;

    if (diff < 0.01) continue;

    const isSignificant = pctDiff > 10 || diff > 1000;
    const heirNames = results
      .map((r) => {
        const share = r.shares.find((s) => s.key === heirKey);
        if (!share) return null;
        return `${r.madhhabName}: ${formatCurrency(share.amount)}`;
      })
      .filter(Boolean);

    diffs.push({
      heirKey,
      description: heirNames.join(" | "),
      isSignificant,
      maxDiff: diff,
    });
  }

  return diffs.sort((a, b) => b.maxDiff - a.maxDiff);
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },

  // Overview cards
  overviewRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  overviewCard: { flex: 1, minWidth: 80 },
  overviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  overviewDot: { width: 8, height: 8, borderRadius: 4 },
  overviewMadhabName: { fontSize: 11, fontWeight: "600", flexShrink: 1 },
  overviewAmount: { fontSize: 13, fontWeight: "800", marginTop: 4 },
  overviewShares: { fontSize: 10, marginTop: 2 },

  card: { marginBottom: 16 },

  // Table
  tableScroll: { paddingBottom: 4 },
  tableContainer: {
    minWidth: SCREEN_WIDTH - 64,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  // Header
  tableHeaderRow: {
    flexDirection: "row",
  },
  headerCell: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "#ffffff40",
  },
  headerText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },

  // Sub-header
  subHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  subHeaderCell: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  subHeaderText: {
    fontSize: 9,
    fontWeight: "500",
    color: "#888",
    textAlign: "center",
  },

  // Column widths
  colHeir: { width: 100, alignItems: "flex-start", textAlign: "left" as const },
  colMadhab: {
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "#e0e0e0",
  },

  // Data rows
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
  },
  cellWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    justifyContent: "center",
  },
  cellEmpty: {
    opacity: 0.5,
  },
  cellDash: {
    fontSize: 12,
    color: "#ccc",
    textAlign: "center",
  },

  // Heir name cell
  heirName: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "left",
  },

  // Madhab cell
  cellFraction: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  cellAmount: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 2,
  },
  cellPercent: {
    fontSize: 9,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 1,
  },

  // Total row
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cellTotal: {
    justifyContent: "center",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "left",
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },

  // Differences
  diffRow: {
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  diffHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  diffHeirName: { fontSize: 13, fontWeight: "600" },
  diffDescription: { fontSize: 11, lineHeight: 16 },

  // Identical
  identicalRow: {
    padding: 12,
    alignItems: "center",
  },
  identicalText: { fontSize: 13, fontWeight: "600" },

  // Notes
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  noteText: { fontSize: 12, lineHeight: 18, flex: 1 },
});
