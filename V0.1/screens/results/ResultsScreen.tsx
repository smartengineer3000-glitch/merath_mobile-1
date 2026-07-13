import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
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
  Avatar,
} from "../../components/ui";
import { Ionicons } from "../../lib/icons";
import { formatCurrency, formatPercentage } from "../../lib/utils/formatters";
import type { CalculationResult, HeirShare } from "../../lib/inheritance/types";

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
          <View
            style={[styles.confidenceCircle, { borderColor: confidenceColor }]}
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

      {/* Distribution List */}
      <Card variant="elevated">
        <SectionHeader title={t("results.distributionBreakdown")} />
        {result.shares.map((share, index) => (
          <ShareRow key={index} share={share} total={total} theme={theme} />
        ))}
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

function ShareRow({
  share,
  total,
  theme,
}: {
  share: HeirShare;
  total: number;
  theme: any;
}) {
  const { t } = useTranslation();
  const percentage = total > 0 ? (share.amount / total) * 100 : 0;

  return (
    <View
      style={[
        shareStyles.row,
        { borderBottomColor: theme.colors.neutral.light100 },
      ]}
    >
      <Avatar icon="account" color={theme.colors.primary.lighter} size={32} />
      <View style={shareStyles.info}>
        <Text
          style={[
            shareStyles.name,
            {
              color: theme.colors.neutral.dark200,
              fontFamily: theme.fontFamily.english,
            },
          ]}
        >
          {share.name}
        </Text>
        <View style={shareStyles.meta}>
          {share.fraction && (
            <Text
              style={[
                shareStyles.fraction,
                {
                  color: theme.colors.neutral.light400,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {share.fraction.numerator}/{share.fraction.denominator}
            </Text>
          )}
          <Text
            style={[
              shareStyles.percentage,
              {
                color: theme.colors.primary.main,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {formatPercentage(percentage)}
          </Text>
        </View>
      </View>
      <Text
        style={[
          shareStyles.amount,
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

  const exportOptions = [
    {
      icon: "document-text",
      label: t("results.exportPdf"),
      description: t("results.exportPdfDesc"),
    },
    {
      icon: "image",
      label: t("results.exportImage"),
      description: t("results.exportImageDesc"),
    },
    {
      icon: "copy",
      label: t("results.exportClipboard"),
      description: t("results.exportClipboardDesc"),
    },
    {
      icon: "share-social",
      label: t("results.exportShare"),
      description: t("results.exportShareDesc"),
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
              name="chevron-forward"
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
  confidenceCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  confidenceValue: { fontSize: 14, fontWeight: "700" },
  heroBadges: { flexDirection: "row", gap: 8, marginTop: 12, flexWrap: "wrap" },
  emptyCard: { margin: 16, flex: 1 },
  emptyContainer: { alignItems: "center", paddingVertical: 40 },
  emptyTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  emptyMessage: { fontSize: 13, textAlign: "center", marginBottom: 20 },
  blockedHeir: { fontSize: 13, paddingVertical: 4 },
});

const shareStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  info: { flex: 1 },
  name: { fontSize: 13, fontWeight: "600", marginBottom: 2 },
  meta: { flexDirection: "row", gap: 8 },
  fraction: { fontSize: 11, fontWeight: "500" },
  percentage: { fontSize: 11, fontWeight: "600" },
  amount: { fontSize: 14, fontWeight: "700" },
});

const stepStyles = StyleSheet.create({
  step: {
    flexDirection: "row",
    paddingVertical: 12,
    borderLeftWidth: 2,
    paddingLeft: 12,
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
