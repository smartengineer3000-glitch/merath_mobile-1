/**
 * @file ResultsScreen.tsx
 * @description عرض النتائج الكاملة مع المشاركة والمقارنة
 * Results Screen - Bottom Tab for accessing calculation results
 * 
 * FIXES:
 * - CRITICAL: Results now accessible from bottom tabs (not modal-locked in Calculator)
 * - HIGH: Results persist across tab navigation
 * - HIGH: Navigation flow: Calculator → Calculate → Results Tab → View/Share/Compare
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../lib/context/ThemeProvider';
import { useResults } from '../lib/hooks/useResults';
import { useCalculationScenario } from '../lib/context/CalculationContext';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { Card } from '../components/ui/Card';
import type { Theme } from '../lib/design/theme';

/**
 * ResultsScreen - Dedicated tab for viewing calculation results
 * 
 * Key features:
 * - Shows current/latest calculation result
 * - Persists across tab navigation via CalculationContext
 * - Allows viewing result history from previous calculations
 * - Integrated share and export functionality
 * - Accessible from any tab after first calculation
 */
export default function ResultsScreen() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { result, previousResults } = useResults();
  const { latestScenario } = useCalculationScenario();
  const styles = createStyles(theme);

  // Guide users if no results available
  useEffect(() => {
    if (!result && !previousResults?.length && !latestScenario) {
      // Silently show empty state - user will see it on screen
    }
  }, [result, previousResults, latestScenario]);

  // Empty state when no results
  if (!result && !previousResults?.length) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>{t('results.noResults')}</Text>
          <Text style={styles.emptyMessage}>
            {t('results.performCalculation')} استخدم تبويب &quot;الحاسبة&quot; أعلاه وأدخل بيانات التركة والورثة، ثم اضغط &quot;حساب&quot; لعرض النتائج هنا.
          </Text>
          
          <Card style={styles.helpCard}>
            <Text style={styles.helpTitle}>كيفية الاستخدام:</Text>
            <View style={styles.helpSteps}>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>انتقل إلى تبويب &quot;الحاسبة&quot;</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>أدخل إجمالي التركة والتكاليف</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepText}>اختر الورثة والمذهب</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>4</Text>
                <Text style={styles.stepText}>اضغط &quot;حساب&quot; لعرض النتائج</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>5</Text>
                <Text style={styles.stepText}>ستظهر النتائج هنا مع خيارات المشاركة</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    );
  }

  // Show results if available
  return (
    <View style={styles.container}>
      {result ? (
        <ResultsDisplay result={result} onClose={undefined} />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.lightVariant,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
      paddingTop: theme.spacing.xxxl,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: theme.spacing.md,
    },
    emptyTitle: {
      ...theme.typography.headline.medium,
      color: theme.colors.neutral.dark300,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    emptyMessage: {
      ...theme.typography.body.medium,
      color: theme.colors.neutral.main,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      lineHeight: 24,
    },
    helpCard: {
      marginBottom: theme.spacing.lg,
    },
    helpTitle: {
      ...theme.typography.headline.small,
      color: theme.colors.neutral.dark300,
      marginBottom: theme.spacing.md,
    },
    helpSteps: {
      gap: theme.spacing.sm,
    },
    step: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },
    stepNumber: {
      ...theme.typography.title.medium,
      color: theme.colors.primary.main,
      minWidth: 32,
      textAlign: 'center',
      paddingVertical: 2,
    },
    stepText: {
      ...theme.typography.body.small,
      color: theme.colors.neutral.dark200,
      flex: 1,
      paddingTop: 4,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      ...theme.typography.body.medium,
      color: theme.colors.neutral.main,
      marginTop: theme.spacing.md,
    },
  });
