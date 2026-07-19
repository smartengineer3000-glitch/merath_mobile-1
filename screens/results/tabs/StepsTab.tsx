import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useAppTheme } from "../../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Card, SectionHeader, Badge } from "../../../components/ui";
import { formatCurrency } from "../../../lib/utils/formatters";
import type { CalculationResult } from "../../../lib/inheritance/types";
import type { CalculationScenario } from "../../../lib/context/CalculationContext";
import { HEIR_NAMES } from "../../../lib/inheritance/utils";

interface StepsTabProps {
  result: CalculationResult;
  scenario?: CalculationScenario | null;
}

export function StepsTab({ result, scenario }: StepsTabProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const estate = scenario?.estate;
  const total = estate?.total ?? result.netEstate ?? 0;
  const funeral = estate?.funeral ?? 0;
  const debts = estate?.debts ?? 0;
  const will = estate?.will ?? 0;
  const netEstate = result.netEstate ?? total - funeral - debts - will;
  const deductions = funeral + debts + will;

  return (
    <ScrollView
      contentContainerStyle={styles.tabContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Estate Summary */}
      <Card variant="elevated" style={styles.section}>
        <SectionHeader title={t("steps.estateSummary")} />
        <View style={styles.summaryGrid}>
          <SummaryRow
            label={t("estate.total")}
            value={formatCurrency(total)}
            color={theme.colors.neutral.dark300}
            theme={theme}
          />
          {funeral > 0 && (
            <SummaryRow
              label={t("estate.funeral")}
              value={`-${formatCurrency(funeral)}`}
              color={theme.colors.error.main}
              theme={theme}
            />
          )}
          {debts > 0 && (
            <SummaryRow
              label={t("estate.debts")}
              value={`-${formatCurrency(debts)}`}
              color={theme.colors.error.main}
              theme={theme}
            />
          )}
          {will > 0 && (
            <SummaryRow
              label={t("estate.will")}
              value={`-${formatCurrency(will)}`}
              color={theme.colors.warning.main}
              theme={theme}
            />
          )}
          {deductions > 0 && (
            <View
              style={[
                styles.divider,
                { backgroundColor: theme.colors.neutral.light200 },
              ]}
            />
          )}
          <SummaryRow
            label={t("estate.netEstate")}
            value={formatCurrency(netEstate)}
            color={theme.colors.success.main}
            bold
            theme={theme}
          />
        </View>
        {deductions > 0 && (
          <Text
            style={[
              styles.formula,
              {
                color: theme.colors.neutral.light400,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {formatCurrency(total)} - {formatCurrency(deductions)} (
            {t("steps.deductions")}) = {formatCurrency(netEstate)}
          </Text>
        )}
      </Card>

      {/* 2. Heir Summary */}
      {scenario?.heirs && (
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={t("steps.heirSummary")} />
          <View style={styles.heirList}>
            {Object.entries(scenario.heirs).map(([key, count]) => {
              if (!count || count === 0) return null;
              const name = HEIR_NAMES[key as keyof typeof HEIR_NAMES] || key;
              return (
                <View key={key} style={styles.heirRow}>
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
                    {name}
                  </Text>
                  <Badge
                    count={count}
                    color={theme.colors.primary.main}
                    size="sm"
                  />
                </View>
              );
            })}
          </View>
        </Card>
      )}

      {/* 3. Blocking Rules */}
      {result.blockedHeirs && result.blockedHeirs.length > 0 ? (
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={t("steps.blockedHeirs")} />
          {result.blockedHeirs.map((blocked, index) => (
            <View
              key={index}
              style={[
                styles.infoRow,
                {
                  backgroundColor: theme.colors.error.light + "30",
                  borderLeftColor: theme.colors.error.main,
                },
              ]}
            >
              <Text
                style={[
                  styles.infoTitle,
                  {
                    color: theme.colors.error.dark,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {blocked}
              </Text>
            </View>
          ))}
        </Card>
      ) : (
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={t("steps.blockedHeirs")} />
          <View
            style={[
              styles.infoRow,
              {
                backgroundColor: theme.colors.success.light + "30",
                borderLeftColor: theme.colors.success.main,
              },
            ]}
          >
            <Text
              style={[
                styles.infoDescription,
                {
                  color: theme.colors.success.dark,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {t("steps.noBlockedHeirs")}
            </Text>
          </View>
        </Card>
      )}

      {/* 4. Fixed Shares (Fard) */}
      <Card variant="elevated" style={styles.section}>
        <SectionHeader title={t("steps.fixedShares")} />
        {result.shares.length > 0 ? (
          result.shares.map((share, index) => (
            <View
              key={index}
              style={[
                styles.shareRow,
                { borderBottomColor: theme.colors.neutral.light100 },
              ]}
            >
              <View style={styles.shareInfo}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.shareName,
                    {
                      color: theme.colors.neutral.dark200,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
                >
                  {share.name}
                  {share.count && share.count > 1 ? ` (×${share.count})` : ""}
                </Text>
                {share.shareType && (
                  <Badge
                    label={
                      share.shareType === "fard"
                        ? t("steps.typeFard")
                        : share.shareType === "asaba"
                          ? t("steps.typeAsaba")
                          : share.shareType
                    }
                    color={
                      share.shareType === "fard"
                        ? theme.colors.info.main
                        : theme.colors.success.main
                    }
                    size="sm"
                  />
                )}
              </View>
              <View style={styles.shareAmounts}>
                <Text
                  style={[
                    styles.shareFraction,
                    {
                      color: theme.colors.primary.main,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
                >
                  {share.fraction
                    ? `${share.fraction.numerator}/${share.fraction.denominator}`
                    : ""}
                </Text>
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
            </View>
          ))
        ) : (
          <Text
            style={[
              styles.emptyText,
              {
                color: theme.colors.neutral.light400,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {t("steps.noShares")}
          </Text>
        )}
      </Card>

      {/* 5. Awl (Excess) */}
      {result.awlApplied && (
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={t("steps.awlApplied")} />
          <View
            style={[
              styles.infoRow,
              {
                backgroundColor: theme.colors.warning.light + "30",
                borderLeftColor: theme.colors.warning.main,
              },
            ]}
          >
            <Text
              style={[
                styles.infoDescription,
                {
                  color: theme.colors.warning.dark,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {t("steps.awlDescription")}
            </Text>
          </View>
        </Card>
      )}

      {/* 6. Radd (Return) */}
      {result.raddApplied && (
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={t("steps.raddApplied")} />
          <View
            style={[
              styles.infoRow,
              {
                backgroundColor: theme.colors.info.light + "30",
                borderLeftColor: theme.colors.info.main,
              },
            ]}
          >
            <Text
              style={[
                styles.infoDescription,
                {
                  color: theme.colors.info.dark,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {t("steps.raddDescription")}
            </Text>
          </View>
        </Card>
      )}

      {/* 7. Special Cases */}
      {result.specialCases &&
        (result.specialCases.awl ||
          result.specialCases.radd ||
          result.specialCases.hijabTypes.length > 0) && (
          <Card variant="elevated" style={styles.section}>
            <SectionHeader title={t("results.specialCases")} />
            {result.specialCases.hijabTypes.length > 0 && (
              <View
                style={[
                  styles.infoRow,
                  {
                    backgroundColor: theme.colors.primary.light + "20",
                    borderLeftColor: theme.colors.primary.main,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.infoTitle,
                    {
                      color: theme.colors.primary.dark,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
                >
                  {t("results.hijab")}
                </Text>
                <Text
                  style={[
                    styles.infoDescription,
                    {
                      color: theme.colors.primary.main,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
                >
                  {result.specialCases.hijabTypes.join(", ")}
                </Text>
              </View>
            )}
            {result.specialCases.awl && (
              <View
                style={[
                  styles.infoRow,
                  {
                    backgroundColor: theme.colors.warning.light + "30",
                    borderLeftColor: theme.colors.warning.main,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.infoTitle,
                    {
                      color: theme.colors.warning.dark,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
                >
                  {t("results.awl")}
                </Text>
              </View>
            )}
          </Card>
        )}

      {/* 8. Warnings */}
      {result.warnings && result.warnings.length > 0 && (
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={t("results.warnings")} />
          {result.warnings.map((warning, index) => (
            <View
              key={index}
              style={[
                styles.infoRow,
                {
                  backgroundColor: theme.colors.warning.light + "30",
                  borderLeftColor: theme.colors.warning.main,
                },
              ]}
            >
              <Text
                style={[
                  styles.infoDescription,
                  {
                    color: theme.colors.warning.dark,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {warning}
              </Text>
            </View>
          ))}
        </Card>
      )}

      {/* 9. Confidence Level */}
      <Card variant="elevated" style={styles.section}>
        <SectionHeader title={t("results.trustLevel")} />
        <View style={styles.confidenceContainer}>
          <View
            style={[
              styles.confidenceBar,
              { backgroundColor: theme.colors.neutral.light100 },
            ]}
          >
            <View
              style={[
                styles.confidenceFill,
                {
                  width: `${result.confidence}%`,
                  backgroundColor:
                    result.confidence > 90
                      ? theme.colors.success.main
                      : result.confidence > 70
                        ? theme.colors.warning.main
                        : theme.colors.error.main,
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.confidenceText,
              {
                color: theme.colors.neutral.dark300,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {result.confidence}%
          </Text>
        </View>
        {result.confidenceFactors && result.confidenceFactors.length > 0 && (
          <View style={styles.factorsList}>
            {result.confidenceFactors.map((factor, index) => (
              <Text
                key={index}
                style={[
                  styles.factorText,
                  {
                    color: theme.colors.neutral.light400,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                - {factor}
              </Text>
            ))}
          </View>
        )}
      </Card>

      {/* 10. Madhab Notes */}
      {result.madhhabNotes && result.madhhabNotes.length > 0 && (
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={t("results.fiqhNotes")} />
          {result.madhhabNotes.map((note, index) => (
            <View
              key={index}
              style={[
                styles.infoRow,
                {
                  backgroundColor: theme.colors.primary.light + "10",
                  borderLeftColor: theme.colors.primary.main,
                },
              ]}
            >
              <Text
                style={[
                  styles.infoDescription,
                  {
                    color: theme.colors.neutral.dark200,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {note}
              </Text>
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

function SummaryRow({
  label,
  value,
  color,
  bold,
  theme,
}: {
  label: string;
  value: string;
  color: string;
  bold?: boolean;
  theme: any;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text
        style={[
          styles.summaryLabel,
          {
            color: theme.colors.neutral.light400,
            fontFamily: theme.fontFamily.english,
          },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.summaryValue,
          {
            color,
            fontFamily: theme.fontFamily.english,
            fontWeight: bold ? "700" : "500",
            fontSize: bold ? 16 : 14,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: { padding: 16, paddingBottom: 32, gap: 12 },
  section: { marginBottom: 0 },

  summaryGrid: { gap: 8 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: 13 },
  summaryValue: { fontSize: 14 },
  divider: { height: 1, marginVertical: 4 },
  formula: { fontSize: 11, marginTop: 8, fontStyle: "italic" },

  heirList: { gap: 6 },
  heirRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  heirName: { fontSize: 13, flexShrink: 1 },

  infoRow: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  infoTitle: { fontSize: 13, fontWeight: "600", marginBottom: 2 },
  infoDescription: { fontSize: 12, lineHeight: 18 },

  shareRow: { paddingVertical: 10, borderBottomWidth: 1 },
  shareInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  shareName: { fontSize: 13, fontWeight: "600", flex: 1, flexShrink: 1 },
  shareAmounts: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shareFraction: { fontSize: 13, fontWeight: "600" },
  shareAmount: { fontSize: 14, fontWeight: "700" },
  emptyText: { fontSize: 13, fontStyle: "italic", paddingVertical: 8 },

  confidenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  confidenceBar: { flex: 1, height: 8, borderRadius: 4, overflow: "hidden" },
  confidenceFill: { height: "100%", borderRadius: 4 },
  confidenceText: { fontSize: 14, fontWeight: "700", minWidth: 40 },
  factorsList: { marginTop: 8, gap: 4 },
  factorText: { fontSize: 11, lineHeight: 16 },
});
