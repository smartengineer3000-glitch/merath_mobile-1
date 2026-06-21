import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useCalculationContext } from '../lib/context/CalculationContext';
import { Madhab } from '../lib/inheritance/types';
import { calculateInheritance } from '../lib/inheritance/calculateAdapter';

const madhabs: Madhab[] = ['hanafi', 'maliki', 'shafii', 'hanbali'];

export const MadhhabComparisonScreen = () => {
  const theme = useAppTheme();
  const { state } = useCalculationContext();
  const [selected, setSelected] = useState<Madhab>('hanafi');

  const results = madhabs.map((m) => {
    const res = calculateInheritance({ ...state, madhab: m });
    return { ...res };
  });

  const activeResult = results.find((r) => r.madhab === selected);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Madhab Tabs */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: theme.spacing.md }}>
        {madhabs.map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => setSelected(m)}
            style={{
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
              borderRadius: 20,
              backgroundColor: selected === m ? theme.colors.primary : theme.colors.surface,
            }}
          >
            <Text style={{ color: selected === m ? theme.colors.onPrimary : theme.colors.onSurface }}>
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Result display for selected madhab */}
      {activeResult && (
        <FlatList
          data={activeResult.shares}
          keyExtractor={(item) => item.key as string}
          renderItem={({ item }) => (
            <View style={{ padding: theme.spacing.md, borderBottomWidth: 1, borderColor: theme.colors.outlineVariant }}>
              <Text style={theme.typography.titleMedium}>{item.name}</Text>
              <Text>${item.amount} ({item.fraction?.toString() || ""})</Text>
            </View>
          )}
          ListHeaderComponent={
            <View style={{ padding: theme.spacing.md }}>
              <Text style={theme.typography.headlineSmall}>Net Estate: ${activeResult.netEstate}</Text>
            </View>
          }
        />
      )}
    </View>
  );
};
