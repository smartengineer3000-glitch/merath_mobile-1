/**
 * @file components/ui/Button.tsx
 * @description Enhanced Material Design 3 button component
 * Professional button system with multiple variants, sizes, and icon support
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '../../lib/icons';
import { useTheme } from '../../lib/design/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ModernButtonProps {
  /** Button text */
  title: string;
  /** Press handler */
  onPress: () => void;
  /** Button style variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state (shows spinner) */
  loading?: boolean;
  /** Icon name from MaterialCommunityIcons */
  icon?: string;
  /** Icon position (left/right) */
  iconPosition?: 'left' | 'right';
  /** Take full width of container */
  fullWidth?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = (): { backgroundColor: string; borderColor?: string; textColor: string } => {
    const baseColor = theme.colors.primary.main;
    const secondaryColor = theme.colors.secondary?.main || '#6B7280';
    const errorColor = theme.colors.error?.main || '#EF4444';

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? '#BDBDBD' : baseColor,
          textColor: '#FFFFFF',
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? '#E0E0E0' : secondaryColor,
          textColor: '#FFFFFF',
        };
      case 'tertiary':
        return {
          backgroundColor: 'transparent',
          textColor: baseColor,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: disabled ? '#BDBDBD' : baseColor,
          textColor: disabled ? '#BDBDBD' : baseColor,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          textColor: disabled ? '#BDBDBD' : theme.colors.neutral?.dark300 || '#1F2937',
        };
      case 'danger':
        return {
          backgroundColor: disabled ? '#FFCCCC' : errorColor,
          textColor: '#FFFFFF',
        };
      default:
        return {
          backgroundColor: baseColor,
          textColor: '#FFFFFF',
        };
    }
  };

  const getSizeStyles = (): { 
    paddingVertical: number; 
    paddingHorizontal: number; 
    fontSize: number;
    iconSize: number;
    borderRadius: number;
  } => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing?.sm || 8,
          paddingHorizontal: theme.spacing?.md || 12,
          fontSize: 12,
          iconSize: 16,
          borderRadius: theme.borderRadius?.sm || 8,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing?.lg || 16,
          paddingHorizontal: theme.spacing?.xl || 24,
          fontSize: 16,
          iconSize: 24,
          borderRadius: theme.borderRadius?.lg || 16,
        };
      case 'medium':
      default:
        return {
          paddingVertical: theme.spacing?.md || 12,
          paddingHorizontal: theme.spacing?.lg || 16,
          fontSize: 14,
          iconSize: 20,
          borderRadius: theme.borderRadius?.md || 12,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const buttonStyles: ViewStyle = {
    paddingVertical: sizeStyles.paddingVertical,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius: sizeStyles.borderRadius,
    backgroundColor: variantStyles.backgroundColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.6 : 1,
    ...(variant === 'outline' && {
      borderWidth: 1.5,
      borderColor: variantStyles.borderColor,
    }),
    ...(fullWidth && { width: '100%' }),
    ...style,
  };

  const textStyles: TextStyle = {
    fontSize: sizeStyles.fontSize,
    fontWeight: '600',
    color: variantStyles.textColor,
    textAlign: 'center',
    ...textStyle,
  };

  const iconColor = variantStyles.textColor;

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={variantStyles.textColor} size="small" />;
    }

    const iconElement = icon ? (
      <MaterialCommunityIcons
        name={icon as any}
        size={sizeStyles.iconSize}
        color={iconColor}
      />
    ) : null;

    if (icon && iconPosition === 'left') {
      return (
        <>
          {iconElement}
          <Text style={[textStyles, { marginLeft: 8 }]}>{title}</Text>
        </>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          <Text style={[textStyles, { marginRight: 8 }]}>{title}</Text>
          {iconElement}
        </>
      );
    }

    return <Text style={textStyles}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={buttonStyles}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // Base styles are handled dynamically
  },
  text: {
    // Base styles are handled dynamically
  },
});

export default ModernButton;