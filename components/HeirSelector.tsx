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

interface HeirCategoryItem {
  key: HeirType;
  label: string;
  labelEn: string;
  type: "fard" | "asaba" | "both" | "blood";
  badge: string;
  shareInfo: string;
  emoji: string;
  maxCount?: number;
  [key: string]: any; // Allow additional properties
}

// Heir categories with visual hierarchy and badges
const HEIR_CATEGORIES = [
  {
    id: 'spouses',
    name: '⭐ الأساسيون - الزوجان',
    titleEn: '⭐ Primary - Spouses',
    icon: '💑',
    type: 'primary',
    description: 'الزوج والزوجة - يرثون دائماً',
    collapsible: false,
    heirs: [
      { 
        key: 'husband' as HeirType, 
        label: 'الزوج', 
        labelEn: 'Husband',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '½ أو ¼',
        emoji: '👨‍❤️‍👨'
      },
      { 
        key: 'wife' as HeirType, 
        label: 'الزوجة', 
        labelEn: 'Wife',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '¼ أو ⅛',
        emoji: '👩‍❤️‍👩',
        maxCount: 4
      },
    ]
  },
  {
    id: 'children',
    name: '⭐ الأساسيون - الأبناء',
    titleEn: '⭐ Primary - Children',
    icon: '👶',
    type: 'primary',
    description: 'الأبناء والبنات - عصبة وفرض',
    collapsible: false,
    heirs: [
      { 
        key: 'son' as HeirType, 
        label: 'الابن', 
        labelEn: 'Son',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'للذكر مثل حظ الأنثيين',
        emoji: '👦'
      },
      { 
        key: 'daughter' as HeirType, 
        label: 'البنت', 
        labelEn: 'Daughter',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '½ أو ⅔',
        emoji: '👧'
      },
    ]
  },
  {
    id: 'parents',
    name: '⭐ الأساسيون - الوالدان',
    titleEn: '⭐ Primary - Parents',
    icon: '👴',
    type: 'primary',
    description: 'الأب والأم - فرض وتعصيب',
    collapsible: false,
    heirs: [
      { 
        key: 'father' as HeirType, 
        label: 'الأب', 
        labelEn: 'Father',
        type: 'both', 
        badge: 'فرض + تعصيب',
        shareInfo: '⅙ أو الباقي',
        emoji: '👨‍🦳'
      },
      { 
        key: 'mother' as HeirType, 
        label: 'الأم', 
        labelEn: 'Mother',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '⅙ أو ⅓',
        emoji: '👩‍🦳'
      },
    ]
  },
  {
    id: 'grandparents',
    name: '🔹 الأجداد',
    titleEn: '🔹 Grandparents',
    icon: '👵',
    type: 'secondary',
    description: 'الأجداد والجدات',
    collapsible: true,
    badge: 'فرض',
    heirs: [
      { 
        key: 'grandfather' as HeirType, 
        label: 'الجد', 
        labelEn: 'Grandfather',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '⅙',
        emoji: '👴'
      },
      { 
        key: 'grandmother_mother' as HeirType, 
        label: 'الجدة لأم', 
        labelEn: 'Grandmother (Maternal)',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '⅙',
        emoji: '👵'
      },
      { 
        key: 'grandmother_father' as HeirType, 
        label: 'الجدة لأب', 
        labelEn: 'Grandmother (Paternal)',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '⅙',
        emoji: '👵'
      },
    ]
  },
  {
    id: 'grandchildren',
    name: '🔹 الأحفاد',
    titleEn: '🔹 Grandchildren',
    icon: '🧒',
    type: 'secondary',
    description: 'أبناء الابن',
    collapsible: true,
    badge: 'عصبة / فرض',
    heirs: [
      { 
        key: 'grandson' as HeirType, 
        label: 'ابن الابن', 
        labelEn: 'Grandson',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '👦'
      },
      { 
        key: 'granddaughter' as HeirType, 
        label: 'بنت الابن', 
        labelEn: 'Granddaughter',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '½ أو ⅔ أو ⅙',
        emoji: '👧'
      },
    ]
  },
  {
    id: 'siblings',
    name: '🔹 الإخوة والأخوات',
    titleEn: '🔹 Siblings',
    icon: '👫',
    type: 'secondary',
    description: 'الإخوة الأشقاء ولأب ولأم',
    collapsible: true,
    badge: 'عصبة / فرض',
    heirs: [
      { 
        key: 'full_brother' as HeirType, 
        label: 'الأخ الشقيق', 
        labelEn: 'Full Brother',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '👨'
      },
      { 
        key: 'full_sister' as HeirType, 
        label: 'الأخت الشقيقة', 
        labelEn: 'Full Sister',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '½ أو ⅔',
        emoji: '👩'
      },
      { 
        key: 'paternal_brother' as HeirType, 
        label: 'الأخ لأب', 
        labelEn: 'Paternal Brother',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '👨'
      },
      { 
        key: 'paternal_sister' as HeirType, 
        label: 'الأخت لأب', 
        labelEn: 'Paternal Sister',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '½ أو ⅔ أو ⅙',
        emoji: '👩'
      },
      { 
        key: 'maternal_brother' as HeirType, 
        label: 'الأخ لأم', 
        labelEn: 'Maternal Brother',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '⅙ أو ⅓',
        emoji: '👨'
      },
      { 
        key: 'maternal_sister' as HeirType, 
        label: 'الأخت لأم', 
        labelEn: 'Maternal Sister',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '⅙ أو ⅓',
        emoji: '👩'
      },
    ]
  },
  {
    id: 'nephews_uncles',
    name: '📌 أبناء الإخوة والأعمام',
    titleEn: '📌 Nephews & Uncles',
    icon: '👨‍👦',
    type: 'tertiary',
    description: 'العصبات البعيدة',
    collapsible: true,
    badge: 'عصبة',
    heirs: [
      { 
        key: 'full_nephew' as HeirType, 
        label: 'ابن الأخ الشقيق', 
        labelEn: 'Full Nephew',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '👶'
      },
      { 
        key: 'paternal_nephew' as HeirType, 
        label: 'ابن الأخ لأب', 
        labelEn: 'Paternal Nephew',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '👶'
      },
      { 
        key: 'full_uncle' as HeirType, 
        label: 'العم الشقيق', 
        labelEn: 'Full Uncle',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '🧔'
      },
      { 
        key: 'paternal_uncle' as HeirType, 
        label: 'العم لأب', 
        labelEn: 'Paternal Uncle',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '🧔'
      },
      { 
        key: 'full_cousin' as HeirType, 
        label: 'ابن العم الشقيق', 
        labelEn: 'Full Cousin',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '👨'
      },
      { 
        key: 'paternal_cousin' as HeirType, 
        label: 'ابن العم لأب', 
        labelEn: 'Paternal Cousin',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '👨'
      },
    ]
  },
  {
    id: 'blood_relatives',
    name: '📌 ذوو الأرحام',
    titleEn: '📌 Blood Relatives',
    icon: '🔗',
    type: 'tertiary',
    description: 'يرثون عند عدم وجود العصبة',
    collapsible: true,
    badge: 'ذو رحم',
    heirs: [
      { 
        key: 'daughter_son' as HeirType, 
        label: 'ابن البنت', 
        labelEn: "Daughter's Son",
        type: 'blood', 
        badge: 'ذو رحم - صنف 1',
        shareInfo: 'عند عدم العصبة',
        emoji: '👶'
      },
      { 
        key: 'daughter_daughter' as HeirType, 
        label: 'بنت البنت', 
        labelEn: "Daughter's Daughter",
        type: 'blood', 
        badge: 'ذو رحم - صنف 1',
        shareInfo: 'عند عدم العصبة',
        emoji: '👧'
      },
      { 
        key: 'sister_children' as HeirType, 
        label: 'أولاد الأخت', 
        labelEn: "Sister's Children",
        type: 'blood', 
        badge: 'ذو رحم - صنف 2',
        shareInfo: 'عند عدم العصبة',
        emoji: '👨‍👧'
      },
      { 
        key: 'maternal_uncle' as HeirType, 
        label: 'الخال', 
        labelEn: 'Maternal Uncle',
        type: 'blood', 
        badge: 'ذو رحم - صنف 3',
        shareInfo: 'عند عدم العصبة',
        emoji: '🧔'
      },
      { 
        key: 'maternal_aunt' as HeirType, 
        label: 'الخالة', 
        labelEn: 'Maternal Aunt',
        type: 'blood', 
        badge: 'ذو رحم - صنف 3',
        shareInfo: 'عند عدم العصبة',
        emoji: '👩'
      },
      { 
        key: 'paternal_aunt' as HeirType, 
        label: 'العمة', 
        labelEn: 'Paternal Aunt',
        type: 'blood', 
        badge: 'ذو رحم - صنف 4',
        shareInfo: 'عند عدم العصبة',
        emoji: '👵'
      },
    ]
  }
];

