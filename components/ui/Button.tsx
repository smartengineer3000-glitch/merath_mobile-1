/**
 * @file components/ui/Button.tsx
 * @description Enhanced Material Design 3 button component
 * Professional button system with multiple variants, sizes, and icon support
 * 
 * FIXES:
 * - L1 (🔵): Haptic feedback on button press
 */

import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '../../lib/icons';
import { useTheme } from '../../lib/design/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

// ===== FIX L1: Haptic feedback types =====
export type HapticFeedbackType = 
  | 'light' 
  | 'medium' 
  | 'heavy' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'none';

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
  /** ===== FIX L1: Haptic feedback type ===== */
  hapticFeedback?: HapticFeedbackType;
  /** Whether to play haptic on long press */
  hapticOnLongPress?: boolean;
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
  // ===== FIX L1: Haptic props with defaults =====
  hapticFeedback = 'light',
  hapticOnLongPress = false,
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

  // ===== FIX L1: Haptic feedback handler =====
  const triggerHaptic = useCallback((type: HapticFeedbackType) => {
    if (disabled || loading || type === 'none') return;
    
    // Check if haptics are available on this device
    if (Platform.OS === 'web') return; // Haptics not available on web
    
    try {
      switch (type) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } catch (error) {
      // Silently fail if haptics not available
      if (__DEV__) {
        console.log('Haptics not available:', error);
      }
    }
  }, [disabled, loading]);

  // ===== FIX L1: Press handler with haptic =====
  const handlePress = useCallback(() => {
    triggerHaptic(hapticFeedback);
    onPress();
  }, [onPress, hapticFeedback, triggerHaptic]);

  // ===== FIX L1: Long press handler with haptic =====
  const handleLongPress = useCallback(() => {
    if (hapticOnLongPress) {
      triggerHaptic(hapticFeedback === 'none' ? 'medium' : hapticFeedback);
    }
  }, [hapticOnLongPress, hapticFeedback, triggerHaptic]);

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
      onPress={handlePress}
      onLongPress={hapticOnLongPress ? handleLongPress : undefined}
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

// ===== FIX L1: Pre-configured button variants with haptics =====
export const PrimaryButton: React.FC<Omit<ModernButtonProps, 'variant'>> = (props) => (
  <ModernButton variant="primary" hapticFeedback="medium" {...props} />
);

export const SecondaryButton: React.FC<Omit<ModernButtonProps, 'variant'>> = (props) => (
  <ModernButton variant="secondary" hapticFeedback="light" {...props} />
);

export const DangerButton: React.FC<Omit<ModernButtonProps, 'variant'>> = (props) => (
  <ModernButton variant="danger" hapticFeedback="heavy" {...props} />
);

export const SuccessButton: React.FC<Omit<ModernButtonProps, 'variant'>> = (props) => (
  <ModernButton variant="primary" hapticFeedback="success" icon="check-circle" {...props} />
);

export const OutlineButton: React.FC<Omit<ModernButtonProps, 'variant'>> = (props) => (
  <ModernButton variant="outline" hapticFeedback="light" {...props} />
);

export const IconButton: React.FC<Omit<ModernButtonProps, 'variant'> & { icon: string }> = ({
  title,
  icon,
  size = 'medium',
  ...props
}) => (
  <ModernButton
    variant="ghost"
    icon={icon}
    title=""
    size={size}
    hapticFeedback="light"
    style={styles.iconButton}
    {...props}
  />
);

const styles = StyleSheet.create({
  iconButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    minWidth: 40,
  },
});

export { ModernButton as Button };
export default ModernButton;