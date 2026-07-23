import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import { Card, Badge, Button } from "../../components/ui";
import { Ionicons } from "../../lib/icons";
import { EnhancedInheritanceCalculationEngine } from "../../lib/inheritance/enhanced-engine-complete";
import type {
  EstateData,
  HeirsData,
  MadhhabType,
} from "../../lib/inheritance/types";

interface TestCase {
  id: string;
  name: string;
  category: "simple" | "moderate" | "complex" | "special" | "fiqh";
  madhab: MadhhabType;
  heirs: HeirsData;
  expected: Record<string, number>;
  tolerance?: number;
}

interface TestResult {
  id: string;
  name: string;
  category: string;
  madhab: string;
  passed: boolean;
  computed: Record<string, number>;
  expected: Record<string, number>;
  error?: string;
  awlApplied: boolean;
  raddApplied: boolean;
}

const E: EstateData = { total: 120000, funeral: 0, debts: 0, will: 0 };
const ALL_MADHHABS: MadhhabType[] = ["shafii", "hanafi", "maliki", "hanbali"];

function buildTestCases(): TestCase[] {
  const cases: TestCase[] = [];
  let id = 0;

  const add = (
    name: string,
    category: TestCase["category"],
    madhab: MadhhabType,
    heirs: HeirsData,
    expected: Record<string, number>,
    tolerance = 50,
  ) => {
    cases.push({
      id: String(id++),
      name,
      category,
      madhab,
      heirs,
      expected,
      tolerance,
    });
  };

  // ── SIMPLE ──
  for (const m of ALL_MADHHABS) {
    const isRadd = m === "hanafi" || m === "hanbali";
    add(
      `S1 [${m}]: Wife only`,
      "simple",
      m,
      { wife: 1 },
      { wife: isRadd ? 120000 : 30000 },
    );
    add(
      `S2 [${m}]: Husband only`,
      "simple",
      m,
      { husband: 1 },
      { husband: isRadd ? 120000 : 60000 },
    );
    add(`S3 [${m}]: Son only`, "simple", m, { son: 1 }, { son: 120000 });
    add(
      `S4 [${m}]: Daughter only`,
      "simple",
      m,
      { daughter: 1 },
      { daughter: isRadd ? 120000 : 60000 },
    );
    add(
      `S5 [${m}]: Mother + father`,
      "simple",
      m,
      { mother: 1, father: 1 },
      { mother: 40000, father: 80000 },
    );
    add(
      `S6 [${m}]: Wife + son`,
      "simple",
      m,
      { wife: 1, son: 1 },
      { wife: 15000, son: 105000 },
    );
    add(
      `S7 [${m}]: Husband + daughter`,
      "simple",
      m,
      { husband: 1, daughter: 1 },
      { husband: 30000, daughter: isRadd ? 90000 : 60000 },
    );
    add(
      `S8 [${m}]: Wife + husband + son`,
      "simple",
      m,
      { wife: 1, husband: 1, son: 1 },
      { wife: 15000, husband: 30000, son: 75000 },
    );
    add(
      `S9 [${m}]: Son + 2 daughters`,
      "simple",
      m,
      { son: 1, daughter: 2 },
      { son: 60000, daughter: 60000 },
    );
    add(
      `S10 [${m}]: Wife + mother + father + son`,
      "simple",
      m,
      { wife: 1, mother: 1, father: 1, son: 1 },
      { wife: 15000, mother: 20000, father: 20000, son: 65000 },
    );
  }

  // ── MODERATE ──
  add(
    "M1: Husband + 2 daughters + mother (AWL)",
    "moderate",
    "shafii",
    { husband: 1, daughter: 2, mother: 1 },
    { husband: 27692, daughter: 73846, mother: 18462 },
    100,
  );
  add(
    "M2: Wife + mother + 2 brothers",
    "moderate",
    "shafii",
    { wife: 1, mother: 1, full_brother: 2 },
    { wife: 30000, mother: 20000, full_brother: 70000 },
  );
  add(
    "M3: Husband + mother + brother + sister",
    "moderate",
    "shafii",
    { husband: 1, mother: 1, full_brother: 1, full_sister: 1 },
    { husband: 60000, mother: 20000, full_brother: 26667, full_sister: 13333 },
    100,
  );
  add(
    "M4: Wife + father + mother (Umariyyah)",
    "moderate",
    "shafii",
    { wife: 1, father: 1, mother: 1 },
    { wife: 30000, mother: 30000, father: 60000 },
  );
  add(
    "M5: 4 wives + son",
    "moderate",
    "shafii",
    { wife: 4, son: 1 },
    { wife: 15000, son: 105000 },
  );
  add(
    "M6: Husband + mother + 2 maternal siblings (AWL)",
    "moderate",
    "shafii",
    { husband: 1, mother: 1, maternal_brother: 1, maternal_sister: 1 },
    { husband: 51429, mother: 34286 },
    100,
  );
  add(
    "M7: Wife + father + 2 brothers",
    "moderate",
    "shafii",
    { wife: 1, father: 1, full_brother: 2 },
    { wife: 30000, father: 90000 },
  );
  add(
    "M8: Husband + 2 daughters + mother + father (AWL)",
    "moderate",
    "shafii",
    { husband: 1, daughter: 2, mother: 1, father: 1 },
    { husband: 24000, mother: 16000, father: 16000, daughter: 64000 },
    100,
  );
  add(
    "M9: Wife + grandfather + brother + sister [maliki]",
    "moderate",
    "maliki",
    { wife: 1, grandfather: 1, full_brother: 1, full_sister: 1 },
    {
      wife: 30000,
      grandfather: 40000,
      full_brother: 33333,
      full_sister: 16667,
    },
    100,
  );
  add(
    "M10: Wife + 3 daughters + mother (Shafii — no radd)",
    "moderate",
    "shafii",
    { wife: 1, daughter: 3, mother: 1 },
    { wife: 15000, mother: 20000, daughter: 80000 },
  );

  // ── COMPLEX ──
  add(
    "C1 [shafii]: Umariyyah",
    "complex",
    "shafii",
    { wife: 1, mother: 1, father: 1 },
    { wife: 30000, mother: 30000, father: 60000 },
  );
  add(
    "C1 [maliki]: Umariyyah",
    "complex",
    "maliki",
    { wife: 1, mother: 1, father: 1 },
    { wife: 30000, mother: 20000, father: 70000 },
  );
  add(
    "C2 [hanafi]: Wife radd",
    "complex",
    "hanafi",
    { wife: 1 },
    { wife: 120000 },
  );
  add(
    "C2 [shafii]: Wife no radd",
    "complex",
    "shafii",
    { wife: 1 },
    { wife: 30000 },
  );
  add(
    "C3 [hanafi]: Husband radd",
    "complex",
    "hanafi",
    { husband: 1 },
    { husband: 120000 },
  );
  add(
    "C3 [shafii]: Husband no radd",
    "complex",
    "shafii",
    { husband: 1 },
    { husband: 60000 },
  );
  add(
    "C4a [shafii]: Mother + 1 brother",
    "complex",
    "shafii",
    { mother: 1, full_brother: 1 },
    { mother: 40000, full_brother: 80000 },
  );
  add(
    "C4b [shafii]: Mother + 2 brothers",
    "complex",
    "shafii",
    { mother: 1, full_brother: 2 },
    { mother: 20000, full_brother: 100000 },
  );
  add(
    "C5a [shafii]: 2 daughters (no radd)",
    "complex",
    "shafii",
    { daughter: 2 },
    { daughter: 80000 },
  );
  add(
    "C5b [shafii]: 3 daughters (no radd)",
    "complex",
    "shafii",
    { daughter: 3 },
    { daughter: 80000 },
  );
  add(
    "C6 [shafii]: Grandfather musharak (shares)",
    "complex",
    "shafii",
    { grandfather: 1, full_brother: 1 },
    { grandfather: 60000, full_brother: 60000 },
    100,
  );
  add(
    "C6 [maliki]: Grandfather musharak",
    "complex",
    "maliki",
    { grandfather: 1, full_brother: 1 },
    { grandfather: 60000 },
    100,
  );
  add(
    "C7: Awl complex",
    "complex",
    "shafii",
    { wife: 1, husband: 1, mother: 1, daughter: 2 },
    {},
    200,
  );
  add(
    "C8: Father blocks brother",
    "complex",
    "shafii",
    { husband: 1, father: 1, full_brother: 1 },
    { husband: 60000, father: 60000 },
  );
  add(
    "C9: Awl 2 wives + family",
    "complex",
    "shafii",
    { wife: 2, mother: 1, father: 1, daughter: 2 },
    {},
    200,
  );
  add(
    "C10 [maliki]: Grandfather + 3 brothers",
    "complex",
    "maliki",
    { grandfather: 1, full_brother: 3 },
    { grandfather: 40000, full_brother: 80000 },
  );

  // ── SPECIAL ──
  add(
    "SP1 [shafii]: Musharraka",
    "special",
    "shafii",
    { husband: 1, mother: 1, maternal_brother: 2, full_sister: 1 },
    { husband: 60000, mother: 20000 },
  );
  add(
    "SP2 [shafii]: Akdariyya",
    "special",
    "shafii",
    { husband: 1, mother: 1, grandfather: 1, full_sister: 1 },
    { husband: 40000, mother: 26667, grandfather: 35556, full_sister: 17778 },
    100,
  );
  add(
    "SP3: Dhawu al-Arham (daughter_son)",
    "special",
    "shafii",
    { wife: 1, daughter_son: 1 },
    { wife: 30000, daughter_son: 90000 },
  );
  add(
    "SP4: Dhawu al-Arham (maternal_uncle)",
    "special",
    "shafii",
    { wife: 1, maternal_uncle: 1 },
    { wife: 30000, maternal_uncle: 90000 },
  );
  add(
    "SP5: Dhawu al-Arham (full_nephew)",
    "special",
    "shafii",
    { wife: 1, full_nephew: 1 },
    { wife: 30000, full_nephew: 90000 },
  );
  add(
    "SP6: Dhawu al-Arham (daughter_daughter)",
    "special",
    "shafii",
    { wife: 1, daughter_daughter: 1 },
    { wife: 30000, daughter_daughter: 90000 },
  );
  add(
    "SP7: Grandmother priority (Shafii — no radd)",
    "special",
    "shafii",
    { wife: 1, grandmother_father: 1, grandmother_mother: 1 },
    { wife: 30000, grandmother_father: 20000 },
  );
  add(
    "SP8: Grandmother (Shafii — no radd)",
    "special",
    "shafii",
    { wife: 1, grandmother: 1 },
    { wife: 30000, grandmother: 20000 },
  );
  add(
    "SP9 [hanafi]: Husband radd",
    "special",
    "hanafi",
    { husband: 1 },
    { husband: 120000 },
  );
  add(
    "SP9 [shafii]: Husband no radd",
    "special",
    "shafii",
    { husband: 1 },
    { husband: 60000 },
  );
  add(
    "SP10 [maliki]: Musharak",
    "special",
    "maliki",
    { husband: 1, grandfather: 1, full_brother: 3 },
    { husband: 60000, grandfather: 40000, full_brother: 20000 },
  );

  // ── FIQH VALIDATION: Radd madhab differences ──
  // Quran/Sunnah: Radd fills surplus when sole heir(s) exist
  // Hanafi/Hanbali: radd applies (even to spouse)
  // Shafii/Maliki: no radd — surplus goes to Bayt al-Mal
  add(
    "FQ1 [hanafi]: Daughter alone — radd fills to full estate",
    "fiqh",
    "hanafi",
    { daughter: 1 },
    { daughter: 120000 },
  );
  add(
    "FQ1 [shafii]: Daughter alone — no radd (1/2 only)",
    "fiqh",
    "shafii",
    { daughter: 1 },
    { daughter: 60000 },
  );
  add(
    "FQ2 [hanafi]: Husband alone — radd fills to full estate",
    "fiqh",
    "hanafi",
    { husband: 1 },
    { husband: 120000 },
  );
  add(
    "FQ2 [shafii]: Husband alone — no radd (1/2 only)",
    "fiqh",
    "shafii",
    { husband: 1 },
    { husband: 60000 },
  );
  add(
    "FQ3 [hanafi]: Wife + daughter — radd to daughter",
    "fiqh",
    "hanafi",
    { wife: 1, daughter: 1 },
    { wife: 15000, daughter: 105000 },
  );
  add(
    "FQ3 [shafii]: Wife + daughter — no radd",
    "fiqh",
    "shafii",
    { wife: 1, daughter: 1 },
    { wife: 15000, daughter: 60000 },
  );
  add(
    "FQ4 [hanafi]: Daughter + mother — radd to both",
    "fiqh",
    "hanafi",
    { daughter: 1, mother: 1 },
    { mother: 30000, daughter: 90000 },
    100,
  );
  add(
    "FQ4 [shafii]: Daughter + mother — no radd",
    "fiqh",
    "shafii",
    { daughter: 1, mother: 1 },
    { mother: 20000, daughter: 60000 },
  );
  add(
    "FQ5 [hanbali]: Wife alone — radd fills",
    "fiqh",
    "hanbali",
    { wife: 1 },
    { wife: 120000 },
  );
  add(
    "FQ5 [maliki]: Wife alone — no radd",
    "fiqh",
    "maliki",
    { wife: 1 },
    { wife: 30000 },
  );

  // ── FIQH VALIDATION: Grandfather musharak vs hijab ──
  // Quran/Sunnah: Grandfather + siblings differ by madhab
  // Hanafi: hijab (grandfather blocks siblings)
  // Shafii/Maliki/Hanbali: musharak (grandfather shares)
  add(
    "FQ6 [hanafi]: Grandfather + brother — hijab (brother blocked)",
    "fiqh",
    "hanafi",
    { grandfather: 1, full_brother: 1 },
    { grandfather: 120000 },
  );
  add(
    "FQ6 [shafii]: Grandfather + brother — musharak (share)",
    "fiqh",
    "shafii",
    { grandfather: 1, full_brother: 1 },
    { grandfather: 60000 },
    100,
  );
  add(
    "FQ6 [maliki]: Grandfather + brother — musharak (share)",
    "fiqh",
    "maliki",
    { grandfather: 1, full_brother: 1 },
    { grandfather: 60000 },
    100,
  );
  add(
    "FQ6 [hanbali]: Grandfather + brother — musharak (share)",
    "fiqh",
    "hanbali",
    { grandfather: 1, full_brother: 1 },
    { grandfather: 60000 },
    100,
  );
  add(
    "FQ7 [hanafi]: Grandfather + sister — hijab (sister blocked)",
    "fiqh",
    "hanafi",
    { grandfather: 1, full_sister: 1 },
    { grandfather: 120000 },
  );
  add(
    "FQ7 [maliki]: Grandfather + sister — musharak (both share)",
    "fiqh",
    "maliki",
    { grandfather: 1, full_sister: 1 },
    { grandfather: 80000, full_sister: 40000 },
    100,
  );

  // ── FIQH VALIDATION: Blood relatives (dhawu al-arham) ──
  // Quran 4:33: distant kindred inherit when no asaba
  add(
    "FQ8: Wife + daughter_son — blood relative inherits (Shafii)",
    "fiqh",
    "shafii",
    { wife: 1, daughter_son: 1 },
    { wife: 30000, daughter_son: 90000 },
  );
  add(
    "FQ9: Wife + maternal_uncle — radd fills wife (Hanafi)",
    "fiqh",
    "hanafi",
    { wife: 1, maternal_uncle: 1 },
    { wife: 120000 },
  );
  add(
    "FQ10: Wife + full_nephew — blood relative inherits (Shafii)",
    "fiqh",
    "shafii",
    { wife: 1, full_nephew: 1 },
    { wife: 30000, full_nephew: 90000 },
  );
  add(
    "FQ11: Blood relative blocked by asaba (son + daughter_son)",
    "fiqh",
    "shafii",
    { son: 1, daughter_son: 1 },
    { son: 120000 },
  );
  add(
    "FQ12: Blood relative blocked by class 1 (daughter_son blocks maternal_uncle)",
    "fiqh",
    "shafii",
    { daughter_son: 1, maternal_uncle: 1 },
    { daughter_son: 120000 },
  );

  // ── FIQH VALIDATION: Grandmother rules ──
  add(
    "FQ13: Mother blocks grandmother",
    "fiqh",
    "shafii",
    { mother: 1, grandmother: 1 },
    { mother: 40000 },
  );
  add(
    "FQ14: Grandmother gets 1/6 when no mother",
    "fiqh",
    "shafii",
    { grandmother: 1 },
    { grandmother: 20000 },
  );

  // ── FIQH VALIDATION: Complex real-world scenarios ──
  add(
    "FQ15: Wife + son + daughter + father + mother (Shafii)",
    "fiqh",
    "shafii",
    { wife: 1, son: 1, daughter: 1, father: 1, mother: 1 },
    { wife: 15000, mother: 20000, father: 20000, son: 43333, daughter: 21667 },
    200,
  );
  add(
    "FQ16: Husband + mother + full brother + full sister (Shafii — Awl)",
    "fiqh",
    "shafii",
    { husband: 1, mother: 1, full_brother: 1, full_sister: 1 },
    { husband: 60000, mother: 20000, full_brother: 26667, full_sister: 13333 },
    100,
  );
  add(
    "FQ17: Husband + 2 daughters + mother (Shafii — Awl)",
    "fiqh",
    "shafii",
    { husband: 1, daughter: 2, mother: 1 },
    { husband: 27692, daughter: 73846, mother: 18462 },
    100,
  );
  add(
    "FQ18: Grandson inheriting as asaba with daughters (Maliki)",
    "fiqh",
    "maliki",
    { daughter: 2, grandson: 1 },
    { daughter: 80000, grandson: 40000 },
    100,
  );

  // ── FIQH VALIDATION: Cross-madhab comparison ──
  add(
    "FQ19: Husband + mother + maternal brother + full brother (Shafii)",
    "fiqh",
    "shafii",
    { husband: 1, mother: 1, maternal_brother: 2, full_brother: 1 },
    { husband: 60000, mother: 20000 },
  );
  add(
    "FQ20: Wife + father + mother (Hanafi — Umariyyah)",
    "fiqh",
    "hanafi",
    { wife: 1, father: 1, mother: 1 },
    { wife: 30000, mother: 30000, father: 60000 },
  );
  add(
    "FQ21: Wife + father + mother (Maliki — Umariyyah)",
    "fiqh",
    "maliki",
    { wife: 1, father: 1, mother: 1 },
    { wife: 30000, mother: 20000, father: 70000 },
  );
  add(
    "FQ22: Husband + mother + maternal brother (Hanafi radd to spouse)",
    "fiqh",
    "hanafi",
    { husband: 1, mother: 1, maternal_brother: 1 },
    { husband: 60000, mother: 40000, maternal_siblings: 20000 },
    100,
  );

  return cases;
}

