import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

type StepperProps = {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  label?: string;
};

export const Stepper: React.FC<StepperProps> = ({
  value,
  onIncrease,
  onDecrease,
  min = 0,
  max = 20,
  label,
}) => {
  const theme = useAppTheme();
  return (
    <View style={styles.container}>
      {label && <Text style={[theme.typography.labelLarge, { color: theme.colors.onSurface }]}>{label}</Text>}
      <View style={styles.row}>
        <TouchableOpacity
          onPress={onDecrease}
          disabled={value <= min}
          style={[
            styles.button,
            { backgroundColor: theme.colors.surfaceVariant, opacity: value <= min ? 0.4 : 1 },
          ]}
          accessibilityLabel="Decrease"
        >
          <Text style={[theme.typography.titleMedium, { color: theme.colors.onSurface }]}>−</Text>
        </TouchableOpacity>
        <Text style={[theme.typography.headlineSmall, { marginHorizontal: theme.spacing.md }]}>{value}</Text>
        <TouchableOpacity
          onPress={onIncrease}
          disabled={value >= max}
          style={[
            styles.button,
            { backgroundColor: theme.colors.surfaceVariant, opacity: value >= max ? 0.4 : 1 },
          ]}
          accessibilityLabel="Increase"
        >
          <Text style={[theme.typography.titleMedium, { color: theme.colors.onSurface }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
