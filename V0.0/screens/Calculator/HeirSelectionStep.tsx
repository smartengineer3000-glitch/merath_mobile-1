import { KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { HeirCategoryCard } from '../../components/HeirCategoryCard';
import { Button } from '../../components/ui/Button';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCalculationContext } from '../../lib/context/CalculationContext';
import { HeirType } from '../../lib/inheritance/types';

const categories: { title: string; types: HeirType[] }[] = [
  { title: 'Spouse', types: ['husband', 'wife'] },
  { title: 'Children', types: ['son', 'daughter'] },
  { title: 'Parents', types: ['father', 'mother'] },
  { title: 'Grandparents', types: ['grandfather', 'grandmother_mother'] },
  { title: 'Siblings', types: ['full_brother', 'full_sister', 'paternal_brother', 'paternal_sister'] },
];

export const HeirSelectionStep = ({ navigation }: any) => {
  const theme = useAppTheme();
  const { state, dispatch } = useCalculationContext();
  const [selectedHeirs, setSelectedHeirs] = useState<Record<HeirType, number>>(
    state.heirs.reduce((acc, h) => ({ ...acc, [h.type]: h.count }), {} as Record<HeirType, number>)
  );

  const handleChange = (type: HeirType, newCount: number) => {
    if (newCount <= 0) {
      const updated = { ...selectedHeirs };
      delete updated[type];
      setSelectedHeirs(updated);
    } else {
      setSelectedHeirs({ ...selectedHeirs, [type]: newCount });
    }
  };

  const onNext = () => {
    const heirsArray = Object.entries(selectedHeirs)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => ({ type: type as HeirType, count }));
    dispatch({ type: 'SET_HEIRS', payload: heirsArray });
    navigation.navigate('Results');
  };

  const allHeirsForHijab = Object.entries(selectedHeirs)
    .filter(([_, c]) => c > 0)
    .map(([type, count]) => ({ type: type as HeirType, count }));

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}><ScrollView contentContainerStyle={{ padding: theme.spacing.md }}>
      <Text style={[theme.typography.headlineSmall, { marginBottom: theme.spacing.md }]}>
        Add Family Members
      </Text>
      {categories.map((cat) => {
        const heirsInCategory = cat.types.map((t) => ({
          type: t,
          label: t.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          count: selectedHeirs[t] || 0,
        }));
        return (
          <HeirCategoryCard
            key={cat.title}
            categoryTitle={cat.title}
            heirs={heirsInCategory}
            allSelectedHeirs={allHeirsForHijab}
            madhab={state.madhab}
            onHeirChange={handleChange}
          />
        );
      })}
      <Button mode="contained" onPress={onNext} style={{ marginTop: theme.spacing.lg }}>
        Calculate Inheritance
      </Button>
    </ScrollView></KeyboardAvoidingView>
  );
};