export function HeirSelector({ onHeirsChange }: HeirSelectorProps) {
  const { heirs, addHeir, updateHeir, removeHeir, clearHeirs } = useHeirs();
  const [showModal, setShowModal] = useState(false);
  const [selectedHeirType, setSelectedHeirType] = useState<HeirType>('son');
  const [selectedCount, setSelectedCount] = useState(1);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingHeirType, setEditingHeirType] = useState<HeirType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    spouses: true,
    children: true,
    parents: true,
    grandparents: false,
    grandchildren: false,
    siblings: false,
    nephews_uncles: false,
    blood_relatives: false
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

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
  }, [selectedHeirType, selectedCount, safeHeirs, onHeirsChange, editingHeirType, heirsArray, addHeir, updateHeir]);

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
    const heirLabel = HEIR_CATEGORIES.flatMap(c => c.heirs).find(h => h.key === heirType)?.label || heirType;
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
  }, [safeHeirs, onHeirsChange, heirsArray, removeHeir]);

  const handleEditHeir = useCallback((heirType: HeirType) => {
    const current = heirsArray.find(h => h.key === heirType);
    const currentCount = current ? current.count : (safeHeirs[heirType] || 1);
    setEditingHeirType(heirType);
    setSelectedHeirType(heirType);
    setSelectedCount(currentCount);
    setModalError(null);
    setShowModal(true);
  }, [safeHeirs, heirsArray]);

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

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  // Use heirsArray for rendering to preserve ids
  const heirEntries = heirsArray.map(h => [h.key, h.count] as [string, number]);
  const totalHeirs = heirsArray.reduce((sum, h) => sum + (h.count || 0), 0);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchToggle}
          onPress={() => setShowSearch(!showSearch)}
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
        
        {showSearch && (
          <TextInput
            style={styles.searchInput}
            placeholder="بحث عن وارث..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        )}
      </View>

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

      {/* Heir Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>👥 إضافة الوارثون</Text>
        <Text style={styles.categoriesSubtitle}>Add Heirs by Category</Text>

        <ScrollView style={styles.categoriesScrollView}>
          {HEIR_CATEGORIES.map((category) => {
            const isExpanded = expandedCategories[category.id];
            
            return (
              <View key={category.id} style={styles.categoryCard}>
                {/* Category Header */}
                <TouchableOpacity
                  style={[
                    styles.categoryHeader,
                    category.type === 'primary' && styles.categoryHeaderPrimary,
                    category.type === 'secondary' && styles.categoryHeaderSecondary,
                    category.type === 'tertiary' && styles.categoryHeaderTertiary,
                  ]}
                  onPress={() => toggleCategory(category.id)}
                  disabled={!category.collapsible}
                >
                  <View style={styles.categoryHeaderLeft}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <View>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categoryDescription}>{category.description}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.categoryHeaderRight}>
                    {category.badge && (
                      <View style={[
                        styles.categoryBadge,
                        category.type === 'primary' && styles.categoryBadgePrimary,
                        category.type === 'secondary' && styles.categoryBadgeSecondary,
                        category.type === 'tertiary' && styles.categoryBadgeTertiary,
                      ]}>
                        <Text style={styles.categoryBadgeText}>{category.badge}</Text>
                      </View>
                    )}
                    
                    {category.collapsible && (
                      <Text style={styles.expandIcon}>
                        {isExpanded ? '▼' : '▶'}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                {/* Category Heirs */}
                {isExpanded && (
                  <View style={styles.categoryHeirs}>
                    {category.heirs.map((heir) => {
                      const existingHeir = heirsArray.find(h => h.key === heir.key);
                      const count = existingHeir?.count || 0;
                      
                      // Filter by search query if needed
                      if (searchQuery && !heir.label.includes(searchQuery) && 
                          !(heir.labelEn && heir.labelEn.includes(searchQuery))) {
                        return null;
                      }

                      return (
                        <View key={heir.key} style={styles.heirRow}>
                          <View style={styles.heirInfo}>
                            <Text style={styles.heirEmoji}>{heir.emoji}</Text>
                            <View style={styles.heirDetails}>
                              <View style={styles.heirNameContainer}>
                                <Text style={styles.heirName}>{heir.label}</Text>
                                {heir.badge && (
                                  <View style={[
                                    styles.heirBadge,
                                    heir.type === 'fard' && styles.heirBadgeFard,
                                    heir.type === 'asaba' && styles.heirBadgeAsaba,
                                    heir.type === 'both' && styles.heirBadgeBoth,
                                    heir.type === 'blood' && styles.heirBadgeBlood,
                                  ]}>
                                    <Text style={styles.heirBadgeText}>{heir.badge}</Text>
                                  </View>
                                )}
                              </View>
                              
                              {heir.shareInfo && (
                                <Text style={styles.heirShareInfo}>{heir.shareInfo}</Text>
                              )}
                              
                              {(heir as any).maxCount && count >= (heir as any).maxCount && (
                                <Text style={styles.heirMaxWarning}>
                                  ⚠️ الحد الأقصى {(heir as any).maxCount}
                                </Text>
                              )}
                            </View>
                          </View>

                          <View style={styles.heirControls}>
                            <TouchableOpacity
                              style={[styles.heirControlButton, count === 0 && styles.heirControlButtonDisabled]}
                              onPress={() => handleDecrement(heir.key)}
                              disabled={count === 0}
                            >
                              <Text style={styles.heirControlButtonText}>−</Text>
                            </TouchableOpacity>

                            <View style={styles.heirCountContainer}>
                              <Text style={styles.heirCount}>{count}</Text>
                            </View>

                            <TouchableOpacity
                              style={[
                                styles.heirControlButton, 
                                styles.heirControlButtonIncrement,
                                (heir as any).maxCount && count >= (heir as any).maxCount && styles.heirControlButtonDisabled
                              ]}
                              onPress={() => handleIncrement(heir.key)}
                              disabled={(heir as any).maxCount ? count >= (heir as any).maxCount : false}
                            >
                              <Text style={styles.heirControlButtonText}>+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Summary Section */}
      <View style={styles.summarySection}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryIcon}>📊</Text>
          <Text style={styles.summaryTitle}>الوارثون المضافون</Text>
        </View>
        
        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{heirEntries.length}</Text>
            <Text style={styles.summaryStatLabel}>أنواع</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{totalHeirs}</Text>
            <Text style={styles.summaryStatLabel}>إجمالي</Text>
          </View>
        </View>

        {heirEntries.length > 0 && (
          <View style={styles.addedHeirsList}>
            {heirEntries.map(([heirTypeStr, count]) => {
              const heirType = heirTypeStr as HeirType;
              const category = HEIR_CATEGORIES.find(c => 
                c.heirs.some(h => h.key === heirType)
              );
              const heir = category?.heirs.find(h => h.key === heirType);
              
              return (
                <View key={heirTypeStr} style={styles.addedHeirItem}>
                  <View style={styles.addedHeirInfo}>
                    <Text style={styles.addedHeirEmoji}>{heir?.emoji || '👤'}</Text>
                    <Text style={styles.addedHeirName}>
                      {heir?.label || heirTypeStr}: {count}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeHeirButton}
                    onPress={() => handleRemoveHeir(heirType)}
                  >
                    <Text style={styles.removeHeirButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
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
              {HEIR_CATEGORIES.flatMap(category => category.heirs).map(heirType => (
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchToggle: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textAlign: 'right',
    marginBottom: 4,
  },
  categoriesSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginBottom: 16,
  },
  categoriesScrollView: {
    maxHeight: 500,
  },
  categoryCard: {
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  categoryHeaderPrimary: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2',
  },
  categoryHeaderSecondary: {
    backgroundColor: '#f3e5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#7b1fa2',
  },
  categoryHeaderTertiary: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#f57c00',
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  categoryIcon: {
    fontSize: 24,
    width: 32,
    textAlign: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    textAlign: 'right',
  },
  categoryDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'right',
  },
  categoryHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgePrimary: {
    backgroundColor: '#bbdefb',
  },
  categoryBadgeSecondary: {
    backgroundColor: '#e1bee7',
  },
  categoryBadgeTertiary: {
    backgroundColor: '#ffe0b2',
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  expandIcon: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  categoryHeirs: {
    padding: 12,
    backgroundColor: '#fff',
  },
  heirRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  heirInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  heirEmoji: {
    fontSize: 20,
    width: 30,
    textAlign: 'center',
  },
  heirDetails: {
    flex: 1,
  },
  heirNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  heirName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
  heirBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  heirBadgeFard: {
    backgroundColor: '#e3f2fd',
  },
  heirBadgeAsaba: {
    backgroundColor: '#e8f5e9',
  },
  heirBadgeBoth: {
    backgroundColor: '#fff3e0',
  },
  heirBadgeBlood: {
    backgroundColor: '#fce4ec',
  },
  heirBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#333',
  },
  heirShareInfo: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  heirMaxWarning: {
    fontSize: 9,
    color: '#f57c00',
    marginTop: 2,
  },
  heirControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heirControlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  heirControlButtonIncrement: {
    backgroundColor: '#e8f5e9',
    borderColor: '#81c784',
  },
  heirControlButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#f5f5f5',
  },
  heirControlButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  heirCountContainer: {
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heirCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1976d2',
  },
  summarySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  summaryIcon: {
    fontSize: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 2,
  },
  summaryStatLabel: {
    fontSize: 11,
    color: '#666',
  },
  addedHeirsList: {
    maxHeight: 150,
    marginBottom: 12,
  },
  addedHeirItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 6,
  },
  addedHeirInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addedHeirEmoji: {
    fontSize: 16,
  },
  addedHeirName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  removeHeirButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeHeirButtonText: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '600',
  },
  clearAllBtn: {
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  clearAllBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
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