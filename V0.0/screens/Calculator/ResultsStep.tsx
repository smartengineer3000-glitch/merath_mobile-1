import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useCalculationContext } from '../../lib/context/CalculationContext';
import { useAppTheme } from '../../hooks/useAppTheme';
import { calculateInheritance } from '../../lib/inheritance/calculateAdapter';
import { ConfidenceRing } from '../../components/ConfidenceRing';
import { ResultsSkeleton } from '../../components/SkeletonCard';
import { ExportBar } from '../../components/ExportBar';
import { useNavigation } from '@react-navigation/native';

export const ResultsStep = () => {
  const navigation = useNavigation();
  const { state } = useCalculationContext();
  const theme = useAppTheme();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const res = calculateInheritance({ ...state });
      setResult(res);
      setLoading(false);
    }, 600);
  }, []);

  if (loading) return <ResultsSkeleton />;
  if (!result) return <Text>Calculation failed</Text>;

  return (
    <ExportBar resultData={result}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
        <View style={{ backgroundColor: theme.colors.primary, borderRadius: theme.radius.xl, padding: theme.spacing.xl, alignItems: 'center', marginBottom: theme.spacing.lg }}>
          <Text style={[theme.typography.labelLarge, { color: theme.colors.onPrimary }]}>Net Estate</Text>
          <Text style={[theme.typography.displayLarge, { color: theme.colors.onPrimary, fontSize: 48 }]}>${result.netTotal.toLocaleString()}</Text>
        </View>

        <View style={{ backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.lg, marginBottom: theme.spacing.lg, alignItems: 'center', elevation: 3 }}>
          <Text style={[theme.typography.titleLarge, { marginBottom: theme.spacing.sm }]}>Calculation Confidence</Text>
          <ConfidenceRing score={result.confidence} />
          <Text style={[theme.typography.bodyMedium, { color: theme.colors.onSurfaceVariant, marginTop: theme.spacing.sm }]}>{result.confidenceExplanation}</Text>
        </View>

        <Text style={[theme.typography.headlineSmall, { marginBottom: theme.spacing.sm }]}>Distribution</Text>
        {result.shares.map((share: any) => (
          <View key={share.heirType} style={{ backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: theme.spacing.md, marginBottom: theme.spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: share.color || theme.colors.primary }}>
            <View>
              <Text style={theme.typography.titleMedium}>{share.label}</Text>
              <Text style={[theme.typography.bodySmall, { color: theme.colors.onSurfaceVariant }]}>{share.fraction} of estate</Text>
            </View>
            <Text style={[theme.typography.titleLarge, { color: theme.colors.primary }]}>${share.amount.toLocaleString()}</Text>
          </View>
        ))}

        <Text style={[theme.typography.headlineSmall, { marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm }]}>Calculation Steps</Text>
        {result.steps.map((step: string, index: number) => (
          <View key={index} style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
            <View style={{ alignItems: 'center', marginRight: theme.spacing.sm }}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: theme.colors.primary, marginTop: 4 }} />
              {index < result.steps.length - 1 && <View style={{ width: 2, flex: 1, backgroundColor: theme.colors.outlineVariant, marginVertical: 4 }} />}
            </View>
            <Text style={[theme.typography.bodyMedium, { flex: 1, color: theme.colors.onSurface }]}>{step}</Text>
          </View>
        ))}

        <TouchableOpacity onPress={() => (navigation as any).navigate('MadhhabComparison')} style={{ padding: 12, backgroundColor: theme.colors.secondary, borderRadius: 8, alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: 'white' }}>Compare All Madhhabs</Text>
        </TouchableOpacity>
      </ScrollView>
    </ExportBar>
  );
};
