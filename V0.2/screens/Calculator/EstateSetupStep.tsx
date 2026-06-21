import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useCalculationContext } from '../../lib/context/CalculationContext';

export const EstateSetupStep = ({ navigation }: any) => {
  const theme = useAppTheme();
  const { dispatch } = useCalculationContext();
  const [total, setTotal] = useState('');
  const [debts, setDebts] = useState('');
  const [funeral, setFuneral] = useState('');
  const [will, setWill] = useState('');

  const netEstate = parseFloat(total || '0') - parseFloat(debts || '0') - parseFloat(funeral || '0');
  const maxWill = netEstate / 3;
  const willError = parseFloat(will) > maxWill && maxWill >= 0 ? 'Exceeds 1/3 of net estate' : '';

  const handleNext = () => {
    dispatch({
      type: 'SET_ESTATE',
      payload: {
        total: parseFloat(total) || 0,
        debts: parseFloat(debts) || 0,
        funeral: parseFloat(funeral) || 0,
        will: parseFloat(will) || 0,
      },
    });
    navigation.navigate('MadhabSelect');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}><ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Text style={[theme.typography.headlineLarge, { marginBottom: theme.spacing.lg }]}>Estate Details</Text>

      <Input
        label="Total Estate ($)"
        value={total}
        onChangeText={setTotal}
        keyboardType="numeric"
        leftIcon={<Text style={theme.typography.bodyLarge}>$</Text>}
      />

      <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
        <Input
          style={{ flex: 1 }}
          label="Debts"
          value={debts}
          onChangeText={setDebts}
          keyboardType="numeric"
        />
        <Input
          style={{ flex: 1 }}
          label="Funeral Expenses"
          value={funeral}
          onChangeText={setFuneral}
          keyboardType="numeric"
        />
      </View>

      <Input
        label="Will (Optional)"
        value={will}
        onChangeText={setWill}
        keyboardType="numeric"
        helper={maxWill > 0 ? `Maximum allowed: $${maxWill.toFixed(2)}` : ''}
        error={willError}
      />

      <Button
        mode="contained"
        onPress={handleNext}
        style={{ marginTop: theme.spacing.xl }}
        disabled={!total || parseFloat(total) <= 0}
      >
        Next: Select School
      </Button>
    </ScrollView></KeyboardAvoidingView>
  );
};
