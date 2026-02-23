/**
 * @file CalculatorScreen.tsx
 * @description الشاشة الرئيسية للآلة الحاسبة
 * Main Calculator Screen for Phase 5
 * 
 * تنسيق وتنظيم جميع المكونات معاً
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import EstateInput from '../components/EstateInput';
import HeirSelector from '../components/HeirSelector';
import MadhhabSelector from '../components/MadhhabSelector';
import CalculationButton from '../components/CalculationButton';
import ResultsDisplay from '../components/ResultsDisplay';
import CalculationHistory from '../components/CalculationHistory';
import type { EstateData, HeirsData, MadhhabType } from '../lib/inheritance/types';

export interface CalculatorScreenProps {
  onNavigate?: (screen: string) => void;
}

type ScreenMode = 'calculator' | 'history';

/**
 * الشاشة الرئيسية للآلة الحاسبة
 * Main orchestration screen combining all components
 */
export function CalculatorScreen({ onNavigate }: CalculatorScreenProps) {
  const [screenMode, setScreenMode] = useState<ScreenMode>('calculator');
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<string | null>(null);
  
  // State for calculation inputs
  const [estateData, setEstateData] = useState<EstateData>({ total: 0, funeral: 0, debts: 0, will: 0 });
  const [heirsData, setHeirsData] = useState<HeirsData>({});
  const [madhab, setMadhab] = useState<MadhhabType>('hanafi');

  // Check if calculation is possible
  const canCalculate = useMemo(() => {
    const hasEstate = estateData && estateData.total > 0;
    const hasHeirs = heirsData && Object.values(heirsData).some(count => count && count > 0);
    return hasEstate && hasHeirs;
  }, [estateData, heirsData]);

  const handleHistoryEntrySelect = useCallback((entryId: string) => {
    setSelectedHistoryEntry(entryId);
  }, []);

  const handleCalculationComplete = useCallback(() => {
    // Smooth transition to results
  }, []);

  const handleEstateChange = useCallback((estate: EstateData) => {
    setEstateData(estate);
  }, []);

  const handleHeirsChange = useCallback((heirs: HeirsData) => {
    setHeirsData(heirs);
  }, []);

  const handleMadhhabChange = useCallback((newMadhab: MadhhabType) => {
    setMadhab(newMadhab);
  }, []);

  const handleResetAll = useCallback(() => {
    Alert.alert(
      'مسح النموذج',
      'هل تريد مسح جميع البيانات المدخلة وإعادة تعيين الحاسبة؟',
      [
        { text: 'إلغاء', onPress: () => {} },
        {
          text: 'مسح',
          onPress: () => {
            setEstateData({ total: 0, funeral: 0, debts: 0, will: 0 });
            setHeirsData({});
            setMadhab('hanafi');
            Alert.alert('تم', 'تم مسح جميع البيانات بنجاح');
          }
        }
      ]
    );
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* رأس الشاشة مع علامات التبويب */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>حاسبة المواريث الإسلامية</Text>
          <Text style={styles.headerSubtitle}>Islamic Inheritance Calculator</Text>

          {/* علامات التبويب */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[
                styles.tab,
                screenMode === 'calculator' && styles.tabActive
              ]}
              onPress={() => setScreenMode('calculator')}
            >
              <Text style={[
                styles.tabText,
                screenMode === 'calculator' && styles.tabTextActive
              ]}>
                حاسبة
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                screenMode === 'history' && styles.tabActive
              ]}
              onPress={() => setScreenMode('history')}
            >
              <Text style={[
                styles.tabText,
                screenMode === 'history' && styles.tabTextActive
              ]}>
                السجل
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* محتوى الشاشة */}
        {screenMode === 'calculator' ? (
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {/* قسم المذهب */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>اختر المذهب الإسلامي</Text>
              </View>
              <MadhhabSelector onMadhhabChange={handleMadhhabChange} />
            </View>

            {/* قسم البيانات المالية */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>بيانات التركة</Text>
              </View>
              <EstateInput onEstateChange={handleEstateChange} initialEstate={estateData} />
            </View>

            {/* قسم الوارثون */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>إضافة الوارثون</Text>
              </View>
              <HeirSelector onHeirsChange={handleHeirsChange} />
            </View>

            {/* Buttons Section */}
            <View style={styles.buttonsSection}>
              <TouchableOpacity
                style={[styles.calculateBtn, !canCalculate && styles.calculateBtnDisabled]}
                onPress={() => {}} // Connected to CalculationButton below
                disabled={!canCalculate}
              >
                <Text style={styles.calculateBtnText}>
                  {canCalculate ? '✓ حساب الميراث' : '⚠️ أكمل البيانات أولاً'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={handleResetAll}
              >
                <Text style={styles.resetBtnText}>↺ مسح الكل</Text>
              </TouchableOpacity>
            </View>

            {/* زر الحساب */}
            <View style={styles.section}>
              <CalculationButton
                madhab={madhab}
                heirs={heirsData}
                estate={estateData}
                onCalculationComplete={handleCalculationComplete}
              />
            </View>

            {/* قسم النتائج */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>النتائج والتوزيع</Text>
              </View>
              <ResultsDisplay />
            </View>

            {/* مساحة فارغة في النهاية */}
            <View style={{ height: 20 }} />
          </ScrollView>
        ) : (
          <View style={styles.historyContent}>
            <CalculationHistory onEntrySelect={handleHistoryEntrySelect} />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginHorizontal: -16
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    alignItems: 'center'
  },
  tabActive: {
    borderBottomColor: '#1976d2',
    backgroundColor: '#f5f5f5'
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666'
  },
  tabTextActive: {
    color: '#1976d2',
    fontWeight: '700'
  },
  content: {
    flex: 1,
    paddingTop: 16
  },
  historyContent: {
    flex: 1
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  sectionHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right'
  },
  buttonsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
    flexDirection: 'column'
  },
  calculateBtn: {
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#388e3c'
  },
  calculateBtnDisabled: {
    backgroundColor: '#cccccc',
    borderColor: '#aaaaaa'
  },
  calculateBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700'
  },
  resetBtn: {
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f57c00'
  },
  resetBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  }
});

export default CalculatorScreen;
