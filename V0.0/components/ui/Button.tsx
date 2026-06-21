import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

type ButtonProps = {
  mode?: 'contained' | 'outlined' | 'text';
  onPress: () => void;
  children: string;
  loading?: boolean;
  disabled?: boolean;
  style?: object;
};

export const Button: React.FC<ButtonProps> = ({
  mode = 'contained',
  onPress,
  children,
  loading = false,
  disabled = false,
  style,
}) => {
  const theme = useAppTheme();
  const bg = mode === 'contained' ? theme.colors.primary : 'transparent';
  const border = mode === 'outlined' ? theme.colors.outline : 'transparent';
  const textColor = mode === 'contained' ? theme.colors.onPrimary : theme.colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: mode === 'outlined' ? 2 : 0,
          borderRadius: theme.radius.full,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[theme.typography.labelLarge, { color: textColor }]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};
