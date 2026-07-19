import React, { useCallback, useMemo } from "react";
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
import i18n from "../../../lib/i18n";
import { Card, SectionHeader } from "../../../components/ui";
import { Ionicons } from "../../../lib/icons";
import { formatCurrency } from "../../../lib/utils/formatters";
import type { CalculationResult } from "../../../lib/inheritance/types";
import type { CalculationScenario } from "../../../lib/context/CalculationContext";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";

interface ExportTabProps {
  result: CalculationResult;
  scenario?: CalculationScenario | null;
}

export function ExportTab({ result, scenario }: ExportTabProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const estate = scenario?.estate;
  const heirs = scenario?.heirs;
  const total = result.shares.reduce((sum, s) => sum + s.amount, 0);
  const estateTotal = estate?.total ?? result.netEstate ?? total;
  const funeral = estate?.funeral ?? 0;
  const debts = estate?.debts ?? 0;
  const will = estate?.will ?? 0;
  const deductions = funeral + debts + will;
  const netEstate = result.netEstate ?? estateTotal - deductions;
  const now = useMemo(() => new Date(), []);
  const dateStr = useMemo(
    () =>
      now.toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [now],
  );

  const generateHtmlReport = useCallback(() => {
    const shareRows = result.shares
      .map((s, idx) => {
        const pct = total > 0 ? ((s.amount / total) * 100).toFixed(2) : "0";
        const frac = s.fraction
          ? `${s.fraction.numerator}/${s.fraction.denominator}`
          : "-";
        const typeLabel =
          s.shareType === "fard"
            ? t("export.typeFard")
            : s.shareType === "asaba" || s.shareType?.includes("asaba")
              ? t("export.typeAsaba")
              : s.shareType === "musharraka"
                ? t("export.typeMusharraka")
                : s.shareType || "";
        const bgColor = idx % 2 === 0 ? "#ffffff" : "#f8faf8";
        return `<tr style="background:${bgColor}">
          <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;font-size:13px;color:#1a1a2e">${idx + 1}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;font-weight:600;color:#1a1a2e;font-size:13px">${s.name}${s.count && s.count > 1 ? ` (${s.count})` : ""}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;text-align:center;font-size:13px;color:#555">${frac}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;text-align:center;font-size:12px;color:#666">${typeLabel}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;text-align:center;font-size:13px;color:#555">${pct}%</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;text-align:right;font-weight:700;color:#1a1a2e;font-size:13px">${formatCurrency(s.amount)}</td>
        </tr>`;
      })
      .join("");

    const heirRows = heirs
      ? Object.entries(heirs)
          .filter(([, count]) => count && count > 0)
          .map(
            ([key, count], idx) => `
          <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8faf8"}">
            <td style="padding:8px 12px;border-bottom:1px solid #e8e8e8;font-size:13px;color:#1a1a2e">${key}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e8e8e8;text-align:center;font-size:13px;font-weight:600;color:#2e7d32">${count}</td>
          </tr>`,
          )
          .join("")
      : "";

    const stepsHtml = result.steps
      .slice(0, 15)
      .map(
        (step, idx) => `
      <div style="display:flex;gap:10px;margin-bottom:8px;align-items:flex-start">
        <div style="min-width:24px;height:24px;border-radius:12px;background:#e8f5e9;color:#2e7d32;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center">${idx + 1}</div>
        <div>
          <div style="font-size:12px;font-weight:600;color:#1a1a2e">${step.title}</div>
          ${step.description ? `<div style="font-size:11px;color:#666;margin-top:2px">${step.description}</div>` : ""}
        </div>
      </div>`,
      )
      .join("");

    const specialCasesHtml = (() => {
      let html = "";
      if (result.awlApplied) {
        html += `<div style="padding:8px 12px;background:#fff8e1;border-left:3px solid #f9a825;border-radius:4px;margin-bottom:6px;font-size:12px;color:#5d4037">${t("export.awlNote")}</div>`;
      }
      if (result.raddApplied) {
        html += `<div style="padding:8px 12px;background:#e3f2fd;border-left:3px solid #1976d2;border-radius:4px;margin-bottom:6px;font-size:12px;color:#1565c0">${t("export.raddNote")}</div>`;
      }
      if (result.blockedHeirs && result.blockedHeirs.length > 0) {
        html += `<div style="padding:8px 12px;background:#fce4ec;border-left:3px solid #d32f2f;border-radius:4px;margin-bottom:6px;font-size:12px;color:#b71c1c"><strong>${t("export.blockedHeirsTitle")}:</strong> ${result.blockedHeirs.join(", ")}</div>`;
      }
      if (
        result.specialCases?.hijabTypes &&
        result.specialCases.hijabTypes.length > 0
      ) {
        html += `<div style="padding:8px 12px;background:#fce4ec;border-left:3px solid #d32f2f;border-radius:4px;margin-bottom:6px;font-size:12px;color:#b71c1c"><strong>${t("export.blockedHeirsTitle")}:</strong> ${result.specialCases.hijabTypes.join(", ")}</div>`;
      }
      return html;
    })();

    const warningsHtml =
      result.warnings && result.warnings.length > 0
        ? result.warnings
            .map(
              (w) =>
                `<div style="padding:6px 10px;background:#fff3e0;border-left:3px solid #e65100;border-radius:4px;margin-bottom:4px;font-size:11px;color:#bf360c">${w}</div>`,
            )
            .join("")
        : "";

    const notesHtml =
      result.madhhabNotes && result.madhhabNotes.length > 0
        ? result.madhhabNotes
            .map(
              (n) =>
                `<div style="padding:6px 10px;background:#e8f5e9;border-left:3px solid #2e7d32;border-radius:4px;margin-bottom:4px;font-size:11px;color:#1b5e20">${n}</div>`,
            )
            .join("")
        : "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${t("export.reportTitle")}</title>
  <style>
    @page { margin: 15mm; size: A4; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a2e; line-height: 1.5; padding: 0; }
    .report { max-width: 100%; }

    /* Header */
    .header { border-bottom: 3px solid #2e7d32; padding-bottom: 16px; margin-bottom: 24px; }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .date { font-size: 12px; color: #666; }
    .app-name { font-size: 24px; font-weight: 800; color: #2e7d32; margin: 0; }
    .app-subtitle { font-size: 13px; color: #666; margin-top: 2px; }
    .madhab-badge { display: inline-block; background: #e8f5e9; color: #2e7d32; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-top: 8px; }

    /* Section */
    .section { margin-bottom: 24px; }
    .section-title { font-size: 15px; font-weight: 700; color: #2e7d32; border-bottom: 2px solid #e8f5e9; padding-bottom: 6px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
    .section-icon { font-size: 14px; }

    /* Tables */
    table { width: 100%; border-collapse: collapse; margin: 8px 0; }
    th { background: #2e7d32; color: #ffffff; padding: 10px 12px; text-align: left; font-size: 12px; font-weight: 600; letter-spacing: 0.3px; }
    td { font-size: 13px; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }

    /* Summary boxes */
    .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
    .summary-box { background: #f8faf8; border: 1px solid #e8e8e8; border-radius: 6px; padding: 12px; }
    .summary-box-label { font-size: 11px; color: #666; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .summary-box-value { font-size: 18px; font-weight: 700; color: #1a1a2e; }
    .summary-box-value.green { color: #2e7d32; }
    .summary-box-value.red { color: #d32f2f; }
    .summary-box-value.orange { color: #e65100; }

    /* Confidence */
    .confidence-bar { width: 100%; height: 8px; background: #e8e8e8; border-radius: 4px; overflow: hidden; margin: 6px 0; }
    .confidence-fill { height: 100%; border-radius: 4px; }
    .confidence-fill.high { background: #2e7d32; }
    .confidence-fill.medium { background: #f9a825; }
    .confidence-fill.low { background: #d32f2f; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-right: 4px; margin-bottom: 4px; }
    .badge-green { background: #e8f5e9; color: #2e7d32; }
    .badge-orange { background: #fff3e0; color: #e65100; }
    .badge-blue { background: #e3f2fd; color: #1565c0; }
    .badge-red { background: #fce4ec; color: #d32f2f; }

    /* Disclaimer */
    .disclaimer { margin-top: 32px; border-top: 2px solid #e8e8e8; padding-top: 16px; }
    .disclaimer-title { font-size: 12px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .disclaimer-text { font-size: 11px; color: #888; line-height: 1.6; }
    .footer { margin-top: 16px; text-align: center; font-size: 10px; color: #bbb; }
  </style>
</head>
<body>
  <div class="report">

    <!-- HEADER -->
    <div class="header">
      <div class="header-top">
        <div>
          <h1 class="app-name">Merath</h1>
          <p class="app-subtitle">${t("export.appName")}</p>
        </div>
        <div style="text-align:right">
          <div class="date">${t("export.date")}: ${dateStr}</div>
          <div class="date">${t("export.reportGenerated")}: ${now.toLocaleTimeString()}</div>
        </div>
      </div>
      <div style="margin-top:8px">
        <span class="madhab-badge">${result.madhhabName}</span>
        ${result.awlApplied ? '<span class="badge badge-orange">' + t("export.awlApplied") + "</span>" : ""}
        ${result.raddApplied ? '<span class="badge badge-blue">' + t("export.raddApplied") + "</span>" : ""}
        ${result.bloodRelativesApplied ? '<span class="badge badge-green">' + t("export.bloodRelativesApplied") + "</span>" : ""}
      </div>
    </div>

    <!-- ESTATE DETAILS -->
    <div class="section">
      <div class="section-title"><span class="section-icon">&#128176;</span> ${t("export.estateDetails")}</div>
      <table>
        <thead>
          <tr>
            <th style="width:60%">${t("export.estateTableHeader")}</th>
            <th class="text-right" style="width:40%">${t("export.estateTableAmount")}</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background:#f8faf8">
            <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;font-weight:600">${t("export.totalEstate")}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;text-align:right;font-weight:700">${formatCurrency(estateTotal)}</td>
          </tr>
          ${
            funeral > 0
              ? `<tr>
            <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;color:#555">&nbsp;&nbsp;- ${t("estate.funeral")}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;text-align:right;color:#d32f2f">-${formatCurrency(funeral)}</td>
          </tr>`
              : ""
          }
          ${
            debts > 0
              ? `<tr style="background:#f8faf8">
            <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;color:#555">&nbsp;&nbsp;- ${t("estate.debts")}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;text-align:right;color:#d32f2f">-${formatCurrency(debts)}</td>
          </tr>`
              : ""
          }
          ${
            will > 0
              ? `<tr>
            <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;color:#555">&nbsp;&nbsp;- ${t("estate.will")}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;text-align:right;color:#e65100">-${formatCurrency(will)}</td>
          </tr>`
              : ""
          }
          ${
            deductions > 0
              ? `<tr style="background:#f0fdf4">
            <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;font-weight:600;color:#666">${t("export.totalDeductions")}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;text-align:right;font-weight:600;color:#d32f2f">-${formatCurrency(deductions)}</td>
          </tr>`
              : ""
          }
          <tr style="background:#e8f5e9">
            <td style="padding:12px;border-bottom:2px solid #2e7d32;font-weight:700;font-size:14px;color:#2e7d32">${t("estate.netEstate")}</td>
            <td style="padding:12px;border-bottom:2px solid #2e7d32;text-align:right;font-weight:800;font-size:16px;color:#2e7d32">${formatCurrency(netEstate)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- SELECTED HEIRS -->
    ${
      heirRows
        ? `
    <div class="section">
      <div class="section-title"><span class="section-icon">&#128101;</span> ${t("export.selectedHeirs")}</div>
      <table>
        <thead>
          <tr>
            <th style="width:70%">${t("export.heirTableHeader")}</th>
            <th class="text-center" style="width:30%">${t("export.heirTableCount")}</th>
          </tr>
        </thead>
        <tbody>${heirRows}</tbody>
      </table>
    </div>`
        : ""
    }

    <!-- DISTRIBUTION RESULTS -->
    <div class="section">
      <div class="section-title"><span class="section-icon">&#128202;</span> ${t("export.distributionResults")}</div>
      <div style="margin-bottom:8px">
        <strong style="font-size:20px;color:#2e7d32">${formatCurrency(total)}</strong>
        <span style="font-size:12px;color:#666;margin-left:8px">${t("export.totalDistribution")}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width:5%">#</th>
            <th style="width:25%">${t("export.distributionTableHeader")}</th>
            <th class="text-center" style="width:12%">${t("export.distributionTableFraction")}</th>
            <th class="text-center" style="width:15%">${t("export.distributionTableType")}</th>
            <th class="text-center" style="width:13%">${t("export.distributionTablePercentage")}</th>
            <th class="text-right" style="width:20%">${t("export.distributionTableAmount")}</th>
          </tr>
        </thead>
        <tbody>${shareRows}</tbody>
        <tfoot>
          <tr style="background:#2e7d32">
            <td colspan="5" style="padding:10px 12px;font-weight:700;color:#fff;font-size:13px">${t("export.totalDistribution")}</td>
            <td style="padding:10px 12px;text-align:right;font-weight:800;color:#fff;font-size:14px">${formatCurrency(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- SPECIAL CASES & WARNINGS -->
    ${
      specialCasesHtml || warningsHtml
        ? `
    <div class="section">
      <div class="section-title"><span class="section-icon">&#9888;</span> ${t("export.specialCases")}</div>
      ${specialCasesHtml}
      ${warningsHtml}
    </div>`
        : ""
    }

    <!-- CALCULATION STEPS -->
    ${
      stepsHtml
        ? `
    <div class="section">
      <div class="section-title"><span class="section-icon">&#128221;</span> ${t("export.calculationSteps")}</div>
      <div style="padding:12px;background:#fafafa;border-radius:6px;border:1px solid #e8e8e8">
        ${stepsHtml}
      </div>
    </div>`
        : ""
    }

    <!-- FIQH NOTES -->
    ${
      notesHtml
        ? `
    <div class="section">
      <div class="section-title"><span class="section-icon">&#128218;</span> ${t("export.fiqhNotes")}</div>
      ${notesHtml}
    </div>`
        : ""
    }

    <!-- CONFIDENCE -->
    <div class="section">
      <div class="section-title"><span class="section-icon">&#128737;</span> ${t("export.confidenceLevel")}</div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
        <div class="confidence-bar" style="flex:1">
          <div class="confidence-fill ${result.confidence > 90 ? "high" : result.confidence > 70 ? "medium" : "low"}" style="width:${result.confidence}%"></div>
        </div>
        <strong style="font-size:16px;color:#2e7d32">${Math.round(result.confidence)}%</strong>
      </div>
      ${
        result.confidenceFactors && result.confidenceFactors.length > 0
          ? `
      <div style="font-size:11px;color:#666">
        ${result.confidenceFactors.map((f) => `<div style="margin-bottom:2px">&bull; ${f}</div>`).join("")}
      </div>`
          : ""
      }
    </div>

    <!-- DISCLAIMER -->
    <div class="disclaimer">
      <div class="disclaimer-title">${t("export.disclaimer")}</div>
      <div class="disclaimer-text">
        ${t("export.disclaimerText")}
      </div>
      <div class="footer">
        ${t("export.generatedBy")} &bull; ${dateStr}
      </div>
    </div>

  </div>
</body>
</html>`;
  }, [
    result,
    total,
    estateTotal,
    funeral,
    debts,
    will,
    deductions,
    netEstate,
    heirs,
    t,
    dateStr,
    now,
  ]);

  const handleExportPdf = useCallback(async () => {
    try {
      const html = generateHtmlReport();
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });
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
      const lines: string[] = [];
      lines.push(`${t("export.reportTitle")} - ${result.madhhabName}`);
      lines.push(`${t("export.date")}: ${dateStr}`);
      lines.push(`${"=".repeat(50)}`);
      lines.push("");

      lines.push(`--- ${t("export.estateDetails")} ---`);
      lines.push(`${t("export.totalEstate")}: ${formatCurrency(estateTotal)}`);
      if (funeral > 0)
        lines.push(`  - ${t("estate.funeral")}: ${formatCurrency(funeral)}`);
      if (debts > 0)
        lines.push(`  - ${t("estate.debts")}: ${formatCurrency(debts)}`);
      if (will > 0)
        lines.push(`  - ${t("estate.will")}: ${formatCurrency(will)}`);
      if (deductions > 0)
        lines.push(
          `${t("export.totalDeductions")}: ${formatCurrency(deductions)}`,
        );
      lines.push(`${t("estate.netEstate")}: ${formatCurrency(netEstate)}`);
      lines.push("");

      if (heirs) {
        const selectedHeirs = Object.entries(heirs).filter(
          ([, c]) => c && c > 0,
        );
        if (selectedHeirs.length > 0) {
          lines.push(`--- ${t("export.selectedHeirs")} ---`);
          selectedHeirs.forEach(([key, count]) => {
            lines.push(`  ${key}: ${count}`);
          });
          lines.push("");
        }
      }

      lines.push(`--- ${t("export.distributionResults")} ---`);
      lines.push(`${t("export.totalDistribution")}: ${formatCurrency(total)}`);
      lines.push(
        `${t("export.confidence")}: ${Math.round(result.confidence)}%`,
      );
      if (result.awlApplied) lines.push(`(${t("export.awlApplied")})`);
      if (result.raddApplied) lines.push(`(${t("export.raddApplied")})`);
      lines.push("");
      lines.push(
        `${"#".padEnd(4)} ${t("export.heir").padEnd(20)} ${t("export.fraction").padEnd(10)} ${t("export.amount").padStart(15)}`,
      );
      lines.push("-".repeat(50));
      result.shares.forEach((s, idx) => {
        const frac = s.fraction
          ? `${s.fraction.numerator}/${s.fraction.denominator}`
          : "-";
        const pct =
          total > 0 ? `${((s.amount / total) * 100).toFixed(1)}%` : "0%";
        lines.push(
          `${String(idx + 1).padEnd(4)} ${s.name.padEnd(20)} ${frac.padEnd(10)} ${formatCurrency(s.amount).padStart(15)} (${pct})`,
        );
      });
      lines.push("-".repeat(50));
      lines.push(
        `${"".padEnd(26)} ${t("export.total").padEnd(10)} ${formatCurrency(total).padStart(15)}`,
      );

      await Share.share({
        message: lines.join("\n"),
        title: t("export.shareTitle"),
      });
    } catch {
      Alert.alert(t("common.error"), t("results.exportFailed"));
    }
  }, [
    result,
    total,
    estateTotal,
    funeral,
    debts,
    will,
    deductions,
    netEstate,
    heirs,
    t,
    dateStr,
  ]);

  const handleCopyClipboard = useCallback(async () => {
    try {
      const lines: string[] = [];
      lines.push(`${t("export.reportTitle")} - ${result.madhhabName}`);
      lines.push(`${t("export.date")}: ${dateStr}`);
      lines.push(`${"=".repeat(50)}`);
      lines.push("");

      lines.push(`--- ${t("export.distributionResults")} ---`);
      lines.push(`${t("estate.netEstate")}: ${formatCurrency(netEstate)}`);
      lines.push(`${t("export.totalDistribution")}: ${formatCurrency(total)}`);
      lines.push(
        `${t("export.confidence")}: ${Math.round(result.confidence)}%`,
      );
      lines.push("");
      result.shares.forEach((s) => {
        const frac = s.fraction
          ? ` (${s.fraction.numerator}/${s.fraction.denominator})`
          : "";
        const pct =
          total > 0 ? ` [${((s.amount / total) * 100).toFixed(1)}%]` : "";
        lines.push(`  ${s.name}${frac}: ${formatCurrency(s.amount)}${pct}`);
      });

      await Clipboard.setStringAsync(lines.join("\n"));
      Alert.alert(t("results.copied"), t("results.copiedMessage"));
    } catch {
      Alert.alert(t("common.error"), t("results.exportFailed"));
    }
  }, [result, total, netEstate, t, dateStr]);

  const handleExportCsv = useCallback(async () => {
    try {
      const header = `${t("export.csvHeader")}\n`;
      const csvRows = result.shares
        .map((s) => {
          const pct = total > 0 ? ((s.amount / total) * 100).toFixed(2) : "0";
          const frac = s.fraction
            ? `${s.fraction.numerator}/${s.fraction.denominator}`
            : "";
          return `"${s.name}","${frac}","${pct}%","${s.amount.toFixed(2)}"`;
        })
        .join("\n");

      await Share.share({
        message: header + csvRows,
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
