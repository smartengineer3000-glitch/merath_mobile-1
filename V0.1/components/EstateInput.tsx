/**
 * @file EstateInput.tsx
 * @description مكون إدخال بيانات التركة مع التحقق والمُلخص
 * FIXES: C1 (decimal parsing), H6 (keyboard handling)
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useAppTheme } from '../lib/context/ThemeProvider';
import { useCalculator } from '../lib/inheritance/hooks';
import type { Theme } from '../lib/design/theme';
import { EstateData } from '../lib/inheritance/types';
import { EstateValidator } from '../lib/validation/InputValidator';
import type { ValidationResult } from '../lib/validation/InputValidator';
import { parseSafeDecimal } from '../lib/utils/parsers';

export interface EstateInputProps {
  onEstateChange?: (estate: EstateData) => void;
  initialEstate?: EstateData;
}

export function EstateInput({ onEstateChange, initialEstate }: EstateInputProps) {
  const { theme } = useAppTheme();
  const { estateData, updateEstateData } = useCalculator();
  
  // ===== FIX H6: Keyboard handling refs =====
  const scrollViewRef = useRef<ScrollView>(null);
  const totalInputRef = useRef<TextInput>(null);
  const funeralInputRef = useRef<TextInput>(null);
  const debtsInputRef = useRef<TextInput>(null);
  const willInputRef = useRef<TextInput>(null);

  const [total, setTotal] = useState(initialEstate?.total.toString() || estateData.total.toString());
  const [funeral, setFuneral] = useState((initialEstate?.funeral ?? initialEstate?.funeralCosts ?? estateData.funeral ?? estateData.funeralCosts ?? 0).toString());
  const [debts, setDebts] = useState((initialEstate?.debts ?? estateData.debts ?? 0).toString());
  const [will, setWill] = useState((initialEstate?.will ?? initialEstate?.willAmount ?? estateData.will ?? estateData.willAmount ?? 0).toString());
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // ===== FIX H6: Keyboard listeners =====
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Memoize current estate data
  const currentEstate = useMemo(() => ({
    total: parseSafeDecimal(total),
    funeral: parseSafeDecimal(funeral),
    debts: parseSafeDecimal(debts),
    will: parseSafeDecimal(will)
  }), [total, funeral, debts, will]);

  // Validate on any change
  const validateAndUpdate = useCallback((estate: EstateData) => {
    const result = EstateValidator.validate(estate);
    setValidationResult(result);

    if (result.isValid) {
      updateEstateData(estate);
      onEstateChange?.(estate);
    }
  }, [updateEstateData, onEstateChange]);

  // ===== FIX C1: Updated handlers with safe parsing =====
  const handleTotalChange = useCallback((text: string) => {
    setTotal(text);
    validateAndUpdate({
      total: parseSafeDecimal(text),
      funeral: parseSafeDecimal(funeral),
      debts: parseSafeDecimal(debts),
      will: parseSafeDecimal(will)
    });
  }, [funeral, debts, will, validateAndUpdate]);

  const handleFuneralChange = useCallback((text: string) => {
    setFuneral(text);
    validateAndUpdate({
      total: parseSafeDecimal(total),
      funeral: parseSafeDecimal(text),
      debts: parseSafeDecimal(debts),
      will: parseSafeDecimal(will)
    });
  }, [total, debts, will, validateAndUpdate]);

  const handleDebtsChange = useCallback((text: string) => {
    setDebts(text);
    validateAndUpdate({
      total: parseSafeDecimal(total),
      funeral: parseSafeDecimal(funeral),
      debts: parseSafeDecimal(text),
      will: parseSafeDecimal(will)
    });
  }, [total, funeral, will, validateAndUpdate]);

  const handleWillChange = useCallback((text: string) => {
    setWill(text);
    validateAndUpdate({
      total: parseSafeDecimal(total),
      funeral: parseSafeDecimal(funeral),
      debts: parseSafeDecimal(debts),
      will: parseSafeDecimal(text)
    });
  }, [total, funeral, debts, validateAndUpdate]);

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={keyboardVisible ? styles.keyboardContent : undefined}
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
              validationResult?.errors.some(e => e.field === 'estate.total') && styles.inputError
            ]}
            placeholder="مثال: 100000"
            placeholderTextColor={theme.colors.neutral.light400}
            value={total}
            onChangeText={handleTotalChange}
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => funeralInputRef.current?.focus()}
            blurOnSubmit={false}
            accessibilityLabel="إجمالي التركة"
            accessibilityHint="أدخل المبلغ الإجمالي للتركة بالريال"
            accessible={true}
          />
        </View>

        {/* تكاليف التجهيز */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>تكاليف التجهيز</Text>
          <TextInput
            ref={funeralInputRef}
            style={styles.input}
            placeholder="اختياري"
            placeholderTextColor={theme.colors.neutral.light400}
            value={funeral}
            onChangeText={handleFuneralChange}
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => debtsInputRef.current?.focus()}
            blurOnSubmit={false}            accessibilityLabel="تكاليف التجهيز"
            accessibilityHint="أدخل تكاليف التجهيز والدفن"
            accessible={true}          />
        </View>

        {/* الديون */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>الديون</Text>
          <TextInput
            ref={debtsInputRef}
            style={styles.input}
            placeholder="اختياري"
            placeholderTextColor={theme.colors.neutral.light400}
            value={debts}
            onChangeText={handleDebtsChange}
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => willInputRef.current?.focus()}
            blurOnSubmit={false}
            accessibilityLabel="الديون"
            accessibilityHint="أدخل المبلغ الإجمالي للديون"
            accessible={true}
          />
        </View>

        {/* الوصية */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>الوصية (اختياري)</Text>
          <TextInput
            ref={willInputRef}
            style={styles.input}
            placeholder="اختياري"
            placeholderTextColor={theme.colors.neutral.light400}
            value={will}
            onChangeText={handleWillChange}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            accessibilityLabel="الوصية"
            accessibilityHint="أدخل مبلغ الوصية إن وجدت"
            accessible={true}
          />
        </View>

        {/* Reset Button */}
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: theme.colors.primary.main }]}
          onPress={() => {
            setTotal('0');
            setFuneral('0');
            setDebts('0');
            setWill('0');
            updateEstateData({ total: 0, funeral: 0, debts: 0, will: 0 });
            setValidationResult(null);
            Alert.alert('تم', 'تم مسح جميع البيانات');
          }}
          accessibilityLabel="إعادة تعيين البيانات"
          accessibilityHint="امسح جميع البيانات وأعد التعيين"
          accessible={true}
        >
          <Text style={styles.resetButtonText}>↺ مسح البيانات</Text>
        </TouchableOpacity>

        {/* Validation Feedback (unchanged) */}
        {validationResult && (
          <>
            {validationResult.errors.length > 0 && (
              <View style={styles.validationContainer}>
                {validationResult.errors.map((error, index) => (
                  <View key={`error-${index}`} style={[styles.feedbackItem, styles.errorItem]}>
                    <Text style={styles.errorIcon}>❌</Text>
                    <View style={styles.feedbackContent}>
                      <Text style={styles.errorMessage}>{error.userMessage}</Text>
                      {error.suggestion && (
                        <Text style={styles.suggestionText}>{error.suggestion}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
            
            {validationResult.warnings.length > 0 && (
              <View style={styles.validationContainer}>
                {validationResult.warnings.map((warning, index) => (
                  <View key={`warning-${index}`} style={[styles.feedbackItem, styles.warningItem]}>
                    <Text style={styles.warningIcon}>⚠️</Text>
                    <View style={styles.feedbackContent}>
                      <Text style={styles.warningMessage}>{warning.userMessage}</Text>
                      {warning.suggestion && (
                        <Text style={styles.suggestionText}>{warning.suggestion}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {validationResult.isValid && validationResult.errors.length === 0 && (
              <View style={[styles.feedbackItem, styles.successItem]}>
                <Text style={styles.successIcon}>✓</Text>
                <Text style={styles.successMessage}>تم التحقق من البيانات بنجاح</Text>
              </View>
            )}
          </>
        )}

        {/* ملخص التركة */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>ملخص التركة</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>إجمالي التركة:</Text>
            <Text style={styles.summaryValue}>{currentEstate.total.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>- تكاليف التجهيز:</Text>
            <Text style={styles.summaryValue}>{currentEstate.funeral.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>- الديون:</Text>
            <Text style={styles.summaryValue}>{currentEstate.debts.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>- الوصية:</Text>
            <Text style={styles.summaryValue}>{currentEstate.will.toFixed(2)}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.netEstateRow]}>
            <Text style={styles.netEstateLabel}>صافي التركة:</Text>
            <Text style={styles.netEstateValue}>
              {(currentEstate.total - currentEstate.funeral - currentEstate.debts - currentEstate.will).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      maxHeight: 500,
      padding: theme.spacing.md,
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
      textAlign: 'right',
    },
    subtitle: {
      ...theme.typography.label.small,
      color: theme.colors.neutral.dark200,
      marginBottom: theme.spacing.md,
      textAlign: 'right',
    },
    inputGroup: {
      marginBottom: theme.spacing.md,
    },
    label: {
      ...theme.typography.label.medium,
      color: theme.colors.neutral.dark200,
      marginBottom: theme.spacing.xs,
      textAlign: 'right',
    },
    input: {
      ...theme.typography.body.medium,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
      borderRadius: 8,
      padding: theme.spacing.md,
      color: theme.colors.neutral.dark300,
      backgroundColor: theme.colors.background.light,
      textAlign: 'right',
    },
    inputError: {
      borderColor: theme.colors.error.main,
      borderWidth: 1.5,
    },
    resetButton: {
      borderRadius: 10,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.md,
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
      flexDirection: 'row',
      borderRadius: 8,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      alignItems: 'center',
    },
    feedbackContent: {
      flex: 1,
      marginLeft: theme.spacing.xs,
    },
    errorItem: {
      backgroundColor: theme.colors.error.light,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error.main,
    },
    warningItem: {
      backgroundColor: theme.colors.warning.light,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.warning.main,
    },
    successItem: {
      backgroundColor: theme.colors.success.light,
      borderLeftWidth: 4,
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
      textAlign: 'right',
      marginBottom: theme.spacing.xs,
    },
    warningMessage: {
      ...theme.typography.label.small,
      color: theme.colors.warning.main,
      textAlign: 'right',
      marginBottom: theme.spacing.xs,
    },
    successMessage: {
      ...theme.typography.label.small,
      color: theme.colors.success.main,
      textAlign: 'right',
      flex: 1,
    },
    suggestionText: {
      ...theme.typography.label.small,
      color: theme.colors.neutral.dark200,
      textAlign: 'right',
      fontStyle: 'italic',
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
      textAlign: 'right',
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    summaryLabel: {
      ...theme.typography.label.small,
      color: theme.colors.neutral.dark200,
      textAlign: 'right',
    },
    summaryValue: {
      ...theme.typography.label.small,
      color: theme.colors.primary.main,
      fontWeight: '600',
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