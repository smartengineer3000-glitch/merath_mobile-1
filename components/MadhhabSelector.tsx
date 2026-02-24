/**
 * @file MadhhabSelector.tsx
 * @description مكون اختيار المذهب الفقهي
 * Madhab Selector Component for Phase 5
 * 
 * اختيار أحد المذاهب الأربعة للحساب
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useMadhab } from '../lib/inheritance/hooks';
import { MadhhabType } from '../lib/inheritance/types';

const MADHABS_INFO = {
  hanafi: {
    name: 'الحنفي',
    description: 'مذهب أبي حنيفة',
    gradient: ['#dc2626', '#ef4444'],
    lightBg: '#fef2f2',
    darkColor: '#991b1b'
  },
  maliki: {
    name: 'المالكي',
    description: 'مذهب مالك بن أنس',
    gradient: ['#7c3aed', '#8b5cf6'],
    lightBg: '#faf5ff',
    darkColor: '#6b21a8'
  },
  shafii: {
    name: 'الشافعي',
    description: 'مذهب محمد بن إدريس الشافعي',
    gradient: ['#059669', '#10b981'],
    lightBg: '#ecfdf5',
    darkColor: '#065f46'
  },
  hanbali: {
    name: 'الحنبلي',
    description: 'مذهب أحمد بن حنبل',
    gradient: ['#0284c7', '#0ea5e9'],
    lightBg: '#eff6ff',
    darkColor: '#1e40af'
  }
};

export interface MadhhabSelectorProps {
  onMadhhabChange?: (madhab: MadhhabType) => void;
}

/**
 * مكون اختيار المذهب
 * Allows users to select Islamic school of law
 */
export function MadhhabSelector({ onMadhhabChange }: MadhhabSelectorProps) {
  const { madhab, changeMadhab, getMadhhabInfo } = useMadhab();

  useEffect(() => {
    onMadhhabChange?.(madhab as MadhhabType);
  }, [madhab, onMadhhabChange]);

  const handleMadhhabChange = useCallback((newMadhab: MadhhabType) => {
    changeMadhab(newMadhab);
    onMadhhabChange?.(newMadhab);
  }, [changeMadhab, onMadhhabChange]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>اختر المذهب الفقهي</Text>
      <Text style={styles.subtitle}>Select Islamic School of Law</Text>

      <View style={styles.madhhabsGrid}>
        {(Object.keys(MADHABS_INFO) as MadhhabType[]).map(madhhabKey => {
          const madhhabInfo = MADHABS_INFO[madhhabKey];
          const isSelected = madhab === madhhabKey;

          return (
            <TouchableOpacity
              key={madhhabKey}
              style={[
                styles.madhhabCard,
                isSelected && styles.madhhabCardActive,
                { borderColor: madhhabInfo.gradient[0] }
              ]}
              onPress={() => handleMadhhabChange(madhhabKey)}
            >
              <View
                style={[
                  styles.madhhabCardHeader,
                  isSelected && { backgroundColor: madhhabInfo.gradient[0] }
                ]}
              >
                <Text
                  style={[
                    styles.madhhabCardHeaderText,
                    isSelected && styles.madhhabCardHeaderTextActive
                  ]}
                >
                  {madhhabInfo.name}
                </Text>
              </View>

              <View style={styles.madhhabCardBody}>
                <Text style={styles.madhhabDescription}>{madhhabInfo.description}</Text>
                
                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.selectedIndicatorText}>✓ مختار</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* معلومات المذهب المختار */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>معلومات المذهب الحالي:</Text>
        <View style={styles.infoContent}>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>المذهب: </Text>
            <Text style={styles.infoValue}>{MADHABS_INFO[madhab as keyof typeof MADHABS_INFO]?.name}</Text>
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>الوصف: </Text>
            <Text style={styles.infoValue}>
              {MADHABS_INFO[madhab as keyof typeof MADHABS_INFO]?.description}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'right'
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    textAlign: 'right'
  },
  madhhabsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12
  },
  madhhabCard: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  madhhabCardActive: {
    borderWidth: 3,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
  },
  madhhabCardHeader: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    alignItems: 'center'
  },
  madhhabCardHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151'
  },
  madhhabCardHeaderTextActive: {
    color: '#fff'
  },
  madhhabCardBody: {
    padding: 12,
    alignItems: 'center'
  },
  madhhabDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500'
  },
  selectedIndicator: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#ecfdf5',
    borderRadius: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0'
  },
  selectedIndicatorText: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: '600'
  },
  infoContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'right'
  },
  infoContent: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12
  },
  infoItem: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 8,
    textAlign: 'right'
  },
  infoLabel: {
    fontWeight: '600',
    color: '#4F46E5'
  },
  infoValue: {
    color: '#333',
    fontWeight: '500'
  }
});

export default MadhhabSelector;
