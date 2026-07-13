import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import { Card, SectionHeader, Badge } from "../../components/ui";
import { formatCurrency, formatPercentage } from "../../lib/utils/formatters";
import type { CalculationResult } from "../../lib/inheritance/types";

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
                  color={theme.colors.primary.main}
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
                  {formatCurrency(total)} {t("common.currency")}
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
          <View
            style={[
              styles.tableHeader,
              { backgroundColor: theme.colors.primary.main },
            ]}
          >
            <Text
              style={[
                styles.tableHeaderCell,
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
                  styles.tableCellValue,
                  { fontFamily: theme.fontFamily.english },
                ]}
              >
                {r.madhhabName}
              </Text>
            ))}
          </View>

          {getAllHeirs(results).map((heirName, i) => (
            <View
              key={i}
              style={[
                styles.tableRow,
                { borderBottomColor: theme.colors.neutral.light100 },
              ]}
            >
              <Text
                style={[
                  styles.tableCell,
                  styles.tableCellName,
                  {
                    color: theme.colors.neutral.dark200,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {heirName}
              </Text>
              {results.map((r, j) => {
                const share = r.shares.find((s) => s.name === heirName);
                return (
                  <Text
                    key={j}
                    style={[
                      styles.tableCell,
                      styles.tableCellValue,
                      {
                        color: share
                          ? theme.colors.neutral.dark300
                          : theme.colors.neutral.light400,
                        fontFamily: theme.fontFamily.english,
                      },
                    ]}
                  >
                    {share ? formatCurrency(share.amount) : "-"}
                  </Text>
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
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  tableCell: { flex: 1, fontSize: 11, textAlign: "center" },
  tableCellName: { fontSize: 12, fontWeight: "500", textAlign: "left" },
  tableCellValue: { textAlign: "center" },
});
