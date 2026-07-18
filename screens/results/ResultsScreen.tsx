import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  I18nManager,
  Share,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import {
  Card,
  SectionHeader,
  Button,
  Badge,
  ProgressBar,
} from "../../components/ui";
import { Ionicons } from "../../lib/icons";
import { formatCurrency, formatPercentage } from "../../lib/utils/formatters";
import type { CalculationResult, HeirShare } from "../../lib/inheritance/types";
import { DonutChart } from "../../components/charts/DonutChart";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";

type TabKey = "distribution" | "steps" | "explanation" | "export";

export default function ResultsScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const result: CalculationResult | null = route.params?.result || null;
  const [activeTab, setActiveTab] = useState<TabKey>("distribution");

  if (!result) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background.light },
        ]}
      >
        <AnimatedHeader
          title={t("results.title")}
          leftIcon="arrow-back"
          onLeftPress={() => navigation.goBack()}
        />
        <Card variant="elevated" style={styles.emptyCard}>
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyTitle,
                {
                  color: theme.colors.neutral.dark200,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {t("results.noResultsTitle")}
            </Text>
            <Text
              style={[
                styles.emptyMessage,
                {
                  color: theme.colors.neutral.light400,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {t("results.noResultsDescription")}
            </Text>
            <Button
              title={t("calculator.newCalculation")}
              onPress={() => navigation.goBack()}
              variant="primary"
            />
          </View>
        </Card>
      </View>
    );
  }

  const total = result.shares.reduce((sum, s) => sum + s.amount, 0);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.light },
      ]}
    >
      <AnimatedHeader
        title={t("results.title")}
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />

      {/* Tab Bar */}
      <View
        style={[
          styles.tabBar,
          { borderBottomColor: theme.colors.neutral.light200 },
        ]}
      >
        {(["distribution", "steps", "explanation", "export"] as TabKey[]).map(
          (tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && {
                  borderBottomColor: theme.colors.primary.main,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color:
                      activeTab === tab
                        ? theme.colors.primary.main
                        : theme.colors.neutral.light400,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {t(`results.tabs.${tab}`)}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      {/* Tab Content */}
      {activeTab === "distribution" && (
        <DistributionTab result={result} total={total} theme={theme} />
      )}
      {activeTab === "steps" && <StepsTab result={result} theme={theme} />}
      {activeTab === "explanation" && (
        <ExplanationTab result={result} theme={theme} />
      )}
      {activeTab === "export" && <ExportTab result={result} theme={theme} />}
    </View>
  );
}

function DistributionTab({
  result,
  total,
  theme,
}: {
  result: CalculationResult;
  total: number;
  theme: any;
}) {
  const { t } = useTranslation();
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

      {/* Distribution Table (Pro7-style) */}
      <Card variant="elevated" style={styles.distributionCard}>
        <SectionHeader title={t("results.distributionBreakdown")} />

        {/* Table Header */}
        <View
          style={[
            tableStyles.headerRow,
            { backgroundColor: theme.colors.primary.main },
          ]}
        >
          <Text
            style={[
              tableStyles.headerCell,
              tableStyles.headerCellName,
              { fontFamily: theme.fontFamily.english },
            ]}
          >
            {t("results.heir")}
          </Text>
          <Text
            style={[
              tableStyles.headerCell,
              { fontFamily: theme.fontFamily.english },
            ]}
          >
            {t("results.fraction")}
          </Text>
          <Text
            style={[
              tableStyles.headerCell,
              { fontFamily: theme.fontFamily.english },
            ]}
          >
            %
          </Text>
          <Text
            style={[
              tableStyles.headerCell,
              { fontFamily: theme.fontFamily.english },
            ]}
          >
            {t("results.amount")}
          </Text>
        </View>

        {/* Table Rows */}
        {result.shares.map((share, index) => {
          const percentage = total > 0 ? (share.amount / total) * 100 : 0;
          const fractionStr = share.fraction
            ? `${share.fraction.numerator}/${share.fraction.denominator}`
            : "-";

          return (
            <View
              key={index}
              style={[
                tableStyles.dataRow,
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
                  tableStyles.dataCell,
                  tableStyles.dataCellName,
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
                  tableStyles.dataCell,
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
                  tableStyles.dataCell,
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
                  tableStyles.dataCell,
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

function StepsTab({
  result,
  theme,
}: {
  result: CalculationResult;
  theme: any;
}) {
  const { t } = useTranslation();
  return (
    <ScrollView
      contentContainerStyle={styles.tabContent}
      showsVerticalScrollIndicator={false}
    >
      <Card variant="elevated">
        <SectionHeader title={t("results.calculationSteps")} />
        {result.steps.map((step, index) => (
          <View
            key={index}
            style={[
              stepStyles.step,
              { borderLeftColor: theme.colors.primary.main },
            ]}
          >
            <View
              style={[
                stepStyles.number,
                { backgroundColor: theme.colors.primary.main },
              ]}
            >
              <Text style={stepStyles.numberText}>{index + 1}</Text>
            </View>
            <View style={stepStyles.content}>
              <Text
                style={[
                  stepStyles.title,
                  {
                    color: theme.colors.neutral.dark300,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {step.title}
              </Text>
              <Text
                style={[
                  stepStyles.description,
                  {
                    color: theme.colors.neutral.light400,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {step.description}
              </Text>
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

function ExplanationTab({
  result,
  theme,
}: {
  result: CalculationResult;
  theme: any;
}) {
  const { t } = useTranslation();
  return (
    <ScrollView
      contentContainerStyle={styles.tabContent}
      showsVerticalScrollIndicator={false}
    >
      <Card variant="elevated">
        <SectionHeader title={t("results.fiqhExplanation")} />
        {result.madhhabNotes && result.madhhabNotes.length > 0 ? (
          result.madhhabNotes.map((note, i) => (
            <View
              key={i}
              style={[
                explanationStyles.note,
                {
                  backgroundColor: theme.colors.primary.light,
                  borderRadius: theme.borderRadius.sm,
                },
              ]}
            >
              <Text
                style={[
                  explanationStyles.noteText,
                  {
                    color: theme.colors.neutral.dark200,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {note}
              </Text>
            </View>
          ))
        ) : (
          <Text
            style={[
              explanationStyles.fallback,
              {
                color: theme.colors.neutral.light400,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {t("results.fiqhExplanationFallback")}
          </Text>
        )}

        {result.warnings && result.warnings.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <SectionHeader title={t("results.warnings")} />
            {result.warnings.map((warn, i) => (
              <View
                key={i}
                style={[
                  explanationStyles.warning,
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
                    explanationStyles.warningText,
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
          </View>
        )}
      </Card>
    </ScrollView>
  );
}

function ExportTab({
  result,
  theme,
}: {
  result: CalculationResult;
  theme: any;
}) {
  const { t } = useTranslation();
  const total = result.shares.reduce((sum, s) => sum + s.amount, 0);

  const generateHtmlReport = useCallback(() => {
    const rows = result.shares
      .map((s) => {
        const pct = total > 0 ? ((s.amount / total) * 100).toFixed(2) : "0";
        const frac = s.fraction
          ? `${s.fraction.numerator}/${s.fraction.denominator}`
          : "-";
        return `<tr>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#1a1a2e">${s.name}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center">${frac}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center">${pct}%</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600">${formatCurrency(s.amount)}</td>
        </tr>`;
      })
      .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Merath - Inheritance Results</title>
  <style>
    body { font-family: -apple-system, sans-serif; padding: 24px; color: #1a1a2e; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .subtitle { color: #666; font-size: 13px; margin-bottom: 20px; }
    .summary { background: #f0fdf4; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    .summary-label { font-size: 12px; color: #666; }
    .summary-value { font-size: 24px; font-weight: 800; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th { background: #2e7d32; color: #fff; padding: 10px 8px; text-align: left; font-size: 12px; }
    th:nth-child(2), th:nth-child(3) { text-align: center; }
    th:nth-child(4) { text-align: right; }
    .badge { display: inline-block; background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-right: 6px; }
    .footer { margin-top: 24px; font-size: 11px; color: #999; text-align: center; }
  </style>
</head>
<body>
  <h1>Inheritance Distribution Report</h1>
  <p class="subtitle">Merath Islamic Inheritance Calculator</p>
  <div class="summary">
    <div class="summary-label">Total Distribution</div>
    <div class="summary-value">${formatCurrency(total)}</div>
    <div style="margin-top:8px">
      <span class="badge">${result.madhhabName}</span>
      ${result.awlApplied ? '<span class="badge" style="background:#fff3e0;color:#e65100">Al-Awl Applied</span>' : ""}
      ${result.raddApplied ? '<span class="badge" style="background:#e3f2fd;color:#1565c0">Al-Radd Applied</span>' : ""}
    </div>
    <div style="margin-top:8px;font-size:12px;color:#666">
      Confidence: ${Math.round(result.confidence)}%
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Heir</th>
        <th>Fraction</th>
        <th>Percentage</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">
    Generated by Merath - Islamic Inheritance Calculator | ${new Date().toLocaleDateString("en-US")}
  </div>
</body>
</html>`;
  }, [result, total]);

  const handleExportPdf = useCallback(async () => {
    try {
      const html = generateHtmlReport();
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Export Inheritance Report",
      });
    } catch (err) {
      Alert.alert(t("common.error"), t("results.exportFailed"));
    }
  }, [generateHtmlReport, t]);

  const handleShareText = useCallback(async () => {
    try {
      let text = `Inheritance Distribution - ${result.madhhabName}\n`;
      text += `Date: ${new Date().toLocaleDateString("en-US")}\n`;
      text += `${"=".repeat(40)}\n\n`;
      text += `Total Distribution: ${formatCurrency(total)}\n`;
      text += `Confidence: ${Math.round(result.confidence)}%\n\n`;
      if (result.awlApplied) text += `(Al-Awl Applied)\n`;
      if (result.raddApplied) text += `(Al-Radd Applied)\n`;
      text += `\nShares:\n`;

      result.shares.forEach((s) => {
        const frac = s.fraction
          ? ` (${s.fraction.numerator}/${s.fraction.denominator})`
          : "";
        text += `  ${s.name}${frac}: ${formatCurrency(s.amount)}\n`;
      });

      await Share.share({ message: text, title: "Inheritance Results" });
    } catch (err) {
      Alert.alert(t("common.error"), t("results.exportFailed"));
    }
  }, [result, total, t]);

  const handleCopyClipboard = useCallback(async () => {
    try {
      let text = `Inheritance Distribution - ${result.madhhabName}\n`;
      text += `Total: ${formatCurrency(total)}\n\n`;
      result.shares.forEach((s) => {
        const frac = s.fraction
          ? ` (${s.fraction.numerator}/${s.fraction.denominator})`
          : "";
        const pct =
          total > 0 ? ` [${((s.amount / total) * 100).toFixed(1)}%]` : "";
        text += `${s.name}${frac}: ${formatCurrency(s.amount)}${pct}\n`;
      });

      await Clipboard.setStringAsync(text);
      Alert.alert(t("results.copied"), t("results.copiedMessage"));
    } catch (err) {
      Alert.alert(t("common.error"), t("results.exportFailed"));
    }
  }, [result, total, t]);

  const handleExportCsv = useCallback(async () => {
    try {
      const header = "Heir,Fraction,Percentage,Amount\n";
      const rows = result.shares
        .map((s) => {
          const pct = total > 0 ? ((s.amount / total) * 100).toFixed(2) : "0";
          const frac = s.fraction
            ? `${s.fraction.numerator}/${s.fraction.denominator}`
            : "";
          return `"${s.name}","${frac}","${pct}%","${s.amount.toFixed(2)}"`;
        })
        .join("\n");

      const csv = header + rows;
      await Share.share({
        message: csv,
        title: "Inheritance CSV",
      });
    } catch (err) {
      Alert.alert(t("common.error"), t("results.exportFailed"));
    }
  }, [result, total, t]);

  const exportOptions = [
    {
      icon: "document-text",
      label: t("results.exportPdf"),
      description: t("results.exportPdfDesc"),
      onPress: handleExportPdf,
    },
    {
      icon: "share-social",
      label: t("results.exportShare"),
      description: t("results.exportShareDesc"),
      onPress: handleShareText,
    },
    {
      icon: "copy",
      label: t("results.exportClipboard"),
      description: t("results.exportClipboardDesc"),
      onPress: handleCopyClipboard,
    },
    {
      icon: "document",
      label: t("results.exportCsv"),
      description: t("results.exportCsvDesc"),
      onPress: handleExportCsv,
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.tabContent}
      showsVerticalScrollIndicator={false}
    >
      <Card variant="elevated">
        <SectionHeader title={t("results.exportOptions")} />
        {exportOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              exportStyles.option,
              { borderBottomColor: theme.colors.neutral.light100 },
            ]}
            activeOpacity={0.7}
            onPress={option.onPress}
          >
            <View
              style={[
                exportStyles.iconContainer,
                { backgroundColor: theme.colors.primary.lighter },
              ]}
            >
              <Ionicons
                name={option.icon as any}
                size={20}
                color={theme.colors.primary.main}
              />
            </View>
            <View style={exportStyles.optionInfo}>
              <Text
                style={[
                  exportStyles.optionLabel,
                  {
                    color: theme.colors.neutral.dark200,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[
                  exportStyles.optionDesc,
                  {
                    color: theme.colors.neutral.light400,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {option.description}
              </Text>
            </View>
            <Ionicons
              name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
              size={18}
              color={theme.colors.neutral.light400}
            />
          </TouchableOpacity>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: { flexDirection: "row", borderBottomWidth: 1, paddingHorizontal: 16 },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabLabel: { fontSize: 12, fontWeight: "600" },
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
  emptyCard: { margin: 16, flex: 1 },
  emptyContainer: { alignItems: "center", paddingVertical: 40 },
  emptyTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  emptyMessage: { fontSize: 13, textAlign: "center", marginBottom: 20 },
  blockedHeir: { fontSize: 13, paddingVertical: 4 },
});

const tableStyles = StyleSheet.create({
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
});

const stepStyles = StyleSheet.create({
  step: {
    flexDirection: "row",
    paddingVertical: 12,
    borderStartWidth: 2,
    paddingStart: 12,
    gap: 10,
  },
  number: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: { color: "#ffffff", fontSize: 11, fontWeight: "700" },
  content: { flex: 1 },
  title: { fontSize: 13, fontWeight: "600", marginBottom: 2 },
  description: { fontSize: 12, lineHeight: 18 },
});

const explanationStyles = StyleSheet.create({
  note: { padding: 12, marginBottom: 8 },
  noteText: { fontSize: 13, lineHeight: 20 },
  fallback: { fontSize: 13, textAlign: "center", paddingVertical: 20 },
  warning: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 8,
    marginBottom: 6,
  },
  warningText: { fontSize: 12, flex: 1, lineHeight: 18 },
});

const exportStyles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  optionInfo: { flex: 1 },
  optionLabel: { fontSize: 14, fontWeight: "600", marginBottom: 2 },
  optionDesc: { fontSize: 11 },
});
