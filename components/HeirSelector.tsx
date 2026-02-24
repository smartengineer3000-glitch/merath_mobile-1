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

// Heir categories as per original HTML - Complete List
const HEIR_CATEGORIES = [
  {
    name: '🤝 الأزواج (Spouses)',
    collapsible: false,
    heirs: [
      { key: 'husband' as HeirType, label: 'الزوج', emoji: '💍' },
      { key: 'wife' as HeirType, label: 'الزوجة / الزوجات', emoji: '💍' },
    ]
  },
  {
    name: '👴 الأصول (Ascendants)',
    collapsible: false,
    heirs: [
      { key: 'father' as HeirType, label: 'الأب', emoji: '👨‍🦳' },
      { key: 'mother' as HeirType, label: 'الأم', emoji: '👩‍🦳' },
      { key: 'grandfather' as HeirType, label: 'الجد', emoji: '👴' },
      { key: 'grandmother' as HeirType, label: 'الجدة', emoji: '👵' },
      { key: 'grandmother_mother' as HeirType, label: 'الجدة لأم', emoji: '👵' },
      { key: 'grandmother_father' as HeirType, label: 'الجدة لأب', emoji: '👵' },
    ]
  },
  {
    name: '👶 الفروع (Descendants)',
    collapsible: false,
    heirs: [
      { key: 'son' as HeirType, label: 'الابن', emoji: '👦' },
      { key: 'daughter' as HeirType, label: 'البنت', emoji: '👧' },
      { key: 'grandson' as HeirType, label: 'ابن الابن', emoji: '👦' },
      { key: 'granddaughter' as HeirType, label: 'بنت الابن', emoji: '👧' },
    ]
  },
  {
    name: '👫 الحواشي (Siblings)',
    collapsible: false,
    heirs: [
      { key: 'full_brother' as HeirType, label: 'الأخ الشقيق', emoji: '👨‍🤝‍👨' },
      { key: 'full_sister' as HeirType, label: 'الأخت الشقيقة', emoji: '👩‍🤝‍👩' },
      { key: 'paternal_brother' as HeirType, label: 'الأخ لأب', emoji: '👨' },
      { key: 'paternal_sister' as HeirType, label: 'الأخت لأب', emoji: '👩' },
      { key: 'maternal_brother' as HeirType, label: 'الأخ لأم', emoji: '👨' },
      { key: 'maternal_sister' as HeirType, label: 'الأخت لأم', emoji: '👩' },
    ]
  },
  {
    name: '👨‍👦 أبناء الإخوة والأعمام (Nephews & Uncles)',
    collapsible: true,
    heirs: [
      { key: 'full_nephew' as HeirType, label: 'ابن الأخ الشقيق', emoji: '👶' },
      { key: 'paternal_nephew' as HeirType, label: 'ابن الأخ لأب', emoji: '👶' },
      { key: 'full_uncle' as HeirType, label: 'العم الشقيق', emoji: '🧔' },
      { key: 'paternal_uncle' as HeirType, label: 'العم لأب', emoji: '🧔' },
      { key: 'full_cousin' as HeirType, label: 'ابن العم الشقيق', emoji: '👨' },
      { key: 'paternal_cousin' as HeirType, label: 'ابن العم لأب', emoji: '👨' },
    ]
  },
  {
    name: '🔗 ذوو الأرحام (Blood Relatives)',
    collapsible: true,
    heirs: [
      { key: 'daughter_son' as HeirType, label: 'ابن البنت', emoji: '👶' },
      { key: 'daughter_daughter' as HeirType, label: 'بنت البنت', emoji: '👧' },
      { key: 'sister_children' as HeirType, label: 'أولاد الأخت', emoji: '👶' },
      { key: 'maternal_uncle' as HeirType, label: 'الخال', emoji: '🧔' },
      { key: 'maternal_aunt' as HeirType, label: 'الخالة', emoji: '👩' },
      { key: 'paternal_aunt' as HeirType, label: 'العمة', emoji: '👵' },
    ]
  }
];

