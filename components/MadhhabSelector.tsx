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
import { useTheme } from '../lib/design/theme';
import type { MadhhabType } from '../lib/inheritance/types';

interface MadhhabSelectorProps {
  selectedMadhab?: MadhhabType;
  onSelect: (madhab: MadhhabType) => void;
}

const MADHAB_DATA = [
  { id: 'hanafi' as MadhhabType, name: 'الحنفي', nameEn: 'Hanafi', icon: 'school', color: '#10B981' },
  { id: 'maliki' as MadhhabType, name: 'المالكي', nameEn: 'Maliki', icon: 'book-open-variant', color: '#8B5CF6' },
  { id: 'shafii' as MadhhabType, name: 'الشافعي', nameEn: 'Shafi\'i', icon: 'lightbulb-on', color: '#F59E0B' },
  { id: 'hanbali' as MadhhabType, name: 'الحنبلي', nameEn: 'Hanbali', icon: 'book', color: '#EF4444' },
];

export function MadhhabSelector({ selectedMadhab = 'hanafi', onSelect }: MadhhabSelectorProps) {
  const { theme } = useTheme();
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
                <MaterialCommunityIcons name={madhab.icon as any} size={20} color={madhab.color} />
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

      {/* Alternative: Dropdown Style (commented out - can switch if preferred) */}
      {/*
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.dropdownContent}>
          <View style={[styles.dropdownIcon, { backgroundColor: `${selected?.color}15` }]}>
            <MaterialCommunityIcons name={selected?.icon as any} size={20} color={selected?.color} />
          </View>
          <View>
            <Text style={styles.dropdownText}>{selected?.name}</Text>
            <Text style={styles.dropdownTextEn}>{selected?.nameEn}</Text>
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-down" size={20} color={theme.colors.neutral.dark200} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>اختر المذهب</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.neutral.dark200} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={MADHAB_DATA}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item.id);
                    setModalVisible(false);
                  }}
                >
                  <View style={[styles.modalItemIcon, { backgroundColor: `${item.color}15` }]}>
                    <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <View>
                    <Text style={styles.modalItemText}>{item.name}</Text>
                    <Text style={styles.modalItemTextEn}>{item.nameEn}</Text>
                  </View>
                  {selectedMadhab === item.id && (
                    <MaterialCommunityIcons name="check" size={20} color={item.color} style={styles.modalItemCheck} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      */}
    </View>
  );
}

const createStyles = (theme: any) =>
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
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
      position: 'relative',
    },
    gridItemSelected: {
      borderWidth: 2,
      backgroundColor: '#f8fafc',
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
    // Dropdown Style (commented out)
    dropdownButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
    },
    dropdownContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    dropdownIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dropdownText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.neutral.dark300,
    },
    dropdownTextEn: {
      fontSize: 10,
      color: theme.colors.neutral.dark200,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.neutral.light200,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.neutral.dark300,
    },
    modalItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.neutral.light100,
    },
    modalItemIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    modalItemText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.neutral.dark300,
    },
    modalItemTextEn: {
      fontSize: 11,
      color: theme.colors.neutral.dark200,
    },
    modalItemCheck: {
      marginLeft: 'auto',
    },
  });

export default MadhhabSelector;