/**
 * @file EstateInput.tsx
 * @description مكون إدخال بيانات التركة
 * Estate Input Component for Phase 5
 * 
 * استقبال بيانات التركة الشرعية من المستخدم
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useCalculator } from '../lib/inheritance/hooks';
import { EstateData } from '../lib/inheritance/types';
import { EstateValidator } from '../lib/validation/InputValidator';
import type { ValidationResult } from '../lib/validation/InputValidator';

export interface EstateInputProps {
  onEstateChange?: (estate: EstateData) => void;
  initialEstate?: EstateData;
}

/**
 * مكون إدخال التركة
 * Allows users to input estate financial data
 */
export function EstateInput({ onEstateChange, initialEstate }: EstateInputProps) {
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
    // Run validation
    const result = EstateValidator.validate(estate);
    setValidationResult(result);

    // Update only if valid
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>بيانات التركة</Text>
      <Text style={styles.subtitle}>Estate Financial Data</Text>

      {/* إجمالي التركة */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>إجمالي التركة</Text>
        <TextInput
          style={styles.input}
          placeholder="Total Estate"
          placeholderTextColor="#999"
          value={total}
          onChangeText={handleTotalChange}
          keyboardType="decimal-pad"
          editable={true}
        />
      </View>

      {/* تكاليف الجنازة */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>تكاليف الجنازة</Text>
        <TextInput
          style={styles.input}
          placeholder="Funeral Costs"
          placeholderTextColor="#999"
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
          placeholder="Debts"
          placeholderTextColor="#999"
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
          placeholder="Will (Optional)"
          placeholderTextColor="#999"
          value={will}
          onChangeText={handleWillChange}
          keyboardType="decimal-pad"
        />
      </View>

      {/* Reset Button */}
      <TouchableOpacity
        style={styles.resetButton}
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
                <View key={`error-${index}`} style={styles.errorItem}>
                  <Text style={styles.errorIcon}>❌</Text>
                  <View style={styles.errorContent}>
                    <Text style={styles.errorMessage}>{error.userMessage}</Text>
                    {error.suggestion && (
                      <Text style={styles.errorSuggestion}>{error.suggestion}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
          
          {validationResult.warnings.length > 0 && (
            <View style={styles.warningContainer}>
              {validationResult.warnings.map((warning, index) => (
                <View key={`warning-${index}`} style={styles.warningItem}>
                  <Text style={styles.warningIcon}>⚠️</Text>
                  <View style={styles.warningContent}>
                    <Text style={styles.warningMessage}>{warning.userMessage}</Text>
                    {warning.suggestion && (
                      <Text style={styles.warningSuggestion}>{warning.suggestion}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {validationResult.isValid && validationResult.errors.length === 0 && (
            <View style={styles.successContainer}>
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
          <Text style={styles.summaryLabel}>- تكاليف الجنازة:</Text>
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
        <View style={[styles.summaryRow, styles.summaryRowHighlight]}>
          <Text style={[styles.summaryLabel, styles.summaryLabelHighlight]}>صافي التركة:</Text>
          <Text style={[styles.summaryValue, styles.summaryValueHighlight]}>
            {((parseFloat(total) || 0) - (parseFloat(funeral) || 0) - (parseFloat(debts) || 0) - (parseFloat(will) || 0)).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'right'
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    textAlign: 'right'
  },
  inputGroup: {
    marginBottom: 12
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    textAlign: 'right'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
    textAlign: 'right'
  },
  validationContainer: {
    marginVertical: 12
  },
  errorItem: {
    flexDirection: 'row',
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8
  },
  errorIcon: {
    fontSize: 18,
    marginRight: 12
  },
  errorContent: {
    flex: 1
  },
  errorMessage: {
    fontSize: 13,
    fontWeight: '500',
    color: '#d32f2f',
    textAlign: 'right',
    marginBottom: 4
  },
  errorSuggestion: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    fontStyle: 'italic'
  },
  warningContainer: {
    marginVertical: 12
  },
  warningItem: {
    flexDirection: 'row',
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#f57c00',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8
  },
  warningIcon: {
    fontSize: 18,
    marginRight: 12
  },
  warningContent: {
    flex: 1
  },
  warningMessage: {
    fontSize: 13,
    fontWeight: '500',
    color: '#f57c00',
    textAlign: 'right',
    marginBottom: 4
  },
  warningSuggestion: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    fontStyle: 'italic'
  },
  successContainer: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
    borderRadius: 6,
    padding: 12,
    marginVertical: 12,
    alignItems: 'center'
  },
  successIcon: {
    fontSize: 18,
    color: '#4caf50',
    marginRight: 12
  },
  successMessage: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4caf50',
    textAlign: 'right',
    flex: 1
  },
  summary: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 6,
    marginTop: 12
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
    textAlign: 'right'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  summaryLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'right'
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2'
  },
  summaryRowHighlight: {
    borderTopWidth: 2,
    borderTopColor: '#1976d2',
    paddingTop: 8,
    marginTop: 8,
    backgroundColor: '#bbdefb',
    padding: 8,
    borderRadius: 4
  },
  summaryLabelHighlight: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0d47a1'
  },
  summaryValueHighlight: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0d47a1'
  },
  resetButton: {
    backgroundColor: '#667eea',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700'
  }
});

export default EstateInput;