// Flat array for backwards compatibility - All Heir Types (matching HTML heirNames object)
const HEIR_TYPES: { key: HeirType; label: string; emoji: string }[] = [
  { key: 'husband', label: 'الزوج', emoji: '💍' },
  { key: 'wife', label: 'الزوجة', emoji: '💍' },
  { key: 'father', label: 'الأب', emoji: '👨‍🦳' },
  { key: 'mother', label: 'الأم', emoji: '👩‍🦳' },
  { key: 'grandfather', label: 'الجد', emoji: '👴' },
  { key: 'grandmother', label: 'الجدة', emoji: '👵' },
  { key: 'grandmother_mother', label: 'الجدة لأم', emoji: '👵' },
  { key: 'grandmother_father', label: 'الجدة لأب', emoji: '👵' },
  { key: 'son', label: 'الابن', emoji: '👦' },
  { key: 'daughter', label: 'البنت', emoji: '👧' },
  { key: 'grandson', label: 'ابن الابن', emoji: '👦' },
  { key: 'granddaughter', label: 'بنت الابن', emoji: '👧' },
  { key: 'full_brother', label: 'الأخ الشقيق', emoji: '👨‍🤝‍👨' },
  { key: 'full_sister', label: 'الأخت الشقيقة', emoji: '👩‍🤝‍👩' },
  { key: 'paternal_brother', label: 'الأخ لأب', emoji: '👨' },
  { key: 'paternal_sister', label: 'الأخت لأب', emoji: '👩' },
  { key: 'maternal_brother', label: 'الأخ لأم', emoji: '👨' },
  { key: 'maternal_sister', label: 'الأخت لأم', emoji: '👩' },
  { key: 'full_nephew', label: 'ابن الأخ الشقيق', emoji: '👶' },
  { key: 'paternal_nephew', label: 'ابن الأخ لأب', emoji: '👶' },
  { key: 'full_uncle', label: 'العم الشقيق', emoji: '🧔' },
  { key: 'paternal_uncle', label: 'العم لأب', emoji: '🧔' },
  { key: 'full_cousin', label: 'ابن العم الشقيق', emoji: '👨' },
  { key: 'paternal_cousin', label: 'ابن العم لأب', emoji: '👨' },
  { key: 'maternal_uncle', label: 'الخال', emoji: '🧔' },
  { key: 'maternal_aunt', label: 'الخالة', emoji: '👩' },
  { key: 'paternal_aunt', label: 'العمة', emoji: '👵' },
  { key: 'daughter_son', label: 'ابن البنت', emoji: '👶' },
  { key: 'daughter_daughter', label: 'بنت البنت', emoji: '👧' },
  { key: 'sister_children', label: 'أولاد الأخت', emoji: '👶' },
  // Extended types also in HeirType union but not shown in UI:
  { key: 'half_brother_paternal', label: 'نصف أخ لأب', emoji: '🧑' },
  { key: 'half_sister_paternal', label: 'نصف أخت لأب', emoji: '👩' },
  { key: 'half_brother_maternal', label: 'نصف أخ لأم', emoji: '🧑' },
  { key: 'half_sister_maternal', label: 'نصف أخت لأم', emoji: '👩' },
  { key: 'nephew_from_brother', label: 'ابن الأخ', emoji: '👶' },
  { key: 'niece_from_brother', label: 'بنت الأخ', emoji: '👧' },
  { key: 'uncle_paternal', label: 'العم', emoji: '🧔' },
  { key: 'uncle_maternal', label: 'الخال', emoji: '🧔' },
  { key: 'aunt_paternal', label: 'العمة', emoji: '👵' },
  { key: 'aunt_maternal', label: 'الخالة', emoji: '👩' },
  { key: 'treasury', label: 'بيت المال', emoji: '🏛️' },
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
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    // By default, shown categories 0-3 are always visible (not collapsible)
    // Categories 4-5 (Nephews & Uncles, Blood Relatives) are collapsed by default
    new Set()
  );

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
        const maleHeirs = ['husband','son','grandson','father','grandfather','full_brother','paternal_brother','maternal_brother','full_nephew','paternal_nephew','full_uncle','paternal_uncle','full_cousin','paternal_cousin','maternal_uncle','daughter_son'];
        const gender = maleHeirs.includes(selectedHeirType) ? 'male' : 'female';
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
    const maleHeirs = ['husband','son','grandson','father','grandfather','full_brother','paternal_brother','maternal_brother','full_nephew','paternal_nephew','full_uncle','paternal_uncle','full_cousin','paternal_cousin','maternal_uncle','daughter_son'];
    return maleHeirs.includes(key) ? 'male' : 'female';
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
    const singleCountHeirs = ['husband', 'father', 'mother', 'grandfather', 'grandmother', 'grandmother_mother', 'grandmother_father'];
    if (singleCountHeirs.includes(key) && newCount > 1) {
      return `❌ خطأ: يمكن أن يكون هناك واحد فقط من هذا النوع`;
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

  // Toggle collapsible category
  const toggleCategory = useCallback((categoryIndex: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryIndex)) {
      newExpanded.delete(categoryIndex);
    } else {
      newExpanded.add(categoryIndex);
    }
    setExpandedCategories(newExpanded);
  }, [expandedCategories]);

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
          {HEIR_CATEGORIES.map((category, catIndex) => {
            const isCollapsible = category.collapsible || false;
            const isExpanded = expandedCategories.has(catIndex);
            const shouldShowHeirs = !isCollapsible || isExpanded;
            
            return (
              <View key={`category-${catIndex}`} style={styles.categorySection}>
                {isCollapsible ? (
                  // Collapsible header with toggle button
                  <TouchableOpacity 
                    style={styles.collapsibleHeader}
                    onPress={() => toggleCategory(catIndex)}
                  >
                    <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </TouchableOpacity>
                ) : (
                  // Regular header (not collapsible)
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                )}
                
                {/* Render heirs only if category should be shown */}
                {shouldShowHeirs && category.heirs.map((heir) => {
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
            );
          })}
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
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  statsContainer: {
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  statsText: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '600',
    textAlign: 'right',
    marginVertical: 2
  },
  clearButton: {
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5
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
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1
  },
  heirTypeButtonSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4
  },
  decrementButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  countInput: {
    width: 80,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  incrementButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4
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
    maxHeight: 1200,
    minHeight: 400
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
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 8
  },
  expandIcon: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '700',
    width: 16,
    textAlign: 'center'
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2e7d32',
    textAlign: 'right',
    flex: 1
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  smallBtnActive: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
    shadowColor: '#10B981',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3
  },
  smallBtnText: {
    fontSize: 20,
    fontWeight: '700',
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
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151'
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4
  },
  confirmButtonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowColor: '#000',
    shadowOpacity: 0
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff'
  }
});

export default HeirSelector;
