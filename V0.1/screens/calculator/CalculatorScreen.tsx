import React, { useState, useCallback, useMemo } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useMadhab } from "../../lib/context/MadhabContext";
import { useCalculator } from "../../lib/hooks/useCalculator";
import { useCalculationStore } from "../../lib/context/CalculationContext";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import { EstateCard } from "../../components/estate/EstateCard";
import { HeirCategory } from "../../components/heirs/HeirCategory";
import { QuickAddChips } from "../../components/heirs/QuickAddChips";
import { HeirList } from "../../components/heirs/HeirList";
import {
  Button,
  Card,
  Chip,
  SectionHeader,
  EmptyState,
} from "../../components/ui";
import { HEIR_GROUPS } from "../../constants/heirData";
import type { HeirGroup } from "../../constants/heirData";
import type { MadhhabType } from "../../lib/inheritance/types";

export default function CalculatorScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { madhab, setMadhab } = useMadhab();
  const { calculateWithEstate } = useCalculator();
  const { saveScenario } = useCalculationStore();

  const [estateTotal, setEstateTotal] = useState(0);
  const [funeral, setFuneral] = useState(0);
  const [debts, setDebts] = useState(0);
  const [will, setWill] = useState(0);
  const [selectedHeirs, setSelectedHeirs] = useState<Record<string, number>>(
    {},
  );
  const [isCalculating, setIsCalculating] = useState(false);

  const netEstate = useMemo(
    () => Math.max(0, estateTotal - funeral - debts - will),
    [estateTotal, funeral, debts, will],
  );

  const deductionsPercent = useMemo(
    () =>
      estateTotal > 0 ? ((funeral + debts + will) / estateTotal) * 100 : 0,
    [estateTotal, funeral, debts, will],
  );

  const heirCount = useMemo(
    () => Object.values(selectedHeirs).reduce((sum, c) => sum + (c || 0), 0),
    [selectedHeirs],
  );

  const handleHeirCountChange = useCallback((key: string, count: number) => {
    setSelectedHeirs((prev) => {
      const next = { ...prev };
      if (count <= 0) {
        delete next[key];
      } else {
        next[key] = count;
      }
      return next;
    });
  }, []);

  const handleQuickAdd = useCallback((data: Record<string, number>) => {
    setSelectedHeirs((prev) => {
      const next = { ...prev };
      for (const [key, count] of Object.entries(data)) {
        next[key] = (next[key] || 0) + count;
      }
      return next;
    });
  }, []);

  const handleCalculate = useCallback(async () => {
    if (estateTotal <= 0) {
      Alert.alert(t("common.error"), t("results.invalidEstate"));
      return;
    }
    if (heirCount === 0) {
      Alert.alert(t("common.error"), t("results.noHeirs"));
      return;
    }

    setIsCalculating(true);
    try {
      const estate = { total: estateTotal, funeral, debts, will };
      const result = await calculateWithEstate(
        madhab as MadhhabType,
        estate,
        selectedHeirs,
      );

      if (result && result.success) {
        saveScenario({
          estate,
          heirs: selectedHeirs,
          madhab: madhab as MadhhabType,
          result,
        });
        navigation.navigate("Results", { result });
      } else {
        Alert.alert(
          t("common.error"),
          result?.error || t("calculator.calculationFailed"),
        );
      }
    } catch (err) {
      Alert.alert(t("common.error"), t("calculator.calculationFailed"));
    } finally {
      setIsCalculating(false);
    }
  }, [
    estateTotal,
    funeral,
    debts,
    will,
    selectedHeirs,
    madhab,
    heirCount,
    calculateWithEstate,
    saveScenario,
    navigation,
    t,
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
              onPress={() => setMadhab(m.key)}
              size="sm"
            />
          ))}
        </View>

        {/* Estate Card */}
        <EstateCard
          total={estateTotal}
          funeral={funeral}
          debts={debts}
          will={will}
          onTotalChange={setEstateTotal}
          onFuneralChange={setFuneral}
          onDebtsChange={setDebts}
          onWillChange={setWill}
          netEstate={netEstate}
          deductionsPercent={deductionsPercent}
        />

        {/* Quick Add */}
        <Card variant="elevated" style={styles.section}>
          <SectionHeader title="Quick Add Scenarios" />
          <QuickAddChips onSelect={handleQuickAdd} />
        </Card>

        {/* Heirs Categories */}
        <Card variant="elevated" style={styles.section}>
          <SectionHeader
            title={t("heirs.title")}
            actionLabel={`${heirCount} selected`}
          />
          {(Object.keys(HEIR_GROUPS) as HeirGroup[]).map((group) => (
            <HeirCategory
              key={group}
              group={group}
              selectedHeirs={selectedHeirs}
              onHeirCountChange={handleHeirCountChange}
            />
          ))}
        </Card>

        {/* Selected Heirs Summary */}
        {heirCount > 0 && (
          <Card variant="filled" style={styles.section}>
            <SectionHeader title={`Selected Heirs (${heirCount})`} />
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
          disabled={estateTotal <= 0 || heirCount === 0}
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