function runSingleTest(tc: TestCase): TestResult {
  const engine = new EnhancedInheritanceCalculationEngine(
    tc.madhab,
    E,
    tc.heirs,
  );
  const result = engine.calculate();
  const tolerance = tc.tolerance ?? 50;

  const computed: Record<string, number> = {};
  for (const s of result.shares) {
    if (s.key) {
      computed[s.key] = Math.round(s.amount);
    }
  }

  let passed = true;
  let error: string | undefined;

  if (!result.success) {
    passed = false;
    error = result.error || "Calculation failed";
  } else {
    for (const [key, expectedVal] of Object.entries(tc.expected)) {
      const computedVal = computed[key];
      if (computedVal === undefined) {
        passed = false;
        error = `Missing heir: ${key}`;
        break;
      }
      if (Math.abs(computedVal - expectedVal) > tolerance) {
        passed = false;
        error = `${key}: expected ${expectedVal}, got ${computedVal}`;
        break;
      }
    }
  }

  return {
    id: tc.id,
    name: tc.name,
    category: tc.category,
    madhab: tc.madhab,
    passed,
    computed,
    expected: tc.expected,
    error,
    awlApplied: !!result.awlApplied,
    raddApplied: !!result.raddApplied,
  };
}

const CATEGORY_ICONS: Record<string, { icon: string; colorKey: string }> = {
  simple: { icon: "checkmark-circle", colorKey: "success" },
  moderate: { icon: "alert-circle", colorKey: "warning" },
  complex: { icon: "analytics", colorKey: "primary" },
  special: { icon: "star", colorKey: "tertiary" },
  fiqh: { icon: "book", colorKey: "primary" },
};

