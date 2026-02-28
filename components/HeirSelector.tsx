/**
 * @file HeirSelector.tsx
 * @description Professional Heir Selection Component with Material Design 3
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
} from 'react-native';
import { MaterialCommunityIcons } from '../lib/icons';
import { useTheme } from '../lib/design/theme';
import type { HeirsData, HeirType } from '../lib/inheritance/types';

const { width } = Dimensions.get('window');

interface HeirSelectorProps {
  onHeirsChange?: (heirs: HeirsData) => void;
}

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
  const fadeAnim = useState(new Animated.Value(0))[0];

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

  const updateHeirCount = useCallback((heirKey: HeirType, delta: number) => {
    setHeirs(prev => {
      const newMap = new Map(prev);
      const currentCount = newMap.get(heirKey) || 0;
      const newCount = Math.max(0, currentCount + delta);
      
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
  }, [onHeirsChange]);

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
    setHeirs(new Map());
    onHeirsChange?.({});
  }, [onHeirsChange]);

  // Filter heirs based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return HEIR_CATEGORIES;
    
    const query = searchQuery.toLowerCase();
    return HEIR_CATEGORIES.map(category => ({
      ...category,
      heirs: category.heirs.filter(heir => 
        heir.label.includes(query) || 
        heir.labelEn.toLowerCase().includes(query)
      )
    })).filter(category => category.heirs.length > 0);
  }, [searchQuery]);

  const totalHeirs = useMemo(() => {
    let sum = 0;
    heirs.forEach(count => sum += count);
    return sum;
  }, [heirs]);

  const styles = createStyles(theme);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
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

                          <View style={styles.countContainer}>
                            <Text style={styles.countText}>{count}</Text>
                          </View>

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

                        {hasMaxCount(heir) && count >= heir.maxCount && (
                          <Text style={styles.maxWarning}>الحد الأقصى: {heir.maxCount}</Text>
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
      minWidth: 30,
      alignItems: 'center',
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
  });

export default HeirSelector;