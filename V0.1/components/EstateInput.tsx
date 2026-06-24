/**
 * @file EstateInput.tsx
 * @description مكون إدخال بيانات التركة مع التحقق والمُلخص
 * FIXES: C1 (decimal parsing), H6 (keyboard handling)
 * HIGH PRIORITY FIXES:
 * - Issue 1: Inline validation feedback (replaced Alert)
 * - Issue 2: Responsive layout for 320px screens
 * - Issue 3: Keyboard auto-scroll to focused input
 */

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { useAppTheme } from "../lib/context/ThemeProvider";
import { useCalculator } from "../lib/inheritance/hooks";
import type { Theme } from "../lib/design/theme";
import { EstateData } from "../lib/inheritance/types";
import { EstateValidator } from "../lib/validation/InputValidator";
import type { ValidationResult } from "../lib/validation/InputValidator";
import { parseSafeDecimal } from "../lib/utils/parsers";
import { formatCurrency } from "../lib/utils/formatters";

export interface EstateInputProps {
  onEstateChange?: (estate: EstateData) => void;
  initialEstate?: EstateData;
}

export function EstateInput({
  onEstateChange,
  initialEstate,
}: EstateInputProps) {
  const { theme } = useAppTheme();
  const { estateData, updateEstateData } = useCalculator();
  const { width } = Dimensions.get("window");
  const isNarrowScreen = width < 360;

  // ===== FIX H6: Keyboard handling refs =====
  const scrollViewRef = useRef<ScrollView>(null);
  const totalInputRef = useRef<TextInput>(null);
  const funeralInputRef = useRef<TextInput>(null);
  const debtsInputRef = useRef<TextInput>(null);
  const willInputRef = useRef<TextInput>(null);

  // ===== FIX H1: Debounce timer for validation =====
  const validationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [total, setTotal] = useState(
    initialEstate?.total.toString() || estateData.total.toString(),
  );
  const [funeral, setFuneral] = useState(
    (
      initialEstate?.funeral ??
      initialEstate?.funeralCosts ??
      estateData.funeral ??
      estateData.funeralCosts ??
      0
    ).toString(),
  );
  const [debts, setDebts] = useState(
    (initialEstate?.debts ?? estateData.debts ?? 0).toString(),
  );
  const [will, setWill] = useState(
    (
      initialEstate?.will ??
      initialEstate?.willAmount ??
      estateData.will ??
      estateData.willAmount ??
      0
    ).toString(),
  );
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // ===== FIX H6: Keyboard listeners with auto-scroll =====
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        // Auto-scroll to focused input when keyboard appears
        if (focusedField && scrollViewRef.current) {
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      if (validationTimerRef.current) {
        clearTimeout(validationTimerRef.current);
      }
    };
  }, [focusedField]);

  // Memoize current estate data
  const currentEstate = useMemo(
    () => ({
      total: parseSafeDecimal(total),
      funeral: parseSafeDecimal(funeral),
      debts: parseSafeDecimal(debts),
      will: parseSafeDecimal(will),
    }),
    [total, funeral, debts, will],
  );

  // ===== FIX H1: Immediate validation without debounce (for blur events) =====
  const validateAndUpdateImmediate = useCallback(
    (estate: EstateData) => {
      const result = EstateValidator.validate(estate);
      setValidationResult(result);

      if (result.isValid) {
        updateEstateData(estate);
        onEstateChange?.(estate);
      }
    },
    [updateEstateData, onEstateChange],
  );

  // ===== FIX H1: Debounced validation (for change events) =====
  const validateAndUpdateDebounced = useCallback(
    (estate: EstateData, fieldName: string) => {
      if (validationTimerRef.current) {
        clearTimeout(validationTimerRef.current);
      }

      validationTimerRef.current = setTimeout(() => {
        validateAndUpdateImmediate(estate);
      }, 500); // 500ms debounce
    },
    [validateAndUpdateImmediate],
  );

  // ===== FIX C1 & H1: Updated handlers with debounced validation =====
  const handleTotalChange = useCallback(
    (text: string) => {
      setTotal(text);
      validateAndUpdateDebounced(
        {
          total: parseSafeDecimal(text),
          funeral: parseSafeDecimal(funeral),
          debts: parseSafeDecimal(debts),
          will: parseSafeDecimal(will),
        },
        "total",
      );
    },
    [funeral, debts, will, validateAndUpdateDebounced],
  );

  const handleTotalBlur = useCallback(() => {
    validateAndUpdateImmediate({
      total: parseSafeDecimal(total),
      funeral: parseSafeDecimal(funeral),
      debts: parseSafeDecimal(debts),
      will: parseSafeDecimal(will),
    });
  }, [total, funeral, debts, will, validateAndUpdateImmediate]);

  const handleFuneralChange = useCallback(
    (text: string) => {
      setFuneral(text);
      validateAndUpdateDebounced(
        {
          total: parseSafeDecimal(total),
          funeral: parseSafeDecimal(text),
          debts: parseSafeDecimal(debts),
          will: parseSafeDecimal(will),
        },
        "funeral",
      );
    },
    [total, debts, will, validateAndUpdateDebounced],
  );

  const handleFuneralBlur = useCallback(() => {
    validateAndUpdateImmediate({
      total: parseSafeDecimal(total),
      funeral: parseSafeDecimal(funeral),
      debts: parseSafeDecimal(debts),
      will: parseSafeDecimal(will),
    });
  }, [total, funeral, debts, will, validateAndUpdateImmediate]);

  const handleDebtsChange = useCallback(
    (text: string) => {
      setDebts(text);
      validateAndUpdateDebounced(
        {
          total: parseSafeDecimal(total),
          funeral: parseSafeDecimal(funeral),
          debts: parseSafeDecimal(text),
          will: parseSafeDecimal(will),
        },
        "debts",
      );
    },
    [total, funeral, will, validateAndUpdateDebounced],
  );

  const handleDebtsBlur = useCallback(() => {
    validateAndUpdateImmediate({
      total: parseSafeDecimal(total),
      funeral: parseSafeDecimal(funeral),
      debts: parseSafeDecimal(debts),
      will: parseSafeDecimal(will),
    });
  }, [total, funeral, debts, will, validateAndUpdateImmediate]);

  const handleWillChange = useCallback(
    (text: string) => {
      setWill(text);
      validateAndUpdateDebounced(
        {
          total: parseSafeDecimal(total),
          funeral: parseSafeDecimal(funeral),
          debts: parseSafeDecimal(debts),
          will: parseSafeDecimal(text),
        },
        "will",
      );
    },
    [total, funeral, debts, validateAndUpdateDebounced],
  );

  const handleWillBlur = useCallback(() => {
    validateAndUpdateImmediate({
      total: parseSafeDecimal(total),
      funeral: parseSafeDecimal(funeral),
      debts: parseSafeDecimal(debts),
      will: parseSafeDecimal(will),
    });
    setFocusedField(null);
  }, [total, funeral, debts, will, validateAndUpdateImmediate]);

  // ===== Focus handlers for keyboard auto-scroll =====
  const handleTotalFocus = useCallback(() => setFocusedField("total"), []);
  const handleFuneralFocus = useCallback(() => setFocusedField("funeral"), []);
  const handleDebtsFocus = useCallback(() => setFocusedField("debts"), []);
  const handleWillFocus = useCallback(() => setFocusedField("will"), []);

  // ===== Helper to get field-specific error =====
  const getFieldError = useCallback(
    (fieldName: string) => {
      if (!validationResult) return null;
      return validationResult.errors.find((e) => e.field === fieldName);
    },
    [validationResult],
  );

  const styles = createStyles(theme, isNarrowScreen);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.container}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            keyboardVisible ? styles.keyboardContent : undefined
          }
        >
          <Text style={styles.title}>بيانات التركة</Text>
          <Text style={styles.subtitle}>Estate Financial Data</Text>

          {/* إجمالي التركة */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>إجمالي التركة *</Text>
            <TextInput
              ref={totalInputRef}
              style={[
                styles.input,
                getFieldError("estate.total") && styles.inputError,
              ]}
              placeholder="مثال: 100000"
              placeholderTextColor={theme.colors.neutral.light400}
              value={total}
              onChangeText={handleTotalChange}
              onFocus={handleTotalFocus}
              onBlur={handleTotalBlur}
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => funeralInputRef.current?.focus()}
              blurOnSubmit={false}
              accessibilityLabel="إجمالي التركة"
              accessibilityHint="أدخل المبلغ الإجمالي للتركة بالريال"
              accessible={true}
            />
            {getFieldError("estate.total") && (
              <Text style={styles.fieldError}>
                {getFieldError("estate.total")?.userMessage}
              </Text>
            )}
          </View>

          {/* تكاليف التجهيز */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>تكاليف التجهيز</Text>
            <TextInput
              ref={funeralInputRef}
              style={[
                styles.input,
                getFieldError("estate.funeral") && styles.inputError,
              ]}
              placeholder="اختياري"
              placeholderTextColor={theme.colors.neutral.light400}
              value={funeral}
              onChangeText={handleFuneralChange}
              onFocus={handleFuneralFocus}
              onBlur={handleFuneralBlur}
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => debtsInputRef.current?.focus()}
              blurOnSubmit={false}
              accessibilityLabel="تكاليف التجهيز"
              accessibilityHint="أدخل تكاليف التجهيز والدفن"
              accessible={true}
            />
            {getFieldError("estate.funeral") && (
              <Text style={styles.fieldError}>
                {getFieldError("estate.funeral")?.userMessage}
              </Text>
            )}
          </View>

          {/* الديون */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>الديون</Text>
            <TextInput
              ref={debtsInputRef}
              style={[
                styles.input,
                getFieldError("estate.debts") && styles.inputError,
              ]}
              placeholder="اختياري"
              placeholderTextColor={theme.colors.neutral.light400}
              value={debts}
              onChangeText={handleDebtsChange}
              onFocus={handleDebtsFocus}
              onBlur={handleDebtsBlur}
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => willInputRef.current?.focus()}
              blurOnSubmit={false}
              accessibilityLabel="الديون"
              accessibilityHint="أدخل المبلغ الإجمالي للديون"
              accessible={true}
            />
            {getFieldError("estate.debts") && (
              <Text style={styles.fieldError}>
                {getFieldError("estate.debts")?.userMessage}
              </Text>
            )}
          </View>

          {/* الوصية */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>الوصية (اختياري)</Text>
            <TextInput
              ref={willInputRef}
              style={[
                styles.input,
                getFieldError("estate.will") && styles.inputError,
              ]}
              placeholder="اختياري"
              placeholderTextColor={theme.colors.neutral.light400}
              value={will}
              onChangeText={handleWillChange}
              onFocus={handleWillFocus}
              onBlur={handleWillBlur}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              accessibilityLabel="الوصية"
              accessibilityHint="أدخل مبلغ الوصية إن وجدت"
              accessible={true}
            />
            {getFieldError("estate.will") && (
              <Text style={styles.fieldError}>
                {getFieldError("estate.will")?.userMessage}
              </Text>
            )}
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            style={[
              styles.resetButton,
              { backgroundColor: theme.colors.primary.main },
            ]}
            onPress={() => {
              setTotal("0");
              setFuneral("0");
              setDebts("0");
              setWill("0");
              updateEstateData({ total: 0, funeral: 0, debts: 0, will: 0 });
              setValidationResult(null);
              // Inline feedback instead of Alert
            }}
            accessibilityLabel="إعادة تعيين البيانات"
            accessibilityHint="امسح جميع البيانات وأعد التعيين"
            accessible={true}
          >
            <Text style={styles.resetButtonText}>↺ مسح البيانات</Text>
          </TouchableOpacity>

          {/* General validation feedback for non-field errors */}
          {validationResult && (
            <>
              {validationResult.errors.filter(
                (e) => !e.field.startsWith("estate."),
              ).length > 0 && (
                <View style={styles.validationContainer}>
                  {validationResult.errors
                    .filter((e) => !e.field.startsWith("estate."))
                    .map((error, index) => (
                      <View
                        key={`error-${index}`}
                        style={[styles.feedbackItem, styles.errorItem]}
                      >
                        <Text style={styles.errorIcon}>❌</Text>
                        <View style={styles.feedbackContent}>
                          <Text style={styles.errorMessage}>
                            {error.userMessage}
                          </Text>
                          {error.suggestion && (
                            <Text style={styles.suggestionText}>
                              {error.suggestion}
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                </View>
              )}

              {validationResult.warnings.length > 0 && (
                <View style={styles.validationContainer}>
                  {validationResult.warnings.map((warning, index) => (
                    <View
                      key={`warning-${index}`}
                      style={[styles.feedbackItem, styles.warningItem]}
                    >
                      <Text style={styles.warningIcon}>⚠️</Text>
                      <View style={styles.feedbackContent}>
                        <Text style={styles.warningMessage}>
                          {warning.userMessage}
                        </Text>
                        {warning.suggestion && (
                          <Text style={styles.suggestionText}>
                            {warning.suggestion}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {validationResult.isValid &&
                validationResult.errors.length === 0 && (
                  <View style={[styles.feedbackItem, styles.successItem]}>
                    <Text style={styles.successIcon}>✓</Text>
                    <Text style={styles.successMessage}>
                      تم التحقق من البيانات بنجاح
                    </Text>
                  </View>
                )}
            </>
          )}

          {/* ملخص التركة */}
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>ملخص التركة</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>إجمالي التركة:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(currentEstate.total)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>- تكاليف التجهيز:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(currentEstate.funeral)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>- الديون:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(currentEstate.debts)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>- الوصية:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(currentEstate.will)}
              </Text>
            </View>

            <View style={[styles.summaryRow, styles.netEstateRow]}>
              <Text style={styles.netEstateLabel}>صافي التركة:</Text>
              <Text style={styles.netEstateValue}>
                {formatCurrency(
                  currentEstate.total -
                    currentEstate.funeral -
                    currentEstate.debts -
                    currentEstate.will,
                )}
              </Text>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: Theme, isNarrowScreen: boolean) =>
  StyleSheet.create({
    container: {
      maxHeight: 500,
      padding: isNarrowScreen ? theme.spacing.sm : theme.spacing.md, // Responsive: 12px on narrow, 16px on normal
      backgroundColor: theme.colors.neutral.light50,
      borderRadius: 8,
      marginBottom: theme.spacing.md,
    },
    keyboardContent: {
      paddingBottom: 100, // Extra space when keyboard is visible
    },
    title: {
      ...theme.typography.headline.small,
      color: theme.colors.neutral.dark300,
      marginBottom: theme.spacing.xs,
      textAlign: "right",
    },
    subtitle: {
      ...theme.typography.label.small,
      color: theme.colors.neutral.dark200,
      marginBottom: theme.spacing.md,
      textAlign: "right",
    },
    inputGroup: {
      marginBottom: isNarrowScreen ? theme.spacing.sm : theme.spacing.md, // Responsive spacing
    },
    label: {
      ...theme.typography.label.medium,
      color: theme.colors.neutral.dark200,
      marginBottom: theme.spacing.xs,
      textAlign: "right",
    },
    input: {
      ...theme.typography.body.medium,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
      borderRadius: 8,
      padding: isNarrowScreen ? theme.spacing.sm : theme.spacing.md, // Responsive: min 12px+border = ~44px touch target
      minHeight: 44, // Ensure 44px minimum touch target
      color: theme.colors.neutral.dark300,
      backgroundColor: theme.colors.background.light,
      textAlign: "right",
    },
    inputError: {
      borderColor: theme.colors.error.main,
      borderWidth: 1.5,
    },
    fieldError: {
      ...theme.typography.label.small,
      color: theme.colors.error.main,
      marginTop: theme.spacing.xs,
      textAlign: "right",
    },
    resetButton: {
      borderRadius: 10,
      paddingVertical: isNarrowScreen ? theme.spacing.sm : theme.spacing.md, // Responsive padding
      paddingHorizontal: theme.spacing.md,
      alignItems: "center",
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      minHeight: 44, // Ensure 44px minimum touch target
      shadowColor: theme.colors.primary.main,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 3,
    },
    resetButtonText: {
      color: theme.colors.background.light,
      ...theme.typography.label.medium,
    },
    validationContainer: {
      marginVertical: theme.spacing.xs,
    },
    feedbackItem: {
      flexDirection: "row",
      borderRadius: 8,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      alignItems: "center",
    },
    feedbackContent: {
      flex: 1,
      marginLeft: theme.spacing.xs,
    },
    errorItem: {
      backgroundColor: theme.colors.error.light,
      borderLeftWidth: 2,
      borderLeftColor: theme.colors.error.main,
    },
    warningItem: {
      backgroundColor: theme.colors.warning.light,
      borderLeftWidth: 2,
      borderLeftColor: theme.colors.warning.main,
    },
    successItem: {
      backgroundColor: theme.colors.success.light,
      borderLeftWidth: 2,
      borderLeftColor: theme.colors.success.main,
      marginVertical: theme.spacing.xs,
    },
    errorIcon: {
      fontSize: 18,
    },
    warningIcon: {
      fontSize: 18,
    },
    successIcon: {
      fontSize: 18,
      color: theme.colors.success.main,
      marginRight: theme.spacing.xs,
    },
    errorMessage: {
      ...theme.typography.label.small,
      color: theme.colors.error.main,
      textAlign: "right",
      marginBottom: theme.spacing.xs,
    },
    warningMessage: {
      ...theme.typography.label.small,
      color: theme.colors.warning.main,
      textAlign: "right",
      marginBottom: theme.spacing.xs,
    },
    successMessage: {
      ...theme.typography.label.small,
      color: theme.colors.success.main,
      textAlign: "right",
      flex: 1,
    },
    suggestionText: {
      ...theme.typography.label.small,
      color: theme.colors.neutral.dark200,
      textAlign: "right",
      fontStyle: "italic",
    },
    summary: {
      backgroundColor: theme.colors.primary.light,
      padding: theme.spacing.md,
      borderRadius: 8,
      marginTop: theme.spacing.sm,
    },
    summaryTitle: {
      ...theme.typography.label.medium,
      color: theme.colors.primary.dark,
      marginBottom: theme.spacing.md,
      textAlign: "right",
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.xs,
    },
    summaryLabel: {
      ...theme.typography.label.small,
      color: theme.colors.neutral.dark200,
      textAlign: "right",
    },
    summaryValue: {
      ...theme.typography.label.small,
      color: theme.colors.primary.main,
      fontWeight: "600",
    },
    netEstateRow: {
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.primary.light100,
    },
    netEstateLabel: {
      ...theme.typography.label.medium,
      color: theme.colors.primary.dark,
    },
    netEstateValue: {
      ...theme.typography.label.medium,
      color: theme.colors.primary.dark,
    },
  });

export default EstateInput;
