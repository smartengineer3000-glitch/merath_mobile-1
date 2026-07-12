import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { Ionicons } from "../../lib/icons";

interface IconButtonProps {
  name: string;
  onPress?: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  badge?: number;
}

export function IconButton({
  name,
  onPress,
  size = 20,
  color,
  backgroundColor,
  badge,
}: IconButtonProps) {
  const { theme } = useAppTheme();
  const iconColor = color || theme.colors.neutral.dark200;
  const bgColor = backgroundColor || "transparent";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={[
        styles.button,
        {
          width: size + 20,
          height: size + 20,
          borderRadius: (size + 20) / 2,
          backgroundColor: bgColor,
        },
      ]}
    >
      <Ionicons name={name as any} size={size} color={iconColor} />
      {badge !== undefined && badge > 0 && (
        <View style={[styles.badge, { backgroundColor: theme.colors.error.main }]}>
          <Text style={[styles.badgeText, { color: "#ffffff" }]}>{badge > 99 ? "99+" : badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
  },
});
