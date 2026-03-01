/**
 * @file CalculationButton.tsx
 * @description Calculation button with loading states
 */

import React, { useState, useCallback, useEffect } from 'react';
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

export function CalculationButton({
  madhab,
  heirs,
  estate,
  onCalculationComplete,
  disabled = false
}: CalculationButtonProps) {
  const { calculateWithMethod, result, isCalculating, error } = useCalculator();
  const [localError, setLocalError] = useState<string | null>(null);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'generating' | 'sharing'>('idle');

  useEffect(() => {
    if (pdfStatus === 'generating') {
      const interval = setInterval(() => {
        setPdfProgress(prev => Math.min(prev + 0.1, 0.9));
      }, 200);
      return () => clearInterval(interval);
    } else {
      setPdfProgress(0);
    }
  }, [pdfStatus]);

  const handleCalculate = useCallback(async () => {
    try {
      setLocalError(null);

      if (!madhab) {
        const msg = 'يجب اختيار المذهب الفقهي أولاً';
        setLocalError(msg);
        Alert.alert('تحقق من البيانات', msg);
        onCalculationComplete?.(false, msg);
        return;
      }

      const heirsCount = Object.values(heirs || {}).reduce((s: number, v) => s + (v || 0), 0);
      if (heirsCount === 0) {
        const msg = 'يجب إضافة واحد على الأقل من الورثة';
        setLocalError(msg);
        Alert.alert('المزيد من المعلومات مطلوبة', msg);
        onCalculationComplete?.(false, msg);
        return;
      }

      if (estate.total <= 0) {
        const msg = 'قيمة التركة يجب أن تكون أكبر من صفر';
        setLocalError(msg);
        Alert.alert('بيانات غير صحيحة', msg);
        onCalculationComplete?.(false, msg);
        return;
      }

      const result = await calculateWithMethod(madhab, heirs);
      if (result && result.success) {
        Alert.alert('نجح الحساب', 'تم حساب توزيع الميراث بنجاح');
        onCalculationComplete?.(true);
      } else {
        const errorMsg = result?.error || 'فشل الحساب';
        setLocalError(errorMsg);
        Alert.alert('خطأ في الحساب', errorMsg);
        onCalculationComplete?.(false, errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setLocalError(errorMessage);
      Alert.alert('خطأ', errorMessage);
      onCalculationComplete?.(false, errorMessage);
    }
  }, [madhab, heirs, estate, calculateWithMethod, onCalculationComplete]);

  const heirsCountForDisable = Object.values(heirs || {}).reduce((s: number, v) => s + (v || 0), 0);
  const isDisabled = disabled || heirsCountForDisable === 0 || estate.total <= 0 || isCalculating;
  const currentError = localError || error;

  return (
    <View style={styles.container}>
      {!estate.total && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>⚠️ أدخل مبلغ التركة الإجمالي أولاً</Text>
        </View>
      )}
      {!heirsCountForDisable && (
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

      {pdfStatus === 'generating' && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>جاري إنشاء PDF... {Math.round(pdfProgress * 100)}%</Text>
        </View>
      )}

      {currentError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{currentError}</Text>
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
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowColor: 'transparent',
    elevation: 0
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
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
    marginBottom: 12
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
    justifyContent: 'center',
    gap: 8
  },
  progressContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    alignItems: 'center'
  },
  progressText: {
    fontSize: 12,
    color: '#0369a1'
  },
  errorContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f'
  },
  errorText: {
    fontSize: 13,
    color: '#c62828',
    fontWeight: '500',
    textAlign: 'right'
  }
});

export default CalculationButton;