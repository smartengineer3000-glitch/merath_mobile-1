import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { Ionicons } from "../../lib/icons";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  visible: boolean;
  duration?: number;
  onDismiss?: () => void;
}

export function Toast({
  message,
  type = "info",
  visible,
  duration = 3000,
  onDismiss,
}: ToastProps) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => onDismiss?.());
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, duration, fadeAnim, onDismiss]);

  if (!visible) return null;

  const iconMap: Record<string, string> = {
    success: "checkmark-circle",
    error: "close-circle",
    warning: "warning",
    info: "information-circle",
  };

  const colorMap: Record<string, string> = {
    success: theme.colors.success.main,
    error: theme.colors.error.main,
    warning: theme.colors.warning.main,
    info: theme.colors.info.main,
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colorMap[type],
          borderRadius: theme.borderRadius.md,
          opacity: fadeAnim,
          bottom: insets.bottom + 16,
        },
      ]}
    >
      <Ionicons
        name={iconMap[type] as any}
        size={18}
        color={theme.colors.background.light}
      />
      <Text style={[styles.text, { color: theme.colors.background.light }]}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 9999,
    gap: 10,
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
});
