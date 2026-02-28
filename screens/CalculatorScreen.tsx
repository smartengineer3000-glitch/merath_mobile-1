/**
 * @file screens/CalculatorScreen.tsx
 * @description Professional calculator screen with proper visual hierarchy
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '../lib/icons';
import { useTheme } from '../lib/design/theme';
import { useCalculator, useMadhab, useHeirs, useAuditLog, useResults } from '../lib/inheritance/hooks';
import MadhhabSelector from '../components/MadhhabSelector';
import EstateInput from '../components/EstateInput';
import HeirSelector from '../components/HeirSelector';
import ResultsDisplay from '../components/ResultsDisplay';

export default function CalculatorScreen() {
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  
  // Hooks
  const { madhab, changeMadhab } = useMadhab('hanafi');
  const { estateData, updateEstateData } = useCalculator();
  const { heirs, clearHeirs } = useHeirs();
  const { previousResults } = useResults();
  
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const scrollToSection = useCallback((section: string) => {
    const positions: Record<string, number> = {
      madhab: 0,
      estate: 250,
      heirs: 500,
    };
    
    scrollViewRef.current?.scrollTo({
      y: positions[section] || 0,
      animated: true,
    });
  }, []);

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Progress Header */}
        <View style={styles.progressHeader}>
          <View style={styles.progressItem}>
            <View style={[styles.progressDot, madhab && styles.progressDotActive]} />
            <Text style={styles.progressText}>المذهب</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressItem}>
            <View style={[styles.progressDot, estateData.total > 0 && styles.progressDotActive]} />
            <Text style={styles.progressText}>التركة</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressItem}>
            <View style={[styles.progressDot, heirs.length > 0 && styles.progressDotActive]} />
            <Text style={styles.progressText}>الورثة</Text>
          </View>
        </View>

        <Animated.ScrollView
          ref={scrollViewRef}
          style={[styles.scrollView, { opacity: fadeAnim }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <MaterialCommunityIcons name="scale-balance" size={48} color={theme.colors.primary.main} />
            <Text style={styles.heroTitle}>حاسبة المواريث الشرعية</Text>
            <Text style={styles.heroSubtitle}>Islamic Inheritance Calculator</Text>
          </View>

          {/* Madhab Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={[styles.sectionIcon, { backgroundColor: `${theme.colors.primary.main}20` }]}>
                  <MaterialCommunityIcons name="school" size={20} color={theme.colors.primary.main} />
                </View>
                <View>
                  <Text style={styles.sectionTitle}>اختر المذهب الفقهي</Text>
                  <Text style={styles.sectionSubtitle}>Select Islamic School</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => scrollToSection('madhab')}>
                <MaterialCommunityIcons name="chevron-down" size={24} color={theme.colors.neutral.dark200} />
              </TouchableOpacity>
            </View>
            <MadhhabSelector selectedMadhab={madhab} onSelect={changeMadhab} />
          </View>

          {/* Estate Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={[styles.sectionIcon, { backgroundColor: `${theme.colors.success.main}20` }]}>
                  <MaterialCommunityIcons name="currency-usd" size={20} color={theme.colors.success.main} />
                </View>
                <View>
                  <Text style={styles.sectionTitle}>بيانات التركة</Text>
                  <Text style={styles.sectionSubtitle}>Estate Details</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => scrollToSection('estate')}>
                <MaterialCommunityIcons name="chevron-down" size={24} color={theme.colors.neutral.dark200} />
              </TouchableOpacity>
            </View>
            <EstateInput onEstateChange={updateEstateData} initialEstate={estateData} />
          </View>

          {/* Heirs Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={[styles.sectionIcon, { backgroundColor: `${theme.colors.warning.main}20` }]}>
                  <MaterialCommunityIcons name="account-group" size={20} color={theme.colors.warning.main} />
                </View>
                <View>
                  <Text style={styles.sectionTitle}>الورثة</Text>
                  <Text style={styles.sectionSubtitle}>Heirs</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => scrollToSection('heirs')}>
                <MaterialCommunityIcons name="chevron-down" size={24} color={theme.colors.neutral.dark200} />
              </TouchableOpacity>
            </View>
            <HeirSelector />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.primaryButton}>
              <MaterialCommunityIcons name="calculator" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>حساب الميراث</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={clearHeirs}>
              <MaterialCommunityIcons name="refresh" size={20} color={theme.colors.primary.main} />
              <Text style={styles.secondaryButtonText}>إعادة تعيين</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Activity */}
          {previousResults.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={styles.recentTitle}>آخر العمليات</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {previousResults.slice(0, 3).map((result, index) => (
                  <TouchableOpacity key={index} style={styles.recentCard}>
                    <Text style={styles.recentMadhab}>{result.madhhabName}</Text>
                    <Text style={styles.recentAmount}>
                      {result.shares.reduce((s, sh) => s + sh.amount, 0).toFixed(0)} ر.س
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#F9FAFB',
    },
    container: {
      flex: 1,
    },
    progressHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    progressItem: {
      alignItems: 'center',
    },
    progressDot: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#E5E7EB',
      marginBottom: 4,
    },
    progressDotActive: {
      backgroundColor: theme.colors.primary.main,
    },
    progressText: {
      fontSize: 10,
      color: '#6B7280',
    },
    progressLine: {
      width: 40,
      height: 2,
      backgroundColor: '#E5E7EB',
      marginHorizontal: 8,
    },
    scrollView: {
      flex: 1,
    },
    heroSection: {
      alignItems: 'center',
      paddingVertical: 24,
      backgroundColor: '#fff',
      marginBottom: 8,
    },
    heroTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#1F2937',
      marginTop: 12,
      marginBottom: 4,
    },
    heroSubtitle: {
      fontSize: 14,
      color: '#6B7280',
    },
    section: {
      backgroundColor: '#fff',
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 20,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    sectionTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    sectionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
    },
    sectionSubtitle: {
      fontSize: 12,
      color: '#6B7280',
    },
    actionContainer: {
      flexDirection: 'row',
      marginHorizontal: 16,
      marginVertical: 16,
      gap: 12,
    },
    primaryButton: {
      flex: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary.main,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 16,
      gap: 8,
      shadowColor: theme.colors.primary.main,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    primaryButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.primary.main,
      gap: 8,
    },
    secondaryButtonText: {
      color: theme.colors.primary.main,
      fontSize: 14,
      fontWeight: '600',
    },
    recentSection: {
      marginHorizontal: 16,
      marginBottom: 24,
    },
    recentTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 12,
    },
    recentCard: {
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
      padding: 12,
      marginRight: 12,
      minWidth: 120,
    },
    recentMadhab: {
      fontSize: 12,
      color: '#6B7280',
      marginBottom: 4,
    },
    recentAmount: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1F2937',
    },
  });