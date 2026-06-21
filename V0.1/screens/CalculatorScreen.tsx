import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
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
import { ResultsDisplay } from "../components/ResultsDisplay";
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
};

const Tab = createMaterialTopTabNavigator();

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
}: StepCardProps) {
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
            name={icon}
            size={22}
            color={theme.colors.primary.main}
          />
        </View>
      </View>
      <View style={styles.stepContent}>{children}</View>
    </Card>
  );
}

export default function CalculatorScreen() {
  const { t } = useTranslation();
  const { madhab, setMadhab } = useMadhab();
  const { theme } = useAppTheme();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const { calculateWithEstate } = useCalculator();
  const { result, setResult, clearResults } = useResults();
  const { saveScenario, clearScenario } = useCalculationScenario();
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentEstate, setCurrentEstate] = useState<EstateData>({
    total: 0,
    funeral: 0,
    debts: 0,
    will: 0,
  });
  const [currentHeirs, setCurrentHeirs] = useState<HeirsData>({});

  const handleEstateChange = useCallback((estate: EstateData) => {
    setCurrentEstate(estate);
  }, []);

  const handleHeirsChange = useCallback((heirs: HeirsData) => {
    setCurrentHeirs(heirs);
  }, []);

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
    Boolean(madhab),
    currentEstate.total > 0,
    selectedHeirsCount > 0,
  ].filter(Boolean).length;

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
      const calculationResult = await calculateWithEstate(madhab, currentEstate, currentHeirs);
      if (calculationResult.success) {
        setResult(calculationResult);
        saveScenario({
          estate: currentEstate,
          heirs: currentHeirs,
          madhab,
          result: calculationResult,
        });
        setShowResults(true);
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
  }, [madhab, currentEstate, currentHeirs, calculateWithEstate, setResult, saveScenario, t]);

  const handleReset = useCallback(() => {
    setCurrentEstate({ total: 0, funeral: 0, debts: 0, will: 0 });
    setCurrentHeirs({});
    clearResults();
    clearScenario();
    setShowResults(false);
  }, [clearResults, clearScenario]);

  const styles = createStyles(theme);

  const EstateDetailsTab = () => (
    <ScrollView
      style={styles.tabScreen}
      contentContainerStyle={styles.tabContent}
      showsVerticalScrollIndicator={false}
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
    </ScrollView>
  );

  const HeirsTab = () => (
    <ScrollView
      style={styles.tabScreen}
      contentContainerStyle={styles.tabContent}
      showsVerticalScrollIndicator={false}
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
    </ScrollView>
  );

  const MadhabTab = () => (
    <ScrollView
      style={styles.tabScreen}
      contentContainerStyle={styles.tabContent}
      showsVerticalScrollIndicator={false}
    >
      <MadhhabSelector selectedMadhab={madhab} onSelect={setMadhab} />
    </ScrollView>
  );

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
                  <Text style={styles.subtitle}>{t("calculator.subtitle")}</Text>
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
          </ScrollView>

          <View style={styles.tabContainer}>
            <Tab.Navigator
              initialRouteName="EstateDetails"
              screenOptions={{
                tabBarActiveTintColor: theme.colors.primary.main,
                tabBarInactiveTintColor: theme.colors.neutral.main,
                tabBarIndicatorStyle: styles.tabIndicator,
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabLabel,
              }}
            >
              <Tab.Screen
                name="EstateDetails"
                component={EstateDetailsTab}
                options={{ title: t("calculator.estateDetails") }}
              />
              <Tab.Screen
                name="Heirs"
                component={HeirsTab}
                options={{ title: t("calculator.heirs") }}
              />
              <Tab.Screen
                name="Madhab"
                component={MadhabTab}
                options={{ title: t("calculator.madhab") }}
              />
            </Tab.Navigator>
          </View>

          <View style={styles.buttonContainer}>
              <PrimaryButton
              title={
                isCalculating
                  ? t("calculator.calculating")
                  : t("calculator.calculate")
              }
              onPress={handleCalculate}
              disabled={isCalculating}
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

          {showResults && result && (
            <View style={styles.resultsContainer}>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsHeaderTitle}>
                  {t('results.title')}
                </Text>
                <TouchableOpacity
                  style={styles.viewInTabButton}
                  onPress={() => {
                    setShowResults(false);
                    navigation.navigate('Results');
                  }}
                >
                  <MaterialCommunityIcons
                    name="open-in-new"
                    size={18}
                    color={theme.colors.primary.main}
                  />
                  <Text style={styles.viewInTabButtonText}>
                    {t('results.viewInTab')}
                  </Text>
                </TouchableOpacity>
              </View>
              <ResultsDisplay
                result={result}
                onClose={() => setShowResults(false)}
              />
            </View>
          )}
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
      paddingBottom: theme.spacing.xxxl,
    },
    tabContainer: {
      flex: 1,
      minHeight: 420,
      marginBottom: theme.spacing.lg,
    },
    tabScreen: {
      flex: 1,
      backgroundColor: theme.colors.background.lightVariant,
    },
    tabContent: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
    },
    tabBar: {
      backgroundColor: theme.colors.background.light,
      elevation: 0,
      shadowOpacity: 0,
    },
    tabIndicator: {
      backgroundColor: theme.colors.primary.main,
      height: 3,
    },
    tabLabel: {
      fontFamily: "Inter-Bold",
      ...theme.typography.label.small,
      textTransform: "none",
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
      fontFamily: "Inter-Bold",
      textTransform: "uppercase",
    },
    title: {
      ...theme.typography.display.medium,
      color: theme.colors.primary.dark200,
      fontFamily: "Inter-Bold",
    },
    subtitle: {
      ...theme.typography.body.medium,
      color: theme.colors.neutral.dark200,
      marginTop: theme.spacing.xs,
      fontFamily: "Inter-Regular",
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
      fontFamily: "Inter-Regular",
    },
    summaryValue: {
      ...theme.typography.title.large,
      color: theme.colors.primary.main,
      fontFamily: "Inter-Bold",
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
      fontFamily: "Inter-Bold",
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
      fontFamily: "Inter-Bold",
    },
    stepSubtitle: {
      ...theme.typography.body.small,
      color: theme.colors.neutral.main,
      marginTop: 2,
      fontFamily: "Inter-Regular",
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
      fontFamily: "Inter-Regular",
    },
    netEstateValue: {
      ...theme.typography.headline.medium,
      color: theme.colors.primary.main,
      fontFamily: "Inter-Bold",
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
      fontFamily: "Inter-Bold",
    },
    buttonContainer: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    calculateButton: {
      flex: 1.35,
    },
    resetButton: {
      flex: 1,
    },
    resultsContainer: {
      marginBottom: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.neutral.light200,
      paddingTop: theme.spacing.md,
    },
    resultsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    resultsHeaderTitle: {
      ...theme.typography.headline.small,
      color: theme.colors.neutral.dark300,
    },
    viewInTabButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: 16,
      backgroundColor: theme.colors.primary.light,
    },
    viewInTabButtonText: {
      ...theme.typography.label.small,
      color: theme.colors.primary.main,
    },
  });
