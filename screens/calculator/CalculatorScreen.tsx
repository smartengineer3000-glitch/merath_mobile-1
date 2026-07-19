import React, { useState, useCallback, useMemo } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useMadhab } from "../../lib/context/MadhabContext";
import { useCalculator } from "../../lib/inheritance/hooks";
import { useCalculationStore } from "../../lib/context/CalculationContext";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import { EstateCard } from "../../components/estate/EstateCard";
import { HeirCategory } from "../../components/heirs/HeirCategory";
import { QuickAddChips } from "../../components/heirs/QuickAddChips";
import { HeirList } from "../../components/heirs/HeirList";
import { Button, Card, Chip, SectionHeader } from "../../components/ui";
import { HEIR_GROUPS, HEIRS } from "../../constants/heirData";
import type { HeirGroup } from "../../constants/heirData";
import type { MadhhabType } from "../../lib/inheritance/types";

const HEIR_MAX_COUNTS: Record<string, number> = Object.fromEntries(
  HEIRS.map((h) => [h.key, h.maxCount]),
);

export default function CalculatorScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { madhab, setMadhab } = useMadhab();
  const { calculateWithMethod, updateEstateData, estateData } = useCalculator();
  const { saveScenario, logEvent } = useCalculationStore();

  const [funeral, setFuneral] = useState(0);
  const [debts, setDebts] = useState(0);
  const [will, setWillRaw] = useState(0);
  const [deceasedGender, setDeceasedGender] = useState<"male" | "female">(
    "male",
  );

  const handleGenderChange = useCallback((gender: "male" | "female") => {
    setDeceasedGender(gender);
    setSelectedHeirs((prev) => {
      const next = { ...prev };
      if (gender === "male") {
        delete next.husband;
      } else {
        delete next.wife;
      }
      return next;
    });
  }, []);

  const setWill = useCallback(
    (val: number) => {
      const maxWill = estateData.total > 0 ? estateData.total / 3 : 0;
      setWillRaw(Math.min(val, maxWill));
    },
    [estateData.total],
  );
  const [selectedHeirs, setSelectedHeirs] = useState<Record<string, number>>(
    {},
  );
  const [isCalculating, setIsCalculating] = useState(false);

  const netEstate = useMemo(
    () => Math.max(0, estateData.total - funeral - debts - will),
    [estateData.total, funeral, debts, will],
  );

  const deductionsPercent = useMemo(
    () =>
      estateData.total > 0
        ? ((funeral + debts + will) / estateData.total) * 100
        : 0,
    [estateData.total, funeral, debts, will],
  );

  const heirCount = useMemo(
    () => Object.values(selectedHeirs).reduce((sum, c) => sum + (c || 0), 0),
    [selectedHeirs],
  );

  const handleEstateTotalChange = useCallback(
    (val: number) => {
      updateEstateData({ total: val });
    },
    [updateEstateData],
  );

  const handleHeirCountChange = useCallback((key: string, count: number) => {
    setSelectedHeirs((prev) => {
      const next = { ...prev };
      const max = HEIR_MAX_COUNTS[key] ?? 20;
      const clamped = Math.min(count, max);
      if (clamped <= 0) {
        delete next[key];
      } else {
        next[key] = clamped;
      }
      return next;
    });
  }, []);

  const handleQuickAdd = useCallback((data: Record<string, number>) => {
    setSelectedHeirs((prev) => {
      const next = { ...prev };
      for (const [key, count] of Object.entries(data)) {
        const max = HEIR_MAX_COUNTS[key] ?? 20;
        const current = next[key] || 0;
        next[key] = Math.min(current + count, max);
      }
      return next;
    });
  }, []);

  const handleCalculate = useCallback(async () => {
    if (estateData.total <= 0) {
      Alert.alert(t("common.error"), t("results.invalidEstate"));
      return;
    }
    if (will > estateData.total / 3) {
      Alert.alert(t("common.error"), t("calculator.willExceedsOneThird"));
      return;
    }
    if (heirCount === 0) {
      Alert.alert(t("common.error"), t("results.noHeirs"));
      return;
    }

    setIsCalculating(true);
    logEvent(
      "calculation_start",
      `Calculating ${madhab} inheritance for ${heirCount} heirs`,
      {
        madhab,
        estate: estateData.total,
        heirCount,
      },
    );
    try {
      updateEstateData({ total: estateData.total, funeral, debts, will });

      const result = await calculateWithMethod(
        madhab as MadhhabType,
        selectedHeirs,
      );

      if (result && result.success) {
        saveScenario({
          estate: { total: estateData.total, funeral, debts, will },
          heirs: selectedHeirs,
          madhab: madhab as MadhhabType,
          result,
        });
        logEvent(
          "calculation_complete",
          `Calculation complete: ${result.shares.length} shares, confidence ${result.confidence}%`,
          {
            madhab,
            shares: result.shares.length,
            confidence: result.confidence,
          },
        );
        navigation.navigate("Results");
      } else {
        logEvent("calculation_error", result?.error || "Calculation failed");
        Alert.alert(
          t("common.error"),
          result?.error || t("calculator.calculationFailed"),
        );
      }
    } catch (err) {
      logEvent(
        "calculation_error",
        `Calculation error: ${(err as Error).message}`,
      );
      Alert.alert(t("common.error"), t("calculator.calculationFailed"));
    } finally {
      setIsCalculating(false);
    }
  }, [
    estateData.total,
    funeral,
    debts,
    will,
    selectedHeirs,
    madhab,
    heirCount,
    calculateWithMethod,
    updateEstateData,
    saveScenario,
    navigation,
    t,
    logEvent,
  ]);

  const madhabOptions: { key: MadhhabType; label: string }[] = [
    { key: "hanafi", label: t("madhab.hanafi") },
    { key: "maliki", label: t("madhab.maliki") },
    { key: "shafii", label: t("madhab.shafii") },
    { key: "hanbali", label: t("madhab.hanbali") },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.light },
      ]}
    >
      <AnimatedHeader title={t("calculator.title")} rightIcon="moon-outline" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Madhab selector */}
        <View style={styles.madhabRow}>
          {madhabOptions.map((m) => (
            <Chip
              key={m.key}
              label={m.label}
              selected={madhab === m.key}
              onPress={() => {
                setMadhab(m.key);
                logEvent("madhab_change", `Changed madhab to ${m.label}`);
              }}
              size="sm"
            />
          ))}
        </View>

        {/* Deceased Gender */}
        <Card variant="outlined" style={styles.section}>
          <SectionHeader title={t("calculator.deceasedGender")} />
          <View style={styles.genderRow}>
            <Chip
              label={t("calculator.deceasedGenderMale")}
              selected={deceasedGender === "male"}
              onPress={() => handleGenderChange("male")}
              size="sm"
            />
            <Chip
              label={t("calculator.deceasedGenderFemale")}
              selected={deceasedGender === "female"}
              onPress={() => handleGenderChange("female")}
              size="sm"
            />
          </View>
        </Card>

        {/* Estate Card */}
        <EstateCard
          total={estateData.total}
          funeral={funeral}
          debts={debts}
          will={will}
          onTotalChange={handleEstateTotalChange}
          onFuneralChange={setFuneral}
          onDebtsChange={setDebts}
          onWillChange={setWill}
          netEstate={netEstate}
          deductionsPercent={deductionsPercent}
        />

        {/* Quick Add */}
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title={t("calculator.quickAddScenarios")} />
          <QuickAddChips onSelect={handleQuickAdd} />
        </Card>

        {/* Heirs Categories */}
        <Card variant="elevated" style={styles.section}>
          <SectionHeader
            title={t("heirs.title")}
            actionLabel={`${heirCount} ${t("calculator.selected")}`}
          />
          {(Object.keys(HEIR_GROUPS) as HeirGroup[]).map((group) => (
            <HeirCategory
              key={group}
              group={group}
              selectedHeirs={selectedHeirs}
              onHeirCountChange={handleHeirCountChange}
              deceasedGender={deceasedGender}
            />
          ))}
        </Card>

        {/* Selected Heirs Summary */}
        {heirCount > 0 && (
          <Card variant="filled" style={styles.section}>
            <SectionHeader
              title={`${t("calculator.selectedHeirs")} (${heirCount})`}
            />
            <HeirList selectedHeirs={selectedHeirs} />
          </Card>
        )}
      </ScrollView>

      {/* Calculate Button */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.colors.background.light },
        ]}
      >
        <Button
          title={
            isCalculating
              ? t("calculator.calculating")
              : t("calculator.calculate")
          }
          onPress={handleCalculate}
          variant="primary"
          fullWidth
          loading={isCalculating}
          disabled={estateData.total <= 0 || heirCount === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 120 },
  madhabRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  genderRow: { flexDirection: "row", gap: 8 },
  section: { marginBottom: 12 },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 4,
  },
});
