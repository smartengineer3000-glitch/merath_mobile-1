import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Ionicons } from "../../lib/icons";
import { Card, SectionHeader } from "../ui";
import { formatCurrency } from "../../lib/utils/formatters";

interface EstateCardProps {
  total: number;
  funeral: number;
  debts: number;
  will: number;
  onTotalChange: (val: number) => void;
  onFuneralChange: (val: number) => void;
  onDebtsChange: (val: number) => void;
  onWillChange: (val: number) => void;
  netEstate: number;
  deductionsPercent: number;
}

export function EstateCard({
  total,
  funeral,
  debts,
  will,
  onTotalChange,
  onFuneralChange,
  onDebtsChange,
  onWillChange,
  netEstate,
  deductionsPercent,
}: EstateCardProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Card variant="elevated" style={styles.card}>
      <SectionHeader title={t("estate.title")} />

      <View style={styles.totalRow}>
        <Text
          style={[
            styles.inputLabel,
            {
              color: theme.colors.neutral.dark200,
              fontFamily: theme.fontFamily.english,
            },
          ]}
        >
          {t("estate.total")}
        </Text>
        <View
          style={[
            styles.totalInputWrapper,
            {
              borderColor: theme.colors.primary.main,
              borderRadius: theme.borderRadius.md,
            },
          ]}
        >
          <TextInput
            style={[
              styles.totalInput,
              {
                color: theme.colors.neutral.dark300,
                fontFamily: theme.fontFamily.english,
              },
            ]}
            placeholder="0"
            placeholderTextColor={theme.colors.neutral.light300}
            keyboardType="numeric"
            value={total > 0 ? String(total) : ""}
            onChangeText={(text) =>
              onTotalChange(Number(text.replace(/[^0-9.]/g, "")) || 0)
            }
          />
          <Text
            style={[
              styles.currency,
              {
                color: theme.colors.neutral.light400,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            SAR
          </Text>
        </View>
      </View>

      {total > 0 && (
        <View
          style={[
            styles.netEstateRow,
            {
              backgroundColor:
                netEstate > 0
                  ? theme.colors.success.light
                  : theme.colors.error.light,
              borderRadius: theme.borderRadius.sm,
            },
          ]}
        >
          <Ionicons
            name={netEstate > 0 ? "checkmark-circle" : "alert-circle"}
            size={16}
            color={
              netEstate > 0
                ? theme.colors.success.dark
                : theme.colors.error.dark
            }
          />
          <Text
            style={[
              styles.netEstateLabel,
              {
                color:
                  netEstate > 0
                    ? theme.colors.success.dark
                    : theme.colors.error.dark,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {t("estate.netEstate")}: {formatCurrency(netEstate)} SAR
          </Text>
        </View>
      )}

      {total > 0 && deductionsPercent > 0 && (
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {
                backgroundColor: theme.colors.neutral.light100,
                borderRadius: 4,
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(deductionsPercent, 100)}%`,
                  backgroundColor:
                    deductionsPercent > 50
                      ? theme.colors.warning.main
                      : theme.colors.primary.main,
                  borderRadius: 4,
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.progressLabel,
              {
                color: theme.colors.neutral.light400,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {t("estate.deductions")} {Math.round(deductionsPercent)}%
          </Text>
        </View>
      )}

      <TouchableOpacity
        onPress={() => setShowAdvanced(!showAdvanced)}
        style={styles.advancedToggle}
      >
        <Ionicons
          name={showAdvanced ? "chevron-up" : "chevron-down"}
          size={18}
          color={theme.colors.primary.main}
        />
        <Text
          style={[
            styles.advancedText,
            {
              color: theme.colors.primary.main,
              fontFamily: theme.fontFamily.english,
            },
          ]}
        >
          {showAdvanced
            ? t("estate.hideDeductions")
            : t("estate.deductionsWill")}
        </Text>
      </TouchableOpacity>

      {showAdvanced && (
        <View style={styles.advancedFields}>
          <DeductionField
            label={t("estate.funeral")}
            value={funeral}
            onChange={onFuneralChange}
            theme={theme}
          />
          <DeductionField
            label={t("estate.debts")}
            value={debts}
            onChange={onDebtsChange}
            theme={theme}
          />
          <DeductionField
            label={t("estate.will")}
            value={will}
            onChange={onWillChange}
            theme={theme}
            hint={t("estate.maxOneThird")}
          />
        </View>
      )}
    </Card>
  );
}

function DeductionField({
  label,
  value,
  onChange,
  theme,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  theme: any;
  hint?: string;
}) {
  return (
    <View style={deductionStyles.row}>
      <View style={deductionStyles.labelContainer}>
        <Text
          style={[
            deductionStyles.label,
            {
              color: theme.colors.neutral.dark200,
              fontFamily: theme.fontFamily.english,
            },
          ]}
        >
          {label}
        </Text>
        {hint && (
          <Text
            style={[
              deductionStyles.hint,
              {
                color: theme.colors.neutral.light400,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {hint}
          </Text>
        )}
      </View>
      <TextInput
        style={[
          deductionStyles.input,
          {
            color: theme.colors.neutral.dark300,
            borderColor: theme.colors.neutral.light200,
            borderRadius: theme.borderRadius.sm,
            fontFamily: theme.fontFamily.english,
          },
        ]}
        placeholder="0"
        placeholderTextColor={theme.colors.neutral.light300}
        keyboardType="numeric"
        value={value > 0 ? String(value) : ""}
        onChangeText={(text) =>
          onChange(Number(text.replace(/[^0-9.]/g, "")) || 0)
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  totalRow: { marginBottom: 12 },
  inputLabel: { fontSize: 12, fontWeight: "600", marginBottom: 6 },
  totalInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  totalInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    paddingVertical: 10,
  },
  currency: { fontSize: 14, fontWeight: "500", marginLeft: 8 },
  netEstateRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 12,
  },
  netEstateLabel: { fontSize: 13, fontWeight: "600" },
  progressContainer: { marginBottom: 12 },
  progressBar: { height: 6, overflow: "hidden", marginBottom: 4 },
  progressFill: { height: "100%" },
  progressLabel: { fontSize: 11, fontWeight: "500" },
  advancedToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  advancedText: { fontSize: 13, fontWeight: "500" },
  advancedFields: { marginTop: 12 },
});

const deductionStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  labelContainer: { flex: 1, marginRight: 12 },
  label: { fontSize: 13, fontWeight: "500" },
  hint: { fontSize: 10, marginTop: 2 },
  input: {
    width: 120,
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 14,
    textAlign: "right",
  },
});
