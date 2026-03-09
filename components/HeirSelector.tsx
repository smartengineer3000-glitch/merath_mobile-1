/**
 * @file HeirSelector.tsx
 * @description Professional Heir Selection Component with Material Design 3
 * 
 * FIXES:
 * - C3 (🔴): Input sanitization - prevents negative counts, handles Arabic numerals
 * - H2 (🟠): Real-time validation - spouse conflict detection, max limits
 * - M4 (🟡): Search optimization - memoized search with debouncing
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '../lib/icons';
import { useTheme } from '../lib/design/theme';
import type { HeirsData, HeirType } from '../lib/inheritance/types';

const { width } = Dimensions.get('window');

interface HeirSelectorProps {
  onHeirsChange?: (heirs: HeirsData) => void;
}

// ===== FIX C3: Safe number parser =====
const parseSafeInteger = (value: string): number => {
  if (!value || typeof value !== 'string') return 0;
  
  // Convert Arabic numerals to Western
  const arabicToWestern = value.replace(/[٠-٩]/g, (d) => {
    const map: Record<string, string> = {
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    };
    return map[d] || d;
  });

  // Remove all non-digit characters
  const cleaned = arabicToWestern.replace(/[^0-9]/g, '');
  
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
};

// Base heir type
interface BaseHeirItem {
  key: HeirType;
  label: string;
  labelEn: string;
  badge: string;
  shareInfo?: string;
}

// Heir with maxCount (for spouses)
interface HeirWithMaxCount extends BaseHeirItem {
  maxCount: number;
}

// Union type for all heirs
type HeirItem = BaseHeirItem | HeirWithMaxCount;

// Type guard to check if heir has maxCount
const hasMaxCount = (heir: HeirItem): heir is HeirWithMaxCount => {
  return 'maxCount' in heir;
};

// Organized heir data with categories
const HEIR_CATEGORIES: Array<{
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  heirs: HeirItem[];
}> = [
  {
    id: 'spouses',
    name: 'الزوجان',
    nameEn: 'Spouses',
    icon: 'heart',
    color: '#E91E63',
    heirs: [
      { key: 'husband' as HeirType, label: 'الزوج', labelEn: 'Husband', badge: 'فرض', maxCount: 1, shareInfo: '½ أو ¼' },
      { key: 'wife' as HeirType, label: 'الزوجة', labelEn: 'Wife', badge: 'فرض', maxCount: 4, shareInfo: '¼ أو ⅛' },
    ]
  },
  {
    id: 'children',
    name: 'الأبناء',
    nameEn: 'Children',
    icon: 'human-child',
    color: '#2196F3',
    heirs: [
      { key: 'son' as HeirType, label: 'الابن', labelEn: 'Son', badge: 'عصبة' },
      { key: 'daughter' as HeirType, label: 'البنت', labelEn: 'Daughter', badge: 'فرض', shareInfo: '½ أو ⅔' },
      { key: 'grandson' as HeirType, label: 'ابن الابن', labelEn: 'Grandson', badge: 'عصبة' },
      { key: 'granddaughter' as HeirType, label: 'بنت الابن', labelEn: 'Granddaughter', badge: 'فرض', shareInfo: '½ أو ⅙' },
    ]
  },
  {
    id: 'parents',
    name: 'الوالدان',
    nameEn: 'Parents',
    icon: 'human-male-female',
    color: '#4CAF50',
    heirs: [
      { key: 'father' as HeirType, label: 'الأب', labelEn: 'Father', badge: 'فرض + تعصيب', shareInfo: '⅙ أو الباقي' },
      { key: 'mother' as HeirType, label: 'الأم', labelEn: 'Mother', badge: 'فرض', shareInfo: '⅙ أو ⅓' },
      { key: 'grandfather' as HeirType, label: 'الجد', labelEn: 'Grandfather', badge: 'فرض', shareInfo: '⅙' },
      { key: 'grandmother_mother' as HeirType, label: 'الجدة لأم', labelEn: 'Grandmother (Maternal)', badge: 'فرض', shareInfo: '⅙' },
    ]
  },
  {
    id: 'siblings',
    name: 'الإخوة',
    nameEn: 'Siblings',
    icon: 'account-group',
    color: '#9C27B0',
    heirs: [
      { key: 'full_brother' as HeirType, label: 'الأخ الشقيق', labelEn: 'Full Brother', badge: 'عصبة' },
      { key: 'full_sister' as HeirType, label: 'الأخت الشقيقة', labelEn: 'Full Sister', badge: 'فرض', shareInfo: '½ أو ⅔' },
      { key: 'paternal_brother' as HeirType, label: 'الأخ لأب', labelEn: 'Paternal Brother', badge: 'عصبة' },
      { key: 'paternal_sister' as HeirType, label: 'الأخت لأب', labelEn: 'Paternal Sister', badge: 'فرض', shareInfo: '½ أو ⅔' },
      { key: 'maternal_brother' as HeirType, label: 'الأخ لأم', labelEn: 'Maternal Brother', badge: 'فرض', shareInfo: '⅙' },
      { key: 'maternal_sister' as HeirType, label: 'الأخت لأم', labelEn: 'Maternal Sister', badge: 'فرض', shareInfo: '⅙' },
    ]
  },
  {
    id: 'extended',
    name: 'العصبات',
    nameEn: 'Extended Family',
    icon: 'family-tree',
    color: '#FF9800',
    heirs: [
      { key: 'full_nephew' as HeirType, label: 'ابن الأخ الشقيق', labelEn: 'Full Nephew', badge: 'عصبة' },
      { key: 'paternal_nephew' as HeirType, label: 'ابن الأخ لأب', labelEn: 'Paternal Nephew', badge: 'عصبة' },
      { key: 'full_uncle' as HeirType, label: 'العم الشقيق', labelEn: 'Full Uncle', badge: 'عصبة' },
      { key: 'paternal_uncle' as HeirType, label: 'العم لأب', labelEn: 'Paternal Uncle', badge: 'عصبة' },
      { key: 'full_cousin' as HeirType, label: 'ابن العم الشقيق', labelEn: 'Full Cousin', badge: 'عصبة' },
      { key: 'paternal_cousin' as HeirType, label: 'ابن العم لأب', labelEn: 'Paternal Cousin', badge: 'عصبة' },
    ]
  }
];

export function HeirSelector({ onHeirsChange }: HeirSelectorProps) {
  const { theme } = useTheme();
  const [heirs, setHeirs] = useState<Map<HeirType, number>>(new Map());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['spouses', 'children', 'parents'])
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // ===== FIX M4: Debounced search with 300ms delay =====
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Animation on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  // ===== FIX H2: Validation rules =====
  const validateHeirUpdate = useCallback((
    heirKey: HeirType,
    newCount: number,
    currentMap: Map<HeirType, number>
  ): string | null => {
    // Cannot be negative
    if (newCount < 0) return 'العدد لا يمكن أن يكون سالباً';
    
    // Max 100 as safety limit
    if (newCount > 100) return 'العدد كبير جداً (الحد الأقصى 100)';
    
    // Husband max 1
    if (heirKey === 'husband' && newCount > 1) {
      return 'يمكن أن يكون هناك زوج واحد فقط';
    }
    
    // Wife max 4
    if (heirKey === 'wife' && newCount > 4) {
      return 'الحد الأقصى للزوجات هو 4';
    }
    
    // Spouse conflict
    if (heirKey === 'husband' && newCount > 0 && (currentMap.get('wife') || 0) > 0) {
      return 'لا يمكن إضافة الزوج مع وجود زوجة';
    }
    if (heirKey === 'wife' && newCount > 0 && (currentMap.get('husband') || 0) > 0) {
      return 'لا يمكن إضافة زوجة مع وجود زوج';
    }
    
    // Single-count limits
    const singleCountHeirs: HeirType[] = ['father', 'mother', 'grandfather'];
    if (singleCountHeirs.includes(heirKey) && newCount > 1) {
      return `يمكن أن يكون هناك واحد فقط من ${heirKey === 'father' ? 'الأب' : 
        heirKey === 'mother' ? 'الأم' : 'الجد'}`;
    }
    
    return null;
  }, []);

  // ===== FIX C3 & H2: Enhanced update function =====
  const updateHeirCount = useCallback((heirKey: HeirType, delta: number) => {
    setHeirs(prev => {
      const currentCount = prev.get(heirKey) || 0;
      const newCount = currentCount + delta;
      
      // Validate the update
      const validationError = validateHeirUpdate(heirKey, newCount, prev);
      if (validationError) {
        setValidationMessage(validationError);
        // Auto-clear after 3 seconds
        setTimeout(() => setValidationMessage(null), 3000);
        return prev; // Reject the change
      }
      
      // Clear any previous validation message
      setValidationMessage(null);
      
      const newMap = new Map(prev);
      
      if (newCount === 0) {
        newMap.delete(heirKey);
      } else {
        newMap.set(heirKey, newCount);
      }
      
      // Convert to HeirsData object for callback
      const heirsData: HeirsData = {};
      newMap.forEach((value, key) => {
        heirsData[key] = value;
      });
      onHeirsChange?.(heirsData);
      
      return newMap;
    });
  }, [onHeirsChange, validateHeirUpdate]);

  // ===== FIX C3: Direct count input handler =====
  const handleCountInput = useCallback((heirKey: HeirType, text: string) => {
    const newCount = parseSafeInteger(text);
    
    setHeirs(prev => {
      const validationError = validateHeirUpdate(heirKey, newCount, prev);
      if (validationError) {
        setValidationMessage(validationError);
        setTimeout(() => setValidationMessage(null), 3000);
        return prev;
      }
      
      setValidationMessage(null);
      const newMap = new Map(prev);
      
      if (newCount === 0) {
        newMap.delete(heirKey);
      } else {
        newMap.set(heirKey, newCount);
      }
      
      const heirsData: HeirsData = {};
      newMap.forEach((value, key) => {
        heirsData[key] = value;
      });
      onHeirsChange?.(heirsData);
      
      return newMap;
    });
  }, [onHeirsChange, validateHeirUpdate]);

  const removeHeir = useCallback((heirKey: HeirType) => {
    setHeirs(prev => {
      const newMap = new Map(prev);
      newMap.delete(heirKey);
      
      const heirsData: HeirsData = {};
      newMap.forEach((value, key) => {
        heirsData[key] = value;
      });
      onHeirsChange?.(heirsData);
      
      return newMap;
    });
  }, [onHeirsChange]);

  const clearAll = useCallback(() => {
    Alert.alert(
      'مسح الكل',
      'هل أنت متأكد من مسح جميع الورثة؟',
      [
        { text: 'إلغاء', onPress: () => {} },
        {
          text: 'مسح',
          onPress: () => {
            setHeirs(new Map());
            onHeirsChange?.({});
            setValidationMessage(null);
          }
        }
      ]
    );
  }, [onHeirsChange]);

  // ===== FIX M4: Memoized filtered categories using debounced search =====
  const filteredCategories = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return HEIR_CATEGORIES;
    
    const query = debouncedSearchQuery.toLowerCase();
    return HEIR_CATEGORIES.map(category => ({
      ...category,
      heirs: category.heirs.filter(heir => 
        heir.label.includes(query) || 
        heir.labelEn.toLowerCase().includes(query)
      )
    })).filter(category => category.heirs.length > 0);
  }, [debouncedSearchQuery]);

  const totalHeirs = useMemo(() => {
    let sum = 0;
    heirs.forEach(count => sum += count);
    return sum;
  }, [heirs]);

  const styles = createStyles(theme);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Validation Message Banner */}
      {validationMessage && (
        <Animated.View style={styles.validationBanner}>
          <MaterialCommunityIcons name="alert-circle" size={20} color="#fff" />
          <Text style={styles.validationText}>{validationMessage}</Text>
        </Animated.View>
      )}

      {/* Header with Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.neutral.dark200} />
          <TextInput
            style={styles.searchInput}
            placeholder="بحث عن وارث..."
            placeholderTextColor={theme.colors.neutral.light400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close" size={20} color={theme.colors.neutral.dark200} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Selected Heirs Summary */}
      {heirs.size > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>الوارثون المختارون</Text>
            <TouchableOpacity onPress={clearAll} style={styles.clearAllButton}>
              <MaterialCommunityIcons name="delete-sweep" size={16} color={theme.colors.error.main} />
              <Text style={styles.clearAllText}>مسح الكل</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalHeirs}</Text>
              <Text style={styles.statLabel}>إجمالي</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{heirs.size}</Text>
              <Text style={styles.statLabel}>أنواع</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedList}>
            {Array.from(heirs.entries()).map(([key, count]) => {
              const category = HEIR_CATEGORIES.find(c => 
                c.heirs.some(h => h.key === key)
              );
              const heir = category?.heirs.find(h => h.key === key);
              return (
                <View key={key} style={styles.selectedChip}>
                  <Text style={styles.selectedChipText}>
                    {heir?.label || key}: {count}
                  </Text>
                  <TouchableOpacity onPress={() => removeHeir(key)}>
                    <MaterialCommunityIcons name="close" size={14} color={theme.colors.neutral.dark200} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Heir Categories */}
      <ScrollView style={styles.categoriesContainer} showsVerticalScrollIndicator={false}>
        {filteredCategories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          
          return (
            <View key={category.id} style={styles.categoryCard}>
              {/* Category Header */}
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => toggleCategory(category.id)}
              >
                <View style={[styles.categoryIconContainer, { backgroundColor: `${category.color}20` }]}>
                  <MaterialCommunityIcons name={category.icon as any} size={20} color={category.color} />
                </View>
                <View style={styles.categoryTitleContainer}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryNameEn}>{category.nameEn}</Text>
                </View>
                <MaterialCommunityIcons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={theme.colors.neutral.dark200}
                />
              </TouchableOpacity>

              {/* Category Heirs */}
              {isExpanded && (
                <View style={styles.heirsGrid}>
                  {category.heirs.map((heir) => {
                    const count = heirs.get(heir.key) || 0;
                    
                    return (
                      <View key={heir.key} style={styles.heirCard}>
                        <View style={styles.heirInfo}>
                          <Text style={styles.heirName}>{heir.label}</Text>
                          {heir.badge && (
                            <View style={[styles.heirBadge, { backgroundColor: `${category.color}20` }]}>
                              <Text style={[styles.heirBadgeText, { color: category.color }]}>
                                {heir.badge}
                              </Text>
                            </View>
                          )}
                        </View>
                        
                        {heir.shareInfo && (
                          <Text style={styles.heirShareInfo}>{heir.shareInfo}</Text>
                        )}

                        <View style={styles.heirControls}>
                          <TouchableOpacity
                            style={[styles.controlButton, count === 0 && styles.controlButtonDisabled]}
                            onPress={() => updateHeirCount(heir.key, -1)}
                            disabled={count === 0}
                          >
                            <MaterialCommunityIcons name="minus" size={16} color={count === 0 ? '#ccc' : '#666'} />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              // Simple tap to increment
                              updateHeirCount(heir.key, 1);
                            }}
                            onLongPress={() => {
                              // Long press to show input for direct number entry
                              Alert.prompt(
                                'تعديل العدد',
                                `أدخل العدد الجديد لـ ${heir.label}`,
                                [
                                  { text: 'إلغاء', onPress: () => {} },
                                  {
                                    text: 'موافق',
                                    onPress: (text) => {
                                      if (text) handleCountInput(heir.key, text);
                                    }
                                  }
                                ],
                                'plain-text',
                                count.toString(),
                                'numeric'
                              );
                            }}
                          >
                            <View style={styles.countContainer}>
                              <Text style={styles.countText}>{count}</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.controlButton,
                              styles.controlButtonAdd,
                              hasMaxCount(heir) && count >= heir.maxCount && styles.controlButtonDisabled
                            ]}
                            onPress={() => updateHeirCount(heir.key, 1)}
                            disabled={hasMaxCount(heir) ? count >= heir.maxCount : false}
                          >
                            <MaterialCommunityIcons 
                              name="plus" 
                              size={16} 
                              color={hasMaxCount(heir) && count >= heir.maxCount ? '#ccc' : theme.colors.primary.main} 
                            />
                          </TouchableOpacity>
                        </View>

                        {hasMaxCount(heir) && (
                          <Text style={[
                            styles.maxWarning,
                            count >= heir.maxCount && styles.maxWarningReached
                          ]}>
                            الحد الأقصى: {heir.maxCount} {count >= heir.maxCount ? '(اكتمل)' : ''}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    // ===== FIX H2: Validation banner styles =====
    validationBanner: {
      backgroundColor: theme.colors.error.main,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      gap: 8,
    },
    validationText: {
      color: '#fff',
      fontSize: 13,
      fontWeight: '500',
      flex: 1,
      textAlign: 'right',
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.neutral.light200,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.neutral.light100,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    searchInput: {
      flex: 1,
      marginHorizontal: 8,
      fontSize: 14,
      color: theme.colors.neutral.dark300,
      textAlign: 'right',
      paddingVertical: 0,
    },
    summaryContainer: {
      backgroundColor: '#fff',
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.neutral.light200,
    },
    summaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    summaryTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.neutral.dark300,
    },
    clearAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    clearAllText: {
      fontSize: 12,
      color: theme.colors.error.main,
    },
    summaryStats: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    statItem: {
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    statValue: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.primary.main,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.neutral.dark200,
    },
    statDivider: {
      width: 1,
      height: 30,
      backgroundColor: theme.colors.neutral.light200,
    },
    selectedList: {
      flexDirection: 'row',
    },
    selectedChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary.light,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginRight: 8,
      gap: 6,
    },
    selectedChipText: {
      fontSize: 12,
      color: theme.colors.primary.main,
      fontWeight: '500',
    },
    categoriesContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    categoryCard: {
      backgroundColor: '#fff',
      borderRadius: 16,
      marginBottom: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#fff',
    },
    categoryIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    categoryTitleContainer: {
      flex: 1,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.neutral.dark300,
      textAlign: 'right',
    },
    categoryNameEn: {
      fontSize: 12,
      color: theme.colors.neutral.dark200,
      textAlign: 'right',
    },
    heirsGrid: {
      padding: 16,
      paddingTop: 0,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    heirCard: {
      width: '48%',
      backgroundColor: theme.colors.neutral.light100,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
    },
    heirInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    heirName: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.neutral.dark300,
    },
    heirBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    heirBadgeText: {
      fontSize: 9,
      fontWeight: '600',
    },
    heirShareInfo: {
      fontSize: 10,
      color: theme.colors.neutral.dark200,
      marginBottom: 10,
    },
    heirControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    controlButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
    },
    controlButtonAdd: {
      backgroundColor: `${theme.colors.primary.main}10`,
      borderColor: theme.colors.primary.main,
    },
    controlButtonDisabled: {
      opacity: 0.5,
    },
    countContainer: {
      minWidth: 40,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    countText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.primary.main,
    },
    maxWarning: {
      fontSize: 9,
      color: theme.colors.warning.main,
      marginTop: 6,
      textAlign: 'center',
    },
    maxWarningReached: {
      color: theme.colors.success.main,
      fontWeight: '600',
    },
  });

export default HeirSelector;