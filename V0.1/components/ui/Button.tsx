import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

type ButtonVariant = "primary" | "secondary" | "outline" | "text" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  testID,
}: ButtonProps) {
  const { theme } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    const base = {
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: size === "sm" ? theme.spacing.sm : size === "lg" ? theme.spacing.xl : theme.spacing.md,
    };

    switch (variant) {
      case "primary":
        return {
          container: { ...base, backgroundColor: theme.colors.primary.main },
          text: { color: "#ffffff" },
        };
      case "secondary":
        return {
          container: { ...base, backgroundColor: theme.colors.secondary.lighter },
          text: { color: theme.colors.secondary.main },
        };
      case "outline":
        return {
          container: { ...base, backgroundColor: "transparent", borderWidth: theme.borderWidth.thin, borderColor: theme.colors.primary.main },
          text: { color: theme.colors.primary.main },
        };
      case "text":
        return {
          container: { ...base, backgroundColor: "transparent" },
          text: { color: theme.colors.primary.main },
        };
      case "danger":
        return {
          container: { ...base, backgroundColor: theme.colors.error.main },
          text: { color: "#ffffff" },
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <AnimatedTouchable
      testID={testID}
      activeOpacity={0.8}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      accessible
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={[
        styles.container,
        variantStyles.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyles.text.color} />
      ) : (
        <Text
          style={[
            styles.text,
            variantStyles.text,
            size === "sm" && styles.textSm,
            size === "lg" && styles.textLg,
            disabled && styles.disabledText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
  textSm: {
    fontSize: 12,
  },
  textLg: {
    fontSize: 16,
  },
  disabledText: {
    opacity: 0.7,
  },
});