export default function EngineTestScreen() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const navigation = useNavigation<any>();
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const runTests = useCallback(() => {
    setRunning(true);
    setResults([]);
    setTimeout(() => {
      const testCases = buildTestCases();
      const allResults = testCases.map(runSingleTest);
      setResults(allResults);
      setRunning(false);
    }, 100);
  }, []);

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  const byCategory = results.reduce(
    (acc, r) => {
      if (!acc[r.category]) acc[r.category] = [];
      acc[r.category].push(r);
      return acc;
    },
    {} as Record<string, TestResult[]>,
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.light },
      ]}
    >
      <AnimatedHeader
        title={t("engineTest.title")}
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Run button */}
        {results.length === 0 && !running && (
          <Card variant="elevated" style={styles.card}>
            <View style={styles.centerContent}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: theme.colors.primary.lighter },
                ]}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={40}
                  color={theme.colors.primary.main}
                />
              </View>
              <Text
                style={[
                  styles.infoTitle,
                  {
                    color: theme.colors.neutral.dark300,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {t("engineTest.title")}
              </Text>
              <Text
                style={[
                  styles.infoText,
                  {
                    color: theme.colors.neutral.dark200,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {t("engineTest.info")}
              </Text>
              <Button
                title={t("engineTest.runAll")}
                onPress={runTests}
                variant="primary"
                style={styles.runButton}
              />
            </View>
          </Card>
        )}

        {running && (
          <Card variant="elevated" style={styles.card}>
            <View style={styles.centerContent}>
              <ActivityIndicator
                size="large"
                color={theme.colors.primary.main}
              />
              <Text
                style={[
                  styles.infoText,
                  {
                    color: theme.colors.neutral.dark200,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {t("engineTest.running")}
              </Text>
            </View>
          </Card>
        )}

        {/* Summary */}
        {results.length > 0 && (
          <>
            <Card variant="elevated" style={styles.card}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text
                    style={[
                      styles.summaryNumber,
                      {
                        color: theme.colors.success.main,
                        fontFamily: theme.fontFamily.english,
                      },
                    ]}
                  >
                    {passed}
                  </Text>
                  <Text
                    style={[
                      styles.summaryLabel,
                      {
                        color: theme.colors.neutral.light400,
                        fontFamily: theme.fontFamily.english,
                      },
                    ]}
                  >
                    {t("engineTest.passed")}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text
                    style={[
                      styles.summaryNumber,
                      {
                        color:
                          failed > 0
                            ? theme.colors.error.main
                            : theme.colors.neutral.light400,
                        fontFamily: theme.fontFamily.english,
                      },
                    ]}
                  >
                    {failed}
                  </Text>
                  <Text
                    style={[
                      styles.summaryLabel,
                      {
                        color: theme.colors.neutral.light400,
                        fontFamily: theme.fontFamily.english,
                      },
                    ]}
                  >
                    {t("engineTest.failed")}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text
                    style={[
                      styles.summaryNumber,
                      {
                        color: theme.colors.neutral.dark200,
                        fontFamily: theme.fontFamily.english,
                      },
                    ]}
                  >
                    {total}
                  </Text>
                  <Text
                    style={[
                      styles.summaryLabel,
                      {
                        color: theme.colors.neutral.light400,
                        fontFamily: theme.fontFamily.english,
                      },
                    ]}
                  >
                    {t("engineTest.total")}
                  </Text>
                </View>
              </View>
              <Button
                title={t("engineTest.rerun")}
                onPress={runTests}
                variant="outline"
                style={styles.rerunButton}
              />
            </Card>

            {/* Results by category */}
            {(
              ["simple", "moderate", "complex", "special", "fiqh"] as const
            ).map((cat) => {
              const catResults = byCategory[cat];
              if (!catResults) return null;
              const catMeta = CATEGORY_ICONS[cat];
              const catPassed = catResults.filter((r) => r.passed).length;
              const catLabel = t(`engineTest.category.${cat}`);
              const catColor =
                (theme.colors as any)[catMeta.colorKey]?.main ??
                theme.colors.primary.main;

              return (
                <Card key={cat} variant="elevated" style={styles.card}>
                  <View
                    style={[
                      styles.categoryHeader,
                      { borderBottomColor: theme.colors.neutral.light100 },
                    ]}
                  >
                    <View style={styles.categoryTitleRow}>
                      <Ionicons
                        name={catMeta.icon as any}
                        size={18}
                        color={catColor}
                      />
                      <Text
                        style={[
                          styles.categoryTitle,
                          {
                            color: theme.colors.neutral.dark200,
                            fontFamily: theme.fontFamily.english,
                          },
                        ]}
                      >
                        {catLabel} {t("engineTest.cases")}
                      </Text>
                    </View>
                    <Badge
                      label={`${catPassed}/${catResults.length}`}
                      color={
                        catPassed === catResults.length
                          ? theme.colors.success.main
                          : theme.colors.error.main
                      }
                      size="sm"
                    />
                  </View>

                  {catResults.map((r) => (
                    <TouchableOpacity
                      key={r.id}
                      style={[
                        styles.testRow,
                        {
                          borderBottomColor: "#E0E0E0",
                        },
                      ]}
                      onPress={() =>
                        setExpandedId(expandedId === r.id ? null : r.id)
                      }
                      activeOpacity={0.7}
                    >
                      <View style={styles.testRowLeft}>
                        <Ionicons
                          name={r.passed ? "checkmark-circle" : "close-circle"}
                          size={18}
                          color={
                            r.passed
                              ? theme.colors.success.main
                              : theme.colors.error.main
                          }
                        />
                        <Text
                          style={[
                            styles.testName,
                            {
                              color: theme.colors.neutral.dark200,
                              fontFamily: theme.fontFamily.english,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {r.name}
                        </Text>
                      </View>
                      <View style={styles.testRowRight}>
                        {r.awlApplied && (
                          <Badge
                            label={t("engineTest.awl")}
                            color={theme.colors.tertiary.main}
                            size="sm"
                          />
                        )}
                        {r.raddApplied && (
                          <Badge
                            label={t("engineTest.radd")}
                            color={theme.colors.tertiary.dark}
                            size="sm"
                          />
                        )}
                        <Ionicons
                          name={
                            expandedId === r.id ? "chevron-up" : "chevron-down"
                          }
                          size={14}
                          color={theme.colors.neutral.light400}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}

                  {/* Expanded details for failed tests */}
                  {catResults
                    .filter((r) => !r.passed && expandedId === r.id)
                    .map((r) => (
                      <View
                        key={`detail-${r.id}`}
                        style={[
                          styles.testDetail,
                          {
                            backgroundColor: theme.colors.background.light,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.detailError,
                            {
                              color: theme.colors.error.main,
                              fontFamily: theme.fontFamily.english,
                            },
                          ]}
                        >
                          {r.error}
                        </Text>
                        {Object.keys(r.expected).length > 0 && (
                          <View style={styles.detailGrid}>
                            {Object.entries(r.expected).map(([key, exp]) => (
                              <Text
                                key={key}
                                style={[
                                  styles.detailLine,
                                  {
                                    color: theme.colors.neutral.dark300,
                                    fontFamily: theme.fontFamily.english,
                                  },
                                ]}
                              >
                                {key}: {t("engineTest.computed")}{" "}
                                {r.computed[key] ?? t("engineTest.na")} /{" "}
                                {t("engineTest.expected")} {exp}
                              </Text>
                            ))}
                          </View>
                        )}
                      </View>
                    ))}
                </Card>
              );
            })}
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
  centerContent: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  infoTitle: { fontSize: 18, fontWeight: "700", textAlign: "center" },
  infoText: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  runButton: { marginTop: 8, minWidth: 180 },
  rerunButton: { marginTop: 8 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
  },
  summaryItem: { alignItems: "center" },
  summaryNumber: { fontSize: 28, fontWeight: "700" },
  summaryLabel: { fontSize: 12, marginTop: 4 },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  categoryTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  categoryTitle: { fontSize: 15, fontWeight: "600" },
  testRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  testRowLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  testName: { fontSize: 13, flex: 1 },
  testRowRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  testDetail: {
    padding: 10,
    marginStart: 26,
    marginBottom: 4,
    borderRadius: 6,
  },
  detailError: { fontSize: 12, fontWeight: "600", marginBottom: 4 },
  detailGrid: { gap: 2 },
  detailLine: { fontSize: 11 },
});
