/**
 * @file EstateInput.tsx
 * @description مكون إدخال بيانات التركة مع التحقق والمُلخص
 * Estate Input Component with validation and summary
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../lib/design/theme';
import { useCalculator } from '../lib/inheritance/hooks';
import { EstateData } from '../lib/inheritance/types';
import { EstateValidator } from '../lib/validation/InputValidator';
import type { ValidationResult } from '../lib/validation/InputValidator';

export interface EstateInputProps {
  onEstateChange?: (estate: EstateData) => void;
  initialEstate?: EstateData;
}

export function EstateInput({ onEstateChange, initialEstate }: EstateInputProps) {
  const { theme } = useTheme();
  const { estateData, updateEstateData } = useCalculator();

  const [total, setTotal] = useState(initialEstate?.total.toString() || estateData.total.toString());
  const [funeral, setFuneral] = useState((initialEstate?.funeral ?? initialEstate?.funeralCosts ?? estateData.funeral ?? estateData.funeralCosts ?? 0).toString());
  const [debts, setDebts] = useState((initialEstate?.debts ?? estateData.debts ?? 0).toString());
  const [will, setWill] = useState((initialEstate?.will ?? initialEstate?.willAmount ?? estateData.will ?? estateData.willAmount ?? 0).toString());
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  // Memoize current estate data
  const currentEstate = useMemo(() => ({
    total: parseFloat(total) || 0,
    funeral: parseFloat(funeral) || 0,
    debts: parseFloat(debts) || 0,
    will: parseFloat(will) || 0
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

  const handleTotalChange = useCallback((text: string) => {
    setTotal(text);
    validateAndUpdate({
      total: parseFloat(text) || 0,
      funeral: parseFloat(funeral) || 0,
      debts: parseFloat(debts) || 0,
      will: parseFloat(will) || 0
    });
  }, [funeral, debts, will, validateAndUpdate]);

  const handleFuneralChange = useCallback((text: string) => {
    setFuneral(text);
    validateAndUpdate({
      total: parseFloat(total) || 0,
      funeral: parseFloat(text) || 0,
      debts: parseFloat(debts) || 0,
      will: parseFloat(will) || 0
    });
  }, [total, debts, will, validateAndUpdate]);

  const handleDebtsChange = useCallback((text: string) => {
    setDebts(text);
    validateAndUpdate({
      total: parseFloat(total) || 0,
      funeral: parseFloat(funeral) || 0,
      debts: parseFloat(text) || 0,
      will: parseFloat(will) || 0
    });
  }, [total, funeral, will, validateAndUpdate]);

  const handleWillChange = useCallback((text: string) => {
    setWill(text);
    validateAndUpdate({
      total: parseFloat(total) || 0,
      funeral: parseFloat(funeral) || 0,
      debts: parseFloat(debts) || 0,
      will: parseFloat(text) || 0
    });
  }, [total, funeral, debts, validateAndUpdate]);

  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} nestedScrollEnabled>
      <Text style={styles.title}>بيانات التركة</Text>
      <Text style={styles.subtitle}>Estate Financial Data</Text>

      {/* إجمالي التركة */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>إجمالي التركة</Text>
        <TextInput
          style={[
            styles.input,
            validationResult?.errors.some(e => e.field === 'estate.total') && styles.inputError
          ]}
          placeholder="مثال: 100000"
          placeholderTextColor={theme.colors.neutral.light400}
          value={total}
          onChangeText={handleTotalChange}
          keyboardType="decimal-pad"
        />
      </View>

      {/* تكاليف الجنازة */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>تكاليف التجهيز</Text>
        <TextInput
          style={styles.input}
          placeholder="اختياري"
          placeholderTextColor={theme.colors.neutral.light400}
          value={funeral}
          onChangeText={handleFuneralChange}
          keyboardType="decimal-pad"
        />
      </View>

      {/* الديون */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>الديون</Text>
        <TextInput
          style={styles.input}
          placeholder="اختياري"
          placeholderTextColor={theme.colors.neutral.light400}
          value={debts}
          onChangeText={handleDebtsChange}
          keyboardType="decimal-pad"
        />
      </View>

      {/* الوصية */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>الوصية (اختياري)</Text>
        <TextInput
          style={styles.input}
          placeholder="اختياري"
          placeholderTextColor={theme.colors.neutral.light400}
          value={will}
          onChangeText={handleWillChange}
          keyboardType="decimal-pad"
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
      >
        <Text style={styles.resetButtonText}>↺ مسح البيانات</Text>
      </TouchableOpacity>

      {/* Validation Feedback */}
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
          <Text style={styles.summaryValue}>{parseFloat(total) || 0}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>- تكاليف التجهيز:</Text>
          <Text style={styles.summaryValue}>{parseFloat(funeral) || 0}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>- الديون:</Text>
          <Text style={styles.summaryValue}>{parseFloat(debts) || 0}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>- الوصية:</Text>
          <Text style={styles.summaryValue}>{parseFloat(will) || 0}</Text>
        </View>
        
        <View style={[styles.summaryRow, styles.netEstateRow]}>
          <Text style={styles.netEstateLabel}>صافي التركة:</Text>
          <Text style={styles.netEstateValue}>
            {((parseFloat(total) || 0) - (parseFloat(funeral) || 0) - (parseFloat(debts) || 0) - (parseFloat(will) || 0)).toFixed(2)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      maxHeight: 500,
      padding: 16,
      backgroundColor: theme.colors.neutral.light50,
      borderRadius: 8,
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.neutral.dark300,
      marginBottom: 4,
      textAlign: 'right',
    },
    subtitle: {
      fontSize: 12,
      color: theme.colors.neutral.dark200,
      marginBottom: 16,
      textAlign: 'right',
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.neutral.dark200,
      marginBottom: 6,
      textAlign: 'right',
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      color: theme.colors.neutral.dark300,
      backgroundColor: '#fff',
      textAlign: 'right',
    },
    inputError: {
      borderColor: theme.colors.error.main,
      borderWidth: 1.5,
    },
    resetButton: {
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 16,
      alignItems: 'center',
      marginTop: 12,
      marginBottom: 16,
      shadowColor: theme.colors.primary.main,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 3,
    },
    resetButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '700',
    },
    validationContainer: {
      marginVertical: 8,
    },
    feedbackItem: {
      flexDirection: 'row',
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      alignItems: 'center',
    },
    feedbackContent: {
      flex: 1,
      marginLeft: 8,
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
      marginVertical: 8,
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
      marginRight: 8,
    },
    errorMessage: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.colors.error.main,
      textAlign: 'right',
      marginBottom: 2,
    },
    warningMessage: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.colors.warning.main,
      textAlign: 'right',
      marginBottom: 2,
    },
    successMessage: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.colors.success.main,
      textAlign: 'right',
      flex: 1,
    },
    suggestionText: {
      fontSize: 12,
      color: theme.colors.neutral.dark200,
      textAlign: 'right',
      fontStyle: 'italic',
    },
    summary: {
      backgroundColor: theme.colors.primary.light,
      padding: 16,
      borderRadius: 8,
      marginTop: 12,
    },
    summaryTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.primary.dark,
      marginBottom: 12,
      textAlign: 'right',
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: 13,
      color: theme.colors.neutral.dark200,
      textAlign: 'right',
    },
    summaryValue: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.primary.main,
    },
    netEstateRow: {
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.primary.light100,
    },
    netEstateLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.primary.dark,
    },
    netEstateValue: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.primary.dark,
    },
  });

export default EstateInput;