import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useAppTheme } from "../../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Card, SectionHeader } from "../../../components/ui";
import { Ionicons } from "../../../lib/icons";
import type {
  CalculationResult,
  MadhhabType,
} from "../../../lib/inheritance/types";

interface FiqhRulesTabProps {
  result: CalculationResult;
}

const MADHAB_KEYS: MadhhabType[] = ["shafii", "hanafi", "maliki", "hanbali"];

const MADHAB_COLORS: Record<MadhhabType, string> = {
  shafii: "#2e7d32",
  hanafi: "#c62828",
  maliki: "#6a1b9a",
  hanbali: "#e65100",
};

export function FiqhRulesTab({ result }: FiqhRulesTabProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const activeMadhab = result.madhab;
  const fiqhRules = t("results.fiqhRules", { returnObjects: true }) as Record<
    string,
    any
  >;

  if (!fiqhRules || !fiqhRules.madhabs) {
    return (
      <ScrollView
        contentContainerStyle={styles.tabContent}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="elevated">
          <SectionHeader title={t("results.fiqhExplanation")} />
          <Text
            style={[
              styles.fallback,
              {
                color: theme.colors.neutral.light400,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {t("results.fiqhExplanationFallback")}
          </Text>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.tabContent}
      showsVerticalScrollIndicator={false}
    >
      <Card variant="elevated">
        <SectionHeader title={fiqhRules.title} />

        <View
          style={[
            styles.activeBanner,
            {
              backgroundColor: MADHAB_COLORS[activeMadhab] + "15",
              borderColor: MADHAB_COLORS[activeMadhab],
            },
          ]}
        >
          <Ionicons
            name="checkmark-circle"
            size={18}
            color={MADHAB_COLORS[activeMadhab]}
          />
          <Text
            style={[
              styles.activeBannerText,
              { color: MADHAB_COLORS[activeMadhab] },
            ]}
          >
            {fiqhRules.activeMadhab}: {fiqhRules.madhabs[activeMadhab]?.name}
          </Text>
        </View>
      </Card>

      <Card variant="elevated" style={styles.section}>
        <SectionHeader title={fiqhRules.madhabRules} />
        {MADHAB_KEYS.map((key) => {
          const madhab = fiqhRules.madhabs[key];
          if (!madhab) return null;
          const isActive = key === activeMadhab;
          const color = MADHAB_COLORS[key];
          return (
            <View
              key={key}
              style={[
                styles.madhabCard,
                {
                  borderLeftColor: color,
                  backgroundColor: isActive
                    ? color + "10"
                    : theme.colors.background.lightVariant,
                  opacity: isActive ? 1 : 0.75,
                },
              ]}
            >
              <View style={styles.madhabHeader}>
                <View style={[styles.madhabDot, { backgroundColor: color }]} />
                <Text
                  style={[
                    styles.madhabName,
                    { color: theme.colors.neutral.dark200 },
                  ]}
                >
                  {madhab.name}
                </Text>
                {isActive && (
                  <View
                    style={[
                      styles.activeBadge,
                      { backgroundColor: color + "20" },
                    ]}
                  >
                    <Text style={[styles.activeBadgeText, { color }]}>
                      ACTIVE
                    </Text>
                  </View>
                )}
              </View>
              {(madhab.rules || []).map((rule: string, i: number) => (
                <View key={i} style={styles.ruleRow}>
                  <Text style={[styles.ruleBullet, { color }]}>•</Text>
                  <Text
                    style={[
                      styles.ruleText,
                      {
                        color: theme.colors.neutral.dark300,
                        fontFamily: theme.fontFamily.english,
                      },
                    ]}
                  >
                    {rule}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}
      </Card>

      {fiqhRules.specialCasesList && (
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={fiqhRules.specialCases} />
          {Object.entries(fiqhRules.specialCasesList).map(
            ([key, item]: [string, any]) => (
              <View
                key={key}
                style={[
                  styles.specialCaseCard,
                  {
                    backgroundColor: theme.colors.background.lightVariant,
                    borderColor: theme.colors.neutral.light200,
                  },
                ]}
              >
                <View style={styles.specialCaseHeader}>
                  <Ionicons
                    name="information-circle"
                    size={18}
                    color={theme.colors.primary.main}
                  />
                  <Text
                    style={[
                      styles.specialCaseTitle,
                      { color: theme.colors.neutral.dark200 },
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.specialCaseDescription,
                    {
                      color: theme.colors.neutral.light400,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
                >
                  {item.description}
                </Text>
              </View>
            ),
          )}
        </Card>
      )}

      {fiqhRules.fixedSharesList && (
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={fiqhRules.fixedShares} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tableWrapper}>
              <View
                style={[
                  styles.tableRow,
                  styles.tableHeader,
                  { backgroundColor: theme.colors.primary.main + "15" },
                ]}
              >
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellHeader,
                    { color: theme.colors.primary.dark, width: 120 },
                  ]}
                >
                  Share (Fard)
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellHeader,
                    { color: theme.colors.primary.dark, width: 220 },
                  ]}
                >
                  Who Receives It
                </Text>
              </View>
              {fiqhRules.fixedSharesList.map((item: any, i: number) => (
                <View
                  key={i}
                  style={[
                    styles.tableRow,
                    {
                      backgroundColor:
                        i % 2 === 0
                          ? theme.colors.background.lightVariant
                          : theme.colors.background.light,
                      borderBottomColor: theme.colors.neutral.light200,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tableCell,
                      { width: 120, color: theme.colors.neutral.dark200 },
                    ]}
                  >
                    {item.share}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: 220,
                        fontFamily: theme.fontFamily.english,
                        color: theme.colors.neutral.light400,
                      },
                    ]}
                  >
                    {item.heirs}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </Card>
      )}

      {fiqhRules.hijabTable && (
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={fiqhRules.hijabRules} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tableWrapper}>
              <View
                style={[
                  styles.tableRow,
                  styles.tableHeader,
                  { backgroundColor: theme.colors.primary.main + "15" },
                ]}
              >
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellHeader,
                    { color: theme.colors.primary.dark, width: 120 },
                  ]}
                >
                  Blocked
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellHeader,
                    { color: theme.colors.primary.dark, width: 120 },
                  ]}
                >
                  Blocker
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellHeader,
                    { color: theme.colors.primary.dark, width: 180 },
                  ]}
                >
                  Description
                </Text>
              </View>
              {fiqhRules.hijabTable.map((item: any, i: number) => (
                <View
                  key={i}
                  style={[
                    styles.tableRow,
                    {
                      backgroundColor:
                        i % 2 === 0
                          ? theme.colors.background.lightVariant
                          : theme.colors.background.light,
                      borderBottomColor: theme.colors.neutral.light200,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tableCell,
                      { width: 120, color: theme.colors.neutral.dark200 },
                    ]}
                  >
                    {item.blocked}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { width: 120, color: theme.colors.neutral.dark200 },
                    ]}
                  >
                    {item.blocker}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: 180,
                        fontFamily: theme.fontFamily.english,
                        color: theme.colors.neutral.light400,
                      },
                    ]}
                  >
                    {item.type}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </Card>
      )}

      {result.warnings && result.warnings.length > 0 && (
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={t("results.warnings")} />
          {result.warnings.map((warn, i) => (
            <View
              key={i}
              style={[
                styles.warning,
                {
                  backgroundColor: theme.colors.warning.light,
                  borderRadius: theme.borderRadius.sm,
                },
              ]}
            >
              <Ionicons
                name="warning"
                size={14}
                color={theme.colors.warning.main}
              />
              <Text
                style={[
                  styles.warningText,
                  {
                    color: theme.colors.warning.dark,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {warn}
              </Text>
            </View>
          ))}
        </Card>
      )}

      <View style={{ height: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabContent: { padding: 16, paddingBottom: 32 },
  section: { marginTop: 12 },
  fallback: { fontSize: 13, textAlign: "center", paddingVertical: 20 },
  activeBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  activeBannerText: { fontSize: 14, fontWeight: "600" },
  madhabCard: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 10,
    borderRadius: 6,
  },
  madhabHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  madhabDot: { width: 10, height: 10, borderRadius: 5 },
  madhabName: { fontSize: 15, fontWeight: "600", flex: 1 },
  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeBadgeText: { fontSize: 10, fontWeight: "700" },
  ruleRow: { flexDirection: "row", gap: 6, marginBottom: 4, paddingLeft: 4 },
  ruleBullet: { fontSize: 14, lineHeight: 20 },
  ruleText: { fontSize: 13, lineHeight: 20, flex: 1 },
  specialCaseCard: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  specialCaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  specialCaseTitle: { fontSize: 14, fontWeight: "600" },
  specialCaseDescription: { fontSize: 12, lineHeight: 18, paddingLeft: 26 },
  tableWrapper: { minWidth: "100%" },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableHeader: {},
  tableCell: { fontSize: 12, lineHeight: 18 },
  tableCellHeader: {
    fontWeight: "700",
    fontSize: 11,
    textTransform: "uppercase",
  },
  warning: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 8,
    marginBottom: 6,
  },
  warningText: { fontSize: 12, flex: 1, lineHeight: 18 },
});
