import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCalculationContext } from '../../lib/context/CalculationContext';
import { Madhab } from '../../lib/inheritance/types';

const madhabs: { key: Madhab; title: string; description: string }[] = [
  { key: 'hanafi', title: 'Hanafi', description: 'Uses mushārakah rules for grandfather with siblings' },
  { key: 'maliki', title: 'Maliki', description: 'Accurate rulings for all cases' },
  { key: 'shafii', title: 'Shafi\'i', description: 'Precise implementation of Shafi\'i school' },
  { key: 'hanbali', title: 'Hanbali', description: 'Full support for Hanbali jurisprudence' },
];

export const MadhabSelectStep = ({ navigation }: any) => {
  const theme = useAppTheme();
  const { dispatch } = useCalculationContext();

  const handleSelect = (madhab: Madhab) => {
    dispatch({ type: 'SET_MADHAB', payload: madhab });
    navigation.navigate('HeirSelection');
  };

  return (
    <FlatList
      contentContainerStyle={{ padding: theme.spacing.lg }}
      data={madhabs}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handleSelect(item.key)}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.md,
            padding: theme.spacing.md,
            marginBottom: theme.spacing.md,
            borderLeftWidth: 5,
            borderLeftColor: theme.colors.primary,
          }}
        >
          <Text style={[theme.typography.titleLarge, { color: theme.colors.primary }]}>{item.title}</Text>
          <Text style={[theme.typography.bodyMedium, { color: theme.colors.onSurfaceVariant }]}>
            {item.description}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};
