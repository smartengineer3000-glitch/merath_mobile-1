import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useMadhab } from "../lib/context/MadhabContext";
import { useCalculationScenario } from "../lib/context/CalculationContext";
import { useAppTheme } from "../lib/context/ThemeProvider";
import { useCalculator } from "../lib/hooks/useCalculator";
import { useResults } from "../lib/hooks/useResults";
import { EstateInput } from "../components/EstateInput";
import { HeirSelector } from "../components/HeirSelector";
import { MadhhabSelector } from "../components/MadhhabSelector";
import { Card } from "../components/ui/Card";
import { PrimaryButton, SecondaryButton } from "../components/ui/Button";
import type { Theme } from "../lib/design/theme";
import type { EstateData, HeirsData } from "../lib/inheritance/types";
import type { TabParamList } from "../navigation/types";

type StepStatus = "active" | "complete" | "pending";

type StepCardProps = {
  index: number;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  status: StepStatus;
  children: React.ReactNode;
  collapsed?: boolean;
  onPress?: () => void;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("ar-SA", {
    maximumFractionDigits: 0,
  }).format(Math.max(0, value || 0));

function StepCard({
  index,
  title,
  subtitle,
  icon,
  status,
  children,
  collapsed = false,
  onPress,
}: StepCardProps) {
  const statusLabel = status === "complete" ? "complete" : status === "active" ? "active" : "pending";

  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const isComplete = status === "complete";
  const isActive = status === "active";

  return (
    <Card
      style={StyleSheet.flatten([
        styles.stepCard,
        isActive ? styles.stepCardActive : undefined,
      ])}
      elevation={isActive ? "high" : "low"}
      onPress={onPress}
      accessibilityLabel={`${title}, ${status === "complete" ? "completed" : status === "active" ? "active step" : "pending"}`}
      accessibilityRole="button"
    >
      <View style={styles.stepHeaderRow}>
        <View
          style={[
            styles.stepBadge,
            isComplete && styles.stepBadgeComplete,
            isActive && styles.stepBadgeActive,
          ]}
        >
          {isComplete ? (
            <MaterialCommunityIcons
              name="check"
              size={18}
              color={theme.colors.background.light}
            />
          ) : (
            <Text
              style={[
                styles.stepBadgeText,
                isActive && styles.stepBadgeTextActive,
              ]}
            >
              {index}
            </Text>
          )}
        </View>
        <View style={styles.stepTitleBlock}>
          <Text style={styles.stepTitle}>{title}</Text>
          <Text style={styles.stepSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.stepIconCircle}>
          <MaterialCommunityIcons
            name={collapsed ? "chevron-down" : icon}
            size={22}
            color={theme.colors.primary.main}
          />
        </View>
      </View>
      {!collapsed && <View style={styles.stepContent}>{children}</View>}
    </Card>
  );
}

export default function CalculatorScreen() {
  const { t } = useTranslation();
  const { madhab, setMadhab } = useMadhab();
  const { theme } = useAppTheme();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const { calculateWithEstate } = useCalculator();
  const { setResult, clearResults } = useResults();
  const { saveScenario, clearScenario } = useCalculationScenario();
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [currentEstate, setCurrentEstate] = useState<EstateData>({
    total: 0,
    funeral: 0,
    debts: 0,
    will: 0,
  });
  const [currentHeirs, setCurrentHeirs] = useState<HeirsData>({});

  const handleEstateChange = useCallback((estate: EstateData) => {
    setCurrentEstate(estate);
    if (estate.total > 0) {
      setActiveStep((step) => (step === 1 ? 2 : step));
    }
  }, []);

  const handleHeirsChange = useCallback((heirs: HeirsData) => {
    setCurrentHeirs(heirs);
    const heirCount = Object.values(heirs).reduce<number>(
      (sum, value) => sum + (value ?? 0),
      0,
    );
    if (heirCount > 0) {
      setActiveStep((step) => (step === 2 ? 3 : step));
    }
  }, []);

  const handleMadhabSelect = useCallback(
    (selectedMadhab: typeof madhab) => {
      setMadhab(selectedMadhab);
      setActiveStep(4);
    },
    [setMadhab],
  );

  const selectedHeirsCount = useMemo(
    () =>
      Object.values(currentHeirs).reduce<number>(
        (sum, value) => sum + (value ?? 0),
        0,
      ),
    [currentHeirs],
  );

  const deductions =
    (currentEstate.funeral ?? 0) +
    (currentEstate.debts ?? 0) +
    (currentEstate.will ?? 0);
  const netEstate = Math.max(0, (currentEstate.total ?? 0) - deductions);
  const progress = [
    currentEstate.total > 0,
    selectedHeirsCount > 0,
    Boolean(madhab),
  ].filter(Boolean).length;
  const canCalculate = currentEstate.total > 0 && selectedHeirsCount > 0;

  const handleCalculate = useCallback(async () => {
    if (currentEstate.total <= 0) {
      Alert.alert(t("common.error"), t("results.invalidEstate"));
      return;
    }

    const hasHeirs = Object.values(currentHeirs).some((v) => (v ?? 0) > 0);
    if (!hasHeirs) {
      Alert.alert(t("common.error"), t("results.noHeirs"));
      return;
    }

    try {
      setIsCalculating(true);
      const calculationResult = await calculateWithEstate(
        madhab,
        currentEstate,
        currentHeirs,
      );
      if (calculationResult.success) {
        setResult(calculationResult);
        saveScenario({
          estate: currentEstate,
          heirs: currentHeirs,
          madhab,
          result: calculationResult,
        });
        navigation.navigate("Results");
      } else {
        Alert.alert(
          t("common.error"),
          calculationResult.error || t("calculator.calculationFailed"),
        );
      }
    } catch (error) {
      Alert.alert(t("common.error"), t("calculator.calculationFailed"));
    } finally {
      setIsCalculating(false);
    }
  }, [
    madhab,
    currentEstate,
    currentHeirs,
    calculateWithEstate,
    setResult,
    saveScenario,
    navigation,
    t,
  ]);

  const handleReset = useCallback(() => {
    setCurrentEstate({ total: 0, funeral: 0, debts: 0, will: 0 });
    setCurrentHeirs({});
    clearResults();
    clearScenario();
    setActiveStep(1);
  }, [clearResults, clearScenario]);

  const styles = createStyles(theme);

  const estateStepStatus: StepStatus =
    activeStep === 1
      ? "active"
      : currentEstate.total > 0
        ? "complete"
        : "pending";
  const heirsStepStatus: StepStatus =
    selectedHeirsCount > 0
      ? activeStep === 2
        ? "active"
        : "complete"
      : currentEstate.total > 0
        ? "active"
        : "pending";
  const madhabStepStatus: StepStatus =
    activeStep === 3
      ? "active"
      : selectedHeirsCount > 0 && madhab
        ? "complete"
        : selectedHeirsCount > 0
          ? "active"
          : "pending";
  const reviewStepStatus: StepStatus = canCalculate ? "active" : "pending";

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.heroCard}>
              <View style={styles.heroTopRow}>
                <View style={styles.heroIconWrap}>
                  <MaterialCommunityIcons
                    name="scale-balance"
                    size={30}
                    color={theme.colors.primary.main}
                  />
                </View>
                <View style={styles.heroCopy}>
                  <Text style={styles.eyebrow}>Merath Calculator</Text>
                  <Text style={styles.title}>{t("calculator.title")}</Text>
                  <Text style={styles.subtitle}>
                    {t("calculator.subtitle")}
                  </Text>
                </View>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(progress / 3) * 100}%` },
                  ]}
                />
              </View>
              <View style={styles.summaryRow}>
                <View style={styles.summaryPill}>
                  <Text style={styles.summaryLabel}>صافي التركة</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(netEstate)}
                  </Text>
                </View>
                <View style={styles.summaryPill}>
                  <Text style={styles.summaryLabel}>الورثة</Text>
                  <Text style={styles.summaryValue}>{selectedHeirsCount}</Text>
                </View>
                <View style={styles.summaryPill}>
                  <Text style={styles.summaryLabel}>الخطوات</Text>
                  <Text style={styles.summaryValue}>{progress}/3</Text>
                </View>
              </View>
            </View>

            <StepCard
              index={1}
              title={t("calculator.estateDetails")}
              subtitle="أدخل قيمة التركة والخصومات مع ملخص صافي فوري"
              icon="wallet-outline"
              status={estateStepStatus}
              collapsed={activeStep !== 1 && currentEstate.total > 0}
              onPress={() => setActiveStep(1)}
            >
              <View style={styles.netEstateBanner}>
                <MaterialCommunityIcons
                  name="wallet-outline"
                  size={22}
                  color={theme.colors.primary.main}
                />
                <View style={styles.netEstateCopy}>
                  <Text style={styles.netEstateLabel}>صافي التركة المتوقع</Text>
                  <Text style={styles.netEstateValue}>
                    {formatCurrency(netEstate)}
                  </Text>
                </View>
              </View>
              <EstateInput onEstateChange={handleEstateChange} />
            </StepCard>

            <StepCard
              index={2}
              title={t("calculator.heirs")}
              subtitle="حدد الورثة بأزرار واضحة وراجع العدد المختار قبل الحساب"
              icon="account-group"
              status={heirsStepStatus}
              collapsed={activeStep !== 2 && selectedHeirsCount > 0}
              onPress={() => currentEstate.total > 0 && setActiveStep(2)}
            >
              {selectedHeirsCount > 0 && (
                <View style={styles.selectionSummary}>
                  <MaterialCommunityIcons
                    name="account-check"
                    size={20}
                    color={theme.colors.success.main}
                  />
                  <Text style={styles.selectionSummaryText}>
                    تم اختيار {selectedHeirsCount} من الورثة
                  </Text>
                </View>
              )}
              <HeirSelector onHeirsChange={handleHeirsChange} />
            </StepCard>

            <StepCard
              index={3}
              title={t("calculator.madhab")}
              subtitle="اختر طريقة الحساب واعرض أثر الاختيار بعد ظهور النتائج"
              icon="school"
              status={madhabStepStatus}
              collapsed={
                activeStep !== 3 && selectedHeirsCount > 0 && Boolean(madhab)
              }
              onPress={() => selectedHeirsCount > 0 && setActiveStep(3)}
            >
              <MadhhabSelector
                selectedMadhab={madhab}
                onSelect={handleMadhabSelect}
              />
            </StepCard>

            <StepCard
              index={4}
              title="مراجعة قبل الحساب"
              subtitle="تأكد من صافي التركة وعدد الورثة قبل تنفيذ الحساب"
              icon="clipboard-check-outline"
              status={reviewStepStatus}
              onPress={() => canCalculate && setActiveStep(4)}
            >
              <View style={styles.reviewGrid}>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>إجمالي التركة</Text>
                  <Text style={styles.reviewValue}>
                    {formatCurrency(currentEstate.total)}
                  </Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>الخصومات</Text>
                  <Text style={styles.reviewValue}>
                    {formatCurrency(deductions)}
                  </Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>صافي التركة</Text>
                  <Text style={styles.reviewValue}>
                    {formatCurrency(netEstate)}
                  </Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>عدد الورثة</Text>
                  <Text style={styles.reviewValue}>{selectedHeirsCount}</Text>
                </View>
              </View>
            </StepCard>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={
                isCalculating
                  ? t("calculator.calculating")
                  : t("calculator.calculate")
              }
              onPress={handleCalculate}
              disabled={isCalculating || !canCalculate}
              loading={isCalculating}
              icon="calculator"
              iconPosition="left"
              style={styles.calculateButton}
              accessibilityLabel={
                isCalculating
                  ? t("calculator.calculatingInheritance")
                  : t("calculator.calculateInheritance")
              }
            />
            <SecondaryButton
              title={t("calculator.reset")}
              onPress={handleReset}
              icon="refresh"
              iconPosition="left"
              style={styles.resetButton}
              accessibilityLabel={t("calculator.resetAllFields")}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background.lightVariant,
    },
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    heroCard: {
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
      backgroundColor:
        theme.mode === "dark"
          ? theme.colors.background.light
          : theme.colors.primary.light,
      borderWidth: 1,
      borderColor: theme.colors.primary.lighter,
      ...theme.shadows.md,
    },
    heroTopRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    heroIconWrap: {
      width: 62,
      height: 62,
      borderRadius: theme.borderRadius.xl,
      backgroundColor: theme.colors.background.light,
      alignItems: "center",
      justifyContent: "center",
      ...theme.shadows.sm,
    },
    heroCopy: {
      flex: 1,
    },
    eyebrow: {
      ...theme.typography.label.medium,
      color: theme.colors.tertiary.dark200,
      marginBottom: theme.spacing.xs,
      fontFamily: theme.fontFamily.english,
      textTransform: "uppercase",
    },
    title: {
      ...theme.typography.display.medium,
      color: theme.colors.primary.dark200,
      fontFamily: theme.fontFamily.english,
    },
    subtitle: {
      ...theme.typography.body.medium,
      color: theme.colors.neutral.dark200,
      marginTop: theme.spacing.xs,
    },
    progressTrack: {
      height: 8,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background.light,
      overflow: "hidden",
      marginTop: theme.spacing.xl,
    },
    progressFill: {
      height: "100%",
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary.main,
    },
    summaryRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginTop: theme.spacing.lg,
    },
    summaryPill: {
      flex: 1,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background.light,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
    },
    summaryLabel: {
      ...theme.typography.label.small,
      color: theme.colors.neutral.main,
      marginBottom: theme.spacing.xs,
    },
    summaryValue: {
      ...theme.typography.title.large,
      color: theme.colors.primary.main,
    },
    stepCard: {
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
    },
    stepCardActive: {
      borderColor: theme.colors.primary.light100,
    },
    stepHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    stepBadge: {
      width: 34,
      height: 34,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.neutral.light100,
      alignItems: "center",
      justifyContent: "center",
    },
    stepBadgeActive: {
      backgroundColor: theme.colors.primary.light,
      borderWidth: 1,
      borderColor: theme.colors.primary.light100,
    },
    stepBadgeComplete: {
      backgroundColor: theme.colors.success.main,
    },
    stepBadgeText: {
      ...theme.typography.label.large,
      color: theme.colors.neutral.dark200,
    },
    stepBadgeTextActive: {
      color: theme.colors.primary.main,
    },
    stepTitleBlock: {
      flex: 1,
    },
    stepTitle: {
      ...theme.typography.headline.medium,
      color: theme.colors.neutral.dark300,
    },
    stepSubtitle: {
      ...theme.typography.body.small,
      color: theme.colors.neutral.main,
      marginTop: 2,
    },
    stepIconCircle: {
      width: 42,
      height: 42,
      borderRadius: theme.borderRadius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary.light,
    },
    stepContent: {
      marginTop: theme.spacing.lg,
    },
    netEstateBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary.light,
      marginBottom: theme.spacing.md,
    },
    netEstateCopy: {
      flex: 1,
    },
    netEstateLabel: {
      ...theme.typography.label.medium,
      color: theme.colors.neutral.dark200,
    },
    netEstateValue: {
      ...theme.typography.headline.medium,
      color: theme.colors.primary.main,
      marginTop: 2,
    },
    selectionSummary: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.success.light,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    selectionSummaryText: {
      ...theme.typography.body.medium,
      color: theme.colors.neutral.dark300,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
      backgroundColor: theme.colors.background.light,
      borderTopWidth: 1,
      borderTopColor: theme.colors.neutral.light200,
    },
    calculateButton: {
      flex: 1.35,
    },
    resetButton: {
      flex: 1,
    },
    reviewGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    reviewItem: {
      flexBasis: "48%",
      flexGrow: 1,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.neutral.light50,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
      padding: theme.spacing.md,
    },
    reviewLabel: {
      ...theme.typography.label.small,
      color: theme.colors.neutral.main,
      marginBottom: theme.spacing.xs,
    },
    reviewValue: {
      ...theme.typography.title.medium,
      color: theme.colors.neutral.dark300,
    },
  });
