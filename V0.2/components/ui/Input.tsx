import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

type InputProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  style?: object;
};

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  error,
  helper,
  leftIcon,
  style,
}) => {
  const theme = useAppTheme();
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? theme.colors.error
    : focused
    ? theme.colors.primary
    : theme.colors.outline;

  return (
    <View style={[{ marginBottom: theme.spacing.md }, style]}>
      {label && (
        <Text style={[theme.typography.labelLarge, { color: theme.colors.onSurface, marginBottom: theme.spacing.xs }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputRow,
          {
            borderColor,
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: theme.radius.sm,
            borderWidth: 1,
          },
        ]}
      >
        {leftIcon && <View style={{ marginRight: theme.spacing.sm }}>{leftIcon}</View>}
        <TextInput
          style={[
            theme.typography.bodyLarge,
            { flex: 1, color: theme.colors.onSurface, paddingVertical: theme.spacing.sm },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {error ? (
        <Text style={[theme.typography.bodySmall, { color: theme.colors.error, marginTop: 4 }]}>{error}</Text>
      ) : helper ? (
        <Text style={[theme.typography.bodySmall, { color: theme.colors.onSurfaceVariant, marginTop: 4 }]}>{helper}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
});
