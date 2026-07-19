import React, { useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
  I18nManager,
} from "react-native";
import { useAppTheme } from "../../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Card, SectionHeader } from "../../../components/ui";
import { Ionicons } from "../../../lib/icons";
import { formatCurrency } from "../../../lib/utils/formatters";
import type { CalculationResult } from "../../../lib/inheritance/types";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";

interface ExportTabProps {
  result: CalculationResult;
}

export function ExportTab({ result }: ExportTabProps) {
  const { theme } = useAppTheme();
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
  <title>${t("export.dialogTitle")}</title>
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
  <h1>${t("export.reportTitle")}</h1>
  <p class="subtitle">${t("export.appName")}</p>
  <div class="summary">
    <div class="summary-label">${t("export.totalDistribution")}</div>
    <div class="summary-value">${formatCurrency(total)}</div>
    <div style="margin-top:8px">
      <span class="badge">${result.madhhabName}</span>
      ${result.awlApplied ? `<span class="badge" style="background:#fff3e0;color:#e65100">${t("export.awlApplied")}</span>` : ""}
      ${result.raddApplied ? `<span class="badge" style="background:#e3f2fd;color:#1565c0">${t("export.raddApplied")}</span>` : ""}
    </div>
    <div style="margin-top:8px;font-size:12px;color:#666">
      ${t("export.confidence")}: ${Math.round(result.confidence)}%
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>${t("export.heir")}</th>
        <th>${t("export.fraction")}</th>
        <th>${t("export.percentage")}</th>
        <th>${t("export.amount")}</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">
    ${t("export.generatedBy")} | ${new Date().toLocaleDateString()}
  </div>
</body>
</html>`;
  }, [result, total, t]);

  const handleExportPdf = useCallback(async () => {
    try {
      const html = generateHtmlReport();
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: t("export.dialogTitle"),
      });
    } catch {
      Alert.alert(t("common.error"), t("results.exportFailed"));
    }
  }, [generateHtmlReport, t]);

  const handleShareText = useCallback(async () => {
    try {
      let text = `${t("export.shareTitle")} - ${result.madhhabName}\n`;
      text += `${t("export.date")}: ${new Date().toLocaleDateString()}\n`;
      text += `${"=".repeat(40)}\n\n`;
      text += `${t("export.totalDistribution")}: ${formatCurrency(total)}\n`;
      text += `${t("export.confidence")}: ${Math.round(result.confidence)}%\n\n`;
      if (result.awlApplied) text += `(${t("export.awlApplied")})\n`;
      if (result.raddApplied) text += `(${t("export.raddApplied")})\n`;
      text += `\n${t("export.shares")}:\n`;

      result.shares.forEach((s) => {
        const frac = s.fraction
          ? ` (${s.fraction.numerator}/${s.fraction.denominator})`
          : "";
        text += `  ${s.name}${frac}: ${formatCurrency(s.amount)}\n`;
      });

      await Share.share({
        message: text,
        title: t("export.shareTitle"),
      });
    } catch {
      Alert.alert(t("common.error"), t("results.exportFailed"));
    }
  }, [result, total, t]);

  const handleCopyClipboard = useCallback(async () => {
    try {
      let text = `${t("export.shareTitle")} - ${result.madhhabName}\n`;
      text += `${t("export.total")}: ${formatCurrency(total)}\n\n`;
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
    } catch {
      Alert.alert(t("common.error"), t("results.exportFailed"));
    }
  }, [result, total, t]);

  const handleExportCsv = useCallback(async () => {
    try {
      const header = `${t("export.csvHeader")}\n`;
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
        title: t("export.csvTitle"),
      });
    } catch {
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
              styles.option,
              { borderBottomColor: theme.colors.neutral.light100 },
            ]}
            activeOpacity={0.7}
            onPress={option.onPress}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.primary.lighter },
              ]}
            >
              <Ionicons
                name={option.icon as any}
                size={20}
                color={theme.colors.primary.main}
              />
            </View>
            <View style={styles.optionInfo}>
              <Text
                style={[
                  styles.optionLabel,
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
                  styles.optionDesc,
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
  tabContent: { padding: 16, paddingBottom: 32 },
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
