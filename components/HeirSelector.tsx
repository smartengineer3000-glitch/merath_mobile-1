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
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useHeirs } from '../lib/inheritance/hooks';
import type { HeirsData, HeirType } from '../lib/inheritance/types';
import { HeirValidator } from '../lib/validation/InputValidator';
import type { ValidationResult } from '../lib/validation/InputValidator';

export interface HeirSelectorProps {
  onHeirsChange?: (heirs: HeirsData) => void;
}

// Heir categories as per original HTML
const HEIR_CATEGORIES = [
  {
    name: '🤝 الأزواج (Spouses)',
    heirs: [
      { key: 'husband' as HeirType, label: 'الزوج', emoji: '💍' },
      { key: 'wife' as HeirType, label: 'الزوجة', emoji: '💍' },
    ]
  },
  {
    name: '👨‍👩‍👧 الأصول (Ascendants)',
    heirs: [
      { key: 'father' as HeirType, label: 'الأب', emoji: '👨' },
      { key: 'mother' as HeirType, label: 'الأم', emoji: '👩' },
      { key: 'grandfather' as HeirType, label: 'الجد', emoji: '👴' },
      { key: 'grandmother' as HeirType, label: 'الجدة', emoji: '👵' },
    ]
  },
  {
    name: '👶 الفروع (Descendants)',
    heirs: [
      { key: 'son' as HeirType, label: 'الابن', emoji: '👦' },
      { key: 'daughter' as HeirType, label: 'البنت', emoji: '👧' },
    ]
  },
  {
    name: '👯 الحواشي (Siblings)',
    heirs: [
      { key: 'full_brother' as HeirType, label: 'الأخ الشقيق', emoji: '👨‍🤝‍👨' },
      { key: 'full_sister' as HeirType, label: 'الأخت الشقيقة', emoji: '👩‍🤝‍👩' },
      { key: 'half_brother_paternal' as HeirType, label: 'الأخ لأب', emoji: '👨' },
      { key: 'half_sister_paternal' as HeirType, label: 'الأخت لأب', emoji: '👩' },
      { key: 'half_brother_maternal' as HeirType, label: 'الأخ لأم', emoji: '👨' },
      { key: 'half_sister_maternal' as HeirType, label: 'الأخت لأم', emoji: '👩' },
    ]
  },
  {
    name: '👨‍👦 الأقارب البعداء (Extended Family)',
    heirs: [
      { key: 'nephew_from_brother' as HeirType, label: 'ابن أخ/أخت', emoji: '👶' },
      { key: 'niece_from_brother' as HeirType, label: 'ابنة أخ/أخت', emoji: '👧' },
      { key: 'uncle_paternal' as HeirType, label: 'العم', emoji: '🧔' },
      { key: 'uncle_maternal' as HeirType, label: 'الخال', emoji: '🧔' },
      { key: 'aunt_paternal' as HeirType, label: 'العمة', emoji: '👵' },
      { key: 'aunt_maternal' as HeirType, label: 'الخالة', emoji: '👵' },
    ]
  }
];

// Flat array for backwards compatibility
const HEIR_TYPES: { key: HeirType; label: string; emoji: string }[] = [
  { key: 'husband', label: 'الزوج', emoji: '💍' },
  { key: 'wife', label: 'الزوجة', emoji: '💍' },
  { key: 'son', label: 'الابن', emoji: '👦' },
  { key: 'daughter', label: 'البنت', emoji: '👧' },
  { key: 'father', label: 'الأب', emoji: '👨' },
  { key: 'mother', label: 'الأم', emoji: '👩' },
  { key: 'grandfather', label: 'الجد', emoji: '👴' },
  { key: 'grandmother', label: 'الجدة', emoji: '👵' },
  { key: 'full_brother', label: 'الأخ الشقيق', emoji: '👨‍🤝‍👨' },
  { key: 'full_sister', label: 'الأخت الشقيقة', emoji: '👩‍🤝‍👩' },
  { key: 'half_brother_paternal', label: 'الأخ لأب', emoji: '👨' },
  { key: 'half_sister_paternal', label: 'الأخت لأب', emoji: '👩' },
  { key: 'half_brother_maternal', label: 'الأخ لأم', emoji: '👨' },
  { key: 'half_sister_maternal', label: 'الأخت لأم', emoji: '👩' },
  { key: 'nephew_from_brother', label: 'ابن أخ/أخت', emoji: '👶' },
  { key: 'niece_from_brother', label: 'ابنة أخ/أخت', emoji: '👧' },
  { key: 'uncle_paternal', label: 'العم', emoji: '🧔' },
  { key: 'uncle_maternal', label: 'الخال', emoji: '🧔' },
  { key: 'aunt_paternal', label: 'العمة', emoji: '👵' },
  { key: 'aunt_maternal', label: 'الخالة', emoji: '👵' }
];

