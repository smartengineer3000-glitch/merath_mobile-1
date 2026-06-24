import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PressableScale } from "../components/ui/PressableScale";
import { useAppTheme } from "../lib/context/ThemeProvider";
import { useCalculator } from "../lib/hooks/useCalculator";
import { Card } from "../components/ui/Card";
import type { Theme } from "../lib/design/theme";
import type {
  EstateData,
  HeirsData,
  MadhhabType,
} from "../lib/inheritance/types";
import { formatCurrency } from "../lib/utils/formatters";

type TestStatus = "pending" | "passed" | "failed";
type Filter = "all" | "passed" | "failed";

type RealTestCase = {
  id: string;
  title: string;
  estate: EstateData;
  heirs: HeirsData;
  madhab: MadhhabType;
  expectedHeirs: number;
  status: TestStatus;
  notes: string;
};

const TEST_CASES: RealTestCase[] = [
  {
    id: "standard",
    title: "Standard Inheritance",
    estate: { total: 100000, funeral: 5000, debts: 10000, will: 2000 },
    heirs: { wife: 1, father: 1, mother: 1, son: 2, daughter: 3 },
    madhab: "shafii",
    expectedHeirs: 8,
    status: "pending",
    notes: "Spouse, parents, sons, and daughters after deductions.",
  },
  {
    id: "parents-spouse",
    title: "Spouse + Parents",
    estate: { total: 50000, funeral: 0, debts: 0, will: 0 },
    heirs: { husband: 1, father: 1, mother: 1 },
    madhab: "hanafi",
    expectedHeirs: 3,
    status: "pending",
    notes: "Classic Umariyyah-style validation scenario.",
  },
  {
    id: "complex",
    title: "Complex Distribution",
    estate: { total: 200000, funeral: 8000, debts: 12000, will: 10000 },
    heirs: { wife: 1, mother: 1, father: 1, son: 4, daughter: 5 },
    madhab: "maliki",
    expectedHeirs: 12,
    status: "pending",
    notes: "Larger family structure for stress-testing row totals.",
  },
];

const heirCount = (heirs: HeirsData) =>
  Object.values(heirs).reduce<number>((sum, value) => sum + (value ?? 0), 0);

const madhhabLabel = (madhab: MadhhabType) =>
  ({
    hanafi: "Hanafi",
    maliki: "Maliki",
    shafii: "Shafi'i",
    hanbali: "Hanbali",
  })[madhab];

