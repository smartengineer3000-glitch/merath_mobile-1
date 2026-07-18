import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import { Card, SectionHeader, Badge } from "../../components/ui";
import { formatCurrency, formatPercentage } from "../../lib/utils/formatters";
import type { CalculationResult } from "../../lib/inheritance/types";
import { MADHAB_COLORS } from "../../lib/inheritance/utils";

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
                <Badge
                  label={r.madhhabName}
                  color={MADHAB_COLORS[r.madhab] || theme.colors.primary.main}
                  size="sm"
                />
                <Text
                  style={[
                    styles.overviewAmount,
                    {
                      color: theme.colors.neutral.dark300,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
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
                  {r.shares.length} {t("history.shares")}
                </Text>
              </Card>
            );
          })}
        </View>

        {/* Per-heir comparison table */}
        <Card variant="elevated" style={styles.card}>
          <SectionHeader title={t("comparison.shareComparison")} />

          {/* Header */}
          <View
            style={[
              styles.tableHeader,
              { backgroundColor: theme.colors.primary.main },
            ]}
          >
            <Text
              style={[
                styles.tableHeaderCell,
                styles.tableHeaderCellName,
                { fontFamily: theme.fontFamily.english },
              ]}
            >
              {t("comparison.heir")}
            </Text>
            {results.map((r, i) => (
              <Text
                key={i}
                style={[
                  styles.tableHeaderCell,
                  { fontFamily: theme.fontFamily.english },
                ]}
              >
                {r.madhhabName}
              </Text>
            ))}
          </View>

          {/* Fraction sub-header */}
          <View
            style={[
              styles.subHeaderRow,
              { backgroundColor: theme.colors.neutral.light50 },
            ]}
          >
            <Text
              style={[
                styles.subHeaderText,
                { fontFamily: theme.fontFamily.english },
              ]}
            />
            {results.map((_, i) => (
              <Text
                key={i}
                style={[
                  styles.subHeaderText,
                  { fontFamily: theme.fontFamily.english },
                ]}
              >
                {t("results.fraction")} / %
              </Text>
            ))}
          </View>

          {/* Heir rows */}
          {allHeirs.map((heirName, i) => (
            <View
              key={i}
              style={[
                styles.tableRow,
                {
                  backgroundColor:
                    i % 2 === 0
                      ? theme.colors.background.light
                      : theme.colors.neutral.light50,
                  borderBottomColor: theme.colors.neutral.light100,
                },
              ]}
            >
              <Text
                style={[
                  styles.tableCell,
                  styles.tableCellName,
                  {
                    color: theme.colors.primary.main,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
                numberOfLines={1}
              >
                {heirName}
              </Text>
              {results.map((r, j) => {
                const share = r.shares.find((s) => s.name === heirName);
                if (!share) {
                  return (
                    <Text
                      key={j}
                      style={[
                        styles.tableCell,
                        {
                          color: theme.colors.neutral.light400,
                          fontFamily: theme.fontFamily.english,
                        },
                      ]}
                    >
                      -
                    </Text>
                  );
                }
                const total = r.shares.reduce((sum, s) => sum + s.amount, 0);
                const percentage = total > 0 ? (share.amount / total) * 100 : 0;
                const fractionStr = share.fraction
                  ? `${share.fraction.numerator}/${share.fraction.denominator}`
                  : "-";

                return (
                  <View key={j} style={styles.tableCell}>
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
                    >
                      {formatPercentage(percentage)}
                    </Text>
                    <Text
                      style={[
                        styles.cellAmount,
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
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

function getAllHeirs(results: CalculationResult[]): string[] {
  const set = new Set<string>();
  results.forEach((r) => r.shares.forEach((s) => set.add(s.name)));
  return Array.from(set);
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  overviewRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  overviewCard: { flex: 1 },
  overviewAmount: { fontSize: 14, fontWeight: "700", marginTop: 8 },
  overviewShares: { fontSize: 11, marginTop: 2 },
  card: { marginBottom: 16 },
  tableHeader: {
    flexDirection: "row",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
  tableHeaderCellName: { flex: 1.5, textAlign: "left" },
  subHeaderRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  subHeaderText: {
    flex: 1,
    fontSize: 9,
    fontWeight: "500",
    textAlign: "center",
    color: "#888",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  tableCell: { flex: 1, alignItems: "center" },
  tableCellName: { flex: 1.5, alignItems: "flex-start" },
  cellFraction: { fontSize: 11, fontWeight: "500", textAlign: "center" },
  cellAmount: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 1,
  },
});
