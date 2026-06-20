/**
 * @file components/MadhhabSelector.tsx
 * @description Compact Madhab selector with dropdown alternative
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../lib/context/ThemeProvider';
import type { Theme } from '../lib/design/theme';
import type { MadhhabType } from '../lib/inheritance/types';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface MadhhabSelectorProps {
  selectedMadhab?: MadhhabType;
  onSelect: (madhab: MadhhabType) => void;
}

const MADHAB_DATA: { id: MadhhabType; name: string; nameEn: string; icon: IconName; color: string }[] = [
  { id: 'hanafi', name: 'الحنفي', nameEn: 'Hanafi', icon: 'school', color: '#10B981' },
  { id: 'maliki', name: 'المالكي', nameEn: 'Maliki', icon: 'book-open-variant', color: '#8B5CF6' },
  { id: 'shafii', name: 'الشافعي', nameEn: 'Shafi\'i', icon: 'lightbulb-on', color: '#F59E0B' },
  { id: 'hanbali', name: 'الحنبلي', nameEn: 'Hanbali', icon: 'book', color: '#EF4444' },
];

export function MadhhabSelector({ selectedMadhab = 'hanafi', onSelect }: MadhhabSelectorProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  // Option 1: Compact Grid (2x2)
  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {MADHAB_DATA.map((madhab) => {
          const isSelected = selectedMadhab === madhab.id;
          
          return (
            <TouchableOpacity
              key={madhab.id}
              style={[
                styles.gridItem,
                isSelected && styles.gridItemSelected,
                { borderColor: madhab.color }
              ]}
              onPress={() => onSelect(madhab.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${madhab.color}15` }]}>
                <MaterialCommunityIcons name={madhab.icon} size={20} color={madhab.color} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.madhabName}>{madhab.name}</Text>
                <Text style={styles.madhabNameEn}>{madhab.nameEn}</Text>
              </View>
              {isSelected && (
                <View style={[styles.selectedBadge, { backgroundColor: madhab.color }]}>
                  <MaterialCommunityIcons name="check" size={12} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    // Compact Grid Style (2x2)
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 8,
    },
    gridItem: {
      width: '48%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.light,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
      position: 'relative',
    },
    gridItemSelected: {
      borderWidth: 2,
      backgroundColor: theme.colors.background.lightVariant,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    textContainer: {
      flex: 1,
    },
    madhabName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.neutral.dark300,
      marginBottom: 2,
    },
    madhabNameEn: {
      fontSize: 10,
      color: theme.colors.neutral.dark200,
    },
    selectedBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      width: 18,
      height: 18,
      borderRadius: 9,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default MadhhabSelector;