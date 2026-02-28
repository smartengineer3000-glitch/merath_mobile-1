/**
 * @file components/MadhhabSelector.tsx
 * @description Professional Madhab selector with horizontal cards
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/design/theme';
import type { MadhhabType } from '../lib/inheritance/types';

const { width } = Dimensions.get('window');

interface MadhhabSelectorProps {
  selectedMadhab?: MadhhabType;
  onSelect: (madhab: MadhhabType) => void;
}

const MADHAB_DATA = [
  {
    id: 'hanafi' as MadhhabType,
    name: 'الحنفي',
    nameEn: 'Hanafi',
    icon: 'school',
    color: '#10B981',
    description: 'الإمام أبو حنيفة',
    scholars: 'أبو حنيفة النعمان',
    bgGradient: ['#10B981', '#059669'],
    rules: ['الجد مع الإخوة: مشاركة', 'رد الزوجات: نعم'],
  },
  {
    id: 'maliki' as MadhhabType,
    name: 'المالكي',
    nameEn: 'Maliki',
    icon: 'book-open-variant',
    color: '#8B5CF6',
    description: 'الإمام مالك',
    scholars: 'مالك بن أنس',
    bgGradient: ['#8B5CF6', '#7C3AED'],
    rules: ['الجد مع الإخوة: مشاركة', 'رد الزوجات: نعم'],
  },
  {
    id: 'shafii' as MadhhabType,
    name: 'الشافعي',
    nameEn: 'Shafi\'i',
    icon: 'lightbulb-on',
    color: '#F59E0B',
    description: 'الإمام الشافعي',
    scholars: 'محمد بن إدريس الشافعي',
    bgGradient: ['#F59E0B', '#D97706'],
    rules: ['الجد مع الإخوة: حجب', 'رد الزوجات: لا'],
  },
  {
    id: 'hanbali' as MadhhabType,
    name: 'الحنبلي',
    nameEn: 'Hanbali',
    icon: 'book',
    color: '#EF4444',
    description: 'الإمام أحمد',
    scholars: 'أحمد بن حنبل',
    bgGradient: ['#EF4444', '#DC2626'],
    rules: ['الجد مع الإخوة: حجب', 'رد الزوجات: لا'],
  },
];

export function MadhhabSelector({ selectedMadhab = 'hanafi', onSelect }: MadhhabSelectorProps) {
  const { theme } = useTheme();
  const [expandedInfo, setExpandedInfo] = useState<MadhhabType | null>(null);

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MADHAB_DATA.map((madhab) => {
          const isSelected = selectedMadhab === madhab.id;
          const isExpanded = expandedInfo === madhab.id;

          return (
            <TouchableOpacity
              key={madhab.id}
              style={[
                styles.card,
                isSelected && styles.selectedCard,
                { borderColor: madhab.color },
              ]}
              onPress={() => onSelect(madhab.id)}
              activeOpacity={0.9}
            >
              {/* Card Header with Icon */}
              <View style={[styles.cardHeader, { backgroundColor: madhab.color }]}>
                <MaterialCommunityIcons name={madhab.icon as any} size={28} color="#fff" />
              </View>

              {/* Card Content */}
              <View style={styles.cardContent}>
                <Text style={styles.madhabName}>{madhab.name}</Text>
                <Text style={styles.madhabNameEn}>{madhab.nameEn}</Text>
                
                <View style={styles.scholarContainer}>
                  <MaterialCommunityIcons name="account" size={12} color="#666" />
                  <Text style={styles.scholarText}>{madhab.scholars}</Text>
                </View>

                {/* Selected Indicator */}
                {isSelected && (
                  <View style={[styles.selectedBadge, { backgroundColor: madhab.color }]}>
                    <MaterialCommunityIcons name="check" size={14} color="#fff" />
                    <Text style={styles.selectedText}>مختار</Text>
                  </View>
                )}

                {/* Expand/Collapse Button */}
                <TouchableOpacity
                  style={styles.expandButton}
                  onPress={() => setExpandedInfo(isExpanded ? null : madhab.id)}
                >
                  <Text style={styles.expandButtonText}>
                    {isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                  </Text>
                  <MaterialCommunityIcons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={madhab.color}
                  />
                </TouchableOpacity>

                {/* Expanded Details */}
                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <View style={styles.ruleItem}>
                      <MaterialCommunityIcons name="check-circle" size={14} color={madhab.color} />
                      <Text style={styles.ruleText}>{madhab.rules[0]}</Text>
                    </View>
                    <View style={styles.ruleItem}>
                      <MaterialCommunityIcons name="check-circle" size={14} color={madhab.color} />
                      <Text style={styles.ruleText}>{madhab.rules[1]}</Text>
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    scrollContent: {
      paddingHorizontal: 16,
      gap: 12,
    },
    card: {
      width: width * 0.75,
      backgroundColor: '#fff',
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: 'transparent',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    selectedCard: {
      borderWidth: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    cardHeader: {
      paddingVertical: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContent: {
      padding: 16,
    },
    madhabName: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1F2937',
      textAlign: 'right',
      marginBottom: 2,
    },
    madhabNameEn: {
      fontSize: 14,
      color: '#6B7280',
      textAlign: 'right',
      marginBottom: 12,
    },
    scholarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 16,
    },
    scholarText: {
      fontSize: 12,
      color: '#6B7280',
    },
    selectedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      marginBottom: 12,
      alignSelf: 'flex-start',
    },
    selectedText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    expandButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
      marginTop: 8,
    },
    expandButtonText: {
      fontSize: 12,
      color: '#6B7280',
    },
    expandedContent: {
      marginTop: 12,
      gap: 8,
    },
    ruleItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    ruleText: {
      fontSize: 12,
      color: '#4B5563',
      flex: 1,
    },
  });

export default MadhhabSelector;