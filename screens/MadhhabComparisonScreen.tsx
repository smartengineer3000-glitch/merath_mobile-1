import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../lib/context/ThemeProvider';
import { useCalculator } from '../lib/hooks/useCalculator';
import { Card } from '../components/ui/Card';
import type { Theme } from '../lib/design/theme';
import type { MadhhabType, CalculationResult } from '../lib/inheritance/types';

const ALL_MADHABS: MadhhabType[] = ['hanafi', 'shafii', 'maliki', 'hanbali'];

interface ComparisonEntry {
  madhab: MadhhabType;
  result: CalculationResult;
}

export default function MadhhabComparisonScreen() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { calculateWithMethod } = useCalculator();
  const [comparisonResults, setComparisonResults] = useState<ComparisonEntry[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const handleCompare = useCallback(async () => {
    try {
      setIsComparing(true);
      const comparisons: ComparisonEntry[] = [];
      for (const m of ALL_MADHABS) {
        const result = await calculateWithMethod(m, {});
        if (result) {
          comparisons.push({ madhab: m, result });
        }
      }
      setComparisonResults(comparisons);
    } catch (error) {
      Alert.alert(t('common.error'), t('comparison.failed'));
    } finally {
      setIsComparing(false);
    }
  }, [calculateWithMethod, t]);

  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('comparison.title')}</Text>
        <Text style={styles.subtitle}>{t('comparison.subtitle')}</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>{t('comparison.compare')}</Text>
        <Text style={styles.cardSubtitle}>{t('comparison.compareSubtitle')}</Text>
        <TouchableOpacity
          style={[styles.compareButton, isComparing && styles.compareButtonDisabled]}
          onPress={handleCompare}
          disabled={isComparing}
        >
          <MaterialCommunityIcons name="compare" size={24} color={theme.colors.background.light} />
          <Text style={styles.compareButtonText}>
            {isComparing ? t('comparison.comparing') : t('comparison.compareAcross')}
          </Text>
        </TouchableOpacity>
      </Card>

      {comparisonResults.length > 0 && (
        <Card style={styles.resultsCard}>
          <Text style={styles.resultsTitle}>{t('comparison.results')}</Text>
          {comparisonResults.map((comp, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.madhabName}>{comp.madhab.toUpperCase()}</Text>
              {comp.result.shares.map((share, si) => (
                <View key={si} style={styles.shareRow}>
                  <Text style={styles.shareName}>{share.name}</Text>
                  <Text style={styles.shareAmount}>
                    {share.percentage?.toFixed(2)}%
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.lightVariant,
      padding: 16,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.primary.main,
      fontFamily: 'Inter-Bold',
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.neutral.main,
      marginTop: 8,
      fontFamily: 'Inter-Regular',
    },
    card: {
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.neutral.dark300,
      marginBottom: 8,
    },
    cardSubtitle: {
      fontSize: 14,
      color: theme.colors.neutral.main,
      marginBottom: 16,
    },
    compareButton: {
      backgroundColor: theme.colors.primary.main,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 8,
    },
    compareButtonDisabled: {
      opacity: 0.6,
    },
    compareButtonText: {
      color: theme.colors.background.light,
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    resultsCard: {
      marginBottom: 16,
    },
    resultsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.neutral.dark300,
      marginBottom: 16,
    },
    resultItem: {
      marginBottom: 16,
      padding: 12,
      backgroundColor: theme.colors.background.light,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    madhabName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.primary.main,
      marginBottom: 8,
    },
    shareRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    shareName: {
      fontSize: 14,
      color: theme.colors.neutral.dark300,
    },
    shareAmount: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.primary.main,
    },
  });
