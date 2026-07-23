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
import { MADHAB_COLORS } from "../../../lib/inheritance/utils";

interface FiqhRulesTabProps {
  result: CalculationResult;
}

const MADHAB_KEYS: MadhhabType[] = ["shafii", "hanafi", "maliki", "hanbali"];

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
      {/* Active Madhab Banner */}
      <Card variant="elevated">
        <SectionHeader title={fiqhRules.title} />
        {fiqhRules.intro && (
          <Text
            style={[
              styles.introText,
              {
                color: theme.colors.neutral.light400,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {fiqhRules.intro}
          </Text>
        )}
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

      {/* Madhab-Specific Rules */}
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
                      {t("results.fiqhRules.active")}
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

      {/* Comparative Madhab Table */}
      {fiqhRules.comparativeTable && (
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={fiqhRules.comparativeTitle} />
          {fiqhRules.comparativeIntro && (
            <Text
              style={[
                styles.introText,
                {
                  color: theme.colors.neutral.light400,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {fiqhRules.comparativeIntro}
            </Text>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tableWrapper}>
              <View
                style={[
                  styles.tableRow,
                  styles.tableHeader,
                  { backgroundColor: theme.colors.primary.main + "15" },
                ]}
              >
                {(
                  fiqhRules.comparativeTableHeaders || {
                    issue: "Issue",
                    shafii: "Shafii",
                    hanafi: "Hanafi",
                    maliki: "Maliki",
                    hanbali: "Hanbali",
                  }
                )
                  .values()
                  .filter(
                    (v: any) =>
                      typeof v === "string" && v !== "Issue" && v !== "Issue",
                  )
                  .map((header: string, i: number) => (
                    <Text
                      key={i}
                      style={[
                        styles.tableCell,
                        styles.tableCellHeader,
                        {
                          color: theme.colors.primary.dark,
                          width: i === 0 ? 130 : 120,
                        },
                      ]}
                    >
                      {header}
                    </Text>
                  ))}
              </View>
              {fiqhRules.comparativeTable.map((row: any, i: number) => (
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
                      {
                        width: 130,
                        fontWeight: "600",
                        color: theme.colors.neutral.dark200,
                      },
                    ]}
                  >
                    {row.issue}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: 120,
                        fontFamily: theme.fontFamily.english,
                        color: theme.colors.neutral.light400,
                      },
                    ]}
                  >
                    {row.shafii}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: 120,
                        fontFamily: theme.fontFamily.english,
                        color: theme.colors.neutral.light400,
                      },
                    ]}
                  >
                    {row.hanafi}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: 120,
                        fontFamily: theme.fontFamily.english,
                        color: theme.colors.neutral.light400,
                      },
                    ]}
                  >
                    {row.maliki}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: 120,
                        fontFamily: theme.fontFamily.english,
                        color: theme.colors.neutral.light400,
                      },
                    ]}
                  >
                    {row.hanbali}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </Card>
      )}

      {/* Special Cases */}
      {fiqhRules.specialCasesList && (
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={fiqhRules.specialCases} />
          {fiqhRules.specialCasesIntro && (
            <Text
              style={[
                styles.introText,
                {
                  color: theme.colors.neutral.light400,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {fiqhRules.specialCasesIntro}
            </Text>
          )}
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
                {item.conditions && (
                  <View style={styles.specialCaseMeta}>
                    <Ionicons
                      name="pricetag"
                      size={12}
                      color={theme.colors.primary.main}
                    />
                    <Text
                      style={[
                        styles.specialCaseMetaText,
                        { color: theme.colors.primary.main },
                      ]}
                    >
                      {item.conditions}
                    </Text>
                  </View>
                )}
                {item.applicable && (
                  <View style={styles.specialCaseMeta}>
                    <Ionicons
                      name="people"
                      size={12}
                      color={theme.colors.secondary.main}
                    />
                    <Text
                      style={[
                        styles.specialCaseMetaText,
                        { color: theme.colors.secondary.main },
                      ]}
                    >
                      {item.applicable}
                    </Text>
                  </View>
                )}
              </View>
            ),
          )}
        </Card>
      )}

      {/* Fixed Shares */}
      {fiqhRules.fixedSharesList && (
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={fiqhRules.fixedShares} />
          {fiqhRules.fixedSharesIntro && (
            <Text
              style={[
                styles.introText,
                {
                  color: theme.colors.neutral.light400,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {fiqhRules.fixedSharesIntro}
            </Text>
          )}
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
                    { color: theme.colors.primary.dark, width: 100 },
                  ]}
                >
                  {t("results.fiqhRules.tableHeaders.share")}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellHeader,
                    { color: theme.colors.primary.dark, width: 150 },
                  ]}
                >
                  {t("results.fiqhRules.tableHeaders.whoReceives")}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellHeader,
                    { color: theme.colors.primary.dark, width: 150 },
                  ]}
                >
                  {t("results.fiqhRules.tableHeaders.condition")}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellHeader,
                    { color: theme.colors.primary.dark, width: 180 },
                  ]}
                >
                  {t("results.fiqhRules.tableHeaders.notes")}
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
                      {
                        width: 100,
                        fontWeight: "600",
                        color: theme.colors.neutral.dark200,
                      },
                    ]}
                  >
                    {item.share}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: 150,
                        fontFamily: theme.fontFamily.english,
                        color: theme.colors.neutral.light400,
                      },
                    ]}
                  >
                    {item.heirs}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: 150,
                        fontFamily: theme.fontFamily.english,
                        color: theme.colors.neutral.light400,
                      },
                    ]}
                  >
                    {item.condition}
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
                    {item.notes}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </Card>
      )}

      {/* Hijab Rules - Complete Blocking */}
      {fiqhRules.hijabTable && (
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={fiqhRules.hijabRules} />
          {fiqhRules.hijabIntro && (
            <Text
              style={[
                styles.introText,
                {
                  color: theme.colors.neutral.light400,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {fiqhRules.hijabIntro}
            </Text>
          )}
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
                  {t("results.fiqhRules.tableHeaders.blocked")}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellHeader,
                    { color: theme.colors.primary.dark, width: 120 },
                  ]}
                >
                  {t("results.fiqhRules.tableHeaders.blocker")}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellHeader,
                    { color: theme.colors.primary.dark, width: 160 },
                  ]}
                >
                  {t("results.fiqhRules.tableHeaders.description")}
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
                        width: 160,
                        fontFamily: theme.fontFamily.english,
                        color: theme.colors.neutral.light400,
                      },
                    ]}
                  >
                    {item.reason || item.type}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </Card>
      )}

      {/* Partial Blocking (Tahat al-Hijab) */}
      {fiqhRules.hijabPartialTable && (
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={fiqhRules.hijabPartialTitle} />
          {fiqhRules.hijabPartialIntro && (
            <Text
              style={[
                styles.introText,
                {
                  color: theme.colors.neutral.light400,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {fiqhRules.hijabPartialIntro}
            </Text>
          )}
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
                    { color: theme.colors.primary.dark, width: 100 },
                  ]}
                >
                  {t("results.fiqhRules.tableHeaders.blocked")}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellHeader,
                    { color: theme.colors.primary.dark, width: 100 },
                  ]}
                >
                  {t("results.fiqhRules.tableHeaders.blocker")}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellHeader,
                    { color: theme.colors.primary.dark, width: 110 },
                  ]}
                >
                  From
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellHeader,
                    { color: theme.colors.primary.dark, width: 110 },
                  ]}
                >
                  To
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellHeader,
                    { color: theme.colors.primary.dark, width: 150 },
                  ]}
                >
                  {t("results.fiqhRules.tableHeaders.description")}
                </Text>
              </View>
              {fiqhRules.hijabPartialTable.map((item: any, i: number) => (
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
                      { width: 100, color: theme.colors.neutral.dark200 },
                    ]}
                  >
                    {item.blocked}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { width: 100, color: theme.colors.neutral.dark200 },
                    ]}
                  >
                    {item.blocker}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: 110,
                        fontWeight: "600",
                        color: theme.colors.warning.main,
                      },
                    ]}
                  >
                    {item.reducedFrom}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: 110,
                        fontWeight: "600",
                        color: theme.colors.success.main,
                      },
                    ]}
                  >
                    {item.reducedTo}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: 150,
                        fontFamily: theme.fontFamily.english,
                        color: theme.colors.neutral.light400,
                      },
                    ]}
                  >
                    {item.reason}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </Card>
      )}

      {/* Warnings */}
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
  introText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
    paddingLeft: 4,
  },
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
  specialCaseMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    paddingLeft: 26,
  },
  specialCaseMetaText: { fontSize: 11, fontWeight: "500" },
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
