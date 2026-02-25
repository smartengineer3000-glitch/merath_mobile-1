/**
 * @file components/ui/DesignSystemComponents.tsx
 * @description Reusable components built on the design system
 * Professional, consistent UI components following Material Design 3
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme, Spacing, BorderRadius, Shadows, Typography } from '../../lib/design/theme';

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createButtonStyles(theme);

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.neutral.light300;
    switch (variant) {
      case 'primary':
        return theme.colors.primary.main;
      case 'secondary':
        return theme.colors.secondary.main;
      case 'tertiary':
        return theme.colors.tertiary.main;
      case 'outlined':
        return 'transparent';
      default:
        return theme.colors.primary.main;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.neutral.light400;
    switch (variant) {
      case 'outlined':
        return theme.colors.primary.main;
      default:
        return '#ffffff';
    }
  };

  const buttonStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderWidth: variant === 'outlined' ? 2 : 0,
    borderColor: variant === 'outlined' ? theme.colors.primary.main : undefined,
    paddingHorizontal: size === 'small' ? 12 : size === 'large' ? 24 : 16,
    paddingVertical: size === 'small' ? 8 : size === 'large' ? 12 : 10,
    borderRadius: BorderRadius.md,
    ...Shadows.md,
  };

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.button, buttonStyle, style]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.buttonText, { color: getTextColor() }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// ============================================================================
// CARD COMPONENT
// ============================================================================

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  const { theme } = useTheme();
  const styles = createCardStyles(theme);

  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      style={[styles.card, style]}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </TouchableOpacity>
  );
};

// ============================================================================
// HEADING COMPONENT
// ============================================================================

interface HeadingProps {
  level: 1 | 2 | 3;
  children: string;
  style?: TextStyle;
}

export const Heading: React.FC<HeadingProps> = ({ level, children, style }) => {
  const { theme } = useTheme();

  const getHeadingStyle = (): TextStyle => {
    switch (level) {
      case 1:
        return { ...Typography.headline.large, color: theme.colors.primary.dark };
      case 2:
        return { ...Typography.headline.medium, color: theme.colors.primary.dark100 };
      case 3:
        return { ...Typography.headline.small, color: theme.colors.primary.main };
      default:
        return { ...Typography.headline.medium, color: theme.colors.primary.dark100 };
    }
  };

  return (
    <Text style={[getHeadingStyle(), style]}>
      {children}
    </Text>
  );
};

// ============================================================================
// BODY TEXT COMPONENT
// ============================================================================

interface BodyProps {
  children: string;
  size?: 'small' | 'medium' | 'large';
  style?: TextStyle;
}

export const Body: React.FC<BodyProps> = ({ children, size = 'medium', style }) => {
  const { theme } = useTheme();

  const getBodyStyle = (): TextStyle => {
    switch (size) {
      case 'small':
        return { ...Typography.body.small, color: theme.colors.neutral.dark200 };
      case 'large':
        return { ...Typography.body.large, color: theme.colors.neutral.dark200 };
      case 'medium':
      default:
        return { ...Typography.body.medium, color: theme.colors.neutral.dark200 };
    }
  };

  return (
    <Text style={[getBodyStyle(), style]}>
      {children}
    </Text>
  );
};

// ============================================================================
// DIVIDER COMPONENT
// ============================================================================

interface DividerProps {
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({ style }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: theme.colors.neutral.light200,
          marginVertical: Spacing.md,
        },
        style,
      ]}
    />
  );
};

// ============================================================================
// STYLES
// ============================================================================

const createButtonStyles = (theme: any) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
      minWidth: 120,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
  });

const createCardStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.neutral.white,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      ...Shadows.md,
    },
  });

export default {
  Button,
  Card,
  Heading,
  Body,
  Divider,
};
