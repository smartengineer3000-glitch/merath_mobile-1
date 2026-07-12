import React from "react";
import { View, Text, StyleSheet, type ViewStyle, type StyleProp } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";

interface BadgeProps {
  count?: number;
  label?: string;
  color?: string;
  size?: "sm" | "md";
  style?: StyleProp<ViewStyle>;
}

export function Badge({ count, label, color, size = "md", style }: BadgeProps) {
  const { theme } = useAppTheme();
  const bgColor = color || theme.colors.primary.main;
  const hasContent = count !== undefined || label !== undefined;

  if (!hasContent) return null;

  return (
    <View
      style={[
        styles.badge,
        size === "sm" && styles.badgeSm,
        { backgroundColor: bgColor },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === "sm" && styles.textSm,
          { color: "#ffffff", fontFamily: theme.fontFamily.english },
        ]}
      >
        {label ?? count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 20,
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 16,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
  },
  textSm: {
    fontSize: 10,
  },
});