export default function TestScreen() {
  const { theme } = useAppTheme();
  const { calculateWithEstate } = useCalculator();
  const [filter, setFilter] = useState<Filter>("all");
  const [cases, setCases] = useState(TEST_CASES);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const styles = createStyles(theme);

  const runCase = useCallback(
    async (testCase: RealTestCase) => {
      const result = await calculateWithEstate(
        testCase.madhab,
        testCase.estate,
        testCase.heirs,
      );
      const distributed = result.success
        ? result.shares.reduce((sum, share) => sum + share.amount, 0)
        : 0;
      const netEstate = Math.max(
        0,
        testCase.estate.total -
          testCase.estate.funeral -
          testCase.estate.debts -
          testCase.estate.will,
      );
      const passed = result.success && Math.abs(distributed - netEstate) < 1;
      setCases((current) =>
        current.map((item) =>
          item.id === testCase.id
            ? { ...item, status: passed ? "passed" : "failed" }
            : item,
        ),
      );
    },
    [calculateWithEstate],
  );

  const runAll = useCallback(async () => {
    for (const testCase of cases) {
      await runCase(testCase);
    }
  }, [cases, runCase]);

  const visibleCases = useMemo(
    () => cases.filter((item) => filter === "all" || item.status === filter),
    [cases, filter],
  );
  const passed = cases.filter((item) => item.status === "passed").length;
  const failed = cases.filter((item) => item.status === "failed").length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={24}
            color={theme.colors.primary.main}
          />
          <Text style={styles.title}>Real Test Cases</Text>
        </View>
        <Text style={styles.subtitle}>
          Run real-world inheritance scenarios against the calculator engine.
        </Text>
      </View>

      <View style={styles.filterRow}>
        {(["all", "passed", "failed"] as const).map((value) => (
          <PressableScale
            key={value}
            style={[
              styles.filterButton,
              filter === value && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(value)}
            haptic="light"
            scaleTo={0.95}
          >
            <Text
              style={[
                styles.filterText,
                filter === value && styles.filterTextActive,
              ]}
            >
              {value === "all"
                ? "All"
                : value === "passed"
                  ? "Passed"
                  : "Failed"}
            </Text>
          </PressableScale>
        ))}
      </View>

      {visibleCases.map((testCase, index) => (
        <Card key={testCase.id} style={styles.card}>
          <View style={styles.caseHeader}>
            <Text style={styles.cardTitle}>
              Test Case {index + 1}: {testCase.title}
            </Text>
            <Text
              style={[
                styles.status,
                testCase.status === "passed" && styles.passed,
                testCase.status === "failed" && styles.failed,
              ]}
            >
              {testCase.status === "passed"
                ? "Passed"
                : testCase.status === "failed"
                  ? "Failed"
                  : "Pending"}
            </Text>
          </View>
          <View style={styles.metaGrid}>
            <Text style={styles.meta}>
              Estate: {formatCurrency(testCase.estate.total)}
            </Text>
            <Text style={styles.meta}>Heirs: {heirCount(testCase.heirs)}</Text>
            <Text style={styles.meta}>
              Madhhab: {madhhabLabel(testCase.madhab)}
            </Text>
            <Text style={styles.meta}>Expected: {testCase.expectedHeirs}</Text>
          </View>
          {expandedId === testCase.id && (
            <Text style={styles.details}>{testCase.notes}</Text>
          )}
          <View style={styles.actions}>
            <PressableScale
              style={styles.actionButton}
              onPress={() => runCase(testCase)}
              haptic="light"
              scaleTo={0.95}
            >
              <MaterialCommunityIcons
                name="play"
                size={18}
                color={theme.colors.background.light}
              />
              <Text style={styles.actionText}>Run Test</Text>
            </PressableScale>
            <PressableScale
              style={styles.secondaryAction}
              onPress={() =>
                setExpandedId(expandedId === testCase.id ? null : testCase.id)
              }
              haptic="light"
              scaleTo={0.95}
            >
              <Text style={styles.secondaryActionText}>View Details</Text>
            </PressableScale>
          </View>
        </Card>
      ))}

      <Card style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Test Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Total: {cases.length}</Text>
          <Text style={styles.summaryText}>Passed: {passed}</Text>
          <Text style={styles.summaryText}>Failed: {failed}</Text>
        </View>
      </Card>

      <PressableScale
        style={styles.runAllButton}
        onPress={runAll}
        haptic="medium"
        scaleTo={0.95}
      >
        <Text style={styles.runAllText}>RUN ALL TESTS</Text>
      </PressableScale>
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.lightVariant,
    },
    content: { padding: 16, paddingBottom: 32 },
    header: { marginBottom: 16 },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.primary.main,
    },
    subtitle: {
      fontSize: 15,
      color: theme.colors.neutral.main,
      marginTop: 6,
      lineHeight: 22,
    },
    filterRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
    filterButton: {
      flex: 1,
      padding: 10,
      borderRadius: 999,
      alignItems: "center",
      backgroundColor: theme.colors.background.light,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light300,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary.main,
      borderColor: theme.colors.primary.main,
    },
    filterText: { color: theme.colors.neutral.dark300, fontWeight: "600" },
    filterTextActive: { color: theme.colors.background.light },
    card: { marginBottom: 14 },
    caseHeader: { gap: 8, marginBottom: 12 },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.neutral.dark300,
    },
    status: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.colors.neutral.main,
    },
    passed: { color: theme.colors.success.main },
    failed: { color: theme.colors.error.main },
    metaGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 12,
    },
    meta: { width: "47%", color: theme.colors.neutral.dark200, fontSize: 14 },
    details: {
      color: theme.colors.neutral.main,
      lineHeight: 21,
      marginBottom: 12,
    },
    actions: { flexDirection: "row", gap: 10 },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      backgroundColor: theme.colors.primary.main,
      padding: 12,
      borderRadius: 8,
    },
    actionText: { color: theme.colors.background.light, fontWeight: "bold" },
    secondaryAction: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.primary.main,
      borderRadius: 8,
    },
    secondaryActionText: {
      color: theme.colors.primary.main,
      fontWeight: "bold",
    },
    summaryCard: { marginBottom: 16 },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
    },
    summaryText: { color: theme.colors.neutral.dark300, fontWeight: "700" },
    runAllButton: {
      backgroundColor: theme.colors.primary.main,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
    },
    runAllText: {
      color: theme.colors.background.light,
      fontWeight: "bold",
      fontSize: 16,
    },
  });
