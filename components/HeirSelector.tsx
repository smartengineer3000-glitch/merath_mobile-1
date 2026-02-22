/**
 * @file HeirSelector.tsx
 * @description اختيار الوارثون
 * Heir Selection Component for Phase 5
 * 
 * إضافة وإدارة الوارثون بشكل ديناميكي
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useHeirs } from '../lib/inheritance/hooks';
import type { HeirsData, HeirType } from '../lib/inheritance/types';
import { HeirValidator } from '../lib/validation/InputValidator';
import type { ValidationResult } from '../lib/validation/InputValidator';

export interface HeirSelectorProps {
  onHeirsChange?: (heirs: HeirsData) => void;
}

const HEIR_TYPES: { key: HeirType; label: string; emoji: string }[] = [
  { key: 'husband', label: 'الزوج', emoji: '💍' },
  { key: 'wife', label: 'الزوجة', emoji: '💍' },
  { key: 'son', label: 'الابن', emoji: '👦' },
  { key: 'daughter', label: 'البنت', emoji: '👧' },
  { key: 'father', label: 'الأب', emoji: '👨' },
  { key: 'mother', label: 'الأم', emoji: '👩' },
  { key: 'grandfather', label: 'الجد', emoji: '👴' },
  { key: 'full_brother', label: 'الأخ الشقيق', emoji: '👨‍🤝‍👨' },
  { key: 'full_sister', label: 'الأخت الشقيقة', emoji: '👩‍🤝‍👩' },
  { key: 'half_brother_paternal', label: 'الأخ لأب', emoji: '👨' }
];

/**
 * مكون اختيار الوارثون
 * Displays and manages heir selection
 */
