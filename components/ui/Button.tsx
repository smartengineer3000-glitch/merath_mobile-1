/**
 * @file components/ui/Button.tsx
 * @description Modern Material Design 3 button component
 * Replaces generic buttons with professional styling
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../lib/design/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ModernButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}) => {
  const { theme } = useTheme();

  const getSizeStyles = (): { padding: number; fontSize: number } => {
    switch (size) {
      case 'small':
        return { padding: theme.spacing.sm, fontSize: 12 };
      case 'large':
        return { padding: theme.spacing.lg, fontSize: 16 };
      case 'medium':
      default:
        return { padding: theme.spacing.md, fontSize: 14 };
    }
  };

  const getVariantStyles = (): { backgroundColor: string; color: string } => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? '#BDBDBD' : theme.colors.primary.main,
          color: '#FFFFFF',
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? '#E0E0E0' : theme.colors.secondary.main,
          color: '#FFFFFF',
        };
      case 'tertiary':
        return {
          backgroundColor: 'transparent',
          color: theme.colors.primary.main,
        };
      case 'danger':
        return {
          backgroundColor: disabled ? '#FFCCCC' : theme.colors.error.main,
          color: '#FFFFFF',
        };
      default:
        return {
          backgroundColor: theme.colors.primary.main,
          color: '#FFFFFF',
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const buttonStyle: ViewStyle = {
    paddingVertical: sizeStyles.padding,
    paddingHorizontal: sizeStyles.padding * 1.5,
    borderRadius: theme.borderRadius.md,
    backgroundColor: variantStyles.backgroundColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.6 : 1,
    ...(fullWidth && { width: '100%' }),
    ...(variant === 'tertiary' && {
      borderWidth: 1,
      borderColor: theme.colors.primary.main,
    }),
  };

  const textStyle: TextStyle = {
    fontSize: sizeStyles.fontSize,
    fontWeight: '600',
    color: variantStyles.color,
    marginLeft: icon ? theme.spacing.sm : 0,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[buttonStyle, style]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.color} />
      ) : (
        <>
          {icon}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});

export default ModernButton;
