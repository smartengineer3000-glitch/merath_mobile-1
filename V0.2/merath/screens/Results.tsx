import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useCalc } from '../lib/context/CalcContext';
import { calculateInheritance } from '../lib/engine/calculator';
import { useAppTheme } from '../hooks/useAppTheme';
import { ExportBar } from '../components/ExportBar';
import { ResultsSkeleton } from '../components/SkeletonCard';
import { Button } from '../components/ui/Button';

export const Results = ({ navigation }: any) => {
  const { state } = useCalc();
  const theme = useAppTheme();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const estate = { total: state.total, funeral: state.funeral, debts: state.debts, will: state.will };
      const res = calculateInheritance(state.madhab, estate, state.heirs);
      setResult(res);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <ResultsSkeleton />;

  return (
    <ExportBar resultData={result}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
        <View style={{ backgroundColor: theme.colors.primary, borderRadius: theme.radius.lg, padding: theme.spacing.lg, alignItems: 'center', marginBottom: theme.spacing.lg }}>
          <Text style={{ color: theme.colors.onPrimary, fontSize: 24 }}>Net Estate</Text>
          <Text style={{ color: theme.colors.onPrimary, fontSize: 48 }}>${result.netTotal.toLocaleString()}</Text>
        </View>
        <Text style={theme.typography.h2}>Distribution</Text>
        {result.shares.map((share: any, idx: number) => (
          <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderColor: theme.colors.outline }}>
            <Text style={theme.typography.body}>{share.name} ({share.fraction.numerator}/{share.fraction.denominator})</Text>
            <Text style={theme.typography.body}>${share.amount.toFixed(2)}</Text>
          </View>
        ))}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: theme.spacing.lg }}>
          <Button title="Compare Schools" onPress={() => navigation.navigate('Comparison')} mode="outlined" />
          <Button title="Settings" onPress={() => navigation.navigate('Settings')} mode="outlined" />
        </View>
      </ScrollView>
    </ExportBar>
  );
};