export function HeirSelector({ onHeirsChange }: HeirSelectorProps) {
  const { heirs } = useHeirs();
  const [showModal, setShowModal] = useState(false);
  const [selectedHeirType, setSelectedHeirType] = useState<HeirType>('son');
  const [selectedCount, setSelectedCount] = useState(1);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingHeirType, setEditingHeirType] = useState<HeirType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Convert array heirs to HeirsData object
  const heirsArray = (heirs as any) || [];
  const safeHeirs: HeirsData = useMemo(() => {
    const result: HeirsData = {};
    if (Array.isArray(heirsArray)) {
      heirsArray.forEach((heir: any) => {
        result[heir.key] = heir.count;
      });
    }
    return result;
  }, [heirsArray]);

  const handleAddHeir = useCallback(() => {
    try {
      setIsLoading(true);
      
      if (!selectedHeirType) {
        const errorMsg = 'يجب اختيار نوع الوارث';
        setModalError(errorMsg);
        Alert.alert('خطأ', errorMsg);
        return;
      }

      if (selectedCount < 1 || selectedCount > 100) {
        const errorMsg = 'العدد يجب أن يكون بين 1 و 100';
        setModalError(errorMsg);
        Alert.alert('خطأ', errorMsg);
        return;
      }

      // تحديث الوارثون
      const newHeirs: HeirsData = { ...safeHeirs };
      newHeirs[selectedHeirType] = selectedCount;
      
      // Validate updated heirs list
      const validation = HeirValidator.validate(newHeirs);
      setValidationResult(validation);
      
      if (validation.isValid) {
        onHeirsChange?.(newHeirs);
        setModalError(null);
        setEditingHeirType(null);
        
        // Show success alert
        const heirLabel = HEIR_TYPES.find(h => h.key === selectedHeirType)?.label || selectedHeirType;
        Alert.alert(
          'نجح',
          `تم ${editingHeirType ? 'تحديث' : 'إضافة'} ${heirLabel} بنجاح`,
          [{ text: 'حسناً', onPress: () => setShowModal(false) }]
        );
      } else {
        // Show first error in modal and alert
        const firstError = validation.errors[0];
        setModalError(firstError.userMessage);
        Alert.alert('خطأ في التحقق', firstError.userMessage);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'خطأ في إضافة الوارث';
      setModalError(errorMsg);
      Alert.alert('خطأ', errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [selectedHeirType, selectedCount, safeHeirs, onHeirsChange, editingHeirType]);

  const handleRemoveHeir = useCallback((heirType: HeirType) => {
    const heirLabel = HEIR_TYPES.find(h => h.key === heirType)?.label || heirType;
    Alert.alert(
      'تأكيد الحذف',
      `هل تريد حذف ${heirLabel}؟`,
      [
        { text: 'إلغاء', onPress: () => {} },
        {
          text: 'حذف',
          onPress: () => {
            const newHeirs: HeirsData = { ...safeHeirs };
            delete newHeirs[heirType];
            
            // Validate updated heirs list
            const validation = HeirValidator.validate(newHeirs);
            setValidationResult(validation);
            
            onHeirsChange?.(newHeirs);
            Alert.alert('نجح', `تم حذف ${heirLabel} بنجاح`);
          }
        }
      ]
    );
  }, [safeHeirs, onHeirsChange]);

  const handleEditHeir = useCallback((heirType: HeirType) => {
    const currentCount = safeHeirs[heirType] || 1;
    const heirLabel = HEIR_TYPES.find(h => h.key === heirType)?.label || heirType;
    
    setEditingHeirType(heirType);
    setSelectedHeirType(heirType);
    setSelectedCount(currentCount);
    setModalError(null);
    setShowModal(true);
  }, [safeHeirs]);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      'مسح الكل',
      'هل تريد مسح جميع الوارثون؟',
      [
        { text: 'إلغاء', onPress: () => {} },
        {
          text: 'مسح',
          onPress: () => {
            const emptyHeirs: HeirsData = {};
            
            // Validate empty heirs (will show error)
            const validation = HeirValidator.validate(emptyHeirs);
            setValidationResult(validation);
            
            onHeirsChange?.(emptyHeirs);
          }
        }
      ]
    );
  }, [onHeirsChange]);

  const heirEntries = Object.entries(safeHeirs);
  const totalHeirs = Object.values(safeHeirs).reduce((sum: number, count: number | undefined) => sum + (count || 0), 0);

  return (
    <View style={styles.container}>
      {/* الزر الرئيسي لإضافة الوارثون */}
      {/* Validation Errors/Warnings */}
      {validationResult && validationResult.errors.length > 0 && (
        <View style={[styles.feedbackContainer, styles.feedbackErrorContainer]}>
          {validationResult.errors.map((error, index) => (
            <View key={`error-${index}`} style={styles.feedbackItem}>
              <Text style={styles.feedbackIcon}>❌</Text>
              <View style={styles.feedbackText}>
                <Text style={styles.feedbackUserMessage}>{error.userMessage}</Text>
                {error.suggestion && (
                  <Text style={styles.feedbackSuggestion}>{error.suggestion}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {validationResult && validationResult.warnings.length > 0 && (
        <View style={[styles.feedbackContainer, styles.feedbackWarningContainer]}>
          {validationResult.warnings.map((warning, index) => (
            <View key={`warning-${index}`} style={styles.feedbackItem}>
              <Text style={styles.feedbackIcon}>⚠️</Text>
              <View style={styles.feedbackText}>
                <Text style={styles.feedbackUserMessage}>{warning.userMessage}</Text>
                {warning.suggestion && (
                  <Text style={styles.feedbackSuggestion}>{warning.suggestion}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* الزر الرئيسي لإضافة الوارثون */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setShowModal(true);
          setModalError(null);
          setEditingHeirType(null);
          setSelectedHeirType('son');
          setSelectedCount(1);
        }}
      >
        <Text style={styles.addButtonText}>+ إضافة وارث</Text>
      </TouchableOpacity>

      {/* قائمة الوارثون الحاليين */}
      {heirEntries.length > 0 ? (
        <View style={styles.heirsListContainer}>
          <Text style={styles.heirsListTitle}>الوارثون المضافون:</Text>
          <ScrollView style={styles.heirsList} scrollEnabled={false}>
            {heirEntries.map(([heirTypeStr, count]: [string, number | undefined]) => {
              const heirType = heirTypeStr as HeirType;
              const heirLabel = HEIR_TYPES.find(h => h.key === heirType)?.label || heirTypeStr;
              const emoji = HEIR_TYPES.find(h => h.key === heirType)?.emoji || '👤';
              return (
                <View key={heirTypeStr} style={styles.heirItem}>
                  <View style={styles.heirInfo}>
                    <Text style={styles.heirEmoji}>{emoji}</Text>
                    <View style={styles.heirDetails}>
                      <Text style={styles.heirLabel}>{heirLabel}</Text>
                      <Text style={styles.heirCount}>العدد: {count}</Text>
                    </View>
                  </View>
                  <View style={styles.heirActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEditHeir(heirType)}
                    >
                      <Text style={styles.editButtonText}>✎</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleRemoveHeir(heirType)}
                    >
                      <Text style={styles.deleteButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* إحصائيات */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>إجمالي الوارثون: {totalHeirs}</Text>
            <Text style={styles.statsText}>عدد الأنواع: {heirEntries.length}</Text>
          </View>

          {/* زر مسح الكل */}
          {heirEntries.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAll}
            >
              <Text style={styles.clearButtonText}>مسح الكل</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>لم يتم إضافة أي وارثون بعد</Text>
        </View>
      )}

      {/* الـ Modal لإضافة وارث جديد */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingHeirType ? 'تعديل وارث' : 'إضافة وارث جديد'}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                setShowModal(false);
                setEditingHeirType(null);
              }}
            >
              </TouchableOpacity>
            </View>

            {/* اختيار نوع الوارث */}
            <Text style={styles.modalLabel}>اختر نوع الوارث:</Text>
            <ScrollView style={styles.heirTypesGrid} scrollEnabled={true}>
              {HEIR_TYPES.map(heirType => (
                <TouchableOpacity
                  key={heirType.key}
                  style={[
                    styles.heirTypeButton,
                    selectedHeirType === heirType.key && styles.heirTypeButtonSelected,
                    editingHeirType && editingHeirType !== heirType.key && styles.heirTypeButtonDisabled
                  ]}
                  onPress={() => !editingHeirType && setSelectedHeirType(heirType.key)}
                  disabled={editingHeirType !== null && editingHeirType !== heirType.key}
                >
                  <Text style={styles.heirTypeEmoji}>{heirType.emoji}</Text>
                  <Text style={[
                    styles.heirTypeLabel,
                    editingHeirType && editingHeirType !== heirType.key && { opacity: 0.5 }
                  ]}>
                    {heirType.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* اختيار العدد - Dynamic Number Input */}
            <Text style={styles.modalLabel}>اختر العدد (1-100):</Text>
            <View style={styles.countInputContainer}>
              <TouchableOpacity
                style={styles.decrementButton}
                onPress={() => setSelectedCount(Math.max(1, selectedCount - 1))}
                disabled={selectedCount <= 1}
              >
                <Text style={styles.decrementButtonText}>−</Text>
              </TouchableOpacity>
              
              <TextInput
                style={styles.countInput}
                placeholder="العدد"
                placeholderTextColor="#999"
                value={selectedCount.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  if (num >= 1 && num <= 100) {
                    setSelectedCount(num);
                  }
                }}
                keyboardType="number-pad"
                maxLength={3}
              />
              
              <TouchableOpacity
                style={styles.incrementButton}
                onPress={() => setSelectedCount(Math.min(100, selectedCount + 1))}
                disabled={selectedCount >= 100}
              >
                <Text style={styles.incrementButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            
            {/* Display current selection */}
            <View style={styles.selectedCountDisplay}>
              <Text style={styles.selectedCountText}>العدد المختار: {selectedCount}</Text>
            </View>

            {/* Modal Error Message */}
            {modalError && (
              <View style={styles.modalErrorContainer}>
                <Text style={styles.modalErrorText}>{modalError}</Text>
              </View>
            )}

            {/* أزرار الإجراء */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowModal(false);
                  setModalError(null);
                  setEditingHeirType(null);
                }}
              >
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]}
                onPress={handleAddHeir}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {editingHeirType ? 'تحديث' : 'تأكيد'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8
  },
  addButton: {
    backgroundColor: '#4caf50',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  heirsListContainer: {
    marginTop: 8
  },
  heirsListTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right'
  },
  heirsList: {
    maxHeight: 200
  },
  heirItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  heirInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  heirEmoji: {
    fontSize: 24,
    marginLeft: 12
  },
  heirDetails: {
    flex: 1
  },
  heirLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right'
  },
  heirCount: {
    fontSize: 11,
    color: '#666',
    textAlign: 'right',
    marginTop: 2
  },
  heirActions: {
    flexDirection: 'row',
    gap: 6
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center'
  },
  editButtonText: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: 'bold'
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteButtonText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: 'bold'
  },
  statsContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1976d2',
    marginTop: 8
  },
  statsText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
    textAlign: 'right',
    marginVertical: 2
  },
  clearButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center'
  },
  emptyStateText: {
    fontSize: 12,
    color: '#999'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333'
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#666'
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right'
  },
  heirTypesGrid: {
    maxHeight: 150,
    marginBottom: 12
  },
  heirTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  heirTypeButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2'
  },
  heirTypeButtonDisabled: {
    opacity: 0.5
  },
  heirTypeEmoji: {
    fontSize: 20,
    marginLeft: 8
  },
  heirTypeLabel: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    textAlign: 'right'
  },
  countInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8
  },
  decrementButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ff7043',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e64a19'
  },
  decrementButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  countInput: {
    width: 80,
    height: 44,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1976d2',
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    backgroundColor: '#f5f5f5'
  },
  incrementButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#388e3c'
  },
  incrementButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  selectedCountDisplay: {
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: 'center'
  },
  selectedCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    textAlign: 'center'
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ef5350'
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    textAlign: 'center'
  },
  modalErrorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f'
  },
  modalErrorText: {
    color: '#d32f2f',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right'
  },
  feedbackContainer: {
    borderRadius: 6,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 0
  },
  feedbackErrorContainer: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f'
  },
  feedbackWarningContainer: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#f57c00'
  },
  feedbackItem: {
    flexDirection: 'row',
    marginBottom: 8
  },
  feedbackIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2
  },
  feedbackText: {
    flex: 1
  },
  feedbackUserMessage: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    textAlign: 'right',
    marginBottom: 4
  },
  feedbackSuggestion: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    fontStyle: 'italic',
    marginTop: 2
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666'
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1976d2',
    borderRadius: 6,
    alignItems: 'center'
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff'
  }
});

export default HeirSelector;
