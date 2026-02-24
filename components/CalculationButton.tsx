/**
 * @file CalculationButton.tsx
 * @description زر تنفيذ الحساب
 * Calculation Button Component for Phase 5
 * 
 * زر تشغيل حساب الميراث مع عرض حالة التحميل
 */

import React, { useState, useCallback } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useCalculator } from '../lib/inheritance/hooks';
import { MadhhabType, HeirsData, EstateData } from '../lib/inheritance/types';

export interface CalculationButtonProps {
  madhab: MadhhabType;
  heirs: HeirsData;
  estate: EstateData;
  onCalculationComplete?: (success: boolean, error?: string) => void;
  disabled?: boolean;
}

/**
 * مكون زر الحساب
 * Triggers calculation and shows loading state
 */
export function CalculationButton({
  madhab,
  heirs,
  estate,
  onCalculationComplete,
  disabled = false
}: CalculationButtonProps) {
  const { calculateWithMethod, result, isCalculating, error } = useCalculator();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleCalculate = useCallback(async () => {
    try {
      setLocalError(null);

      // التحقق من صحة البيانات
      if (!madhab) {
        const msg = 'يجب اختيار المذهب الفقهي أولاً';
        setLocalError(msg);
        Alert.alert(
          'تحقق من البيانات',
          msg,
          [{ text: 'حسناً' }]
        );
        onCalculationComplete?.(false, msg);
        return;
      }

      const heirsCount = Object.values(heirs || {}).reduce((s: number, v) => s + (v || 0), 0);
      if (heirsCount === 0) {
        const msg = 'يجب إضافة واحد على الأقل من الورثة';
        setLocalError(msg);
        Alert.alert(
          'المزيد من المعلومات مطلوبة',
          msg + '\n\nتأكد من إضافة جميع الورثة في قسم "إضافة الوارثون"',
          [{ text: 'حسناً' }]
        );
        onCalculationComplete?.(false, msg);
        return;
      }

      if (estate.total <= 0) {
        const msg = 'قيمة التركة يجب أن تكون أكبر من صفر';
        setLocalError(msg);
        Alert.alert(
          'بيانات غير صحيحة',
          msg + '\n\nأدخل المبلغ الإجمالي للتركة في قسم "بيانات التركة"',
          [{ text: 'حسناً' }]
        );
        onCalculationComplete?.(false, msg);
        return;
      }

      // تنفيذ الحساب
      const result = await calculateWithMethod(madhab, heirs);
      if (result && result.success) {
        Alert.alert(
          'نجح الحساب',
          'تم حساب توزيع الميراث بنجاح. انظر النتائج أدناه.',
          [{ text: 'حسناً' }]
        );
        onCalculationComplete?.(true);
      } else {
        const errorMsg = result?.error || 'فشل الحساب';
        setLocalError(errorMsg);
        Alert.alert(
          'خطأ في الحساب',
          errorMsg,
          [{ text: 'حسناً' }]
        );
        onCalculationComplete?.(false, errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع في الحساب';
      setLocalError(errorMessage);
      Alert.alert(
        'خطأ',
        errorMessage,
        [{ text: 'حسناً' }]
      );
      onCalculationComplete?.(false, errorMessage);
    }
  }, [madhab, heirs, estate, calculateWithMethod, onCalculationComplete]);

  const heirsCountForDisable = Object.values(heirs || {}).reduce((s: number, v) => s + (v || 0), 0);
  const isDisabled = disabled || heirsCountForDisable === 0 || estate.total <= 0 || isCalculating;
  const currentError = localError || error;
  const hasValidHeirs = heirsCountForDisable > 0;
  const hasValidEstate = estate.total > 0;

  return (
    <View style={styles.container}>
      {/* تحذيرات الحقول المفقودة */}
      {!hasValidEstate && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>⚠️ أدخل مبلغ التركة الإجمالي أولاً</Text>
        </View>
      )}
      {!hasValidHeirs && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>⚠️ أضف وارثاً واحداً على الأقل</Text>
        </View>
      )}
      
      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={handleCalculate}
        disabled={isDisabled}
      >
        {isCalculating ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.buttonText}>جاري الحساب...</Text>
          </View>
        ) : (
          <Text style={[styles.buttonText, isDisabled && styles.buttonTextDisabled]}>
            {isDisabled ? 'يرجى ملء البيانات أولاً' : 'حساب الميراث'}
          </Text>
        )}
      </TouchableOpacity>

      {/* رسالة الخطأ */}
      {currentError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{currentError}</Text>
        </View>
      )}

      {/* رسالة النجاح */}
      {result && result.success && !isCalculating && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>✓ تم الحساب بنجاح</Text>
        </View>
      )}

      {/* معلومات الحساب */}
      {result && (
        <View style={styles.resultInfo}>
          <Text style={styles.resultInfoTitle}>معلومات الحساب:</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>الحالة:</Text>
            <Text style={[styles.resultValue, result.success ? styles.successValue : styles.errorValue]}>
              {result.success ? 'نجح' : 'فشل'}
            </Text>
          </View>
          {result.error && (
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>الخطأ:</Text>
              <Text style={styles.resultValue}>{result.error}</Text>
            </View>
          )}
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>المذهب:</Text>
            <Text style={styles.resultValue}>{result.madhab}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    // Professional color matching HTML primary (#4F46E5)
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    // Enhanced shadow elevation for depth
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    opacity: 1
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  buttonTextDisabled: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b'
  },
  warningBox: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#f57c00',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#f57c00',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2
  },
  warningText: {
    color: '#e65100',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right'
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorContainer: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
    shadowColor: '#d32f2f',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1
  },
  errorText: {
    fontSize: 13,
    color: '#c62828',
    fontWeight: '500',
    textAlign: 'right'
  },
  successContainer: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
    shadowColor: '#4caf50',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1
  },
  successText: {
    fontSize: 13,
    color: '#2e7d32',
    fontWeight: '600',
    textAlign: 'right'
  },
  resultInfo: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  resultInfoTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right'
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingVertical: 4
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666'
  },
  resultValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600'
  },
  successValue: {
    color: '#2e7d32'
  },
  errorValue: {
    color: '#d32f2f'
  }
});

export default CalculationButton;