/**
 * مكون اختيار الوارثون
 * Displays and manages heir selection
 */
export function HeirSelector({ onHeirsChange }: HeirSelectorProps) {
  const { heirs, addHeir, updateHeir, removeHeir, clearHeirs } = useHeirs();
  const [showModal, setShowModal] = useState(false);
  const [selectedHeirType, setSelectedHeirType] = useState<HeirType>('son');
  const [selectedCount, setSelectedCount] = useState(1);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingHeirType, setEditingHeirType] = useState<HeirType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // heirs is an array of {id, key, count}
  const heirsArray = (heirs as Array<{ id: string; key: HeirType; count: number }>) || [];
  const safeHeirs: HeirsData = useMemo(() => {
    const result: HeirsData = {};
    heirsArray.forEach((heir) => {
      result[heir.key] = heir.count;
    });
    return result;
  }, [heirsArray]);

  const handleAddHeir = useCallback(() => {
    // kept for compatibility with modal editing (not primary in alternate UI)
    try {
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

      if (editingHeirType) {
        const existing = heirsArray.find(h => h.key === editingHeirType);
        if (existing) {
          const ok = updateHeir(existing.id, { count: selectedCount });
          if (ok) {
            setModalError(null);
            Alert.alert('نجح', 'تم التحديث');
          } else {
            setModalError('فشل في تحديث الوارث');
            Alert.alert('خطأ', 'فشل في تحديث الوارث');
          }
        }
      } else {
        const gender = ['husband','son','father','grandfather','full_brother','half_brother_paternal','half_brother_maternal','nephew_from_brother','uncle_paternal','uncle_maternal'].includes(selectedHeirType) ? 'male' : 'female';
        const ok = addHeir({ type: selectedHeirType as string, gender: gender as 'male'|'female', count: selectedCount });
        if (ok) {
          setModalError(null);
          Alert.alert('نجح', 'تم الإضافة');
        } else {
          setModalError('فشل في إضافة الوارث (مكرر أو غير صالح)');
          Alert.alert('خطأ', 'فشل في إضافة الوارث (مكرر أو غير صالح)');
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'خطأ في إضافة الوارث';
      setModalError(errorMsg);
      Alert.alert('خطأ', errorMsg);
    }
  }, [selectedHeirType, selectedCount, safeHeirs, onHeirsChange, editingHeirType]);

  // Helper: determine gender for heir type
  const genderFor = useCallback((key: HeirType) => {
    return ['husband','son','father','grandfather','full_brother','half_brother_paternal','half_brother_maternal','nephew_from_brother','uncle_paternal','uncle_maternal'].includes(key) ? 'male' : 'female';
  }, []);

  // Validation rules enforcement when changing counts inline
  const validateChange = useCallback((key: HeirType, newCount: number, currentMap: HeirsData) => {
    // Cannot be negative or over 100
    if (newCount < 0 || newCount > 100) return 'العدد يجب أن يكون بين 0 و 100.';
    
    // MUST have only 1 husband (max)
    if (key === 'husband' && newCount > 1) {
      return '❌ خطأ: يمكن أن يكون هناك زوج واحد فقط (الحد الأقصى 1)';
    }
    
    // Cannot have both husband and wife
    if (key === 'husband' && newCount > 0 && (currentMap['wife'] || 0) > 0) {
      return 'لا يمكن إضافة الزوج بينما هناك زوجات مسجلات. أزل الزوجات أولاً.';
    }
    if (key === 'wife' && newCount > 0 && (currentMap['husband'] || 0) > 0) {
      return 'لا يمكن إضافة زوجة مع وجود زوج مسجل. أزل الزوج أولاً.';
    }
    
    // Wife max 4
    if (key === 'wife' && newCount > 4) {
      return '❌ خطأ: الحد الأقصى للزوجات هو 4 (قال تعالى: فانكحوا ما طاب لكم من النساء...)';
    }
    
    // Single-count limits for parents/grandparents
    const singleCountHeirs = ['husband', 'father', 'mother', 'grandfather', 'grandmother'];
    if (singleCountHeirs.includes(key) && newCount > 1) {
      return `❌ خطأ: يمكن أن يكون هناك ${key === 'husband' ? 'زوج' : 'واحد'} فقط من هذا النوع`;
    }
    
    return null;
  }, []);

  const handleIncrement = useCallback((heirKey: HeirType) => {
    const existing = heirsArray.find(h => h.key === heirKey);
    const currentMap: HeirsData = { ...safeHeirs };
    const currentCount = existing ? existing.count : 0;
    const newCount = currentCount + 1;

    const validationMsg = validateChange(heirKey, newCount, currentMap);
    if (validationMsg) {
      Alert.alert('غير مسموح', validationMsg);
      return;
    }

    if (existing) {
      updateHeir(existing.id, { count: newCount });
    } else {
      addHeir({ type: heirKey, gender: genderFor(heirKey) as 'male'|'female', count: 1 });
    }
  }, [heirsArray, safeHeirs, addHeir, updateHeir, validateChange, genderFor]);

  const handleDecrement = useCallback((heirKey: HeirType) => {
    const existing = heirsArray.find(h => h.key === heirKey);
    if (!existing) return;
    const currentMap: HeirsData = { ...safeHeirs };
    const newCount = Math.max(0, existing.count - 1);

    const validationMsg = validateChange(heirKey, newCount, currentMap);
    if (validationMsg) {
      Alert.alert('غير مسموح', validationMsg);
      return;
    }

    if (newCount === 0) {
      // remove if more than one type exists
      if (heirsArray.length > 1) {
        removeHeir(existing.id);
      } else {
        Alert.alert('غير مسموح', 'يجب أن يبقى وارث واحد على الأقل');
      }
    } else {
      updateHeir(existing.id, { count: newCount });
    }
  }, [heirsArray, safeHeirs, removeHeir, updateHeir, validateChange]);

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
            const existing = heirsArray.find(h => h.key === heirType);
            if (!existing) {
              Alert.alert('خطأ', 'الوارث غير موجود');
              return;
            }
            const ok = removeHeir(existing.id);
            if (ok) {
              const newMap: HeirsData = { ...safeHeirs };
              delete newMap[heirType];
              const validation = HeirValidator.validate(newMap);
              setValidationResult(validation);
              onHeirsChange?.(newMap);
              Alert.alert('نجح', `تم حذف ${heirLabel} بنجاح`);
            } else {
              Alert.alert('خطأ', 'فشل في حذف الوارث');
            }
          }
        }
      ]
    );
  }, [safeHeirs, onHeirsChange]);

  const handleEditHeir = useCallback((heirType: HeirType) => {
    const current = heirsArray.find(h => h.key === heirType);
    const currentCount = current ? current.count : (safeHeirs[heirType] || 1);
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

  // Use heirsArray for rendering to preserve ids
  const heirEntries = heirsArray.map(h => [h.key, h.count] as [string, number]);
  const totalHeirs = heirsArray.reduce((sum, h) => sum + (h.count || 0), 0);

  return (
    <View style={styles.container}>
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

      {/* Grouped Heir Selection */}
      <View style={styles.groupedHeirstContainer}>
        <Text style={styles.heirstitle}>إضافة الوارثون (مرتبة بالفئات)</Text>
        <ScrollView style={styles.groupedHeirstScrollView}>
          {HEIR_CATEGORIES.map((category, catIndex) => (
            <View key={`category-${catIndex}`} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
              {category.heirs.map((heir) => {
                const existing = heirsArray.find(h => h.key === heir.key);
                const count = existing ? existing.count : 0;
                return (
                  <View key={heir.key} style={styles.heirRow}>
                    <View style={styles.heirRowLeft}>
                      <Text style={styles.heirEmoji}>{heir.emoji}</Text>
                      <Text style={styles.heirName}>{heir.label}</Text>
                    </View>
                    <View style={styles.heirRowRight}>
                      <TouchableOpacity
                        style={[styles.smallBtn, count > 0 && styles.smallBtnActive]}
                        onPress={() => handleDecrement(heir.key)}
                        disabled={count === 0}
                      >
                        <Text style={styles.smallBtnText}>−</Text>
                      </TouchableOpacity>
                      <View style={styles.countDisplay}>
                        <Text style={styles.countText}>{count}</Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.smallBtn, count > 0 && styles.smallBtnActive]}
                        onPress={() => handleIncrement(heir.key)}
                      >
                        <Text style={styles.smallBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Summary Section */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryLabel}>الوارثون المضافون: {heirEntries.length} نوع، الإجمالي: {totalHeirs}</Text>
        {heirEntries.length > 0 && (
          <ScrollView style={styles.addedHeirsList}>
            {heirEntries.map(([heirTypeStr, count]: [string, number | undefined]) => {
              const heirType = heirTypeStr as HeirType;
              const heirLabel = HEIR_TYPES.find(h => h.key === heirType)?.label || heirTypeStr;
              const emoji = HEIR_TYPES.find(h => h.key === heirType)?.emoji || '👤';
              return (
                <View key={heirTypeStr} style={styles.summaryItem}>
                  <Text>{emoji} {heirLabel}: {count}</Text>
                </View>
              );
            })}
          </ScrollView>
        )}
        {heirEntries.length > 0 && (
          <TouchableOpacity style={styles.clearAllBtn} onPress={handleClearAll}>
            <Text style={styles.clearAllBtnText}>🗑️ مسح الكل</Text>
          </TouchableOpacity>
        )}
      </View>

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
  inlineGridContainer: {
    marginVertical: 8
  },
  inlineGrid: {
    maxHeight: 220,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 8,
    backgroundColor: '#fff'
  },
  gridItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  gridLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  gridRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  smallButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6
  },
  smallButtonText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600'
  },
  countBadge: {
    minWidth: 44,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center'
  },
  countBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1976d2'
  },
  // Grouped Heirs Styles
  groupedHeirstContainer: {
    marginVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden'
  },
  heirstitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    textAlign: 'right'
  },
  groupedHeirstScrollView: {
    maxHeight: 400
  },
  categorySection: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  categoryHeader: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#c8e6c9'
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2e7d32',
    textAlign: 'right'
  },
  heirRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0'
  },
  heirRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  heirName: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right'
  },
  heirRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  smallBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  smallBtnActive: {
    backgroundColor: '#4caf50',
    borderColor: '#388e3c'
  },
  smallBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  countDisplay: {
    minWidth: 40,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center'
  },
  countText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1976d2'
  },
  summarySection: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: '#fff9c4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fbc02d'
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f57f17',
    marginBottom: 8,
    textAlign: 'right'
  },
  addedHeirsList: {
    maxHeight: 120,
    marginBottom: 8
  },
  summaryItem: {
    fontSize: 12,
    color: '#333',
    paddingVertical: 4,
    paddingHorizontal: 8,
    textAlign: 'right'
  },
  clearAllBtn: {
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center'
  },
  clearAllBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13
  },
  errorContainer: {
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
